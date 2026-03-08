import FontAwesome from '@expo/vector-icons/FontAwesome';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Animated,
  Dimensions,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
  StatusBar,
  Image,
} from 'react-native';

const { width } = Dimensions.get('window');

// ============ CONSTANTES ============
const COLORS = {
  primary: '#8B5CF6',
  secondary: '#EC4899',
  accent: '#10B981',
  dot: '#C4B5FD',
  line: 'rgba(139, 92, 246, 0.15)',
  textMain: '#1F2937',
  textLight: '#6B7280',
  textSub: '#9CA3AF',
  white: '#FFFFFF',
  background: '#F9FAFB',
  cardBg: 'rgba(255, 255, 255, 0.98)',
  success: '#10B981',
  warning: '#F59E0B',
  danger: '#EF4444',
  info: '#3B82F6',
  purple: '#8B5CF6',
  pink: '#EC4899',
};

const DEFAULT_VALUES = {
  idade: 32,
  alturaCm: 170,
  pesoKg: 70,
  pescocoCm: 42,
  cinturaCm: 109,
  frequenciaTreino: '3-4',
  sexo: 'masculino',
  objetivo: 'manter',
};

// ============ UTILS ============
const converterParaCm = (ft: number, inches: number): number =>
  (ft * 30.48) + (inches * 2.54);

const getClassificacaoIMC = (imc: number) => {
  if (imc < 18.5) return { classificacao: 'Baixo Peso', cor: '#3B82F6', descricao: 'Abaixo do peso ideal', emoji: '⚡' };
  if (imc < 25) return { classificacao: 'Peso Saudável', cor: '#10B981', descricao: 'Peso ideal', emoji: '💚' };
  if (imc < 30) return { classificacao: 'Sobrepeso', cor: '#F59E0B', descricao: 'Acima do peso ideal', emoji: '⚠️' };
  if (imc < 35) return { classificacao: 'Obesidade I', cor: '#EF4444', descricao: 'Obesidade moderada', emoji: '🔴' };
  return { classificacao: 'Obesidade II+', cor: '#DC2626', descricao: 'Obesidade severa', emoji: '⛔' };
};

const getClassificacaoBF = (bf: number, isMale: boolean) => {
  const ranges = isMale
    ? [6, 14, 18, 25]
    : [14, 21, 25, 32];

  const labels = ['Essencial', 'Atleta', 'Fitness', 'Aceitável', 'Elevado'];
  const colors = ['#3B82F6', '#10B981', '#8B5CF6', '#F59E0B', '#EF4444'];
  const descricoes = ['Muito baixo', 'Excelente', 'Bom', 'Médio', 'Alto'];
  const emojis = ['💪', '🏆', '👍', '👌', '⚠️'];

  const index = ranges.findIndex(range => bf < range);
  const finalIndex = index === -1 ? 4 : index;

  return {
    classificacao: labels[finalIndex],
    cor: colors[finalIndex],
    descricao: descricoes[finalIndex],
    emoji: emojis[finalIndex],
  };
};

const getNivelAtividadeDescricao = (nivel: number): string => {
  if (nivel <= 1.2) return 'Sedentário';
  if (nivel <= 1.375) return 'Levemente ativo';
  if (nivel <= 1.55) return 'Moderadamente ativo';
  if (nivel <= 1.725) return 'Muito ativo';
  return 'Extremamente ativo';
};

// ============ COMPONENTES ============
const IMCMeter = ({ imc, classificacao }: any) => {
  const getIMCPosition = () => {
    if (imc < 18.5) return (imc / 18.5) * 25;
    if (imc < 25) return 25 + ((imc - 18.5) / 6.5) * 25;
    if (imc < 30) return 50 + ((imc - 25) / 5) * 25;
    if (imc < 40) return 75 + Math.min(((imc - 30) / 10) * 25, 25);
    return 100;
  };

  return (
    <View style={styles.imcMeterContainer}>
      <View style={styles.imcMeterScale}>
        <LinearGradient
          colors={['#3B82F6', '#10B981', '#F59E0B', '#EF4444']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.imcMeterGradient}
        />
        <View style={[styles.imcMeterMarker, { left: `${getIMCPosition()}%` }]}>
          <View style={[styles.imcMeterDot, { backgroundColor: classificacao.cor }]} />
          <View style={[styles.imcMeterLine, { backgroundColor: classificacao.cor }]} />
        </View>
      </View>
      <View style={styles.imcMeterLabels}>
        <Text style={styles.imcMeterLabel}>Abaixo</Text>
        <Text style={styles.imcMeterLabel}>Ideal</Text>
        <Text style={styles.imcMeterLabel}>Sobrepeso</Text>
        <Text style={styles.imcMeterLabel}>Obesidade</Text>
      </View>
    </View>
  );
};

