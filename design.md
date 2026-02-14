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

### System Overview (Including Phase 2 Features)

```
┌─────────────────────────────────────────────────────────────────┐
│                  MOBILE APP (React Native)                      │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐         │
│  │ Heat Map │  │ Route    │  │ SOS      │  │ AI       │         │
│  │          │  │ Planner  │  │ System   │  │ Companion│         │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘         │
│  ┌──────────┐  ┌──────────┐                                     │
│  │ Stalking │  │ Real-Time│  [Phase 2 Features]                 │
│  │ Detection│  │ Alerts   │                                     │
│  └──────────┘  └──────────┘                                     │
└─────────────────────────────────────────────────────────────────┘
                          │
                          ↓ HTTPS/WSS
┌─────────────────────────────────────────────────────────────────┐
│                  AWS API GATEWAY                                │
│  • REST API endpoints                                           │
│  • WebSocket for real-time updates (incident alerts)            │
│  • GraphQL (AWS AppSync) for subscriptions                      │
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
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐           │
│  │ Journey      │  │ Report       │  │ Stalking     │           │
│  │ Tracker      │  │ Processor    │  │ Detector     │           │
│  └──────────────┘  └──────────────┘  └──────────────┘           │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐           │
│  │ Incident     │  │ Alert        │  │ Flash Mob    │           │
│  │ Broadcaster  │  │ Dispatcher   │  │ Coordinator  │           │
│  └──────────────┘  └──────────────┘  └──────────────┘           │
└─────────────────────────────────────────────────────────────────┘
                          │
                          ↓
┌─────────────────────────────────────────────────────────────────┐
│                  DATA LAYER                                     │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐           │
│  │ DynamoDB     │  │ RDS          │  │ S3           │           │
│  │ (User Data)  │  │ (Incidents)  │  │ (Media +     │           │
│  │              │  │              │  │  Evidence)   │           │
│  └──────────────┘  └──────────────┘  └──────────────┘           │
│  ┌──────────────┐  ┌──────────────┐                             │
│  │ ElastiCache  │  │ DynamoDB     │                             │
│  │ Redis        │  │ Geo Library  │                             │
│  │ (Real-time)  │  │ (Geospatial) │                             │
│  └──────────────┘  └──────────────┘                             │
└─────────────────────────────────────────────────────────────────┘
                          │
                          ↓
┌─────────────────────────────────────────────────────────────────┐
│                  ML/AI LAYER                                    │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐           │
│  │ SageMaker    │  │ Safety Score │  │ Pattern      │           │
│  │ Endpoints    │  │ Model        │  │ Detection    │           │
│  └──────────────┘  └──────────────┘  └──────────────┘           │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐           │
│  │ AWS          │  │ Incident     │  │ Spam         │           │
│  │ Rekognition  │  │ Classifier   │  │ Detection    │           │
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
│  ┌──────────────┐  ┌──────────────┐                             │
│  │ Firebase FCM │  │ Social Media │                             │
│  │ (Push)       │  │ APIs         │                             │
│  └──────────────┘  └──────────────┘                             │
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
├── AWS AppSync (GraphQL for real-time subscriptions)
├── AWS Cognito (authentication)
├── AWS DynamoDB (NoSQL database + Geo Library)
├── AWS RDS PostgreSQL (relational data)
├── AWS S3 (media storage + evidence vault)
├── AWS SNS (SMS notifications)
├── AWS SES (email notifications)
├── AWS Rekognition (face detection for stalking)
├── ElastiCache Redis (real-time incident caching)
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
├── AWS Rekognition (facial recognition)
└── MLflow (experiment tracking)

Models to Build:
1. Safety Score Prediction (Random Forest + Neural Network)
2. Route Safety Optimization (Multi-objective optimization)
3. SOS Severity Classification (NLP + Context Analysis)
4. Harassment Pattern Detection (Anomaly detection)
5. Stalking Pattern Recognition (Phase 2)
6. Incident Severity Classifier (Phase 2)
7. Spam Detection Model (Phase 2)
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

### Phase 2 Feature 1: Stalking Detection & Documentation System

**Implementation Strategy**: AI-powered passive and active stalking detection with automated evidence collection and legal documentation

**A. Passive Detection Architecture**

**Face Detection Pipeline**:
```javascript
// AWS Rekognition Integration
async function detectFacesInPhoto(photoUri, userId) {
  // 1. Upload photo to S3
  const s3Key = await uploadToS3(photoUri, `users/${userId}/photos/`);
  
  // 2. Call Rekognition DetectFaces
  const rekognitionResult = await rekognition.detectFaces({
    Image: { S3Object: { Bucket: BUCKET_NAME, Name: s3Key } },
    Attributes: ['ALL']
  }).promise();
  
  // 3. Extract face embeddings
  const faces = rekognitionResult.FaceDetails.map(face => ({
    boundingBox: face.BoundingBox,
    confidence: face.Confidence,
    embedding: await getFaceEmbedding(s3Key, face.BoundingBox)
  }));
  
  // 4. Store embeddings in DynamoDB
  await storeFaceEmbeddings(userId, photoUri, faces);
  
  // 5. Run pattern analysis
  const patterns = await analyzeStalkingPatterns(userId);
  
  if (patterns.riskScore > 60) {
    await triggerStalkingAlert(userId, patterns);
  }
  
  return { faces, patterns };
}
```

**Pattern Analysis Algorithm**:
```python
def analyze_stalking_patterns(user_id):
    # Get all face embeddings for user
    embeddings = get_user_face_embeddings(user_id)
    
    # Group by similarity (same person)
    face_clusters = cluster_faces_by_similarity(embeddings, threshold=0.85)
    
    # Analyze each cluster
    stalking_patterns = []
    for cluster in face_clusters:
        if len(cluster) < 3:
            continue  # Need 3+ sightings
        
        # Calculate pattern metrics
        locations = [e['location'] for e in cluster]
        timestamps = [e['timestamp'] for e in cluster]
        
        geographic_spread = calculate_location_diversity(locations)
        time_progression = analyze_time_intervals(timestamps)
        proximity_trend = calculate_proximity_trend(locations, user_id)
        
        # Risk scoring
        risk_score = (
            (len(cluster) / 10) * 30 +  # Frequency (max 30 points)
            geographic_spread * 30 +      # Location diversity (max 30 points)
            time_progression * 20 +       # Time pattern (max 20 points)
            proximity_trend * 20          # Getting closer? (max 20 points)
        )
        
        if risk_score > 60:
            stalking_patterns.append({
                'face_id': cluster[0]['face_id'],
                'sightings': len(cluster),
                'locations': locations,
                'risk_score': risk_score,
                'first_seen': min(timestamps),
                'last_seen': max(timestamps)
            })
    
    return stalking_patterns
