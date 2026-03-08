import FontAwesome from '@expo/vector-icons/FontAwesome';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { useFocusEffect } from 'expo-router';
import { useCallback } from 'react';
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
  primary: '#622db2',
  secondary: '#4ecdc4',
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
  if (imc < 18.5) return { classificacao: 'Abaixo do peso', cor: '#3B82F6', descricao: 'Abaixo do peso', emoji: '🍃' };
  if (imc < 25) return { classificacao: 'Peso ideal', cor: '#10B981', descricao: 'Peso ideal', emoji: '✅' };
  if (imc < 30) return { classificacao: 'Levemente acima do peso', cor: '#EAB308', descricao: 'Levemente acima do peso', emoji: '🟡' };
  if (imc < 35) return { classificacao: 'Acima do peso', cor: '#F97316', descricao: 'Acima do peso', emoji: '🟠' };
  return { classificacao: 'Obesidade', cor: '#DC2626', descricao: 'Obesidade', emoji: '🔴' };
};

const getClassificacaoBF = (bf: number, isMale: boolean) => {
  const ranges = isMale ? [6, 14, 18, 25] : [14, 21, 25, 32];
  const labels = ['Essencial', 'Atleta', 'Fitness', 'Aceitável', 'Elevado'];
  const colors = ['#3B82F6', '#22C55E', '#10B981', '#F59E0B', '#EF4444'];
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
const ProgressCircle = ({ value, max, color, label, sublabel }: any) => {
  const percentage = (value / max) * 100;

  return (
    <View style={{ width: 180, alignItems: 'center' }}>
      <View style={{
        width: 180,
        height: 180,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
      }}>
        <View style={{
          position: 'absolute',
          width: 160,
          height: 160,
          borderRadius: 80,
          backgroundColor: `${color}20`,
          opacity: 0.3,
        }} />
        <View style={{
          position: 'absolute',
          width: 160,
          height: 160,
          borderRadius: 80,
          borderWidth: 14,
          borderColor: color,
          borderLeftColor: 'transparent',
          borderBottomColor: 'transparent',
          borderRightColor: 'transparent',
          transform: [{ rotate: `${-90 + (percentage * 3.6)}deg` }],
        }} />
        <View style={{ alignItems: 'center' }}>
          <Text style={{ fontSize: 32, fontWeight: '800', color: color }}>
            {value.toFixed(1)}%
          </Text>
          {label && (
            <Text style={{ fontSize: 16, color: COLORS.textLight, marginTop: 4 }}>
              {label}
            </Text>
          )}
          {sublabel && (
            <Text style={{ fontSize: 14, color: COLORS.textSub, marginTop: 2 }}>
              {sublabel}
            </Text>
          )}
        </View>
      </View>
    </View>
  );
};

const IMCMeter = ({ imc, classificacao }: any) => {
  const getIMCPosition = () => {
    if (imc < 18.5) return (imc / 18.5) * 25;
    if (imc < 25) return 25 + ((imc - 18.5) / 6.5) * 25;
    if (imc < 30) return 50 + ((imc - 25) / 5) * 25;
    if (imc < 40) return 75 + Math.min(((imc - 30) / 10) * 25, 25);
    return 100;
  };

  return (
    <View style={{ marginBottom: 20 }}>
      <View style={{
        height: 8,
        borderRadius: 4,
        overflow: 'hidden',
        marginBottom: 8,
        position: 'relative',
      }}>
        <LinearGradient
          colors={['#3B82F6', '#10B981', '#F59E0B', '#EF4444']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={{ flex: 1, width: '100%' }}
        />
        <View style={{
          position: 'absolute',
          top: -4,
          alignItems: 'center',
          left: `${getIMCPosition()}%`,
        }}>
          <View style={{
            width: 16,
            height: 16,
            borderRadius: 8,
            borderWidth: 3,
            borderColor: '#FFFFFF',
            backgroundColor: classificacao.cor,
            elevation: 3,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.2,
            shadowRadius: 4,
          }} />
          <View style={{
            width: 2,
            height: 20,
            marginTop: 2,
            backgroundColor: classificacao.cor,
          }} />
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

// ============ MODAL DE CONFIRMAÇÃO ESTILIZADO ============
const ModalConfirmacao = ({ visible, onClose, onConfirm }: any) => {
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 8,
          tension: 40,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 0,
          friction: 8,
          tension: 40,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible]);

  if (!visible) return null;

  return (
    <Animated.View style={[
      StyleSheet.absoluteFill,
      {
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
        opacity: fadeAnim,
      }
    ]}>
      <Pressable 
        style={StyleSheet.absoluteFill} 
        onPress={onClose}
      />
      
      <Animated.View style={{
        backgroundColor: '#FFFFFF',
        borderRadius: 32,
        width: width - 48,
        padding: 24,
        alignItems: 'center',
        transform: [{ scale: scaleAnim }],
        shadowColor: '#622db2',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.3,
        shadowRadius: 20,
        elevation: 10,
      }}>
        <View style={{
          width: 80,
          height: 80,
          borderRadius: 40,
          backgroundColor: '#FEE2E2',
          justifyContent: 'center',
          alignItems: 'center',
          marginBottom: 20,
        }}>
          <FontAwesome name="exclamation-triangle" size={40} color="#EF4444" />
        </View>

        <Text style={{
          fontSize: 24,
          fontWeight: '800',
          color: '#1F2937',
          marginBottom: 8,
          textAlign: 'center',
        }}>
          Reiniciar Cadastro?
        </Text>

        <Text style={{
          fontSize: 16,
          color: '#6B7280',
          textAlign: 'center',
          lineHeight: 24,
          marginBottom: 24,
          paddingHorizontal: 8,
        }}>
          Todos os seus dados atuais serão perdidos e você precisará preencher tudo novamente.
        </Text>

        <LinearGradient
          colors={['#622db2', '#4ecdc4']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={{
            height: 4,
            width: '100%',
            borderRadius: 2,
            marginBottom: 24,
          }}
        />

        <View style={{
          flexDirection: 'row',
          gap: 12,
          width: '100%',
        }}>
          <Pressable
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              onClose();
            }}
            style={{
              flex: 1,
              paddingVertical: 16,
              borderRadius: 16,
              backgroundColor: '#F3F4F6',
              alignItems: 'center',
              borderWidth: 1,
              borderColor: '#E5E7EB',
            }}
          >
            <Text style={{
              fontSize: 16,
              fontWeight: '600',
              color: '#6B7280',
            }}>
              Cancelar
            </Text>
          </Pressable>

          <Pressable
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
              onConfirm();
            }}
            style={{
              flex: 1,
              paddingVertical: 16,
              borderRadius: 16,
              overflow: 'hidden',
            }}
          >
            <LinearGradient
              colors={['#EF4444', '#DC2626']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={{
                ...StyleSheet.absoluteFillObject,
              }}
            />
            <Text style={{
              fontSize: 16,
              fontWeight: '700',
              color: '#FFFFFF',
              textAlign: 'center',
            }}>
              Reiniciar
            </Text>
          </Pressable>
        </View>

        <View style={{
          flexDirection: 'row',
          alignItems: 'center',
          gap: 8,
          marginTop: 20,
          padding: 12,
          backgroundColor: '#FEF3C7',
          borderRadius: 12,
        }}>
          <FontAwesome name="info-circle" size={16} color="#D97706" />
          <Text style={{
            fontSize: 13,
            color: '#92400E',
            flex: 1,
          }}>
            Esta ação não pode ser desfeita
          </Text>
        </View>
      </Animated.View>
    </Animated.View>
  );
};

