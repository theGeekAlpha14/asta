import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StatusBar,
  SafeAreaView,
  Platform,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialIcons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { COLORS } from '../constants/theme';
import { useAppDispatch } from '../store';
import { updateProfile } from '../store/slices/authSlice';

const RegisterProfileScreen = ({ navigation }: any) => {
  const [age, setAge] = useState('');
  const [dob, setDob] = useState('');
  const [showPicker, setShowPicker] = useState(false);
  const [date, setDate] = useState(new Date());
  const dispatch = useAppDispatch();

  const onChange = (event: any, selectedDate?: Date) => {
    setShowPicker(false);
    if (selectedDate) {
      setDate(selectedDate);
      const formattedDate = selectedDate.toLocaleDateString('en-GB'); // DD/MM/YYYY
      setDob(formattedDate);

      // Auto-calculate age
      const today = new Date();
      let calculatedAge = today.getFullYear() - selectedDate.getFullYear();
      const m = today.getMonth() - selectedDate.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < selectedDate.getDate())) {
        calculatedAge--;
      }
      setAge(calculatedAge.toString());
    }
  };

  const handleNext = () => {
    if (age && dob) {
      dispatch(updateProfile({ age, dob }));
      navigation.navigate('RegisterContact');
    } else {
      alert('Please select your Date of Birth');
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
            <Text style={styles.stepText}>STEP 2 OF 6</Text>
            <Text style={styles.profileLabel}>PROFILE</Text>
          </View>
        </SafeAreaView>

        <View style={styles.glassCard}>
          <Text style={styles.title}>Tell us a bit about yourself</Text>

          <View style={styles.form}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>AGE</Text>
              <View style={[styles.inputWrapper, { opacity: 0.7 }]}>
                <Icon name="event" size={20} color={COLORS.primary} style={styles.inputIcon} />
                <TextInput
                  placeholder="Your age"
                  placeholderTextColor="rgba(255,255,255,0.2)"
                  style={styles.input}
                  value={age}
                  editable={false}
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>DATE OF BIRTH</Text>
              <TouchableOpacity onPress={() => setShowPicker(true)} style={styles.inputWrapper}>
                <Icon name="calendar-today" size={20} color={COLORS.primary} style={styles.inputIcon} />
                <Text style={[styles.input, !dob && { color: 'rgba(255,255,255,0.2)' }]}>
                  {dob || 'DD/MM/YYYY'}
                </Text>
              </TouchableOpacity>
            </View>

            {showPicker && (
              <DateTimePicker
                value={date}
                mode="date"
                display="default"
                onChange={onChange}
                maximumDate={new Date()}
              />
            )}

            <Text style={styles.helperText}>
              This helps us provide age-appropriate safety recommendations
            </Text>
          </View>

          <View style={styles.footer}>
            <TouchableOpacity style={styles.nextBtn} onPress={handleNext}>
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
  header: { flexDirection: 'row', alignItems: 'center', marginTop: 20, paddingHorizontal: 20, justifyContent: 'center' },
  backBtn: { position: 'absolute', left: 20, top: 20 },
  headerTitleContainer: { alignItems: 'center' },
  stepText: { color: '#FFF', fontSize: 18, fontWeight: '500' },
  profileLabel: { color: 'rgba(255,255,255,0.6)', fontSize: 10, fontWeight: 'bold', letterSpacing: 2, marginTop: 4 },
  glassCard: { flex: 1, backgroundColor: 'rgba(18, 18, 18, 0.85)', marginTop: 40, borderTopLeftRadius: 40, borderTopRightRadius: 40, padding: 32, borderWidth: 1, borderColor: 'rgba(233, 30, 99, 0.2)' },
  title: { color: '#FFF', fontSize: 28, fontWeight: 'bold', marginBottom: 40, lineHeight: 36 },
  form: { gap: 32 },
  inputGroup: {},
  label: { color: 'rgba(255,255,255,0.5)', fontSize: 10, fontWeight: 'bold', letterSpacing: 1, marginBottom: 8, marginLeft: 4 },
  inputWrapper: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255, 255, 255, 0.05)', borderRadius: 16, borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.1)', height: 64, paddingHorizontal: 16 },
  inputIcon: { marginRight: 12 },
  input: { flex: 1, color: '#FFF', fontSize: 16 },
  helperText: { color: 'rgba(255,255,255,0.4)', fontSize: 12, textAlign: 'center', marginTop: 16, lineHeight: 18 },
  footer: { position: 'absolute', bottom: 40, left: 32, right: 32, alignItems: 'center' },
  nextBtn: { alignSelf: 'flex-end', width: 80, height: 80, borderRadius: 40, backgroundColor: COLORS.primary, alignItems: 'center', justifyContent: 'center', elevation: 10, marginBottom: 40 },
  loginRow: { flexDirection: 'row', alignItems: 'center' },
  alreadyText: { color: 'rgba(255,255,255,0.4)', fontSize: 14 },
  loginLink: { color: COLORS.primary, fontSize: 14, fontWeight: 'bold' },
});

export default RegisterProfileScreen;
