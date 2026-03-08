# ASTA Technical Context Pack: Proof of Work

This document contains core technical references for the ASTA Safety Intelligence platform. Use these snippets and architectural details to provide "Proof of Work" in your presentation.

---

## 1. Machine Learning: The ST-GNN Architecture
**Why this is superior:** Unlike standard regression models, our Spatio-Temporal Graph Neural Network understands the *topological* nature of urban safety.

```python
class AstaSafetyBrain(nn.Module):
    def __init__(self, node_features, hidden_dim, seq_len):
        super(AstaSafetyBrain, self).__init__()
        # 1. Spatial Processing: Captures risk flow between neighboring city nodes
        self.spatial_conv = ST_GNN_Layer(node_features, hidden_dim)

        # 2. Temporal Processing: Analyzes hourly safety trends using LSTM
        self.temporal_processor = nn.LSTM(hidden_dim, hidden_dim, batch_first=True)

        # 3. Output: 0-10 Safety Index prediction per node
        self.fc = nn.Sequential(
            nn.Linear(hidden_dim, 1),
            nn.Sigmoid()
        )
```

---

## 2. Hardware Acceleration: RTX 4070 Training
**Scale of Data:** We processed millions of spatio-temporal node states by expanding 2023-2024 Maharashtra crime datasets.

- **Device:** `NVIDIA GeForce RTX 4070 Laptop GPU`
- **Logic:** Incremental learning on a 10,000-node city graph.
- **Performance:** Achieved high-fidelity risk baselines for Mumbai and Pune districts in under 60 minutes of intensive GPU compute.

---

## 3. Cloud Infrastructure: AWS Serverless Stack
**Latency Goal:** < 200ms response time for proactive alerts in the ap-south-1 (Mumbai) region.

- **Compute:** AWS Lambda (Node.js 22 + AWS SDK v3)
- **Database:** Amazon DynamoDB (Pay-per-request, sub-10ms latency)
- **Intelligence Host:** Amazon SageMaker Real-Time Inference
- **Deployment:** Infrastructure as Code using AWS SAM (Serverless Application Model)

---

## 4. Geofencing: Strict Boundary Logic
**Coverage:** Precise GeoJSON-based verification for Mumbai, Pune, and Pimpri-Chinchwad.

- **Algorithm:** Point-in-Polygon (PIP) implementation in the Safety-Score Lambda.
- **User Integrity:** Prevents "gimmick" data display by strictly validating every GPS coordinate against the official Maharashtra district boundaries.

---

## 5. Security & Privacy: Anonymous FIR System
**Compliance:** Anonymous reporting ensures victim safety.

- **Hashing:** SHA-256 password security.
- **Anonymity:** Registration data is decoupled from Incident reports using unique GUIDs.
- **Authorities:** Incidents are automatically mapped to the nearest verified Police Station node in the city graph.
