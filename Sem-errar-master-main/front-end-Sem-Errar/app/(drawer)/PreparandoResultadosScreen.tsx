import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback, useRef, useState } from 'react';
import {
  Animated,
  Dimensions,
  Easing,
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

const COLORS = {
  primary: '#622db2',
  dot: '#4ecdc4',
  line: 'rgba(112, 82, 230, 0.15)',
  textMain: '#1A1A1A',
  textSub: '#6B7A8F',
  bgCard: 'rgba(255, 255, 255, 0.95)',
};

const ETAPAS = [
  'Calculando índice de massa corporal…',
  'Calculando taxa metabólica basal…',
  'Calculando gasto calórico diário…',
  'Calculando percentual de gordura…',
  'Calculando massa magra…',
  'Calculando massa gorda…',
];

export default function PreparandoResultadosScreen() {
  const router = useRouter();
  const [etapaAtual, setEtapaAtual] = useState(0);

  // Animações
  const rotacao = useRef(new Animated.Value(0)).current;
  const pulsar = useRef(new Animated.Value(1)).current;
  const translateX1 = useRef(new Animated.Value(-150)).current;
  const translateX2 = useRef(new Animated.Value(-150)).current;
  const translateX3 = useRef(new Animated.Value(-150)).current;

  const timeoutsRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  const animacoesTexto = useRef(
    ETAPAS.map(() => ({
      opacity: new Animated.Value(0),
      translateY: new Animated.Value(10),
    }))
  ).current;

  const limparTimeouts = useCallback(() => {
    timeoutsRef.current.forEach(timeout => clearTimeout(timeout));
    timeoutsRef.current = [];
  }, []);

  useFocusEffect(
    useCallback(() => {
      limparTimeouts();
      setEtapaAtual(0);
      rotacao.setValue(0);
      pulsar.setValue(1);
      
      animacoesTexto.forEach(anim => {
        anim.opacity.setValue(0);
        anim.translateY.setValue(10);
      });

      iniciarAnimacoes();
      iniciarSequenciaTextos();

      return () => limparTimeouts();
    }, [])
  );

  const iniciarAnimacoes = () => {
    Animated.loop(
      Animated.timing(rotacao, {
        toValue: 1,
        duration: 8000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(pulsar, { toValue: 1.1, duration: 1000, useNativeDriver: true }),
        Animated.timing(pulsar, { toValue: 1, duration: 1000, useNativeDriver: true }),
      ])
    ).start();

    const animaBarra = (val: Animated.Value, delay: number) => {
      Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(val, { toValue: 150, duration: 1800, useNativeDriver: true }),
          Animated.timing(val, { toValue: -150, duration: 0, useNativeDriver: true }),
        ])
      ).start();
    };

    animaBarra(translateX1, 0);
    animaBarra(translateX2, 300);
    animaBarra(translateX3, 600);
  };

  const iniciarSequenciaTextos = () => {
    let index = 0;
    const mostrarProximaEtapa = () => {
      if (index < ETAPAS.length) {
        Animated.parallel([
          Animated.timing(animacoesTexto[index].opacity, { toValue: 1, duration: 400, useNativeDriver: true }),
          Animated.timing(animacoesTexto[index].translateY, { toValue: 0, duration: 400, useNativeDriver: true }),
        ]).start();

        setEtapaAtual(index);
        index++;

        if (index < ETAPAS.length) {
          const timeout = setTimeout(mostrarProximaEtapa, 1200);
          timeoutsRef.current.push(timeout);
        } else {
          // Transição automática para a tela de finalização
          const timeoutFinal = setTimeout(() => {
            router.push('/FinalizacaoScreen');
          }, 1500);
          timeoutsRef.current.push(timeoutFinal);
        }
      }
    };
    timeoutsRef.current.push(setTimeout(mostrarProximaEtapa, 500));
  };

  const spin = rotacao.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const renderBackground = () => (
    <View style={styles.visualArea}>
      <Animated.View style={[styles.ellipseLine, { width: width * 1.3, height: width * 1.3, top: -width * 0.3, transform: [{ rotate: spin }] }]}>
         <View style={[styles.staticDot, { bottom: '20%', right: '20%' }]} />
      </Animated.View>
      <Animated.View style={[styles.ellipseLine, { width: width * 1.6, height: width * 1.6, bottom: -width * 0.4, transform: [{ rotate: spin }] }]}>
        <View style={[styles.staticDot, { top: '15%', left: '15%' }]} />
      </Animated.View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
      
      {renderBackground()}

      <View style={styles.mainWrapper}>
        
        {/* CABEÇALHO (SEM LOGO) */}
        <View style={styles.sectionTop}>
            <Text style={styles.titulo}>Analisando Dados</Text>
            <Text style={styles.subtitulo}>Processando suas informações corporais</Text>
        </View>

        {/* ÁREA CENTRAL ANIMADA */}
        <View style={styles.sectionCenter}>
          <View style={styles.visualContainer}>
            <Animated.View style={[styles.radarCircle, { transform: [{ rotate: spin }] }]} />
            <Animated.View style={[styles.pulseCircle, { transform: [{ scale: pulsar }] }]} />
            <View style={styles.iconBox}>
              <LinearGradient colors={[COLORS.dot, COLORS.primary]} style={styles.gradient}>
                <FontAwesome name="heartbeat" size={36} color="#FFF" />
              </LinearGradient>
            </View>
          </View>

          <View style={styles.dataBarsContainer}>
            <View style={styles.barTrack}><Animated.View style={[styles.barFill, { transform: [{ translateX: translateX1 }] }]} /></View>
            <View style={styles.barTrack}><Animated.View style={[styles.barFill, { transform: [{ translateX: translateX2 }] }]} /></View>
            <View style={styles.barTrack}><Animated.View style={[styles.barFill, { transform: [{ translateX: translateX3 }] }]} /></View>
          </View>

          <View style={styles.statsRow}>
             {['IMC', 'TMB', 'TDEE', 'BF%'].map((st, i) => (
               <View key={i} style={styles.statItem}>
                 <View style={[styles.statDot, { backgroundColor: i % 2 === 0 ? COLORS.dot : COLORS.primary }]} />
                 <Text style={styles.statText}>{st}</Text>
               </View>
             ))}
          </View>
        </View>

        {/* ETAPAS E PROGRESSO */}
        <View style={styles.sectionBottom}>
            <View style={styles.listWrapper}>
              {ETAPAS.map((texto, index) => (
                <Animated.View key={index} style={[styles.cardEtapa, { opacity: animacoesTexto[index].opacity, transform: [{ translateY: animacoesTexto[index].translateY }], borderColor: index === etapaAtual ? COLORS.dot : 'transparent' }]}>
                  <View style={styles.checkSpace}>
                    {index < etapaAtual ? <FontAwesome name="check-circle" size={18} color={COLORS.dot} /> : <View style={[styles.dotOff, index === etapaAtual && { backgroundColor: COLORS.dot }]} />}
                  </View>
                  <Text style={[styles.textoEtapa, index === etapaAtual && styles.textoEtapaActive]}>{texto}</Text>
                </Animated.View>
              ))}
            </View>

            <View style={styles.progressoArea}>
                <Text style={styles.otimismo}>Quase lá! Preparando tudo para você 💪</Text>
                <View style={styles.fullBar}>
                    <Animated.View style={[styles.fillBar, { width: `${((etapaAtual + 1) / ETAPAS.length) * 100}%` }]} />
                </View>
                <Text style={styles.percentText}>Concluindo {Math.round(((etapaAtual + 1) / ETAPAS.length) * 100)}%</Text>
            </View>
        </View>

      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  visualArea: { ...StyleSheet.absoluteFillObject, overflow: 'hidden', zIndex: 0 },
  ellipseLine: { position: 'absolute', borderWidth: 1, borderColor: COLORS.line, borderRadius: 999, alignSelf: 'center' },
  staticDot: { position: 'absolute', width: 6, height: 6, borderRadius: 3, backgroundColor: COLORS.dot },

  mainWrapper: { 
    flex: 1, 
    zIndex: 10, 
    paddingHorizontal: 25, 
    paddingVertical: 40, 
    justifyContent: 'space-around', 
    alignItems: 'center' 
  },

  sectionTop: { alignItems: 'center', width: '100%', marginBottom: 10 },
  sectionCenter: { alignItems: 'center', width: '100%' },
  sectionBottom: { width: '100%' },

  titulo: { fontSize: 26, fontWeight: '900', color: COLORS.textMain, textAlign: 'center' },
  subtitulo: { fontSize: 15, color: COLORS.dot, fontWeight: '700', textAlign: 'center', marginTop: 4 },

  visualContainer: { height: 130, width: 130, justifyContent: 'center', alignItems: 'center', marginBottom: 10 },
  radarCircle: { position: 'absolute', width: 120, height: 120, borderRadius: 60, borderWidth: 1.5, borderColor: COLORS.dot, borderStyle: 'dashed', opacity: 0.4 },
  pulseCircle: { position: 'absolute', width: 90, height: 90, borderRadius: 45, backgroundColor: 'rgba(78, 205, 196, 0.15)' },
  iconBox: { width: 70, height: 70, borderRadius: 35, elevation: 6, shadowColor: COLORS.primary, shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.2, shadowRadius: 5 },
  gradient: { flex: 1, borderRadius: 35, justifyContent: 'center', alignItems: 'center' },

  dataBarsContainer: { width: 100, gap: 5, marginVertical: 10 },
  barTrack: { width: '100%', height: 3, backgroundColor: '#f0f0f0', borderRadius: 2, overflow: 'hidden' },
  barFill: { width: '100%', height: '100%', backgroundColor: COLORS.dot },

  statsRow: { flexDirection: 'row', gap: 12, marginTop: 5 },
  statItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  statDot: { width: 5, height: 5, borderRadius: 2.5 },
  statText: { fontSize: 10, fontWeight: '800', color: COLORS.textSub },

  listWrapper: { width: '100%', gap: 6, marginBottom: 20 },
  cardEtapa: { flexDirection: 'row', alignItems: 'center', padding: 12, backgroundColor: COLORS.bgCard, borderRadius: 15, borderWidth: 1, elevation: 1, shadowColor: '#000', shadowOpacity: 0.03, shadowRadius: 2 },
  checkSpace: { marginRight: 12 },
  dotOff: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#E0E0E0' },
  textoEtapa: { flex: 1, fontSize: 13, color: COLORS.textSub, fontWeight: '500' },
  textoEtapaActive: { color: COLORS.primary, fontWeight: '800' },

  progressoArea: { width: '100%', alignItems: 'center' },
  otimismo: { fontSize: 12, color: COLORS.textSub, fontStyle: 'italic', marginBottom: 10 },
  fullBar: { width: '100%', height: 6, backgroundColor: '#f0f0f0', borderRadius: 3, overflow: 'hidden', marginBottom: 6 },
  fillBar: { height: '100%', backgroundColor: COLORS.dot },
  percentText: { fontSize: 12, fontWeight: '800', color: COLORS.primary },
});