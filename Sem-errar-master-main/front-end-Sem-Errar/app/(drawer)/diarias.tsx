// app/(drawer)/treino.tsx - CARD ROTINA DO DIA COM NOME DO EXERCÍCIO CONTROLADO
import { Feather, FontAwesome5, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  Animated,
  Easing,
  FlatList,
  Modal,
  Platform,
  ScrollView,
  Share,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View
} from 'react-native';

// Mapeamento completo da tabela de treinos
const TABELA_TREINOS = {
  1: [
    { id: '1-1', diasSemana: 1, dia: 1, tipo: 'Full Body', exercicios: ['Agachamento', 'Flexão', 'Remada com elástico', 'Prancha'], series: ['3x12', '3x10', '3x12', '3x30s'], observacao: 'Corpo todo' },
    { id: '1-2', diasSemana: 1, dia: 2, tipo: 'Descanso', exercicios: [], series: [], observacao: 'Recuperação' },
    { id: '1-3', diasSemana: 1, dia: 3, tipo: 'Descanso', exercicios: [], series: [], observacao: 'Recuperação' },
    { id: '1-4', diasSemana: 1, dia: 4, tipo: 'Descanso', exercicios: [], series: [], observacao: 'Recuperação' },
    { id: '1-5', diasSemana: 1, dia: 5, tipo: 'Descanso', exercicios: [], series: [], observacao: 'Recuperação' },
    { id: '1-6', diasSemana: 1, dia: 6, tipo: 'Descanso', exercicios: [], series: [], observacao: 'Recuperação' },
    { id: '1-7', diasSemana: 1, dia: 7, tipo: 'Descanso', exercicios: [], series: [], observacao: 'Recuperação' }
  ],
  2: [
    { id: '2-1', diasSemana: 2, dia: 1, tipo: 'Upper Body', exercicios: ['Flexão', 'Remada com elástico', 'Elevação lateral', 'Prancha lateral'], series: ['3x12', '3x12', '3x12', '3x30s'], observacao: 'Parte superior' },
    { id: '2-2', diasSemana: 2, dia: 2, tipo: 'Lower Body', exercicios: ['Agachamento', 'Avanço (lunge)', 'Elevação de quadril', 'Abdominal bicicleta'], series: ['3x15', '3x12', '3x15', '3x20'], observacao: 'Parte inferior' },
    { id: '2-3', diasSemana: 2, dia: 3, tipo: 'Descanso', exercicios: [], series: [], observacao: 'Recuperação' },
    { id: '2-4', diasSemana: 2, dia: 4, tipo: 'Descanso', exercicios: [], series: [], observacao: 'Recuperação' },
    { id: '2-5', diasSemana: 2, dia: 5, tipo: 'Descanso', exercicios: [], series: [], observacao: 'Recuperação' },
    { id: '2-6', diasSemana: 2, dia: 6, tipo: 'Descanso', exercicios: [], series: [], observacao: 'Recuperação' },
    { id: '2-7', diasSemana: 2, dia: 7, tipo: 'Descanso', exercicios: [], series: [], observacao: 'Recuperação' }
  ],
  3: [
    { id: '3-1', diasSemana: 3, dia: 1, tipo: 'Full Body (Força)', exercicios: ['Agachamento', 'Flexão', 'Remada', 'Prancha'], series: ['3x12', '3x10', '3x12', '3x30s'], observacao: 'Intensidade alta' },
    { id: '3-2', diasSemana: 3, dia: 2, tipo: 'Descanso', exercicios: [], series: [], observacao: 'Recuperação' },
    { id: '3-3', diasSemana: 3, dia: 3, tipo: 'Core + Resistência', exercicios: ['Abdominal bicicleta', 'Prancha lateral', 'Elevação de quadril', 'Flexão'], series: ['3x20', '3x30s', '3x15', '3x10'], observacao: 'Corpo todo leve' },
    { id: '3-4', diasSemana: 3, dia: 4, tipo: 'Descanso', exercicios: [], series: [], observacao: 'Recuperação' },
    { id: '3-5', diasSemana: 3, dia: 5, tipo: 'Full Body (Resistência)', exercicios: ['Agachamento com salto leve', 'Flexão', 'Remada com elástico', 'Prancha lateral'], series: ['3x12', '3x10', '3x12', '3x30s'], observacao: 'Corpo todo leve' },
    { id: '3-6', diasSemana: 3, dia: 6, tipo: 'Descanso', exercicios: [], series: [], observacao: 'Recuperação' },
    { id: '3-7', diasSemana: 3, dia: 7, tipo: 'Descanso', exercicios: [], series: [], observacao: 'Recuperação' }
  ],
  4: [
    { id: '4-1', diasSemana: 4, dia: 1, tipo: 'Upper Body', exercicios: ['Flexão', 'Remada', 'Elevação lateral', 'Prancha'], series: ['3x12', '3x12', '3x12', '3x30s'], observacao: 'Parte superior' },
    { id: '4-2', diasSemana: 4, dia: 2, tipo: 'Lower Body', exercicios: ['Agachamento', 'Avanço', 'Elevação de quadril', 'Abdominal bicicleta'], series: ['3x15', '3x12', '3x15', '3x20'], observacao: 'Parte inferior' },
    { id: '4-3', diasSemana: 4, dia: 3, tipo: 'Descanso', exercicios: [], series: [], observacao: 'Recuperação' },
    { id: '4-4', diasSemana: 4, dia: 4, tipo: 'Upper Body (variação)', exercicios: ['Flexão diamante', 'Remada invertida', 'Elevação frontal', 'Prancha lateral'], series: ['3x12', '3x12', '3x12', '3x30s'], observacao: 'Intensidade diferente' },
    { id: '4-5', diasSemana: 4, dia: 5, tipo: 'Lower Body (variação)', exercicios: ['Agachamento sumô', 'Avanço lateral', 'Elevação de quadril com bola', 'Abdominal bicicleta'], series: ['3x15', '3x12', '3x15', '3x20'], observacao: 'Intensidade diferente' },
    { id: '4-6', diasSemana: 4, dia: 6, tipo: 'Descanso', exercicios: [], series: [], observacao: 'Recuperação' },
    { id: '4-7', diasSemana: 4, dia: 7, tipo: 'Descanso', exercicios: [], series: [], observacao: 'Recuperação' }
  ],
  5: [
    { id: '5-1', diasSemana: 5, dia: 1, tipo: 'Peito + Tríceps', exercicios: ['Flexão', 'Tríceps no banco', 'Crucifixo com halteres', 'Prancha'], series: ['3x12', '3x12', '3x12', '3x30s'], observacao: 'Foco superior' },
    { id: '5-2', diasSemana: 5, dia: 2, tipo: 'Costas + Bíceps', exercicios: ['Remada', 'Rosca bíceps', 'Pull-over', 'Prancha lateral'], series: ['3x12', '3x12', '3x12', '3x30s'], observacao: 'Foco superior' },
    { id: '5-3', diasSemana: 5, dia: 3, tipo: 'Pernas', exercicios: ['Agachamento', 'Avanço', 'Elevação de quadril', 'Panturrilha'], series: ['3x15', '3x12', '3x15', '3x20'], observacao: 'Foco inferior' },
    { id: '5-4', diasSemana: 5, dia: 4, tipo: 'Ombros + Core', exercicios: ['Elevação lateral', 'Elevação frontal', 'Prancha', 'Abdominal bicicleta'], series: ['3x12', '3x12', '3x30s', '3x20'], observacao: 'Parte superior e core' },
    { id: '5-5', diasSemana: 5, dia: 5, tipo: 'Full Body leve', exercicios: ['Agachamento leve', 'Flexão leve', 'Remada leve', 'Prancha'], series: ['3x12', '3x10', '3x12', '3x30s'], observacao: 'Recuperação ativa' },
    { id: '5-6', diasSemana: 5, dia: 6, tipo: 'Descanso', exercicios: [], series: [], observacao: 'Recuperação' },
    { id: '5-7', diasSemana: 5, dia: 7, tipo: 'Descanso', exercicios: [], series: [], observacao: 'Recuperação' }
  ],
  6: [
    { id: '6-1', diasSemana: 6, dia: 1, tipo: 'Peito', exercicios: ['Flexão', 'Crucifixo', 'Tríceps banco', 'Prancha'], series: ['3x12', '3x12', '3x12', '3x30s'], observacao: 'Foco superior' },
    { id: '6-2', diasSemana: 6, dia: 2, tipo: 'Costas', exercicios: ['Remada', 'Pull-over', 'Elevação lateral', 'Prancha lateral'], series: ['3x12', '3x12', '3x12', '3x30s'], observacao: 'Foco superior' },
    { id: '6-3', diasSemana: 6, dia: 3, tipo: 'Pernas', exercicios: ['Agachamento', 'Avanço', 'Elevação de quadril', 'Panturrilha'], series: ['3x15', '3x12', '3x15', '3x20'], observacao: 'Foco inferior' },
    { id: '6-4', diasSemana: 6, dia: 4, tipo: 'Ombros', exercicios: ['Elevação lateral', 'Elevação frontal', 'Remada alta', 'Prancha'], series: ['3x12', '3x12', '3x12', '3x30s'], observacao: 'Foco superior' },
    { id: '6-5', diasSemana: 6, dia: 5, tipo: 'Braços', exercicios: ['Rosca bíceps', 'Tríceps banco', 'Bíceps martelo', 'Flexão diamante'], series: ['3x12', '3x12', '3x12', '3x12'], observacao: 'Foco braços' },
    { id: '6-6', diasSemana: 6, dia: 6, tipo: 'Core', exercicios: ['Prancha frontal', 'Prancha lateral', 'Elevação de quadril', 'Abdominal bicicleta'], series: ['3x30s', '3x30s', '3x15', '3x20'], observacao: 'Foco core' },
    { id: '6-7', diasSemana: 6, dia: 7, tipo: 'Descanso', exercicios: [], series: [], observacao: 'Recuperação' }
  ],
  7: [
    { id: '7-1', diasSemana: 7, dia: 1, tipo: 'Full Body pesado', exercicios: ['Agachamento', 'Flexão', 'Remada', 'Prancha'], series: ['3x12', '3x10', '3x12', '3x30s'], observacao: 'Corpo todo' },
    { id: '7-2', diasSemana: 7, dia: 2, tipo: 'Core', exercicios: ['Prancha', 'Abdominal bicicleta', 'Elevação de quadril', 'Prancha lateral'], series: ['3x30s', '3x20', '3x15', '3x30s'], observacao: 'Corpo todo leve' },
    { id: '7-3', diasSemana: 7, dia: 3, tipo: 'Full Body pesado', exercicios: ['Agachamento', 'Flexão', 'Remada', 'Prancha'], series: ['3x12', '3x10', '3x12', '3x30s'], observacao: 'Corpo todo' },
    { id: '7-4', diasSemana: 7, dia: 4, tipo: 'Core', exercicios: ['Prancha', 'Abdominal bicicleta', 'Elevação de quadril', 'Prancha lateral'], series: ['3x30s', '3x20', '3x15', '3x30s'], observacao: 'Corpo todo leve' },
    { id: '7-5', diasSemana: 7, dia: 5, tipo: 'Full Body leve', exercicios: ['Agachamento leve', 'Flexão leve', 'Remada leve', 'Prancha'], series: ['3x12', '3x10', '3x12', '3x30s'], observacao: 'Corpo todo leve' },
    { id: '7-6', diasSemana: 7, dia: 6, tipo: 'Alongamento / Mobilidade', exercicios: ['Alongamento de corpo todo', 'Yoga leve', 'Prancha leve'], series: ['3x30s', '3x30s', '3x30s'], observacao: 'Recuperação ativa' },
    { id: '7-7', diasSemana: 7, dia: 7, tipo: 'Descanso', exercicios: [], series: [], observacao: 'Recuperação' }
  ]
};

