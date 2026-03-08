import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  StatusBar,
  SafeAreaView,
  ScrollView,
  Alert,
  PermissionsAndroid,
  ActivityIndicator,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { COLORS } from '../constants/theme';
import { useAppSelector } from '../store';
import { registerUser } from '../services/api';

const RegisterPermissionsScreen = ({ navigation }: any) => {
  const userProfile = useAppSelector((state) => state.auth.user);
  const [loading, setLoading] = useState(false);

  const requestPermission = async (type: 'location' | 'mic') => {
    try {
      const permission = type === 'location'
        ? PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
        : PermissionsAndroid.PERMISSIONS.RECORD_AUDIO;

      const granted = await PermissionsAndroid.request(permission);

      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        Alert.alert("Permission Granted", `Thank you for enabling ${type}.`);
      }
    } catch (err) {
      console.warn(err);
    }
  };

  const handleFinish = async () => {
    setLoading(true);
    try {
      // Direct registration - No OTP
      await registerUser(userProfile);
      setLoading(false);
      // FIXED: Navigate directly to Main dashboard (MainTabs)
      Alert.alert('Success', 'Welcome to ASTA Safety Network!', [
        { text: 'Start Journey', onPress: () => navigation.navigate('Main') }
      ]);
    } catch (error: any) {
      setLoading(false);
      console.error('Registration Error:', error);
      Alert.alert('Error', 'Unable to reach the safety cloud. Please check your internet.');
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
      <LinearGradient colors={['#E91E63', '#9C27B0']} style={styles.gradient}>
        <SafeAreaView style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Icon name="chevron-left" size={32} color="#FFF" />
          </TouchableOpacity>
          <View style={styles.headerTitleContainer}>
            <Text style={styles.stepText}>Step 6 of 6</Text>
            <Text style={styles.permissionsLabel}>PERMISSIONS</Text>
          </View>
        </SafeAreaView>

        <View style={styles.glassCard}>
          <ScrollView showsVerticalScrollIndicator={false}>
            <Text style={styles.title}>Final Step</Text>
            <Text style={styles.subText}>Grant the necessary access to activate your personal safety shield.</Text>

            <View style={styles.permissionList}>
              <PermissionItem
                icon="location-on"
                title="Location Services"
                description="Required for real-time tracking and safety heat maps."
                onAllow={() => requestPermission('location')}
              />
              <PermissionItem
                icon="notifications"
                title="Notifications"
                description="Receive urgent safety alerts and check-ins."
                onAllow={() => Alert.alert("Notifications", "ASTA will now send you safety updates.")}
              />
              <PermissionItem
                icon="mic"
                title="Microphone"
                description="Used for emergency audio recording when SOS is triggered."
                onAllow={() => requestPermission('mic')}
              />
            </View>
          </ScrollView>

          <View style={styles.footer}>
            <TouchableOpacity
              style={styles.finishBtn}
              onPress={handleFinish}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#FFF" />
              ) : (
                <Text style={styles.finishBtnText}>FINISH SETTING UP</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </LinearGradient>
    </View>
  );
};

const PermissionItem = ({ icon, title, description, onAllow }: any) => (
  <View style={styles.permissionItem}>
    <View style={styles.iconContainer}><Icon name={icon} size={24} color={COLORS.primary} /></View>
    <View style={styles.permissionTextContainer}>
      <Text style={styles.permissionTitle}>{title}</Text>
      <Text style={styles.permissionDescription}>{description}</Text>
    </View>
    <TouchableOpacity style={styles.enableBtn} onPress={onAllow}>
      <Text style={styles.enableBtnText}>ALLOW</Text>
    </TouchableOpacity>
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1 },
  gradient: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', marginTop: 20, paddingHorizontal: 20, justifyContent: 'center' },
  backBtn: { position: 'absolute', left: 20, top: 20 },
  headerTitleContainer: { alignItems: 'center' },
  stepText: { color: '#FFF', fontSize: 14, fontWeight: '500' },
  permissionsLabel: { color: 'rgba(255,255,255,0.6)', fontSize: 10, fontWeight: 'bold', letterSpacing: 2, marginTop: 4 },
  glassCard: { flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.85)', marginTop: 40, borderTopLeftRadius: 40, borderTopRightRadius: 40, padding: 32, borderWidth: 1, borderColor: 'rgba(233, 30, 99, 0.2)' },
  title: { color: COLORS.primary, fontSize: 24, fontWeight: 'bold', marginBottom: 8 },
  subText: { color: 'rgba(255,255,255,0.7)', fontSize: 14, marginBottom: 32 },
  permissionList: { gap: 24 },
  permissionItem: { flexDirection: 'row', alignItems: 'flex-start', gap: 16 },
  iconContainer: { width: 44, height: 44, borderRadius: 22, backgroundColor: 'rgba(233, 30, 99, 0.1)', alignItems: 'center', justifyContent: 'center' },
  permissionTextContainer: { flex: 1 },
  permissionTitle: { color: '#FFF', fontSize: 16, fontWeight: 'bold', marginBottom: 4 },
  permissionDescription: { color: 'rgba(255,255,255,0.5)', fontSize: 12, lineHeight: 18 },
  enableBtn: { paddingVertical: 8, paddingHorizontal: 12, borderRadius: 8, backgroundColor: 'rgba(255,255,255,0.05)' },
  enableBtnText: { color: COLORS.primary, fontSize: 10, fontWeight: 'bold' },
  footer: { marginTop: 'auto', paddingTop: 20 },
  finishBtn: { backgroundColor: COLORS.primary, height: 56, borderRadius: 28, alignItems: 'center', justifyContent: 'center', elevation: 8 },
  finishBtnText: { color: '#FFF', fontWeight: 'bold', letterSpacing: 1, fontSize: 14 },
});

export default RegisterPermissionsScreen;
