# Design Document: Women's Safety Intelligence Network

---

## Executive Summary

This design document outlines the **PRODUCTION-READY** technical architecture for India's first AI-powered women's safety intelligence network. 

**Build Philosophy**: Deliver a fully functional MVP with real AWS infrastructure, working ML models, actual integrations, and all 5 core features ready for beta testing.

**Time Budget**: 4 weeks (26 days)
**Team Size**: 2-4 developers
**Goal**: Build a production-ready prototype that can onboard 1,000+ beta users immediately after completion

---

## 1. Production Architecture (AWS-Based)

### System Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                  MOBILE APP (React Native)                      │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐         │
│  │ Heat Map │  │ Route    │  │ SOS      │  │ AI       │         │
│  │          │  │ Planner  │  │ System   │  │ Companion│         │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘         │
└─────────────────────────────────────────────────────────────────┘
                          │
                          ↓ HTTPS/WSS
┌─────────────────────────────────────────────────────────────────┐
│                  AWS API GATEWAY                                │
│  • REST API endpoints                                           │
│  • WebSocket for real-time updates                              │
│  • Authentication (AWS Cognito)                                 │
└─────────────────────────────────────────────────────────────────┘
                          │
                          ↓
┌─────────────────────────────────────────────────────────────────┐
│                  AWS LAMBDA (Serverless Functions)              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐           │
│  │ Safety Score │  │ Route        │  │ SOS          │           │
│  │ Calculator   │  │ Optimizer    │  │ Handler      │           │
│  └──────────────┘  └──────────────┘  └──────────────┘           │
│  ┌──────────────┐  ┌──────────────┐                             │
│  │ Journey      │  │ Report       │                             │
│  │ Tracker      │  │ Processor    │                             │
│  └──────────────┘  └──────────────┘                             │
└─────────────────────────────────────────────────────────────────┘
                          │
                          ↓
┌─────────────────────────────────────────────────────────────────┐
│                  DATA LAYER                                     │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐           │
│  │ DynamoDB     │  │ RDS          │  │ S3           │           │
│  │ (User Data)  │  │ (Incidents)  │  │ (Media)      │           │
│  └──────────────┘  └──────────────┘  └──────────────┘           │
└─────────────────────────────────────────────────────────────────┘
                          │
                          ↓
┌─────────────────────────────────────────────────────────────────┐
│                  ML/AI LAYER                                    │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐           │
│  │ SageMaker    │  │ Safety Score │  │ Pattern      │           │
│  │ Endpoints    │  │ Model        │  │ Detection    │           │
│  └──────────────┘  └──────────────┘  └──────────────┘           │
└─────────────────────────────────────────────────────────────────┘
                          │
                          ↓
┌─────────────────────────────────────────────────────────────────┐
│                  EXTERNAL SERVICES                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐           │
│  │ Google Maps  │  │ Twilio       │  │ AWS SNS      │           │
│  │ (Routing)    │  │ (Calls)      │  │ (SMS)        │           │
│  └──────────────┘  └──────────────┘  └──────────────┘           │
└─────────────────────────────────────────────────────────────────┘
```

### Architecture Principles

**1. Production-Ready Design**
- Real AWS infrastructure (not mock data)
- Scalable serverless architecture
- Real-time capabilities with WebSockets
- Production-grade security

**2. Rapid Development**
- Use managed services (Lambda, DynamoDB, SageMaker)
- Leverage existing APIs (Google Maps, Twilio)
- Focus on core features, defer nice-to-haves

**3. Beta-Ready**
- Can handle 1,000+ concurrent users
- 99.9% uptime target
- Real monitoring and logging
- Graceful error handling

---

## 2. Technology Stack

### Frontend (Mobile App)

**React Native** (Production)
```
Tech Stack:
├── React Native 0.72+
├── React Navigation (screen routing)
├── React Native Maps (Google Maps SDK)
├── Redux + Redux Toolkit (state management)
├── Redux-Saga (side effects)
├── Axios (HTTP client)
├── Socket.io Client (real-time updates)
├── React Native Geolocation (GPS tracking)
├── React Native Push Notifications
├── React Native Permissions
├── AsyncStorage (local persistence)
└── Lottie (animations)

Why React Native:
✅ Cross-platform (iOS + Android from single codebase)
✅ Fast development with hot reload
✅ Large ecosystem of libraries
✅ Native performance for critical features
✅ Easy to hire developers
```

### Backend (AWS Serverless)

**AWS Lambda + API Gateway**
```
Backend Stack:
├── AWS Lambda (Node.js 18.x)
├── AWS API Gateway (REST + WebSocket)
├── AWS Cognito (authentication)
├── AWS DynamoDB (NoSQL database)
├── AWS RDS PostgreSQL (relational data)
├── AWS S3 (media storage)
├── AWS SNS (SMS notifications)
├── AWS SES (email notifications)
├── AWS CloudWatch (monitoring)
└── AWS X-Ray (distributed tracing)

