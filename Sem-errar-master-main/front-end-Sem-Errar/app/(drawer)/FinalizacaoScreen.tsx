import FontAwesome from '@expo/vector-icons/FontAwesome';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

// ============ INTERFACES E TIPOS ============
interface ObjetivoCompleto {
  id: string;
  title: string;
  description?: string;
}

interface UserData {
  // Objetivo
  objetivo: string;
  objetivoCompleto: ObjetivoCompleto | null;

  // Dados pessoais
  sexo: string;
  idade: number;
  faixaIdade: string | null;

  // Altura
  alturaUnidade: string | null;
  altura: number | null;
  alturaFt: number | null;
  alturaIn: number | null;
  alturaCm: number;

  // Peso
  pesoUnidade: string | null;
  pesoKg: number | null;
  pesoLb: number | null;
  pesoEmKg: number;

  // Treino
  frequenciaTreino: string;
  nivelAtividade: number | null;
  frequenciaTreinoDescricao: string | null;
  treinaAtualmente: boolean;

  // Água
  querLembretesAgua: boolean;
  coposAguaDia: number;

  // Cardio
  frequenciaCardio: string | null;
  frequenciaCardioDescricao: string | null;

  // Medidas BF
  pescocoCm: number;
  cinturaCm: number;
  quadrilCm: number | null;
}

interface Classificacao {
  classificacao: string;
  cor: string;
  descricao: string;
  emoji?: string;
}

interface CaloriasObjetivo {
  manutencao: number;
  objetivo: number;
  meta: string;
  descricao: string;
  diferenca: string;
  cor: string;
}

interface Macronutriente {
  min: number;
  max: number;
  descricao: string;
  recomendacao?: string;
  gPorKg: string;
}

interface Metricas {
  // Dados básicos
  objetivo: string;
  sexo: string;
  idade: number;
  alturaCm: number;
  pesoEmKg: number;

  // IMC
  imc: number;
  imcFormatado: string;
  classificacaoIMC: Classificacao;
  pesoIdealMin: number;
  pesoIdealMax: number;

  // Composição corporal
  percentualGordura: number;
  percentualGorduraFormatado: string;
  classificacaoBF: Classificacao;
  massaGordaKg: number;
  massaMagraKg: number;

  // Metabolismo
  tmb: number;
  tmbFormatado: string;
  tdee: number;
  tdeeFormatado: string;
  nivelAtividade: number;
  nivelAtividadeDescricao: string;

  // Calorias
  calorias: CaloriasObjetivo;

  // Macronutrientes
  proteina: Macronutriente;
  carboidratos: Macronutriente;
  gorduras: Macronutriente;

  // Hidratação
  aguaRecomendadaLitros: number;
  aguaRecomendadaFormatada: string;
  coposAguaRecomendados: number;
  querLembretesAgua: boolean;

  // Treino
  frequenciaTreino: string;
  treinaAtualmente: boolean;

  // Meta
  tempoMeta: string;

  // Cardio
  frequenciaCardio: string | null;
  frequenciaCardioDescricao: string | null;

  // Datas
  dataCalculo: string;
}

