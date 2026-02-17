import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import {
    Animated,
    Dimensions,
    Easing,
    StyleSheet,
    Text,
    View,
} from 'react-native';

const { width } = Dimensions.get('window');

// Lista de etapas do cálculo
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
  const escalaBarra1 = useRef(new Animated.Value(0.3)).current;
  const escalaBarra2 = useRef(new Animated.Value(0.6)).current;
  const escalaBarra3 = useRef(new Animated.Value(0.9)).current;
  const opacidadeBarra1 = useRef(new Animated.Value(0.5)).current;
  const opacidadeBarra2 = useRef(new Animated.Value(0.7)).current;
  const opacidadeBarra3 = useRef(new Animated.Value(1)).current;

  // Animações individuais para cada texto
  const animacoesTexto = ETAPAS.map(() => ({
    opacity: useRef(new Animated.Value(0)).current,
    translateY: useRef(new Animated.Value(20)).current,
  }));

  useEffect(() => {
    // Animação de rotação do círculo
    Animated.loop(
      Animated.timing(rotacao, {
        toValue: 1,
        duration: 3000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();

    // Animação de pulsar do círculo
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulsar, {
          toValue: 1.2,
          duration: 1000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pulsar, {
          toValue: 1,
          duration: 1000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Animações das barras
    Animated.loop(
      Animated.sequence([
        Animated.parallel([
          Animated.timing(escalaBarra1, {
            toValue: 1,
            duration: 2000,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: false,
          }),
          Animated.timing(opacidadeBarra1, {
            toValue: 1,
            duration: 2000,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: false,
          }),
        ]),
        Animated.parallel([
          Animated.timing(escalaBarra1, {
            toValue: 0.3,
            duration: 2000,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: false,
          }),
          Animated.timing(opacidadeBarra1, {
            toValue: 0.5,
            duration: 2000,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: false,
          }),
        ]),
      ])
    ).start();

    Animated.loop(
      Animated.sequence([
        Animated.parallel([
          Animated.timing(escalaBarra2, {
            toValue: 1,
            duration: 2500,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: false,
          }),
          Animated.timing(opacidadeBarra2, {
            toValue: 1,
            duration: 2500,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: false,
          }),
        ]),
        Animated.parallel([
          Animated.timing(escalaBarra2, {
            toValue: 0.6,
            duration: 2500,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: false,
          }),
          Animated.timing(opacidadeBarra2, {
            toValue: 0.7,
            duration: 2500,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: false,
          }),
        ]),
      ])
    ).start();

    Animated.loop(
      Animated.sequence([
        Animated.parallel([
          Animated.timing(escalaBarra3, {
            toValue: 1,
            duration: 3000,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: false,
          }),
          Animated.timing(opacidadeBarra3, {
            toValue: 1,
            duration: 3000,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: false,
          }),
        ]),
        Animated.parallel([
          Animated.timing(escalaBarra3, {
            toValue: 0.9,
            duration: 3000,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: false,
          }),
          Animated.timing(opacidadeBarra3, {
            toValue: 0.7,
            duration: 3000,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: false,
          }),
        ]),
      ])
    ).start();

    // Iniciar sequência de textos
    iniciarSequenciaTextos();
  }, []);

  const iniciarSequenciaTextos = () => {
    let index = 0;
    
    const mostrarProximaEtapa = () => {
      if (index < ETAPAS.length) {
        // Mostrar texto atual com animação
        Animated.parallel([
          Animated.timing(animacoesTexto[index].opacity, {
            toValue: 1,
            duration: 600,
            easing: Easing.out(Easing.cubic),
            useNativeDriver: true,
          }),
          Animated.timing(animacoesTexto[index].translateY, {
            toValue: 0,
            duration: 600,
            easing: Easing.out(Easing.cubic),
            useNativeDriver: true,
          }),
        ]).start();

        setEtapaAtual(index);
        index++;

        // Programar próxima etapa
        if (index < ETAPAS.length) {
          setTimeout(mostrarProximaEtapa, 800);
        } else {
          // Quando todas as etapas forem mostradas, navegar para próxima tela
          setTimeout(() => {
            router.push('/FinalizacaoScreen');
          }, 1500);
        }
      }
    };

    // Iniciar primeira etapa
    setTimeout(mostrarProximaEtapa, 500);
  };

  // Interpolação para rotação
  const spin = rotacao.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={styles.background}>
      <View style={styles.container}>
        {/* Título principal */}
        <Text style={styles.titulo}>Preparando seus resultados</Text>
        <Text style={styles.subtitulo}>Estamos analisando suas medidas</Text>

        {/* Área de visualização animada */}
        <View style={styles.visualizacaoContainer}>
          {/* Círculo animado principal */}
          <View style={styles.circuloContainer}>
            <Animated.View
              style={[
                styles.circuloExterno,
                {
                  transform: [{ rotate: spin }],
                },
              ]}
            >
              <View style={styles.circuloExternoInner} />
            </Animated.View>

            <Animated.View
              style={[
                styles.circuloMedio,
                {
                  transform: [{ scale: pulsar }],
                },
              ]}
            >
              <View style={styles.circuloMedioInner} />
            </Animated.View>

            <View style={styles.circuloInterno}>
              <FontAwesome name="heartbeat" size={40} color="#1E88E5" />
            </View>
          </View>

          {/* Barras de progresso animadas */}
          <View style={styles.barrasContainer}>
            <View style={styles.barraWrapper}>
              <View style={styles.barraFundo}>
                <Animated.View
                  style={[
                    styles.barraProgresso,
                    {
                      width: escalaBarra1.interpolate({
                        inputRange: [0.3, 1],
                        outputRange: ['30%', '100%'],
                      }),
                      opacity: opacidadeBarra1,
                    },
                  ]}
                />
              </View>
            </View>

            <View style={styles.barraWrapper}>
              <View style={styles.barraFundo}>
                <Animated.View
                  style={[
                    styles.barraProgresso,
                    {
                      width: escalaBarra2.interpolate({
                        inputRange: [0.6, 1],
                        outputRange: ['60%', '100%'],
                      }),
                      opacity: opacidadeBarra2,
                    },
                  ]}
                />
              </View>
            </View>

            <View style={styles.barraWrapper}>
              <View style={styles.barraFundo}>
                <Animated.View
                  style={[
                    styles.barraProgresso,
                    {
                      width: escalaBarra3.interpolate({
                        inputRange: [0.9, 1],
                        outputRange: ['90%', '100%'],
                      }),
                      opacity: opacidadeBarra3,
                    },
                  ]}
                />
              </View>
            </View>
          </View>

          {/* Indicadores de progresso */}
          <View style={styles.indicadoresContainer}>
            <View style={styles.indicadorItem}>
              <View style={[styles.indicadorCirculo, styles.indicadorCirculo1]} />
              <Text style={styles.indicadorTexto}>IMC</Text>
            </View>
            <View style={styles.indicadorItem}>
              <View style={[styles.indicadorCirculo, styles.indicadorCirculo2]} />
              <Text style={styles.indicadorTexto}>TMB</Text>
            </View>
            <View style={styles.indicadorItem}>
              <View style={[styles.indicadorCirculo, styles.indicadorCirculo3]} />
              <Text style={styles.indicadorTexto}>TDEE</Text>
            </View>
            <View style={styles.indicadorItem}>
              <View style={[styles.indicadorCirculo, styles.indicadorCirculo4]} />
              <Text style={styles.indicadorTexto}>BF%</Text>
            </View>
          </View>
        </View>

        {/* Lista de etapas */}
        <View style={styles.etapasContainer}>
          {ETAPAS.map((texto, index) => (
            <Animated.View
              key={index}
              style={[
                styles.etapaItem,
                {
                  opacity: animacoesTexto[index].opacity,
                  transform: [
                    { translateY: animacoesTexto[index].translateY },
                  ],
                },
              ]}
            >
              <View style={styles.etapaBullet}>
                {index <= etapaAtual ? (
                  <View style={styles.bulletAtivo}>
                    {index < etapaAtual ? (
                      <FontAwesome name="check" size={10} color="#FFFFFF" />
                    ) : (
                      <View style={styles.bulletPulsante} />
                    )}
                  </View>
                ) : (
                  <View style={styles.bulletInativo} />
                )}
              </View>
              <Text
                style={[
                  styles.etapaTexto,
                  index <= etapaAtual && styles.etapaTextoAtivo,
                ]}
              >
                {texto}
              </Text>
              {index === etapaAtual && (
                <View style={styles.loadingDots}>
                  <View style={styles.dot} />
                  <View style={[styles.dot, styles.dotDelay1]} />
                  <View style={[styles.dot, styles.dotDelay2]} />
                </View>
              )}
            </Animated.View>
          ))}
        </View>

        {/* Indicador de progresso geral */}
        <View style={styles.progressoGeralContainer}>
          <View style={styles.progressoGeralFundo}>
            <Animated.View
              style={[
                styles.progressoGeralPreenchimento,
                {
                  width: animacoesTexto[ETAPAS.length - 1].opacity.interpolate({
                    inputRange: [0, 1],
                    outputRange: ['0%', '100%'],
                  }),
                },
              ]}
            />
          </View>
          <Text style={styles.progressoGeralTexto}>
            {Math.round(((etapaAtual + 1) / ETAPAS.length) * 100)}% concluído
          </Text>
        </View>

        {/* Mensagem de otimismo */}
        <Text style={styles.mensagemOtimista}>
          Quase lá! Estamos preparando tudo com carinho para você 💪
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  container: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  titulo: {
    fontSize: 24,
    fontWeight: '800',
    color: '#1A2C3E',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitulo: {
    fontSize: 16,
    color: '#6B7A8F',
    textAlign: 'center',
    marginBottom: 30,
  },
  visualizacaoContainer: {
    alignItems: 'center',
    marginBottom: 30,
    width: '100%',
  },
  circuloContainer: {
    width: 160,
    height: 160,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
  },
  circuloExterno: {
    position: 'absolute',
    width: 160,
    height: 160,
    borderRadius: 80,
    borderWidth: 3,
    borderColor: '#1E88E5',
    borderStyle: 'dashed',
  },
  circuloExternoInner: {
    width: '100%',
    height: '100%',
    borderRadius: 80,
  },
  circuloMedio: {
    position: 'absolute',
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(30, 136, 229, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  circuloMedioInner: {
    width: '100%',
    height: '100%',
    borderRadius: 60,
  },
  circuloInterno: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#1E88E5',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  barrasContainer: {
    width: width * 0.7,
    gap: 12,
    marginBottom: 20,
  },
  barraWrapper: {
    width: '100%',
    height: 8,
  },
  barraFundo: {
    width: '100%',
    height: '100%',
    backgroundColor: '#F0F4F8',
    borderRadius: 4,
    overflow: 'hidden',
  },
  barraProgresso: {
    height: '100%',
    backgroundColor: '#1E88E5',
    borderRadius: 4,
  },
  indicadoresContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: 10,
  },
  indicadorItem: {
    alignItems: 'center',
    gap: 6,
  },
  indicadorCirculo: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  indicadorCirculo1: {
    backgroundColor: '#1E88E5',
  },
  indicadorCirculo2: {
    backgroundColor: '#4CAF50',
  },
  indicadorCirculo3: {
    backgroundColor: '#FF9800',
  },
  indicadorCirculo4: {
    backgroundColor: '#E91E63',
  },
  indicadorTexto: {
    fontSize: 12,
    color: '#6B7A8F',
    fontWeight: '500',
  },
  etapasContainer: {
    width: '100%',
    maxWidth: 400,
    gap: 12,
    marginVertical: 30,
  },
  etapaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
    backgroundColor: '#F8FAFD',
    borderRadius: 12,
  },
  etapaBullet: {
    width: 24,
    height: 24,
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bulletAtivo: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#1E88E5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bulletPulsante: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FFFFFF',
  },
  bulletInativo: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#E0E0E0',
  },
  etapaTexto: {
    flex: 1,
    fontSize: 15,
    color: '#9AABC0',
  },
  etapaTextoAtivo: {
    color: '#1A2C3E',
    fontWeight: '600',
  },
  loadingDots: {
    flexDirection: 'row',
    marginLeft: 8,
    gap: 4,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#1E88E5',
    opacity: 0.5,
  },
  dotDelay1: {
    opacity: 0.8,
  },
  dotDelay2: {
    opacity: 1,
  },
  progressoGeralContainer: {
    width: '100%',
    maxWidth: 400,
    marginBottom: 20,
  },
  progressoGeralFundo: {
    width: '100%',
    height: 8,
    backgroundColor: '#F0F4F8',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressoGeralPreenchimento: {
    height: '100%',
    backgroundColor: '#4CAF50',
    borderRadius: 4,
  },
  progressoGeralTexto: {
    fontSize: 14,
    color: '#6B7A8F',
    textAlign: 'center',
    fontWeight: '600',
  },
  mensagemOtimista: {
    fontSize: 14,
    color: '#6B7A8F',
    textAlign: 'center',
    fontStyle: 'italic',
    marginTop: 10,
  },
});