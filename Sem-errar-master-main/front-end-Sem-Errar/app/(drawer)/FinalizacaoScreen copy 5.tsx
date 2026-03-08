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
  Easing,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  View,
  StatusBar,
  Image,
} from 'react-native';

const { width } = Dimensions.get('window');

// Cores consistentes com a tela de preparação
const COLORS = {
  primary: '#622db2',
  secondary: '#4ecdc4',
  dot: '#4ecdc4',
  line: 'rgba(112, 82, 230, 0.15)',
  textMain: '#1A1A1A',
  textLight: '#6B7A8F',
  textSub: '#9AABC0',
  white: '#FFFFFF',
  background: '#F5F7FA',
  cardBg: 'rgba(255, 255, 255, 0.95)',
  success: '#4CAF50',
  warning: '#FF9800',
  danger: '#FF5722',
  info: '#2196F3',
  purple: '#9C27B0',
  pink: '#E91E63',
  gold: '#FFD700',
};

// ============ INTERFACES E TIPOS ============
interface ObjetivoCompleto {
  id: string;
  title: string;
  description?: string;
}

interface UserData {
  objetivo: string;
  objetivoCompleto: ObjetivoCompleto | null;
  sexo: string;
  idade: number;
  faixaIdade: string | null;
  alturaUnidade: string | null;
  altura: number | null;
  alturaFt: number | null;
  alturaIn: number | null;
  alturaCm: number;
  pesoUnidade: string | null;
  pesoKg: number | null;
  pesoLb: number | null;
  pesoEmKg: number;
  frequenciaTreino: string;
  nivelAtividade: number | null;
  frequenciaTreinoDescricao: string | null;
  treinaAtualmente: boolean;
  querLembretesAgua: boolean;
  coposAguaDia: number;
  frequenciaCardio: string | null;
  frequenciaCardioDescricao: string | null;
  pescocoCm: number;
  cinturaCm: number;
  quadrilCm: number | null;
}

interface Classificacao {
  classificacao: string;
  cor: string;
  descricao: string;
  emoji?: string;
  gradiente?: [string, string];
}

interface CaloriasObjetivo {
  manutencao: number;
  objetivo: number;
  meta: string;
  descricao: string;
  diferenca: string;
  cor: string;
  gradiente: [string, string];
}

interface Macronutriente {
  min: number;
  max: number;
  descricao: string;
  recomendacao?: string;
  gPorKg: string;
  icon: string;
  cor: string;
}

interface Metricas {
  objetivo: string;
  sexo: string;
  idade: number;
  alturaCm: number;
  pesoEmKg: number;
  imc: number;
  imcFormatado: string;
  classificacaoIMC: Classificacao;
  pesoIdealMin: number;
  pesoIdealMax: number;
  percentualGordura: number;
  percentualGorduraFormatado: string;
  classificacaoBF: Classificacao;
  massaGordaKg: number;
  massaMagraKg: number;
  tmb: number;
  tmbFormatado: string;
  tdee: number;
  tdeeFormatado: string;
  nivelAtividade: number;
  nivelAtividadeDescricao: string;
  calorias: CaloriasObjetivo;
  proteina: Macronutriente;
  carboidratos: Macronutriente;
  gorduras: Macronutriente;
  aguaRecomendadaLitros: number;
  aguaRecomendadaFormatada: string;
  coposAguaRecomendados: number;
  querLembretesAgua: boolean;
  frequenciaTreino: string;
  treinaAtualmente: boolean;
  tempoMeta: string;
  frequenciaCardio: string | null;
  frequenciaCardioDescricao: string | null;
  dataCalculo: string;
}

