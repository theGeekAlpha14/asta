import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, FlatList, ActivityIndicator, RefreshControl, ScrollView, TouchableOpacity, Image } from 'react-native';
import { COLORS } from '../constants/theme';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { getIncidents } from '../services/api';

const SAFETY_ARTICLES = [
  {
    id: '1',
    title: 'Your Legal Rights in India',
    desc: 'Understanding the Zero FIR and your rights during police interaction.',
    category: 'LEGAL',
    icon: 'gavel',
    color: '#34d399'
  },
  {
    id: '2',
    title: 'Cyber Safety for Women',
    desc: 'How to protect your digital identity and report online harassment.',
    category: 'DIGITAL',
    icon: 'security',
    color: '#60a5fa'
  },
  {
    id: '3',
    title: 'Self-Defense Essentials',
    desc: 'Basic physical moves every woman should know for emergency situations.',
    category: 'SAFETY',
    icon: 'front-hand',
    color: '#fbbf24'
  },
  {
    id: '4',
    title: 'Workplace Safety Guidelines',
    desc: 'Understanding the POSH Act and maintaining a safe work environment.',
    category: 'WORK',
    icon: 'business-center',
    color: '#a78bfa'
  }
];

const CommunityScreen = () => {
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchIncidents = async () => {
    setLoading(true);
    try {
      const data = await getIncidents();
      setIncidents(data || []);
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  };

  useEffect(() => { fetchIncidents(); }, []);

  const renderIncident = ({ item }: any) => (
    <View style={styles.incidentCard}>
      <View style={[styles.severityBar, { backgroundColor: item.severity === 'CRITICAL' ? COLORS.primary : '#4285F4' }]} />
      <View style={styles.cardContent}>
        <Text style={styles.incidentType}>{item.type || 'SOS THREAT'}</Text>
        <Text style={styles.location}><Icon name="location-on" size={12}/> {item.area || 'Mumbai Central'}</Text>
        <Text style={styles.time}>{new Date(item.timestamp).toLocaleString([], { hour: '2-digit', minute: '2-digit' })}</Text>
      </View>
      <Icon name="chevron-right" size={24} color="rgba(255,255,255,0.2)" />
    </View>
  );

  return (
    <ScrollView 
      style={styles.container} 
      contentContainerStyle={{ paddingBottom: 100 }}
      refreshControl={<RefreshControl refreshing={loading} onRefresh={fetchIncidents} tintColor={COLORS.primary} />}
    >
      <View style={styles.headerRow}>
        <Text style={styles.header}>Community</Text>
        <TouchableOpacity style={styles.notifBtn}>
            <Icon name="notifications-none" size={24} color="#FFF" />
            <View style={styles.notifBadge} />
        </TouchableOpacity>
      </View>

      {/* Safety Articles Section */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Empowerment & Rights</Text>
        <TouchableOpacity><Text style={styles.seeAll}>See All</Text></TouchableOpacity>
      </View>
      
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.articleScroll}>
        {SAFETY_ARTICLES.map(article => (
          <TouchableOpacity key={article.id} style={styles.articleCard}>
            <View style={[styles.articleIconBg, { backgroundColor: article.color + '15' }]}>
                <Icon name={article.icon} size={32} color={article.color} />
            </View>
            <View style={styles.articleInfo}>
                <Text style={[styles.articleCat, { color: article.color }]}>{article.category}</Text>
                <Text style={styles.articleTitle}>{article.title}</Text>
                <Text style={styles.articleDesc} numberOfLines={2}>{article.desc}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Incident Feed Section */}
      <View style={[styles.sectionHeader, { marginTop: 30 }]}>
        <Text style={styles.sectionTitle}>Live Safety Alerts</Text>
        {loading && <ActivityIndicator size="small" color={COLORS.primary} />}
      </View>

      <FlatList
        data={incidents.slice(0, 5)}
        renderItem={renderIncident}
        keyExtractor={(item: any, index: number) => item.incidentId || index.toString()}
        scrollEnabled={false}
        ListEmptyComponent={!loading ? <Text style={styles.empty}>No critical alerts in your sector.</Text> : null}
      />

      <TouchableOpacity style={styles.reportBanner}>
          <Icon name="campaign" size={28} color="#FFF" />
          <View style={{ flex: 1, marginLeft: 15 }}>
              <Text style={styles.reportTitle}>Seen something suspicious?</Text>
              <Text style={styles.reportSub}>Help the community by reporting it now.</Text>
          </View>
          <Icon name="arrow-forward" size={20} color="#FFF" />
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#181113', paddingHorizontal: 20, paddingTop: 60 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 25 },
  header: { color: '#FFF', fontSize: 32, fontWeight: '900', letterSpacing: -0.5 },
  notifBtn: { width: 44, height: 44, borderRadius: 22, backgroundColor: 'rgba(255,255,255,0.05)', justifyContent: 'center', alignItems: 'center' },
  notifBadge: { position: 'absolute', top: 12, right: 12, width: 8, height: 8, borderRadius: 4, backgroundColor: COLORS.primary },
  
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
  sectionTitle: { color: '#FFF', fontSize: 18, fontWeight: 'bold' },
  seeAll: { color: COLORS.primary, fontWeight: '600', fontSize: 14 },

  articleScroll: { marginHorizontal: -20, paddingLeft: 20 },
  articleCard: { width: 200, backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: 20, padding: 16, marginRight: 15, borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)' },
  articleIconBg: { width: 56, height: 56, borderRadius: 16, justifyContent: 'center', alignItems: 'center', marginBottom: 12 },
  articleInfo: {},
  articleCat: { fontSize: 10, fontWeight: 'bold', letterSpacing: 1 },
  articleTitle: { color: '#FFF', fontSize: 16, fontWeight: 'bold', marginTop: 4 },
  articleDesc: { color: '#94a3b8', fontSize: 12, marginTop: 6, lineHeight: 18 },

  incidentCard: { backgroundColor: 'rgba(255,255,255,0.02)', borderRadius: 16, marginBottom: 12, flexDirection: 'row', alignItems: 'center', overflow: 'hidden', borderWidth: 1, borderColor: 'rgba(255,255,255,0.03)' },
  severityBar: { width: 4, height: '100%' },
  cardContent: { flex: 1, padding: 16 },
  incidentType: { color: '#f8fafc', fontSize: 14, fontWeight: 'bold' },
  location: { color: '#94a3b8', fontSize: 11, marginTop: 2 },
  time: { color: COLORS.primary, fontSize: 10, fontWeight: 'bold', marginTop: 4 },
  
  reportBanner: { marginTop: 30, backgroundColor: COLORS.primary, borderRadius: 20, padding: 20, flexDirection: 'row', alignItems: 'center', shadowColor: COLORS.primary, shadowOpacity: 0.3, shadowRadius: 10, elevation: 5 },
  reportTitle: { color: '#FFF', fontSize: 16, fontWeight: 'bold' },
  reportSub: { color: 'rgba(255,255,255,0.8)', fontSize: 12, marginTop: 2 },
  
  empty: { color: '#64748b', textAlign: 'center', marginTop: 20, fontStyle: 'italic', fontSize: 12 },
});

export default CommunityScreen;