export default function FinalizacaoScreen() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [metricas, setMetricas] = useState<Metricas | null>(null);

  useEffect(() => {
    carregarTodosDadosECalcular();
  }, []);

  const carregarTodosDadosECalcular = async () => {
    setIsLoading(true);
    try {
      console.log('📱 Iniciando carregamento de dados do AsyncStorage...');

      // 1. CARREGAR TODOS OS DADOS DO ASYNCSTORAGE
      const dados = await carregarDadosDoStorage();

      console.log('✅ Dados carregados:', {
        objetivo: dados.objetivo,
        sexo: dados.sexo,
        idade: dados.idade,
        alturaCm: dados.alturaCm,
        pesoEmKg: dados.pesoEmKg,
        frequenciaTreino: dados.frequenciaTreino,
        temMedidasBF: !!(dados.pescocoCm && dados.cinturaCm)
      });

      // 2. FAZER TODOS OS CÁLCULOS
      const resultados = calcularTodasMetricas(dados);

      setUserData(dados);
      setMetricas(resultados);

      // 3. SALVAR RESULTADOS NO STORAGE PARA USO FUTURO
      await AsyncStorage.setItem('@metricasCompletas', JSON.stringify(resultados));
      await AsyncStorage.setItem('@userDataCompleto', JSON.stringify(dados));

      console.log('🎯 Cálculos concluídos:', {
        imc: resultados.imc?.toFixed(1),
        bf: resultados.percentualGordura?.toFixed(1),
        tdee: resultados.tdee?.toFixed(0),
        objetivo: resultados.objetivo
      });

    } catch (error) {
      console.error('❌ Erro ao carregar dados e calcular:', error);
      Alert.alert(
        'Erro',
        'Não foi possível carregar seus dados. Tente novamente.',
        [{ text: 'OK', onPress: () => router.back() }]
      );
    } finally {
      setIsLoading(false);
    }
  };

  const carregarDadosDoStorage = async (): Promise<UserData> => {
    try {
      // Buscar todas as chaves do storage
      const [
        objetivo,
        objetivoCompleto,
        sexo,
        idade,
        faixaIdade,
        alturaUnidade,
        altura,
        alturaFt,
        alturaIn,
        alturaEmCm,
        pesoUnidade,
        pesoKg,
        pesoLb,
        pesoEmKg,
        frequenciaTreino,
        nivelAtividade,
        frequenciaTreinoDescricao,
        querLembretesAgua,
        coposAguaDia,
        frequenciaCardio,
        frequenciaCardioDescricao,
        pescocoCm,
        cinturaCm,
        quadrilCm,
        treinaAtualmente
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

      // Parse do objetivo completo se existir
      let objetivoCompletoObj: ObjetivoCompleto | null = null;
      if (objetivoCompleto) {
        try {
          objetivoCompletoObj = JSON.parse(objetivoCompleto);
        } catch (e) {
          console.error('Erro ao parsear objetivoCompleto:', e);
        }
      }

      // Determinar altura final em cm
      let alturaFinalCm = 170; // valor padrão
      if (alturaEmCm) {
        alturaFinalCm = parseFloat(alturaEmCm);
      } else if (alturaUnidade === 'cm' && altura) {
        alturaFinalCm = parseFloat(altura);
      } else if (alturaFt) {
        alturaFinalCm = converterParaCm(parseFloat(alturaFt), parseFloat(alturaIn || '0'));
      }

      // Determinar peso final em kg
      let pesoFinalKg = 70; // valor padrão
      if (pesoEmKg) {
        pesoFinalKg = parseFloat(pesoEmKg);
      } else if (pesoUnidade === 'kg' && pesoKg) {
        pesoFinalKg = parseFloat(pesoKg);
      }

      // Valores padrão para desenvolvimento/teste
      const idadeNum = idade ? parseInt(idade) : 32;
      const pescoco = pescocoCm ? parseFloat(pescocoCm) : 42;
      const cintura = cinturaCm ? parseFloat(cinturaCm) : 109;
      const quadril = quadrilCm ? parseFloat(quadrilCm) : null;
      const frequencia = frequenciaTreino || '3-4';
      const atividade = nivelAtividade ? parseFloat(nivelAtividade) : null;
      const querAgua = querLembretesAgua || 'sim';
      const coposAgua = coposAguaDia ? parseInt(coposAguaDia) : 10;

      return {
        // Objetivo
        objetivo: objetivo || 'manter',
        objetivoCompleto: objetivoCompletoObj,

        // Dados pessoais
        sexo: sexo || 'masculino',
        idade: idadeNum,
        faixaIdade: faixaIdade || null,

        // Altura
        alturaUnidade: alturaUnidade || null,
        altura: altura ? parseFloat(altura) : null,
        alturaFt: alturaFt ? parseInt(alturaFt) : null,
        alturaIn: alturaIn ? parseInt(alturaIn) : null,
        alturaCm: alturaFinalCm,

        // Peso
        pesoUnidade: pesoUnidade || null,
        pesoKg: pesoKg ? parseFloat(pesoKg) : null,
        pesoLb: pesoLb ? parseFloat(pesoLb) : null,
        pesoEmKg: pesoFinalKg,

        // Treino
        frequenciaTreino: frequencia,
        nivelAtividade: atividade,
        frequenciaTreinoDescricao: frequenciaTreinoDescricao || null,
        treinaAtualmente: treinaAtualmente === 'sim',

        // Água
        querLembretesAgua: querAgua === 'sim',
        coposAguaDia: coposAgua,

        // Cardio
        frequenciaCardio: frequenciaCardio || null,
        frequenciaCardioDescricao: frequenciaCardioDescricao || null,

        // Medidas BF
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
    // Extrair dados com valores padrão
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
      treinaAtualmente = false,
      querLembretesAgua = true,
      frequenciaCardio = null,
      frequenciaCardioDescricao = null
    } = dados;

    // 1. Cálculo do IMC
    const alturaMetros = alturaCm / 100;
    const imc = pesoEmKg / (alturaMetros * alturaMetros);

    // Classificação do IMC
    const getClassificacaoIMC = (imc: number): Classificacao => {
      if (imc < 18.5) return {
        classificacao: 'Baixo peso',
        cor: '#2196F3',
        descricao: 'Abaixo do peso ideal',
        emoji: '⚠️'
      };
      if (imc < 25) return {
        classificacao: 'Peso normal',
        cor: '#4CAF50',
        descricao: 'Peso saudável',
        emoji: '✅'
      };
      if (imc < 30) return {
        classificacao: 'Sobrepeso',
        cor: '#FF9800',
        descricao: 'Acima do peso ideal',
        emoji: '⚠️'
      };
      if (imc < 35) return {
        classificacao: 'Obesidade Grau I',
        cor: '#FF5722',
        descricao: 'Obesidade moderada',
        emoji: '⚠️⚠️'
      };
      return {
        classificacao: 'Obesidade',
        cor: '#D32F2F',
        descricao: 'Obesidade',
        emoji: '⚠️⚠️⚠️'
      };
    };

    const classificacaoIMC = getClassificacaoIMC(imc);

    // 2. Peso ideal
    const pesoMinimo = 18.5 * (alturaMetros * alturaMetros);
    const pesoMaximo = 24.9 * (alturaMetros * alturaMetros);

    // 3. Percentual de Gordura - MÉTODO DA MARINHA AMERICANA
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

      // Fallback: fórmula de Deurenberg
      const sexoValor = sexo === 'feminino' ? 1 : 0;
      return Math.max(5, Math.min((1.20 * imc) + (0.23 * idade) - (10.8 * sexoValor) - 5.4, 50));
    };

    const percentualGordura = calcularPercentualGordura();
    const massaGordaKg = (percentualGordura / 100) * pesoEmKg;
    const massaMagraKg = pesoEmKg - massaGordaKg;

    // Classificação do BF
    const getClassificacaoBF = (bf: number, isMale: boolean): Classificacao => {
      if (isMale) {
        if (bf < 6) return { classificacao: 'Essencial', cor: '#2196F3', descricao: 'Muito baixo', emoji: '🏃' };
        if (bf < 14) return { classificacao: 'Atleta', cor: '#4CAF50', descricao: 'Excelente', emoji: '💪' };
        if (bf < 18) return { classificacao: 'Fitness', cor: '#8BC34A', descricao: 'Bom', emoji: '👍' };
        if (bf < 25) return { classificacao: 'Aceitável', cor: '#FFC107', descricao: 'Médio', emoji: '👌' };
        return { classificacao: 'Obeso', cor: '#FF5722', descricao: 'Alto', emoji: '⚠️' };
      } else {
        if (bf < 14) return { classificacao: 'Essencial', cor: '#2196F3', descricao: 'Muito baixo', emoji: '🏃' };
        if (bf < 21) return { classificacao: 'Atleta', cor: '#4CAF50', descricao: 'Excelente', emoji: '💪' };
        if (bf < 25) return { classificacao: 'Fitness', cor: '#8BC34A', descricao: 'Bom', emoji: '👍' };
        if (bf < 32) return { classificacao: 'Aceitável', cor: '#FFC107', descricao: 'Médio', emoji: '👌' };
        return { classificacao: 'Obeso', cor: '#FF5722', descricao: 'Alto', emoji: '⚠️' };
      }
    };

    const classificacaoBF = getClassificacaoBF(percentualGordura, sexo === 'masculino');

    // 4. TMB - Harris-Benedict
    const calcularTMB = (): number => {
      if (sexo === 'feminino') {
        return 447.593 + (9.247 * pesoEmKg) + (3.098 * alturaCm) - (4.330 * idade);
      } else {
        return 88.362 + (13.397 * pesoEmKg) + (4.799 * alturaCm) - (5.677 * idade);
      }
    };

    const tmb = calcularTMB();

    // 5. Nível de atividade
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

    // 6. TDEE
    const tdee = tmb * atividadeNum;

    // 7. Calorias por objetivo
    const getCaloriasObjetivo = (): CaloriasObjetivo => {
      const manutencao = tdee;
      switch (objetivo) {
        case 'emagrecer':
          return {
            manutencao,
            objetivo: manutencao * 0.85,
            meta: 'Déficit calórico',
            descricao: 'Para emagrecimento saudável',
            diferenca: '-15%',
            cor: '#FF5722'
          };
        case 'ganhar_massa':
        case 'ganho':
          return {
            manutencao,
            objetivo: manutencao * 1.15,
            meta: 'Superávit calórico',
            descricao: 'Para ganho muscular',
            diferenca: '+15%',
            cor: '#4CAF50'
          };
        default:
          return {
            manutencao,
            objetivo: manutencao,
            meta: 'Manutenção',
            descricao: 'Para manter o peso',
            diferenca: '0%',
            cor: '#666'
          };
      }
    };

    const calorias = getCaloriasObjetivo();

    // 8. Proteína
    const getProteinaRecomendada = (): Macronutriente => {
      if (objetivo === 'ganhar_massa' || objetivo === 'ganho') {
        return {
          min: pesoEmKg * 1.8,
          max: pesoEmKg * 2.2,
          descricao: 'Para hipertrofia muscular',
          recomendacao: 'Alto consumo proteico',
          gPorKg: '1.8-2.2g/kg'
        };
      } else if (objetivo === 'emagrecer') {
        return {
          min: pesoEmKg * 1.6,
          max: pesoEmKg * 2.0,
          descricao: 'Para preservar massa muscular',
          recomendacao: 'Médio-alto consumo proteico',
          gPorKg: '1.6-2.0g/kg'
        };
      } else {
        return {
          min: pesoEmKg * 1.2,
          max: pesoEmKg * 1.6,
          descricao: 'Para manutenção muscular',
          recomendacao: 'Consumo moderado',
          gPorKg: '1.2-1.6g/kg'
        };
      }
    };

    const proteina = getProteinaRecomendada();

    // 9. Carboidratos e Gorduras
    const carboidratos: Macronutriente = {
      min: pesoEmKg * 3,
      max: pesoEmKg * 5,
      descricao: 'Fonte primária de energia',
      gPorKg: '3-5g/kg'
    };

    const gorduras: Macronutriente = {
      min: pesoEmKg * 0.8,
      max: pesoEmKg * 1.2,
      descricao: 'Essencial para hormônios',
      gPorKg: '0.8-1.2g/kg'
    };

    // 10. Água recomendada
    const aguaRecomendadaLitros = Math.max(2.0, Math.min(pesoEmKg * 0.035, 4.0));
    const coposAguaRecomendados = Math.round(aguaRecomendadaLitros * 4);

    // 11. Tempo para meta
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

    // 12. Nível de atividade descrição
    const getNivelAtividadeDescricao = (nivel: number): string => {
      if (nivel <= 1.2) return 'Sedentário';
      if (nivel <= 1.375) return 'Levemente ativo';
      if (nivel <= 1.55) return 'Moderadamente ativo';
      if (nivel <= 1.725) return 'Muito ativo';
      return 'Extremamente ativo';
    };

    return {
      // Dados básicos
      objetivo,
      sexo,
      idade,
      alturaCm,
      pesoEmKg,

      // IMC
      imc,
      imcFormatado: imc.toFixed(1),
      classificacaoIMC,
      pesoIdealMin: pesoMinimo,
      pesoIdealMax: pesoMaximo,

      // Composição corporal
      percentualGordura,
      percentualGorduraFormatado: percentualGordura.toFixed(1),
      classificacaoBF,
      massaGordaKg,
      massaMagraKg,

      // Metabolismo
      tmb,
      tmbFormatado: tmb.toFixed(0),
      tdee,
      tdeeFormatado: tdee.toFixed(0),
      nivelAtividade: atividadeNum,
      nivelAtividadeDescricao: getNivelAtividadeDescricao(atividadeNum),

      // Calorias
      calorias,

      // Macronutrientes
      proteina,
      carboidratos,
      gorduras,

      // Hidratação
      aguaRecomendadaLitros,
      aguaRecomendadaFormatada: aguaRecomendadaLitros.toFixed(1),
      coposAguaRecomendados,
      querLembretesAgua,

      // Treino
      frequenciaTreino,
      treinaAtualmente,

      // Meta
      tempoMeta,

      // Cardio
      frequenciaCardio,
      frequenciaCardioDescricao,

      // Datas
      dataCalculo: new Date().toISOString()
    };
  };

  const converterParaCm = (ft: number, inches: number): number => {
    return (ft * 30.48) + (inches * 2.54);
  };

  const handleComecar = async () => {
    try {
      // Salvar que o usuário completou o onboarding
      await AsyncStorage.setItem('@onboardingCompleto', 'true');
      await AsyncStorage.setItem('@ultimaAnalise', JSON.stringify({
        data: new Date().toISOString(),
        metricas: metricas
      }));

      console.log('🚀 Onboarding concluído!');
      router.replace('/(drawer)');
    } catch (error) {
      console.error('Erro ao finalizar onboarding:', error);
      Alert.alert('Erro', 'Não foi possível finalizar. Tente novamente.');
    }
  };

  const handleEditar = () => {
    router.back();
  };

  const handleCompartilhar = async () => {
    try {
      // Simular compartilhamento
      Alert.alert(
        'Compartilhar Análise',
        'Link copiado para a área de transferência!',
        [{ text: 'OK' }]
      );
    } catch (error) {
      console.error('Erro ao compartilhar:', error);
    }
  };

  if (isLoading) {
    return (
      <View style={[styles.background, { justifyContent: 'center', alignItems: 'center' }]}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#1E88E5" />
          <Text style={styles.loadingText}>Carregando seus dados...</Text>
          <Text style={styles.loadingSubtext}>Estamos analisando suas informações</Text>
        </View>
      </View>
    );
  }

  if (!metricas) {
    return (
      <View style={[styles.background, { justifyContent: 'center', alignItems: 'center' }]}>
        <View style={styles.errorContainer}>
          <FontAwesome name="exclamation-triangle" size={60} color="#FF9800" />
          <Text style={styles.errorTitle}>Ops!</Text>
          <Text style={styles.errorText}>Não foi possível carregar seus dados.</Text>
          <Pressable style={styles.errorButton} onPress={carregarTodosDadosECalcular}>
            <Text style={styles.errorButtonText}>Tentar Novamente</Text>
          </Pressable>
          <Pressable style={styles.errorSecondaryButton} onPress={() => router.back()}>
            <Text style={styles.errorSecondaryButtonText}>Voltar</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  // Componentes de UI
  const MetricCard = ({ title, value, unit, subtitle, color = '#1E88E5', emoji }: any) => (
    <View style={[styles.metricCard, { borderLeftColor: color }]}>
      <View style={styles.metricHeader}>
        {emoji && <Text style={styles.metricEmoji}>{emoji}</Text>}
        <Text style={styles.metricTitle}>{title}</Text>
      </View>
      <View style={styles.metricValueContainer}>
        <Text style={[styles.metricValue, { color }]}>{value}</Text>
        {unit && <Text style={styles.metricUnit}>{unit}</Text>}
      </View>
      {subtitle && <Text style={styles.metricSubtitle}>{subtitle}</Text>}
    </View>
  );

  const ProgressBar = ({ value, min, max, color, showValue = true, label }: any) => {
    const percentage = ((value - min) / (max - min)) * 100;
    const clampedPercentage = Math.max(0, Math.min(100, percentage));

    return (
      <View style={styles.progressBarContainer}>
        {label && <Text style={styles.progressLabel}>{label}</Text>}
        <View style={styles.progressBarBackground}>
          <View
            style={[
              styles.progressBarFill,
              { width: `${clampedPercentage}%`, backgroundColor: color }
            ]}
          />
        </View>
        {showValue && <Text style={styles.progressBarText}>{value.toFixed(1)}</Text>}
      </View>
    );
  };

  const TipCard = ({ icon, title, text, color = '#1E88E5' }: any) => (
    <View style={[styles.tipCard, { borderColor: color + '20', backgroundColor: color + '10' }]}>
      <View style={styles.tipHeader}>
        <FontAwesome name={icon} size={20} color={color} />
        <Text style={[styles.tipTitle, { color }]}>{title}</Text>
      </View>
      <Text style={styles.tipText}>{text}</Text>
    </View>
  );

  return (
    <View style={styles.background}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.mainContainer}>
          {/* Header */}
          <View style={styles.headerContainer}>
            <Pressable style={styles.backButton} onPress={handleEditar}>
              <FontAwesome name="arrow-left" size={18} color="#666" />
              <Text style={styles.backButtonText}>Editar</Text>
            </Pressable>
            <Text style={styles.headerTitle}>Análise Completa</Text>
            <Pressable style={styles.shareButton} onPress={handleCompartilhar}>
              <FontAwesome name="share-alt" size={18} color="#1E88E5" />
            </Pressable>
          </View>

          <View style={styles.content}>
            {/* Ícone e Título */}
            <View style={styles.iconContainer}>
              <FontAwesome name="trophy" size={60} color="#1E88E5" />
            </View>

            <Text style={styles.welcomeTitle}>
              🎯 Sua Análise {metricas.objetivo === 'emagrecer' ? 'de Emagrecimento' :
                metricas.objetivo === 'ganhar_massa' ? 'de Ganho Muscular' : 'de Manutenção'}
            </Text>

            <Text style={styles.subtitle}>
              Baseado nas suas informações, preparamos um plano personalizado para você
            </Text>

            {/* BADGE DE TEMPO ESTIMADO */}
            <View style={styles.timeBadge}>
              <FontAwesome name="clock-o" size={16} color="#FF9800" />
              <Text style={styles.timeBadgeText}>
                Tempo estimado para atingir sua meta: {metricas.tempoMeta}
              </Text>
            </View>

            {/* SEÇÃO 1: RESUMO DO PERFIL */}
            <View style={styles.sectionContainer}>
              <View style={styles.sectionHeader}>
                <FontAwesome name="user-circle" size={20} color="#1E88E5" />
                <Text style={styles.sectionTitle}>Seu Perfil</Text>
              </View>

              <View style={styles.profileCard}>
                <View style={styles.profileGrid}>
                  <View style={styles.profileItem}>
                    <FontAwesome name={metricas.sexo === 'feminino' ? "venus" : "mars"} size={22} color="#1E88E5" />
                    <Text style={styles.profileItemLabel}>Sexo</Text>
                    <Text style={styles.profileItemValue}>{metricas.sexo === 'feminino' ? 'Feminino' : 'Masculino'}</Text>
                  </View>
                  <View style={styles.profileItem}>
                    <FontAwesome name="birthday-cake" size={22} color="#1E88E5" />
                    <Text style={styles.profileItemLabel}>Idade</Text>
                    <Text style={styles.profileItemValue}>{metricas.idade} anos</Text>
                  </View>
                  <View style={styles.profileItem}>
                    <FontAwesome name="arrows-v" size={22} color="#1E88E5" />
                    <Text style={styles.profileItemLabel}>Altura</Text>
                    <Text style={styles.profileItemValue}>{metricas.alturaCm} cm</Text>
                  </View>
                  <View style={styles.profileItem}>
                    <FontAwesome name="balance-scale" size={22} color="#1E88E5" />
                    <Text style={styles.profileItemLabel}>Peso</Text>
                    <Text style={styles.profileItemValue}>{metricas.pesoEmKg.toFixed(1)} kg</Text>
                  </View>
                </View>

                <View style={styles.profileObjective}>
                  <FontAwesome name="bullseye" size={18} color="#1E88E5" />
                  <Text style={styles.profileObjectiveText}>
                    {metricas.objetivo === 'emagrecer' ? '🎯 Emagrecimento' :
                      metricas.objetivo === 'ganhar_massa' ? '💪 Ganho Muscular' : '⚖️ Manutenção'}
                  </Text>
                </View>
              </View>
            </View>

            {/* SEÇÃO 2: IMC */}
            <View style={styles.sectionContainer}>
              <View style={styles.sectionHeader}>
                <FontAwesome name="heartbeat" size={20} color={metricas.classificacaoIMC.cor} />
                <Text style={styles.sectionTitle}>Índice de Massa Corporal (IMC)</Text>
              </View>

              <MetricCard
                title="Seu IMC"
                value={metricas.imcFormatado}
                subtitle={`${metricas.classificacaoIMC.classificacao} ${metricas.classificacaoIMC.emoji || ''}`}
                color={metricas.classificacaoIMC.cor}
                emoji={metricas.classificacaoIMC.emoji}
              />

              <View style={styles.infoCard}>
                <Text style={styles.infoCardText}>
                  {metricas.classificacaoIMC.descricao}. IMC ideal: 18.5 - 24.9
                </Text>
              </View>

              <View style={styles.imcScaleContainer}>
                <Text style={styles.scaleTitle}>Sua posição na escala de IMC:</Text>
                <ProgressBar
                  value={metricas.imc}
                  min={15}
                  max={40}
                  color={metricas.classificacaoIMC.cor}
                  showValue={false}
                />
                <View style={styles.imcScaleLabels}>
                  <Text style={styles.scaleLabel}>15</Text>
                  <Text style={styles.scaleLabel}>18.5</Text>
                  <Text style={styles.scaleLabel}>25</Text>
                  <Text style={styles.scaleLabel}>30</Text>
                  <Text style={styles.scaleLabel}>35</Text>
                  <Text style={styles.scaleLabel}>40</Text>
                </View>
                <View style={styles.imcScaleTexts}>
                  <Text style={[styles.scaleText, { color: '#2196F3' }]}>Baixo</Text>
                  <Text style={[styles.scaleText, { color: '#4CAF50' }]}>Normal</Text>
                  <Text style={[styles.scaleText, { color: '#FF9800' }]}>Sobrepeso</Text>
                  <Text style={[styles.scaleText, { color: '#F44336' }]}>Obesidade</Text>
                </View>
              </View>
            </View>

            {/* SEÇÃO 3: PESO IDEAL */}
            <View style={styles.sectionContainer}>
              <View style={styles.sectionHeader}>
                <FontAwesome name="flag" size={20} color="#4CAF50" />
                <Text style={styles.sectionTitle}>Peso Ideal</Text>
              </View>

              <View style={styles.doubleMetricContainer}>
                <View style={[styles.miniMetricCard, { borderColor: '#4CAF50' }]}>
                  <Text style={styles.miniMetricLabel}>Mínimo</Text>
                  <Text style={styles.miniMetricValue}>{metricas.pesoIdealMin.toFixed(1)}</Text>
                  <Text style={styles.miniMetricUnit}>kg</Text>
                  <Text style={styles.miniMetricSubtitle}>IMC 18.5</Text>
                </View>
                <View style={[styles.miniMetricCard, { borderColor: '#4CAF50' }]}>
                  <Text style={styles.miniMetricLabel}>Ideal</Text>
                  <Text style={styles.miniMetricValue}>{((metricas.pesoIdealMin + metricas.pesoIdealMax) / 2).toFixed(1)}</Text>
                  <Text style={styles.miniMetricUnit}>kg</Text>
                  <Text style={styles.miniMetricSubtitle}>Médio</Text>
                </View>
                <View style={[styles.miniMetricCard, { borderColor: '#4CAF50' }]}>
                  <Text style={styles.miniMetricLabel}>Máximo</Text>
                  <Text style={styles.miniMetricValue}>{metricas.pesoIdealMax.toFixed(1)}</Text>
                  <Text style={styles.miniMetricUnit}>kg</Text>
                  <Text style={styles.miniMetricSubtitle}>IMC 24.9</Text>
                </View>
              </View>

              <View style={styles.pesoAtualIndicator}>
                <Text style={styles.pesoAtualLabel}>Seu peso atual:</Text>
                <Text style={styles.pesoAtualValue}>{metricas.pesoEmKg.toFixed(1)} kg</Text>
                <View style={styles.pesoDiferenca}>
                  <FontAwesome
                    name={metricas.pesoEmKg > metricas.pesoIdealMax ? "arrow-up" :
                      metricas.pesoEmKg < metricas.pesoIdealMin ? "arrow-down" : "check"}
                    size={14}
                    color={metricas.pesoEmKg > metricas.pesoIdealMax ? "#FF5722" :
                      metricas.pesoEmKg < metricas.pesoIdealMin ? "#2196F3" : "#4CAF50"}
                  />
                  <Text style={[styles.pesoDiferencaText, {
                    color: metricas.pesoEmKg > metricas.pesoIdealMax ? "#FF5722" :
                      metricas.pesoEmKg < metricas.pesoIdealMin ? "#2196F3" : "#4CAF50"
                  }]}>
                    {metricas.pesoEmKg > metricas.pesoIdealMax ?
                      `${(metricas.pesoEmKg - metricas.pesoIdealMax).toFixed(1)}kg acima do ideal` :
                      metricas.pesoEmKg < metricas.pesoIdealMin ?
                        `${(metricas.pesoIdealMin - metricas.pesoEmKg).toFixed(1)}kg abaixo do ideal` :
                        'Peso dentro do ideal!'}
                  </Text>
                </View>
              </View>
            </View>

            {/* SEÇÃO 4: COMPOSIÇÃO CORPORAL */}
            {metricas.percentualGordura > 0 && (
              <View style={styles.sectionContainer}>
                <View style={styles.sectionHeader}>
                  <FontAwesome name="pie-chart" size={20} color={metricas.classificacaoBF.cor} />
                  <Text style={styles.sectionTitle}>Composição Corporal</Text>
                </View>

                <MetricCard
                  title="Percentual de Gordura"
                  value={metricas.percentualGorduraFormatado}
                  unit="%"
                  subtitle={`${metricas.classificacaoBF.classificacao} ${metricas.classificacaoBF.emoji || ''}`}
                  color={metricas.classificacaoBF.cor}
                  emoji={metricas.classificacaoBF.emoji}
                />

                <View style={styles.bodyCompositionContainer}>
                  <View style={styles.bodyCompositionItem}>
                    <View style={[styles.bodyCompositionBar, { width: `${(metricas.massaMagraKg / metricas.pesoEmKg) * 100}%`, backgroundColor: '#2196F3' }]} />
                    <View style={styles.bodyCompositionInfo}>
                      <Text style={styles.bodyCompositionLabel}>Massa Magra</Text>
                      <Text style={styles.bodyCompositionValue}>{metricas.massaMagraKg.toFixed(1)} kg</Text>
                      <Text style={styles.bodyCompositionPercentage}>
                        {((metricas.massaMagraKg / metricas.pesoEmKg) * 100).toFixed(1)}%
                      </Text>
                    </View>
                  </View>
                  <View style={styles.bodyCompositionItem}>
                    <View style={[styles.bodyCompositionBar, { width: `${(metricas.massaGordaKg / metricas.pesoEmKg) * 100}%`, backgroundColor: '#FF9800' }]} />
                    <View style={styles.bodyCompositionInfo}>
                      <Text style={styles.bodyCompositionLabel}>Massa Gorda</Text>
                      <Text style={styles.bodyCompositionValue}>{metricas.massaGordaKg.toFixed(1)} kg</Text>
                      <Text style={styles.bodyCompositionPercentage}>
                        {metricas.percentualGordura.toFixed(1)}%
                      </Text>
                    </View>
                  </View>
                </View>

                <View style={styles.bfScaleContainer}>
                  <Text style={styles.bfScaleTitle}>Classificação:</Text>
                  <View style={styles.bfScale}>
                    <View style={[styles.bfScaleSegment, { backgroundColor: '#2196F3' }]} />
                    <View style={[styles.bfScaleSegment, { backgroundColor: '#4CAF50' }]} />
                    <View style={[styles.bfScaleSegment, { backgroundColor: '#8BC34A' }]} />
                    <View style={[styles.bfScaleSegment, { backgroundColor: '#FFC107' }]} />
                    <View style={[styles.bfScaleSegment, { backgroundColor: '#FF9800' }]} />
                  </View>
                  <View style={styles.bfScaleLabels}>
                    <Text style={styles.bfScaleLabel}>Essencial</Text>
                    <Text style={styles.bfScaleLabel}>Atleta</Text>
                    <Text style={styles.bfScaleLabel}>Fitness</Text>
                    <Text style={styles.bfScaleLabel}>Aceitável</Text>
                    <Text style={styles.bfScaleLabel}>Obeso</Text>
                  </View>
                </View>
              </View>
            )}

            {/* SEÇÃO 5: METABOLISMO */}
            <View style={styles.sectionContainer}>
              <View style={styles.sectionHeader}>
                <FontAwesome name="fire" size={20} color="#FF9800" />
                <Text style={styles.sectionTitle}>Metabolismo</Text>
              </View>

              <View style={styles.doubleMetricContainer}>
                <View style={styles.metabolismCard}>
                  <FontAwesome name="bed" size={24} color="#9C27B0" />
                  <Text style={styles.metabolismLabel}>TMB</Text>
                  <Text style={styles.metabolismValue}>{metricas.tmbFormatado}</Text>
                  <Text style={styles.metabolismUnit}>kcal/dia</Text>
                  <Text style={styles.metabolismSubtitle}>Em repouso</Text>
                </View>
                <View style={styles.metabolismCard}>
                  <FontAwesome name="bicycle" size={24} color="#E91E63" />
                  <Text style={styles.metabolismLabel}>TDEE</Text>
                  <Text style={styles.metabolismValue}>{metricas.tdeeFormatado}</Text>
                  <Text style={styles.metabolismUnit}>kcal/dia</Text>
                  <Text style={styles.metabolismSubtitle}>{metricas.nivelAtividadeDescricao}</Text>
                </View>
              </View>

              <View style={styles.caloriesCard}>
                <View style={styles.caloriesHeader}>
                  <FontAwesome name="cutlery" size={20} color={metricas.calorias.cor} />
                  <Text style={styles.caloriesTitle}>{metricas.calorias.meta}</Text>
                </View>
                <Text style={styles.caloriesValue}>{metricas.calorias.objetivo.toFixed(0)}</Text>
                <Text style={styles.caloriesUnit}>kcal/dia</Text>
                <Text style={styles.caloriesDesc}>{metricas.calorias.descricao}</Text>

                <View style={styles.caloriesComparison}>
                  <View style={styles.calorieCompareItem}>
                    <Text style={styles.calorieCompareLabel}>Manutenção</Text>
                    <Text style={styles.calorieCompareValue}>{metricas.calorias.manutencao.toFixed(0)}</Text>
                  </View>
                  <FontAwesome name="arrow-right" size={14} color="#999" />
                  <View style={styles.calorieCompareItem}>
                    <Text style={styles.calorieCompareLabel}>Sua meta</Text>
                    <Text style={[styles.calorieCompareValue, { color: metricas.calorias.cor }]}>
                      {metricas.calorias.objetivo.toFixed(0)}
                    </Text>
                  </View>
                </View>
              </View>
            </View>

            {/* SEÇÃO 6: MACROS */}
            <View style={styles.sectionContainer}>
              <View style={styles.sectionHeader}>
                <FontAwesome name="pie-chart" size={20} color="#4CAF50" />
                <Text style={styles.sectionTitle}>Nutrição Diária Recomendada</Text>
              </View>

              <View style={styles.macrosGrid}>
                <View style={[styles.macroCard, { borderColor: '#4CAF50' }]}>
                  <FontAwesome name="battery-3" size={28} color="#4CAF50" />
                  <Text style={styles.macroLabel}>Proteína</Text>
                  <Text style={styles.macroValue}>
                    {metricas.proteina.min.toFixed(0)}-{metricas.proteina.max.toFixed(0)}g
                  </Text>
                  <Text style={styles.macroSubtitle}>{metricas.proteina.gPorKg}</Text>
                </View>
                <View style={[styles.macroCard, { borderColor: '#FF9800' }]}>
                  <FontAwesome name="flash" size={28} color="#FF9800" />
                  <Text style={styles.macroLabel}>Carbo</Text>
                  <Text style={styles.macroValue}>
                    {metricas.carboidratos.min.toFixed(0)}-{metricas.carboidratos.max.toFixed(0)}g
                  </Text>
                  <Text style={styles.macroSubtitle}>{metricas.carboidratos.gPorKg}</Text>
                </View>
                <View style={[styles.macroCard, { borderColor: '#2196F3' }]}>
                  <FontAwesome name="tint" size={28} color="#2196F3" />
                  <Text style={styles.macroLabel}>Gorduras</Text>
                  <Text style={styles.macroValue}>
                    {metricas.gorduras.min.toFixed(0)}-{metricas.gorduras.max.toFixed(0)}g
                  </Text>
                  <Text style={styles.macroSubtitle}>{metricas.gorduras.gPorKg}</Text>
                </View>
              </View>

              {metricas.proteina.recomendacao && (
                <View style={styles.macroTip}>
                  <FontAwesome name="info-circle" size={16} color="#666" />
                  <Text style={styles.macroTipText}>
                    {metricas.proteina.recomendacao}. {metricas.proteina.descricao}.
                  </Text>
                </View>
              )}
            </View>

            {/* SEÇÃO 7: HIDRATAÇÃO */}
            <View style={styles.sectionContainer}>
              <View style={styles.sectionHeader}>
                <FontAwesome name="tint" size={20} color="#2196F3" />
                <Text style={styles.sectionTitle}>Hidratação</Text>
              </View>

              <View style={styles.waterCard}>
                <View style={styles.waterIconContainer}>
                  <FontAwesome name="tint" size={40} color="#2196F3" />
                </View>
                <View style={styles.waterInfo}>
                  <Text style={styles.waterValue}>{metricas.aguaRecomendadaFormatada}L</Text>
                  <Text style={styles.waterLabel}>de água por dia</Text>
                  <Text style={styles.waterSubtitle}>
                    ≈ {metricas.coposAguaRecomendados} copos de 250ml
                  </Text>
                </View>
              </View>

              <View style={styles.waterStatus}>
                <FontAwesome
                  name={metricas.querLembretesAgua ? "bell" : "bell-slash"}
                  size={16}
                  color={metricas.querLembretesAgua ? "#4CAF50" : "#999"}
                />
                <Text style={styles.waterStatusText}>
                  {metricas.querLembretesAgua
                    ? "🔔 Lembretes de água ativados"
                    : "🔕 Lembretes de água desativados"}
                </Text>
              </View>
            </View>

            {/* SEÇÃO 8: TREINO */}
            <View style={styles.sectionContainer}>
              <View style={styles.sectionHeader}>
                <FontAwesome name="heart" size={20} color="#E91E63" />
                <Text style={styles.sectionTitle}>Recomendação de Treino</Text>
              </View>

              <View style={styles.trainingCard}>
                <View style={styles.trainingHeader}>
                  <FontAwesome name="calendar-check-o" size={28} color="#1E88E5" />
                  <View style={styles.trainingHeaderText}>
                    <Text style={styles.trainingFrequency}>
                      {metricas.frequenciaTreino === '0' ? 'Iniciante' :
                        metricas.frequenciaTreino === '1-2' ? 'Levemente ativo' :
                          metricas.frequenciaTreino === '3-4' ? 'Moderadamente ativo' :
                            metricas.frequenciaTreino === '5-6' ? 'Muito ativo' : 'Todos os dias'}
                    </Text>
                    <Text style={styles.trainingSubtitle}>
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
                      ? 'Combine treino de força 3x/semana com cardio 2-3x/semana. Foco em déficit calórico.'
                      : metricas.objetivo === 'ganhar_massa'
                        ? 'Treino de força 4-5x/semana com progressão de carga. Foco em superávit calórico.'
                        : 'Mantenha treinos regulares 3-4x/semana combinando força e cardio.'}
                  </Text>
                </View>
              </View>
            </View>

            {/* SEÇÃO 9: CARDIO */}
            {metricas.frequenciaCardioDescricao && (
              <View style={styles.sectionContainer}>
                <View style={styles.sectionHeader}>
                  <FontAwesome name="heartbeat" size={20} color="#E91E63" />
                  <Text style={styles.sectionTitle}>Cardio</Text>
                </View>

                <View style={styles.cardioCard}>
                  <FontAwesome name="clock-o" size={24} color="#E91E63" />
                  <Text style={styles.cardioText}>
                    {metricas.frequenciaCardioDescricao}
                  </Text>
                </View>
              </View>
            )}

            {/* SEÇÃO 10: DICAS PERSONALIZADAS */}
            <View style={styles.sectionContainer}>
              <View style={styles.sectionHeader}>
                <FontAwesome name="star" size={20} color="#FFD700" />
                <Text style={styles.sectionTitle}>Dicas Personalizadas</Text>
              </View>

              <View style={styles.tipsContainer}>
                <TipCard
                  icon="cutlery"
                  title="Alimentação"
                  text={
                    metricas.objetivo === 'emagrecer'
                      ? 'Priorize proteínas magras e vegetais. Faça déficit de 500kcal/dia para perder 0.5kg/semana.'
                      : metricas.objetivo === 'ganhar_massa'
                        ? 'Aumente consumo de proteínas e carboidratos. Faça superávit de 300-500kcal/dia.'
                        : 'Mantenha uma alimentação equilibrada com todos os grupos alimentares.'
                  }
                  color="#4CAF50"
                />

                <TipCard
                  icon="bed"
                  title="Descanso"
                  text="Durma 7-9 horas por noite. O sono de qualidade é essencial para recuperação muscular e regulação hormonal."
                  color="#2196F3"
                />

                <TipCard
                  icon="line-chart"
                  title="Consistência"
                  text="Resultados consistentes vêm com hábitos diários. Foque em ser 1% melhor a cada dia, não na perfeição."
                  color="#FF9800"
                />

                <TipCard
                  icon="camera"
                  title="Acompanhamento"
                  text="Tire fotos a cada 15 dias e meça sua circunferência abdominal. A balança não conta toda a história!"
                  color="#9C27B0"
                />
              </View>
            </View>

            {/* DIVIDER */}
            <View style={styles.divider} />

            {/* BOTÃO PRINCIPAL */}
            <Pressable style={styles.primaryButton} onPress={handleComecar}>
              <View style={styles.buttonContent}>
                <FontAwesome name="rocket" size={26} color="#FFFFFF" />
                <Text style={styles.primaryText}>Começar Minha Jornada</Text>
              </View>
              <Text style={styles.buttonSubtitle}>
                Vamos transformar sua saúde! 💪
              </Text>
            </Pressable>

            {/* BOTÃO SECUNDÁRIO */}
            <Pressable style={styles.secondaryButton} onPress={handleEditar}>
              <FontAwesome name="pencil" size={20} color="#1E88E5" />
              <Text style={styles.secondaryText}>Editar Informações</Text>
            </Pressable>

            {/* MENSAGEM FINAL */}
            <View style={styles.finalMessage}>
              <Text style={styles.finalMessageText}>
                "O sucesso é a soma de pequenos esforços repetidos dia após dia."{'\n'}
                <Text style={styles.finalMessageAuthor}>- Robert Collier</Text>
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingVertical: 20,
  },
  mainContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#EEF2F6',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 6,
    marginHorizontal: 16,
    maxWidth: 480,
    alignSelf: 'center',
    width: '100%',
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F4F8',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    backgroundColor: '#F8F9FC',
  },
  backButtonText: {
    fontSize: 14,
    color: '#5E6F8D',
    fontWeight: '600',
  },
  shareButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: '#F0F9FF',
    borderWidth: 1,
    borderColor: '#E1F0FF',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A2C3E',
    letterSpacing: -0.3,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 32,
    alignItems: 'center',
  },
  loadingContainer: {
    alignItems: 'center',
    padding: 40,
  },
  loadingText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A2C3E',
    marginTop: 20,
  },
  loadingSubtext: {
    fontSize: 14,
    color: '#6B7A8F',
    marginTop: 8,
  },
  errorContainer: {
    alignItems: 'center',
    padding: 40,
  },
  errorTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1A2C3E',
    marginTop: 16,
  },
  errorText: {
    fontSize: 16,
    color: '#6B7A8F',
    marginTop: 8,
    textAlign: 'center',
  },
  errorButton: {
    backgroundColor: '#1E88E5',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 30,
    marginTop: 24,
  },
  errorButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  errorSecondaryButton: {
    marginTop: 12,
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  errorSecondaryButtonText: {
    color: '#1E88E5',
    fontSize: 16,
    fontWeight: '600',
  },
  iconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#F0F9FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 3,
    borderColor: '#1E88E5',
  },
  welcomeTitle: {
    color: '#1A2C3E',
    fontSize: 24,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: 12,
    lineHeight: 32,
    letterSpacing: -0.5,
  },
  subtitle: {
    color: '#6B7A8F',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 24,
  },
  timeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF8E1',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 40,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#FFECB3',
    gap: 10,
  },
  timeBadgeText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#B76E00',
  },
  sectionContainer: {
    width: '100%',
    marginBottom: 28,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 16,
    paddingBottom: 8,
    borderBottomWidth: 2,
    borderBottomColor: '#F0F4F8',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A2C3E',
    letterSpacing: -0.3,
  },
  profileCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#F0F4F8',
    overflow: 'hidden',
  },
  profileGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 16,
    gap: 16,
  },
  profileItem: {
    flex: 1,
    minWidth: '40%',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#F8FAFD',
    padding: 14,
    borderRadius: 12,
  },
  profileItemLabel: {
    fontSize: 13,
    color: '#6B7A8F',
    fontWeight: '500',
  },
  profileItemValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1A2C3E',
  },
  profileObjective: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingVertical: 14,
    backgroundColor: '#F0F9FF',
    borderTopWidth: 1,
    borderTopColor: '#E1F0FF',
  },
  profileObjectiveText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1E88E5',
  },
  metricCard: {
    backgroundColor: '#FFFFFF',
    padding: 18,
    borderRadius: 16,
    borderLeftWidth: 5,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#F0F4F8',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
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
    fontSize: 15,
    color: '#6B7A8F',
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
    fontSize: 36,
    fontWeight: '800',
    color: '#1A2C3E',
    letterSpacing: -1,
  },
  metricUnit: {
    fontSize: 16,
    color: '#6B7A8F',
    fontWeight: '600',
    marginLeft: 6,
  },
  metricSubtitle: {
    fontSize: 14,
    color: '#6B7A8F',
  },
  infoCard: {
    backgroundColor: '#F8FAFD',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E9EDF2',
  },
  infoCardText: {
    fontSize: 14,
    color: '#5E6F8D',
    textAlign: 'center',
    lineHeight: 20,
  },
  imcScaleContainer: {
    marginTop: 8,
  },
  scaleTitle: {
    fontSize: 14,
    color: '#6B7A8F',
    marginBottom: 12,
    fontWeight: '600',
  },
  progressBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 6,
  },
  progressBarBackground: {
    flex: 1,
    height: 12,
    backgroundColor: '#E9EDF2',
    borderRadius: 20,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 20,
  },
  progressBarText: {
    fontSize: 13,
    color: '#5E6F8D',
    fontWeight: '600',
    minWidth: 40,
    textAlign: 'right',
  },
  progressLabel: {
    fontSize: 13,
    color: '#6B7A8F',
    fontWeight: '600',
    marginBottom: 6,
  },
  imcScaleLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 2,
    marginTop: 8,
  },
  scaleLabel: {
    fontSize: 11,
    color: '#9AABC0',
    fontWeight: '500',
  },
  imcScaleTexts: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 2,
    marginTop: 6,
  },
  scaleText: {
    fontSize: 11,
    fontWeight: '600',
  },
  doubleMetricContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  miniMetricCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E9EDF2',
    alignItems: 'center',
  },
  miniMetricLabel: {
    fontSize: 13,
    color: '#6B7A8F',
    fontWeight: '600',
    marginBottom: 6,
  },
  miniMetricValue: {
    fontSize: 24,
    fontWeight: '800',
    color: '#1A2C3E',
    letterSpacing: -0.5,
  },
  miniMetricUnit: {
    fontSize: 13,
    color: '#6B7A8F',
    marginTop: 2,
  },
  miniMetricSubtitle: {
    fontSize: 11,
    color: '#9AABC0',
    marginTop: 6,
  },
  pesoAtualIndicator: {
    backgroundColor: '#F8FAFD',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  pesoAtualLabel: {
    fontSize: 14,
    color: '#6B7A8F',
    marginBottom: 4,
  },
  pesoAtualValue: {
    fontSize: 24,
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
  bodyCompositionContainer: {
    marginTop: 16,
    gap: 12,
  },
  bodyCompositionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  bodyCompositionBar: {
    height: 40,
    borderRadius: 8,
    position: 'absolute',
    left: 0,
    top: 0,
    opacity: 0.2,
  },
  bodyCompositionInfo: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E9EDF2',
  },
  bodyCompositionLabel: {
    fontSize: 14,
    color: '#6B7A8F',
    fontWeight: '600',
  },
  bodyCompositionValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1A2C3E',
  },
  bodyCompositionPercentage: {
    fontSize: 14,
    color: '#9AABC0',
  },
  bfScaleContainer: {
    marginTop: 20,
  },
  bfScaleTitle: {
    fontSize: 14,
    color: '#6B7A8F',
    marginBottom: 10,
    fontWeight: '600',
  },
  bfScale: {
    flexDirection: 'row',
    height: 8,
    backgroundColor: '#E9EDF2',
    borderRadius: 4,
    overflow: 'hidden',
  },
  bfScaleSegment: {
    flex: 1,
    height: '100%',
  },
  bfScaleLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  bfScaleLabel: {
    fontSize: 10,
    color: '#9AABC0',
    fontWeight: '500',
  },
  metabolismCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 18,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E9EDF2',
    alignItems: 'center',
    gap: 8,
  },
  metabolismLabel: {
    fontSize: 14,
    color: '#6B7A8F',
    fontWeight: '600',
    marginTop: 6,
  },
  metabolismValue: {
    fontSize: 26,
    fontWeight: '800',
    color: '#1A2C3E',
    letterSpacing: -0.5,
  },
  metabolismUnit: {
    fontSize: 13,
    color: '#6B7A8F',
  },
  metabolismSubtitle: {
    fontSize: 12,
    color: '#9AABC0',
    textAlign: 'center',
  },
  caloriesCard: {
    backgroundColor: '#F0F9FF',
    padding: 20,
    borderRadius: 16,
    marginTop: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E1F0FF',
  },
  caloriesHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 12,
  },
  caloriesTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A2C3E',
  },
  caloriesValue: {
    fontSize: 42,
    fontWeight: '800',
    color: '#1A2C3E',
    letterSpacing: -1,
  },
  caloriesUnit: {
    fontSize: 16,
    color: '#6B7A8F',
    marginBottom: 6,
  },
  caloriesDesc: {
    fontSize: 15,
    color: '#1E88E5',
    fontWeight: '600',
    marginBottom: 16,
  },
  caloriesComparison: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#E1F0FF',
  },
  calorieCompareItem: {
    alignItems: 'center',
  },
  calorieCompareLabel: {
    fontSize: 13,
    color: '#6B7A8F',
    marginBottom: 4,
  },
  calorieCompareValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A2C3E',
  },
  macrosGrid: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  macroCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E9EDF2',
    alignItems: 'center',
    gap: 8,
  },
  macroLabel: {
    fontSize: 15,
    color: '#6B7A8F',
    fontWeight: '600',
  },
  macroValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1A2C3E',
    textAlign: 'center',
  },
  macroSubtitle: {
    fontSize: 12,
    color: '#9AABC0',
  },
  macroTip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#F8FAFD',
    padding: 14,
    borderRadius: 12,
    marginTop: 4,
  },
  macroTipText: {
    flex: 1,
    fontSize: 13,
    color: '#5E6F8D',
    lineHeight: 18,
  },
  waterCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F9FF',
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E1F0FF',
    gap: 20,
  },
  waterIconContainer: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#E1F0FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  waterInfo: {
    flex: 1,
  },
  waterValue: {
    fontSize: 32,
    fontWeight: '800',
    color: '#2196F3',
    letterSpacing: -0.5,
  },
  waterLabel: {
    fontSize: 16,
    color: '#1A2C3E',
    fontWeight: '600',
    marginTop: 2,
  },
  waterSubtitle: {
    fontSize: 14,
    color: '#6B7A8F',
    marginTop: 4,
  },
  waterStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 12,
    padding: 12,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E9EDF2',
  },
  waterStatusText: {
    fontSize: 14,
    color: '#6B7A8F',
    fontWeight: '500',
  },
  trainingCard: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E9EDF2',
  },
  trainingHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginBottom: 16,
  },
  trainingHeaderText: {
    flex: 1,
  },
  trainingFrequency: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A2C3E',
  },
  trainingSubtitle: {
    fontSize: 14,
    color: '#6B7A8F',
    marginTop: 2,
  },
  trainingSuggestion: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    backgroundColor: '#FFF8E1',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FFECB3',
  },
  trainingSuggestionText: {
    flex: 1,
    fontSize: 14,
    color: '#5D4037',
    lineHeight: 20,
  },
  cardioCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    backgroundColor: '#FFF0F2',
    padding: 18,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#FFDCE0',
  },
  cardioText: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: '#E91E63',
  },
  tipsContainer: {
    gap: 12,
  },
  tipCard: {
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
  },
  tipHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 10,
  },
  tipTitle: {
    fontSize: 16,
    fontWeight: '700',
  },
  tipText: {
    fontSize: 14,
    color: '#5E6F8D',
    lineHeight: 22,
  },
  divider: {
    height: 1,
    width: '100%',
    backgroundColor: '#F0F4F8',
    marginVertical: 24,
  },
  primaryButton: {
    width: '100%',
    backgroundColor: '#1E88E5',
    borderRadius: 30,
    paddingVertical: 20,
    paddingHorizontal: 24,
    alignItems: 'center',
    shadowColor: '#1E88E5',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 8,
    marginBottom: 16,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginBottom: 8,
  },
  primaryText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  buttonSubtitle: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  secondaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#1E88E5',
    borderRadius: 30,
    paddingVertical: 16,
    marginBottom: 24,
  },
  secondaryText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1E88E5',
  },
  finalMessage: {
    marginTop: 16,
    paddingHorizontal: 20,
  },
  finalMessageText: {
    fontSize: 16,
    color: '#6B7A8F',
    fontStyle: 'italic',
    textAlign: 'center',
    lineHeight: 26,
  },
  finalMessageAuthor: {
    fontSize: 14,
    color: '#9AABC0',
    marginTop: 6,
  },
});