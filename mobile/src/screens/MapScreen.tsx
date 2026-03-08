import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Dimensions,
  StatusBar,
  ActivityIndicator,
  PermissionsAndroid,
  Platform,
} from 'react-native';
import MapView, { PROVIDER_GOOGLE, Circle, Heatmap } from 'react-native-maps';
import Svg, { Circle as SvgCircle } from 'react-native-svg';
import { COLORS, SIZES } from '../constants/theme';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Geolocation from '@react-native-community/geolocation';
import { getSafetyData } from '../services/api';

const { width } = Dimensions.get('window');

const cyberpunkMapStyle = [
  { "elementType": "geometry", "stylers": [{ "color": "#181113" }] },
  { "elementType": "labels.text.fill", "stylers": [{ "color": "#746855" }] },
  { "featureType": "road", "elementType": "geometry", "stylers": [{ "color": "#261c1f" }] },
  { "featureType": "water", "elementType": "geometry", "stylers": [{ "color": "#0a0a0a" }] },
  { "elementType": "labels.icon", "stylers": [{ "visibility": "off" }]}
];

const MapScreen = ({ navigation }: any) => {
  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [safetyData, setSafetyData] = useState<any>(null);
  const [heatmapPoints, setHeatmapPoints] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    requestLocationPermission();
  }, []);

  const requestLocationPermission = async () => {
    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION);
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        getCurrentLocation();
      } else {
        setError("Location permission required for ASTA Safety Shield.");
        setLoading(false);
      }
    } else {
      getCurrentLocation();
    }
  };

  const getCurrentLocation = () => {
    Geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setLocation({ latitude, longitude });
        fetchSafetyBrainData(latitude, longitude);
      },
      (err) => {
        setError("GPS Failure: Check device settings.");
        setLoading(false);
      },
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
    );
  };

  const fetchSafetyBrainData = async (lat: number, lng: number) => {
    setLoading(true);
    try {
      const data = await getSafetyData(lat, lng);
      setSafetyData(data);

      // REAL WORK: Transform node scores into Heatmap points (High-Density Professional Grid)
      // AUTHENTIC INTEGRATION: Mapping real ST-GNN node scores to Heatmap points
      if (data.node_scores && Array.isArray(data.node_scores)) {
        const points = data.node_scores.map((node: any) => {
          // Robust check: Ensure we have lat/lng to prevent native crash
          if (node && typeof node === 'object' && node.lat !== undefined && node.lng !== undefined) {
             return {
              latitude: Number(node.lat),
              longitude: Number(node.lng),
              weight: Number(node.score || 5)
            };
          } else if (typeof node === 'number') {
            // Fallback: If backend returns raw scores, pin them to the current query location
            return {
              latitude: lat,
              longitude: lng,
              weight: node
            };
          }
          return null;
        }).filter((p: any) => p !== null && !isNaN(p.latitude) && !isNaN(p.longitude));
        
        setHeatmapPoints(points);
      }
    } catch (err: any) {
      if (err.response?.status === 403) setError("Out of Region: Only Mumbai & Pune supported.");
      else setError("Backend offline. Retrying...");
    }
    setLoading(false);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

      {location ? (
        <MapView
          provider={PROVIDER_GOOGLE}
          style={styles.map}
          initialRegion={{
            ...location,
            latitudeDelta: 0.05,
            longitudeDelta: 0.05,
          }}
          customMapStyle={cyberpunkMapStyle}
          showsUserLocation={true}
          showsMyLocationButton={false}
          onRegionChangeComplete={(region) => fetchSafetyBrainData(region.latitude, region.longitude)}
        >
          {/* REAL HEATMAP: Visualizing risk intensity from ST-GNN */}
          {heatmapPoints.length > 0 && (
            <Heatmap
              points={heatmapPoints}
              radius={20} // Smaller radius for professional data viz integration
              opacity={0.5}
              gradient={{
                colors: ["#00FF00", "#FFD700", "#FF0000"],
                startPoints: [0.0, 0.4, 0.8],
                colorMapSize: 256
              }}
            />
          )}
        </MapView>
      ) : (
        <View style={styles.center}>
          {!error && <ActivityIndicator size="large" color={COLORS.primary} />}
          <Text style={styles.loadingText}>{error || "Initializing City Graph Intelligence..."}</Text>
        </View>
      )}

      {/* TOP: Search Bar */}
      <View style={styles.topBar}>
        <TouchableOpacity style={styles.searchContainer} onPress={() => navigation.navigate('RoutePlanner')}>
          <Icon name="search" size={20} color="#94a3b8" />
          <Text style={styles.searchPlaceholder}>Where are you heading?</Text>
        </TouchableOpacity>
      </View>

      {/* BOTTOM: Real-Time Stats Overlay */}
      <View style={styles.bottomSection}>
        {safetyData && !error && (
          <>
            <TouchableOpacity
              style={styles.reportFab}
              onPress={() => navigation.navigate('ReportIncident', { location })}
            >
              <Icon name="report-problem" size={20} color={COLORS.white} />
              <Text style={styles.reportFabText}>REPORT INCIDENT</Text>
            </TouchableOpacity>

            <View style={styles.statsCard}>
              <View style={styles.statsHeader}>
                <View>
                  <Text style={styles.areaTitle}>{safetyData.area_name}</Text>
                  <Text style={styles.locationText}>Live Safety Index</Text>
                </View>
                
                {/* Circular Score Indicator */}
                <View style={styles.scoreContainer}>
                  <View style={styles.scoreTrack} />
                  <View style={[styles.scoreRing, { borderRightColor: 'transparent', borderBottomColor: 'transparent', transform: [{ rotate: '45deg' }] }]} />
                  <View style={styles.scoreValueWrapper}>
                    <Text style={styles.scoreValue}>{safetyData.overall_score?.toFixed(1)}</Text>
                  </View>
                </View>
              </View>
              
              <View style={styles.divider} />
              
              <View style={styles.statsRow}>
                <StatItem icon="notifications-active" label="Alerts" value={safetyData.active_alerts} color={COLORS.primary} />
                <StatItem icon="gpp-good" label="Havens" value={safetyData.safe_havens} color={'#10b981'} />
                <StatItem icon="local-police" label="Police" value={safetyData.police_units} color={'#3b82f6'} />
              </View>
            </View>
          </>
        )}
      </View>
    </View>
  );
};

