import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StatusBar,
  SafeAreaView,
  ScrollView,
  Alert,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { COLORS } from '../constants/theme';
import { useAppDispatch } from '../store';
import { updateProfile } from '../store/slices/authSlice';

const RegisterNetworkScreen = ({ navigation }: any) => {
  const [contacts, setContacts] = useState([{ name: '', phone: '' }]);
  const dispatch = useAppDispatch();

  const handleNext = () => {
    const validContacts = contacts.filter(c => c.name.trim() && c.phone.trim());
    if (validContacts.length === 0) {
      Alert.alert("Safety Network", "Please add at least one emergency contact for your safety.");
      return;
    }
    dispatch(updateProfile({ contacts: validContacts }));
    navigation.navigate('RegisterPermissions');
  };

  const updateContact = (index: number, field: 'name' | 'phone', value: string) => {
    const newContacts = [...contacts];
    newContacts[index] = { ...newContacts[index], [field]: value };
    setContacts(newContacts);
  };

  const addContact = () => {
    if (contacts.length < 5) {
      setContacts([...contacts, { name: '', phone: '' }]);
    } else {
      Alert.alert("Limit Reached", "You can add up to 5 emergency contacts.");
    }
  };

  const removeContact = (index: number) => {
    if (contacts.length > 1) {
      setContacts(contacts.filter((_, i) => i !== index));
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
            <Text style={styles.stepText}>Step 5 of 6</Text>
            <Text style={styles.networkLabel}>NETWORK</Text>
          </View>
        </SafeAreaView>

        <View style={styles.glassCard}>
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
            <View style={styles.recommendedBadge}>
              <Text style={styles.recommendedText}>RECOMMENDED</Text>
            </View>

            <Text style={styles.title}>Add your safety network</Text>
            <Text style={styles.subText}>Who should we alert in an emergency?</Text>

            <View style={styles.form}>
              {contacts.map((contact, index) => (
                <View key={index} style={styles.contactGroup}>
                  <View style={styles.contactHeader}>
                    <Text style={styles.label}>CONTACT {index + 1}</Text>
                    {contacts.length > 1 && (
                      <TouchableOpacity onPress={() => removeContact(index)}>
                        <Icon name="close" size={18} color={COLORS.primary} />
                      </TouchableOpacity>
                    )}
                  </View>
                  <View style={styles.inputGroup}>
                    <TextInput
                      placeholder="Full Name"
                      placeholderTextColor="#475569"
                      style={styles.input}
                      value={contact.name}
                      onChangeText={(val) => updateContact(index, 'name', val)}
                    />
                  </View>
                  <View style={styles.inputGroup}>
                    <TextInput
                      placeholder="Phone Number"
                      placeholderTextColor="#475569"
                      style={styles.input}
                      keyboardType="phone-pad"
                      value={contact.phone}
                      onChangeText={(val) => updateContact(index, 'phone', val)}
                    />
                  </View>
                </View>
              ))}

              <TouchableOpacity style={styles.addBtn} onPress={addContact}>
                <Text style={styles.addBtnText}>+ Add another contact</Text>
              </TouchableOpacity>

              <View style={styles.infoBox}>
                <Icon name="info-outline" size={20} color={COLORS.primary} />
                <Text style={styles.infoText}>
                  These contacts will receive SOS alerts with your location if you trigger an emergency.
                </Text>
              </View>
            </View>
          </ScrollView>

          <View style={styles.footer}>
            <TouchableOpacity onPress={() => navigation.navigate('RegisterPermissions')}>
              <Text style={styles.skipText}>Skip for now</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.nextBtn} onPress={handleNext}>
              <Icon name="arrow-forward" size={32} color="#FFF" />
            </TouchableOpacity>
          </View>
        </View>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  gradient: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', marginTop: 20, paddingHorizontal: 20, justifyContent: 'center' },
  backBtn: { position: 'absolute', left: 20, top: 20 },
  headerTitleContainer: { alignItems: 'center' },
  stepText: { color: '#FFF', fontSize: 13, fontWeight: 'bold' },
  networkLabel: { color: 'rgba(255,255,255,0.6)', fontSize: 10, fontWeight: 'bold', letterSpacing: 2, marginTop: 4 },
  glassCard: { flex: 1, backgroundColor: 'rgba(30, 20, 29, 0.95)', marginTop: 40, borderTopLeftRadius: 40, borderTopRightRadius: 40, padding: 32, borderTopWidth: 1, borderColor: 'rgba(233, 30, 99, 0.2)' },
  scrollContent: { paddingBottom: 120 },
  recommendedBadge: { backgroundColor: COLORS.primary, alignSelf: 'flex-start', paddingHorizontal: 16, paddingVertical: 6, borderRadius: 20, marginBottom: 16 },
  recommendedText: { color: '#FFF', fontSize: 10, fontWeight: 'bold', letterSpacing: 1 },
  title: { color: '#FFF', fontSize: 28, fontWeight: 'bold', marginBottom: 8 },
  subText: { color: '#64748b', fontSize: 14, marginBottom: 32 },
  form: { gap: 16 },
  contactGroup: { backgroundColor: 'rgba(255,255,255,0.03)', padding: 16, borderRadius: 20, gap: 12 },
  contactHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  inputGroup: {},
  label: { color: 'rgba(255,255,255,0.3)', fontSize: 10, fontWeight: 'bold', letterSpacing: 1 },
  input: { backgroundColor: '#2a1e29', borderRadius: 12, height: 50, paddingHorizontal: 16, color: '#FFF', fontSize: 14 },
  addBtn: { marginTop: 8, alignSelf: 'center' },
  addBtnText: { color: '#9C27B0', fontSize: 14, fontWeight: 'bold' },
  infoBox: { flexDirection: 'row', backgroundColor: 'rgba(255, 255, 255, 0.05)', borderRadius: 16, padding: 16, gap: 12, marginTop: 16 },
  infoText: { flex: 1, color: '#64748b', fontSize: 12, lineHeight: 18 },
  footer: { position: 'absolute', bottom: 40, left: 32, right: 32, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  skipText: { color: '#64748b', fontSize: 14, fontWeight: '600' },
  nextBtn: { width: 64, height: 64, borderRadius: 32, backgroundColor: COLORS.primary, alignItems: 'center', justifyContent: 'center', elevation: 8 },
});

export default RegisterNetworkScreen;
