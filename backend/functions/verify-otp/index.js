const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient, GetCommand, DeleteCommand } = require("@aws-sdk/lib-dynamodb");

const dbClient = new DynamoDBClient({ region: "ap-south-1" });
const dynamo = DynamoDBDocumentClient.from(dbClient);

exports.handler = async (event) => {
    const body = JSON.parse(event.body || "{}");
    const { email, otp } = body;

    if (!email || !otp) {
        return {
            statusCode: 400,
            headers: { "Access-Control-Allow-Origin": "*" },
            body: JSON.stringify({ error: "Email and OTP are required" })
        };
    }

    try {
        const getCommand = new GetCommand({
            TableName: process.env.OTP_TABLE,
            Key: { id: email }
        });

        const { Item: storedOtp } = await dynamo.send(getCommand);

        if (!storedOtp || storedOtp.otp !== otp) {
            return {
                statusCode: 401,
                headers: { "Access-Control-Allow-Origin": "*" },
                body: JSON.stringify({ error: "Invalid or expired OTP" })
            };
        }

        // OTP is valid, delete it so it can't be reused
        await dynamo.send(new DeleteCommand({
            TableName: process.env.OTP_TABLE,
            Key: { id: email }
        }));

        // Fetch user data to return
        const userGet = await dynamo.send(new GetCommand({
            TableName: process.env.USER_TABLE,
            Key: { email }
        }));

        return {
            statusCode: 200,
            headers: { "Access-Control-Allow-Origin": "*" },
            body: JSON.stringify({
                message: "Authentication successful",
                user: {
                    email: userGet.Item.email,
                    name: userGet.Item.name,
                    phone: userGet.Item.phone,
                    contacts: userGet.Item.contacts
                }
            })
        };

    } catch (error) {
        console.error("Verification Error:", error);
        return {
            statusCode: 500,
            headers: { "Access-Control-Allow-Origin": "*" },
            body: JSON.stringify({ error: "Verification failed" })
        };
    }
};
