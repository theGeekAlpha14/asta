const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient, PutCommand } = require("@aws-sdk/lib-dynamodb");
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

    const { name, age, dob, email, phone, contacts, password } = body;

    if (!email || !password) {
        return {
            statusCode: 400,
            headers: { "Access-Control-Allow-Origin": "*" },
            body: JSON.stringify({ error: "Email and password are required" })
        };
    }

    try {
        // Simple registration: Just save to DynamoDB
        await dynamo.send(new PutCommand({
            TableName: process.env.USER_TABLE,
            Item: {
                email,
                password: hashPassword(password),
                name,
                age,
                dob,
                phone,
                contacts,
                registeredAt: new Date().toISOString()
            }
        }));

        return {
            statusCode: 200,
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                message: "Registration Successful",
                user: { email, name, phone, contacts }
            })
        };
    } catch (error) {
        console.error("Registration Error:", error);
        return {
            statusCode: 500,
            headers: { "Access-Control-Allow-Origin": "*" },
            body: JSON.stringify({ error: "Internal Server Error during registration" })
        };
    }
};