export default function AnaliseScreen() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [metricas, setMetricas] = useState<Metricas | null>(null);

  // Animações
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.95)).current;
  const rotacao = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    carregarTodosDadosECalcular();
    
    // Animações de entrada
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

    // Animação de rotação para elementos de fundo
    Animated.loop(
      Animated.timing(rotacao, {
        toValue: 1,
        duration: 20000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();
  }, []);

  const carregarTodosDadosECalcular = async () => {
    setIsLoading(true);
    try {
      console.log('📱 Iniciando carregamento de dados do AsyncStorage...');
      const dados = await carregarDadosDoStorage();
      const resultados = calcularTodasMetricas(dados);
      setUserData(dados);
      setMetricas(resultados);

      await AsyncStorage.setItem('@metricasCompletas', JSON.stringify(resultados));
      await AsyncStorage.setItem('@userDataCompleto', JSON.stringify(dados));

      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch (error) {
      console.error('❌ Erro ao carregar dados:', error);
      Alert.alert('Erro', 'Não foi possível carregar seus dados.');
    } finally {
      setIsLoading(false);
    }
  };

  const carregarDadosDoStorage = async (): Promise<UserData> => {
    try {
      const [
        objetivo, objetivoCompleto, sexo, idade, faixaIdade,
        alturaUnidade, altura, alturaFt, alturaIn, alturaEmCm,
        pesoUnidade, pesoKg, pesoLb, pesoEmKg,
        frequenciaTreino, nivelAtividade, frequenciaTreinoDescricao,
        querLembretesAgua, coposAguaDia,
        frequenciaCardio, frequenciaCardioDescricao,
        pescocoCm, cinturaCm, quadrilCm, treinaAtualmente
      ] = await Promise.all([
        AsyncStorage.getItem('@objetivo'),
        AsyncStorage.getItem('@objetivoCompleto'),
        AsyncStorage.getItem('@sexo'),
        AsyncStorage.getItem('@idade'),
        AsyncStorage.getItem('@faixaIdade'),
        AsyncStorage.getItem('@alturaUnidade'),
        AsyncStorage.getItem('@altura'),
        AsyncStorage.getItem('@alturaFt'),
        AsyncStorage.getItem('@alturaIn'),
        AsyncStorage.getItem('@alturaEmCm'),
        AsyncStorage.getItem('@pesoUnidade'),
        AsyncStorage.getItem('@pesoKg'),
        AsyncStorage.getItem('@pesoLb'),
        AsyncStorage.getItem('@pesoEmKg'),
        AsyncStorage.getItem('@frequenciaTreino'),
        AsyncStorage.getItem('@nivelAtividade'),
        AsyncStorage.getItem('@frequenciaTreinoDescricao'),
        AsyncStorage.getItem('@querLembretesAgua'),
        AsyncStorage.getItem('@coposAguaDia'),
        AsyncStorage.getItem('@frequenciaCardio'),
        AsyncStorage.getItem('@frequenciaCardioDescricao'),
        AsyncStorage.getItem('@pescocoCm'),
        AsyncStorage.getItem('@cinturaCm'),
        AsyncStorage.getItem('@quadrilCm'),
        AsyncStorage.getItem('@treinaAtualmente')
      ]);

      let objetivoCompletoObj: ObjetivoCompleto | null = null;
      if (objetivoCompleto) {
        try {
          objetivoCompletoObj = JSON.parse(objetivoCompleto);
        } catch (e) {
          console.error('Erro ao parsear objetivoCompleto:', e);
        }
      }

      let alturaFinalCm = 170;
      if (alturaEmCm) {
        alturaFinalCm = parseFloat(alturaEmCm);
      } else if (alturaUnidade === 'cm' && altura) {
        alturaFinalCm = parseFloat(altura);
      } else if (alturaFt) {
        alturaFinalCm = converterParaCm(parseFloat(alturaFt), parseFloat(alturaIn || '0'));
      }

      let pesoFinalKg = 70;
      if (pesoEmKg) {
        pesoFinalKg = parseFloat(pesoEmKg);
      } else if (pesoUnidade === 'kg' && pesoKg) {
        pesoFinalKg = parseFloat(pesoKg);
      }

      const idadeNum = idade ? parseInt(idade) : 32;
      const pescoco = pescocoCm ? parseFloat(pescocoCm) : 42;
      const cintura = cinturaCm ? parseFloat(cinturaCm) : 109;
      const quadril = quadrilCm ? parseFloat(quadrilCm) : null;
      const frequencia = frequenciaTreino || '3-4';
      const atividade = nivelAtividade ? parseFloat(nivelAtividade) : null;
      const querAgua = querLembretesAgua || 'sim';
      const coposAgua = coposAguaDia ? parseInt(coposAguaDia) : 10;

      return {
        objetivo: objetivo || 'manter',
        objetivoCompleto: objetivoCompletoObj,
        sexo: sexo || 'masculino',
        idade: idadeNum,
        faixaIdade: faixaIdade || null,
        alturaUnidade: alturaUnidade || null,
        altura: altura ? parseFloat(altura) : null,
        alturaFt: alturaFt ? parseInt(alturaFt) : null,
        alturaIn: alturaIn ? parseInt(alturaIn) : null,
        alturaCm: alturaFinalCm,
        pesoUnidade: pesoUnidade || null,
        pesoKg: pesoKg ? parseFloat(pesoKg) : null,
        pesoLb: pesoLb ? parseFloat(pesoLb) : null,
        pesoEmKg: pesoFinalKg,
        frequenciaTreino: frequencia,
        nivelAtividade: atividade,
        frequenciaTreinoDescricao: frequenciaTreinoDescricao || null,
        treinaAtualmente: treinaAtualmente === 'sim',
        querLembretesAgua: querAgua === 'sim',
        coposAguaDia: coposAgua,
        frequenciaCardio: frequenciaCardio || null,
        frequenciaCardioDescricao: frequenciaCardioDescricao || null,
        pescocoCm: pescoco,
        cinturaCm: cintura,
        quadrilCm: quadril
      };
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      throw error;
    }
  };

  const calcularTodasMetricas = (dados: UserData): Metricas => {
    const {
      objetivo = 'manter',
      sexo = 'masculino',
      idade = 32,
      alturaCm = 170,
      pesoEmKg = 70,
      pescocoCm = 42,
      cinturaCm = 109,
      quadrilCm = null,
      frequenciaTreino = '3-4',
      nivelAtividade = null,
      querLembretesAgua = true,
    } = dados;

    const alturaMetros = alturaCm / 100;
    const imc = pesoEmKg / (alturaMetros * alturaMetros);

    const getClassificacaoIMC = (imc: number): Classificacao => {
      if (imc < 18.5) return {
        classificacao: 'Baixo Peso',
        cor: '#2196F3',
        descricao: 'Abaixo do peso ideal',
        emoji: '⚡',
        gradiente: ['#2196F3', '#1976D2']
      };
      if (imc < 25) return {
        classificacao: 'Peso Saudável',
        cor: '#4CAF50',
        descricao: 'Peso ideal',
        emoji: '💚',
        gradiente: ['#4CAF50', '#388E3C']
      };
      if (imc < 30) return {
        classificacao: 'Sobrepeso',
        cor: '#FF9800',
        descricao: 'Acima do peso ideal',
        emoji: '⚠️',
        gradiente: ['#FF9800', '#F57C00']
      };
      if (imc < 35) return {
        classificacao: 'Obesidade I',
        cor: '#FF5722',
        descricao: 'Obesidade moderada',
        emoji: '🔴',
        gradiente: ['#FF5722', '#E64A19']
      };
      return {
        classificacao: 'Obesidade II+',
        cor: '#D32F2F',
        descricao: 'Obesidade severa',
        emoji: '⛔',
        gradiente: ['#D32F2F', '#B71C1C']
      };
    };

    const classificacaoIMC = getClassificacaoIMC(imc);
    const pesoMinimo = 18.5 * (alturaMetros * alturaMetros);
    const pesoMaximo = 24.9 * (alturaMetros * alturaMetros);

    const calcularPercentualGordura = (): number => {
      // Fórmula da Marinha dos EUA (U.S. Navy Method)
      const alturaInches = alturaCm * 0.393701;
      const pescocoInches = pescocoCm * 0.393701;
      const cinturaInches = cinturaCm * 0.393701;
      
      if (sexo === 'masculino') {
        // Para homens: %Gordura = 86.010 * log10(cintura - pescoço) - 70.041 * log10(altura) + 36.76
        const bf = 86.010 * Math.log10(cinturaInches - pescocoInches) - 70.041 * Math.log10(alturaInches) + 36.76;
        return Math.max(3, Math.min(bf, 45));
      } else {
        // Para mulheres: precisa do quadril
        if (quadrilCm && quadrilCm > 0) {
          const quadrilInches = quadrilCm * 0.393701;
          // %Gordura = 163.205 * log10(cintura + quadril - pescoço) - 97.684 * log10(altura) - 78.387
          const bf = 163.205 * Math.log10(cinturaInches + quadrilInches - pescocoInches) - 97.684 * Math.log10(alturaInches) - 78.387;
          return Math.max(8, Math.min(bf, 55));
        }
      }
      
      // Fallback: estimativa baseada em IMC caso não tenha todas medidas
      const sexoValor = sexo === 'feminino' ? 1 : 0;
      return Math.max(5, Math.min((1.20 * imc) + (0.23 * idade) - (10.8 * sexoValor) - 5.4, 50));
    };

    const percentualGordura = calcularPercentualGordura();
    const massaGordaKg = (percentualGordura / 100) * pesoEmKg;
    const massaMagraKg = pesoEmKg - massaGordaKg;

    const getClassificacaoBF = (bf: number, isMale: boolean): Classificacao => {
      if (isMale) {
        if (bf < 6) return {
          classificacao: 'Essencial',
          cor: '#2196F3',
          descricao: 'Muito baixo',
          emoji: '💪',
          gradiente: ['#2196F3', '#1976D2']
        };
        if (bf < 14) return {
          classificacao: 'Atleta',
          cor: '#4CAF50',
          descricao: 'Excelente',
          emoji: '🏆',
          gradiente: ['#4CAF50', '#388E3C']
        };
        if (bf < 18) return {
          classificacao: 'Fitness',
          cor: '#8BC34A',
          descricao: 'Bom',
          emoji: '👍',
          gradiente: ['#8BC34A', '#689F38']
        };
        if (bf < 25) return {
          classificacao: 'Aceitável',
          cor: '#FFC107',
          descricao: 'Médio',
          emoji: '👌',
          gradiente: ['#FFC107', '#FFA000']
        };
        return {
          classificacao: 'Elevado',
          cor: '#FF5722',
          descricao: 'Alto',
          emoji: '⚠️',
          gradiente: ['#FF5722', '#E64A19']
        };
      } else {
        if (bf < 14) return {
          classificacao: 'Essencial',
          cor: '#2196F3',
          descricao: 'Muito baixo',
          emoji: '💪',
          gradiente: ['#2196F3', '#1976D2']
        };
        if (bf < 21) return {
          classificacao: 'Atleta',
          cor: '#4CAF50',
          descricao: 'Excelente',
          emoji: '🏆',
          gradiente: ['#4CAF50', '#388E3C']
        };
        if (bf < 25) return {
          classificacao: 'Fitness',
          cor: '#8BC34A',
          descricao: 'Bom',
          emoji: '👍',
          gradiente: ['#8BC34A', '#689F38']
        };
        if (bf < 32) return {
          classificacao: 'Aceitável',
          cor: '#FFC107',
          descricao: 'Médio',
          emoji: '👌',
          gradiente: ['#FFC107', '#FFA000']
        };
        return {
          classificacao: 'Elevado',
          cor: '#FF5722',
          descricao: 'Alto',
          emoji: '⚠️',
          gradiente: ['#FF5722', '#E64A19']
        };
      }
    };

    const classificacaoBF = getClassificacaoBF(percentualGordura, sexo === 'masculino');

    const calcularTMB = (): number => {
      // Mifflin-St Jeor Equation
      if (sexo === 'feminino') {
        return (10 * pesoEmKg) + (6.25 * alturaCm) - (5 * idade) - 161;
      } else {
        return (10 * pesoEmKg) + (6.25 * alturaCm) - (5 * idade) + 5;
      }
    };

    const tmb = calcularTMB();

    let atividadeNum = nivelAtividade || 1.2;
    if (!nivelAtividade) {
      switch (frequenciaTreino) {
        case '0': atividadeNum = 1.2; break;
        case '1-2': atividadeNum = 1.375; break;
        case '3-4': atividadeNum = 1.55; break;
        case '5-6': atividadeNum = 1.725; break;
        default: atividadeNum = 1.2;
      }
    }

    const tdee = tmb * atividadeNum;

    const getCaloriasObjetivo = (): CaloriasObjetivo => {
      const manutencao = tdee;
      switch (objetivo) {
        case 'emagrecer':
          return {
            manutencao,
            objetivo: manutencao * 0.85,
            meta: 'Déficit Calórico',
            descricao: 'Para emagrecimento saudável',
            diferenca: '-15%',
            cor: '#FF5722',
            gradiente: ['#FF5722', '#E64A19']
          };
        case 'ganhar_massa':
        case 'ganho':
          return {
            manutencao,
            objetivo: manutencao * 1.15,
            meta: 'Superávit Calórico',
            descricao: 'Para ganho muscular',
            diferenca: '+15%',
            cor: '#4CAF50',
            gradiente: ['#4CAF50', '#388E3C']
          };
        default:
          return {
            manutencao,
            objetivo: manutencao,
            meta: 'Manutenção',
            descricao: 'Para manter o peso',
            diferenca: '0%',
            cor: '#666666',
            gradiente: ['#666666', '#444444']
          };
      }
    };

    const calorias = getCaloriasObjetivo();

    const getProteinaRecomendada = (): Macronutriente => {
      if (objetivo === 'ganhar_massa' || objetivo === 'ganho') {
        return {
          min: pesoEmKg * 1.8,
          max: pesoEmKg * 2.2,
          descricao: 'Hipertrofia',
          recomendacao: 'Alto consumo proteico',
          gPorKg: '1.8-2.2g/kg',
          icon: 'battery-3',
          cor: '#4CAF50'
        };
      } else if (objetivo === 'emagrecer') {
        return {
          min: pesoEmKg * 1.6,
          max: pesoEmKg * 2.0,
          descricao: 'Preservação muscular',
          recomendacao: 'Médio-alto consumo',
          gPorKg: '1.6-2.0g/kg',
          icon: 'battery-2',
          cor: '#FF9800'
        };
      } else {
        return {
          min: pesoEmKg * 1.2,
          max: pesoEmKg * 1.6,
          descricao: 'Manutenção',
          recomendacao: 'Consumo moderado',
          gPorKg: '1.2-1.6g/kg',
          icon: 'battery-1',
          cor: '#2196F3'
        };
      }
    };

    const proteina = getProteinaRecomendada();
    const carboidratos: Macronutriente = {
      min: pesoEmKg * 3,
      max: pesoEmKg * 5,
      descricao: 'Fonte primária de energia',
      gPorKg: '3-5g/kg',
      icon: 'flash',
      cor: '#FF9800'
    };
    const gorduras: Macronutriente = {
      min: pesoEmKg * 0.8,
      max: pesoEmKg * 1.2,
      descricao: 'Essencial para hormônios',
      gPorKg: '0.8-1.2g/kg',
      icon: 'tint',
      cor: '#2196F3'
    };

    const aguaRecomendadaLitros = Math.max(2.0, Math.min(pesoEmKg * 0.035, 4.0));
    const coposAguaRecomendados = Math.round(aguaRecomendadaLitros * 4);

    const calcularTempoMeta = (): string => {
      const pesoAtual = pesoEmKg;
      let pesoMeta;

      if (objetivo === 'emagrecer') {
        pesoMeta = pesoMaximo;
      } else if (objetivo === 'ganhar_massa' || objetivo === 'ganho') {
        pesoMeta = pesoMinimo;
      } else {
        pesoMeta = pesoAtual;
      }

      const diferencaPeso = Math.abs(pesoAtual - pesoMeta);
      const taxaSemanal = 0.75;
      const semanas = diferencaPeso / taxaSemanal;
      const meses = semanas / 4.33;

      if (diferencaPeso < 1) return 'menos de 1 semana';
      if (meses < 1) return `${Math.ceil(semanas)} semanas`;
      if (meses < 12) return `${Math.ceil(meses)} meses`;
      return `${(meses / 12).toFixed(1)} anos`;
    };

    const tempoMeta = calcularTempoMeta();

    const getNivelAtividadeDescricao = (nivel: number): string => {
      if (nivel <= 1.2) return 'Sedentário';
      if (nivel <= 1.375) return 'Levemente ativo';
      if (nivel <= 1.55) return 'Moderadamente ativo';
      if (nivel <= 1.725) return 'Muito ativo';
      return 'Extremamente ativo';
    };

    return {
      objetivo,
      sexo,
      idade,
      alturaCm,
      pesoEmKg,
      imc,
      imcFormatado: imc.toFixed(1),
      classificacaoIMC,
      pesoIdealMin: pesoMinimo,
      pesoIdealMax: pesoMaximo,
      percentualGordura,
      percentualGorduraFormatado: percentualGordura.toFixed(1),
      classificacaoBF,
      massaGordaKg,
      massaMagraKg,
      tmb,
      tmbFormatado: tmb.toFixed(0),
      tdee,
      tdeeFormatado: tdee.toFixed(0),
      nivelAtividade: atividadeNum,
      nivelAtividadeDescricao: getNivelAtividadeDescricao(atividadeNum),
      calorias,
      proteina,
      carboidratos,
      gorduras,
      aguaRecomendadaLitros,
      aguaRecomendadaFormatada: aguaRecomendadaLitros.toFixed(1),
      coposAguaRecomendados,
      querLembretesAgua,
      frequenciaTreino,
      treinaAtualmente: dados.treinaAtualmente,
      tempoMeta,
      frequenciaCardio: dados.frequenciaCardio,
      frequenciaCardioDescricao: dados.frequenciaCardioDescricao,
      dataCalculo: new Date().toISOString()
    };
  };

  const converterParaCm = (ft: number, inches: number): number => {
    return (ft * 30.48) + (inches * 2.54);
  };

  const handleComecar = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    try {
      await AsyncStorage.setItem('@onboardingCompleto', 'true');
      await AsyncStorage.setItem('@ultimaAnalise', JSON.stringify({
        data: new Date().toISOString(),
        metricas: metricas
      }));
      router.replace('/CadastroScreen');
    } catch (error) {
      console.error('Erro ao finalizar onboarding:', error);
      Alert.alert('Erro', 'Não foi possível finalizar.');
    }
  };

  const handleEditar = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push('/ObjetivoScreen');
  };

  const spin = rotacao.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  // Renderizar elementos de fundo decorativos (igual à tela de preparação)
  const renderBackground = () => (
    <View style={styles.backgroundOrbits}>
      <Animated.View 
        style={[
          styles.orbitLine, 
          { 
            width: width * 1.3, 
            height: width * 1.3, 
            top: -width * 0.3, 
            right: -width * 0.3,
            transform: [{ rotate: spin }] 
          }
        ]} 
      />
      <Animated.View 
        style={[
          styles.orbitLine, 
          { 
            width: width * 1.6, 
            height: width * 1.6, 
            bottom: -width * 0.5, 
            left: -width * 0.5,
            transform: [{ rotate: spin }] 
          }
        ]} 
      />
      <View style={[styles.orbitDot, { top: '15%', right: '10%' }]} />
      <View style={[styles.orbitDot, { bottom: '20%', left: '5%' }]} />
      <View style={[styles.orbitDot, { top: '30%', left: '15%' }]} />
    </View>
  );

  if (isLoading) {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
        {renderBackground()}
        <View style={styles.loadingContainer}>
          <View style={styles.loadingContent}>
            <View style={styles.visualContainer}>
              <Animated.View style={[styles.radarCircle, { transform: [{ rotate: spin }] }]} />
              <Animated.View style={[styles.pulseCircle, { transform: [{ scale: new Animated.Value(1) }] }]} />
              <View style={styles.iconBox}>
                <LinearGradient colors={[COLORS.secondary, COLORS.primary]} style={styles.gradient}>
                  <FontAwesome name="heartbeat" size={36} color="#FFF" />
                </LinearGradient>
              </View>
            </View>
            <Text style={styles.loadingTitle}>Preparando sua análise</Text>
            <Text style={styles.loadingSubtitle}>Estamos calculando todas as métricas...</Text>
          </View>
        </View>
      </View>
    );
  }

  if (!metricas) {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
        {renderBackground()}
        <View style={styles.errorContainer}>
          <View style={styles.errorCard}>
            <FontAwesome name="exclamation-triangle" size={60} color={COLORS.warning} />
            <Text style={styles.errorTitle}>Ops!</Text>
            <Text style={styles.errorText}>Não foi possível carregar seus dados.</Text>
            <Pressable style={styles.errorButton} onPress={carregarTodosDadosECalcular}>
              <LinearGradient
                colors={[COLORS.secondary, COLORS.primary]}
                style={styles.errorButtonGradient}
              >
                <Text style={styles.errorButtonText}>Tentar Novamente</Text>
              </LinearGradient>
            </Pressable>
          </View>
        </View>
      </View>
    );
  }

  const MacroCard = ({ macro, icon }: any) => (
    <LinearGradient
      colors={[`${macro.cor}15`, `${macro.cor}05`]}
      style={styles.macroCard}
    >
      <View style={[styles.macroIconContainer, { backgroundColor: `${macro.cor}30` }]}>
        <FontAwesome name={macro.icon || icon} size={20} color={macro.cor} />
      </View>
      <Text style={styles.macroLabel}>{macro.descricao.split(' ')[0]}</Text>
      <Text style={[styles.macroValue, { color: macro.cor }]}>
        {macro.min.toFixed(0)}-{macro.max.toFixed(0)}g
      </Text>
      <Text style={styles.macroSub}>{macro.gPorKg}</Text>
    </LinearGradient>
  );

  const ProgressCircle = ({ value, max, color, label }: any) => {
    const percentage = (value / max) * 100;
    
    return (
      <View style={styles.progressCircleContainer}>
        <View style={styles.progressCircleWrapper}>
          <View style={[styles.progressCircleBg, { backgroundColor: `${color}20` }]} />
          <View style={[styles.progressCircleFill, { 
            borderColor: color,
            transform: [{ rotate: `${-90 + (percentage * 3.6)}deg` }]
          }]} />
          <View style={styles.progressCircleInner}>
            <Text style={[styles.progressCircleValue, { color }]}>{value.toFixed(1)}%</Text>
            <Text style={styles.progressCircleLabel}>{label}</Text>
          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
      
      {renderBackground()}

      {/* Header minimalista */}
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
        {/* Hero Section com Logo */}
        <Animated.View style={[styles.heroSection, { transform: [{ scale: scaleAnim }] }]}>
          <Image 
            source={require('../../assets/images/logo-sem-fundo1.png')} 
            style={styles.heroLogo}
            resizeMode="contain"
          />

          <Text style={styles.heroTitle}>🔥 SUA ANÁLISE COMPLETA</Text>
          <Text style={styles.heroSubtitle}>
            Tudo que você precisa saber sobre seu corpo em um só lugar
          </Text>

          <View style={styles.heroBadge}>
            <FontAwesome name="check-circle" size={16} color={COLORS.success} />
            <Text style={styles.heroBadgeText}>
              Dados calculados com precisão
            </Text>
          </View>
        </Animated.View>

        {/* Cards de Resumo Rápido */}
        <View style={styles.quickStats}>
          <LinearGradient
            colors={[`${metricas.classificacaoIMC.cor}20`, `${metricas.classificacaoIMC.cor}05`]}
            style={styles.quickStatCard}
          >
            <Text style={styles.quickStatLabel}>IMC</Text>
            <Text style={[styles.quickStatValue, { color: metricas.classificacaoIMC.cor }]}>
              {metricas.imcFormatado}
            </Text>
            <Text style={styles.quickStatSub}>{metricas.classificacaoIMC.classificacao}</Text>
          </LinearGradient>

          <LinearGradient
            colors={[`${metricas.classificacaoBF.cor}20`, `${metricas.classificacaoBF.cor}05`]}
            style={styles.quickStatCard}
          >
            <Text style={styles.quickStatLabel}>BF%</Text>
            <Text style={[styles.quickStatValue, { color: metricas.classificacaoBF.cor }]}>
              {metricas.percentualGorduraFormatado}%
            </Text>
            <Text style={styles.quickStatSub}>{metricas.classificacaoBF.classificacao}</Text>
          </LinearGradient>

          <LinearGradient
            colors={[`${metricas.calorias.cor}20`, `${metricas.calorias.cor}05`]}
            style={styles.quickStatCard}
          >
            <Text style={styles.quickStatLabel}>Meta</Text>
            <Text style={[styles.quickStatValue, { color: metricas.calorias.cor }]}>
              {metricas.calorias.objetivo.toFixed(0)}
            </Text>
            <Text style={styles.quickStatSub}>kcal/dia</Text>
          </LinearGradient>
        </View>

        {/* Peso Ideal - AGORA EM PRIMEIRO LUGAR */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>⚖️ Peso Ideal</Text>
            <View style={[styles.sectionLine, { backgroundColor: COLORS.success }]} />
          </View>

          <View style={styles.pesoIdealGrid}>
            <LinearGradient colors={['#2196F315', '#2196F305']} style={styles.pesoIdealCard}>
              <Text style={styles.pesoIdealLabel}>Mínimo</Text>
              <Text style={styles.pesoIdealValue}>{metricas.pesoIdealMin.toFixed(1)}</Text>
              <Text style={styles.pesoIdealUnit}>kg</Text>
            </LinearGradient>

            <LinearGradient colors={['#4CAF5015', '#4CAF5005']} style={styles.pesoIdealCardDestaque}>
              <Text style={styles.pesoIdealLabel}>Ideal</Text>
              <Text style={styles.pesoIdealValueDestaque}>
                {((metricas.pesoIdealMin + metricas.pesoIdealMax) / 2).toFixed(1)}
              </Text>
              <Text style={styles.pesoIdealUnit}>kg</Text>
            </LinearGradient>

            <LinearGradient colors={['#FF980015', '#FF980005']} style={styles.pesoIdealCard}>
              <Text style={styles.pesoIdealLabel}>Máximo</Text>
              <Text style={styles.pesoIdealValue}>{metricas.pesoIdealMax.toFixed(1)}</Text>
              <Text style={styles.pesoIdealUnit}>kg</Text>
            </LinearGradient>
          </View>

          <LinearGradient
            colors={
              metricas.pesoEmKg > metricas.pesoIdealMax ?
                [`${COLORS.danger}20`, `${COLORS.danger}05`] :
                metricas.pesoEmKg < metricas.pesoIdealMin ?
                  [`${COLORS.info}20`, `${COLORS.info}05`] :
                  [`${COLORS.success}20`, `${COLORS.success}05`]
            }
            style={styles.pesoAtualCard}
          >
            <View style={styles.pesoAtualHeader}>
              <FontAwesome 
                name="balance-scale" 
                size={20} 
                color={
                  metricas.pesoEmKg > metricas.pesoIdealMax ? COLORS.danger :
                  metricas.pesoEmKg < metricas.pesoIdealMin ? COLORS.info : COLORS.success
                } 
              />
              <Text style={styles.pesoAtualLabel}>Seu peso atual</Text>
            </View>
            <Text style={styles.pesoAtualValue}>{metricas.pesoEmKg.toFixed(1)} kg</Text>

            <View style={styles.pesoDiferenca}>
              <FontAwesome
                name={metricas.pesoEmKg > metricas.pesoIdealMax ? "arrow-up" :
                  metricas.pesoEmKg < metricas.pesoIdealMin ? "arrow-down" : "check"}
                size={14}
                color={metricas.pesoEmKg > metricas.pesoIdealMax ? COLORS.danger :
                  metricas.pesoEmKg < metricas.pesoIdealMin ? COLORS.info : COLORS.success}
              />
              <Text style={[styles.pesoDiferencaText, {
                color: metricas.pesoEmKg > metricas.pesoIdealMax ? COLORS.danger :
                  metricas.pesoEmKg < metricas.pesoIdealMin ? COLORS.info : COLORS.success
              }]}>
                {metricas.pesoEmKg > metricas.pesoIdealMax ?
                  `${(metricas.pesoEmKg - metricas.pesoIdealMax).toFixed(1)}kg acima do máximo` :
                  metricas.pesoEmKg < metricas.pesoIdealMin ?
                    `${(metricas.pesoIdealMin - metricas.pesoEmKg).toFixed(1)}kg abaixo do mínimo` :
                    '🎯 Você está no peso ideal!'}
              </Text>
            </View>
          </LinearGradient>
        </View>

        {/* Composição Corporal */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>🧬 Composição Corporal</Text>
            <View style={[styles.sectionLine, { backgroundColor: COLORS.secondary }]} />
          </View>

          <View style={styles.composicaoContainer}>
            <ProgressCircle 
              value={metricas.percentualGordura}
              max={metricas.sexo === 'masculino' ? 35 : 45}
              color={metricas.classificacaoBF.cor}
              label="BF"
            />

            <View style={styles.composicaoBars}>
              <View style={styles.composicaoItem}>
                <View style={styles.composicaoLabelContainer}>
                  <Text style={styles.composicaoLabel}>Massa Magra</Text>
                  <Text style={styles.composicaoValue}>{metricas.massaMagraKg.toFixed(1)} kg</Text>
                </View>
                <View style={styles.composicaoBarBg}>
                  <View
                    style={[
                      styles.composicaoBarFill,
                      {
                        width: `${(metricas.massaMagraKg / metricas.pesoEmKg) * 100}%`,
                        backgroundColor: COLORS.info
                      }
                    ]}
                  />
                </View>
                <Text style={styles.composicaoPercentage}>
                  {((metricas.massaMagraKg / metricas.pesoEmKg) * 100).toFixed(1)}%
                </Text>
              </View>

              <View style={styles.composicaoItem}>
                <View style={styles.composicaoLabelContainer}>
                  <Text style={styles.composicaoLabel}>Massa Gorda</Text>
                  <Text style={styles.composicaoValue}>{metricas.massaGordaKg.toFixed(1)} kg</Text>
                </View>
                <View style={styles.composicaoBarBg}>
                  <View
                    style={[
                      styles.composicaoBarFill,
                      {
                        width: `${(metricas.massaGordaKg / metricas.pesoEmKg) * 100}%`,
                        backgroundColor: COLORS.warning
                      }
                    ]}
                  />
                </View>
                <Text style={styles.composicaoPercentage}>
                  {metricas.percentualGordura.toFixed(1)}%
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Metabolismo */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>⚡ Metabolismo</Text>
            <View style={[styles.sectionLine, { backgroundColor: COLORS.primary }]} />
          </View>

          <View style={styles.metabolismoGrid}>
            <LinearGradient colors={[`${COLORS.purple}15`, `${COLORS.purple}05`]} style={styles.metabolismoCard}>
              <View style={[styles.metabolismoIcon, { backgroundColor: `${COLORS.purple}30` }]}>
                <FontAwesome name="bed" size={20} color={COLORS.purple} />
              </View>
              <Text style={styles.metabolismoLabel}>TMB</Text>
              <Text style={[styles.metabolismoValue, { color: COLORS.purple }]}>{metricas.tmbFormatado}</Text>
              <Text style={styles.metabolismoUnit}>kcal</Text>
            </LinearGradient>

            <LinearGradient colors={[`${COLORS.pink}15`, `${COLORS.pink}05`]} style={styles.metabolismoCard}>
              <View style={[styles.metabolismoIcon, { backgroundColor: `${COLORS.pink}30` }]}>
                <FontAwesome name="bicycle" size={20} color={COLORS.pink} />
              </View>
              <Text style={styles.metabolismoLabel}>TDEE</Text>
              <Text style={[styles.metabolismoValue, { color: COLORS.pink }]}>{metricas.tdeeFormatado}</Text>
              <Text style={styles.metabolismoUnit}>kcal</Text>
            </LinearGradient>
          </View>

          <LinearGradient
            colors={[`${metricas.calorias.cor}20`, `${metricas.calorias.cor}05`]}
            style={styles.caloriasCard}
          >
            <View style={styles.caloriasHeader}>
              <FontAwesome name="cutlery" size={20} color={metricas.calorias.cor} />
              <Text style={[styles.caloriasMeta, { color: metricas.calorias.cor }]}>
                {metricas.calorias.meta}
              </Text>
            </View>

            <Text style={styles.caloriasValue}>{metricas.calorias.objetivo.toFixed(0)}</Text>
            <Text style={styles.caloriasUnit}>kcal/dia</Text>

            <View style={styles.caloriasComparison}>
              <View style={styles.caloriasCompareItem}>
                <Text style={styles.caloriasCompareLabel}>Manutenção</Text>
                <Text style={styles.caloriasCompareValue}>
                  {metricas.calorias.manutencao.toFixed(0)}
                </Text>
              </View>
              <FontAwesome name="arrow-right" size={14} color={COLORS.textLight} />
              <View style={styles.caloriasCompareItem}>
                <Text style={styles.caloriasCompareLabel}>Sua meta</Text>
                <Text style={[styles.caloriasCompareValue, { color: metricas.calorias.cor }]}>
                  {metricas.calorias.objetivo.toFixed(0)}
                </Text>
              </View>
            </View>
          </LinearGradient>
        </View>

        {/* Macronutrientes */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>🥩 Macronutrientes</Text>
            <View style={[styles.sectionLine, { backgroundColor: COLORS.success }]} />
          </View>

          <View style={styles.macrosGrid}>
            <MacroCard macro={metricas.proteina} />
            <MacroCard macro={metricas.carboidratos} />
            <MacroCard macro={metricas.gorduras} />
          </View>
        </View>

        {/* Mensagem Final */}
        <View style={styles.finalMessage}>
          <Text style={styles.finalMessageText}>
            "O sucesso é a soma de pequenos esforços repetidos dia após dia."
          </Text>
          <Text style={styles.finalMessageAuthor}>- Robert Collier</Text>
        </View>

        {/* Espaço extra no final */}
        <View style={styles.bottomSpacing} />
      </Animated.ScrollView>

      {/* Botão Flutuante "Começar Jornada" */}
      <SafeAreaView style={styles.floatingButtonContainer}>
        <Pressable style={styles.floatingButton} onPress={handleComecar}>
          <LinearGradient
            colors={[COLORS.secondary, COLORS.primary]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.floatingGradient}
          >
            <FontAwesome name="bolt" size={24} color="#FFF" />
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
    backgroundColor: '#FFFFFF',
  },
  // Elementos decorativos de fundo (órbitas)
  backgroundOrbits: {
    ...StyleSheet.absoluteFillObject,
    overflow: 'hidden',
    zIndex: 0,
  },
  orbitLine: {
    position: 'absolute',
    borderWidth: 1.5,
    borderColor: COLORS.line,
    borderRadius: 999,
  },
  orbitDot: {
    position: 'absolute',
    width: 8,
    height: 8,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: COLORS.dot,
    backgroundColor: '#FFFFFF',
  },
  // Header
  headerSafeArea: {
    zIndex: 100,
    backgroundColor: 'transparent',
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 50 : StatusBar.currentHeight ? StatusBar.currentHeight + 10 : 40,
    paddingBottom: 15,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
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
    shadowRadius: 4,
  },
  backText: {
    color: COLORS.primary,
    marginLeft: 10,
    fontWeight: '700',
    fontSize: 16,
  },
  // Loading
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingContent: {
    alignItems: 'center',
  },
  visualContainer: {
    height: 130,
    width: 130,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  radarCircle: {
    position: 'absolute',
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 1.5,
    borderColor: COLORS.dot,
    borderStyle: 'dashed',
    opacity: 0.4,
  },
  pulseCircle: {
    position: 'absolute',
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: 'rgba(78, 205, 196, 0.15)',
  },
  iconBox: {
    width: 70,
    height: 70,
    borderRadius: 35,
    elevation: 6,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  gradient: {
    flex: 1,
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.textMain,
    marginTop: 20,
    marginBottom: 8,
  },
  loadingSubtitle: {
    fontSize: 14,
    color: COLORS.textLight,
    textAlign: 'center',
  },
  // Error
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 40,
    alignItems: 'center',
    width: '100%',
    maxWidth: 400,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  errorTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.textMain,
    marginTop: 16,
    marginBottom: 8,
  },
  errorText: {
    fontSize: 16,
    color: COLORS.textLight,
    textAlign: 'center',
    marginBottom: 24,
  },
  errorButton: {
    width: '100%',
    borderRadius: 30,
    overflow: 'hidden',
  },
  errorButtonGradient: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  errorButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  // ScrollView
  scrollView: {
    flex: 1,
    zIndex: 10,
  },
  scrollContent: {
    paddingBottom: 100,
    paddingHorizontal: 20,
  },
  // Hero Section
  heroSection: {
    alignItems: 'center',
    marginBottom: 24,
    marginTop: 10,
  },
  heroLogo: {
    width: 180,
    height: 100,
    marginBottom: 10,
  },
  heroTitle: {
    fontSize: 24,
    fontWeight: '900',
    color: COLORS.primary,
    textAlign: 'center',
    marginBottom: 8,
    letterSpacing: 1,
  },
  heroSubtitle: {
    fontSize: 16,
    color: COLORS.textLight,
    textAlign: 'center',
    marginBottom: 15,
    paddingHorizontal: 20,
  },
  heroBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.success + '15',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 30,
    gap: 8,
  },
  heroBadgeText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.success,
  },
  // Quick Stats
  quickStats: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 24,
  },
  quickStatCard: {
    flex: 1,
    padding: 14,
    borderRadius: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.line,
  },
  quickStatLabel: {
    fontSize: 12,
    color: COLORS.textLight,
    fontWeight: '600',
    marginBottom: 4,
  },
  quickStatValue: {
    fontSize: 20,
    fontWeight: '800',
    marginBottom: 2,
  },
  quickStatSub: {
    fontSize: 10,
    color: COLORS.textSub,
    textAlign: 'center',
  },
  // Sections
  section: {
    marginBottom: 28,
  },
  sectionHeader: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: COLORS.textMain,
    marginBottom: 6,
  },
  sectionLine: {
    width: 50,
    height: 4,
    borderRadius: 2,
  },
  // Composição Corporal
  composicaoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  progressCircleContainer: {
    width: 100,
    alignItems: 'center',
  },
  progressCircleWrapper: {
    width: 100,
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressCircleBg: {
    position: 'absolute',
    width: 90,
    height: 90,
    borderRadius: 45,
    opacity: 0.3,
  },
  progressCircleFill: {
    position: 'absolute',
    width: 90,
    height: 90,
    borderRadius: 45,
    borderWidth: 8,
    borderLeftColor: 'transparent',
    borderBottomColor: 'transparent',
  },
  progressCircleInner: {
    alignItems: 'center',
  },
  progressCircleValue: {
    fontSize: 18,
    fontWeight: '800',
  },
  progressCircleLabel: {
    fontSize: 10,
    color: COLORS.textSub,
    marginTop: 2,
  },
  composicaoBars: {
    flex: 1,
    gap: 12,
  },
  composicaoItem: {
    gap: 4,
  },
  composicaoLabelContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  composicaoLabel: {
    fontSize: 13,
    color: COLORS.textLight,
    fontWeight: '500',
  },
  composicaoValue: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.textMain,
  },
  composicaoBarBg: {
    height: 6,
    backgroundColor: '#E9EDF2',
    borderRadius: 3,
    overflow: 'hidden',
  },
  composicaoBarFill: {
    height: '100%',
    borderRadius: 3,
  },
  composicaoPercentage: {
    fontSize: 11,
    color: COLORS.textSub,
    textAlign: 'right',
  },
  // Metabolismo
  metabolismoGrid: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  metabolismoCard: {
    flex: 1,
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
    gap: 8,
    borderWidth: 1,
    borderColor: COLORS.line,
  },
  metabolismoIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  metabolismoLabel: {
    fontSize: 13,
    color: COLORS.textLight,
    fontWeight: '600',
  },
  metabolismoValue: {
    fontSize: 22,
    fontWeight: '800',
  },
  metabolismoUnit: {
    fontSize: 11,
    color: COLORS.textSub,
  },
  // Calorias
  caloriasCard: {
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.line,
  },
  caloriasHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 12,
  },
  caloriasMeta: {
    fontSize: 16,
    fontWeight: '700',
  },
  caloriasValue: {
    fontSize: 40,
    fontWeight: '800',
    color: COLORS.textMain,
  },
  caloriasUnit: {
    fontSize: 14,
    color: COLORS.textLight,
    marginBottom: 12,
  },
  caloriasComparison: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: COLORS.line,
  },
  caloriasCompareItem: {
    alignItems: 'center',
  },
  caloriasCompareLabel: {
    fontSize: 12,
    color: COLORS.textLight,
    marginBottom: 2,
  },
  caloriasCompareValue: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.textMain,
  },
  // Macros
  macrosGrid: {
    flexDirection: 'row',
    gap: 10,
  },
  macroCard: {
    flex: 1,
    padding: 14,
    borderRadius: 16,
    alignItems: 'center',
    gap: 6,
    borderWidth: 1,
    borderColor: COLORS.line,
  },
  macroIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  macroLabel: {
    fontSize: 12,
    color: COLORS.textLight,
    fontWeight: '600',
  },
  macroValue: {
    fontSize: 13,
    fontWeight: '700',
    textAlign: 'center',
  },
  macroSub: {
    fontSize: 9,
    color: COLORS.textSub,
  },
  // Peso Ideal
  pesoIdealGrid: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 16,
  },
  pesoIdealCard: {
    flex: 1,
    padding: 14,
    borderRadius: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.line,
  },
  pesoIdealCardDestaque: {
    flex: 1,
    padding: 14,
    borderRadius: 16,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: COLORS.success,
    backgroundColor: COLORS.success + '10',
  },
  pesoIdealLabel: {
    fontSize: 11,
    color: COLORS.textLight,
    fontWeight: '600',
    marginBottom: 4,
  },
  pesoIdealValue: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.textMain,
  },
  pesoIdealValueDestaque: {
    fontSize: 20,
    fontWeight: '900',
    color: COLORS.success,
  },
  pesoIdealUnit: {
    fontSize: 10,
    color: COLORS.textSub,
  },
  pesoAtualCard: {
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.line,
  },
  pesoAtualHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  pesoAtualLabel: {
    fontSize: 14,
    color: COLORS.textLight,
  },
  pesoAtualValue: {
    fontSize: 26,
    fontWeight: '800',
    color: COLORS.textMain,
    marginBottom: 8,
  },
  pesoDiferenca: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  pesoDiferencaText: {
    fontSize: 13,
    fontWeight: '600',
  },
  // Mensagem Final
  finalMessage: {
    marginTop: 20,
    alignItems: 'center',
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: COLORS.line,
  },
  finalMessageText: {
    fontSize: 14,
    color: COLORS.textLight,
    fontStyle: 'italic',
    textAlign: 'center',
    lineHeight: 20,
  },
  finalMessageAuthor: {
    fontSize: 12,
    color: COLORS.textSub,
    marginTop: 4,
  },
  bottomSpacing: {
    height: 20,
  },
  // Botão Flutuante
  floatingButtonContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    paddingBottom: Platform.OS === 'ios' ? 70 : 60,
    backgroundColor: 'transparent',
    pointerEvents: 'box-none',
    zIndex: 100,
  },
  floatingButton: {
    borderRadius: 30,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: COLORS.primary,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.3,
        shadowRadius: 12,
      },
      android: {
        elevation: 10,
      },
    }),
  },
  floatingGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    gap: 12,
  },
  floatingText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '800',
    letterSpacing: -0.3,
  },
});