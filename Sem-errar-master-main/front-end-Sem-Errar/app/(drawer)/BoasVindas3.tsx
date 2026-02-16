import React, { useEffect, useRef } from 'react';
import { Animated, Dimensions, StyleSheet, Text, View, Easing, StatusBar } from 'react-native';
import { FontAwesome5, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';

const { width, height } = Dimensions.get('window');

interface IconConfig {
  name: string;
  color: string;
  size: number;
  library: 'FA5' | 'MCI' | 'MI';
}

const DATA_ICONS: IconConfig[] = [
  { name: 'folder-open', color: '#f1c40f', size: 18, library: 'FA5' },
  { name: 'cloud-upload-alt', color: '#3498db', size: 20, library: 'FA5' },
  { name: 'calendar-check', color: '#e74c3c', size: 22, library: 'FA5' },
  { name: 'link', color: '#9b59b6', size: 18, library: 'FA5' },
  { name: 'view-dashboard', color: '#2ecc71', size: 20, library: 'MCI' },
  { name: 'layers', color: '#34495e', size: 18, library: 'MI' },
  { name: 'all-inclusive', color: '#e67e22', size: 16, library: 'MI' },
  { name: 'box-open', color: '#7f8c8d', size: 20, library: 'FA5' },
];

export default function BoasVindas3() {
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

    // 4. Navegação para a RAIZ (mesmo destino da sua outra tela)
    const navTimer = setTimeout(() => {
      router.replace('/'); 
    }, 3000);

    return () => {
      clearTimeout(fadeOutTimer);
      clearTimeout(navTimer);
    };
  }, []);

  const RADIUS = width * 0.85; 
  const ELLIPSE_RATIO = 0.55; 

  const renderIcon = (icon: IconConfig) => {
    if (icon.library === 'MCI') return <MaterialCommunityIcons name={icon.name as any} size={icon.size} color={icon.color} />;
    if (icon.library === 'MI') return <MaterialIcons name={icon.name as any} size={icon.size} color={icon.color} />;
    return <FontAwesome5 name={icon.name as any} size={icon.size} color={icon.color} />;
  };

  const renderOrbit = (icons: IconConfig[], orbitRotation: string, inverseRotation: string, direction: number = 1) => {
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
                    { rotate: inverseRotation }
                  ],
                  opacity: 0.6,
                },
              ]}
            >
              {renderIcon(icon)}
            </Animated.View>
          );
        })}
      </View>
    );
  };

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent={true} />
      <LinearGradient colors={['#FFFFFF', '#FDFEFF', '#FFFFFF']} style={styles.background} />

      <View style={styles.visualArea}>
        {renderOrbit(DATA_ICONS.slice(0, 4), '60deg', '-60deg', 1)}
        {renderOrbit(DATA_ICONS.slice(4, 8), '300deg', '-300deg', -1)}
      </View>

      <View style={styles.content}>
        <View style={styles.centralIconWrapper}>
          <FontAwesome5 name="box" size={45} color="#4A90E2" />
        </View>
        <Text style={styles.descriptionText}>Tudo em um só lugar!</Text>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  background: { ...StyleSheet.absoluteFillObject },
  visualArea: { ...StyleSheet.absoluteFillObject, justifyContent: 'center', alignItems: 'center' },
  orbitWrapper: { position: 'absolute', justifyContent: 'center', alignItems: 'center', width: '100%', height: '100%' },
  ellipseLine: { position: 'absolute', borderWidth: 1.2, borderColor: 'rgba(74, 144, 226, 0.15)', backgroundColor: 'transparent' },
  iconContainer: { position: 'absolute', justifyContent: 'center', alignItems: 'center' },
  content: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 40, zIndex: 30 },
  centralIconWrapper: { marginBottom: 25, elevation: 3, shadowColor: "#000", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 5 },
  descriptionText: { color: '#333', fontSize: 24, fontWeight: '800', textAlign: 'center', lineHeight: 32 },
});