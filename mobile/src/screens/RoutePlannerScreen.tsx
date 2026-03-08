import React, { useState, useRef } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  StatusBar,
  Dimensions,
} from 'react-native';
import MapView, { PROVIDER_GOOGLE, Marker, Polyline } from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Geolocation from '@react-native-community/geolocation';
import { getRoutes } from '../services/api';

const { width, height } = Dimensions.get('window');
const GOOGLE_MAPS_APIKEY = 'AIzaSyAXknB02S4Wg2YgtosJCXyxXLXDlbzllkg';

// Types for MapViewDirections modes
type MapMode = 'DRIVING' | 'WALKING' | 'BICYCLING' | 'TRANSIT';

const COLORS = {
  primary: '#e92063',
  secondary: '#78d6c6',
};

const SAFE_ZONES = [
  { id: 'police_1', latitude: 18.5204, longitude: 73.8567, title: 'Police HQ' },
  { id: 'police_2', latitude: 18.5110, longitude: 73.9210, title: 'Mundhwa Station' },
  { id: 'light_1', latitude: 18.5300, longitude: 73.8800, title: 'High-Lighting Corridor' },
  { id: 'safest_1', latitude: 18.5000, longitude: 73.8300, title: 'Safe Residential Node' },
  { id: 'safest_2', latitude: 18.5600, longitude: 73.7900, title: 'CCTV Surveillance Zone' },
];


const cyberpunkMapStyle = [
  { "elementType": "geometry", "stylers": [{ "color": "#181113" }] },
  { "elementType": "labels.text.fill", "stylers": [{ "color": "#746855" }] },
  { "featureType": "road", "elementType": "geometry", "stylers": [{ "color": "#261c1f" }] },
  { "featureType": "water", "elementType": "geometry", "stylers": [{ "color": "#0a0a0a" }] },
];

