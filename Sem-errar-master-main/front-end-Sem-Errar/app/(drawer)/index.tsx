import React, { useEffect, useRef } from 'react';
import { Animated, Dimensions, StyleSheet, Text, View, Easing, StatusBar, Pressable, Image } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';

const { width, height } = Dimensions.get('window');

const COLORS = {
  line: 'rgba(112, 82, 230, 0.15)', 
  dot: '#4ecdc4',                 
  primary: '#7052e6',             
  text: '#1A1A1A',
};

export default function BoasVindas4() {
  const animValue = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const router = useRouter();

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();

    Animated.loop(
      Animated.timing(animValue, {
        toValue: 1,
        duration: 35000, 
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();
  }, []);

  const renderOrbit = (dotCount: number, radX: number, radY: number, rotation: string, reverse: boolean) => {
    const rotateData = animValue.interpolate({
      inputRange: [0, 1],
      outputRange: reverse ? ['360deg', '0deg'] : ['0deg', '360deg'],
    });

    const direction = reverse ? -1 : 1;

    return (
      <Animated.View 
        style={[
          styles.orbitWrapper, 
          { transform: [{ rotate: rotation }, { rotateZ: rotateData }] }
        ]}
      >
        <View style={[styles.ellipseLine, { width: radX * 2, height: radY * 2 }]} />
        
        {Array.from({ length: dotCount }).map((_, index) => {
          const startAngle = (index * (360 / dotCount)) * (Math.PI / 180);
          const inputRange = [0, 0.25, 0.5, 0.75, 1];
          const outputX = inputRange.map(v => radX * Math.cos(startAngle + (v * direction * 2 * Math.PI)));
          const outputY = inputRange.map(v => radY * Math.sin(startAngle + (v * direction * 2 * Math.PI)));

          return (
            <Animated.View
              key={`dot-v4-${rotation}-${index}`}
              style={[
                styles.dotPos,
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
      </Animated.View>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
      
      <View style={[StyleSheet.absoluteFillObject, { backgroundColor: '#fff' }]} />

      <View style={styles.mainContent}>
        
        <View style={styles.logoSection}>
           {/* Órbitas centralizadas na logo */}
           <View style={styles.visualArea}>
              {renderOrbit(1, width * 0.95, height * 0.32, '30deg', false)}
              {renderOrbit(2, width * 0.85, height * 0.28, '160deg', true)}
              {renderOrbit(1, width * 0.55, height * 0.55, '10deg', false)}
              {renderOrbit(1, width * 0.45, height * 0.22, '100deg', true)}
           </View>

           <Animated.Image 
            source={require('@/assets/images/completa-sem-fundo1.png')} 
            style={[styles.logoStyle, { opacity: fadeAnim }]}
            resizeMode="contain"
          />
        </View>

        <Animated.View style={[styles.bottomSection, { opacity: fadeAnim }]}>
          <Text style={styles.titleText}>Pronto para começar?</Text>
          
          <View style={styles.buttonContainer}>
            <Pressable onPress={() => router.push('/ObjetivoScreen')}>
              <LinearGradient
                colors={['#4ecdc4', '#622db2', '#4b208c']} // Tom alterado para #622db2 no centro
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.primaryButton}
              >
                <View style={styles.buttonContent}>
                  <MaterialCommunityIcons name="bolt" size={24} color="#FFFFFF" />
                  <Text style={styles.primaryText}>Iniciar Desafio</Text>
                </View>
              </LinearGradient>
            </Pressable>

            <Pressable style={styles.secondaryButton} onPress={() => router.push('/(drawer)/login')}>
              <Text style={styles.secondaryButtonText}>Já tenho uma conta</Text>
            </Pressable>
          </View>
        </Animated.View>

      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  mainContent: { flex: 1 },
  visualArea: { 
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center', 
    alignItems: 'center',
  },
  orbitWrapper: { 
    position: 'absolute', 
    justifyContent: 'center', 
    alignItems: 'center',
  },
  ellipseLine: {
    borderWidth: 1.5,
    borderColor: COLORS.line,
    borderRadius: 1000,
    backgroundColor: 'transparent',
    position: 'absolute',
  },
  dotPos: { position: 'absolute' },
  hollowDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    borderWidth: 2,
    borderColor: COLORS.dot,
    backgroundColor: '#fff',
    elevation: 2,
  },
  logoSection: {
    flex: 0.6,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 60,
  },
  logoStyle: {
    width: width * 0.85,
    height: width * 0.85,
    zIndex: 20,
  },
  bottomSection: {
    flex: 0.4,
    alignItems: 'center',
    paddingHorizontal: 35,
    justifyContent: 'center',
  },
  titleText: {
    color: COLORS.text,
    fontSize: 26,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: 30,
  },
  buttonContainer: { width: '100%', gap: 12 },
  primaryButton: {
    width: '100%',
    borderRadius: 20,
    paddingVertical: 18,
    alignItems: 'center',
    elevation: 6,
  },
  buttonContent: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  primaryText: { color: '#FFFFFF', fontSize: 20, fontWeight: '700' },
  secondaryButton: { width: '100%', paddingVertical: 12, alignItems: 'center' },
  secondaryButtonText: { color: COLORS.dot, fontSize: 16, fontWeight: '700' },
});