const ProgressCircle = ({ value, max, color, label, sublabel }: any) => {
  const percentage = (value / max) * 100;
  const circumference = 2 * Math.PI * 45;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <View style={styles.progressCircleContainer}>
      <View style={styles.progressCircleWrapper}>
        <View style={styles.progressCircleSvg}>
          <View style={[styles.progressCircleBg, { borderColor: `${color}30` }]} />
          <View style={[styles.progressCircleFill, {
            borderColor: color,
            transform: [{ rotate: `${-90 + (percentage * 3.6)}deg` }]
          }]} />
        </View>
        <View style={styles.progressCircleInner}>
          <Text style={[styles.progressCircleValue, { color }]}>{value.toFixed(1)}%</Text>
          <Text style={styles.progressCircleLabel}>{label}</Text>
          {sublabel && <Text style={styles.progressCircleSublabel}>{sublabel}</Text>}
        </View>
      </View>
    </View>
  );
};

// ============ HOOKS ============
const useAnimations = () => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.95)).current;
  const rotacao = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 8,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();

    Animated.loop(
      Animated.timing(rotacao, {
        toValue: 1,
        duration: 20000,
        useNativeDriver: true,
      })
    ).start();
  }, []);

  return { fadeAnim, scaleAnim, rotacao };
};

