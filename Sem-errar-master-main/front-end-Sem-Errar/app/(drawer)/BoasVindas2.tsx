import React, { useEffect, useRef } from 'react';
import { Animated, Dimensions, StyleSheet, Text, View, Easing, StatusBar, Platform } from 'react-native';
import { FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';

const { width, height } = Dimensions.get('window');

interface IconConfig {
  name: string;
  color: string;
  size: number;
}

const DATA_ICONS: IconConfig[] = [
  { name: 'chart-line', color: '#4cd964', size: 18 },
  { name: 'calculator', color: '#5194e0', size: 20 },
  { name: 'target', color: '#fa3e3e', size: 22 },
  { name: 'speedometer', color: '#7052e6', size: 18 },
  { name: 'trending-up', color: '#e96f04', size: 20 },
  { name: 'robot', color: '#555', size: 18 },
  { name: 'database', color: '#5194e0', size: 16 },
  { name: 'arm-flex', color: '#7052e6', size: 20 },
];

export default function BoasVindas2() {
  const animValue = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current; 
  const router = useRouter();

  useEffect(() => {
    // 1. Fade In suave
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();

    // 2. Animação das órbitas
    animValue.setValue(0);
    Animated.loop(
      Animated.timing(animValue, {
        toValue: 1,
        duration: 40000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();

    // 3. Fade Out começando aos 2.5s
    const fadeOutTimer = setTimeout(() => {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }).start();
    }, 2500);

    // 4. Navegação para a próxima tela aos 3s
    const navTimer = setTimeout(() => {
      router.replace('/(drawer)/BoasVindas3'); 
    }, 3000);

    return () => {
      clearTimeout(fadeOutTimer);
      clearTimeout(navTimer);
    };
  }, []);

  const RADIUS = width * 0.85; 
  const ELLIPSE_RATIO = 0.55; 

  const renderOrbit = (icons: IconConfig[], orbitRotation: string, direction: number = 1) => {
    return (
      <View style={[styles.orbitWrapper, { transform: [{ rotate: orbitRotation }] }]}>
        {/* Linhas do átomo com visibilidade reforçada ⚛️ */}
        <View style={[styles.ellipseLine, { 
          width: RADIUS * 2, 
          height: (RADIUS * 2) * ELLIPSE_RATIO, 
          borderRadius: RADIUS 
        }]} />
        
        {icons.map((icon, index) => {
          const startAngle = (index * (360 / icons.length)) * (Math.PI / 180);
          const inputRange = [0, 0.25, 0.5, 0.75, 1];
          const outputX = inputRange.map(v => RADIUS * Math.cos(startAngle + (v * direction * 2 * Math.PI)));
          const outputY = inputRange.map(v => (RADIUS * ELLIPSE_RATIO) * Math.sin(startAngle + (v * direction * 2 * Math.PI)));

          return (
            <Animated.View
              key={`${icon.name}-${index}`}
              style={[
                styles.iconContainer,
                {
                  transform: [
                    { translateX: animValue.interpolate({ inputRange, outputRange: outputX }) },
                    { translateY: animValue.interpolate({ inputRange, outputRange: outputY }) },
                    { rotate: `-${orbitRotation}` }
                  ],
                  opacity: 0.5,
                },
              ]}
            >
              {['arm-flex', 'speedometer', 'target', 'robot'].includes(icon.name) ? (
                <MaterialCommunityIcons name={icon.name as any} size={icon.size} color={icon.color} />
              ) : (
                <FontAwesome5 name={icon.name as any} size={icon.size} color={icon.color} />
              )}
            </Animated.View>
          );
        })}
      </View>
    );
  };

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent={true} />
      
      <LinearGradient colors={['#FFFFFF', '#F9FAFF', '#FFFFFF']} style={styles.background} />

      <View style={styles.visualArea}>
        {renderOrbit(DATA_ICONS.slice(0, 4), '0deg', 1)}
        {renderOrbit(DATA_ICONS.slice(4, 8), '120deg', -1)}
      </View>

      <View style={styles.content}>
        <View style={styles.centralIconWrapper}>
          <FontAwesome5 name="brain" size={40} color="#7052e6" />
        </View>
        
        <Text style={styles.descriptionText}>
          Desafios personalizados e automatizados!
        </Text>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  background: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    height: height + (Platform.OS === 'android' ? (StatusBar.currentHeight || 0) : 0),
  },
  visualArea: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  orbitWrapper: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
  },
  ellipseLine: {
    position: 'absolute',
    borderWidth: 1.5, // Espessura aumentada
    borderColor: 'rgba(0, 0, 0, 0.15)', // Opacidade aumentada para maior visibilidade
    backgroundColor: 'transparent',
  },
  iconContainer: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
    zIndex: 30,
  },
  centralIconWrapper: {
    marginBottom: 20,
    opacity: 0.8,
  },
  descriptionText: {
    color: '#555',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    lineHeight: 28,
  },
});