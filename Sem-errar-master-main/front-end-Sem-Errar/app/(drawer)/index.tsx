import React, { useEffect, useRef } from 'react';
import { Animated, Dimensions, StyleSheet, Text, View, Easing, StatusBar, Platform, Pressable, SafeAreaView, Image } from 'react-native';
import { FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';

const { width } = Dimensions.get('window');

interface IconConfig {
  name: string;
  color: string;
  size: number;
  type: 'FA5' | 'MCI';
}

const PILLARS: IconConfig[] = [
  { name: 'weight-lifter', color: '#7052e6', size: 26, type: 'MCI' }, 
  { name: 'heart-pulse', color: '#fa3e3e', size: 24, type: 'MCI' },   
  { name: 'cup-water', color: '#5194e0', size: 24, type: 'MCI' },     
  { name: 'fire', color: '#e96f04', size: 24, type: 'MCI' },          
];

export default function BoasVindas4() {
  const animValue = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current; 
  const router = useRouter();

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();

    Animated.loop(
      Animated.timing(animValue, {
        toValue: 1,
        duration: 25000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();
  }, []);

  // Raio amplo para os ícones orbitarem a logo gigante
  const RADIUS = width * 0.44; 
  const ELLIPSE_RATIO = 0.6; 

  const renderOrbit = (icon: IconConfig, rotation: string, direction: number, startAngle: number) => {
    const inputRange = [0, 0.25, 0.5, 0.75, 1];
    const outputX = inputRange.map(v => RADIUS * Math.cos(startAngle + (v * direction * 2 * Math.PI)));
    const outputY = inputRange.map(v => (RADIUS * ELLIPSE_RATIO) * Math.sin(startAngle + (v * direction * 2 * Math.PI)));

    return (
      <View style={[styles.orbitWrapper, { transform: [{ rotate: rotation }] }]}>
        <View style={[styles.ellipseLine, { width: RADIUS * 2, height: (RADIUS * 2) * ELLIPSE_RATIO, borderRadius: RADIUS }]} />
        <Animated.View style={[styles.iconContainer, {
          transform: [
            { translateX: animValue.interpolate({ inputRange, outputRange: outputX }) },
            { translateY: animValue.interpolate({ inputRange, outputRange: outputY }) },
            { rotate: rotation.startsWith('-') ? rotation.substring(1) : '-' + rotation }
          ],
        }]}>
          {icon.type === 'MCI' ? (
            <MaterialCommunityIcons name={icon.name as any} size={icon.size} color={icon.color} />
          ) : (
            <FontAwesome5 name={icon.name as any} size={icon.size} color={icon.color} />
          )}
        </Animated.View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
      <LinearGradient colors={['#FFFFFF', '#FDFDFF', '#F2F4FF']} style={styles.background} />

      {/* ÁREA VISUAL COM LOGO GIGANTE */}
      <View style={styles.visualArea}>
        {renderOrbit(PILLARS[0], '0deg', 1, 0)}
        {renderOrbit(PILLARS[1], '45deg', -1, Math.PI / 2)}
        {renderOrbit(PILLARS[2], '90deg', 1, Math.PI)}
        {renderOrbit(PILLARS[3], '135deg', -1, (3 * Math.PI) / 2)}

        <View style={styles.centralContainer}>
          <View style={styles.innerCircle}>
            {/* LOGO MAXIMIZADA */}
            <Image 
              source={require('@/assets/images/logo-sem-fundo1.png')} 
              style={styles.logoStyle}
              resizeMode="contain"
            />
          </View>
        </View>
      </View>

      {/* CONTEÚDO E BOTÕES */}
      <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
        <Text style={styles.titleText}>Pronto para começar?</Text>
        
        <View style={styles.buttonContainer}>
          <Pressable 
            style={styles.primaryButton}
            onPress={() => router.push('/ObjetivoScreen')}
          >
            <View style={styles.buttonContent}>
              <MaterialCommunityIcons name="bolt" size={24} color="#FFFFFF" />
              <Text style={styles.primaryText}>Iniciar Desafio</Text>
            </View>
          </Pressable>

          <Pressable 
            style={styles.secondaryButton}
            onPress={() => router.push('/(drawer)/login')}
          >
            <Text style={styles.secondaryButtonText}>Já tenho uma conta</Text>
          </Pressable>
        </View>
      </Animated.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  background: { ...StyleSheet.absoluteFillObject },
  visualArea: { 
    flex: 0.65, 
    justifyContent: 'center', 
    alignItems: 'center',
    marginTop: 10,
  },
  orbitWrapper: { 
    position: 'absolute', 
    justifyContent: 'center', 
    alignItems: 'center',
    width: '100%',
    height: '100%'
  },
  ellipseLine: {
    position: 'absolute',
    borderWidth: 1.2,
    borderColor: 'rgba(112, 82, 230, 0.1)',
    backgroundColor: 'transparent',
  },
  iconContainer: { position: 'absolute' },
  centralContainer: {
    width: 160, // Aumentado significativamente
    height: 160, 
    borderRadius: 80,
    backgroundColor: 'rgba(112, 82, 230, 0.04)',
    justifyContent: 'center', alignItems: 'center', zIndex: 10,
  },
  innerCircle: {
    width: 145, // Quase o tamanho total do container
    height: 145, 
    borderRadius: 72.5,
    backgroundColor: '#fff',
    justifyContent: 'center', alignItems: 'center',
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 12 },
      android: { elevation: 12 },
    }),
  },
  logoStyle: {
    width: '95%', // Ocupa quase todo o círculo branco
    height: '95%',
  },
  content: { 
    flex: 0.35, 
    alignItems: 'center', 
    justifyContent: 'flex-start',
    paddingHorizontal: 30 
  },
  titleText: {
    color: '#333',
    fontSize: 28,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: 25,
  },
  buttonContainer: {
    width: '100%',
    gap: 15,
  },
  primaryButton: {
    width: '100%',
    backgroundColor: '#7052e6',
    borderRadius: 18,
    paddingVertical: 18,
    alignItems: 'center',
    elevation: 4,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  primaryText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '700',
  },
  secondaryButton: {
    width: '100%',
    paddingVertical: 16,
    borderRadius: 18,
    borderWidth: 2,
    borderColor: '#7052e6',
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: '#7052e6',
    fontSize: 16,
    fontWeight: '700',
  },
});