const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient, GetCommand } = require("@aws-sdk/lib-dynamodb");
const crypto = require('crypto');

const dbClient = new DynamoDBClient({ region: "ap-south-1" });
const dynamo = DynamoDBDocumentClient.from(dbClient);

function hashPassword(password) {
    return crypto.createHash('sha256').update(password).digest('hex');
}

exports.handler = async (event) => {
    let body;
    try {
        body = JSON.parse(event.body || "{}");
    } catch (e) {
        return { statusCode: 400, body: JSON.stringify({ error: "Invalid JSON" }) };
    }

    const { email, password } = body;

    if (!email || !password) {
        return {
            statusCode: 400,
            headers: { "Access-Control-Allow-Origin": "*" },
            body: JSON.stringify({ error: "Email and password are required" })
        };
    }

    try {
        const getCommand = new GetCommand({
            TableName: process.env.USER_TABLE,
            Key: { email }
        });

        const { Item: user } = await dynamo.send(getCommand);

        if (!user || user.password !== hashPassword(password)) {
            return {
                statusCode: 401,
                headers: { "Access-Control-Allow-Origin": "*" },
                body: JSON.stringify({ error: "Invalid credentials" })
            };
        }

        // Direct Login Success - No OTP
        return {
            statusCode: 200,
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                message: "Login successful",
                user: {
                    email: user.email,
                    name: user.name,
                    phone: user.phone,
                    contacts: user.contacts
                }
            })
        };

    } catch (error) {
        console.error("Login Error:", error);
        return {
            statusCode: 500,
            headers: { "Access-Control-Allow-Origin": "*" },
            body: JSON.stringify({ error: "Internal server error during login" })
        };
    }
};
