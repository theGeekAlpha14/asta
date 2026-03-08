import boto3
import time
import os

# --- AWS CONFIGURATION (HARDCODED FOR STABILITY) ---
ACCOUNT_ID = "824708342344"
ROLE = f"arn:aws:iam::{ACCOUNT_ID}:role/ASTA-SageMaker-Execution-Role"
REGION = "ap-south-1"
ENDPOINT_NAME = "ASTA-SafetyBrain-Endpoint"
MODEL_NAME = f"ASTA-GNN-Model-{int(time.time())}"
CONFIG_NAME = f"ASTA-GNN-Config-{int(time.time())}"

# The S3 path created by complete_brain_deploy.py
MODEL_DATA = f"s3://asta-safety-brain-{ACCOUNT_ID}/model/model.tar.gz"

# PyTorch 2.0.1 Image URI for ap-south-1 (Mumbai)
IMAGE_URI = "763104351884.dkr.ecr.ap-south-1.amazonaws.com/pytorch-inference:2.0.1-cpu-py310"

sm_client = boto3.client('sagemaker', region_name=REGION)

def deploy():
    print(f"🚀 Creating Model: {MODEL_NAME}")
    sm_client.create_model(
        ModelName=MODEL_NAME,
        PrimaryContainer={
            'Image': IMAGE_URI,
            'ModelDataUrl': MODEL_DATA,
            'Environment': {
                'SAGEMAKER_PROGRAM': 'inference_handler.py',
                'SAGEMAKER_SUBMIT_DIRECTORY': MODEL_DATA,
                'SAGEMAKER_CONTAINER_LOG_LEVEL': '20',
                'SAGEMAKER_REGION': REGION
            }
        },
        ExecutionRoleArn=ROLE
    )

    print(f"⚙️ Creating Endpoint Config: {CONFIG_NAME}")
    sm_client.create_endpoint_config(
        EndpointConfigName=CONFIG_NAME,
        ProductionVariants=[{
            'VariantName': 'AllTraffic',
            'ModelName': MODEL_NAME,
            'InitialInstanceCount': 1,
            'InstanceType': 'ml.t2.medium',
        }]
    )

    print(f"📡 Creating/Updating Endpoint: {ENDPOINT_NAME}")
    try:
        sm_client.create_endpoint(
            EndpointName=ENDPOINT_NAME,
            EndpointConfigName=CONFIG_NAME
        )
    except sm_client.exceptions.ClientError:
        print("🔄 Updating existing endpoint...")
        sm_client.update_endpoint(
            EndpointName=ENDPOINT_NAME,
            EndpointConfigName=CONFIG_NAME
        )

    print("⏳ Waiting for endpoint to be in service (5-10 mins)...")
    waiter = sm_client.get_waiter('endpoint_in_service')
    waiter.wait(EndpointName=ENDPOINT_NAME)

    print(f"✅ ASTA Brain is LIVE at endpoint: {ENDPOINT_NAME}")

if __name__ == "__main__":
    deploy()