```

**B. Active Monitoring Mode - UI Components**:
```javascript
// StalkingMonitoringScreen.js
function StalkingMonitoringScreen() {
  const [monitoringActive, setMonitoringActive] = useState(false);
  const [stalkerProfile, setStalkerProfile] = useState(null);
  const [evidenceCount, setEvidenceCount] = useState(0);
  
  const activateMonitoring = async () => {
    const responses = await showStalkingQuestionnaire();
    const profile = await createStalkerProfile(responses);
    setStalkerProfile(profile);
    await enableEnhancedTracking();
    setMonitoringActive(true);
  };
  
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Stalking Detection</Text>
      
      {!monitoringActive ? (
        <Button 
          title="I Think Someone's Following Me"
          onPress={activateMonitoring}
        />
      ) : (
        <View>
          <StalkerProfileCard profile={stalkerProfile} />
          <EvidenceCounter count={evidenceCount} />
          <DiscretePhotoCapture onCapture={handleEvidenceCapture} />
          <ActionButtons 
            onConfrontation={handleConfrontation}
            onPoliceReport={handlePoliceReport}
          />
        </View>
      )}
    </View>
  );
}
```

**C. Evidence Documentation - Auto-Generated Legal Report**:
```python
def generate_legal_report(stalking_case_id):
    case = get_stalking_case(stalking_case_id)
    
    # AI-generated case summary
    summary = generate_case_summary_ai(case)
    timeline = build_incident_timeline(case['sightings'])
    
    # Evidence inventory
    evidence = {
        'photos': len(case['photos']),
        'videos': len(case['videos']),
        'locations': len(set([s['location'] for s in case['sightings']])),
        'witnesses': get_witness_count(case)
    }
    
    # Legal sections
    ipc_sections = ['354D (Stalking)']
    if case['risk_score'] > 80:
        ipc_sections.append('506 (Criminal Intimidation)')
    
    # Generate PDF
    pdf = PDFDocument()
    pdf.add_section('Case Summary', summary)
    pdf.add_section('Timeline of Incidents', timeline)
    pdf.add_section('Evidence Inventory', evidence)
    pdf.add_section('Applicable Legal Sections', ipc_sections)
    pdf.add_section('Risk Assessment', case['risk_score'])
    
    return pdf.save(f'stalking_case_{stalking_case_id}.pdf')
```

**D. Database Schema**:
```
StalkerProfiles (DynamoDB)
├── PK: stalker_profile_id
├── user_id
├── face_embeddings[]
├── physical_description
├── vehicle_details
├── sightings[]
├── risk_score
├── status (active/resolved/false_alarm)