Why Serverless:
✅ Auto-scaling (0 to millions of users)
✅ Pay only for what you use
✅ No server management
✅ Built-in high availability
✅ Fast deployment
```

### ML/AI Stack

**AWS SageMaker + Python**
```
ML Stack:
├── Python 3.10+
├── TensorFlow 2.x (deep learning)
├── Scikit-learn (traditional ML)
├── Pandas (data processing)
├── NumPy (numerical computing)
├── AWS SageMaker (model training & deployment)
├── AWS SageMaker Endpoints (model serving)
└── MLflow (experiment tracking)

Models to Build:
1. Safety Score Prediction (Random Forest + Neural Network)
2. Route Safety Optimization (Multi-objective optimization)
3. SOS Severity Classification (NLP + Context Analysis)
4. Harassment Pattern Detection (Anomaly detection)
```

### External Services

**Third-Party Integrations**
```
Services:
├── Google Maps Platform
│   ├── Maps SDK (map rendering)
│   ├── Directions API (routing)
│   ├── Places API (location data)
│   └── Geocoding API (address conversion)
├── Twilio
│   ├── Voice API (emergency calls)
│   └── SMS API (backup notifications)
├── OpenWeatherMap API (weather data)
└── NCRB Data (crime statistics - public datasets)
```

---

## 3. Core Features Implementation

### Feature 1: Safety Heat Maps (Production Implementation)

**Implementation Strategy**: Real-time ML-powered safety scoring with AWS infrastructure

**Data Structure**:
```json
{
  "location_id": "loc_001",
  "name": "Connaught Place",
  "coordinates": {
    "lat": 28.6304,
    "lon": 77.2177
  },
  "safety_score": {
    "current": 78,
    "morning": 85,
    "afternoon": 82,
    "evening": 75,
    "night": 65
  },
  "factors": {
    "crime_rate": 0.15,
    "lighting_quality": 0.85,
    "crowd_density": 0.75,
    "police_presence": 0.60,
    "infrastructure_score": 0.80
  },
  "last_updated": "2026-02-20T14:30:00Z",
  "confidence": 0.87
}
```

**Safety Score Calculation (ML Model)**:
```python
# AWS SageMaker model
def calculate_safety_score(location_data, time_of_day, weather, events):
    features = extract_features(location_data, time_of_day, weather, events)
    base_score = ml_model.predict(features)
    confidence = ml_model.predict_proba(features)
    return {
        'score': base_score,
        'confidence': confidence,
        'factors': feature_importance(features)
    }
```

**Backend Architecture**:
```
Lambda: safety-score-calculator
├── Input: location_id, time_of_day
├── Process:
│   ├── Fetch location data from DynamoDB
│   ├── Get real-time context (weather, events)
│   ├── Call SageMaker endpoint for ML prediction
│   └── Cache result in Redis (15-minute TTL)
└── Output: safety_score object
```

**UI Components**:
```
SafetyHeatMapScreen
├── MapView (Google Maps SDK)
├── Real-time marker updates (WebSocket)
├── TimeFilter (dynamic scoring)
├── LocationDetailModal (full breakdown)
└── RefreshIndicator (pull to update)
```

**Implementation Flow**:
1. App loads → Fetch safety scores for visible map area
2. User changes time filter → Recalculate scores with ML model
3. User taps location → Show detailed breakdown with confidence
4. Background updates every 15 minutes via WebSocket

**Time Estimate**: Week 1, Days 3-5

---

### Feature 2: Route Planner (Production Implementation)

**Implementation Strategy**: Real-time route optimization with safety-weighted algorithm

**Route Optimization Algorithm**:
```python
def optimize_route(origin, destination, user_preferences):
    # Get multiple route options from Google Maps
    routes = google_maps.directions(origin, destination, alternatives=True)
    
    # Calculate safety score for each route
    for route in routes:
        segments = divide_into_segments(route, segment_length=500)
        route.safety_score = calculate_route_safety(segments)
        route.risk_segments = identify_high_risk_segments(segments)
    
    # Multi-objective optimization
    pareto_optimal = pareto_frontier(routes, objectives=['time', 'safety'])
    
    # Apply user preferences
    recommended = apply_user_weights(pareto_optimal, user_preferences)
    
    return {
        'fastest': routes[0],
        'safest': max(routes, key=lambda r: r.safety_score),
        'recommended': recommended,
        'alternatives': pareto_optimal
    }
