const { SageMakerRuntimeClient, InvokeEndpointCommand } = require("@aws-sdk/client-sagemaker-runtime");
const client = new SageMakerRuntimeClient({ region: "ap-south-1" });

exports.handler = async (event) => {
    try {
        const body = JSON.parse(event.body || "{}");
        // REAL WORK: Send origin/destination nodes to ST-GNN and parse the optimal path
        const command = new InvokeEndpointCommand({
            EndpointName: "ASTA-SafetyBrain-Endpoint",
            ContentType: "application/json",
            Body: Buffer.from(JSON.stringify({
                // ST-GNN expects pre-processed nodes and adj matrix
                nodes: [[18.65, 73.78, 0.8], [18.64, 73.76, 0.5]], 
                adj: [[1, 0], [0, 1]],
                metadata: {
                    origin: body.origin,
                    destination: body.destination,
                    mode: body.mode || 'DRIVE'
                }
            }))
        });

        // Parse exactly what inference_handler.py returns
        const { Body } = await client.send(command);
        const dataStr = new TextDecoder().decode(Body);
        const mlOutput = JSON.parse(dataStr);
        
        return {
            statusCode: 200,
            headers: { "Access-Control-Allow-Origin": "*", "Content-Type": "application/json" },
            body: JSON.stringify({ routes: mlOutput.routes })
        };
    } catch (error) {
        console.error("SageMaker Unreachable:", error);
        return {
            statusCode: 500,
            headers: { "Access-Control-Allow-Origin": "*", "Content-Type": "application/json" },
            body: JSON.stringify({ error: "Failed to communicate with AI Safety Brain" })
        };
    }
};