// ============ TELA PRINCIPAL ============
export default function AnaliseScreen() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [metricas, setMetricas] = useState<any>(null);
  const { fadeAnim, scaleAnim, rotacao } = useAnimations();

  useEffect(() => {
    carregarDados();
  }, []);

  const carregarDados = async () => {
    setIsLoading(true);
    try {
      const dados = await carregarDadosDoStorage();
      const resultados = calcularMetricas(dados);
      setMetricas(resultados);

      await AsyncStorage.multiSet([
        ['@metricasCompletas', JSON.stringify(resultados)],
        ['@userDataCompleto', JSON.stringify(dados)]
      ]);

      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível carregar seus dados.');
    } finally {
      setIsLoading(false);
    }
  };

  const carregarDadosDoStorage = async () => {
    const keys = [
      '@objetivo', '@objetivoCompleto', '@sexo', '@idade', '@faixaIdade',
      '@alturaUnidade', '@altura', '@alturaFt', '@alturaIn', '@alturaEmCm',
      '@pesoUnidade', '@pesoKg', '@pesoLb', '@pesoEmKg',
      '@frequenciaTreino', '@nivelAtividade', '@frequenciaTreinoDescricao',
      '@frequenciaCardio',
      '@frequenciaCardioDescricao', '@pescocoCm', '@cinturaCm', '@quadrilCm',
      '@treinaAtualmente'
    ];

    const values = await AsyncStorage.multiGet(keys);
    const data: any = {};
    values.forEach(([key, value]) => {
      data[key] = value;
    });

    let objetivoCompletoObj = null;
    try {
      objetivoCompletoObj = data['@objetivoCompleto'] ? JSON.parse(data['@objetivoCompleto']) : null;
    } catch (e) { }

    let alturaFinalCm = DEFAULT_VALUES.alturaCm;
    if (data['@alturaEmCm']) {
      alturaFinalCm = parseFloat(data['@alturaEmCm']);
    } else if (data['@alturaUnidade'] === 'cm' && data['@altura']) {
      alturaFinalCm = parseFloat(data['@altura']);
    } else if (data['@alturaFt']) {
      alturaFinalCm = converterParaCm(
        parseFloat(data['@alturaFt']),
        parseFloat(data['@alturaIn'] || '0')
      );
    }

    let pesoFinalKg = DEFAULT_VALUES.pesoKg;
    if (data['@pesoEmKg']) {
      pesoFinalKg = parseFloat(data['@pesoEmKg']);
    } else if (data['@pesoUnidade'] === 'kg' && data['@pesoKg']) {
      pesoFinalKg = parseFloat(data['@pesoKg']);
    }

    return {
      objetivo: data['@objetivo'] || DEFAULT_VALUES.objetivo,
      objetivoCompleto: objetivoCompletoObj,
      sexo: data['@sexo'] || DEFAULT_VALUES.sexo,
      idade: parseInt(data['@idade']) || DEFAULT_VALUES.idade,
      alturaCm: alturaFinalCm,
      pesoEmKg: pesoFinalKg,
      pescocoCm: parseFloat(data['@pescocoCm']) || DEFAULT_VALUES.pescocoCm,
      cinturaCm: parseFloat(data['@cinturaCm']) || DEFAULT_VALUES.cinturaCm,
      quadrilCm: data['@quadrilCm'] ? parseFloat(data['@quadrilCm']) : null,
      frequenciaTreino: data['@frequenciaTreino'] || DEFAULT_VALUES.frequenciaTreino,
      nivelAtividade: data['@nivelAtividade'] ? parseFloat(data['@nivelAtividade']) : null,
    };
  };

  const calcularMetricas = (dados: any) => {
    const {
      objetivo, sexo, idade, alturaCm, pesoEmKg, pescocoCm,
      cinturaCm, quadrilCm, frequenciaTreino, nivelAtividade
    } = dados;

    const alturaMetros = alturaCm / 100;
    const imc = pesoEmKg / (alturaMetros * alturaMetros);

    const pesoIdealMin = 18.5 * (alturaMetros * alturaMetros);
    const pesoIdealMax = 24.9 * (alturaMetros * alturaMetros);

    const calcularBF = () => {
      const alturaInches = alturaCm * 0.393701;
      const pescocoInches = pescocoCm * 0.393701;
      const cinturaInches = cinturaCm * 0.393701;

      if (sexo === 'masculino') {
        return 86.010 * Math.log10(cinturaInches - pescocoInches) - 70.041 * Math.log10(alturaInches) + 36.76;
      } else if (quadrilCm) {
        const quadrilInches = quadrilCm * 0.393701;
        return 163.205 * Math.log10(cinturaInches + quadrilInches - pescocoInches) - 97.684 * Math.log10(alturaInches) - 78.387;
      }
      return (1.20 * imc) + (0.23 * idade) - (10.8 * (sexo === 'feminino' ? 1 : 0)) - 5.4;
    };

    const percentualGordura = Math.min(Math.max(calcularBF(), sexo === 'masculino' ? 3 : 8), 50);
    const massaGordaKg = (percentualGordura / 100) * pesoEmKg;
    const massaMagraKg = pesoEmKg - massaGordaKg;

    const tmb = sexo === 'feminino'
      ? (10 * pesoEmKg) + (6.25 * alturaCm) - (5 * idade) - 161
      : (10 * pesoEmKg) + (6.25 * alturaCm) - (5 * idade) + 5;

    const fatoresAtividade: any = { '0': 1.2, '1-2': 1.375, '3-4': 1.55, '5-6': 1.725 };
    const fatorAtividade = nivelAtividade || fatoresAtividade[frequenciaTreino] || 1.2;
    const tdee = tmb * fatorAtividade;

    const getCalorias = () => {
      const fatores: any = { emagrecer: 0.85, ganhar_massa: 1.15, ganho: 1.15 };
      const fator = fatores[objetivo] || 1;
      return {
        manutencao: tdee,
        objetivo: tdee * fator,
        meta: objetivo === 'emagrecer' ? 'Déficit Calórico' : objetivo.includes('ganhar') ? 'Superávit Calórico' : 'Manutenção',
        cor: objetivo === 'emagrecer' ? COLORS.danger : objetivo.includes('ganhar') ? COLORS.success : COLORS.textLight,
      };
    };

    const getProteina = () => {
      const fatores: any = {
        emagrecer: [1.6, 2.0, 'Preservação'],
        ganhar_massa: [1.8, 2.2, 'Hipertrofia'],
        ganho: [1.8, 2.2, 'Hipertrofia'],
      };
      const [min, max, desc] = fatores[objetivo] || [1.2, 1.6, 'Proteína'];
      return {
        min: pesoEmKg * min,
        max: pesoEmKg * max,
        descricao: desc,
        gPorKg: `${min}-${max}g/kg`,
        icon: 'rocket',
        cor: objetivo === 'emagrecer' ? COLORS.warning : objetivo.includes('ganhar') ? COLORS.success : COLORS.info,
      };
    };

    return {
      imc,
      imcFormatado: imc.toFixed(1),
      classificacaoIMC: getClassificacaoIMC(imc),
      pesoIdealMin,
      pesoIdealMax,
      percentualGordura,
      percentualGorduraFormatado: percentualGordura.toFixed(1),
      classificacaoBF: getClassificacaoBF(percentualGordura, sexo === 'masculino'),
      massaGordaKg,
      massaMagraKg,
      tmb,
      tmbFormatado: tmb.toFixed(0),
      tdee,
      tdeeFormatado: tdee.toFixed(0),
      nivelAtividadeDescricao: getNivelAtividadeDescricao(fatorAtividade),
      calorias: getCalorias(),
      proteina: getProteina(),
      carboidratos: {
        min: pesoEmKg * 3,
        max: pesoEmKg * 5,
        descricao: 'Carboidrato',
        gPorKg: '3-5g/kg',
        icon: 'flash',
        cor: COLORS.warning
      },
      gorduras: {
        min: pesoEmKg * 0.8,
        max: pesoEmKg * 1.2,
        descricao: 'Gordura',
        gPorKg: '0.8-1.2g/kg',
        icon: 'tint',
        cor: COLORS.info
      },
      pesoAtual: pesoEmKg,
      sexo,
      alturaCm,
    };
  };

  const handleComecar = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    await AsyncStorage.setItem('@onboardingCompleto', 'true');
    router.replace('/CadastroScreen');
  };

  const handleEditar = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push('/ObjetivoScreen');
  };

  if (isLoading) {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
        <View style={styles.loadingContainer}>
          <Animated.View style={[styles.radarCircle, {
            transform: [{
              rotate: rotacao.interpolate({
                inputRange: [0, 1],
                outputRange: ['0deg', '360deg']
              })
            }]
          }]} />
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.loadingTitle}>Preparando análise...</Text>
          <Text style={styles.loadingSubtitle}>Calculando suas métricas</Text>
        </View>
      </View>
    );
  }

  if (!metricas) return null;

  const spin = rotacao.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />

      {/* Fundo decorativo */}
      <LinearGradient
        colors={['#F9FAFB', '#F3F4F6']}
        style={StyleSheet.absoluteFill}
      />
      <View style={styles.backgroundOrbits}>
        <Animated.View style={[styles.orbitLine, { width: width * 1.3, height: width * 1.3, top: -width * 0.3, right: -width * 0.3, transform: [{ rotate: spin }] }]} />
        <Animated.View style={[styles.orbitLine, { width: width * 1.6, height: width * 1.6, bottom: -width * 0.5, left: -width * 0.5, transform: [{ rotate: spin }] }]} />
        <View style={[styles.orbitDot, { top: '15%', right: '10%' }]} />
        <View style={[styles.orbitDot, { bottom: '20%', left: '5%' }]} />
        <View style={[styles.orbitDot, { top: '30%', left: '15%' }]} />
      </View>

      <SafeAreaView style={styles.headerSafeArea}>
        <View style={styles.headerContent}>
          <Pressable onPress={handleEditar} style={styles.backButton}>
            <View style={styles.backIconCircle}>
              <FontAwesome name="chevron-left" size={12} color={COLORS.primary} />
            </View>
            <Text style={styles.backText}>Editar</Text>
          </Pressable>
        </View>
      </SafeAreaView>

      <Animated.ScrollView
        style={[styles.scrollView, { opacity: fadeAnim }]}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >

        {/* Hero Section */}
        <Animated.View style={[styles.heroSection, { transform: [{ scale: scaleAnim }] }]}>
          <LinearGradient
            colors={[COLORS.primary, COLORS.secondary]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.heroGradient}
          >
            <Image
              source={require('../../assets/images/logo-sem-fundo1.png')}
              style={styles.heroLogo}
              resizeMode="contain"
            />
            <Text style={styles.heroTitle}>Análise Completa</Text>
            <View style={styles.heroBadge}>
              <FontAwesome name="check-circle" size={16} color="#FFF" />
              <Text style={styles.heroBadgeText}>Seu panorama atual</Text>
            </View>
          </LinearGradient>
        </Animated.View>

        {/* Card IMC com medidor */}
        <LinearGradient
          colors={['#FFFFFF', '#F9FAFB']}
          style={styles.imcCard}
        >
          <View style={styles.imcHeader}>
            <View style={styles.imcTitleContainer}>
              <FontAwesome name="balance-scale" size={20} color={COLORS.primary} />
              <Text style={styles.imcTitle}>Índice de Massa Corporal</Text>
            </View>
            <View style={[styles.imcBadge, { backgroundColor: `${metricas.classificacaoIMC.cor}15` }]}>
              <Text style={[styles.imcBadgeText, { color: metricas.classificacaoIMC.cor }]}>
                {metricas.classificacaoIMC.emoji} {metricas.classificacaoIMC.classificacao}
              </Text>
            </View>
          </View>

          <View style={styles.imcValueContainer}>
            <Text style={styles.imcValue}>{metricas.imcFormatado}</Text>
            <Text style={styles.imcUnit}>kg/m²</Text>
          </View>

          <Text style={[styles.imcDescription, { color: metricas.classificacaoIMC.cor }]}>
            {metricas.classificacaoIMC.descricao}
          </Text>

          <IMCMeter imc={metricas.imc} classificacao={metricas.classificacaoIMC} />

          <View style={styles.imcInfoGrid}>
            <View style={styles.imcInfoItem}>
              <Text style={styles.imcInfoLabel}>Mínimo ideal</Text>
              <Text style={styles.imcInfoValue}>18.5</Text>
            </View>
            <View style={styles.imcInfoItem}>
              <Text style={styles.imcInfoLabel}>Máximo ideal</Text>
              <Text style={styles.imcInfoValue}>24.9</Text>
            </View>
            <View style={styles.imcInfoItem}>
              <Text style={styles.imcInfoLabel}>Sua altura</Text>
              <Text style={styles.imcInfoValue}>{(metricas.alturaCm / 100).toFixed(2)}m</Text>
            </View>
          </View>
        </LinearGradient>

        {/* Peso Ideal */}
        <LinearGradient
          colors={['#FFFFFF', '#F9FAFB']}
          style={styles.pesoCard}
        >
          <View style={styles.pesoHeader}>
            <FontAwesome name="balance-scale" size={20} color={COLORS.primary} />
            <Text style={styles.pesoTitle}>Peso Ideal</Text>
          </View>

          <View style={styles.pesoAtualContainer}>
            <Text style={styles.pesoAtualValue}>{metricas.pesoAtual.toFixed(1)} kg</Text>
            <View style={[styles.pesoStatusBadge, {
              backgroundColor: metricas.pesoAtual > metricas.pesoIdealMax ? `${COLORS.danger}15` :
                metricas.pesoAtual < metricas.pesoIdealMin ? `${COLORS.info}15` :
                  `${COLORS.success}15`
            }]}>
              <FontAwesome
                name={metricas.pesoAtual > metricas.pesoIdealMax ? 'arrow-up' :
                  metricas.pesoAtual < metricas.pesoIdealMin ? 'arrow-down' : 'check'}
                size={12}
                color={metricas.pesoAtual > metricas.pesoIdealMax ? COLORS.danger :
                  metricas.pesoAtual < metricas.pesoIdealMin ? COLORS.info :
                    COLORS.success}
              />
              <Text style={[styles.pesoStatusText, {
                color: metricas.pesoAtual > metricas.pesoIdealMax ? COLORS.danger :
                  metricas.pesoAtual < metricas.pesoIdealMin ? COLORS.info :
                    COLORS.success
              }]}>
                {metricas.pesoAtual > metricas.pesoIdealMax ? `${(metricas.pesoAtual - metricas.pesoIdealMax).toFixed(1)}kg acima` :
                  metricas.pesoAtual < metricas.pesoIdealMin ? `${(metricas.pesoIdealMin - metricas.pesoAtual).toFixed(1)}kg abaixo` :
                    'Peso ideal'}
              </Text>
            </View>
          </View>

          <View style={styles.pesoRangeContainer}>
            <View style={styles.pesoRangeBar}>
              <View style={[styles.pesoRangeFill, {
                left: `${(metricas.pesoIdealMin / metricas.pesoIdealMax) * 50}%`,
                right: `${100 - (metricas.pesoIdealMax / (metricas.pesoIdealMax * 1.3)) * 100}%`,
              }]} />
              <View style={[styles.pesoCurrentMarker, {
                left: `${(metricas.pesoAtual / (metricas.pesoIdealMax * 1.3)) * 100}%`,
              }]}>
                <View style={styles.pesoCurrentDot} />
              </View>
            </View>
            <View style={styles.pesoRangeLabels}>
              <Text style={styles.pesoRangeLabel}>{metricas.pesoIdealMin.toFixed(0)}kg</Text>
              <Text style={styles.pesoRangeLabel}>{((metricas.pesoIdealMin + metricas.pesoIdealMax) / 2).toFixed(0)}kg</Text>
              <Text style={styles.pesoRangeLabel}>{metricas.pesoIdealMax.toFixed(0)}kg</Text>
            </View>
          </View>

          <View style={styles.pesoGrid}>
            <View style={styles.pesoGridItem}>
              <Text style={styles.pesoGridLabel}>Mínimo</Text>
              <Text style={styles.pesoGridValue}>{metricas.pesoIdealMin.toFixed(1)}</Text>
              <Text style={styles.pesoGridUnit}>kg</Text>
            </View>
            <View style={[styles.pesoGridItem, styles.pesoGridItemHighlight]}>
              <Text style={styles.pesoGridLabel}>Ideal</Text>
              <Text style={styles.pesoGridValueHighlight}>
                {((metricas.pesoIdealMin + metricas.pesoIdealMax) / 2).toFixed(1)}
              </Text>
              <Text style={styles.pesoGridUnit}>kg</Text>
            </View>
            <View style={styles.pesoGridItem}>
              <Text style={styles.pesoGridLabel}>Máximo</Text>
              <Text style={styles.pesoGridValue}>{metricas.pesoIdealMax.toFixed(1)}</Text>
              <Text style={styles.pesoGridUnit}>kg</Text>
            </View>
          </View>
        </LinearGradient>

        {/* Composição Corporal */}
        <LinearGradient
          colors={['#FFFFFF', '#F9FAFB']}
          style={styles.composicaoCard}
        >
          <View style={styles.composicaoHeader}>
            <FontAwesome name="heart" size={20} color={COLORS.purple} />
            <Text style={styles.composicaoTitle}>Composição Corporal</Text>
          </View>

          <View style={styles.composicaoContent}>
            <ProgressCircle
              value={metricas.percentualGordura}
              max={metricas.sexo === 'masculino' ? 35 : 45}
              color={metricas.classificacaoBF.cor}
              label="BF"
              sublabel={metricas.classificacaoBF.classificacao}
            />

            <View style={styles.composicaoStats}>
              <View style={styles.composicaoStatItem}>
                <View style={[styles.composicaoStatDot, { backgroundColor: COLORS.info }]} />
                <View style={styles.composicaoStatContent}>
                  <Text style={styles.composicaoStatLabel}>Massa Magra</Text>
                  <Text style={styles.composicaoStatValue}>{metricas.massaMagraKg.toFixed(1)} kg</Text>
                  <View style={styles.composicaoStatBar}>
                    <View style={[styles.composicaoStatBarFill, {
                      width: `${(metricas.massaMagraKg / metricas.pesoAtual) * 100}%`,
                      backgroundColor: COLORS.info
                    }]} />
                  </View>
                </View>
              </View>

              <View style={styles.composicaoStatItem}>
                <View style={[styles.composicaoStatDot, { backgroundColor: COLORS.warning }]} />
                <View style={styles.composicaoStatContent}>
                  <Text style={styles.composicaoStatLabel}>Massa Gorda</Text>
                  <Text style={styles.composicaoStatValue}>{metricas.massaGordaKg.toFixed(1)} kg</Text>
                  <View style={styles.composicaoStatBar}>
                    <View style={[styles.composicaoStatBarFill, {
                      width: `${(metricas.massaGordaKg / metricas.pesoAtual) * 100}%`,
                      backgroundColor: COLORS.warning
                    }]} />
                  </View>
                </View>
              </View>
            </View>
          </View>
        </LinearGradient>

        {/* Metabolismo */}
        <LinearGradient
          colors={['#FFFFFF', '#F9FAFB']}
          style={styles.metabolismoCard}
        >
          <View style={styles.metabolismoHeader}>
            <FontAwesome name="flash" size={20} color={COLORS.accent} />
            <Text style={styles.metabolismoTitle}>Metabolismo</Text>
          </View>

          <View style={styles.metabolismoGrid}>
            <View style={styles.metabolismoGridItem}>
              <View style={[styles.metabolismoIcon, { backgroundColor: `${COLORS.purple}15` }]}>
                <FontAwesome name="moon-o" size={20} color={COLORS.purple} />
              </View>
              <Text style={styles.metabolismoLabel}>TMB</Text>
              <Text style={styles.metabolismoValue}>{metricas.tmbFormatado}</Text>
              <Text style={styles.metabolismoUnit}>kcal/dia</Text>
              <Text style={styles.metabolismoDesc}>Repouso</Text>
            </View>

            <View style={styles.metabolismoGridItem}>
              <View style={[styles.metabolismoIcon, { backgroundColor: `${COLORS.pink}15` }]}>
                <FontAwesome name="bicycle" size={20} color={COLORS.pink} />
              </View>
              <Text style={styles.metabolismoLabel}>TDEE</Text>
              <Text style={styles.metabolismoValue}>{metricas.tdeeFormatado}</Text>
              <Text style={styles.metabolismoUnit}>kcal/dia</Text>
              <Text style={styles.metabolismoDesc}>{metricas.nivelAtividadeDescricao}</Text>
            </View>
          </View>

          <LinearGradient
            colors={[`${metricas.calorias.cor}10`, `${metricas.calorias.cor}05`]}
            style={styles.caloriasCard}
          >
            <Text style={styles.caloriasMeta}>{metricas.calorias.meta}</Text>
            <Text style={[styles.caloriasValue, { color: metricas.calorias.cor }]}>
              {metricas.calorias.objetivo.toFixed(0)}
            </Text>
            <Text style={styles.caloriasUnit}>kcal/dia</Text>
            <View style={styles.caloriasComparison}>
              <Text style={styles.caloriasCompareLabel}>Manutenção:</Text>
              <Text style={styles.caloriasCompareValue}>{metricas.calorias.manutencao.toFixed(0)} kcal</Text>
            </View>
          </LinearGradient>
        </LinearGradient>

        {/* Mensagem Motivacional */}
        <LinearGradient
          colors={[COLORS.primary, COLORS.secondary]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.motivationalCard}
        >
          <FontAwesome name="quote-left" size={24} color="rgba(255,255,255,0.3)" />
          <Text style={styles.motivationalText}>
            "O sucesso é a soma de pequenos esforços repetidos dia após dia."
          </Text>
          <Text style={styles.motivationalAuthor}>- Robert Collier</Text>
        </LinearGradient>

        <View style={styles.bottomSpacing} />
      </Animated.ScrollView>

      {/* Botão Flutuante */}
      <SafeAreaView style={styles.floatingButtonContainer}>
        <Pressable style={styles.floatingButton} onPress={handleComecar}>
          <LinearGradient
            colors={[COLORS.secondary, COLORS.primary]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.floatingGradient}
          >
            <FontAwesome name="rocket" size={20} color="#FFF" />
            <Text style={styles.floatingText}>Começar Jornada</Text>
          </LinearGradient>
        </Pressable>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB'
  },

  backgroundOrbits: {
    ...StyleSheet.absoluteFillObject,
    overflow: 'hidden',
    zIndex: 0
  },

  orbitLine: {
    position: 'absolute',
    borderWidth: 1.5,
    borderColor: COLORS.line,
    borderRadius: 999
  },

  orbitDot: {
    position: 'absolute',
    width: 8,
    height: 8,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: COLORS.dot,
    backgroundColor: '#FFFFFF'
  },

  headerSafeArea: {
    zIndex: 100,
    backgroundColor: 'transparent'
  },

  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 50 : StatusBar.currentHeight ? StatusBar.currentHeight + 10 : 40,
    paddingBottom: 15
  },

  backButton: {
    flexDirection: 'row',
    alignItems: 'center'
  },

  backIconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.line,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4
  },

  backText: {
    color: COLORS.primary,
    marginLeft: 10,
    fontWeight: '700',
    fontSize: 16
  },

  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 20
  },

  radarCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 1.5,
    borderColor: COLORS.dot,
    borderStyle: 'dashed',
    opacity: 0.4,
    position: 'absolute'
  },

  loadingTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.textMain,
    marginTop: 20
  },

  loadingSubtitle: {
    fontSize: 14,
    color: COLORS.textLight,
  },

  scrollView: {
    flex: 1,
    zIndex: 10
  },

  scrollContent: {
    paddingBottom: 100,
    paddingHorizontal: 16
  },

  heroSection: {
    marginBottom: 16,
    marginTop: 8,
    borderRadius: 24,
    overflow: 'hidden',
    elevation: 5,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },

  heroGradient: {
    padding: 24,
    alignItems: 'center',
  },

  heroLogo: {
    width: 150,
    height: 80,
    marginBottom: 12,
    tintColor: '#FFFFFF'
  },

  heroTitle: {
    fontSize: 24,
    fontWeight: '900',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 12,
    letterSpacing: 1
  },

  heroBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 30,
    gap: 8,
  },

  heroBadgeText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF'
  },

  // IMC Card
  imcCard: {
    borderRadius: 24,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: COLORS.line,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
  },

  imcHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },

  imcTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },

  imcTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.textMain,
  },

  imcBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },

  imcBadgeText: {
    fontSize: 12,
    fontWeight: '600',
  },

  imcValueContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'center',
    marginBottom: 4,
  },

  imcValue: {
    fontSize: 48,
    fontWeight: '900',
    color: COLORS.textMain,
  },

  imcUnit: {
    fontSize: 16,
    color: COLORS.textLight,
    marginLeft: 8,
  },

  imcDescription: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 20,
  },

  imcMeterContainer: {
    marginBottom: 20,
  },

  imcMeterScale: {
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
    position: 'relative',
  },

  imcMeterGradient: {
    flex: 1,
    width: '100%',
  },

  imcMeterMarker: {
    position: 'absolute',
    top: -4,
    alignItems: 'center',
  },

  imcMeterDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 3,
    borderColor: '#FFFFFF',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },

  imcMeterLine: {
    width: 2,
    height: 20,
    marginTop: 2,
  },

  imcMeterLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 4,
  },

  imcMeterLabel: {
    fontSize: 10,
    color: COLORS.textLight,
  },

  imcInfoGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: COLORS.line,
  },

  imcInfoItem: {
    alignItems: 'center',
  },

  imcInfoLabel: {
    fontSize: 12,
    color: COLORS.textLight,
    marginBottom: 4,
  },

  imcInfoValue: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.textMain,
  },

  // Peso Card
  pesoCard: {
    borderRadius: 24,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: COLORS.line,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
  },

  pesoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },

  pesoTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.textMain,
  },

  pesoAtualContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },

  pesoAtualValue: {
    fontSize: 36,
    fontWeight: '800',
    color: COLORS.textMain,
    marginBottom: 8,
  },

  pesoStatusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 6,
  },

  pesoStatusText: {
    fontSize: 13,
    fontWeight: '600',
  },

  pesoRangeContainer: {
    marginBottom: 20,
  },

  pesoRangeBar: {
    height: 8,
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
    position: 'relative',
    marginBottom: 8,
  },

  pesoRangeFill: {
    position: 'absolute',
    height: '100%',
    backgroundColor: `${COLORS.success}30`,
    borderRadius: 4,
  },

  pesoCurrentMarker: {
    position: 'absolute',
    top: -6,
    alignItems: 'center',
  },

  pesoCurrentDot: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: COLORS.primary,
    borderWidth: 3,
    borderColor: '#FFFFFF',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },

  pesoRangeLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 4,
  },

  pesoRangeLabel: {
    fontSize: 11,
    color: COLORS.textLight,
  },

  pesoGrid: {
    flexDirection: 'row',
    gap: 8,
  },

  pesoGridItem: {
    flex: 1,
    padding: 12,
    borderRadius: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.line,
  },

  pesoGridItemHighlight: {
    borderWidth: 2,
    borderColor: COLORS.success,
    backgroundColor: `${COLORS.success}05`,
  },

  pesoGridLabel: {
    fontSize: 12,
    color: COLORS.textLight,
    marginBottom: 4,
  },

  pesoGridValue: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.textMain,
  },

  pesoGridValueHighlight: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.success,
  },

  pesoGridUnit: {
    fontSize: 11,
    color: COLORS.textLight,
  },

  // Composição Card
  composicaoCard: {
    borderRadius: 24,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: COLORS.line,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
  },

  composicaoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 20,
  },

  composicaoTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.textMain,
  },

  composicaoContent: {
    flexDirection: 'row',
    gap: 20,
  },

  progressCircleContainer: {
    width: 120,
    alignItems: 'center',
  },

  progressCircleWrapper: {
    width: 120,
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },

  progressCircleSvg: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },

  progressCircleBg: {
    position: 'absolute',
    width: 90,
    height: 90,
    borderRadius: 45,
    borderWidth: 8,
    borderColor: '#E5E7EB',
    top: 15,
    left: 15,
  },

  progressCircleFill: {
    position: 'absolute',
    width: 90,
    height: 90,
    borderRadius: 45,
    borderWidth: 8,
    borderLeftColor: 'transparent',
    borderBottomColor: 'transparent',
    borderRightColor: 'transparent',
    top: 15,
    left: 15,
  },

  progressCircleInner: {
    alignItems: 'center',
  },

  progressCircleValue: {
    fontSize: 20,
    fontWeight: '800',
  },

  progressCircleLabel: {
    fontSize: 11,
    color: COLORS.textLight,
    marginTop: 2,
  },

  progressCircleSublabel: {
    fontSize: 9,
    color: COLORS.textSub,
  },

  composicaoStats: {
    flex: 1,
    gap: 16,
    justifyContent: 'center',
  },

  composicaoStatItem: {
    flexDirection: 'row',
    gap: 8,
  },

  composicaoStatDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginTop: 4,
  },

  composicaoStatContent: {
    flex: 1,
  },

  composicaoStatLabel: {
    fontSize: 12,
    color: COLORS.textLight,
    marginBottom: 2,
  },

  composicaoStatValue: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textMain,
    marginBottom: 4,
  },

  composicaoStatBar: {
    height: 4,
    backgroundColor: '#E5E7EB',
    borderRadius: 2,
    overflow: 'hidden',
  },

  composicaoStatBarFill: {
    height: '100%',
    borderRadius: 2,
  },

  // Metabolismo Card
  metabolismoCard: {
    borderRadius: 24,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: COLORS.line,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
  },

  metabolismoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 20,
  },

  metabolismoTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.textMain,
  },

  metabolismoGrid: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },

  metabolismoGridItem: {
    flex: 1,
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.line,
  },

  metabolismoIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },

  metabolismoLabel: {
    fontSize: 13,
    color: COLORS.textLight,
    fontWeight: '600',
    marginBottom: 4,
  },

  metabolismoValue: {
    fontSize: 24,
    fontWeight: '800',
    color: COLORS.textMain,
  },

  metabolismoUnit: {
    fontSize: 11,
    color: COLORS.textLight,
    marginBottom: 4,
  },

  metabolismoDesc: {
    fontSize: 11,
    color: COLORS.textSub,
  },

  caloriasCard: {
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.line,
  },

  caloriasMeta: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textLight,
    marginBottom: 8,
  },

  caloriasValue: {
    fontSize: 36,
    fontWeight: '800',
    marginBottom: 4,
  },

  caloriasUnit: {
    fontSize: 13,
    color: COLORS.textLight,
    marginBottom: 12,
  },

  caloriasComparison: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: COLORS.line,
  },

  caloriasCompareLabel: {
    fontSize: 13,
    color: COLORS.textLight,
  },

  caloriasCompareValue: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textMain,
  },

  // Motivacional
  motivationalCard: {
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 16,
    elevation: 5,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },

  motivationalText: {
    fontSize: 16,
    color: '#FFFFFF',
    fontStyle: 'italic',
    textAlign: 'center',
    lineHeight: 24,
    marginVertical: 16,
  },

  motivationalAuthor: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    fontWeight: '500',
  },

  bottomSpacing: {
    height: 20
  },

  floatingButtonContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    paddingBottom: Platform.OS === 'ios' ? 70 : 60,
    backgroundColor: 'transparent',
    pointerEvents: 'box-none',
    zIndex: 100
  },

  floatingButton: {
    borderRadius: 30,
    overflow: 'hidden',
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 10
  },

  floatingGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    gap: 12
  },

  floatingText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: -0.3
  },
});