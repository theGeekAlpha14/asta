Write-Host "Starting ASTA Deployment Orchestrator..." -ForegroundColor Cyan

# 0. Set Paths
$ROOT = $PSScriptRoot
if (-not $ROOT) { $ROOT = Get-Location }
$BACKEND_DIR = Join-Path $ROOT "backend"
$ML_DIR = Join-Path $ROOT "ml"
$MOBILE_DIR = Join-Path $ROOT "mobile"

# 1. Locate Python (Prefer venv)
$PYTHON_EXE = "python"
if (Test-Path "$ROOT\venv\Scripts\python.exe") {
    $PYTHON_EXE = "$ROOT\venv\Scripts\python.exe"
    Write-Host "Using Virtual Environment Python: $PYTHON_EXE" -ForegroundColor Green
}

# 2. AWS Identity
$ACCOUNT_ID = (aws sts get-caller-identity --query Account --output text)
if (-not $ACCOUNT_ID) {
    Write-Host "Error: Run 'aws configure' first." -ForegroundColor Red
    exit
}

# 3. SAM Backend
Write-Host "Deploying SAM Backend..." -ForegroundColor Yellow
Push-Location $BACKEND_DIR
sam build
sam deploy --stack-name asta-backend --region ap-south-1 --resolve-s3 --capabilities CAPABILITY_IAM --no-confirm-changeset --no-fail-on-empty-changeset
if ($LASTEXITCODE -ne 0) {
    Write-Host "Backend Deployment Failed." -ForegroundColor Red
    Pop-Location ; exit
}
Pop-Location

# 4. Update Mobile & SageMaker Role
$API_URL = (aws cloudformation describe-stacks --stack-name asta-backend --region ap-south-1 --query "Stacks[0].Outputs[?OutputKey=='AstaApiUrl'].OutputValue" --output text)
$apiFile = Join-Path $MOBILE_DIR "src/services/api.ts"
if (Test-Path $apiFile) {
    (Get-Content $apiFile) -replace "const BASE_URL = '.*'", "const BASE_URL = '$API_URL'" | Set-Content $apiFile
}

$ROLE_ARN = "arn:aws:iam::$ACCOUNT_ID:role/service-role/AmazonSageMaker-ExecutionRole"
$deployFile = Join-Path $ML_DIR "deploy_endpoint.py"
if (Test-Path $deployFile) {
    $content = Get-Content $deployFile
    $content -replace '^ROLE = ".*"', "ROLE = `"$ROLE_ARN`"" | Set-Content $deployFile
}

# 5. Deploy SageMaker Brain
Write-Host "Deploying SageMaker Brain..." -ForegroundColor Yellow
Push-Location $ML_DIR
& $PYTHON_EXE deploy_endpoint.py
Pop-Location

Write-Host "ASTA IS LIVE!" -ForegroundColor Green
