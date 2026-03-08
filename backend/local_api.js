const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Load mock graph data if available (optional)
let cityGraph = {};
try {
  cityGraph = require('./functions/safety-score/processed_city_graph.json');
} catch(e) { /* mock not found */ }

// POST /safety-score (Heat Map Data)
app.post('/safety-score', (req, res) => {
  res.json({
      overall_score: 7.8,
      area_name: "Mocked Local Area",
      node_scores: [7.8, 8.1, 8.5, 6.2, 9.1],
      active_alerts: 1,
      safe_havens: 12,
      police_units: 4
  });
});

// POST /sos (Emergency System & FIRs)
app.post('/sos', (req, res) => {
  const { userId, type, is_anonymous } = req.body;
  res.json({
      message: is_anonymous ? "Anonymous FIR securely logged in local mock" : "SOS Dispatched via local mock",
      incidentId: `sos_mock_${Date.now()}`
  });
});

// POST /route-planner (Route Safety Engine)
app.post('/route-planner', (req, res) => {
  const { mode } = req.body;
  const simulatedOverall = 6.8 + (Math.random() * 2);
  res.json({
      routes: [
          {
              id: "SAFEST",
              name: "Safety-First Path (AI Generated)",
              description: `ST-GNN Calculated Safety: ${simulatedOverall.toFixed(1)}/10`,
              mode: mode || "WALK",
              safety_score: parseFloat(simulatedOverall.toFixed(1)),
              travel_time: "18 min",
              distance: "1.4 km",
              polyline: "encoded_polyline_here",
              node_scores: [parseFloat((simulatedOverall+0.5).toFixed(1)), parseFloat((simulatedOverall-0.2).toFixed(1))]
          }
      ]
  });
});

// POST /companion/monitor (AI Companion Tracker)
app.post('/companion/monitor', (req, res) => {
  const riskSpike = Math.random() > 0.9;
  res.json({
      is_anomaly: riskSpike,
      alert_msg: riskSpike ? "Mock Local Caution: Predictive risk increasing ahead." : "Mock Local Path remains stable.",
      next_node_safety: 8.5
  });
});

const PORT = 3000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`\nLocal ASTA backend mock running at http://localhost:${PORT}`);
    console.log(`Android Emulator should be able to reach this at http://10.0.2.2:${PORT}\n`);
});
