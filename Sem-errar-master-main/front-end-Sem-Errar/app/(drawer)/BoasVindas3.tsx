import React, { useEffect, useRef } from 'react';
import { Animated, Dimensions, StyleSheet, Text, View, Easing, StatusBar, Platform } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';

const { width, height } = Dimensions.get('window');

const COLORS = {
  line: 'rgba(112, 82, 230, 0.15)', 
  dot: '#4ecdc4',                 
  icon: '#7052e6',                
};

export default function BoasVindas3() {
  const animValue = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current; 
  const router = useRouter();

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();

    animValue.setValue(0);
    Animated.loop(
      Animated.timing(animValue, {
        toValue: 1,
        duration: 35000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.15,
          duration: 1200,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1200,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start();

    const fadeOutTimer = setTimeout(() => {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }).start();
    }, 2500);

    const navTimer = setTimeout(() => {
      router.replace('/'); // FINALIZA O FLUXO
    }, 3000);

    return () => {
      clearTimeout(fadeOutTimer);
      clearTimeout(navTimer);
    };
  }, []);

  const RADIUS = width * 0.85;
  const ELLIPSE_RATIO = 0.55;

  const renderOrbit = (dotCount: number, orbitRotation: string, direction: number = 1) => {
    const spin = animValue.interpolate({
      inputRange: [0, 1],
      outputRange: direction === 1 ? ['0deg', '360deg'] : ['360deg', '0deg']
    });

    return (
      <View style={[styles.orbitWrapper, { transform: [{ rotate: orbitRotation }] }]}>
        <Animated.View style={[
          styles.ellipseLine,
          {
            width: RADIUS * 2,
            height: (RADIUS * 2) * ELLIPSE_RATIO,
            borderRadius: RADIUS,
            transform: [{ rotate: spin }]
          }
        ]} />
        {Array.from({ length: dotCount }).map((_, index) => {
          const startAngle = (index * (360 / dotCount)) * (Math.PI / 180);
          const inputRange = [0, 0.25, 0.5, 0.75, 1];
          const outputX = inputRange.map(v => RADIUS * Math.cos(startAngle + (v * direction * 2 * Math.PI)));
          const outputY = inputRange.map(v => (RADIUS * ELLIPSE_RATIO) * Math.sin(startAngle + (v * direction * 2 * Math.PI)));
          return (
            <Animated.View
              key={`dot-v3-new-${index}`}
              style={[
                styles.dotContainer,
                {
                  transform: [
                    { translateX: animValue.interpolate({ inputRange, outputRange: outputX }) },
                    { translateY: animValue.interpolate({ inputRange, outputRange: outputY }) },
                  ],
                },
              ]}
            >
              <View style={styles.hollowDot} />
            </Animated.View>
          );
        })}
      </View>
    );
  };

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent={true} />
      <LinearGradient colors={['#FFFFFF', '#F2F5FF', '#FFFFFF']} style={styles.background} />
      <View style={styles.visualArea}>
        {renderOrbit(4, '0deg', 1)}
        {renderOrbit(4, '120deg', -1)}
      </View>
      <View style={styles.content}>
        <Animated.View style={[styles.centralIconWrapper, { transform: [{ scale: pulseAnim }] }]}>
          <MaterialCommunityIcons name="brain" size={55} color={COLORS.icon} />
        </Animated.View>
        <Text style={styles.descriptionText}>Automatize e personalize sua rotina!</Text>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  background: { ...StyleSheet.absoluteFillObject },
  visualArea: { ...StyleSheet.absoluteFillObject, justifyContent: 'center', alignItems: 'center' },
  orbitWrapper: { position: 'absolute', justifyContent: 'center', alignItems: 'center', width: '100%', height: '100%' },
  ellipseLine: { position: 'absolute', borderWidth: 1.5, borderColor: COLORS.line, backgroundColor: 'transparent' },
  dotContainer: { position: 'absolute', justifyContent: 'center', alignItems: 'center' },
  hollowDot: { width: 10, height: 10, borderRadius: 5, borderWidth: 2, borderColor: COLORS.dot, backgroundColor: '#fff' },
  content: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 40, zIndex: 30 },
  centralIconWrapper: { marginBottom: 20, shadowColor: COLORS.icon, shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.25, shadowRadius: 15, elevation: 5 },
  descriptionText: { color: '#777', fontSize: 24, fontWeight: 'bold', textAlign: 'center', lineHeight: 28 },
});