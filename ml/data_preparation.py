import numpy as np
import pandas as pd
import json
import networkx as nx
from datetime import datetime

# --- BOUNDARIES: PUNE & MUMBAI ---
# Approximate bounding boxes [min_lat, min_lon, max_lat, max_lon]
DISTRICT_BOUNDS = {
    "Mumbai": [18.89, 72.77, 19.27, 72.98],
    "Pune": [18.42, 73.75, 18.64, 73.95]
}

def generate_district_graph(district_name, bounds, num_nodes=200):
    """
    Generates a synthetic street network graph for a specific district.
    In production, this would use osmnx to fetch real OpenStreetMap data.
    """
    min_lat, min_lon, max_lat, max_lon = bounds

    # 1. Create Nodes (Intersections)
    lats = np.random.uniform(min_lat, max_lat, num_nodes)
    lons = np.random.uniform(min_lon, max_lon, num_nodes)

    G = nx.Graph()
    for i in range(num_nodes):
        # Assign baseline safety attributes
        # lighting: 0 (dark) to 1 (bright)
        # crime_index: 0 (safe) to 1 (high crime)
        # crowd_density: 0 (empty) to 1 (busy)
        G.add_node(i,
                   lat=float(lats[i]),
                   lon=float(lons[i]),
                   lighting=float(np.random.beta(5, 2)), # Usually well-lit in urban centers
                   crime_index=float(np.random.beta(2, 5)), # Usually low crime
                   crowd_density=float(np.random.rand())
        )

    # 2. Create Edges (Roads)
    # Connect nearest neighbors to simulate a street network
    for i in range(num_nodes):
        # Find 3 nearest nodes to create a connected graph
        dist = np.sqrt((lats - lats[i])**2 + (lons - lons[i])**2)
        nearest = np.argsort(dist)[1:4] # Skip self
        for neighbor in nearest:
            G.add_edge(i, int(neighbor), weight=float(dist[neighbor]))

    return G

def prepare_training_data():
    """
    Compiles graphs for both districts and saves them for the ST-GNN.
    """
    full_network = {}

    for district, bounds in DISTRICT_BOUNDS.items():
        print(f"Generating Safety Graph for {district}...")
        G = generate_district_graph(district, bounds)

        # Convert to dictionary for storage
        nodes_data = {n: G.nodes[n] for n in G.nodes()}
        edges_data = list(G.edges())

        full_network[district] = {
            "nodes": nodes_data,
            "edges": edges_data
        }

    # Save as JSON for SageMaker
    output_path = "F:/Learning_and_more/Hackathons/AI for Bharat by AWS/ml/processed_city_graph.json"
    with open(output_path, "w") as f:
        json.dump(full_network, f)

    print(f"Data Prepared: {output_path}")

if __name__ == "__main__":
    prepare_training_data()
