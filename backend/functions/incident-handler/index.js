const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient, PutCommand } = require("@aws-sdk/lib-dynamodb");

const dbClient = new DynamoDBClient({ region: "ap-south-1" });
const dynamo = DynamoDBDocumentClient.from(dbClient);

exports.handler = async (event) => {
    const body = JSON.parse(event.body || "{}");
    const { incident_type, description, location, severity, is_anonymous } = body;
    const incidentId = `fir_${Date.now()}`;

    // Logic to find nearest station based on location (simulated for demo)
    const nearestStation = "Bandra West Police Station";

    const putCommand = new PutCommand({
        TableName: process.env.INCIDENT_TABLE,
        Item: {
            incidentId,
            type: 'FIR_ANONYMOUS',
            incident_type,
            description,
            location,
            severity,
            nearestStation,
            status: 'LODGED',
            timestamp: new Date().toISOString(),
            // User identity is NOT stored here if is_anonymous is true
        }
    });

    try {
        await dynamo.send(putCommand);
        return {
            statusCode: 200,
            headers: { "Access-Control-Allow-Origin": "*" },
            body: JSON.stringify({
                message: "Anonymous FIR Lodged",
                incidentId,
                dispatched_to: nearestStation
            })
        };
    } catch (error) {
        console.error("FIR Error:", error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: "Failed to lodge FIR" })
        };
    }
};