```

**Backend Architecture**:
```
Lambda: route-optimizer
├── Input: origin, destination, user_id
├── Process:
│   ├── Call Google Maps Directions API
│   ├── Segment routes into 500m chunks
│   ├── Calculate safety score per segment
│   ├── Run multi-objective optimization
│   └── Cache result in Redis (5-minute TTL)
└── Output: route_options object
```

**UI Components**:
```
RoutePlannerScreen
├── OriginDestinationInput (Google Places autocomplete)
├── RouteOptionsCarousel
│   ├── FastestRouteCard
│   ├── SafestRouteCard
│   └── RecommendedRouteCard
├── MapView (polylines with risk highlighting)
└── StartJourneyButton
```

**Implementation Flow**:
1. User enters origin/destination
2. Backend calculates multiple route options (<3 seconds)
3. Display routes with safety scores and time estimates
4. User selects route → Start journey tracking

**Time Estimate**: Week 2, Days 1-3

---

### Feature 3: Emergency SOS System (Production Implementation)

**Implementation Strategy**: Multi-channel real-time emergency response system

**SOS Activation Flow**:
```javascript
async function triggerSOS(userId, location, context) {
  // 1. Create SOS incident record
  const incident = await createSOSIncident({
    userId,
    location,
    timestamp: Date.now(),
    context,
    status: 'ACTIVE'
  });
  
  // 2. Classify severity using ML
  const severity = await classifySOSSeverity(context);
  
  // 3. Multi-channel notifications (parallel)
  await Promise.all([
    sendSMS(incident, severity),      // AWS SNS
    initiateVoiceCall(incident),      // Twilio
    sendPushNotification(incident),   // FCM
    startAudioRecording(30)           // Local device
  ]);
  
  // 4. Update emergency dashboard (WebSocket)
  await updateEmergencyDashboard(incident);
  
  // 5. Start location tracking (every 5 seconds)
  startLocationTracking(incident.id);
  
  return incident;
}
```

**Backend Architecture**:
```
Lambda: sos-handler
├── Input: user_id, location, context
├── Process:
│   ├── Create incident in RDS
│   ├── Call ML model for severity classification
│   ├── Trigger notification-dispatcher Lambda
│   ├── Start WebSocket updates
│   └── Log to CloudWatch
└── Output: incident_id, status

Lambda: notification-dispatcher
├── Input: incident_id
├── Process:
│   ├── Fetch emergency contacts from DynamoDB
│   ├── Send SMS via AWS SNS
│   ├── Initiate calls via Twilio API
│   ├── Send push via FCM
│   └── Track delivery status
└── Output: notification_status
```

**Emergency Dashboard (React Web App)**:
```javascript
// Real-time dashboard for emergency contacts
function EmergencyDashboard({ incidentId }) {
  const [incident, setIncident] = useState(null);
  const [location, setLocation] = useState(null);
  
  useEffect(() => {
    // WebSocket connection for real-time updates
    const ws = new WebSocket(`wss://api.safetynet.in/emergency/${incidentId}`);
    
    ws.onmessage = (event) => {
      const update = JSON.parse(event.data);
      setIncident(update.incident);
      setLocation(update.location);
    };
    
    return () => ws.close();
  }, [incidentId]);
  
  return (
    <div className="emergency-dashboard">
      <h1>🚨 EMERGENCY ALERT</h1>
      <LiveMap location={location} />
      <IncidentDetails incident={incident} />
      <ActionButtons incidentId={incidentId} />
    </div>
  );
}
```

**UI Components**:
```
SOSButton (Floating, always visible)
├── Press → SOSCountdownModal (5 seconds)
├── After countdown → SOSActivationScreen
└── Real-time status updates

EmergencyDashboard (Web app)
├── Live location map (updates every 5 seconds)
├── User status indicator
├── Emergency contact list
├── Call Police button (real integration)
└── Navigate to Location button
```

**Implementation Flow**:
1. User presses SOS button
2. 5-second countdown (can cancel)
3. After countdown → Create incident, send notifications
4. Emergency contacts receive SMS/call/push within 30 seconds
5. Dashboard shows live location updates
6. Audio recording sent to emergency contacts

**Time Estimate**: Week 2, Days 4-6

---

## 4. Data Management Strategy

### Real-Time Data Sources

**Crime Data**:
- NCRB historical data (5+ years)
- Municipal police department feeds (where available)
- User-reported incidents (crowdsourced)
- Update frequency: Daily batch + real-time reports

**Infrastructure Data**:
- Street lighting database (municipal data)
- CCTV coverage maps
- Police station locations
- Public transport routes
- Update frequency: Weekly

**Contextual Data**:
- Weather API (OpenWeatherMap) - real-time
- Event data (festivals, protests) - daily
- Traffic data (Google Maps) - real-time
- Time of day - continuous

### Database Schema

**DynamoDB Tables**:
```
Users
├── PK: userId
├── emergency_contacts[]
├── preferences
└── journey_history[]

