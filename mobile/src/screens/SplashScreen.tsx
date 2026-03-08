import React, { useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  StatusBar,
  Animated,
  Dimensions,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { COLORS } from '../constants/theme';

const { width, height } = Dimensions.get('window');

const SplashScreen = ({ navigation }: any) => {
  const scaleAnim = new Animated.Value(1);

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 1.1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();

    const timer = setTimeout(() => {
      navigation.replace('Login');
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
      <LinearGradient
        colors={['#E91E63', '#9C27B0', '#1a051d']}
        style={styles.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.glow} />

        <Animated.View style={[styles.logoContainer, { transform: [{ scale: scaleAnim }] }]}>
          <View style={styles.iconWrapper}>
            <Icon name="security" size={80} color="#FFF" />
          </View>
        </Animated.View>

        <View style={styles.textContainer}>
          <Text style={styles.title}>ASTA</Text>
          <Text style={styles.subtitle}>WOMEN'S SAFETY INTELLIGENCE</Text>
        </View>

        <View style={styles.footer}>
          <View style={styles.progressBar}>
            <View style={styles.progressFill} />
          </View>
          <Text style={styles.loadingText}>SYSTEM WARMING UP</Text>
        </View>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  gradient: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  glow: {
    position: 'absolute',
    width: 300,
    height: 300,
    backgroundColor: 'rgba(233, 32, 99, 0.2)',
    borderRadius: 150,
  },
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconWrapper: {
    shadowColor: '#FFF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 20,
  },
  textContainer: { marginTop: 40, alignItems: 'center' },
  title: {
    color: '#FFF',
    fontSize: 48,
    fontWeight: '700',
    letterSpacing: 10,
    fontFamily: 'serif',
  },
  subtitle: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 10,
    fontWeight: '300',
    letterSpacing: 4,
    marginTop: 8,
  },
  footer: { position: 'absolute', bottom: 60, alignItems: 'center' },
  progressBar: {
    width: 200,
    height: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 1,
    overflow: 'hidden',
    marginBottom: 12,
  },
  progressFill: {
    width: '40%',
    height: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
  },
  loadingText: {
    color: 'rgba(255, 255, 255, 0.4)',
    fontSize: 10,
    fontWeight: '400',
    letterSpacing: 4,
  },
});

export default SplashScreen;
