import React, { useEffect, useRef } from 'react';
import { Animated, Dimensions, StyleSheet, Text, View, Easing, StatusBar, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';

const { width } = Dimensions.get('window');

const COLORS = {
  line: 'rgba(112, 82, 230, 0.15)', 
  dot: '#4ecdc4',                 
  welcomeText: '#777', // Um cinza mais suave para o "Bem-vindo ao"
  brandText: '#555', // Preto quase puro para o nome do app ter destaque
};

export default function BoasVindas1() {
  const animValue = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(1)).current; 
  const pulseAnim = useRef(new Animated.Value(1)).current; 
  const router = useRouter();

  useEffect(() => {
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
          toValue: 1.08,
          duration: 1500,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1500,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start();

    const fadeTimer = setTimeout(() => {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 500, 
        useNativeDriver: true,
      }).start();
    }, 3500);

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

  const renderOrbit = (count: number, orbitRotation: string, direction: number = 1) => {
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
        
        {Array.from({ length: count }).map((_, index) => {
          const startAngle = (index * (360 / count)) * (Math.PI / 180);
          const inputRange = [0, 0.25, 0.5, 0.75, 1];
          const outputX = inputRange.map(v => RADIUS * Math.cos(startAngle + (v * direction * 2 * Math.PI)));
          const outputY = inputRange.map(v => (RADIUS * ELLIPSE_RATIO) * Math.sin(startAngle + (v * direction * 2 * Math.PI)));

          return (
            <Animated.View
              key={`dot-v1-${index}`}
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
      
      <LinearGradient colors={['#FFFFFF', '#FFFFFF', '#FFFFFF']} style={styles.background} />
      
      <View style={styles.visualArea}>
        {renderOrbit(2, '0deg', 1)}
        {renderOrbit(2, '120deg', -1)}
        {renderOrbit(2, '240deg', 1)}
      </View>

      <View style={styles.content}>
        <Animated.Image 
          source={require('../../assets/images/icone-sem-fundo.png')} 
          style={[styles.logoIcon, { transform: [{ scale: pulseAnim }] }]}
          resizeMode="contain"
        />
        
        <View style={styles.textWrapper}>
          <Text style={styles.welcomeText}>Bem-vindo ao</Text>
          <Text style={styles.brandName}>Sem Errar! Desafio Fitness</Text>
        </View>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  background: { ...StyleSheet.absoluteFillObject },
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
    borderWidth: 1.5,
    borderColor: COLORS.line,
    backgroundColor: 'transparent',
  },
  dotContainer: { 
    position: 'absolute', 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  hollowDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    borderWidth: 2,
    borderColor: COLORS.dot,
    backgroundColor: '#fff',
  },
  content: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center', 
    padding: 20, 
    zIndex: 30 
  },
  logoIcon: { 
    width: 130, 
    height: 130, 
    marginBottom: 20
  },
  textWrapper: {
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  welcomeText: { 
    color: COLORS.welcomeText, 
    fontSize: 18, 
    fontWeight: '500', 
    textAlign: 'center',
    marginBottom: 4,
  },
  brandName: { 
    color: COLORS.brandText, 
    fontSize: 24, 
    fontWeight: '900', // Extra negrito para destaque máximo
    textAlign: 'center',
    letterSpacing: -0.5,
  },
});