SafetyScores
├── PK: location_id
├── coordinates
├── scores (by time_of_day)
├── factors
└── last_updated

Journeys
├── PK: journey_id
├── user_id
├── route
├── status
└── checkpoints[]

SOSIncidents
├── PK: incident_id
├── user_id
├── location
├── severity
└── resolution_status
```

**RDS PostgreSQL Tables**:
```sql
-- For complex queries and analytics
CREATE TABLE incident_reports (
  id UUID PRIMARY KEY,
  location GEOGRAPHY(POINT),
  category VARCHAR(50),
  timestamp TIMESTAMP,
  verified BOOLEAN,
  reporter_hash VARCHAR(64)  -- Anonymous
);

CREATE INDEX idx_location ON incident_reports USING GIST(location);
CREATE INDEX idx_timestamp ON incident_reports(timestamp);
```

---

## 5. Testing Strategy

### Unit Testing
- Test ML model predictions
- Test route optimization algorithm
- Test SOS notification logic
- Test data validation

### Integration Testing
- Test API endpoints
- Test database operations
- Test external service integrations
- Test WebSocket connections

### End-to-End Testing
- Test complete user journeys
- Test SOS activation flow
- Test emergency dashboard
- Test multi-device scenarios

### Load Testing
- 1,000 concurrent users
- 10,000 API requests/minute
- 100 simultaneous SOS activations
- Real-time WebSocket connections

### Security Testing
- Penetration testing
- Authentication/authorization
- Data encryption verification
- Privacy compliance audit

**Time Estimate**: Week 4, Days 1-3

---

## 7. Development Timeline (4 Weeks)

### Week 1 (Feb 16-22): Foundation + Features 1-2
**Days 1-2**: Setup
- Initialize React Native project
- Set up AWS infrastructure
- Configure Google Maps API
- Create database schemas

**Days 3-5**: Feature 1 (Safety Heat Maps)
- Build map screen with real-time data
- Train and deploy ML model
- Implement safety score API
- Add time-of-day filtering
- Create location detail modal

**Days 6-7**: Feature 2 (Route Planner)
- Build route planner screen
- Implement optimization algorithm
- Integrate Google Maps Directions API
- Create route comparison UI
- Test with real routes

### Week 2 (Feb 23-Mar 1): Features 3-4 + ML
**Days 8-10**: Feature 3 (SOS System)
- Build SOS button and countdown
- Set up Twilio for voice calls
- Configure AWS SNS for SMS
- Build emergency contact dashboard
- Test end-to-end SOS flow

**Days 11-14**: Feature 4 (AI Companion)
- Implement real-time GPS tracking
- Build journey monitoring logic
- Add anomaly detection
- Implement automated check-ins
- Test journey tracking

### Week 3 (Mar 2-8): Feature 5 + Polish
**Days 15-17**: Feature 5 (Anonymous Reporting)
- Build reporting UI
- Implement zero-knowledge architecture
- Set up encrypted media upload
- Build community verification
- Test reporting flow

**Days 18-21**: Integration & Polish
- Integrate all ML models
- Set up real-time updates
- Performance optimization
- UI/UX polish
- Bug fixes

### Week 4 (Mar 9-12): Testing + Demo Prep
**Days 22-24**: Testing
- Beta testing with 100+ users
- Load testing
- Security audit
- Bug fixes

**Days 25-26**: Demo Preparation
- Create demo script
- Record backup video
- Prepare presentation
- Practice demo
- Final polish

---

## 8. Post-Prototype Roadmap

**Month 1-3**: Beta expansion
- 1,000 beta users
- Improve ML model accuracy to 90%+
- Partner with 3 police stations

**Month 4-6**: Public launch
- 50,000 users across 3 cities
- Corporate partnerships (5+ companies)
- Revenue generation starts

**Month 7-12**: Scale to 8 cities
- 500,000 users
- Full feature set deployed
- Government partnerships

**Year 2**: Pan-India expansion
- 2M users
- International expansion
- Series A funding

---

## Conclusion

This production-ready design delivers a **FULLY FUNCTIONAL MVP** with:

1. **Real infrastructure** (AWS serverless, not mock data)
2. **Working ML models** (85%+ accuracy)
3. **Actual integrations** (real SMS/calls, not simulated)
4. **All 5 features** (complete safety ecosystem)

The goal is to build a prototype that:
- Solves a real problem with real technology
- Can onboard 1,000+ beta users immediately
- Demonstrates clear path to scale
- Proves technical and execution capability

**Build production-quality. Prove you can execute. Win the competition.**
