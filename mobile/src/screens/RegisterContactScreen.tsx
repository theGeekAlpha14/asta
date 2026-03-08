import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StatusBar,
  SafeAreaView,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { COLORS } from '../constants/theme';
import { useAppDispatch } from '../store';
import { updateProfile } from '../store/slices/authSlice';

const RegisterContactScreen = ({ navigation }: any) => {
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const dispatch = useAppDispatch();

  const handleNext = () => {
    if (email && phone) {
      dispatch(updateProfile({ email, phone }));
      navigation.navigate('RegisterSecurity');
    } else {
      alert('Please enter your contact details');
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

      <LinearGradient
        colors={['#E91E63', '#9C27B0']}
        style={styles.gradient}
      >
        <SafeAreaView style={styles.header}>
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => navigation.goBack()}
          >
            <Icon name="chevron-left" size={32} color="#FFF" />
          </TouchableOpacity>
          <View style={styles.headerTitleContainer}>
            <Text style={styles.stepText}>Step 3 of 6</Text>
            <Text style={styles.contactLabel}>CONTACT</Text>
          </View>
        </SafeAreaView>

        <View style={styles.brandSection}>
          <View style={styles.logoCircle}>
            <Icon name="favorite" size={40} color={COLORS.primary} />
          </View>
          <Text style={styles.brandName}>ASTA</Text>
        </View>

        <View style={styles.glassCard}>
          <Text style={styles.title}>How can we reach you?</Text>
          <Text style={styles.subText}>We'll use this to secure your account</Text>

          <View style={styles.form}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>EMAIL</Text>
              <View style={styles.inputWrapper}>
                <Icon name="mail-outline" size={24} color="rgba(255,255,255,0.4)" style={styles.inputIcon} />
                <TextInput
                  placeholder="name@asta.com"
                  placeholderTextColor="rgba(255,255,255,0.3)"
                  style={styles.input}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  value={email}
                  onChangeText={setEmail}
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>PHONE NUMBER</Text>
              <View style={styles.inputWrapper}>
                <Icon name="phone" size={24} color="rgba(255,255,255,0.4)" style={styles.inputIcon} />
                <TextInput
                  placeholder="+91 1234567890"
                  placeholderTextColor="rgba(255,255,255,0.3)"
                  style={styles.input}
                  keyboardType="phone-pad"
                  value={phone}
                  onChangeText={setPhone}
                />
              </View>
              <Text style={styles.formatHint}>Format: +91 1234567890</Text>
            </View>
          </View>

          <TouchableOpacity
            style={styles.nextBtn}
            onPress={handleNext}
          >
            <Icon name="chevron-right" size={32} color="#FFF" />
          </TouchableOpacity>

          <View style={styles.footer}>
            <Text style={styles.alreadyText}>Already have an account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <Text style={styles.loginLink}>Login</Text>
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
    paddingHorizontal: 20,
    justifyContent: 'center'
  },
  backBtn: { position: 'absolute', left: 20, top: 20 },
  headerTitleContainer: { alignItems: 'center' },
  stepText: { color: '#FFF', fontSize: 14, fontWeight: 'bold' },
  contactLabel: { color: 'rgba(255,255,255,0.8)', fontSize: 10, fontWeight: '500', letterSpacing: 2, marginTop: 4 },
  brandSection: { alignItems: 'center', marginTop: 30 },
  logoCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
  },
  brandName: { color: '#FFF', fontSize: 32, fontWeight: 'bold', marginTop: 16 },
  glassCard: {
    flex: 1,
    backgroundColor: 'rgba(18, 18, 18, 0.85)',
    marginTop: 40,
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    padding: 32,
    borderTopWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  title: { color: '#FFF', fontSize: 24, fontWeight: '600', marginBottom: 4 },
  subText: { color: 'rgba(255,255,255,0.6)', fontSize: 14, marginBottom: 32 },
  form: { gap: 24 },
  inputGroup: {},
  label: { color: 'rgba(255,255,255,0.7)', fontSize: 12, fontWeight: 'bold', letterSpacing: 1.5, marginBottom: 8, marginLeft: 4 },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    height: 64,
    paddingHorizontal: 16,
  },
  inputIcon: { marginRight: 12 },
  input: { flex: 1, color: '#FFF', fontSize: 16 },
  formatHint: { color: 'rgba(255,255,255,0.4)', fontSize: 10, fontStyle: 'italic', marginTop: 4, marginLeft: 4 },
  nextBtn: {
    position: 'absolute',
    bottom: 120,
    right: 32,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 8,
  },
  footer: { position: 'absolute', bottom: 40, left: 0, right: 0, flexDirection: 'row', justifyContent: 'center' },
  alreadyText: { color: 'rgba(255,255,255,0.6)', fontSize: 14 },
  loginLink: { color: COLORS.primary, fontSize: 14, fontWeight: 'bold' },
});

export default RegisterContactScreen;
