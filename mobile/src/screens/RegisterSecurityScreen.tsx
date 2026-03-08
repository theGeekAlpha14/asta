import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StatusBar,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { COLORS } from '../constants/theme';
import { useAppDispatch } from '../store';
import { updateProfile } from '../store/slices/authSlice';

const RegisterSecurityScreen = ({ navigation }: any) => {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useAppDispatch();

  // Password Rules State
  const [rules, setRules] = useState({
    length: false,
    uppercase: false,
    number: false,
    special: false,
  });

  useEffect(() => {
    setRules({
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      number: /[0-9]/.test(password),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    });
  }, [password]);

  const isPasswordValid = Object.values(rules).every(rule => rule);

  const handleNext = () => {
    if (isPasswordValid) {
      dispatch(updateProfile({ password }));
      navigation.navigate('RegisterNetwork');
    }
  };

  const RuleItem = ({ label, met }: { label: string; met: boolean }) => (
    <View style={styles.ruleItem}>
      <Icon
        name={met ? "check-circle" : "radio-button-unchecked"}
        size={16}
        color={met ? "#4CAF50" : "rgba(255,255,255,0.3)"}
      />
      <Text style={[styles.ruleText, met && styles.ruleTextMet]}>{label}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

      <LinearGradient colors={['#e92063', '#9C27B0']} style={styles.gradient}>
        <SafeAreaView style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Icon name="chevron-left" size={32} color="#FFF" />
          </TouchableOpacity>
          <View style={styles.headerTitleContainer}>
            <Text style={styles.stepText}>Step 4 of 6</Text>
            <Text style={styles.securityLabel}>SECURITY</Text>
          </View>
        </SafeAreaView>

        <View style={styles.glassCard}>
          <ScrollView showsVerticalScrollIndicator={false}>
            <Text style={styles.title}>Secure your account</Text>
            <Text style={styles.subText}>Create a password to protect your safety data.</Text>

            <View style={styles.inputWrapper}>
              <Icon name="lock-outline" size={24} color="rgba(255,255,255,0.4)" style={styles.inputIcon} />
              <TextInput
                placeholder="New Password"
                placeholderTextColor="rgba(255,255,255,0.3)"
                style={styles.input}
                secureTextEntry={!showPassword}
                value={password}
                onChangeText={setPassword}
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                <Icon name={showPassword ? "visibility" : "visibility-off"} size={20} color="rgba(255,255,255,0.4)" />
              </TouchableOpacity>
            </View>

            <View style={styles.rulesContainer}>
              <Text style={styles.rulesHeader}>PASSWORD REQUIREMENTS:</Text>
              <RuleItem label="Minimum 8 characters" met={rules.length} />
              <RuleItem label="At least one uppercase letter" met={rules.uppercase} />
              <RuleItem label="At least one number" met={rules.number} />
              <RuleItem label="At least one special character" met={rules.special} />
            </View>
          </ScrollView>

          <View style={styles.footer}>
            <TouchableOpacity
              style={[styles.nextBtn, !isPasswordValid && styles.nextBtnDisabled]}
              onPress={handleNext}
              disabled={!isPasswordValid}
            >
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
  stepText: { color: '#FFF', fontSize: 14, fontWeight: 'bold' },
  securityLabel: { color: 'rgba(255,255,255,0.8)', fontSize: 10, fontWeight: '500', letterSpacing: 2, marginTop: 4 },
  glassCard: { flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.85)', marginTop: 40, borderTopLeftRadius: 40, borderTopRightRadius: 40, padding: 32, borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.1)' },
  title: { color: '#FFF', fontSize: 24, fontWeight: '600', marginBottom: 8 },
  subText: { color: 'rgba(255,255,255,0.6)', fontSize: 14, marginBottom: 32 },
  inputWrapper: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255, 255, 255, 0.05)', borderRadius: 16, borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.1)', height: 64, paddingHorizontal: 16, marginBottom: 24 },
  inputIcon: { marginRight: 12 },
  input: { flex: 1, color: '#FFF', fontSize: 16 },
  rulesContainer: { backgroundColor: 'rgba(255,255,255,0.03)', padding: 20, borderRadius: 16, borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)' },
  rulesHeader: { color: 'rgba(255,255,255,0.4)', fontSize: 10, fontWeight: 'bold', marginBottom: 12, letterSpacing: 1 },
  ruleItem: { flexDirection: 'row', alignItems: 'center', marginBottom: 8, gap: 10 },
  ruleText: { color: 'rgba(255,255,255,0.4)', fontSize: 13 },
  ruleTextMet: { color: '#FFF' },
  footer: { position: 'absolute', bottom: 40, right: 32 },
  nextBtn: { width: 64, height: 64, borderRadius: 32, backgroundColor: COLORS.primary, alignItems: 'center', justifyContent: 'center', elevation: 8 },
  nextBtnDisabled: { backgroundColor: 'rgba(255,255,255,0.1)', elevation: 0 },
});

export default RegisterSecurityScreen;
