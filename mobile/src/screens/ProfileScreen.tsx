import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, SafeAreaView } from 'react-native';
import { COLORS } from '../constants/theme';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useAppSelector, useAppDispatch } from '../store';
import { clearAuth } from '../store/slices/authSlice';

const ProfileScreen = ({ navigation }: any) => {
  const user = useAppSelector((state) => state.auth.user);
  const isGuest = useAppSelector((state) => state.auth.isGuest);
  const dispatch = useAppDispatch();

  const handleLogout = () => {
    dispatch(clearAuth());
    navigation.replace('Login');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <View style={styles.avatarContainer}>
            <Icon name="person" size={50} color={COLORS.primary} />
          </View>
          <Text style={styles.userName}>{isGuest ? 'Guest User' : user?.name || 'User'}</Text>
          <Text style={styles.userEmail}>{user?.email || 'No email provided'}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Safety Network</Text>
          {user?.contacts && user.contacts.length > 0 ? (
            user.contacts.map((contact, index) => (
              <View key={index} style={styles.listItem}>
                <Icon name="contact-phone" size={20} color={COLORS.primary} />
                <View style={styles.listTextContainer}>
                  <Text style={styles.listPrimaryText}>{contact.name}</Text>
                  <Text style={styles.listSecondaryText}>{contact.phone}</Text>
                </View>
              </View>
            ))
          ) : (
            <Text style={styles.emptyText}>No emergency contacts added.</Text>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account Settings</Text>
          <TouchableOpacity style={styles.listItem} onPress={() => navigation.navigate('RegisterIdentity')}>
            <Icon name="edit" size={20} color="#94a3b8" />
            <Text style={[styles.listPrimaryText, {marginLeft: 12}]}>Edit Profile</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.listItem} onPress={handleLogout}>
            <Icon name="logout" size={20} color={COLORS.danger} />
            <Text style={[styles.listPrimaryText, {marginLeft: 12, color: COLORS.danger}]}>Logout</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#211116' },
  scrollContent: { padding: 20 },
  header: { alignItems: 'center', marginVertical: 30 },
  avatarContainer: { width: 100, height: 100, borderRadius: 50, backgroundColor: 'rgba(233, 32, 99, 0.1)', justifyContent: 'center', alignItems: 'center', marginBottom: 16, borderWidth: 1, borderColor: 'rgba(233, 32, 99, 0.3)' },
  userName: { color: '#FFF', fontSize: 24, fontWeight: 'bold' },
  userEmail: { color: '#94a3b8', fontSize: 14, marginTop: 4 },
  section: { marginTop: 30 },
  sectionTitle: { color: COLORS.primary, fontSize: 12, fontWeight: 'bold', letterSpacing: 1, marginBottom: 16, textTransform: 'uppercase' },
  listItem: { backgroundColor: 'rgba(38, 28, 31, 0.8)', padding: 16, borderRadius: 12, flexDirection: 'row', alignItems: 'center', marginBottom: 12, borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)', elevation: 5, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 10 },
  listTextContainer: { marginLeft: 12 },
  listPrimaryText: { color: '#FFF', fontSize: 16, fontWeight: '500' },
  listSecondaryText: { color: '#94a3b8', fontSize: 12, marginTop: 2 },
  emptyText: { color: '#94a3b8', fontStyle: 'italic', textAlign: 'center', marginTop: 10 }
});

export default ProfileScreen;