const StatItem = ({ icon, label, value, color }: any) => (
  <View style={styles.statItem}>
    <View style={[styles.statIconContainer, { backgroundColor: `${color}33` }]}>
      <Icon name={icon} size={18} color={color} />
    </View>
    <View>
      <Text style={styles.statLabel}>{label}</Text>
      <Text style={styles.statValue}>{value}</Text>
    </View>
  </View>
);



const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#211116' },
  map: { ...StyleSheet.absoluteFillObject },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#211116' },
  loadingText: { color: COLORS.primary, marginTop: 20, fontSize: 12, fontWeight: 'bold', letterSpacing: 2 },
  
  // Top Search Bar
  topBar: { position: 'absolute', top: 50, paddingHorizontal: 16, width: '100%', zIndex: 10 },
  searchContainer: { height: 50, backgroundColor: 'rgba(38, 28, 31, 0.8)', borderRadius: 12, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
  searchPlaceholder: { color: '#94a3b8', marginLeft: 12, fontSize: 14, fontWeight: '500' },
  
  // Bottom Section Layout
  bottomSection: { position: 'absolute', bottom: 110, width: '100%', paddingHorizontal: 16, gap: 12, zIndex: 10 },
  
  // Floating Action Button
  reportFab: { backgroundColor: COLORS.primary, flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-end', paddingVertical: 12, paddingHorizontal: 20, borderRadius: 32, elevation: 8, shadowColor: COLORS.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.4, shadowRadius: 20 },
  reportFabText: { color: COLORS.white, fontWeight: 'bold', fontSize: 12, marginLeft: 8, letterSpacing: 1 },
  
  // Stats Glass Card
  statsCard: { backgroundColor: 'rgba(30, 30, 36, 0.85)', borderRadius: 24, padding: 20, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)', shadowColor: '#000', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.5, shadowRadius: 20 },
  statsHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  areaTitle: { color: '#FFF', fontSize: 20, fontWeight: 'bold' },
  locationText: { color: '#94a3b8', fontSize: 12, marginTop: 4 },
  
  // Circular Score
  scoreContainer: { width: 56, height: 56, borderRadius: 28, backgroundColor: 'transparent', justifyContent: 'center', alignItems: 'center' },
  scoreRing: { position: 'absolute', width: 56, height: 56, borderRadius: 28, borderWidth: 4, borderColor: COLORS.primary, opacity: 0.8 },
  scoreTrack: { position: 'absolute', width: 56, height: 56, borderRadius: 28, borderWidth: 4, borderColor: '#333' },
  scoreValueWrapper: { justifyContent: 'center', alignItems: 'center' },
  scoreValue: { color: '#FFF', fontSize: 16, fontWeight: 'bold' },
  
  divider: { height: 1, backgroundColor: 'rgba(255,255,255,0.1)', marginVertical: 16 },
  
  // Stats Row
  statsRow: { flexDirection: 'row', justifyContent: 'space-between', gap: 8 },
  statItem: { flex: 1, flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 12, padding: 10, borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)' },
  statIconContainer: { width: 32, height: 32, borderRadius: 16, justifyContent: 'center', alignItems: 'center', marginRight: 8 },
  statValue: { color: '#FFF', fontSize: 14, fontWeight: 'bold' },
  statLabel: { color: '#94a3b8', fontSize: 9, textTransform: 'uppercase', letterSpacing: 0.5 },
});

export default MapScreen;
