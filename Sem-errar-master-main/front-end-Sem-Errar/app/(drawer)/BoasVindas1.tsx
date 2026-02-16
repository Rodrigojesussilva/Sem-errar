import React, { useEffect, useRef } from 'react';
import { Animated, Dimensions, StyleSheet, Text, View, Easing, StatusBar, Image, Platform } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';

const { width } = Dimensions.get('window');

interface IconConfig {
  name: string;
  color: string;
  size: number;
}

const ICONS: IconConfig[] = [
  { name: 'dumbbell', color: '#7052e6', size: 18 },
  { name: 'tint', color: '#5194e0', size: 20 },
  { name: 'running', color: '#e96f04', size: 18 },
  { name: 'apple-alt', color: '#fa3e3e', size: 22 },
  { name: 'bread-slice', color: '#f5a623', size: 20 },
  { name: 'glass-whiskey', color: '#5194e0', size: 18 },
  { name: 'carrot', color: '#ed8a19', size: 20 },
  { name: 'cheese', color: '#f5d142', size: 18 },
  { name: 'egg', color: '#999', size: 16 },
  { name: 'fish', color: '#64b6df', size: 20 },
  { name: 'leaf', color: '#4cd964', size: 18 },
  { name: 'coffee', color: '#a67c52', size: 18 },
];

export default function BoasVindas1() {
  const animValue = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(1)).current; 
  const router = useRouter();

  useEffect(() => {
    // 1. Animação infinita das órbitas
    animValue.setValue(0);
    Animated.loop(
      Animated.timing(animValue, {
        toValue: 1,
        duration: 40000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();

    // 2. Inicia o Fade Out aos 3.5 segundos
    const fadeTimer = setTimeout(() => {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 500, 
        useNativeDriver: true,
      }).start();
    }, 3500);

    // 3. Redireciona exatamente aos 4 segundos
    const navTimer = setTimeout(() => {
      router.replace('/(drawer)/BoasVindas2');
    }, 4000);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(navTimer);
    };
  }, []);

  const RADIUS = width * 0.85; 
  const ELLIPSE_RATIO = 0.55; 

  const renderOrbit = (icons: IconConfig[], orbitRotation: string, direction: number = 1) => {
    return (
      <View style={[styles.orbitWrapper, { transform: [{ rotate: orbitRotation }] }]}>
        <View style={[styles.ellipseLine, { 
          width: RADIUS * 2, 
          height: (RADIUS * 2) * ELLIPSE_RATIO, 
          borderRadius: RADIUS 
        }]} />
        
        {icons.map((icon, index) => {
          const startAngle = (index * (360 / icons.length)) * (Math.PI / 180);
          const inputRange = [0, 0.25, 0.5, 0.75, 1];
          const outputX = inputRange.map(v => {
            const angle = startAngle + (v * direction * 2 * Math.PI);
            return RADIUS * Math.cos(angle);
          });
          const outputY = inputRange.map(v => {
            const angle = startAngle + (v * direction * 2 * Math.PI);
            return (RADIUS * ELLIPSE_RATIO) * Math.sin(angle);
          });
          return (
            <Animated.View
              key={`${icon.name}-${index}`}
              style={[
                styles.iconContainer,
                {
                  transform: [
                    { translateX: animValue.interpolate({ inputRange, outputRange: outputX }) },
                    { translateY: animValue.interpolate({ inputRange, outputRange: outputY }) },
                    { rotate: orbitRotation.startsWith('-') ? orbitRotation.substring(1) : '-' + orbitRotation }
                  ],
                  opacity: 0.5,
                },
              ]}
            >
              <FontAwesome5 name={icon.name as any} size={icon.size} color={icon.color} />
            </Animated.View>
          );
        })}
      </View>
    );
  };

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      {/* StatusBar corrigida - texto claro para fundo roxo */}
      <StatusBar 
        barStyle="light-content" 
        backgroundColor="#7052e6" 
        translucent={false}
      />
      
      {/* Background idêntico às outras telas ✅ */}
      <LinearGradient colors={['#FFFFFF', '#F9FAFF', '#FFFFFF']} style={styles.background} />
      
      <View style={styles.visualArea}>
        {renderOrbit(ICONS.slice(0, 4), '0deg', 1)}
        {renderOrbit(ICONS.slice(4, 8), '120deg', -1)}
        {renderOrbit(ICONS.slice(8, 12), '240deg', 1)}
      </View>

      <View style={styles.content}>
        <Text style={styles.welcomeText}>Bem-vindo ao</Text>
        <Image 
          source={require('../../assets/images/completa-sem-fundo1.png')} 
          style={styles.logo}
          resizeMode="contain"
        />
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#fff' 
  },
  background: {
    ...StyleSheet.absoluteFillObject,
  },
  visualArea: { 
    ...StyleSheet.absoluteFillObject, 
    justifyContent: 'center', 
    alignItems: 'center' 
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
    borderColor: 'rgba(0, 0, 0, 0.08)',
    backgroundColor: 'transparent',
  },
  iconContainer: { 
    position: 'absolute', 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  content: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center', 
    padding: 20, 
    zIndex: 30 
  },
  welcomeText: { 
    color: '#555', 
    fontSize: 22, 
    fontWeight: 'bold', 
    marginBottom: 8, 
    textAlign: 'center' 
  },
  logo: { 
    width: width * 0.75, 
    height: 150 
  },
});