const { SageMakerRuntimeClient, InvokeEndpointCommand } = require("@aws-sdk/client-sagemaker-runtime");
const client = new SageMakerRuntimeClient({ region: "ap-south-1" });

/**
 * ASTA Safety Intelligence Engine (The Brain)
 * Dispatches safety data to Heatmap, Router, and Companion
 */
exports.handler = async (event) => {
    const { action, location, destination, route_nodes } = JSON.parse(event.body);

    // 1. Prepare context for our ST-GNN Model (tensor-ready)
    const nodes = (action === 'heatmap' ? getNearbyNodes(location) : route_nodes) || [];
    const context = {
        timestamp: new Date().toISOString(),
        hour: new Date().getHours(),
        weather: await getRealTimeWeather(location),
        nodes: nodes,
        adj: Array(nodes.length).fill().map((_, i) => Array(nodes.length).fill(0).map((_, j) => i === j ? 1 : 0))
    };

    // 2. Call the SageMaker ST-GNN Endpoint
    const command = new InvokeEndpointCommand({
        EndpointName: 'ASTA-SafetyBrain-Endpoint',
        ContentType: 'application/json',
        Body: JSON.stringify(context)
    });

    try {
        const response = await client.send(command);
        const safetyData = JSON.parse(Buffer.from(response.Body).toString('utf8'));

        // 3. Transform output based on the calling Feature
        switch (action) {
            case 'heatmap':
                return formatForHeatmap(safetyData);

            case 'route_planner':
                return calculateSafestPath(safetyData, location, destination);

            case 'ai_companion':
                return detectProactiveThreats(safetyData);

            default:
                return { statusCode: 400, headers: { "Access-Control-Allow-Origin": "*" }, body: 'Invalid Action' };
        }
    } catch (error) {
        console.warn("SageMaker Endpoint unreachable, falling back to simulated logic for local dev:", error.message);
        
        // Simulating the ML response for emulator testing
        if (action === 'ai_companion') {
            return {
                statusCode: 200,
                headers: { "Access-Control-Allow-Origin": "*", "Content-Type": "application/json" },
                body: JSON.stringify({
                    is_anomaly: false,
                    alert_msg: "Safety Engine Offline. Stability Unknown.",
                    next_node_safety: 5.0
                })
            };
        }
        
        return { statusCode: 500, headers: { "Access-Control-Allow-Origin": "*" }, body: JSON.stringify({ error: "Brain Offline" }) };
    }
};

// --- Helper Logic (Synchronized with inference_handler.py) ---

function formatForHeatmap(data) {
    return {
        statusCode: 200,
        headers: { "Access-Control-Allow-Origin": "*", "Content-Type": "application/json" },
        body: JSON.stringify({
            area_score: data.overall_score,
            grid: data.node_scores
        })
    };
}

function detectProactiveThreats(data) {
    // Correctly mapping to ML model's 'is_anomaly' output
    return {
        statusCode: 200,
        headers: { "Access-Control-Allow-Origin": "*", "Content-Type": "application/json" },
        body: JSON.stringify({
            is_anomaly: data.is_anomaly,
            alert_msg: data.alert_msg,
            next_node_safety: data.overall_score
        })
    };
}

async function getRealTimeWeather(loc) { /* Mock weather integration */ return "clear"; }
function getNearbyNodes(loc) { /* Mock node fetching */ return [/* node IDs */]; }