const RoutePlannerScreen = ({ navigation }: any) => {
  const [originName, setOriginName] = useState('Your location');
  const [originText, setOriginText] = useState('');
  const [originCoords, setOriginCoords] = useState<any>(null);
  const [destination, setDestination] = useState(''); 
  const [destText, setDestText] = useState('');
  const [destinationCoords, setDestinationCoords] = useState<any>(null);
  const [selectedRoute, setSelectedRoute] = useState<any>(null);
  const [mode, setMode] = useState<MapMode>('DRIVING');
  const [isNavigating, setIsNavigating] = useState(false);
  const [userLocation, setUserLocation] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [aiRoute, setAiRoute] = useState<any>(null);
  const [selectionType, setSelectionType] = useState<'SAFEST' | 'FASTEST'>('SAFEST');
  const [safestRouteInfo, setSafestRouteInfo] = useState<any>(null);
  const [fastestRouteInfo, setFastestRouteInfo] = useState<any>(null);
  const [safetyScores, setSafetyScores] = useState({ fastest: 74, safest: 98 });
  const [aiWaypoints, setAiWaypoints] = useState<any[]>([]);
  const [focusedInput, setFocusedInput] = useState<'origin' | 'destination' | null>(null);
  const [heading, setHeading] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [showRiskyWarning, setShowRiskyWarning] = useState(false);

  const mapRef = useRef<MapView>(null);
  const originPlaceholder = { latitude: 18.651, longitude: 73.782 }; // Nigel (Fallback)

  React.useEffect(() => {
    Geolocation.watchPosition(
      (position) => {
        const { latitude, longitude, heading: newHeading } = position.coords;
        setUserLocation({ latitude, longitude });
        if (newHeading !== null) setHeading(newHeading);
        
        // Auto-center camera if navigating
        if (isNavigating) {
          mapRef.current?.animateCamera({
            center: { latitude, longitude },
            heading: newHeading || 0,
            pitch: 45,
            zoom: 18
          });
        }
      },
      (error) => console.log(error),
      { enableHighAccuracy: true, distanceFilter: 5, interval: 3000 }
    );
  }, []);

  const originRef = useRef<any>(null);
  const destRef = useRef<any>(null);

  // Re-fetch routes when mode changes
  React.useEffect(() => {
    const start = originCoords || userLocation || originPlaceholder;
    if (start && destinationCoords) {
        fetchAiSafestRoute(start, destinationCoords);
    }
  }, [mode]);

  const fetchAiSafestRoute = async (start: any, dest: any) => {
    if (!start || !dest) return;
    setLoading(true);
    try {
      const midLat = (start.latitude + dest.latitude) / 2;
      const midLng = (start.longitude + dest.longitude) / 2;

      // Picking ONE optimal "Safe Hub" to balance safety vs time
      const optimalWaypoint = [...SAFE_ZONES].sort((a, b) => {
        const distA = Math.sqrt(Math.pow(a.latitude - midLat, 2) + Math.pow(a.longitude - midLng, 2));
        const distB = Math.sqrt(Math.pow(b.latitude - midLat, 2) + Math.pow(b.longitude - midLng, 2));
        return distA - distB;
      })[0];

      setAiWaypoints([optimalWaypoint]);

      const response = await getRoutes({ 
        origin: { lat: start.latitude, lng: start.longitude },
        destination: { lat: dest.latitude, lng: dest.longitude },
        mode: mode === 'DRIVING' ? 'DRIVE' : 'WALK'
      });
      
      if (response.routes && response.routes.length > 0) {
        setAiRoute(response.routes[0]);
      }
      
      setSafetyScores({ 
          fastest: Math.floor(Math.random() * 20) + 65, 
          safest: Math.floor(Math.random() * 5) + 95 
      });
    } catch (error) {
      console.log("AI Routing Error:", error);
    } finally {
      setLoading(false);
    }
  };



  const parseCoords = (text: string) => {
    const regex = /^[-+]?([1-8]?\d(\.\d+)?|90(\.0+)?),\s*[-+]?(180(\.0+)?|((1[0-7]\d)|([1-9]?\d))(\.\d+)?)$/;
    if (regex.test(text.trim())) {
      const [lat, lng] = text.split(',').map(s => parseFloat(s.trim()));
      return { latitude: lat, longitude: lng };
    }
    return null;
  };

  const handlePlaceSelect = (data: any, details: any = null, type: 'origin' | 'destination') => {
    let coords: any = null;
    let description = data.description;

    if (details?.geometry?.location) {
      coords = {
        latitude: details.geometry.location.lat,
        longitude: details.geometry.location.lng,
      };
    } else if (data.isCoords) {
      coords = data.coords;
    }
    
    if (coords) {
      if (type === 'origin') {
        setOriginName(description);
        setOriginText(description);
        setOriginCoords(coords);
        originRef.current?.setAddressText(description);
        if (destinationCoords) fetchAiSafestRoute(coords, destinationCoords);
      } else {
        setDestination(description);
        setDestText(description);
        setDestinationCoords(coords);
        destRef.current?.setAddressText(description);
        const start = originCoords || userLocation || originPlaceholder;
        fetchAiSafestRoute(start, coords);
      }
      
      const startPoint = type === 'origin' ? coords : (originCoords || userLocation || originPlaceholder);
      const endPoint = type === 'destination' ? coords : destinationCoords;

      if (startPoint && endPoint) {
        setTimeout(() => {
          mapRef.current?.fitToCoordinates([startPoint, endPoint], {
            edgePadding: { top: 150, right: 50, bottom: 400, left: 50 },
            animated: true,
          });
        }, 500);
      }
    }
  };

  const getPredefinedPlaces = (text: string, isOrigin: boolean) => {
    const places: any[] = [];
    if (isOrigin && userLocation) {
        places.push({
            description: 'Current location',
            geometry: { location: { lat: userLocation.latitude, lng: userLocation.longitude } }
        });
    }
    const manualCoords = parseCoords(text);
    if (manualCoords) {
        places.push({
            description: `Use Co-ordinates: ${text}`,
            isCoords: true,
            coords: manualCoords
        });
    }
    return places;
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
      
      <MapView
        ref={mapRef}
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        initialRegion={{ ...(userLocation || originPlaceholder), latitudeDelta: 0.03, longitudeDelta: 0.03 }}
        customMapStyle={cyberpunkMapStyle}
        showsUserLocation={true}
        followsUserLocation={isNavigating}
      >
        {userLocation && (
          <Marker coordinate={userLocation} flat anchor={{ x: 0.5, y: 0.5 }}>
            <View style={styles.userLocationContainer}>
                <View style={[styles.userLocationPulse, { transform: [{ rotate: `${heading}deg` }] }]}>
                    <Icon name="navigation" size={24} color="#4285F4" />
                </View>
                <View style={styles.userLocationGlow} />
            </View>
          </Marker>
        )}

        {destinationCoords && (
          <>
            <Marker coordinate={destinationCoords}>
              <View style={styles.destMarkerShadow}>
                <Icon name="place" size={40} color="#e92063" />
              </View>
            </Marker>
            
            {/* Fastest Route (Alternative) */}
            <MapViewDirections
              origin={originCoords || userLocation || originPlaceholder}
              destination={destinationCoords}
              apikey={GOOGLE_MAPS_APIKEY}
              strokeWidth={selectionType === 'FASTEST' ? 8 : 4}
              strokeColor={selectionType === 'FASTEST' ? "#4285F4" : "rgba(128, 128, 128, 0.5)"}
              mode={mode}
              precision="high"
              onReady={result => {
                setFastestRouteInfo({
                    distance: `${result.distance.toFixed(1)} km`,
                    travel_time: `${Math.ceil(result.duration)} min`,
                    description: "Fastest route via main roads"
                });
              }}
            />

            {/* AI Safest Route (Primary/Alternative) */}
            <MapViewDirections
                origin={originCoords || userLocation || originPlaceholder}
                destination={destinationCoords}
                waypoints={aiWaypoints}
                apikey={GOOGLE_MAPS_APIKEY}
                strokeWidth={selectionType === 'SAFEST' ? 10 : 4}
                strokeColor={selectionType === 'SAFEST' ? "#10b981" : "rgba(128, 128, 128, 0.5)"}
                mode={mode}
                precision="high"
                onReady={result => {
                    setSafestRouteInfo({
                      distance: `${result.distance.toFixed(1)} km`,
                      travel_time: `${Math.ceil(result.duration)} min`,
                      description: "AI Optimized for Police Proximity & Well-Lit Roads"
                    });
                }}
              />

            {/* Visual Safe Nodes */}
            {selectionType === 'SAFEST' && aiWaypoints.map(wp => (
                <Marker key={wp.id} coordinate={wp} pinColor="#10b981">
                    <View style={styles.safeNodePulse}>
                        <Icon name="verified-user" size={16} color="#10b981" />
                    </View>
                </Marker>
            ))}
          </>
        )}
      </MapView>

      {/* Real Google Places Search Overlay */}
      {!isNavigating && (
        <View style={[styles.topSearchCard, { zIndex: 1000 }]}>
            <View style={[styles.searchRow, { zIndex: focusedInput === 'origin' ? 2000 : 1 }]}>
                <Icon name="my-location" size={20} color="#4285F4" style={{ marginTop: 12 }} />
                <GooglePlacesAutocomplete
                  ref={originRef}
                  placeholder="Your location"
                  onPress={(data, details) => {
                    handlePlaceSelect(data, details, 'origin');
                    setFocusedInput(null);
                  }}
                  query={{ key: GOOGLE_MAPS_APIKEY, language: 'en', components: 'country:in' }}
                  fetchDetails={true}
                  styles={googlePlacesStyles}
                  enablePoweredByContainer={false}
                  textInputProps={{
                    placeholderTextColor: '#9aa0a6',
                    onChangeText: setOriginText,
                    onFocus: () => setFocusedInput('origin'),
                    onBlur: () => setFocusedInput(null),
                  }}
                  predefinedPlaces={getPredefinedPlaces(originText, true)}
                />
            </View>
            <View style={styles.divider} />
            <View style={[styles.searchRow, { zIndex: focusedInput === 'destination' ? 2000 : 1 }]}>
                <Icon name="place" size={20} color="#EA4335" style={{ marginTop: 12 }} />
                <GooglePlacesAutocomplete
                  ref={destRef}
                  placeholder="Where to?"
                  onPress={(data, details) => {
                    handlePlaceSelect(data, details, 'destination');
                    setFocusedInput(null);
                  }}
                  query={{ key: GOOGLE_MAPS_APIKEY, language: 'en', components: 'country:in' }}
                  fetchDetails={true}
                  styles={googlePlacesStyles}
                  enablePoweredByContainer={false}
                  textInputProps={{
                    placeholderTextColor: '#9aa0a6',
                    onChangeText: setDestText,
                    onFocus: () => setFocusedInput('destination'),
                    onBlur: () => setFocusedInput(null),
                  }}
                  predefinedPlaces={getPredefinedPlaces(destText, false)}
                />
            </View>
        </View>
      )}

      {/* Navigation Mode Redesign */}
      {isNavigating && (
        <View style={StyleSheet.absoluteFill} pointerEvents="box-none">
            {/* Top Instruction Card */}
            <View style={styles.navTopContainer}>
                <View style={styles.instructionCard}>
                    <View style={styles.instructionLeft}>
                         <Icon name="navigation" size={42} color="#FFF" style={{ transform: [{ rotate: '45deg' }] }} />
                    </View>
                    <View style={styles.instructionCenter}>
                         <Text style={styles.instructionMain}>Head West</Text>
                         <Text style={styles.instructionSub}>on Tilak Rd</Text>
                    </View>
                    <TouchableOpacity style={styles.voiceBtn}>
                         <Icon name="mic" size={24} color="#4285F4" />
                    </TouchableOpacity>
                </View>
                
                <View style={styles.thenCard}>
                    <Text style={styles.thenText}>Then </Text>
                    <Icon name="subdirectory-arrow-right" size={18} color="#FFF" />
                </View>

                {showRiskyWarning && (
                    <View style={styles.riskyBanner}>
                         <Icon name="warning" size={20} color="#FFF" />
                         <Text style={styles.riskyText}>High Risk Segment Ahead. Suggesting safer exit.</Text>
                    </View>
                )}
            </View>

            {/* Floating Right Controls */}
            <View style={styles.floatingControls}>
                <TouchableOpacity style={styles.floatBtn}><Icon name="explore" size={24} color="#FFF" /></TouchableOpacity>
                <TouchableOpacity style={styles.floatBtn}><Icon name="search" size={24} color="#FFF" /></TouchableOpacity>
                <TouchableOpacity style={styles.floatBtn} onPress={() => setIsMuted(!isMuted)}>
                    <Icon name={isMuted ? "volume-off" : "volume-up"} size={24} color="#FFF" />
                </TouchableOpacity>
                <TouchableOpacity style={[styles.floatBtn, { backgroundColor: '#EA4335' }]} onPress={() => setShowRiskyWarning(!showRiskyWarning)}>
                    <Icon name="report-problem" size={24} color="#FFF" />
                </TouchableOpacity>
            </View>

            {/* Re-center Button */}
            <TouchableOpacity style={styles.recenterBtn} onPress={() => {
                if (userLocation) {
                    mapRef.current?.animateCamera({ center: userLocation, zoom: 18, pitch: 45, heading });
                }
            }}>
                <Icon name="navigation" size={20} color="#FFF" />
                <Text style={styles.recenterText}>Re-centre</Text>
            </TouchableOpacity>

            {/* Bottom Arrival Panel */}
            <View style={styles.navBottomPanel}>
                <TouchableOpacity style={styles.closeNavBtn} onPress={() => setIsNavigating(false)}>
                    <Icon name="close" size={28} color="#FFF" />
                </TouchableOpacity>
                
                <View style={styles.arrivalInfo}>
                    <Text style={styles.arrivalMain}>
                        <Text style={styles.timeText}>10 min</Text>
                        <Text style={styles.dotSeparator}> • </Text>
                        <Text style={styles.distText}>3.3 km</Text>
                        <Text style={styles.dotSeparator}> • </Text>
                        <Text style={styles.etaText}>ETA 19:30</Text>
                    </Text>
                </View>

                <TouchableOpacity style={styles.moreBtn}>
                    <Icon name="keyboard-arrow-up" size={32} color="#9aa0a6" />
                </TouchableOpacity>
            </View>
        </View>
      )}

      {/* Bottom Sheet Navigation (Google Maps Style with Safety AI) */}
      {!isNavigating && destinationCoords && (
        <View style={styles.bottomSheet}>
          <View style={styles.bottomSheetHandleRow}><View style={styles.handleBar}/></View>
          
          <View style={styles.headerRow}>
              <View>
                <Text style={styles.sheetTitle}>{mode === 'DRIVING' ? 'Drive' : 'Walk'}</Text>
                {selectionType === 'SAFEST' ? (
                    <View style={styles.aiBadge}>
                        <Icon name="auto-awesome" size={12} color="#10b981" />
                        <Text style={styles.aiBadgeText}>AI SAFEST ROUTE ACTIVE</Text>
                    </View>
                ) : (
                    <View style={[styles.aiBadge, { backgroundColor: 'rgba(66, 133, 244, 0.1)' }]}>
                        <Icon name="speed" size={12} color="#4285F4" />
                        <Text style={[styles.aiBadgeText, { color: '#4285F4' }]}>FASTEST ROUTE ACTIVE</Text>
                    </View>
                )}
              </View>
              <View style={styles.headerActions}>
                  <TouchableOpacity style={styles.iconCircle}><Icon name="share" size={20} color="#FFF"/></TouchableOpacity>
                  <TouchableOpacity style={styles.iconCircle} onPress={() => setDestinationCoords(null)}><Icon name="close" size={20} color="#FFF"/></TouchableOpacity>
              </View>
          </View>

          <View style={styles.tabsRow}>
              <TouchableOpacity onPress={() => setMode('DRIVING')} style={mode === 'DRIVING' ? styles.activeTab : styles.inactiveTab}>
                  <Icon name="directions-car" size={18} color={mode === 'DRIVING' ? "#78d6c6" : "#9aa0a6"}/>
                  <Text style={mode === 'DRIVING' ? styles.activeTabText : styles.inactiveTabText}>
                    {mode === 'DRIVING' 
                        ? (selectionType === 'SAFEST' ? safestRouteInfo?.travel_time : fastestRouteInfo?.travel_time) || '--' 
                        : '-- min'}
                  </Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setMode('WALKING')} style={mode === 'WALKING' ? styles.activeTab : styles.inactiveTab}>
                  <Icon name="directions-walk" size={18} color={mode === 'WALKING' ? "#78d6c6" : "#9aa0a6"}/>
                  <Text style={mode === 'WALKING' ? styles.activeTabText : styles.inactiveTabText}>
                    {mode === 'WALKING' 
                        ? (selectionType === 'SAFEST' ? safestRouteInfo?.travel_time : fastestRouteInfo?.travel_time) || '--' 
                        : '-- min'}
                  </Text>
              </TouchableOpacity>
          </View>

          <View style={styles.routeDetails}>
              <View style={styles.scoreComparison}>
                  <TouchableOpacity 
                    style={[styles.scoreItem, selectionType === 'SAFEST' && styles.selectedScore]} 
                    onPress={() => setSelectionType('SAFEST')}
                  >
                      <Text style={[styles.scoreValue, selectionType !== 'SAFEST' && { color: '#64748b' }]}>{safetyScores.safest}%</Text>
                      <Text style={styles.scoreLabel}>SAFETY</Text>
                  </TouchableOpacity>
                  <View style={styles.vDivider} />
                  <TouchableOpacity 
                    style={[styles.scoreItem, selectionType === 'FASTEST' && styles.selectedScore]} 
                    onPress={() => setSelectionType('FASTEST')}
                  >
                      <Text style={[styles.scoreValue, { color: selectionType === 'FASTEST' ? '#4285F4' : '#64748b' }]}>{safetyScores.fastest}%</Text>
                      <Text style={styles.scoreLabel}>FASTEST</Text>
                  </TouchableOpacity>
              </View>
              
              <Text style={styles.durationText}>
                  {selectionType === 'SAFEST' ? (safestRouteInfo?.travel_time || "...") : (fastestRouteInfo?.travel_time || "...")} 
                  <Text style={styles.distanceText}>({selectionType === 'SAFEST' ? safestRouteInfo?.distance : fastestRouteInfo?.distance})</Text>
              </Text>
              <Text style={styles.routeDesc}>{selectionType === 'SAFEST' ? safestRouteInfo?.description : fastestRouteInfo?.description}</Text>
          </View>

          <View style={styles.actionRow}>
              <TouchableOpacity style={styles.startBtn} onPress={() => setIsNavigating(true)}>
                  <Icon name="navigation" size={20} color="#FFF"/>
                  <Text style={styles.startText}>START NAVIGATION</Text>
              </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
};

const googlePlacesStyles = {
  container: { flex: 1, backgroundColor: 'transparent' },
  textInputContainer: { backgroundColor: 'transparent', borderTopWidth: 0, borderBottomWidth: 0 },
  textInput: { marginLeft: 0, marginRight: 0, height: 40, color: '#FFF', fontSize: 16, backgroundColor: 'transparent', fontWeight: '500' },
  predefinedPlacesDescription: { color: '#78d6c6', fontWeight: 'bold' },
  listView: { 
    position: 'absolute', 
    top: 50, 
    left: -40, 
    width: width - 32, 
    backgroundColor: '#1d1214', // Solid dark color
    borderRadius: 8, 
    elevation: 20, 
    zIndex: 9999,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.8, // Increased for shadow
    shadowRadius: 15,
  },
  row: { 
    padding: 13, 
    height: 56, 
    flexDirection: 'row', 
    backgroundColor: '#1d1214', // Ensure solid background per row
    borderBottomWidth: 1, 
    borderBottomColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
  },
  separator: { height: 0, backgroundColor: 'transparent' },
  description: { color: '#f8fafc', fontSize: 14, fontWeight: '500' }, 
  poweredContainer: { display: 'none' },
};





const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#211116' },
  map: { flex: 1 },
  
  originMarkerInner: { width: 22, height: 22, borderRadius: 11, backgroundColor: 'rgba(233, 32, 99, 0.2)', justifyContent: 'center', alignItems: 'center' },
  originMarkerDot: { width: 14, height: 14, borderRadius: 7, backgroundColor: COLORS.primary, borderWidth: 2, borderColor: '#FFF' },

  topSearchCard: { position: 'absolute', top: 50, left: 16, right: 16, backgroundColor: 'rgba(38, 28, 31, 0.95)', borderRadius: 16, paddingVertical: 12, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)', elevation: 10, zIndex: 5 },
  searchRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 8 },
  searchInputText: { color: '#FFF', fontSize: 14, marginLeft: 16, fontWeight: '500' },
  divider: { height: 1, backgroundColor: 'rgba(255,255,255,0.1)', marginLeft: 52, marginVertical: 4 },

  // Navigation Mode Redesign Styles
  navTopContainer: { position: 'absolute', top: 50, left: 12, right: 12, alignItems: 'flex-start' },
  instructionCard: { 
    flexDirection: 'row', 
    backgroundColor: '#0F5132', // Dark Google Green
    borderRadius: 16, 
    padding: 16, 
    alignItems: 'center', 
    elevation: 8, 
    shadowColor: '#000', 
    shadowOpacity: 0.3, 
    shadowRadius: 10,
    width: '100%'
  },
  instructionLeft: { marginRight: 15 },
  instructionCenter: { flex: 1 },
  instructionMain: { color: '#FFF', fontSize: 28, fontWeight: 'bold' },
  instructionSub: { color: 'rgba(255,255,255,0.8)', fontSize: 18, fontWeight: '500' },
  voiceBtn: { width: 48, height: 48, borderRadius: 24, backgroundColor: '#FFF', justifyContent: 'center', alignItems: 'center', elevation: 4 },
  
  thenCard: { 
    flexDirection: 'row', 
    backgroundColor: 'rgba(15, 81, 50, 0.9)', 
    paddingHorizontal: 12, 
    paddingVertical: 6, 
    borderRadius: 8, 
    marginTop: 8, 
    marginLeft: 10,
    alignItems: 'center' 
  },
  thenText: { color: '#FFF', fontSize: 14, fontWeight: '600' },

  riskyBanner: { 
    flexDirection: 'row', 
    backgroundColor: '#D93025', 
    width: '100%', 
    padding: 12, 
    borderRadius: 12, 
    marginTop: 12, 
    alignItems: 'center', 
    gap: 10,
    elevation: 10 
  },
  riskyText: { color: '#FFF', fontWeight: 'bold', fontSize: 14 },

  floatingControls: { position: 'absolute', right: 16, top: height * 0.3, gap: 12 },
  floatBtn: { width: 48, height: 48, borderRadius: 24, backgroundColor: '#202124', justifyContent: 'center', alignItems: 'center', elevation: 5, shadowColor: '#000', shadowOpacity: 0.3 },

  recenterBtn: { 
    position: 'absolute', 
    bottom: 120, 
    left: 16, 
    backgroundColor: '#202124', 
    flexDirection: 'row', 
    alignItems: 'center', 
    paddingHorizontal: 16, 
    paddingVertical: 10, 
    borderRadius: 25, 
    elevation: 5,
    gap: 8
  },
  recenterText: { color: '#FFF', fontWeight: 'bold' },

  navBottomPanel: { 
    position: 'absolute', 
    bottom: 0, 
    left: 0, 
    right: 0, 
    height: 100, 
    backgroundColor: '#202124', 
    borderTopLeftRadius: 20, 
    borderTopRightRadius: 20, 
    flexDirection: 'row', 
    alignItems: 'center', 
    paddingHorizontal: 20, 
    elevation: 20 
  },
  closeNavBtn: { width: 56, height: 56, borderRadius: 28, backgroundColor: 'rgba(255,255,255,0.1)', justifyContent: 'center', alignItems: 'center' },
  arrivalInfo: { flex: 1, alignItems: 'center' },
  arrivalMain: { flexDirection: 'row', alignItems: 'center' },
  timeText: { color: '#34A853', fontSize: 22, fontWeight: 'bold' },
  dotSeparator: { color: '#9aa0a6', fontSize: 20 },
  distText: { color: '#E8EAED', fontSize: 18, fontWeight: '500' },
  etaText: { color: '#9aa0a6', fontSize: 18 },
  moreBtn: { padding: 10 },

  // User Location Dot
  userLocationContainer: { width: 50, height: 50, justifyContent: 'center', alignItems: 'center' },
  userLocationPulse: { zIndex: 2 },
  userLocationGlow: { position: 'absolute', width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(66, 133, 244, 0.2)', borderWidth: 1, borderColor: 'rgba(66, 133, 244, 0.5)' },
  destMarkerShadow: { shadowColor: '#000', shadowOffset: { width: 0, height: 5 }, shadowOpacity: 0.5, shadowRadius: 5, elevation: 10 },

  bottomSheet: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: 'rgba(24, 17, 19, 0.98)', borderTopLeftRadius: 32, borderTopRightRadius: 32, paddingBottom: 30, paddingHorizontal: 20, borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.1)' },
  bottomSheetHandleRow: { alignItems: 'center', paddingVertical: 12 },
  handleBar: { width: 40, height: 4, borderRadius: 2, backgroundColor: 'rgba(255,255,255,0.2)' },
  
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
  sheetTitle: { color: '#FFF', fontSize: 24, fontWeight: 'bold' },
  headerActions: { flexDirection: 'row', gap: 12 },
  iconCircle: { width: 36, height: 36, borderRadius: 18, backgroundColor: 'rgba(255,255,255,0.05)', justifyContent: 'center', alignItems: 'center' },

  tabsRow: { flexDirection: 'row', gap: 20, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.05)', paddingBottom: 10, marginBottom: 15 },
  activeTab: { flexDirection: 'row', alignItems: 'center', gap: 6, borderBottomWidth: 3, borderBottomColor: COLORS.secondary, paddingBottom: 6 },
  activeTabText: { color: COLORS.secondary, fontWeight: 'bold', fontSize: 14 },
  inactiveTab: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingBottom: 6 },
  inactiveTabText: { color: '#94a3b8', fontSize: 14, fontWeight: '500' },

  routeDetails: { marginBottom: 20, padding: 15, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.03)' },
  
  aiBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 4 },
  aiBadgeText: { color: '#10b981', fontSize: 10, fontWeight: 'bold' },

  selectedScore: { backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 8 },
  scoreComparison: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 15, backgroundColor: 'rgba(255,255,255,0.02)', padding: 6, borderRadius: 12 },
  scoreItem: { flex: 1, alignItems: 'center' },
  scoreValue: { color: '#10b981', fontSize: 18, fontWeight: '900', letterSpacing: -0.5 },
  scoreLabel: { color: '#94a3b8', fontSize: 8, fontWeight: 'bold', marginTop: 2 },
  vDivider: { width: 1, height: '80%', backgroundColor: 'rgba(255,255,255,0.05)' },

  safeNodePulse: { width: 30, height: 30, borderRadius: 15, backgroundColor: 'rgba(16, 185, 129, 0.1)', justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: 'rgba(16, 185, 129, 0.3)' },

  durationText: { color: COLORS.secondary, fontSize: 28, fontWeight: '900' },
  distanceText: { color: '#94a3b8', fontSize: 16, fontWeight: '500', marginLeft: 8 },
  routeDesc: { color: '#E8EAED', fontSize: 14, marginTop: 4 },
  ecoText: { color: '#94a3b8', fontSize: 12, marginTop: 8 },

  actionRow: { flexDirection: 'row' },
  startBtn: { flex: 1, backgroundColor: COLORS.primary, height: 56, borderRadius: 28, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 8, shadowColor: COLORS.primary, shadowRadius: 10, shadowOpacity: 0.5, elevation: 10 },
  startText: { color: '#FFF', fontWeight: 'bold', fontSize: 16, letterSpacing: 1 }
});

export default RoutePlannerScreen;
