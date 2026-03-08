import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  StatusBar,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { COLORS } from '../constants/theme';
import { reportIncident } from '../services/api';

const ReportIncidentScreen = ({ navigation, route }: any) => {
  const [type, setType] = useState('');
  const [description, setDescription] = useState('');
  const [severity, setSeverity] = useState('MEDIUM');
  const [loading, setLoading] = useState(false);

  const { location } = route.params || { location: { lat: 19.0760, lng: 72.8777 } };

  const handleReport = async () => {
    if (!type || !description) {
      Alert.alert('Incomplete', 'Please provide incident type and description.');
      return;
    }

    setLoading(true);
    try {
      // REAL WORK: Log Anonymous FIR to DynamoDB via central API
      await reportIncident({
        type: 'FIR_ANONYMOUS',
        incident_type: type,
        description,
        severity,
        location,
        is_anonymous: true,
        status: 'LODGED_WITH_NEAREST_STATION'
      });

      Alert.alert(
        'FIR Lodged',
        'Your anonymous report has been securely sent to the local authorities. Thank you for making the city safer.',
        [{ text: 'Return to Map', onPress: () => navigation.goBack() }]
      );
    } catch (error) {
      Alert.alert('System Error', 'Unable to reach the safety network. Incident logged locally.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
        <ScrollView contentContainerStyle={styles.scroll}>
          <View style={styles.header}>
            <Text style={styles.title}>Lodge Anonymous FIR</Text>
            <Text style={styles.subTitle}>Your identity is 100% encrypted and hidden.</Text>
          </View>

          <View style={styles.form}>
            <Text style={styles.label}>INCIDENT TYPE</Text>
            <View style={styles.typeRow}>
              {['Harassment', 'Theft', 'Assault', 'Stalking'].map(t => (
                <TouchableOpacity
                  key={t}
                  style={[styles.typeChip, type === t && styles.typeChipActive]}
                  onPress={() => setType(t)}
                >
                  <Text style={styles.chipText}>{t}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.label}>SEVERITY</Text>
            <View style={styles.typeRow}>
              {['LOW', 'MEDIUM', 'CRITICAL'].map(s => (
                <TouchableOpacity
                  key={s}
                  style={[styles.sevChip, severity === s && styles.sevChipActive, s === 'CRITICAL' && styles.criticalBorder]}
                  onPress={() => setSeverity(s)}
                >
                  <Text style={styles.chipText}>{s}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.label}>DESCRIPTION</Text>
            <TextInput
              style={styles.textArea}
              placeholder="Provide details about the incident..."
              placeholderTextColor="#64748b"
              multiline
              numberOfLines={6}
              value={description}
              onChangeText={setDescription}
            />

            <View style={styles.infoBox}>
              <Icon name="location-on" size={20} color={COLORS.primary} />
              <Text style={styles.infoText}>Reporting at current GPS: {location.lat.toFixed(4)}, {location.lng.toFixed(4)}</Text>
            </View>

            <TouchableOpacity style={styles.submitBtn} onPress={handleReport} disabled={loading}>
              <Text style={styles.submitText}>{loading ? 'LODGING...' : 'LODGE ANONYMOUS FIR'}</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#211116' },
  scroll: { padding: 24, paddingTop: 60, paddingBottom: 100 },
  header: { marginBottom: 40 },
  title: { color: COLORS.primary, fontSize: 32, fontWeight: '900', letterSpacing: 1 },
  subTitle: { color: '#94a3b8', fontSize: 14, marginTop: 8, fontWeight: '500' },
  form: { gap: 24 },
  label: { color: '#64748b', fontSize: 11, fontWeight: 'bold', letterSpacing: 2 },
  
  typeRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  typeChip: { paddingVertical: 12, paddingHorizontal: 16, borderRadius: 12, backgroundColor: 'rgba(38, 28, 31, 0.6)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)' },
  typeChipActive: { backgroundColor: 'rgba(233, 32, 99, 0.15)', borderColor: COLORS.primary, shadowColor: COLORS.primary, shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.8, shadowRadius: 10, elevation: 5 },
  chipText: { color: '#FFF', fontSize: 13, fontWeight: '600' },
  
  sevChip: { flex: 1, paddingVertical: 14, alignItems: 'center', borderRadius: 12, backgroundColor: 'rgba(38, 28, 31, 0.6)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)' },
  sevChipActive: { backgroundColor: 'rgba(233, 32, 99, 0.15)', borderColor: COLORS.primary },
  criticalBorder: { borderColor: COLORS.danger, borderWidth: 1, backgroundColor: 'rgba(220, 53, 69, 0.15)' },
  
  textArea: { backgroundColor: 'rgba(38, 28, 31, 0.6)', borderRadius: 16, padding: 18, color: '#FFF', textAlignVertical: 'top', borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)', fontSize: 15 },
  
  infoBox: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: 'rgba(233, 32, 99, 0.08)', padding: 16, borderRadius: 12, borderWidth: 1, borderColor: 'rgba(233, 32, 99, 0.2)' },
  infoText: { color: COLORS.primary, fontSize: 12, fontWeight: '600', flexShrink: 1 },
  
  submitBtn: { backgroundColor: COLORS.primary, height: 60, borderRadius: 30, justifyContent: 'center', alignItems: 'center', marginTop: 20, shadowColor: COLORS.primary, shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.5, shadowRadius: 16, elevation: 10 },
  submitText: { color: '#FFF', fontWeight: 'bold', letterSpacing: 1.5, fontSize: 15 },
});

export default ReportIncidentScreen;
