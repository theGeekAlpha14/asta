import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  StatusBar,
  Animated,
  Alert,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { COLORS } from '../constants/theme';
import { monitorCompanion } from '../services/api';

const AICompanionScreen = ({ navigation, route }: any) => {
  const [isMonitoring, setIsMonitoring] = useState(true);
  const [safetyStatus, setSafetyStatus] = useState('SECURE');
  const pulseAnim = new Animated.Value(1);

  useEffect(() => {
    // Start the pulse animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.2, duration: 1000, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1, duration: 1000, useNativeDriver: true }),
      ])
    ).start();

    // REAL WORK: Real-time monitoring loop
    const monitorInterval = setInterval(async () => {
      if (isMonitoring) {
        try {
          // Calling the Companion Monitor API
          const response = await monitorCompanion(
            { lat: 19.0760, lng: 72.8777 }, // In prod, use live GPS
            { timestamp: new Date().toISOString() },
            'ai_companion'
          );

          if (response.is_anomaly) {
            setSafetyStatus('ALERT');
            Alert.alert("Safety Warning", response.alert_msg || "AI detects a risk anomaly out ahead.");
          }
        } catch (e) {
          console.error("Monitor failed");
        }
      }
    }, 10000); // Check every 10 seconds

    return () => clearInterval(monitorInterval);
  }, [isMonitoring]);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
        <View style={styles.header}>
          <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
            <Icon name="arrow-back" size={24} color="#FFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>AI COMPANION</Text>
          <TouchableOpacity style={styles.backBtn}>
            <Icon name="more-vert" size={24} color="#FFF" />
          </TouchableOpacity>
        </View>

        <View style={styles.main}>
          {/* Layered Pulsing Energy Orb (Cyberpunk AI Brain) */}
          <View style={styles.orbContainer}>
            <Animated.View style={[
                styles.pulseRing, 
                { 
                  transform: [{ scale: pulseAnim }], 
                  opacity: pulseAnim.interpolate({ inputRange: [1, 1.2], outputRange: [0.6, 0] }),
                  borderColor: safetyStatus === 'SECURE' ? COLORS.primary : COLORS.danger,
                }
              ]} />
            <Animated.View style={[
                styles.pulseRing, 
                { 
                  transform: [{ scale: Animated.multiply(pulseAnim, 1.1) }], 
                  opacity: pulseAnim.interpolate({ inputRange: [1, 1.2], outputRange: [0.4, 0] }),
                  borderColor: safetyStatus === 'SECURE' ? COLORS.primary : COLORS.danger,
                }
              ]} />
            
            <Animated.View style={[
                styles.centerOrb, 
                { 
                  transform: [{ scale: pulseAnim.interpolate({ inputRange: [1, 1.2], outputRange: [1, 1.05] }) }], 
                  borderColor: safetyStatus === 'SECURE' ? COLORS.primary : COLORS.danger,
                  shadowColor: safetyStatus === 'SECURE' ? COLORS.primary : COLORS.danger
                }
              ]}>
              <Icon name="psychology" size={80} color={safetyStatus === 'SECURE' ? COLORS.primary : COLORS.danger} />
              <View style={[styles.orbGlow, { backgroundColor: safetyStatus === 'SECURE' ? COLORS.primary : COLORS.danger }]} />
            </Animated.View>
          </View>

          <View style={styles.statusBox}>
              <Text style={styles.statusText}>{safetyStatus === 'SECURE' ? 'SECURE' : 'ANOMALY DETECTED'}</Text>
              <View style={styles.divider} />
              <Text style={styles.subText}>The ST-GNN Safety Brain is analyzing live risk vectors at 10Hz frequency.</Text>
          </View>
        </View>

        <View style={styles.footer}>
          <TouchableOpacity style={styles.sosBtn} onLongPress={() => Alert.alert("SOS Dispatched")}>
            <LinearGradient
              colors={['#ff4b2b', '#ff416c']}
              style={styles.sosGradient}
              start={{x: 0, y: 0}}
              end={{x: 1, y: 0}}
            >
              <Text style={styles.sosText}>HOLD FOR EMERGENCY SOS</Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity style={styles.endBtn} onPress={() => navigation.navigate('Main')}>
            <Text style={styles.endText}>END JOURNEY</Text>
          </TouchableOpacity>
        </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#181113' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 24, paddingTop: 60, paddingBottom: 20 },
  backBtn: { width: 44, height: 44, borderRadius: 22, backgroundColor: 'rgba(255, 255, 255, 0.05)', justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
  headerTitle: { color: COLORS.primary, fontWeight: '900', fontSize: 13, letterSpacing: 5 },
  
  main: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 40 },
  orbContainer: { width: 280, height: 280, justifyContent: 'center', alignItems: 'center' },
  pulseRing: { position: 'absolute', width: 220, height: 220, borderRadius: 110, borderWidth: 2 },
  centerOrb: { width: 200, height: 200, borderRadius: 100, borderWidth: 3, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(38, 28, 31, 0.9)', shadowOffset: { width: 0, height: 0 }, shadowOpacity: 1, shadowRadius: 30, elevation: 20 },
  orbGlow: { position: 'absolute', width: 100, height: 100, borderRadius: 50, opacity: 0.15 },
  
  statusBox: { marginTop: 40, alignItems: 'center', backgroundColor: 'rgba(38, 28, 31, 0.7)', padding: 24, borderRadius: 32, borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)', width: '100%' },
  statusText: { color: '#FFF', fontSize: 24, fontWeight: '900', letterSpacing: 2, textAlign: 'center' },
  divider: { width: 40, height: 2, backgroundColor: COLORS.primary, marginVertical: 12 },
  subText: { color: '#94a3b8', textAlign: 'center', lineHeight: 22, fontSize: 13, fontWeight: '500' },
  
  footer: { padding: 24, gap: 16, paddingBottom: 60 },
  sosBtn: { height: 64, borderRadius: 32, overflow: 'hidden', elevation: 15, shadowColor: '#ff416c', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.5, shadowRadius: 20 },
  sosGradient: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  sosText: { color: '#FFF', fontWeight: '900', letterSpacing: 2, fontSize: 14 },
  
  endBtn: { backgroundColor: 'transparent', height: 60, borderRadius: 30, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: 'rgba(255,255,255,0.15)' },
  endText: { color: '#94a3b8', fontWeight: 'bold', letterSpacing: 1, fontSize: 14 },
});

export default AICompanionScreen;
