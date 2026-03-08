import torch
import json
import os
from asta_gnn_model import AstaSafetyBrain

def model_fn(model_dir):
    """
    Loads the trained ST-GNN model from the model directory.
    """
    # Initialize the model architecture
    model = AstaSafetyBrain(node_features=3, hidden_dim=64, seq_len=1)

    # Load the state dictionary
    with open(os.path.join(model_dir, 'model.pth'), 'rb') as f:
        model.load_state_dict(torch.load(f))

    model.eval()
    return model

def input_fn(request_body, request_content_type):
    """
    Pre-processes the incoming JSON request into tensors.
    Expecting: { 'nodes': [[lighting, crime, crowd], ...], 'adj': [[...], ...] }
    """
    if request_content_type == 'application/json':
        data = json.loads(request_body)
        nodes = torch.tensor(data['nodes'], dtype=torch.float32).unsqueeze(0) # [Batch=1, Nodes, Features]
        adj = torch.tensor(data['adj'], dtype=torch.float32)
        return nodes, adj
    else:
        raise ValueError("Unsupported content type: " + request_content_type)

def predict_fn(input_data, model):
    """
    Performs inference using the loaded model.
    """
    nodes, adj = input_data
    with torch.no_grad():
        output = model(nodes, adj)
    return output

def output_fn(prediction, content_type):
    """
    Post-processes the model output into the EXACT JSON response structure 
    required by the React Native frontend (Route Planner / Companion).
    """
    scores = prediction.squeeze().tolist()
    if not isinstance(scores, list):
        scores = [scores] 

    overall = sum(scores) / len(scores) if scores else 0
    
    # Generate structured UI payloads directly from ML predictions
    response = {
        "safety_scores": scores,
        "overall_score": overall,
        "is_anomaly": bool(overall < 7.0),
        "alert_msg": "AI detects risk spike ahead." if overall < 7.0 else "Path secure.",
        "routes": [
            {
                "id": "SAFEST",
                "name": "Safety-First Path (AI Generated)",
                "description": f"ST-GNN Calculated Safety: {overall:.1f}/10",
                "mode": "WALK",
                "safety_score": float(f"{overall:.1f}"),
                "travel_time": "18 min",
                "distance": "1.4 km",
                "polyline": "encoded_polyline_here",
                "node_scores": scores
            }
        ]
    }
    return json.dumps(response)

# --- Local Execution Support for Android Emulator ---
if __name__ == '__main__':
    import sys
    try:
        # For local demo, we just generate raw structural data to pipe to Node.js
        # Since we don't have the weights downloaded in this environment, we mock the tensor prediction
        # but output via the EXACT production pipeline.
        mock_pred = torch.tensor([[[8.2], [9.1], [6.5], [8.8]]])
        print(output_fn(mock_pred, "application/json"))
    except Exception as e:
        print(json.dumps({"error": str(e)}))
