#!/bin/bash

echo "🚀 Starting ASTA Deployment Orchestrator..."

# 1. Get AWS Account ID
ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
REGION="ap-south-1" # Mumbai

if [ -z "$ACCOUNT_ID" ]; then
    echo "❌ Error: Could not fetch AWS Account ID. Please run 'aws configure'."
    exit 1
fi

echo "✅ Detected Account ID: $ACCOUNT_ID"

# 2. Deploy SAM Backend
echo "📦 Building and Deploying SAM Backend..."
cd backend
sam build
sam deploy --stack-name asta-backend --region $REGION --resolve-s3 --capabilities CAPABILITY_IAM --no-confirm-changeset

# 3. Fetch the API Gateway URL
API_URL=$(aws cloudformation describe-stacks --stack-name asta-backend --region $REGION --query "Stacks[0].Outputs[?OutputKey=='AstaApiUrl'].OutputValue" --output text)

echo "✅ Backend Live at: $API_URL"

# 4. Update Mobile App api.ts automatically
echo "📱 Syncing API URL with Mobile App..."
# Using sed to update the BASE_URL in api.ts
sed -i "s|const BASE_URL = '.*'|const BASE_URL = '$API_URL'|" ../mobile/src/services/api.ts

# 5. Update SageMaker deploy_endpoint.py with real Role ARN
echo "🧠 Updating SageMaker Deployment Script..."
ROLE_ARN="arn:aws:iam::$ACCOUNT_ID:role/service-role/AmazonSageMaker-ExecutionRole"
sed -i "s|ROLE = \".*\"|ROLE = \"$ROLE_ARN\"|" ../ml/deploy_endpoint.py

# 6. Run SageMaker Deployment
echo "🚀 Deploying ST-GNN to SageMaker Endpoint..."
cd ../ml
python deploy_endpoint.py

echo "🎉 ASTA IS LIVE! You can now run the Mobile App."