// Treino padrão: Full Body (Resistência) - 3 dias, dia 5
const TREINO_PADRAO = { diasSemana: 3, dia: 5 };

// Interface para o treino
interface Treino {
  id: string;
  diasSemana: number;
  dia: number;
  tipo: string;
  exercicios: string[];
  series: string[];
  observacao: string;
}

// Interface para registro de exercício
interface ExercicioRegistro {
  nome: string;
  series: {
    numero: number;
    kg: string;
    repeticoes: string;
  }[];
}

export default function TreinoScreen() {
  const router = useRouter();
  
  // Estado para o treino atual (começa com o padrão)
  const [treinoAtual, setTreinoAtual] = useState<Treino>(() => {
    return TABELA_TREINOS[TREINO_PADRAO.diasSemana as keyof typeof TABELA_TREINOS][TREINO_PADRAO.dia - 1];
  });

  // Estado para o modal de seleção
  const [modalVisible, setModalVisible] = useState(false);
  
  // Estado para o modal de registro de treino
  const [registroModalVisible, setRegistroModalVisible] = useState(false);
  
  // Estado para o treino temporariamente selecionado no modal
  const [tempTreino, setTempTreino] = useState<Treino | null>(null);
  
  // Estado para os registros dos exercícios
  const [registros, setRegistros] = useState<ExercicioRegistro[]>([]);
  
  // Lista plana de todos os treinos para o modal
  const [todosTreinos, setTodosTreinos] = useState(() => {
    const treinos: any[] = [];
    Object.keys(TABELA_TREINOS).forEach(dias => {
      const treinosDia = TABELA_TREINOS[parseInt(dias) as keyof typeof TABELA_TREINOS];
      treinosDia.forEach(treino => {
        if (treino.tipo !== 'Descanso') {
          treinos.push({
            ...treino,
            titulo: `${treino.tipo} (${treino.diasSemana} dias, dia ${treino.dia})`
          });
        }
      });
    });
    return treinos;
  });

  // Inicializa os registros quando o treino muda
  useEffect(() => {
    const novosRegistros = treinoAtual.exercicios.map((exercicio, index) => {
      // Extrai número de séries do formato "3x12" ou "3x30s"
      const seriesCount = parseInt(treinoAtual.series[index].split('x')[0]) || 3;
      
      return {
        nome: exercicio,
        series: Array.from({ length: seriesCount }, (_, i) => ({
          numero: i + 1,
          kg: '',
          repeticoes: ''
        }))
      };
    });
    setRegistros(novosRegistros);
  }, [treinoAtual]);

  // Animações
  const fadeAnim = useState(new Animated.Value(0))[0];
  const slideAnim = useState(new Animated.Value(20))[0];

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 500,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const shareResults = async () => {
    try {
      let message = '';
      
      if (treinoAtual.tipo === 'Descanso') {
        message = `📅 Hoje é dia de DESCANSO!`;
      } else {
        const exerciciosLista = treinoAtual.exercicios.map((ex: string, index: number) => 
          `${index + 1}. ${ex} - ${treinoAtual.series[index]}`
        ).join('\n');
        
        message = `💪 *ROTINA DO DIA* 💪\n\n` +
                  `🏋️ ${treinoAtual.tipo}\n` +
                  `📊 ${treinoAtual.exercicios.length} exercícios\n` +
                  `⏱️ 60 min\n` +
                  `🔥 450 kcal\n\n` +
                  `📋 *EXERCÍCIOS:*\n${exerciciosLista}`;
      }

      await Share.share({
        message,
        title: 'Minha Rotina de Hoje',
      });
    } catch (error) {
      console.log(error);
    }
  };

  const selecionarTreinoTemp = (treino: any) => {
    setTempTreino(treino);
  };

  const aplicarTreinoSelecionado = () => {
    if (tempTreino) {
      setTreinoAtual(tempTreino);
      setModalVisible(false);
      setTempTreino(null);
    }
  };

  // Função para atualizar o registro de um exercício
  const atualizarRegistro = (exercicioIndex: number, serieIndex: number, campo: 'kg' | 'repeticoes', valor: string) => {
    const novosRegistros = [...registros];
    novosRegistros[exercicioIndex].series[serieIndex][campo] = valor;
    setRegistros(novosRegistros);
  };

  // Função para obter ícone baseado no nome do exercício
  const getExerciseIcon = (exercicio: string) => {
    const nome = exercicio.toLowerCase();
    
    if (nome.includes('agachamento')) return { name: 'arm-flex', color: '#FF6B6B' };
    if (nome.includes('flexão')) return { name: 'arm-flex', color: '#4ECDC4' };
    if (nome.includes('remada')) return { name: 'arm-flex', color: '#45B7D1' };
    if (nome.includes('prancha')) return { name: 'human-handsup', color: '#96CEB4' };
    if (nome.includes('abdominal')) return { name: 'human-male', color: '#FFEEAD' };
    if (nome.includes('elevação')) return { name: 'arm-flex', color: '#D4A5A5' };
    if (nome.includes('tríceps')) return { name: 'arm-flex', color: '#9B59B6' };
    if (nome.includes('bíceps')) return { name: 'arm-flex', color: '#3498DB' };
    if (nome.includes('corrida')) return { name: 'run', color: '#E67E22' };
    if (nome.includes('crucifixo')) return { name: 'arm-flex', color: '#EA4335' };
    if (nome.includes('puxada')) return { name: 'arm-flex', color: '#8E44AD' };
    return { name: 'dumbbell', color: '#1E88E5' };
  };

  // Função para renderizar o ícone do exercício
  const renderExerciseIcon = (exercicio: string, size: number = 18) => {
    const icon = getExerciseIcon(exercicio);
    return <MaterialCommunityIcons name={icon.name as any} size={size} color={icon.color} />;
  };

  // Calcula progresso
  const isDescanso = treinoAtual.tipo === 'Descanso';
  const totalExercicios = treinoAtual.exercicios?.length || 0;

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#F8FAFC" barStyle="dark-content" />
      
      {/* HEADER COM NOME "ROTINA DO DIA" */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.push('/dados')}
        >
          <Ionicons name="arrow-back" size={22} color="#1E88E5" />
        </TouchableOpacity>
        
        <Text style={styles.headerTitle}>Rotina do Dia</Text>
        
        <TouchableOpacity
          style={styles.shareButton}
          onPress={shareResults}
        >
          <Feather name="share-2" size={20} color="#1E88E5" />
        </TouchableOpacity>
      </View>

      {/* CONTEÚDO PRINCIPAL */}
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* CARD PRINCIPAL DO TREINO COM TÍTULO "TREINO HOJE" DENTRO */}
        <Animated.View
          style={[
            styles.mainCard,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          {/* BADGE "TREINO HOJE" DENTRO DO CARD */}
          <View style={styles.treinoHojeBadge}>
            <MaterialCommunityIcons name="dumbbell" size={14} color="#1E88E5" />
            <Text style={styles.treinoHojeText}>Treino Hoje</Text>
          </View>

          {/* TÍTULO E BOTÕES - AGORA COM FLEX PRA NÃO EMPURRAR */}
          <View style={styles.cardHeader}>
            <View style={styles.titleContainer}>
              <Text style={styles.cardTitle} numberOfLines={1} ellipsizeMode="tail">
                {treinoAtual.tipo}
              </Text>
              <Text style={styles.cardDescription} numberOfLines={1} ellipsizeMode="tail">
                {treinoAtual.observacao}
              </Text>
            </View>
            
            <View style={styles.actionButtons}>
              <TouchableOpacity
                style={styles.preconfigButton}
                onPress={() => {
                  setTempTreino(null);
                  setModalVisible(true);
                }}
              >
                <Feather name="settings" size={14} color="#1E88E5" />
                <Text style={styles.preconfigButtonText}>Preconfig.</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={styles.registerButton}
                onPress={() => setRegistroModalVisible(true)}
              >
                <Feather name="check-square" size={14} color="#FFFFFF" />
                <Text style={styles.registerButtonText}>Registrar</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* ESTATÍSTICAS EM LINHA */}
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <MaterialCommunityIcons name="dumbbell" size={18} color="#1E88E5" />
              <Text style={styles.statValue}>{totalExercicios}</Text>
              <Text style={styles.statLabel}>ex</Text>
            </View>

            <View style={styles.statDivider} />

            <View style={styles.statItem}>
              <MaterialCommunityIcons name="clock-outline" size={18} color="#4CAF50" />
              <Text style={styles.statValue}>60</Text>
              <Text style={styles.statLabel}>min</Text>
            </View>

            <View style={styles.statDivider} />

            <View style={styles.statItem}>
              <MaterialCommunityIcons name="fire" size={18} color="#FF9800" />
              <Text style={styles.statValue}>450</Text>
              <Text style={styles.statLabel}>kcal</Text>
            </View>
          </View>

          {/* EXERCÍCIOS PRINCIPAIS COM ÍCONES */}
          <View style={styles.exercisesContainer}>
            <Text style={styles.exercisesTitle}>Exercícios principais</Text>
            
            <View style={styles.exercisesGrid}>
              {treinoAtual.exercicios.slice(0, 4).map((exercicio: string, index: number) => (
                <View key={index} style={styles.exerciseChip}>
                  <View style={[styles.exerciseChipIcon, { backgroundColor: getExerciseIcon(exercicio).color + '15' }]}>
                    {renderExerciseIcon(exercicio, 14)}
                  </View>
                  <Text style={styles.exerciseChipText} numberOfLines={1} ellipsizeMode="tail">
                    {exercicio}
                  </Text>
                </View>
              ))}
            </View>

            {treinoAtual.exercicios.length > 4 && (
              <TouchableOpacity style={styles.moreButton}>
                <Text style={styles.moreButtonText}>
                  + {treinoAtual.exercicios.length - 4} exercícios
                </Text>
                <Feather name="chevron-right" size={14} color="#1E88E5" />
              </TouchableOpacity>
            )}
          </View>

          {/* DICA RÁPIDA */}
          <View style={styles.tipContainer}>
            <MaterialCommunityIcons name="lightbulb-outline" size={16} color="#FFC107" />
            <Text style={styles.tipText} numberOfLines={1}>
              Beba água a cada 15min
            </Text>
          </View>
        </Animated.View>

        {/* ESPAÇO PARA OUTROS CARDS */}
        <View style={styles.otherCardsSpace}>
          <Text style={styles.placeholderText}>Outros cards virão aqui...</Text>
        </View>
      </ScrollView>

      {/* MODAL DE SELEÇÃO DE TREINO (TABELA) */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitulo}>Escolha seu treino</Text>
              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                style={styles.modalCloseButton}
              >
                <Feather name="x" size={24} color="#64748B" />
              </TouchableOpacity>
            </View>

            <FlatList
              data={todosTreinos}
              keyExtractor={(item) => item.id}
              showsVerticalScrollIndicator={false}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.treinoItem,
                    tempTreino?.id === item.id && styles.treinoItemSelecionado
                  ]}
                  onPress={() => selecionarTreinoTemp(item)}
                  activeOpacity={0.7}
                >
                  <View style={styles.treinoItemHeader}>
                    <FontAwesome5 name="dumbbell" size={14} color="#1E88E5" />
                    <Text style={styles.treinoItemTipo}>{item.tipo}</Text>
                    <View style={styles.treinoItemBadge}>
                      <Text style={styles.treinoItemBadgeTexto}>{item.diasSemana}d • dia {item.dia}</Text>
                    </View>
                  </View>
                  
                  <Text style={styles.treinoItemObs}>{item.observacao}</Text>
                  
                  <View style={styles.treinoItemExercicios}>
                    {item.exercicios.slice(0, 3).map((ex: string, idx: number) => (
                      <Text key={idx} style={styles.treinoItemExercicio}>• {ex}</Text>
                    ))}
                    {item.exercicios.length > 3 && (
                      <Text style={styles.treinoItemMais}>+{item.exercicios.length - 3}</Text>
                    )}
                  </View>

                  {tempTreino?.id === item.id && (
                    <View style={styles.treinoItemCheck}>
                      <Feather name="check-circle" size={18} color="#4CAF50" />
                    </View>
                  )}
                </TouchableOpacity>
              )}
              contentContainerStyle={styles.modalLista}
            />

            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={[
                  styles.aplicarButton,
                  !tempTreino && styles.aplicarButtonDisabled
                ]}
                onPress={aplicarTreinoSelecionado}
                disabled={!tempTreino}
              >
                <Text style={styles.aplicarButtonTexto}>
                  {tempTreino ? 'Carregar Treino' : 'Selecione um treino'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* MODAL DE REGISTRO DE TREINO */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={registroModalVisible}
        onRequestClose={() => setRegistroModalVisible(false)}
      >
        <TouchableWithoutFeedback onPress={() => setRegistroModalVisible(false)}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback>
              <View style={styles.registroModalContainer}>
                <View style={styles.registroModalHeader}>
                  <View style={styles.registroModalTitleContainer}>
                    <MaterialCommunityIcons name="clipboard-text" size={24} color="#1E88E5" />
                    <Text style={styles.registroModalTitle}>Registrar Treino</Text>
                  </View>
                  <TouchableOpacity
                    onPress={() => setRegistroModalVisible(false)}
                    style={styles.registroModalCloseButton}
                  >
                    <Feather name="x" size={22} color="#64748B" />
                  </TouchableOpacity>
                </View>

                <ScrollView 
                  style={styles.registroScrollView}
                  showsVerticalScrollIndicator={false}
                >
                  {registros.map((exercicio, exercicioIndex) => (
                    <View key={exercicioIndex} style={styles.exercicioRegistroCard}>
                      <View style={styles.exercicioRegistroHeader}>
                        <View style={[styles.exercicioRegistroIcon, { backgroundColor: getExerciseIcon(exercicio.nome).color + '15' }]}>
                          {renderExerciseIcon(exercicio.nome, 20)}
                        </View>
                        <Text style={styles.exercicioRegistroNome} numberOfLines={2} ellipsizeMode="tail">
                          {exercicio.nome}
                        </Text>
                      </View>

                      {/* Cabeçalho da tabela */}
                      <View style={styles.tableHeader}>
                        <Text style={[styles.tableHeaderCell, { flex: 0.5 }]}>SÉRIE</Text>
                        <Text style={[styles.tableHeaderCell, { flex: 1 }]}>KG</Text>
                        <Text style={[styles.tableHeaderCell, { flex: 1 }]}>REPS</Text>
                      </View>

                      {/* Linhas da tabela */}
                      {exercicio.series.map((serie, serieIndex) => (
                        <View key={serieIndex} style={styles.tableRow}>
                          <View style={[styles.tableCell, { flex: 0.5 }]}>
                            <Text style={styles.serieNumero}>{serie.numero}</Text>
                          </View>
                          
                          <View style={[styles.tableCell, { flex: 1 }]}>
                            <TextInput
                              style={styles.input}
                              value={serie.kg}
                              onChangeText={(valor) => atualizarRegistro(exercicioIndex, serieIndex, 'kg', valor)}
                              keyboardType="numeric"
                              placeholder="0"
                              placeholderTextColor="#CBD5E1"
                            />
                          </View>
                          
                          <View style={[styles.tableCell, { flex: 1 }]}>
                            <TextInput
                              style={styles.input}
                              value={serie.repeticoes}
                              onChangeText={(valor) => atualizarRegistro(exercicioIndex, serieIndex, 'repeticoes', valor)}
                              keyboardType="numeric"
                              placeholder="0"
                              placeholderTextColor="#CBD5E1"
                            />
                          </View>
                        </View>
                      ))}
                    </View>
                  ))}

                  <View style={styles.registroModalFooter}>
                    <TouchableOpacity
                      style={styles.cancelButton}
                      onPress={() => setRegistroModalVisible(false)}
                    >
                      <Text style={styles.cancelButtonText}>Cancelar</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.saveButton}
                      onPress={() => {
                        // Aqui você pode salvar os registros
                        console.log('Registros salvos:', registros);
                        setRegistroModalVisible(false);
                      }}
                    >
                      <Text style={styles.saveButtonText}>Salvar Registro</Text>
                    </TouchableOpacity>
                  </View>
                </ScrollView>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  
  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'ios' ? 60 : 16,
    paddingBottom: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1E293B',
  },
  shareButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  // ScrollView
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 30,
  },
  
  // Main Card
  mainCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 4,
  },
  
  // Badge "Treino Hoje"
  treinoHojeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E3F2FD',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
    marginBottom: 12,
    gap: 4,
  },
  treinoHojeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1E88E5',
  },
  
  // Card Header - AJUSTADO PARA NÃO EMPURRAR OS BOTÕES
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  titleContainer: {
    flex: 1,
    marginRight: 8,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 2,
  },
  cardDescription: {
    fontSize: 12,
    color: '#64748B',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 4,
    flexShrink: 0,
  },
  preconfigButton: {
    flexDirection: 'row',
    height: 30,
    borderRadius: 15,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 8,
    gap: 4,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  preconfigButtonText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#1E88E5',
  },
  registerButton: {
    flexDirection: 'row',
    height: 30,
    borderRadius: 15,
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 10,
    gap: 4,
  },
  registerButtonText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  
  // Stats Row
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    padding: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statValue: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1E293B',
  },
  statLabel: {
    fontSize: 12,
    color: '#64748B',
  },
  statDivider: {
    width: 1,
    height: 20,
    backgroundColor: '#E2E8F0',
  },
  
  // Exercises Container
  exercisesContainer: {
    marginBottom: 12,
  },
  exercisesTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#334155',
    marginBottom: 10,
  },
  exercisesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  exerciseChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    gap: 6,
    maxWidth: '48%',
  },
  exerciseChipIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    flexShrink: 0,
  },
  exerciseChipText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#1E293B',
    flexShrink: 1,
  },
  moreButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    marginTop: 10,
    paddingVertical: 8,
  },
  moreButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1E88E5',
  },
  
  // Tip Container
  tipContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  tipText: {
    fontSize: 12,
    color: '#B76E00',
    flex: 1,
  },
  
  // Espaço para outros cards
  otherCardsSpace: {
    backgroundColor: '#F1F5F9',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#E2E8F0',
    borderStyle: 'dashed',
  },
  placeholderText: {
    fontSize: 14,
    color: '#94A3B8',
    fontWeight: '500',
  },
  
  // Modal Overlay
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  
  // Modal de Seleção
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  modalTitulo: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1E293B',
  },
  modalCloseButton: {
    padding: 4,
  },
  modalLista: {
    padding: 16,
    gap: 8,
  },
  modalFooter: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
  },
  aplicarButton: {
    backgroundColor: '#1E88E5',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  aplicarButtonDisabled: {
    backgroundColor: '#94A3B8',
    opacity: 0.5,
  },
  aplicarButtonTexto: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  treinoItem: {
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    position: 'relative',
  },
  treinoItemSelecionado: {
    borderColor: '#1E88E5',
    borderWidth: 2,
    backgroundColor: '#F0F9FF',
  },
  treinoItemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
    flexWrap: 'wrap',
    gap: 6,
  },
  treinoItemTipo: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1E293B',
    flex: 1,
  },
  treinoItemBadge: {
    backgroundColor: '#E3F2FD',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
  },
  treinoItemBadgeTexto: {
    fontSize: 10,
    fontWeight: '600',
    color: '#1E88E5',
  },
  treinoItemObs: {
    fontSize: 12,
    color: '#64748B',
    marginBottom: 6,
  },
  treinoItemExercicios: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: 4,
  },
  treinoItemExercicio: {
    fontSize: 12,
    color: '#1E293B',
  },
  treinoItemMais: {
    fontSize: 11,
    color: '#1E88E5',
    fontWeight: '500',
  },
  treinoItemCheck: {
    position: 'absolute',
    top: 14,
    right: 14,
  },
  
  // Modal de Registro
  registroModalContainer: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '90%',
    width: '100%',
  },
  registroModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  registroModalTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  registroModalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1E293B',
  },
  registroModalCloseButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  registroScrollView: {
    maxHeight: '70%',
    padding: 20,
  },
  exercicioRegistroCard: {
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  exercicioRegistroHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  exercicioRegistroIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    flexShrink: 0,
  },
  exercicioRegistroNome: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
    flex: 1,
    flexWrap: 'wrap',
  },
  tableHeader: {
    flexDirection: 'row',
    paddingHorizontal: 8,
    paddingVertical: 8,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  tableHeaderCell: {
    fontSize: 11,
    fontWeight: '700',
    color: '#64748B',
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  tableRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
  },
  tableCell: {
    paddingHorizontal: 4,
  },
  serieNumero: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1E293B',
    textAlign: 'center',
  },
  input: {
    height: 44,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    borderRadius: 10,
    paddingHorizontal: 12,
    fontSize: 14,
    color: '#1E293B',
    backgroundColor: '#FFFFFF',
    textAlign: 'center',
  },
  registroModalFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
  },
  cancelButton: {
    flex: 1,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  cancelButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748B',
  },
  saveButton: {
    flex: 1,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#4CAF50',
  },
  saveButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});