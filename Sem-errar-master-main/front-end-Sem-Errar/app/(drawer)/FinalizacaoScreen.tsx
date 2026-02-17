import FontAwesome from '@expo/vector-icons/FontAwesome';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  View,
} from 'react-native';

const { width } = Dimensions.get('window');

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

export default function FinalizacaoScreen() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [metricas, setMetricas] = useState<Metricas | null>(null);
  const [expandedSections, setExpandedSections] = useState({
    perfil: true,
    imc: true,
    pesoIdeal: false,
    composicao: true,
    metabolismo: true,
    macros: false,
    hidratacao: false,
    treino: false,
    dicas: true,
  });

  useEffect(() => {
    carregarTodosDadosECalcular();
  }, []);

  const toggleSection = (section: keyof typeof expandedSections) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

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
        classificacao: 'Peso Ideal',
        cor: '#4CAF50',
        descricao: 'Peso saudável',
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
        descricao: 'Obesidade',
        emoji: '⛔',
        gradiente: ['#D32F2F', '#B71C1C']
      };
    };

    const classificacaoIMC = getClassificacaoIMC(imc);
    const pesoMinimo = 18.5 * (alturaMetros * alturaMetros);
    const pesoMaximo = 24.9 * (alturaMetros * alturaMetros);

    const calcularPercentualGordura = (): number => {
      if (pescocoCm > 0 && cinturaCm > 0) {
        const alturaInches = alturaCm * 0.393701;
        const cinturaInches = cinturaCm * 0.393701;
        const pescocoInches = pescocoCm * 0.393701;

        if (sexo === 'masculino') {
          const logAltura = Math.log10(alturaInches);
          const logCinturaMenosPescoco = Math.log10(cinturaInches - pescocoInches);
          const bf = 495 / (1.0324 - 0.19077 * logCinturaMenosPescoco + 0.15456 * logAltura) - 450;
          return Math.max(5, Math.min(bf, 50));
        } else {
          if (quadrilCm && quadrilCm > 0) {
            const quadrilInches = quadrilCm * 0.393701;
            const logAltura = Math.log10(alturaInches);
            const logSoma = Math.log10(cinturaInches + quadrilInches - pescocoInches);
            const bf = 495 / (1.29579 - 0.35004 * logSoma + 0.22100 * logAltura) - 450;
            return Math.max(10, Math.min(bf, 60));
          }
        }
      }
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
      if (sexo === 'feminino') {
        return 447.593 + (9.247 * pesoEmKg) + (3.098 * alturaCm) - (4.330 * idade);
      } else {
        return 88.362 + (13.397 * pesoEmKg) + (4.799 * alturaCm) - (5.677 * idade);
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
      // ALTERADO: Redirecionar para CadastroScreen em vez de (drawer)
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

  const handleCompartilhar = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    try {
      const resultado = await Share.share({
        message: `🎯 Minha análise Fitness Analytics:\n\n` +
          `📊 IMC: ${metricas?.imcFormatado} (${metricas?.classificacaoIMC.classificacao})\n` +
          `🔥 BF: ${metricas?.percentualGorduraFormatado}% (${metricas?.classificacaoBF.classificacao})\n` +
          `⚡ TDEE: ${metricas?.tdeeFormatado} kcal/dia\n` +
          `💪 Meta: ${metricas?.calorias.meta}`,
        title: 'Minha Análise Fitness'
      });
    } catch (error) {
      console.error('Erro ao compartilhar:', error);
    }
  };

  // Função utilitária para garantir cores válidas no gradiente
  const getGradientColors = (color1?: string, color2?: string): [string, string] => {
    const c1 = color1 || '#CCCCCC';
    const c2 = color2 || c1;
    return [c1, c2];
  };

  // Função para cores com opacidade
  const getGradientColorsWithOpacity = (color1?: string, color2?: string, opacity: string = '20'): [string, string] => {
    const c1 = color1 || '#CCCCCC';
    const c2 = color2 || c1;
    return [`${c1}${opacity}`, `${c2}10`];
  };

  if (isLoading) {
    return (
      <LinearGradient
        colors={getGradientColors('#1E88E5', '#1565C0')}
        style={styles.loadingGradient}
      >
        <View style={styles.loadingContainer}>
          <View style={styles.loadingCard}>
            <ActivityIndicator size="large" color="#1E88E5" />
            <Text style={styles.loadingTitle}>Preparando sua análise</Text>
            <Text style={styles.loadingSubtitle}>Estamos calculando todas as métricas...</Text>
          </View>
        </View>
      </LinearGradient>
    );
  }

  if (!metricas) {
    return (
      <View style={styles.errorContainer}>
        <View style={styles.errorCard}>
          <FontAwesome name="exclamation-triangle" size={60} color="#FF9800" />
          <Text style={styles.errorTitle}>Ops!</Text>
          <Text style={styles.errorText}>Não foi possível carregar seus dados.</Text>
          <Pressable style={styles.errorButton} onPress={carregarTodosDadosECalcular}>
            <LinearGradient
              colors={getGradientColors('#1E88E5', '#1565C0')}
              style={styles.errorButtonGradient}
            >
              <Text style={styles.errorButtonText}>Tentar Novamente</Text>
            </LinearGradient>
          </Pressable>
        </View>
      </View>
    );
  }

  const SectionHeader = ({
    title,
    icon,
    color,
    section,
    badge
  }: {
    title: string;
    icon: string;
    color: string;
    section: keyof typeof expandedSections;
    badge?: string;
  }) => (
    <Pressable
      style={styles.sectionHeader}
      onPress={() => toggleSection(section)}
    >
      <View style={styles.sectionHeaderLeft}>
        <View style={[styles.sectionIcon, { backgroundColor: color + '20' }]}>
          <FontAwesome name={icon as any} size={18} color={color} />
        </View>
        <Text style={styles.sectionTitle}>{title}</Text>
        {badge && (
          <View style={[styles.sectionBadge, { backgroundColor: color + '20' }]}>
            <Text style={[styles.sectionBadgeText, { color }]}>{badge}</Text>
          </View>
        )}
      </View>
      <FontAwesome
        name={expandedSections[section] ? 'chevron-up' : 'chevron-down'}
        size={16}
        color="#999"
      />
    </Pressable>
  );

  const MetricCard = ({ title, value, unit, subtitle, color, emoji, gradient }: any) => {
    const safeColor = color || '#CCCCCC';
    const gradientColors = gradient && gradient.length === 2
      ? getGradientColorsWithOpacity(gradient[0], gradient[1], '20')
      : getGradientColorsWithOpacity(safeColor, safeColor, '20');

    return (
      <LinearGradient
        colors={gradientColors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.metricCard, { borderColor: safeColor + '30' }]}
      >
        <View style={styles.metricHeader}>
          {emoji && <Text style={styles.metricEmoji}>{emoji}</Text>}
          <Text style={[styles.metricTitle, { color: safeColor }]}>{title}</Text>
        </View>
        <View style={styles.metricValueContainer}>
          <Text style={[styles.metricValue, { color: safeColor }]}>{value}</Text>
          {unit && <Text style={styles.metricUnit}>{unit}</Text>}
        </View>
        {subtitle && <Text style={styles.metricSubtitle}>{subtitle}</Text>}
      </LinearGradient>
    );
  };

  const ProgressBar = ({ value, min, max, color, label, showValue = true }: any) => {
    const percentage = ((value - min) / (max - min)) * 100;
    const clampedPercentage = Math.max(0, Math.min(100, percentage));

    return (
      <View style={styles.progressContainer}>
        {label && <Text style={styles.progressLabel}>{label}</Text>}
        <View style={styles.progressBarBackground}>
          <View style={[styles.progressBarFill, { width: `${clampedPercentage}%`, backgroundColor: color || '#CCCCCC' }]} />
        </View>
        {showValue && <Text style={[styles.progressValue, { color: color || '#CCCCCC' }]}>{value.toFixed(1)}</Text>}
      </View>
    );
  };

  const TipCard = ({ icon, title, text, color }: any) => {
    const safeColor = color || '#CCCCCC';
    return (
      <LinearGradient
        colors={getGradientColorsWithOpacity(safeColor, safeColor, '10')}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.tipCard, { borderColor: safeColor + '20' }]}
      >
        <View style={[styles.tipIconContainer, { backgroundColor: safeColor + '20' }]}>
          <FontAwesome name={icon} size={20} color={safeColor} />
        </View>
        <View style={styles.tipContent}>
          <Text style={[styles.tipTitle, { color: safeColor }]}>{title}</Text>
          <Text style={styles.tipText}>{text}</Text>
        </View>
      </LinearGradient>
    );
  };

  return (
    <View style={styles.background}>
      <LinearGradient
        colors={getGradientColors('#1E88E5', '#1565C0')}
        style={styles.headerGradient}
      >
        <View style={styles.headerContent}>
          <Pressable style={styles.headerBackButton} onPress={handleEditar}>
            <FontAwesome name="arrow-left" size={18} color="#FFF" />
            <Text style={styles.headerBackText}>Editar</Text>
          </Pressable>
          <Text style={styles.headerTitle}>Análise Completa</Text>
          <Pressable style={styles.headerShareButton} onPress={handleCompartilhar}>
            <FontAwesome name="share-alt" size={18} color="#FFF" />
          </Pressable>
        </View>
      </LinearGradient>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.mainCard}>
          {/* Avatar e Título */}
          <View style={styles.heroSection}>
            <LinearGradient
              colors={getGradientColors('#1E88E5', '#1565C0')}
              style={styles.heroIconContainer}
            >
              <FontAwesome name="trophy" size={40} color="#FFF" />
            </LinearGradient>

            <Text style={styles.heroTitle}>
              {metricas.objetivo === 'emagrecer' ? '🎯 Plano de Emagrecimento' :
                metricas.objetivo === 'ganhar_massa' ? '💪 Plano de Ganho Muscular' :
                  '⚖️ Plano de Manutenção'}
            </Text>

            <View style={styles.heroBadge}>
              <FontAwesome name="clock-o" size={14} color="#FF9800" />
              <Text style={styles.heroBadgeText}>
                Meta em: {metricas.tempoMeta}
              </Text>
            </View>
          </View>

          {/* Perfil */}
          <View style={styles.section}>
            <SectionHeader
              title="Perfil"
              icon="user-circle"
              color="#1E88E5"
              section="perfil"
            />

            {expandedSections.perfil && (
              <View style={styles.profileGrid}>
                <View style={styles.profileItem}>
                  <View style={[styles.profileIcon, { backgroundColor: '#1E88E520' }]}>
                    <FontAwesome name={metricas.sexo === 'feminino' ? "venus" : "mars"} size={20} color="#1E88E5" />
                  </View>
                  <Text style={styles.profileLabel}>Sexo</Text>
                  <Text style={styles.profileValue}>
                    {metricas.sexo === 'feminino' ? 'Feminino' : 'Masculino'}
                  </Text>
                </View>

                <View style={styles.profileItem}>
                  <View style={[styles.profileIcon, { backgroundColor: '#1E88E520' }]}>
                    <FontAwesome name="birthday-cake" size={20} color="#1E88E5" />
                  </View>
                  <Text style={styles.profileLabel}>Idade</Text>
                  <Text style={styles.profileValue}>{metricas.idade} anos</Text>
                </View>

                <View style={styles.profileItem}>
                  <View style={[styles.profileIcon, { backgroundColor: '#1E88E520' }]}>
                    <FontAwesome name="arrows-v" size={20} color="#1E88E5" />
                  </View>
                  <Text style={styles.profileLabel}>Altura</Text>
                  <Text style={styles.profileValue}>{metricas.alturaCm} cm</Text>
                </View>

                <View style={styles.profileItem}>
                  <View style={[styles.profileIcon, { backgroundColor: '#1E88E520' }]}>
                    <FontAwesome name="balance-scale" size={20} color="#1E88E5" />
                  </View>
                  <Text style={styles.profileLabel}>Peso</Text>
                  <Text style={styles.profileValue}>{metricas.pesoEmKg.toFixed(1)} kg</Text>
                </View>
              </View>
            )}
          </View>

          {/* IMC */}
          <View style={styles.section}>
            <SectionHeader
              title="Índice de Massa Corporal"
              icon="heartbeat"
              color={metricas.classificacaoIMC.cor}
              section="imc"
              badge={metricas.classificacaoIMC.classificacao}
            />

            {expandedSections.imc && (
              <>
                <MetricCard
                  title="Seu IMC"
                  value={metricas.imcFormatado}
                  subtitle={metricas.classificacaoIMC.descricao}
                  color={metricas.classificacaoIMC.cor}
                  emoji={metricas.classificacaoIMC.emoji}
                  gradient={metricas.classificacaoIMC.gradiente}
                />

                <View style={styles.imcScale}>
                  <ProgressBar
                    value={metricas.imc}
                    min={15}
                    max={40}
                    color={metricas.classificacaoIMC.cor}
                    showValue={false}
                  />

                  <View style={styles.imcLabels}>
                    <Text style={styles.imcLabel}>15</Text>
                    <Text style={styles.imcLabel}>18.5</Text>
                    <Text style={styles.imcLabel}>25</Text>
                    <Text style={styles.imcLabel}>30</Text>
                    <Text style={styles.imcLabel}>35</Text>
                    <Text style={styles.imcLabel}>40</Text>
                  </View>

                  <View style={styles.imcCategories}>
                    <Text style={[styles.imcCategory, { color: '#2196F3' }]}>Baixo</Text>
                    <Text style={[styles.imcCategory, { color: '#4CAF50' }]}>Normal</Text>
                    <Text style={[styles.imcCategory, { color: '#FF9800' }]}>Sobrepeso</Text>
                    <Text style={[styles.imcCategory, { color: '#F44336' }]}>Obesidade</Text>
                  </View>
                </View>
              </>
            )}
          </View>

          {/* Peso Ideal */}
          <View style={styles.section}>
            <SectionHeader
              title="Peso Ideal"
              icon="flag"
              color="#4CAF50"
              section="pesoIdeal"
            />

            {expandedSections.pesoIdeal && (
              <>
                <View style={styles.pesoIdealGrid}>
                  <View style={styles.pesoIdealCard}>
                    <Text style={styles.pesoIdealLabel}>Mínimo</Text>
                    <Text style={styles.pesoIdealValue}>{metricas.pesoIdealMin.toFixed(1)}</Text>
                    <Text style={styles.pesoIdealUnit}>kg</Text>
                    <Text style={styles.pesoIdealSub}>IMC 18.5</Text>
                  </View>

                  <View style={styles.pesoIdealCard}>
                    <Text style={styles.pesoIdealLabel}>Ideal</Text>
                    <Text style={styles.pesoIdealValue}>
                      {((metricas.pesoIdealMin + metricas.pesoIdealMax) / 2).toFixed(1)}
                    </Text>
                    <Text style={styles.pesoIdealUnit}>kg</Text>
                    <Text style={styles.pesoIdealSub}>Médio</Text>
                  </View>

                  <View style={styles.pesoIdealCard}>
                    <Text style={styles.pesoIdealLabel}>Máximo</Text>
                    <Text style={styles.pesoIdealValue}>{metricas.pesoIdealMax.toFixed(1)}</Text>
                    <Text style={styles.pesoIdealUnit}>kg</Text>
                    <Text style={styles.pesoIdealSub}>IMC 24.9</Text>
                  </View>
                </View>

                <LinearGradient
                  colors={
                    metricas.pesoEmKg > metricas.pesoIdealMax ?
                      getGradientColorsWithOpacity('#FF5722', '#FF5722', '20') :
                      metricas.pesoEmKg < metricas.pesoIdealMin ?
                        getGradientColorsWithOpacity('#2196F3', '#2196F3', '20') :
                        getGradientColorsWithOpacity('#4CAF50', '#4CAF50', '20')
                  }
                  style={styles.pesoAtualCard}
                >
                  <Text style={styles.pesoAtualLabel}>Seu peso atual</Text>
                  <Text style={styles.pesoAtualValue}>{metricas.pesoEmKg.toFixed(1)} kg</Text>

                  <View style={styles.pesoDiferenca}>
                    <FontAwesome
                      name={metricas.pesoEmKg > metricas.pesoIdealMax ? "arrow-up" :
                        metricas.pesoEmKg < metricas.pesoIdealMin ? "arrow-down" : "check"}
                      size={16}
                      color={metricas.pesoEmKg > metricas.pesoIdealMax ? "#FF5722" :
                        metricas.pesoEmKg < metricas.pesoIdealMin ? "#2196F3" : "#4CAF50"}
                    />
                    <Text style={[styles.pesoDiferencaText, {
                      color: metricas.pesoEmKg > metricas.pesoIdealMax ? "#FF5722" :
                        metricas.pesoEmKg < metricas.pesoIdealMin ? "#2196F3" : "#4CAF50"
                    }]}>
                      {metricas.pesoEmKg > metricas.pesoIdealMax ?
                        `${(metricas.pesoEmKg - metricas.pesoIdealMax).toFixed(1)}kg acima` :
                        metricas.pesoEmKg < metricas.pesoIdealMin ?
                          `${(metricas.pesoIdealMin - metricas.pesoEmKg).toFixed(1)}kg abaixo` :
                          'Peso ideal!'}
                    </Text>
                  </View>
                </LinearGradient>
              </>
            )}
          </View>

          {/* Composição Corporal */}
          {metricas.percentualGordura > 0 && (
            <View style={styles.section}>
              <SectionHeader
                title="Composição Corporal"
                icon="pie-chart"
                color={metricas.classificacaoBF.cor}
                section="composicao"
                badge={`${metricas.percentualGorduraFormatado}%`}
              />

              {expandedSections.composicao && (
                <>
                  <MetricCard
                    title="Gordura Corporal"
                    value={metricas.percentualGorduraFormatado}
                    unit="%"
                    subtitle={metricas.classificacaoBF.classificacao}
                    color={metricas.classificacaoBF.cor}
                    emoji={metricas.classificacaoBF.emoji}
                    gradient={metricas.classificacaoBF.gradiente}
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
                              backgroundColor: '#2196F3'
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
                              backgroundColor: '#FF9800'
                            }
                          ]}
                        />
                      </View>
                      <Text style={styles.composicaoPercentage}>
                        {metricas.percentualGordura.toFixed(1)}%
                      </Text>
                    </View>
                  </View>

                  <View style={styles.bfScale}>
                    <Text style={styles.bfScaleTitle}>Classificação:</Text>
                    <View style={styles.bfScaleBars}>
                      <View style={[styles.bfScaleBar, { backgroundColor: '#2196F3' }]} />
                      <View style={[styles.bfScaleBar, { backgroundColor: '#4CAF50' }]} />
                      <View style={[styles.bfScaleBar, { backgroundColor: '#8BC34A' }]} />
                      <View style={[styles.bfScaleBar, { backgroundColor: '#FFC107' }]} />
                      <View style={[styles.bfScaleBar, { backgroundColor: '#FF9800' }]} />
                    </View>
                    <View style={styles.bfScaleLabels}>
                      <Text style={styles.bfScaleLabel}>Essencial</Text>
                      <Text style={styles.bfScaleLabel}>Atleta</Text>
                      <Text style={styles.bfScaleLabel}>Fitness</Text>
                      <Text style={styles.bfScaleLabel}>Aceitável</Text>
                      <Text style={styles.bfScaleLabel}>Elevado</Text>
                    </View>
                  </View>
                </>
              )}
            </View>
          )}

          {/* Metabolismo */}
          <View style={styles.section}>
            <SectionHeader
              title="Metabolismo"
              icon="fire"
              color="#FF9800"
              section="metabolismo"
            />

            {expandedSections.metabolismo && (
              <>
                <View style={styles.metabolismoGrid}>
                  <LinearGradient colors={getGradientColorsWithOpacity('#9C27B0', '#9C27B0', '20')} style={styles.metabolismoCard}>
                    <FontAwesome name="bed" size={24} color="#9C27B0" />
                    <Text style={styles.metabolismoLabel}>TMB</Text>
                    <Text style={styles.metabolismoValue}>{metricas.tmbFormatado}</Text>
                    <Text style={styles.metabolismoUnit}>kcal/dia</Text>
                    <Text style={styles.metabolismoSub}>Em repouso</Text>
                  </LinearGradient>

                  <LinearGradient colors={getGradientColorsWithOpacity('#E91E63', '#E91E63', '20')} style={styles.metabolismoCard}>
                    <FontAwesome name="bicycle" size={24} color="#E91E63" />
                    <Text style={styles.metabolismoLabel}>TDEE</Text>
                    <Text style={styles.metabolismoValue}>{metricas.tdeeFormatado}</Text>
                    <Text style={styles.metabolismoUnit}>kcal/dia</Text>
                    <Text style={styles.metabolismoSub}>{metricas.nivelAtividadeDescricao}</Text>
                  </LinearGradient>
                </View>

                <LinearGradient
                  colors={getGradientColorsWithOpacity(
                    metricas.calorias.gradiente?.[0] || metricas.calorias.cor,
                    metricas.calorias.gradiente?.[1] || metricas.calorias.cor,
                    '20'
                  )}
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
                    <FontAwesome name="arrow-right" size={14} color="#999" />
                    <View style={styles.caloriasCompareItem}>
                      <Text style={styles.caloriasCompareLabel}>Sua meta</Text>
                      <Text style={[styles.caloriasCompareValue, { color: metricas.calorias.cor }]}>
                        {metricas.calorias.objetivo.toFixed(0)}
                      </Text>
                    </View>
                  </View>
                </LinearGradient>
              </>
            )}
          </View>

          {/* Macronutrientes */}
          <View style={styles.section}>
            <SectionHeader
              title="Macronutrientes"
              icon="pie-chart"
              color="#4CAF50"
              section="macros"
            />

            {expandedSections.macros && (
              <>
                <View style={styles.macrosGrid}>
                  <LinearGradient
                    colors={getGradientColorsWithOpacity(metricas.proteina.cor, metricas.proteina.cor, '20')}
                    style={[styles.macroCard, { borderColor: metricas.proteina.cor + '30' }]}
                  >
                    <FontAwesome name={metricas.proteina.icon as any} size={28} color={metricas.proteina.cor} />
                    <Text style={styles.macroLabel}>Proteína</Text>
                    <Text style={styles.macroValue}>
                      {metricas.proteina.min.toFixed(0)}-{metricas.proteina.max.toFixed(0)}g
                    </Text>
                    <Text style={styles.macroSub}>{metricas.proteina.gPorKg}</Text>
                  </LinearGradient>

                  <LinearGradient
                    colors={getGradientColorsWithOpacity(metricas.carboidratos.cor, metricas.carboidratos.cor, '20')}
                    style={[styles.macroCard, { borderColor: metricas.carboidratos.cor + '30' }]}
                  >
                    <FontAwesome name={metricas.carboidratos.icon as any} size={28} color={metricas.carboidratos.cor} />
                    <Text style={styles.macroLabel}>Carboidratos</Text>
                    <Text style={styles.macroValue}>
                      {metricas.carboidratos.min.toFixed(0)}-{metricas.carboidratos.max.toFixed(0)}g
                    </Text>
                    <Text style={styles.macroSub}>{metricas.carboidratos.gPorKg}</Text>
                  </LinearGradient>

                  <LinearGradient
                    colors={getGradientColorsWithOpacity(metricas.gorduras.cor, metricas.gorduras.cor, '20')}
                    style={[styles.macroCard, { borderColor: metricas.gorduras.cor + '30' }]}
                  >
                    <FontAwesome name={metricas.gorduras.icon as any} size={28} color={metricas.gorduras.cor} />
                    <Text style={styles.macroLabel}>Gorduras</Text>
                    <Text style={styles.macroValue}>
                      {metricas.gorduras.min.toFixed(0)}-{metricas.gorduras.max.toFixed(0)}g
                    </Text>
                    <Text style={styles.macroSub}>{metricas.gorduras.gPorKg}</Text>
                  </LinearGradient>
                </View>

                {metricas.proteina.recomendacao && (
                  <View style={styles.macroTip}>
                    <FontAwesome name="info-circle" size={16} color={metricas.proteina.cor} />
                    <Text style={styles.macroTipText}>{metricas.proteina.recomendacao}</Text>
                  </View>
                )}
              </>
            )}
          </View>

          {/* Hidratação */}
          <View style={styles.section}>
            <SectionHeader
              title="Hidratação"
              icon="tint"
              color="#2196F3"
              section="hidratacao"
            />

            {expandedSections.hidratacao && (
              <>
                <LinearGradient colors={getGradientColorsWithOpacity('#2196F3', '#2196F3', '20')} style={styles.waterCard}>
                  <View style={styles.waterIconContainer}>
                    <FontAwesome name="tint" size={40} color="#2196F3" />
                  </View>
                  <View style={styles.waterInfo}>
                    <Text style={styles.waterValue}>{metricas.aguaRecomendadaFormatada}L</Text>
                    <Text style={styles.waterLabel}>por dia</Text>
                    <Text style={styles.waterSub}>
                      ≈ {metricas.coposAguaRecomendados} copos de 250ml
                    </Text>
                  </View>
                </LinearGradient>

                <View style={styles.waterStatus}>
                  <FontAwesome
                    name={metricas.querLembretesAgua ? "bell" : "bell-slash"}
                    size={16}
                    color={metricas.querLembretesAgua ? "#4CAF50" : "#999"}
                  />
                  <Text style={styles.waterStatusText}>
                    {metricas.querLembretesAgua ? "Lembretes ativados" : "Lembretes desativados"}
                  </Text>
                </View>
              </>
            )}
          </View>

          {/* Recomendação de Treino */}
          <View style={styles.section}>
            <SectionHeader
              title="Treino"
              icon="heart"
              color="#E91E63"
              section="treino"
            />

            {expandedSections.treino && (
              <LinearGradient colors={getGradientColorsWithOpacity('#E91E63', '#E91E63', '20')} style={styles.trainingCard}>
                <View style={styles.trainingHeader}>
                  <FontAwesome name="calendar-check-o" size={28} color="#E91E63" />
                  <View style={styles.trainingHeaderText}>
                    <Text style={styles.trainingFrequency}>
                      {metricas.frequenciaTreino === '0' ? 'Iniciante' :
                        metricas.frequenciaTreino === '1-2' ? 'Levemente ativo' :
                          metricas.frequenciaTreino === '3-4' ? 'Moderadamente ativo' :
                            metricas.frequenciaTreino === '5-6' ? 'Muito ativo' : 'Todos os dias'}
                    </Text>
                    <Text style={styles.trainingSub}>
                      {metricas.frequenciaTreino === '0' ? '0 dias/semana' :
                        metricas.frequenciaTreino === '1-2' ? '1-2 dias/semana' :
                          metricas.frequenciaTreino === '3-4' ? '3-4 dias/semana' :
                            metricas.frequenciaTreino === '5-6' ? '5-6 dias/semana' : '7 dias/semana'}
                    </Text>
                  </View>
                </View>

                <View style={styles.trainingSuggestion}>
                  <FontAwesome name="lightbulb-o" size={18} color="#FFD700" />
                  <Text style={styles.trainingSuggestionText}>
                    {metricas.objetivo === 'emagrecer'
                      ? 'Combine treino de força 3x/semana com cardio 2-3x/semana'
                      : metricas.objetivo === 'ganhar_massa'
                        ? 'Treino de força 4-5x/semana com progressão de carga'
                        : 'Mantenha treinos regulares 3-4x/semana'}
                  </Text>
                </View>
              </LinearGradient>
            )}
          </View>

          {/* Dicas Personalizadas */}
          <View style={styles.section}>
            <SectionHeader
              title="Dicas"
              icon="star"
              color="#FFD700"
              section="dicas"
            />

            {expandedSections.dicas && (
              <View style={styles.tipsContainer}>
                <TipCard
                  icon="cutlery"
                  title="Alimentação"
                  text={metricas.objetivo === 'emagrecer'
                    ? 'Priorize proteínas magras e vegetais. Déficit de 500kcal/dia.'
                    : metricas.objetivo === 'ganhar_massa'
                      ? 'Aumente proteínas e carboidratos. Superávit de 300-500kcal/dia.'
                      : 'Mantenha alimentação equilibrada.'}
                  color="#4CAF50"
                />

                <TipCard
                  icon="bed"
                  title="Descanso"
                  text="Durma 7-9 horas por noite. Sono de qualidade é essencial."
                  color="#2196F3"
                />

                <TipCard
                  icon="camera"
                  title="Acompanhamento"
                  text="Tire fotos a cada 15 dias. A balança não conta toda história!"
                  color="#9C27B0"
                />
              </View>
            )}
          </View>

          {/* Mensagem Final - Agora sem os botões */}
          <View style={styles.finalMessage}>
            <Text style={styles.finalMessageText}>
              "O sucesso é a soma de pequenos esforços repetidos dia após dia."
            </Text>
            <Text style={styles.finalMessageAuthor}>- Robert Collier</Text>
          </View>

          {/* Espaço extra no final para o botão flutuante não cobrir o conteúdo */}
          <View style={styles.bottomSpacing} />
        </View>
      </ScrollView>

      {/* Botão Flutuante "Começar Jornada" */}
      <SafeAreaView style={styles.floatingButtonContainer}>
        <Pressable style={styles.floatingButton} onPress={handleComecar}>
          <LinearGradient
            colors={getGradientColors('#1E88E5', '#1565C0')}
            style={styles.floatingGradient}
          >
            <FontAwesome name="rocket" size={24} color="#FFF" />
            <Text style={styles.floatingText}>Começar Jornada</Text>
          </LinearGradient>
        </Pressable>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  loadingGradient: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingCard: {
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
  loadingTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1A2C3E',
    marginTop: 20,
    marginBottom: 8,
  },
  loadingSubtitle: {
    fontSize: 14,
    color: '#6B7A8F',
    textAlign: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#F5F7FA',
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
    color: '#1A2C3E',
    marginTop: 16,
    marginBottom: 8,
  },
  errorText: {
    fontSize: 16,
    color: '#6B7A8F',
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
  headerGradient: {
    paddingTop: Platform.OS === 'ios' ? 50 : 30,
    paddingBottom: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  headerBackButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 20,
  },
  headerBackText: {
    fontSize: 14,
    color: '#FFF',
    fontWeight: '600',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFF',
    letterSpacing: -0.3,
  },
  headerShareButton: {
    padding: 8,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 20,
  },
  scrollView: {
    flex: 1,
    marginTop: -10,
  },
  scrollContent: {
    paddingBottom: 100, // Aumentado para dar espaço ao botão flutuante
    paddingHorizontal: 16,
  },
  mainCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 20,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  heroSection: {
    alignItems: 'center',
    marginBottom: 24,
  },
  heroIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    ...Platform.select({
      ios: {
        shadowColor: '#1E88E5',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  heroTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#1A2C3E',
    textAlign: 'center',
    marginBottom: 12,
    letterSpacing: -0.5,
  },
  heroBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF8E1',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 30,
    gap: 8,
    borderWidth: 1,
    borderColor: '#FFECB3',
  },
  heroBadgeText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#B76E00',
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  sectionHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  sectionIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A2C3E',
    flex: 1,
  },
  sectionBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  sectionBadgeText: {
    fontSize: 11,
    fontWeight: '600',
  },
  profileGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  profileItem: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: '#F8FAFD',
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
    gap: 8,
  },
  profileIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileLabel: {
    fontSize: 13,
    color: '#6B7A8F',
    fontWeight: '500',
  },
  profileValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1A2C3E',
  },
  metricCard: {
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 12,
  },
  metricHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  metricEmoji: {
    fontSize: 18,
  },
  metricTitle: {
    fontSize: 14,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  metricValueContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 6,
  },
  metricValue: {
    fontSize: 32,
    fontWeight: '800',
    letterSpacing: -1,
  },
  metricUnit: {
    fontSize: 14,
    color: '#6B7A8F',
    fontWeight: '600',
    marginLeft: 6,
  },
  metricSubtitle: {
    fontSize: 13,
    color: '#6B7A8F',
  },
  imcScale: {
    marginTop: 8,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 8,
  },
  progressLabel: {
    fontSize: 13,
    color: '#6B7A8F',
    fontWeight: '500',
    width: 60,
  },
  progressBarBackground: {
    flex: 1,
    height: 8,
    backgroundColor: '#E9EDF2',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  progressValue: {
    fontSize: 13,
    fontWeight: '600',
    minWidth: 40,
    textAlign: 'right',
  },
  imcLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 2,
    marginTop: 4,
  },
  imcLabel: {
    fontSize: 10,
    color: '#9AABC0',
  },
  imcCategories: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  imcCategory: {
    fontSize: 10,
    fontWeight: '600',
  },
  pesoIdealGrid: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 16,
  },
  pesoIdealCard: {
    flex: 1,
    backgroundColor: '#F8FAFD',
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
  },
  pesoIdealLabel: {
    fontSize: 12,
    color: '#6B7A8F',
    fontWeight: '600',
    marginBottom: 6,
  },
  pesoIdealValue: {
    fontSize: 22,
    fontWeight: '800',
    color: '#1A2C3E',
  },
  pesoIdealUnit: {
    fontSize: 12,
    color: '#6B7A8F',
    marginTop: 2,
  },
  pesoIdealSub: {
    fontSize: 10,
    color: '#9AABC0',
    marginTop: 6,
  },
  pesoAtualCard: {
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
  },
  pesoAtualLabel: {
    fontSize: 14,
    color: '#6B7A8F',
    marginBottom: 4,
  },
  pesoAtualValue: {
    fontSize: 28,
    fontWeight: '800',
    color: '#1A2C3E',
    marginBottom: 8,
  },
  pesoDiferenca: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  pesoDiferencaText: {
    fontSize: 14,
    fontWeight: '600',
  },
  composicaoBars: {
    gap: 12,
    marginTop: 16,
  },
  composicaoItem: {
    gap: 6,
  },
  composicaoLabelContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  composicaoLabel: {
    fontSize: 14,
    color: '#6B7A8F',
    fontWeight: '500',
  },
  composicaoValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1A2C3E',
  },
  composicaoBarBg: {
    height: 8,
    backgroundColor: '#E9EDF2',
    borderRadius: 4,
    overflow: 'hidden',
  },
  composicaoBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  composicaoPercentage: {
    fontSize: 12,
    color: '#9AABC0',
    textAlign: 'right',
  },
  bfScale: {
    marginTop: 20,
  },
  bfScaleTitle: {
    fontSize: 14,
    color: '#6B7A8F',
    marginBottom: 8,
    fontWeight: '600',
  },
  bfScaleBars: {
    flexDirection: 'row',
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
  },
  bfScaleBar: {
    flex: 1,
    height: '100%',
  },
  bfScaleLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 6,
  },
  bfScaleLabel: {
    fontSize: 9,
    color: '#9AABC0',
  },
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
    gap: 6,
    borderWidth: 1,
    borderColor: '#E9EDF2',
  },
  metabolismoLabel: {
    fontSize: 14,
    color: '#6B7A8F',
    fontWeight: '600',
  },
  metabolismoValue: {
    fontSize: 24,
    fontWeight: '800',
    color: '#1A2C3E',
  },
  metabolismoUnit: {
    fontSize: 11,
    color: '#6B7A8F',
  },
  metabolismoSub: {
    fontSize: 11,
    color: '#9AABC0',
  },
  caloriasCard: {
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E1F0FF',
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
    color: '#1A2C3E',
  },
  caloriasUnit: {
    fontSize: 14,
    color: '#6B7A8F',
    marginBottom: 12,
  },
  caloriasComparison: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#E1F0FF',
  },
  caloriasCompareItem: {
    alignItems: 'center',
  },
  caloriasCompareLabel: {
    fontSize: 12,
    color: '#6B7A8F',
    marginBottom: 2,
  },
  caloriasCompareValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1A2C3E',
  },
  macrosGrid: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 12,
  },
  macroCard: {
    flex: 1,
    padding: 14,
    borderRadius: 16,
    alignItems: 'center',
    gap: 6,
    borderWidth: 1,
  },
  macroLabel: {
    fontSize: 13,
    color: '#6B7A8F',
    fontWeight: '600',
  },
  macroValue: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1A2C3E',
    textAlign: 'center',
  },
  macroSub: {
    fontSize: 10,
    color: '#9AABC0',
  },
  macroTip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#F8FAFD',
    padding: 12,
    borderRadius: 12,
  },
  macroTipText: {
    flex: 1,
    fontSize: 12,
    color: '#5E6F8D',
  },
  waterCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderRadius: 16,
    gap: 16,
    borderWidth: 1,
    borderColor: '#E1F0FF',
  },
  waterIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#E1F0FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  waterInfo: {
    flex: 1,
  },
  waterValue: {
    fontSize: 28,
    fontWeight: '800',
    color: '#2196F3',
  },
  waterLabel: {
    fontSize: 14,
    color: '#1A2C3E',
    fontWeight: '600',
  },
  waterSub: {
    fontSize: 12,
    color: '#6B7A8F',
    marginTop: 2,
  },
  waterStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 12,
    padding: 12,
    backgroundColor: '#F8FAFD',
    borderRadius: 12,
  },
  waterStatusText: {
    fontSize: 13,
    color: '#6B7A8F',
  },
  trainingCard: {
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E9EDF2',
  },
  trainingHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  trainingHeaderText: {
    flex: 1,
  },
  trainingFrequency: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1A2C3E',
  },
  trainingSub: {
    fontSize: 13,
    color: '#6B7A8F',
    marginTop: 2,
  },
  trainingSuggestion: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    backgroundColor: '#FFF8E1',
    padding: 14,
    borderRadius: 12,
  },
  trainingSuggestionText: {
    flex: 1,
    fontSize: 13,
    color: '#5D4037',
    lineHeight: 18,
  },
  tipsContainer: {
    gap: 10,
  },
  tipCard: {
    flexDirection: 'row',
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
    gap: 12,
  },
  tipIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tipContent: {
    flex: 1,
  },
  tipTitle: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 4,
  },
  tipText: {
    fontSize: 12,
    color: '#5E6F8D',
    lineHeight: 18,
  },
  finalMessage: {
    marginTop: 24,
    alignItems: 'center',
  },
  finalMessageText: {
    fontSize: 14,
    color: '#6B7A8F',
    fontStyle: 'italic',
    textAlign: 'center',
    lineHeight: 20,
  },
  finalMessageAuthor: {
    fontSize: 12,
    color: '#9AABC0',
    marginTop: 4,
  },
  bottomSpacing: {
    height: 20,
  },
  // Estilos do botão flutuante
  floatingButtonContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 16,
    paddingBottom: Platform.OS === 'ios' ? 20 : 16,
    backgroundColor: 'transparent',
    pointerEvents: 'box-none',
  },
  floatingButton: {
    borderRadius: 30,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#1E88E5',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
      },
      android: {
        elevation: 8,
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
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: -0.3,
  },
});