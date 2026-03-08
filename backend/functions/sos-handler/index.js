const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient, PutCommand } = require("@aws-sdk/lib-dynamodb");
const { SNSClient, PublishCommand } = require("@aws-sdk/client-sns");

const dbClient = new DynamoDBClient({ region: "ap-south-1" });
const dynamo = DynamoDBDocumentClient.from(dbClient);
const snsClient = new SNSClient({ region: "ap-south-1" });

exports.handler = async (event) => {
    const body = JSON.parse(event.body || "{}");
    const { userId, location, severity } = body;
    const incidentId = `sos_${Date.now()}`;

    // 1. Log incident to DynamoDB
    const putCommand = new PutCommand({
        TableName: process.env.INCIDENT_TABLE,
        Item: {
            incidentId,
            userId,
            location,
            severity,
            status: 'ACTIVE',
            timestamp: new Date().toISOString()
        }
    });

    try {
        await dynamo.send(putCommand);

        // 2. Trigger SMS Alert via SNS (Simplified for Demo)
        // const publishCommand = new PublishCommand({
        //     Message: `🚨 EMERGENCY: ASTA SOS triggered by ${userId}. Location: https://maps.google.com/?q=${location.lat},${location.lng}`,
        //     PhoneNumber: '+91XXXXXXXXXX'
        // });
        // await snsClient.send(publishCommand);

        return {
            statusCode: 200,
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                message: "SOS Dispatched",
                incidentId: incidentId
            })
        };
    } catch (error) {
        console.error("SOS Handler Error:", error);
        return {
            statusCode: 500,
            headers: { "Access-Control-Allow-Origin": "*" },
            body: JSON.stringify({ error: "Failed to dispatch SOS" })
        };
    }
};
