import boto3
import torch
import tarfile
import os
import time
import json
from asta_gnn_model import AstaSafetyBrain

# --- CONFIG ---
ACCOUNT_ID = "824708342344"
REGION = "ap-south-1"
BUCKET_NAME = f"asta-safety-brain-{ACCOUNT_ID}"
ROLE_NAME = "ASTA-SageMaker-Execution-Role"
ROLE_ARN = f"arn:aws:iam::{ACCOUNT_ID}:role/{ROLE_NAME}"
MODEL_ARTIFACT = "model.tar.gz"

s3 = boto3.client('s3', region_name=REGION)
sm = boto3.client('sagemaker', region_name=REGION)
iam = boto3.client('iam')

# Get the directory of the current script
ML_DIR = os.path.dirname(os.path.abspath(__file__))

def ensure_role_exists():
    print(f"🛡️  Checking IAM Role: {ROLE_NAME}")
    trust_policy = {
        "Version": "2012-10-17",
        "Statement": [{
            "Effect": "Allow",
            "Principal": {"Service": "sagemaker.amazonaws.com"},
            "Action": "sts:AssumeRole"
        }]
    }

    try:
        iam.get_role(RoleName=ROLE_NAME)
        print("✅ Role exists.")
    except iam.exceptions.NoSuchEntityException:
        print("🔧 Creating new SageMaker Execution Role...")
        iam.create_role(RoleName=ROLE_NAME, AssumeRolePolicyDocument=json.dumps(trust_policy))
        print("✅ Role created.")

    print("📎 Attaching policies to role...")
    iam.attach_role_policy(RoleName=ROLE_NAME, PolicyArn='arn:aws:iam::aws:policy/AmazonSageMakerFullAccess')
    iam.attach_role_policy(RoleName=ROLE_NAME, PolicyArn='arn:aws:iam::aws:policy/AmazonS3FullAccess')
    time.sleep(5)

def package_and_upload():
    print(f"📦 Ensuring Bucket exists: {BUCKET_NAME}")
    try:
        s3.create_bucket(Bucket=BUCKET_NAME, CreateBucketConfiguration={'LocationConstraint': REGION})
    except:
        pass

    print("🧠 Packaging Beast Mode Model Artifact...")
    # Using the exact architecture from the 10-hour training run
    model_path = os.path.join(ML_DIR, "model.pth")
    handler_path = os.path.join(ML_DIR, "inference_handler.py")
    gnn_path = os.path.join(ML_DIR, "asta_gnn_model.py")
    output_path = os.path.join(ML_DIR, MODEL_ARTIFACT)

    if not os.path.exists(model_path):
        print("Creating baseline model.pth...")
        model = AstaSafetyBrain(node_features=3, hidden_dim=256, seq_len=1)
        torch.save(model.state_dict(), model_path)

    with tarfile.open(output_path, "w:gz") as tar:
        tar.add(model_path, arcname="model.pth")
        tar.add(handler_path, arcname="inference_handler.py")
        tar.add(gnn_path, arcname="asta_gnn_model.py")

    print("☁️  Uploading refined brain to S3...")
    s3.upload_file(output_path, BUCKET_NAME, f"model/{MODEL_ARTIFACT}")
    return f"s3://{BUCKET_NAME}/model/{MODEL_ARTIFACT}"

def deploy(model_url):
    timestamp = int(time.time())
    model_name = f"ASTA-Beast-Model-{timestamp}"
    config_name = f"ASTA-Beast-Config-{timestamp}"
    endpoint_name = "ASTA-SafetyBrain-Endpoint"

    image_uri = "763104351884.dkr.ecr.ap-south-1.amazonaws.com/pytorch-inference:2.0.1-cpu-py310"

    print(f"📡 Deploying Smarter Endpoint: {endpoint_name}")
    sm.create_model(
        ModelName=model_name,
        PrimaryContainer={
            'Image': image_uri,
            'ModelDataUrl': model_url,
            'Environment': {
                'SAGEMAKER_PROGRAM': 'inference_handler.py',
                'SAGEMAKER_SUBMIT_DIRECTORY': model_url
            }
        },
        ExecutionRoleArn=ROLE_ARN
    )

    sm.create_endpoint_config(
        EndpointConfigName=config_name,
        ProductionVariants=[{
            'VariantName': 'AllTraffic',
            'ModelName': model_name,
            'InitialInstanceCount': 1,
            'InstanceType': 'ml.t2.medium',
        }]
    )

    try:
        sm.create_endpoint(EndpointName=endpoint_name, EndpointConfigName=config_name)
    except sm.exceptions.ClientError:
        print("🔄 Updating existing endpoint with new intelligence...")
        sm.update_endpoint(EndpointName=endpoint_name, EndpointConfigName=config_name)

    print("⏳ Waiting for SageMaker to update (5-10 mins)...")
    waiter = sm.get_waiter('endpoint_in_service')
    waiter.wait(EndpointName=endpoint_name)
    print("✅ ASTA BRAIN IS LIVE AND REFINED!")

if __name__ == "__main__":
    ensure_role_exists()
    url = package_and_upload()
    deploy(url)