EvidenceVault (DynamoDB)
├── PK: evidence_id
├── stalker_profile_id
├── type (photo/video/audio)
├── s3_url (encrypted)
├── location
├── timestamp
├── ai_enhanced
```

**Time Estimate**: Phase 2, Months 4-5

---

### Phase 2 Feature 2: Crowd-Sourced Real-Time Incident Alerts

**Implementation Strategy**: Real-time incident broadcasting with proximity-based alerts and community validation

**A. Real-Time Incident Broadcasting**:
```javascript
// Lambda: process-incident
async function processIncident(event) {
  const incident = JSON.parse(event.body);
  
  // 1. Validate and get user trust score
  const user = await getUser(incident.user_id);
  const trustScore = user.trust_score;
  
  // 2. Calculate alert radius
  const radius = calculateAlertRadius({
    severity: incident.severity,
    trustScore: trustScore
  });
  
  // 3. Find nearby users (geospatial query)
  const nearbyUsers = await geoQueryUsers({
    location: incident.location,
    radius: radius
  });
  
  // 4. Store and broadcast
  const incidentId = await storeIncident(incident);
  await broadcastToWebSocket(incidentId, nearbyUsers);
  
  return { statusCode: 200, body: JSON.stringify({ incident_id: incidentId }) };
}
```

**B. Smart Alert Distribution - Priority Calculator**:
```python
def calculate_alert_priority(user, incident):
    priority = incident['severity'] * 25  # Base priority
    
    # Context modifiers
    if user['is_alone']: priority += 20
    if is_night_time(): priority += 15
    if user['current_area_safety'] < 50: priority += 10
    if incident['type'] in ['assault', 'emergency']: priority += 25
    
    return min(priority, 100)
```

**C. Flash Mob Coordination**:
```javascript
// Lambda: activate-flash-mob
async function activateFlashMob(incidentId, location) {
  const potentialResponders = await geoQueryUsers(location, 500);
  
  // Send flash mob request
  await sendBulkPushNotifications(potentialResponders.map(user => ({
    device_token: user.device_token,
    title: "🆘 WOMAN NEEDS HELP",
    body: `Emergency ${user.distance}m from you`,
    data: { incident_id: incidentId, type: 'flash_mob' }
  })));
  
  // Create chat channel
  const chatChannel = await createChatChannel({
    name: `flash_mob_${incidentId}`,
    participants: potentialResponders.map(u => u.user_id)
  });
  
  return { incident_id: incidentId, chat_channel: chatChannel.id };
}
```

**D. Live Safety Map - Real-Time Implementation**:
```javascript
// LiveSafetyMapScreen.js
function LiveSafetyMapScreen() {
  const [incidents, setIncidents] = useState([]);
  
  useEffect(() => {
    // GraphQL subscription for real-time updates
    const subscription = API.graphql(
      graphqlOperation(onIncidentCreated, { area: 'koramangala' })
    ).subscribe({
      next: (incidentData) => {
        const newIncident = incidentData.value.data.onIncidentCreated;
        setIncidents(prev => [...prev, newIncident]);
        showIncidentNotification(newIncident);
      }
    });
    
    return () => subscription.unsubscribe();
  }, []);
  
  return (
    <MapView style={styles.map}>
      <Heatmap points={incidents.map(i => i.location)} />
      {incidents.map(incident => (
        <Marker
          key={incident.id}
          coordinate={incident.location}
          pinColor={getIncidentColor(incident)}
        />
      ))}
    </MapView>
  );
}
```

**E. Trust Score & Anti-Spam**:
```python
class TrustScoreManager:
    def update_trust_score(self, user_id, event_type):
        score_changes = {
            'verified_incident': +10,
            'community_validation': +5,
            'police_confirmation': +15,
            'false_report': -20,
            'malicious_report': -50,
            'spam_detected': -15
        }
        
        change = score_changes.get(event_type, 0)
        new_score = max(0, min(100, current_score + change))
        
        if new_score < 10:
            ban_user(user_id, reason='Low trust score')
        
        return new_score
```

**F. Database Schema**:
```
RealTimeIncidents (DynamoDB)
├── PK: incident_id
├── SK: timestamp
├── location (lat, lng, geohash)
├── type, severity, reported_by
├── status (active/resolved/false)
├── validations, trust_score
├── GSI: geohash-timestamp-index

UserTrustScores (DynamoDB)
├── PK: user_id
├── trust_score (0-100)
├── verified_incidents, false_reports
├── community_validations
```

**Time Estimate**: Phase 2, Months 5-6

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
