# ASTA Presentation Blueprint: AI for Bharat Hackathon

**Objective:** To present ASTA as a proactive urban safety infrastructure, moving away from reactive SOS buttons toward predictive spatio-temporal intelligence.

---

## Slide 1: Brief about the Idea
**Headline:** From Reactive Response to Proactive Intelligence.
- **The Gap:** Traditional safety apps only react *after* an incident (SOS). They fail to address the "perceived risk" women face daily.
- **The Concept:** ASTA is a **Spatio-Temporal Intelligence Network** that treats the city as a living graph. 
- **The Goal:** To provide a digital safety shield that predicts risk levels, optimizes for the safest paths, and provides a real-time AI companion for every journey in Bharat.

---

## Slide 2: The Solution Architecture
### Why AI is required?
- **Non-Linear Risk:** Safety isn't static; it changes by the minute. A well-lit road at 6 PM can be a dark alley at 11 PM. 
- **The Brain:** We utilize a **Spatio-Temporal Graph Neural Network (ST-GNN)**. It analyzes spatial relationships (neighboring node risks) and temporal trends (historical crime spikes vs. real-time crowd flow) to calculate a dynamic Safety Index.

### How AWS Services are used?
- **Amazon SageMaker:** Hosts the ST-GNN model, performing real-time inference on millions of spatio-temporal node states.
- **AWS Lambda (Node.js 22):** Orchestrates the serverless "nervous system," connecting the mobile frontend to the AI brain.
- **Amazon DynamoDB:** Stores the encrypted User Safety Networks and the Anonymous FIR logs.
- **AWS API Gateway:** Ensures a secure, low-latency entry point for the high-performance React Native app.

### AI Value to User Experience
- **Predictive Guardrails:** Instead of just showing a map, the AI warns: *"This route is unusually quiet today—risk anomaly detected—take the main road."*
- **Objective Confidence:** Users navigate using a 0-10 Safety Index, making informed choices rather than relying on guesswork.

---

## Slide 3: Core Features & Visual Representation
1. **Dynamic Spatio-Temporal Heatmaps:**
   - Visualizing real-time risk across Mumbai and Pune districts.
   - *Visual Hint:* Use a screen grab of the Cyberpunk-themed map with the Neon Heatmap overlay.
2. **Intelligent "Safest-Path" Planner:**
   - Compares the Fastest Route (Google) vs. the Safest Route (ASTA ST-GNN).
   - Optimized for Walk, Two-Wheeler, and Car.
3. **Anonymous FIR Portal:**
   - A secure, encrypted system to lodge reports directly to the nearest station without compromising victim identity.
4. **Virtual AI Companion:**
   - Background monitoring that pings the ST-GNN every 10 seconds to ensure the user stays within the safety baseline.
5. **Smart SOS Dispatch:**
   - One-tap activation that logs GPS data to DynamoDB and alerts the emergency network.

---

## Slide 4: Technologies Utilized
- **ML Frameworks:** PyTorch (ST-GNN), Scikit-Learn (Data Analysis).
- **Hardware Acceleration:** Training performed on **NVIDIA RTX 4070 GPU** (Millions of data points processed).
- **Mobile Stack:** React Native, Google Maps SDK, Geolocation community API.
- **Cloud Stack:** AWS SAM, Lambda, DynamoDB, SageMaker Runtime.
- **Data Sources:** Real-world Kaggle datasets (2023-2024), Live Maharashtra News Scraping (TOI/HT).

---

## Slide 5: Future Development
1. **Acoustic Threat Detection Model:** 
   - An Edge-AI model running on-device to detect distress frequencies (screams, breaking glass) and trigger an automatic SOS even if the phone is out of reach.
2. **Community Consensus Trust Model:**
   - A decentralized verification system where users "vouch" for safe havens (shops, clinics). The AI weighs these vouchers to dynamically update localized safety scores.
