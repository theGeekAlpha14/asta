import torch
import torch.nn as nn
import torch.optim as optim
import json
import os
import argparse
import numpy as np
from asta_gnn_model import AstaSafetyBrain

def load_data(data_dir):
    with open(os.path.join(data_dir, 'processed_city_graph.json'), 'r') as f:
        data = json.load(f)
    return data

def train(args):
    # 1. Load Data
    data = load_data(args.data_dir)

    # We'll combine Mumbai and Pune for a single robust "Urban Safety Brain"
    all_nodes = []
    adj_matrices = []

    for district in data:
        nodes = data[district]['nodes']
        edges = data[district]['edges']
        num_nodes = len(nodes)

        # Features: [lighting, crime_index, crowd_density]
        features = []
        for i in range(num_nodes):
            n = nodes[str(i)]
            features.append([n['lighting'], n['crime_index'], n['crowd_density']])

        all_nodes.append(torch.tensor(features, dtype=torch.float32))

        # Adjacency Matrix
        adj = torch.eye(num_nodes)
        for u, v in edges:
            adj[u, v] = 1.0
            adj[v, u] = 1.0
        adj_matrices.append(adj)

    # 2. Initialize Model
    # Input: 3 features (lighting, crime, crowd)
    model = AstaSafetyBrain(node_features=3, hidden_dim=64, seq_len=1)
    optimizer = optim.Adam(model.parameters(), lr=args.lr)
    criterion = nn.MSELoss()

    model.train()
    for epoch in range(args.epochs):
        total_loss = 0
        for i in range(len(all_nodes)):
            optimizer.zero_grad()

            x = all_nodes[i].unsqueeze(0) # [Batch=1, Nodes, Features]
            adj = adj_matrices[i]

            # Predict Safety Scores (0-10)
            output = model(x, adj)

            # Target (Simulated for training: inversely proportional to crime_index)
            target = (1.0 - all_nodes[i][:, 1]) * 10.0
            target = target.unsqueeze(0).unsqueeze(-1)

            loss = criterion(output, target)
            loss.backward()
            optimizer.step()
            total_loss += loss.item()

        if epoch % 10 == 0:
            print(f"Epoch {epoch} | Loss: {total_loss/len(all_nodes):.4f}")

    # 3. Save Model
    path = os.path.join(args.model_dir, 'model.pth')
    torch.save(model.state_dict(), path)
    print(f"Model saved to {path}")

if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument('--epochs', type=int, default=100)
    parser.add_argument('--lr', type=float, default=0.001)
    parser.add_argument('--data-dir', type=str, default=os.environ.get('SM_CHANNEL_TRAIN', '.'))
    parser.add_argument('--model-dir', type=str, default=os.environ.get('SM_MODEL_DIR', './model'))

    args = parser.parse_args()

    if not os.path.exists(args.model_dir):
        os.makedirs(args.model_dir)

    train(args)