// ============ TELA PRINCIPAL ============
export default function AnaliseScreen() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [metricas, setMetricas] = useState<any>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const { fadeAnim, scaleAnim, rotacao } = useAnimations();

  useEffect(() => {
    carregarDados();
  }, []);

  useFocusEffect(
    useCallback(() => {
      carregarDados();
    }, [])
  );

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
      '@frequenciaCardio', '@frequenciaCardioDescricao', '@pescocoCm', '@cinturaCm', '@quadrilCm',
      '@treinaAtualmente',
      '@fornecerMedidas' // CHAVE CORRETA - resposta da QuadroCalcularBFScreen
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

    // CORREÇÃO: Usar @fornecerMedidas da QuadroCalcularBFScreen
    const forneceuMedidas = data['@fornecerMedidas'] === 'sim';
    
    const pescocoValido = data['@pescocoCm'] && !isNaN(parseFloat(data['@pescocoCm']));
    const cinturaValida = data['@cinturaCm'] && !isNaN(parseFloat(data['@cinturaCm']));
    
    const quadrilValido = data['@sexo'] === 'feminino' 
      ? data['@quadrilCm'] && !isNaN(parseFloat(data['@quadrilCm']))
      : true;

    const medidasCompletas = forneceuMedidas && pescocoValido && cinturaValida && quadrilValido;

    return {
      objetivo: data['@objetivo'] || DEFAULT_VALUES.objetivo,
      objetivoCompleto: objetivoCompletoObj,
      sexo: data['@sexo'] || DEFAULT_VALUES.sexo,
      idade: parseInt(data['@idade']) || DEFAULT_VALUES.idade,
      alturaCm: alturaFinalCm,
      pesoEmKg: pesoFinalKg,
      pescocoCm: medidasCompletas ? parseFloat(data['@pescocoCm']) : null,
      cinturaCm: medidasCompletas ? parseFloat(data['@cinturaCm']) : null,
      quadrilCm: medidasCompletas && data['@quadrilCm'] ? parseFloat(data['@quadrilCm']) : null,
      frequenciaTreino: data['@frequenciaTreino'] || DEFAULT_VALUES.frequenciaTreino,
      nivelAtividade: data['@nivelAtividade'] ? parseFloat(data['@nivelAtividade']) : null,
      forneceuMedidas: medidasCompletas,
    };
  };

  const calcularMetricas = (dados: any) => {
    const {
      objetivo, sexo, idade, alturaCm, pesoEmKg, pescocoCm,
      cinturaCm, quadrilCm, frequenciaTreino, nivelAtividade,
      forneceuMedidas
    } = dados;

    const alturaMetros = alturaCm / 100;
    const imc = pesoEmKg / (alturaMetros * alturaMetros);

    const pesoIdealMin = 18.5 * (alturaMetros * alturaMetros);
    const pesoIdealMax = 24.9 * (alturaMetros * alturaMetros);

    const calcularBF = () => {
      if (!forneceuMedidas) {
        return null;
      }

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

    const percentualGorduraCalc = calcularBF();
    const temMedidas = forneceuMedidas && percentualGorduraCalc !== null && !isNaN(percentualGorduraCalc);
    
    const percentualGordura = temMedidas 
      ? Math.min(Math.max(percentualGorduraCalc, sexo === 'masculino' ? 3 : 8), 50)
      : 0;
      
    const massaGordaKg = temMedidas ? (percentualGordura / 100) * pesoEmKg : 0;
    const massaMagraKg = temMedidas ? pesoEmKg - massaGordaKg : pesoEmKg;

    const tmb = sexo === 'feminino'
      ? (10 * pesoEmKg) + (6.25 * alturaCm) - (5 * idade) - 161
      : (10 * pesoEmKg) + (6.25 * alturaCm) - (5 * idade) + 5;

    const fatoresAtividade: any = {
      'nao': 1.2,
      '1-3': 1.375,
      '3-5': 1.55,
      '6-7': 1.725
    };

    let fatorAtividade;
    if (nivelAtividade) {
      fatorAtividade = nivelAtividade;
    } else {
      fatorAtividade = fatoresAtividade[frequenciaTreino] || 1.2;
    }

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
      percentualGorduraFormatado: temMedidas ? percentualGordura.toFixed(1) : '--',
      classificacaoBF: temMedidas ? getClassificacaoBF(percentualGordura, sexo === 'masculino') : {
        classificacao: 'Não calculado',
        cor: COLORS.textLight,
        descricao: 'Sem medidas',
        emoji: '❓'
      },
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
      temMedidas,
    };
  };

  const handleEditar = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setModalVisible(true);
  };

  const handleFornecerMedidas = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push('/(drawer)/QuadroCalcularBFScreen');
  };

  const confirmarReinicio = async () => {
    try {
      console.log('Iniciando limpeza dos dados...');
      
      const keysToRemove = [
        '@objetivo',
        '@objetivoCompleto',
        '@sexo',
        '@idade',
        '@faixaIdade',
        '@alturaUnidade',
        '@altura',
        '@alturaFt',
        '@alturaIn',
        '@alturaEmCm',
        '@pesoUnidade',
        '@pesoKg',
        '@pesoLb',
        '@pesoEmKg',
        '@frequenciaTreino',
        '@nivelAtividade',
        '@frequenciaTreinoDescricao',
        '@frequenciaCardio',
        '@frequenciaCardioDescricao',
        '@pescocoCm',
        '@cinturaCm',
        '@quadrilCm',
        '@treinaAtualmente',
        '@fornecerMedidas',
        '@metricasCompletas',
        '@userDataCompleto'
      ];
      
      await AsyncStorage.multiRemove(keysToRemove);
      await AsyncStorage.setItem('@onboardingCompleto', 'false');
      
      setMetricas(null);
      setModalVisible(false);
      
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      
      router.replace('/ObjetivoScreen');
      
    } catch (error) {
      console.error('Erro detalhado ao limpar dados:', error);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      
      Alert.alert(
        'Erro',
        'Não foi possível reiniciar o cadastro. Tente novamente.',
        [{ text: 'OK' }]
      );
    }
  };

  const handleComecar = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    await AsyncStorage.setItem('@onboardingCompleto', 'true');
    router.replace('/CadastroScreen');
  };

  if (isLoading) {
    return (
      <View style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
        <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', gap: 20 }}>
          <Animated.View style={{
            width: 120,
            height: 120,
            borderRadius: 60,
            borderWidth: 1.5,
            borderColor: COLORS.dot,
            borderStyle: 'dashed',
            opacity: 0.4,
            position: 'absolute',
            transform: [{
              rotate: rotacao.interpolate({
                inputRange: [0, 1],
                outputRange: ['0deg', '360deg']
              })
            }]
          }} />
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={{ fontSize: 20, fontWeight: '700', color: COLORS.textMain, marginTop: 20 }}>
            Preparando análise...
          </Text>
          <Text style={{ fontSize: 14, color: COLORS.textLight }}>
            Calculando suas métricas
          </Text>
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
    <View style={{ flex: 1, backgroundColor: '#F9FAFB' }}>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />

      <LinearGradient
        colors={['#F9FAFB', '#F3F4F6']}
        style={StyleSheet.absoluteFill}
      />
      <View style={{
        ...StyleSheet.absoluteFillObject,
        overflow: 'hidden',
        zIndex: 0
      }}>
        <Animated.View style={{
          position: 'absolute',
          borderWidth: 1.5,
          borderColor: COLORS.line,
          borderRadius: 999,
          width: width * 1.3,
          height: width * 1.3,
          top: -width * 0.3,
          right: -width * 0.3,
          transform: [{ rotate: spin }]
        }} />
        <Animated.View style={{
          position: 'absolute',
          borderWidth: 1.5,
          borderColor: COLORS.line,
          borderRadius: 999,
          width: width * 1.6,
          height: width * 1.6,
          bottom: -width * 0.5,
          left: -width * 0.5,
          transform: [{ rotate: spin }]
        }} />
        <View style={{
          position: 'absolute',
          width: 8,
          height: 8,
          borderRadius: 4,
          borderWidth: 2,
          borderColor: COLORS.dot,
          backgroundColor: '#FFFFFF',
          top: '15%',
          right: '10%'
        }} />
        <View style={{
          position: 'absolute',
          width: 8,
          height: 8,
          borderRadius: 4,
          borderWidth: 2,
          borderColor: COLORS.dot,
          backgroundColor: '#FFFFFF',
          bottom: '20%',
          left: '5%'
        }} />
        <View style={{
          position: 'absolute',
          width: 8,
          height: 8,
          borderRadius: 4,
          borderWidth: 2,
          borderColor: COLORS.dot,
          backgroundColor: '#FFFFFF',
          top: '30%',
          left: '15%'
        }} />
      </View>

      <SafeAreaView style={{ zIndex: 100, backgroundColor: 'transparent' }}>
        <View style={{
          paddingHorizontal: 25,
          paddingTop: StatusBar.currentHeight ? StatusBar.currentHeight + 10 : 40,
          zIndex: 100,
        }}>
          <Pressable
            onPress={handleEditar}
            style={{ flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-start' }}
          >
            <View style={{
              width: 32,
              height: 32,
              borderRadius: 16,
              backgroundColor: '#fff',
              justifyContent: 'center',
              alignItems: 'center',
              borderWidth: 1,
              borderColor: COLORS.line,
              elevation: 3,
              shadowColor: '#000',
              shadowOpacity: 0.1,
              shadowRadius: 3,
            }}>
              <FontAwesome name="chevron-left" size={12} color={COLORS.primary} />
            </View>

            <Text style={{
              color: COLORS.primary,
              marginLeft: 10,
              fontWeight: '700',
              fontSize: 16
            }}>
              Editar
            </Text>
          </Pressable>
        </View>
      </SafeAreaView>

      <Animated.ScrollView
        style={[{ flex: 1, zIndex: 10, opacity: fadeAnim }]}
        contentContainerStyle={{ paddingBottom: 100, paddingHorizontal: 16 }}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View style={[{
          marginBottom: 16,
          marginTop: 8,
          borderRadius: 24,
          overflow: 'hidden',
          elevation: 5,
          shadowColor: COLORS.primary,
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.2,
          shadowRadius: 8,
          transform: [{ scale: scaleAnim }]
        }]}>
          <LinearGradient
            colors={[COLORS.primary, COLORS.secondary]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{ padding: 24, alignItems: 'center' }}
          >
            <Image
              source={require('../../assets/images/logo-sem-fundo1.png')}
              style={{ width: 150, height: 80, marginBottom: 12, tintColor: '#FFFFFF' }}
              resizeMode="contain"
            />
            <Text style={{
              fontSize: 24,
              fontWeight: '900',
              color: '#FFFFFF',
              textAlign: 'center',
              marginBottom: 12,
              letterSpacing: 1
            }}>Análise Completa</Text>
            <View style={{
              flexDirection: 'row',
              alignItems: 'center',
              backgroundColor: 'rgba(255,255,255,0.2)',
              paddingVertical: 8,
              paddingHorizontal: 25,
              borderRadius: 30,
              gap: 8,
            }}>
              <FontAwesome name="check-circle" size={16} color="#FFF" />
              <Text style={{ fontSize: 14, fontWeight: '600', color: '#FFFFFF' }}>
                Seu panorama atual
              </Text>
            </View>
          </LinearGradient>
        </Animated.View>

        <LinearGradient
          colors={['#FFFFFF', '#F9FAFB']}
          style={{
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
          }}
        >
          <View style={{ alignItems: 'center', justifyContent: 'center', marginBottom: 16, flexDirection: 'row', gap: 8 }}>
            <View style={{
              width: 34,
              height: 34,
              borderRadius: 17,
              backgroundColor: `${COLORS.primary}15`,
              justifyContent: 'center',
              alignItems: 'center'
            }}>
              <FontAwesome name="bullseye" size={16} color={COLORS.primary} />
            </View>
            <Text style={{ fontSize: 20, fontWeight: '800', color: COLORS.textMain, textAlign: 'center' }}>
              Seu Índice Corporal
            </Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'baseline', justifyContent: 'center', marginBottom: 4 }}>
            <Text style={{ fontSize: 48, fontWeight: '900', color: COLORS.textMain }}>{metricas.imcFormatado}</Text>
            <Text style={{ fontSize: 16, color: COLORS.textLight, marginLeft: 8 }}>kg/m²</Text>
          </View>

          <Text style={{ fontSize: 16, fontWeight: '600', textAlign: 'center', marginBottom: 20, color: metricas.classificacaoIMC.cor }}>
            {metricas.classificacaoIMC.emoji} {metricas.classificacaoIMC.descricao}
          </Text>

          <IMCMeter imc={metricas.imc} classificacao={metricas.classificacaoIMC} />

          <View style={{ flexDirection: 'row', justifyContent: 'space-around', paddingTop: 16, borderTopWidth: 1, borderTopColor: COLORS.line }}>
            <View style={{ alignItems: 'center' }}>
              <Text style={{ fontSize: 12, color: COLORS.textLight, marginBottom: 4 }}>Mínimo ideal</Text>
              <Text style={{ fontSize: 16, fontWeight: '700', color: COLORS.textMain }}>18.5</Text>
            </View>
            <View style={{ alignItems: 'center' }}>
              <Text style={{ fontSize: 12, color: COLORS.textLight, marginBottom: 4 }}>Máximo ideal</Text>
              <Text style={{ fontSize: 16, fontWeight: '700', color: COLORS.textMain }}>24.9</Text>
            </View>
            <View style={{ alignItems: 'center' }}>
              <Text style={{ fontSize: 12, color: COLORS.textLight, marginBottom: 4 }}>Sua altura</Text>
              <Text style={{ fontSize: 16, fontWeight: '700', color: COLORS.textMain }}>{(metricas.alturaCm / 100).toFixed(2)}m</Text>
            </View>
          </View>
        </LinearGradient>

        <LinearGradient
          colors={['#FFFFFF', '#F9FAFB']}
          style={{
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
          }}
        >
          <View style={{ alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 8, marginBottom: 18 }}>
            <View style={{
              width: 34,
              height: 34,
              borderRadius: 17,
              backgroundColor: `${COLORS.success}15`,
              justifyContent: 'center',
              alignItems: 'center'
            }}>
              <FontAwesome name="balance-scale" size={16} color={COLORS.success} />
            </View>
            <Text style={{ fontSize: 22, fontWeight: '800', color: COLORS.textMain, textAlign: 'center' }}>
              Seu Peso
            </Text>
          </View>

          <View style={{ alignItems: 'center', marginBottom: 20 }}>
            <Text style={{ fontSize: 36, fontWeight: '800', color: COLORS.textMain, marginBottom: 8 }}>
              {metricas.pesoAtual.toFixed(1)} kg
            </Text>
            
            <View style={{
              flexDirection: 'row',
              alignItems: 'center',
              paddingHorizontal: 12,
              paddingVertical: 6,
              borderRadius: 20,
              gap: 6,
              backgroundColor: metricas.pesoAtual > metricas.pesoIdealMax ? `${COLORS.danger}15` :
                metricas.pesoAtual < metricas.pesoIdealMin ? `${COLORS.info}15` :
                  `${COLORS.success}15`
            }}>
              <FontAwesome
                name={metricas.pesoAtual > metricas.pesoIdealMax ? 'arrow-up' :
                  metricas.pesoAtual < metricas.pesoIdealMin ? 'arrow-down' : 'check'}
                size={12}
                color={metricas.pesoAtual > metricas.pesoIdealMax ? COLORS.danger :
                  metricas.pesoAtual < metricas.pesoIdealMin ? COLORS.info :
                    COLORS.success}
              />
              <Text style={{
                fontSize: 13,
                fontWeight: '600',
                color: metricas.pesoAtual > metricas.pesoIdealMax ? COLORS.danger :
                  metricas.pesoAtual < metricas.pesoIdealMin ? COLORS.info :
                    COLORS.success
              }}>
                {metricas.pesoAtual > metricas.pesoIdealMax ? `${(metricas.pesoAtual - metricas.pesoIdealMax).toFixed(1)}kg acima do ideal máximo` :
                  metricas.pesoAtual < metricas.pesoIdealMin ? `${(metricas.pesoIdealMin - metricas.pesoAtual).toFixed(1)}kg abaixo do ideal mínimo` :
                    'Peso ideal'}
              </Text>
            </View>
          </View>

          <View style={{ marginBottom: 20 }}>
            <View style={{ height: 8, backgroundColor: '#E5E7EB', borderRadius: 4, position: 'relative', marginBottom: 8 }}>
              <View style={{
                position: 'absolute',
                height: '100%',
                backgroundColor: `${COLORS.success}30`,
                borderRadius: 4,
                left: `${(metricas.pesoIdealMin / metricas.pesoIdealMax) * 50}%`,
                right: `${100 - (metricas.pesoIdealMax / (metricas.pesoIdealMax * 1.3)) * 100}%`,
              }} />
              <View style={{
                position: 'absolute',
                top: -6,
                alignItems: 'center',
                left: `${(metricas.pesoAtual / (metricas.pesoIdealMax * 1.3)) * 100}%`,
              }}>
                <View style={{
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
                }} />
              </View>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 4 }}>
              <Text style={{ fontSize: 11, color: COLORS.textLight }}>{metricas.pesoIdealMin.toFixed(0)}kg</Text>
              <Text style={{ fontSize: 11, color: COLORS.textLight }}>{((metricas.pesoIdealMin + metricas.pesoIdealMax) / 2).toFixed(0)}kg</Text>
              <Text style={{ fontSize: 11, color: COLORS.textLight }}>{metricas.pesoIdealMax.toFixed(0)}kg</Text>
            </View>
          </View>

          <View style={{ flexDirection: 'row', gap: 8 }}>
            <View style={{ flex: 1, padding: 12, borderRadius: 16, alignItems: 'center', borderWidth: 1, borderColor: COLORS.line }}>
              <Text style={{ fontSize: 12, color: COLORS.textLight, marginBottom: 4 }}>Mínimo</Text>
              <Text style={{ fontSize: 16, fontWeight: '700', color: COLORS.textMain }}>{metricas.pesoIdealMin.toFixed(1)}</Text>
              <Text style={{ fontSize: 11, color: COLORS.textLight }}>kg</Text>
            </View>
            <View style={{
              flex: 1,
              padding: 12,
              borderRadius: 16,
              alignItems: 'center',
              borderWidth: 2,
              borderColor: COLORS.success,
              backgroundColor: `${COLORS.success}05`,
            }}>
              <Text style={{ fontSize: 12, color: COLORS.textLight, marginBottom: 4 }}>Ideal</Text>
              <Text style={{ fontSize: 18, fontWeight: '800', color: COLORS.success }}>
                {((metricas.pesoIdealMin + metricas.pesoIdealMax) / 2).toFixed(1)}
              </Text>
              <Text style={{ fontSize: 11, color: COLORS.textLight }}>kg</Text>
            </View>
            <View style={{ flex: 1, padding: 12, borderRadius: 16, alignItems: 'center', borderWidth: 1, borderColor: COLORS.line }}>
              <Text style={{ fontSize: 12, color: COLORS.textLight, marginBottom: 4 }}>Máximo</Text>
              <Text style={{ fontSize: 16, fontWeight: '700', color: COLORS.textMain }}>{metricas.pesoIdealMax.toFixed(1)}</Text>
              <Text style={{ fontSize: 11, color: COLORS.textLight }}>kg</Text>
            </View>
          </View>
        </LinearGradient>

        <LinearGradient
          colors={['#FFFFFF', '#F9FAFB']}
          style={{
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
          }}
        >
          <View style={{ alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 10, marginBottom: 22 }}>
            <View style={{
              width: 34,
              height: 34,
              borderRadius: 17,
              backgroundColor: `${COLORS.purple}15`,
              justifyContent: 'center',
              alignItems: 'center'
            }}>
              <FontAwesome name="heartbeat" size={16} color={COLORS.purple} />
            </View>
            <Text style={{ fontSize: 22, fontWeight: '800', color: COLORS.textMain }}>
              Seu Percentual de Gordura
            </Text>
          </View>

          {metricas.temMedidas ? (
            <>
              <View style={{ alignItems: 'center', marginBottom: 24 }}>
                <ProgressCircle
                  value={metricas.percentualGordura}
                  max={metricas.sexo === 'masculino' ? 35 : 45}
                  color={metricas.classificacaoBF.cor}
                  sublabel={metricas.classificacaoBF.classificacao}
                />
              </View>

              <View style={{ gap: 16 }}>
                <View style={{ flexDirection: 'row', gap: 12, alignItems: 'center' }}>
                  <View style={{ width: 12, height: 12, borderRadius: 6, backgroundColor: COLORS.info }} />
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontSize: 14, color: COLORS.textLight, marginBottom: 4 }}>
                      Massa Magra (músculos, ossos e órgãos)
                    </Text>
                    <Text style={{ fontSize: 16, fontWeight: '600', color: COLORS.textMain, marginBottom: 6 }}>
                      {metricas.massaMagraKg.toFixed(1)} kg
                    </Text>
                    <View style={{ height: 6, backgroundColor: '#E5E7EB', borderRadius: 3, overflow: 'hidden' }}>
                      <View style={{
                        height: '100%',
                        borderRadius: 3,
                        width: `${(metricas.massaMagraKg / metricas.pesoAtual) * 100}%`,
                        backgroundColor: COLORS.info
                      }} />
                    </View>
                  </View>
                </View>

                <View style={{ flexDirection: 'row', gap: 12, alignItems: 'center' }}>
                  <View style={{ width: 12, height: 12, borderRadius: 6, backgroundColor: COLORS.warning }} />
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontSize: 14, color: COLORS.textLight, marginBottom: 4 }}>
                      Gordura Corporal Total
                    </Text>
                    <Text style={{ fontSize: 16, fontWeight: '600', color: COLORS.textMain, marginBottom: 6 }}>
                      {metricas.massaGordaKg.toFixed(1)} kg
                    </Text>
                    <View style={{ height: 6, backgroundColor: '#E5E7EB', borderRadius: 3, overflow: 'hidden' }}>
                      <View style={{
                        height: '100%',
                        borderRadius: 3,
                        width: `${(metricas.massaGordaKg / metricas.pesoAtual) * 100}%`,
                        backgroundColor: COLORS.warning
                      }} />
                    </View>
                  </View>
                </View>
              </View>
            </>
          ) : (
            <View style={{ alignItems: 'center', padding: 20 }}>
              <View style={{
                backgroundColor: `${COLORS.warning}20`,
                paddingHorizontal: 16,
                paddingVertical: 6,
                borderRadius: 30,
                marginBottom: 16,
                borderWidth: 1,
                borderColor: `${COLORS.warning}30`,
              }}>
                <Text style={{
                  fontSize: 14,
                  fontWeight: '700',
                  color: COLORS.warning,
                }}>
                  ⚠️ NÃO CALCULADO
                </Text>
              </View>

              <Text style={{
                fontSize: 18,
                fontWeight: '700',
                color: COLORS.textMain,
                textAlign: 'center',
                marginBottom: 8,
              }}>
                Medidas não fornecidas
              </Text>

              <Text style={{
                fontSize: 14,
                color: COLORS.textLight,
                textAlign: 'center',
                lineHeight: 20,
                marginBottom: 20,
                paddingHorizontal: 10,
              }}>
                Você optou por não informar suas medidas corporais. Para calcular seu percentual de gordura, precisamos de:
              </Text>

              <View style={{ width: '100%', gap: 12, marginBottom: 16 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                  <View style={{
                    width: 32,
                    height: 32,
                    borderRadius: 16,
                    backgroundColor: `${COLORS.primary}10`,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                    <FontAwesome name="arrows-v" size={14} color={COLORS.primary} />
                  </View>
                  <Text style={{ fontSize: 14, color: COLORS.textMain, flex: 1 }}>
                    <Text style={{ fontWeight: '600' }}>Pescoço</Text> - circunferência
                  </Text>
                </View>

                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                  <View style={{
                    width: 32,
                    height: 32,
                    borderRadius: 16,
                    backgroundColor: `${COLORS.primary}10`,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                    <FontAwesome name="arrows-h" size={14} color={COLORS.primary} />
                  </View>
                  <Text style={{ fontSize: 14, color: COLORS.textMain, flex: 1 }}>
                    <Text style={{ fontWeight: '600' }}>Cintura</Text> - circunferência
                  </Text>
                </View>

                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                  <View style={{
                    width: 32,
                    height: 32,
                    borderRadius: 16,
                    backgroundColor: `${COLORS.primary}10`,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                    <FontAwesome name="arrows-h" size={14} color={COLORS.primary} />
                  </View>
                  <Text style={{ fontSize: 14, color: COLORS.textMain, flex: 1 }}>
                    <Text style={{ fontWeight: '600' }}>Quadril</Text> - circunferência (para mulheres)
                  </Text>
                </View>
              </View>

              <Pressable
                onPress={handleFornecerMedidas}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 8,
                  paddingVertical: 10,
                  paddingHorizontal: 20,
                  borderRadius: 30,
                  backgroundColor: COLORS.primary,
                  marginTop: 8,
                }}
              >
                <FontAwesome name="pencil" size={14} color="#FFF" />
                <Text style={{ fontSize: 14, fontWeight: '600', color: '#FFF' }}>
                  Fornecer medidas
                </Text>
              </Pressable>
            </View>
          )}
        </LinearGradient>

        <LinearGradient
          colors={['#FFFFFF', '#F9FAFB']}
          style={{
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
          }}
        >
          <View style={{ alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 10, marginBottom: 22 }}>
            <View style={{
              width: 34,
              height: 34,
              borderRadius: 17,
              backgroundColor: `${COLORS.accent}15`,
              justifyContent: 'center',
              alignItems: 'center'
            }}>
              <FontAwesome name="bolt" size={16} color={COLORS.accent} />
            </View>
            <Text style={{ fontSize: 22, fontWeight: '800', color: COLORS.textMain }}>
              Seu Gasto Calórico
            </Text>
          </View>

          <View style={{ gap: 12, marginBottom: 20 }}>
            <View style={{ alignItems: 'center', padding: 16, borderRadius: 16, borderWidth: 1, borderColor: COLORS.line, flexDirection: 'row' }}>
              <View style={{
                width: 48,
                height: 48,
                borderRadius: 24,
                justifyContent: 'center',
                alignItems: 'center',
                marginRight: 16,
                backgroundColor: `${COLORS.purple}15`
              }}>
                <FontAwesome name="moon-o" size={20} color={COLORS.purple} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 13, color: COLORS.textLight, fontWeight: '600', marginBottom: 4 }}>
                  Metabolismo em Repouso
                </Text>
                <Text style={{ fontSize: 24, fontWeight: '800', color: COLORS.textMain }}>
                  {metricas.tmbFormatado} <Text style={{ fontSize: 13, fontWeight: '400', color: COLORS.textLight }}>kcal/dia</Text>
                </Text>
                <Text style={{ fontSize: 12, color: COLORS.textSub, marginTop: 2 }}>Calorias que seu corpo gasta parado</Text>
              </View>
            </View>

            <View style={{ alignItems: 'center', padding: 16, borderRadius: 16, borderWidth: 1, borderColor: COLORS.line, flexDirection: 'row' }}>
              <View style={{
                width: 48,
                height: 48,
                borderRadius: 24,
                justifyContent: 'center',
                alignItems: 'center',
                marginRight: 16,
                backgroundColor: `${COLORS.pink}15`
              }}>
                <FontAwesome name="bicycle" size={20} color={COLORS.pink} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 13, color: COLORS.textLight, fontWeight: '600', marginBottom: 4 }}>
                  Calorias Gastas por Dia
                </Text>
                <Text style={{ fontSize: 24, fontWeight: '800', color: COLORS.textMain }}>
                  {metricas.tdeeFormatado} <Text style={{ fontSize: 13, fontWeight: '400', color: COLORS.textLight }}>kcal/dia</Text>
                </Text>
                <Text style={{ fontSize: 12, color: COLORS.textSub, marginTop: 2 }}>{metricas.nivelAtividadeDescricao}</Text>
              </View>
            </View>
          </View>
        </LinearGradient>

        <LinearGradient
          colors={[COLORS.primary, COLORS.secondary]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{
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
          }}
        >
          <FontAwesome name="quote-left" size={24} color="rgba(255,255,255,0.3)" />
          <Text style={{
            fontSize: 16,
            color: '#FFFFFF',
            fontStyle: 'italic',
            textAlign: 'center',
            lineHeight: 24,
            marginVertical: 16,
          }}>
            "O sucesso é a soma de pequenos esforços repetidos dia após dia."
          </Text>
          <Text style={{ fontSize: 14, color: 'rgba(255,255,255,0.8)', fontWeight: '500' }}>
            - Robert Collier
          </Text>
        </LinearGradient>

        <View style={{ height: 20 }} />
      </Animated.ScrollView>

      <SafeAreaView style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        paddingHorizontal: 25,
        paddingBottom: 40,
        backgroundColor: 'transparent',
        zIndex: 100
      }}>
        <Pressable
          onPress={handleComecar}
          style={{ width: '100%', borderRadius: 22, overflow: 'hidden', elevation: 4 }}
        >
          <LinearGradient
            colors={['#4ecdc4', '#622db2', '#4b208c']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{ paddingVertical: 18, alignItems: 'center', flexDirection: 'row', justifyContent: 'center', gap: 10 }}
          >
            <FontAwesome name="rocket" size={18} color="#fff" />
            <Text style={{ color: '#fff', fontSize: 18, fontWeight: '800' }}>
              Criar Desafio
            </Text>
          </LinearGradient>
        </Pressable>
      </SafeAreaView>

      <ModalConfirmacao
        visible={modalVisible}
        onClose={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          setModalVisible(false);
        }}
        onConfirm={confirmarReinicio}
      />
    </View>
  );
}