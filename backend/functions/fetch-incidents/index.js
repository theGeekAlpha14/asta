const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient, ScanCommand } = require("@aws-sdk/lib-dynamodb");

const dbClient = new DynamoDBClient({ region: "ap-south-1" });
const dynamo = DynamoDBDocumentClient.from(dbClient);

exports.handler = async (event) => {
    try {
        const scanCommand = new ScanCommand({
            TableName: process.env.INCIDENT_TABLE
        });

        const result = await dynamo.send(scanCommand);

        return {
            statusCode: 200,
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                incidents: result.Items.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
            })
        };
    } catch (error) {
        console.error("Fetch Incidents Error:", error);
        return {
            statusCode: 500,
            headers: { "Access-Control-Allow-Origin": "*" },
            body: JSON.stringify({ error: "Failed to fetch incidents" })
        };
    }
};
