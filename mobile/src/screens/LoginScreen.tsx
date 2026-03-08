import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { COLORS } from '../constants/theme';
import Icon from 'react-native-vector-icons/MaterialIcons';
import LinearGradient from 'react-native-linear-gradient';
import axios from 'axios';
import { useAppDispatch } from '../store';
import { clearAuth, setGuest } from '../store/slices/authSlice';

const LoginScreen = ({ navigation }: any) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const dispatch = useAppDispatch();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter both email and password');
      return;
    }

    setLoading(true);
    try {
      // Real API Call to your login Lambda
      const response = await axios.post('https://qvd602gmti.execute-api.ap-south-1.amazonaws.com/Prod/login', {
        email,
        password
      });

      if (response.status === 200) {
        // Direct Login - No OTP
        dispatch(clearAuth());
        navigation.navigate('Main');
      }
    } catch (error: any) {
      const msg = error.response?.data?.error || "Connection failed";
      Alert.alert('Login Failed', msg);
    } finally {
      setLoading(false);
    }
  };

  const handleGuestLogin = () => {
    dispatch(setGuest(true));
    navigation.navigate('Main');
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      <LinearGradient
        colors={['#240b36', '#E91E63', '#9C27B0', '#1a0b2e']}
        style={StyleSheet.absoluteFill}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.logoContainer}>
          <View style={styles.logoPulse}>
            <Icon name="security" size={40} color={COLORS.primary} />
          </View>
          <Text style={styles.logoText}>ASTA</Text>
          <Text style={styles.tagline}>WOMEN'S SAFETY INTELLIGENCE</Text>
        </View>

        <View style={styles.glassPanel}>
          <Text style={styles.welcomeText}>Welcome Back</Text>
          <Text style={styles.subText}>Secure login to continue</Text>

          <View style={styles.form}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>EMAIL</Text>
              <View style={styles.inputWrapper}>
                <Icon name="mail-outline" size={20} color="#666" style={styles.inputIcon} />
                <TextInput
                  placeholder="name@asta.com"
                  placeholderTextColor="#666"
                  style={styles.input}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  value={email}
                  onChangeText={setEmail}
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>PASSWORD</Text>
              <View style={styles.inputWrapper}>
                <Icon name="lock-outline" size={20} color="#666" style={styles.inputIcon} />
                <TextInput
                  placeholder="••••••••"
                  placeholderTextColor="#666"
                  style={styles.input}
                  secureTextEntry={!showPassword}
                  value={password}
                  onChangeText={setPassword}
                />
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                  <Icon name={showPassword ? "visibility" : "visibility-off"} size={20} color="#666" />
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.row}>
              <TouchableOpacity style={styles.checkboxContainer}>
                <View style={styles.checkbox} />
                <Text style={styles.rememberMe}>Remember me</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => Alert.alert('Reset Password', 'A reset link has been sent to your email.')}>
                <Text style={styles.forgotText}>Forgot?</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={styles.loginBtn}
              onPress={handleLogin}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#FFF" />
              ) : (
                <Text style={styles.loginBtnText}>LOGIN</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.guestBtn}
              onPress={handleGuestLogin}
            >
              <Text style={styles.guestBtnText}>CONTINUE AS GUEST</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.socialDivider}>
            <View style={styles.dividerLine} />
            <Text style={styles.socialText}>SOCIAL LOGIN</Text>
            <View style={styles.dividerLine} />
          </View>

          <View style={styles.socialRow}>
            <TouchableOpacity style={styles.socialBtn} onPress={() => Alert.alert('Google Login', 'Coming soon!')}>
              <Icon name="public" size={24} color="#FFF" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.socialBtn} onPress={() => Alert.alert('Apple Login', 'Coming soon!')}>
              <Icon name="phone-iphone" size={24} color="#FFF" />
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={styles.signupLink}
            onPress={() => navigation.navigate('RegisterIdentity')}
          >
            <Text style={styles.signupText}>
              New to ASTA? <Text style={styles.signupHighlight}>Create Account</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  scrollContent: { flexGrow: 1, paddingHorizontal: 24, paddingVertical: 60, alignItems: 'center' },
  logoContainer: { alignItems: 'center', marginBottom: 40 },
  logoPulse: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    padding: 16,
    borderRadius: 50,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    marginBottom: 16,
  },
  logoText: { color: '#FFF', fontSize: 32, fontWeight: 'bold', letterSpacing: 2 },
  tagline: { color: 'rgba(255,255,255,0.6)', fontSize: 10, letterSpacing: 3, fontWeight: '500' },
  glassPanel: {
    width: '100%',
    backgroundColor: 'rgba(10, 10, 10, 0.9)',
    borderRadius: 32,
    padding: 24,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
  },
  welcomeText: { color: '#FFF', fontSize: 24, fontWeight: 'bold', marginBottom: 4 },
  subText: { color: '#999', fontSize: 14, marginBottom: 32 },
  form: { width: '100%' },
  inputGroup: { marginBottom: 20 },
  label: { color: '#666', fontSize: 10, fontWeight: 'bold', letterSpacing: 2, marginBottom: 8 },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: 16,
    height: 56,
  },
  inputIcon: { marginRight: 12 },
  input: { flex: 1, color: '#FFF', fontSize: 14 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 },
  checkboxContainer: { flexDirection: 'row', alignItems: 'center' },
  checkbox: { width: 18, height: 18, borderRadius: 4, borderWidth: 1, borderColor: 'rgba(255,255,255,0.2)', marginRight: 8 },
  rememberMe: { color: '#999', fontSize: 12 },
  forgotText: { color: COLORS.primary, fontSize: 12, fontWeight: 'bold' },
  loginBtn: {
    backgroundColor: COLORS.primary,
    height: 56,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 24,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  loginBtnText: { color: '#FFF', fontWeight: 'bold', letterSpacing: 2, fontSize: 14 },
  guestBtn: {
    height: 56,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  guestBtnText: { color: 'rgba(255, 255, 255, 0.6)', fontWeight: 'bold', letterSpacing: 1, fontSize: 12 },
  socialDivider: { flexDirection: 'row', alignItems: 'center', marginVertical: 32 },
  dividerLine: { flex: 1, height: 1, backgroundColor: 'rgba(255,255,255,0.1)' },
  socialText: { color: '#666', fontSize: 10, fontWeight: 'bold', marginHorizontal: 16, letterSpacing: 2 },
  socialRow: { flexDirection: 'row', gap: 16 },
  socialBtn: {
    flex: 1,
    height: 52,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  signupLink: { marginTop: 32, alignItems: 'center' },
  signupText: { color: '#999', fontSize: 12 },
  signupHighlight: { color: COLORS.primary, fontWeight: 'bold' },
});

export default LoginScreen;
