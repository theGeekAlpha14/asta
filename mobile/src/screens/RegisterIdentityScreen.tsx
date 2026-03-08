import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StatusBar,
  SafeAreaView,
  Alert,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { COLORS } from '../constants/theme';
import { useAppDispatch } from '../store';
import { updateProfile } from '../store/slices/authSlice';

const RegisterIdentityScreen = ({ navigation }: any) => {
  const [name, setName] = useState('');
  const dispatch = useAppDispatch();

  const handleNext = () => {
    if (name.trim()) {
      dispatch(updateProfile({ name }));
      navigation.navigate('RegisterProfile');
    } else {
      Alert.alert('Incomplete', 'Please enter your name to proceed.');
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

      <LinearGradient
        colors={['#E91E63', '#9C27B0']}
        style={styles.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <SafeAreaView style={styles.header}>
          <Text style={styles.stepText}>STEP 1 OF 6</Text>
          <Text style={styles.identityLabel}>IDENTITY</Text>
          <Text style={styles.welcomeTitle}>Welcome to ASTA</Text>
          <Text style={styles.subTitle}>Your personal safety companion</Text>
        </SafeAreaView>

        <View style={styles.mainCard}>
          <View style={styles.promptGroup}>
            <Text style={styles.promptTitle}>Let's start with your name</Text>
            <Text style={styles.promptSub}>What should we call you?</Text>
          </View>

          <View style={styles.inputContainer}>
            <Icon name="person-outline" size={24} color="#999" style={styles.inputIcon} />
            <TextInput
              placeholder="Full Name"
              placeholderTextColor="rgba(255,255,255,0.4)"
              style={styles.input}
              value={name}
              onChangeText={setName}
            />
          </View>
          <Text style={styles.helperText}>This helps personalize your experience</Text>

          <View style={styles.footer}>
             <TouchableOpacity
              style={styles.nextBtn}
              onPress={handleNext}
            >
              <Icon name="arrow-forward" size={32} color="#FFF" />
            </TouchableOpacity>

            <View style={styles.loginRow}>
              <Text style={styles.alreadyText}>Already have an account? </Text>
              <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                <Text style={styles.loginLink}>Login</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  gradient: { flex: 1 },
  header: { alignItems: 'center', marginTop: 60, paddingHorizontal: 24 },
  stepText: { color: 'rgba(255,255,255,0.6)', fontSize: 10, fontWeight: 'bold', letterSpacing: 2, marginBottom: 4 },
  identityLabel: { color: 'rgba(255,255,255,0.4)', fontSize: 24, fontWeight: '300', letterSpacing: 6, marginBottom: 40 },
  welcomeTitle: { color: '#FFF', fontSize: 32, fontWeight: 'bold', textAlign: 'center', marginBottom: 8 },
  subTitle: { color: 'rgba(255,255,255,0.8)', fontSize: 16, fontWeight: '500', textAlign: 'center' },
  mainCard: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    marginTop: 40,
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    padding: 32,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  promptGroup: { marginBottom: 32 },
  promptTitle: { color: COLORS.primary, fontSize: 24, fontWeight: 'bold', marginBottom: 8 },
  promptSub: { color: 'rgba(255,255,255,0.7)', fontSize: 16 },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    height: 64,
    paddingHorizontal: 20,
    marginBottom: 8,
  },
  inputIcon: { marginRight: 16 },
  input: { flex: 1, color: '#FFF', fontSize: 18 },
  helperText: { color: 'rgba(255,255,255,0.4)', fontSize: 12, marginLeft: 8 },
  footer: { position: 'absolute', bottom: 40, left: 32, right: 32, alignItems: 'center' },
  nextBtn: {
    position: 'absolute',
    top: -100,
    right: 0,
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 15,
    elevation: 10,
  },
  loginRow: { flexDirection: 'row', alignItems: 'center' },
  alreadyText: { color: '#FFF', fontSize: 14 },
  loginLink: { color: COLORS.primary, fontSize: 14, fontWeight: 'bold', textDecorationLine: 'underline' },
});

export default RegisterIdentityScreen;
