// app/(drawer)/treino/DesafioScreen.tsx
import { Feather, Ionicons, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  Animated,
  Easing,
  Platform,
  ScrollView,
  Share,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

// Importar tipos
import {
  AguaData,
  CardioData,
  CategoriaRefeicao,
  MeasurementSummary,
  Refeicao,
  ResumoDiario,
  Treino,
  WeekDay
} from './types';

// Importar componentes das abas
import { AguaTab } from './componentes/AguaTab';
import { CalendarioTab } from './componentes/CalendarioTab';
import { CardioTab } from './componentes/CardioTab';
import { MedicoesTab } from './componentes/MedicoesTab';
import { NutricaoTab } from './componentes/NutricaoTab';
import { TreinoTab } from './componentes/TreinoTab';

// Importar modais
import { AlimentoModal } from './modal/AlimentoModal';
import { CaloriasModal } from './modal/CaloriasModal';
import { CinturaModal } from './modal/CinturaModal';
import { DesafioInfoModal } from './modal/DesafioInfoModal';
import { PesoModal } from './modal/PesoModal';
import { SelecaoTreinoModal } from './modal/SelecaoTreinoModal';

// Dados mockados
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

const TREINO_PADRAO = { diasSemana: 3, dia: 5 };

export default function DesafioScreen() {
  const router = useRouter();
  
  // Estado para controlar qual tela está sendo mostrada
  const [currentScreen, setCurrentScreen] = useState<'desafio' | 'calendario' | 'medicoes' | 'nutricao' | 'cardio' | 'agua' | 'treino'>('desafio');
  
  // Estado para o treino atual
  const [treinoAtual, setTreinoAtual] = useState<Treino>(() => {
    return TABELA_TREINOS[TREINO_PADRAO.diasSemana as keyof typeof TABELA_TREINOS][TREINO_PADRAO.dia - 1];
  });

  // Estado para o modal de seleção
  const [modalVisible, setModalVisible] = useState(false);
  const [tempTreino, setTempTreino] = useState<Treino | null>(null);
  
  // Lista de todos os treinos
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

  // Estado para o dia selecionado no calendário
  const [selectedDay, setSelectedDay] = useState(15);

  // Dados dos dias da semana
  const weekDays: WeekDay[] = [
    { day: 'Dom', date: 10 },
    { day: 'Seg', date: 11 },
    { day: 'Ter', date: 12 },
    { day: 'Qua', date: 13 },
    { day: 'Qui', date: 14 },
    { day: 'Sex', date: 15, today: true },
    { day: 'Sáb', date: 16 },
  ];

  // Nomes dos dias da semana em português
  const diasSemana = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
  const mes = 'Março';

  // Estados para os modais
  const [modalDesafioDiasVisible, setModalDesafioDiasVisible] = useState(false);
  const [weightModalVisible, setWeightModalVisible] = useState(false);
  const [waistModalVisible, setWaistModalVisible] = useState(false);
  const [caloriasModalVisible, setCaloriasModalVisible] = useState(false);
  const [categoriaSelecionada, setCategoriaSelecionada] = useState<string | null>(null);
  const [alimentoModalVisible, setAlimentoModalVisible] = useState(false);
  const [addRefeicaoModalVisible, setAddRefeicaoModalVisible] = useState(false);
  const [scanModalVisible, setScanModalVisible] = useState(false);

  // Estados para os valores editáveis de medição
  const [editingWeight, setEditingWeight] = useState('78.5');
  const [editingWaist, setEditingWaist] = useState('82');
  const [weightTarget, setWeightTarget] = useState('75.0');
  const [waistTarget, setWaistTarget] = useState('78');

  // Dados de medições resumo
  const [measurementsSummary, setMeasurementsSummary] = useState<{
    weight: MeasurementSummary;
    waist: MeasurementSummary;
  }>({
    weight: {
      current: editingWeight,
      unit: 'kg',
      target: weightTarget,
      change: '-3.5',
      progress: 65
    },
    waist: {
      current: editingWaist,
      unit: 'cm',
      target: waistTarget,
      change: '-4',
      progress: 45
    }
  });

  // Dados de calorias
  const [caloriasData, setCaloriasData] = useState({
    consumidas: 1250,
    meta: 2200,
    proteinas: 85,
    metaProteinas: 150,
    carboidratos: 138,
    metaCarboidratos: 275,
    gorduras: 35,
    metaGorduras: 70
  });

  // Dados de cardio
  const [cardioData, setCardioData] = useState<CardioData>({
    duracao: 30,
    distancia: 5,
    calorias: 300,
    frequenciaCardiaca: {
      media: 145,
      max: 165
    },
    pace: '5\'30"',
    tipo: 'Corrida'
  });

  // Dados de água
  const [aguaData, setAguaData] = useState<AguaData>({
    consumido: 750,
    meta: 2200,
    copos: 3,
    historico: [
      { id: '1', quantidade: 250, horario: '08:30' },
      { id: '2', quantidade: 250, horario: '10:15' },
      { id: '3', quantidade: 250, horario: '12:00' }
    ]
  });

  // Categorias de refeição
  const [categoriasRefeicao, setCategoriasRefeicao] = useState<CategoriaRefeicao[]>([
    {
      id: 'cafe',
      nome: 'Café da Manhã',
      icon: 'coffee',
      color: '#8E44AD',
      refeicoes: [
        {
          id: 'cafe1',
          nome: 'Café com Leite',
          calorias: 120,
          proteinas: 6,
          carboidratos: 12,
          gorduras: 5,
          horario: '08:00',
          tipo: 'pre-programada' as const
        },
        {
          id: 'cafe2',
          nome: 'Pão com Ovo',
          calorias: 250,
          proteinas: 12,
          carboidratos: 30,
          gorduras: 8,
          horario: '08:15',
          tipo: 'pre-programada' as const
        }
      ]
    },
    {
      id: 'almoco',
      nome: 'Almoço',
      icon: 'food',
      color: '#F39C12',
      refeicoes: [
        {
          id: 'almoco1',
          nome: 'Frango Grelhado',
          calorias: 350,
          proteinas: 40,
          carboidratos: 10,
          gorduras: 15,
          horario: '12:30',
          tipo: 'pre-programada' as const
        },
        {
          id: 'almoco2',
          nome: 'Arroz e Feijão',
          calorias: 300,
          proteinas: 12,
          carboidratos: 50,
          gorduras: 5,
          horario: '12:30',
          tipo: 'pre-programada' as const
        }
      ]
    },
    {
      id: 'jantar',
      nome: 'Jantar',
      icon: 'food-croissant',
      color: '#27AE60',
      refeicoes: [
        {
          id: 'jantar1',
          nome: 'Salmão Grelhado',
          calorias: 400,
          proteinas: 35,
          carboidratos: 15,
          gorduras: 20,
          horario: '19:00',
          tipo: 'pre-programada' as const
        }
      ]
    },
    {
      id: 'lanches',
      nome: 'Lanches/Outros',
      icon: 'food-apple',
      color: '#E67E22',
      refeicoes: [
        {
          id: 'lanche1',
          nome: 'Banana',
          calorias: 105,
          proteinas: 1,
          carboidratos: 27,
          gorduras: 0,
          horario: '16:00',
          tipo: 'aleatoria' as const
        }
      ]
    }
  ]);

  // Todas as refeições
  const [refeicoes, setRefeicoes] = useState<Refeicao[]>(() => {
    return categoriasRefeicao.flatMap(cat => cat.refeicoes);
  });

  // Dados do desafio
  const [diasSequenciais, setDiasSequenciais] = useState(36);
  const [recordeDias, setRecordeDias] = useState(62);

  // Estado para pesquisa de alimentos
  const [searchQuery, setSearchQuery] = useState('');

  // Alimentos para pesquisa
  const [alimentos, setAlimentos] = useState([
    { id: '1', nome: 'Arroz Branco', calorias: 130, porcao: '100g' },
    { id: '2', nome: 'Feijão Preto', calorias: 77, porcao: '100g' },
    { id: '3', nome: 'Frango Grelhado', calorias: 165, porcao: '100g' },
    { id: '4', nome: 'Batata Doce', calorias: 86, porcao: '100g' },
    { id: '5', nome: 'Ovo Cozido', calorias: 155, porcao: '100g' },
    { id: '6', nome: 'Banana', calorias: 89, porcao: '100g' },
    { id: '7', nome: 'Maçã', calorias: 52, porcao: '100g' },
    { id: '8', nome: 'Peito de Peru', calorias: 110, porcao: '100g' },
  ]);

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

  // Salvar peso
  const handleSaveWeight = () => {
    const current = parseFloat(editingWeight);
    const target = parseFloat(weightTarget);

    const progress = Math.max(0, Math.min(100, ((target - current) / (target - 85)) * 100));

    setMeasurementsSummary(prev => ({
      ...prev,
      weight: {
        ...prev.weight,
        current: editingWeight,
        target: weightTarget,
        progress: Math.round(progress)
      }
    }));

    setWeightModalVisible(false);
  };

  // Salvar cintura
  const handleSaveWaist = () => {
    const current = parseInt(editingWaist);
    const target = parseInt(waistTarget);

    const progress = Math.max(0, Math.min(100, ((115 - current) / (115 - target)) * 100));

    setMeasurementsSummary(prev => ({
      ...prev,
      waist: {
        ...prev.waist,
        current: editingWaist,
        target: waistTarget,
        progress: Math.round(progress)
      }
    }));

    setWaistModalVisible(false);
  };

  // Adicionar refeição
  const handleAddRefeicao = (refeicao: Refeicao, isPreProgramada: boolean = false) => {
    const novaRefeicao = {
      ...refeicao,
      id: Date.now().toString(),
      tipo: isPreProgramada ? 'pre-programada' as const : 'aleatoria' as const
    };
    
    setRefeicoes([...refeicoes, novaRefeicao]);
    
    const novasCalorias = caloriasData.consumidas + novaRefeicao.calorias;
    const novasProteinas = caloriasData.proteinas + novaRefeicao.proteinas;
    const novosCarboidratos = caloriasData.carboidratos + novaRefeicao.carboidratos;
    const novasGorduras = caloriasData.gorduras + novaRefeicao.gorduras;
    
    setCaloriasData({
      ...caloriasData,
      consumidas: novasCalorias,
      proteinas: novasProteinas,
      carboidratos: novosCarboidratos,
      gorduras: novasGorduras
    });
    
    setAddRefeicaoModalVisible(false);
  };

  // Funções para água
  const handleAddCopo = (quantidade: number) => {
    const novoConsumido = aguaData.consumido + quantidade;
    const novoHistorico = [
      ...aguaData.historico,
      {
        id: Date.now().toString(),
        quantidade,
        horario: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
      }
    ];
    
    setAguaData({
      ...aguaData,
      consumido: novoConsumido,
      copos: Math.floor(novoConsumido / 250),
      historico: novoHistorico
    });
  };

  const handleResetAgua = () => {
    setAguaData({
      ...aguaData,
      consumido: 0,
      copos: 0,
      historico: []
    });
  };

  // Remover refeição
  const handleRemoveRefeicao = (id: string) => {
    const refeicaoRemovida = refeicoes.find(r => r.id === id);
    if (refeicaoRemovida) {
      const novasCalorias = caloriasData.consumidas - refeicaoRemovida.calorias;
      const novasProteinas = caloriasData.proteinas - refeicaoRemovida.proteinas;
      const novosCarboidratos = caloriasData.carboidratos - refeicaoRemovida.carboidratos;
      const novasGorduras = caloriasData.gorduras - refeicaoRemovida.gorduras;
      
      setCaloriasData({
        ...caloriasData,
        consumidas: novasCalorias,
        proteinas: novasProteinas,
        carboidratos: novosCarboidratos,
        gorduras: novasGorduras
      });
    }
    
    setRefeicoes(refeicoes.filter(r => r.id !== id));
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

  // Calcular progresso
  const totalExercicios = treinoAtual.exercicios?.length || 0;

  // Navegar para tela de registro
  const irParaRegistro = () => {
    router.push({
      pathname: '/registrar-treino',
      params: { 
        treino: JSON.stringify(treinoAtual)
      }
    });
  };

  // Calcular progresso das calorias
  const progressoCalorias = (caloriasData.consumidas / caloriasData.meta) * 100;
  const progressoProteinas = (caloriasData.proteinas / caloriasData.metaProteinas) * 100;
  const progressoCarboidratos = (caloriasData.carboidratos / caloriasData.metaCarboidratos) * 100;
  const progressoGorduras = (caloriasData.gorduras / caloriasData.metaGorduras) * 100;

  // Filtrar alimentos por pesquisa
  const filteredAlimentos = alimentos.filter(alimento => 
    alimento.nome.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Encontrar o dia atual
  const hoje = weekDays.find(d => d.today) || weekDays[5];
  
  // Criar resumo diário
  const resumoDiario: ResumoDiario = {
    desafio: {
      sequencia: diasSequenciais,
      recorde: recordeDias,
      preenchido: true
    },
    calendario: {
      diaSelecionado: selectedDay,
      diaSemana: diasSemana[new Date().getDay()],
      data: `${selectedDay} de ${mes}`,
      preenchido: true
    },
    medicoes: {
      peso: measurementsSummary.weight.current,
      cintura: measurementsSummary.waist.current,
      pesoProgresso: measurementsSummary.weight.progress,
      cinturaProgresso: measurementsSummary.waist.progress,
      pesoPreenchido: true,
      cinturaPreenchida: true
    },
    nutricao: {
      caloriasConsumidas: caloriasData.consumidas,
      caloriasMeta: caloriasData.meta,
      proteinas: caloriasData.proteinas,
      carboidratos: caloriasData.carboidratos,
      gorduras: caloriasData.gorduras,
      refeicoesHoje: refeicoes.length,
      preenchido: refeicoes.length > 0 || caloriasData.consumidas > 0
    }
  };

  // Definir as abas
  const tabs = [
    { id: 'desafio', label: 'Desafio', icon: 'trophy' },
    { id: 'calendario', label: 'Semana', icon: 'calendar' },
    { id: 'medicoes', label: 'Medidas', icon: 'human' },
    { id: 'nutricao', label: 'Nutrição', icon: 'food' },
    { id: 'cardio', label: 'Cardio', icon: 'run-fast' },
    { id: 'agua', label: 'Água', icon: 'water' },
    { id: 'treino', label: 'Treino', icon: 'dumbbell' },
  ];

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#F8FAFC" barStyle="dark-content" />
      
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.push('/dados')}
        >
          <Ionicons name="arrow-back" size={22} color="#1E88E5" />
        </TouchableOpacity>
        
        <Text style={styles.headerTitle}>Treino Diário</Text>
        
        <TouchableOpacity
          style={styles.shareButton}
          onPress={shareResults}
        >
          <Feather name="share-2" size={20} color="#1E88E5" />
        </TouchableOpacity>
      </View>

      {/* TABS */}
      <View style={styles.tabsWrapper}>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tabsScrollContent}
        >
          {tabs.map((tab) => (
            <TouchableOpacity
              key={tab.id}
              style={[
                styles.tabButton,
                currentScreen === tab.id && styles.tabButtonActive
              ]}
              onPress={() => setCurrentScreen(tab.id as any)}
            >
              <MaterialCommunityIcons 
                name={tab.icon as any} 
                size={18} 
                color={currentScreen === tab.id ? '#1E88E5' : '#64748B'} 
              />
              <Text style={[
                styles.tabButtonText,
                currentScreen === tab.id && styles.tabButtonTextActive
              ]}>
                {tab.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* CONTEÚDO */}
      <Animated.View
        style={[
          styles.contentContainer,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        {currentScreen === 'desafio' && (
          <ScrollView style={styles.screenContainer} showsVerticalScrollIndicator={false}>
            {/* CARD DO DESAFIO DIÁRIO */}
            <TouchableOpacity 
              style={styles.desafioCard}
              onPress={() => setModalDesafioDiasVisible(true)}
              activeOpacity={0.7}
            >
              <View style={styles.desafioHeader}>
                <View style={styles.desafioTitleContainer}>
                  <LinearGradient
                    colors={['#1E88E5', '#8E44AD']}
                    style={styles.desafioIconGradient}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                  >
                    <MaterialCommunityIcons name="trophy" size={20} color="#FFFFFF" />
                  </LinearGradient>
                  <Text style={styles.desafioTitle}>DESAFIO DIÁRIO</Text>
                </View>
                <TouchableOpacity 
                  style={styles.desafioInfoButton}
                  onPress={() => setModalDesafioDiasVisible(true)}
                >
                  <MaterialCommunityIcons name="information" size={20} color="#64748B" />
                </TouchableOpacity>
              </View>

              <View style={styles.streakContainer}>
                <View style={styles.streakItem}>
                  <Text style={styles.streakNumber}>{diasSequenciais}</Text>
                  <Text style={styles.streakLabel}>dias</Text>
                  <View style={styles.streakBadge}>
                    <Text style={styles.streakBadgeText}>SEQUÊNCIA ATUAL</Text>
                  </View>
                </View>

                <View style={styles.streakDivider}>
                  <MaterialCommunityIcons name="flash" size={32} color="#FFC107" />
                </View>

                <View style={styles.streakItem}>
                  <Text style={styles.streakNumber}>{recordeDias}</Text>
                  <Text style={styles.streakLabel}>dias</Text>
                  <View style={[styles.streakBadge, styles.recordBadge]}>
                    <Text style={[styles.streakBadgeText, styles.recordBadgeText]}>RECORDE</Text>
                  </View>
                </View>
              </View>

              <View style={styles.desafioTip}>
                <MaterialCommunityIcons name="lightbulb-outline" size={16} color="#FFC107" />
                <Text style={styles.desafioTipText}>
                  Mantenha a sequência! Você está a {recordeDias - diasSequenciais} dias do recorde.
                </Text>
              </View>
            </TouchableOpacity>

            {/* CARD DE CALENDÁRIO */}
            <TouchableOpacity 
              style={styles.resumoCard}
              onPress={() => setCurrentScreen('calendario')}
              activeOpacity={0.7}
            >
              <View style={styles.resumoCardHeader}>
                <View style={[styles.resumoIconCircle, { backgroundColor: '#E3F2FD' }]}>
                  <MaterialCommunityIcons name="calendar" size={22} color="#1E88E5" />
                </View>
                <View style={styles.resumoCardTitleContainer}>
                  <Text style={styles.resumoCardTitle}>Calendário</Text>
                  <Text style={styles.resumoCardSubtitle}>Esta semana</Text>
                </View>
                {resumoDiario.calendario.preenchido && (
                  <View style={styles.resumoBadge}>
                    <MaterialCommunityIcons name="check-circle" size={18} color="#4CAF50" />
                  </View>
                )}
              </View>

              <View style={styles.resumoCardContent}>
                <View style={styles.calendarioInfo}>
                  <Text style={styles.calendarioDia}>{resumoDiario.calendario.diaSemana}</Text>
                  <Text style={styles.calendarioData}>{resumoDiario.calendario.data}</Text>
                </View>
                <View style={styles.calendarioBadge}>
                  <Text style={styles.calendarioBadgeText}>Dia {resumoDiario.calendario.diaSelecionado}</Text>
                </View>
              </View>

              <View style={styles.resumoCardFooter}>
                <Text style={styles.resumoCardFooterText}>Toque para ver calendário completo</Text>
                <MaterialIcons name="arrow-forward-ios" size={12} color="#1E88E5" />
              </View>
            </TouchableOpacity>

            {/* CARD DE MEDIÇÕES */}
            <TouchableOpacity 
              style={styles.resumoCard}
              onPress={() => setCurrentScreen('medicoes')}
              activeOpacity={0.7}
            >
              <View style={styles.resumoCardHeader}>
                <View style={[styles.resumoIconCircle, { backgroundColor: '#FFEBEE' }]}>
                  <MaterialCommunityIcons name="human" size={22} color="#EA4335" />
                </View>
                <View style={styles.resumoCardTitleContainer}>
                  <Text style={styles.resumoCardTitle}>Medições</Text>
                  <Text style={styles.resumoCardSubtitle}>Peso e cintura</Text>
                </View>
                {(resumoDiario.medicoes.pesoPreenchido || resumoDiario.medicoes.cinturaPreenchida) && (
                  <View style={styles.resumoBadge}>
                    <MaterialCommunityIcons name="check-circle" size={18} color="#4CAF50" />
                  </View>
                )}
              </View>

              <View style={styles.medicoesGrid}>
                <View style={styles.medicaoItem}>
                  <Text style={styles.medicaoLabel}>Peso</Text>
                  <View style={styles.medicaoValorContainer}>
                    <Text style={styles.medicaoValor}>{resumoDiario.medicoes.peso}</Text>
                    <Text style={styles.medicaoUnidade}>kg</Text>
                  </View>
                  <View style={styles.medicaoProgresso}>
                    <View style={styles.medicaoProgressoBar}>
                      <View 
                        style={[
                          styles.medicaoProgressoFill, 
                          { width: `${resumoDiario.medicoes.pesoProgresso}%`, backgroundColor: '#EA4335' }
                        ]} 
                      />
                    </View>
                    <Text style={styles.medicaoProgressoText}>{resumoDiario.medicoes.pesoProgresso}%</Text>
                  </View>
                </View>

                <View style={styles.medicaoDivider} />

                <View style={styles.medicaoItem}>
                  <Text style={styles.medicaoLabel}>Cintura</Text>
                  <View style={styles.medicaoValorContainer}>
                    <Text style={styles.medicaoValor}>{resumoDiario.medicoes.cintura}</Text>
                    <Text style={styles.medicaoUnidade}>cm</Text>
                  </View>
                  <View style={styles.medicaoProgresso}>
                    <View style={styles.medicaoProgressoBar}>
                      <View 
                        style={[
                          styles.medicaoProgressoFill, 
                          { width: `${resumoDiario.medicoes.cinturaProgresso}%`, backgroundColor: '#FBBC04' }
                        ]} 
                      />
                    </View>
                    <Text style={styles.medicaoProgressoText}>{resumoDiario.medicoes.cinturaProgresso}%</Text>
                  </View>
                </View>
              </View>

              <View style={styles.resumoCardFooter}>
                <Text style={styles.resumoCardFooterText}>Toque para registrar medições</Text>
                <MaterialIcons name="arrow-forward-ios" size={12} color="#1E88E5" />
              </View>
            </TouchableOpacity>

            {/* CARD DE NUTRIÇÃO */}
            <TouchableOpacity 
              style={styles.resumoCard}
              onPress={() => setCurrentScreen('nutricao')}
              activeOpacity={0.7}
            >
              <View style={styles.resumoCardHeader}>
                <View style={[styles.resumoIconCircle, { backgroundColor: '#FFF3E0' }]}>
                  <MaterialCommunityIcons name="food" size={22} color="#F39C12" />
                </View>
                <View style={styles.resumoCardTitleContainer}>
                  <Text style={styles.resumoCardTitle}>Nutrição</Text>
                  <Text style={styles.resumoCardSubtitle}>Calorias e macronutrientes</Text>
                </View>
                {resumoDiario.nutricao.preenchido && (
                  <View style={styles.resumoBadge}>
                    <MaterialCommunityIcons name="check-circle" size={18} color="#4CAF50" />
                  </View>
                )}
              </View>

              <View style={styles.nutricaoCalorias}>
                <Text style={styles.nutricaoCaloriasLabel}>Calorias</Text>
                <View style={styles.nutricaoCaloriasValores}>
                  <Text style={styles.nutricaoCaloriasAtual}>{resumoDiario.nutricao.caloriasConsumidas}</Text>
                  <Text style={styles.nutricaoCaloriasSeparador}>/</Text>
                  <Text style={styles.nutricaoCaloriasMeta}>{resumoDiario.nutricao.caloriasMeta}</Text>
                  <Text style={styles.nutricaoCaloriasUnidade}>kcal</Text>
                </View>
                <View style={styles.nutricaoProgressoBar}>
                  <View 
                    style={[
                      styles.nutricaoProgressoFill, 
                      { width: `${Math.min((resumoDiario.nutricao.caloriasConsumidas / resumoDiario.nutricao.caloriasMeta) * 100, 100)}%` }
                    ]} 
                  />
                </View>
              </View>

              <View style={styles.macrosContainer}>
                <View style={styles.macroItemCard}>
                  <Text style={styles.macroLabelCard}>Proteínas</Text>
                  <Text style={styles.macroValorCard}>{resumoDiario.nutricao.proteinas}g</Text>
                </View>
                <View style={styles.macroItemCard}>
                  <Text style={styles.macroLabelCard}>Carboidratos</Text>
                  <Text style={styles.macroValorCard}>{resumoDiario.nutricao.carboidratos}g</Text>
                </View>
                <View style={styles.macroItemCard}>
                  <Text style={styles.macroLabelCard}>Gorduras</Text>
                  <Text style={styles.macroValorCard}>{resumoDiario.nutricao.gorduras}g</Text>
                </View>
              </View>

              <View style={styles.refeicoesCount}>
                <MaterialCommunityIcons name="food-variant" size={14} color="#64748B" />
                <Text style={styles.refeicoesCountText}>
                  {resumoDiario.nutricao.refeicoesHoje} {resumoDiario.nutricao.refeicoesHoje === 1 ? 'refeição' : 'refeições'} registradas hoje
                </Text>
              </View>

              <View style={styles.resumoCardFooter}>
                <Text style={styles.resumoCardFooterText}>Toque para registrar refeições</Text>
                <MaterialIcons name="arrow-forward-ios" size={12} color="#1E88E5" />
              </View>
            </TouchableOpacity>

            {/* CARD DE CARDIO */}
            <TouchableOpacity 
              style={styles.resumoCard}
              onPress={() => setCurrentScreen('cardio')}
              activeOpacity={0.7}
            >
              <View style={styles.resumoCardHeader}>
                <View style={[styles.resumoIconCircle, { backgroundColor: '#FEF2F2' }]}>
                  <MaterialCommunityIcons name="run-fast" size={22} color="#EA4335" />
                </View>
                <View style={styles.resumoCardTitleContainer}>
                  <Text style={styles.resumoCardTitle}>Cardio</Text>
                  <Text style={styles.resumoCardSubtitle}>Treino cardiovascular</Text>
                </View>
              </View>

              <View style={styles.cardioStats}>
                <View style={styles.cardioStat}>
                  <Text style={styles.cardioStatValue}>{cardioData.duracao}</Text>
                  <Text style={styles.cardioStatLabel}>min</Text>
                </View>
                <View style={styles.cardioStatDivider} />
                <View style={styles.cardioStat}>
                  <Text style={styles.cardioStatValue}>{cardioData.distancia}</Text>
                  <Text style={styles.cardioStatLabel}>km</Text>
                </View>
                <View style={styles.cardioStatDivider} />
                <View style={styles.cardioStat}>
                  <Text style={styles.cardioStatValue}>{cardioData.calorias}</Text>
                  <Text style={styles.cardioStatLabel}>kcal</Text>
                </View>
              </View>

              <View style={styles.cardioInfo}>
                <View style={styles.cardioInfoItem}>
                  <MaterialCommunityIcons name="heart-pulse" size={14} color="#64748B" />
                  <Text style={styles.cardioInfoText}>FC: {cardioData.frequenciaCardiaca.media} bpm</Text>
                </View>
                <View style={styles.cardioInfoItem}>
                  <MaterialCommunityIcons name="speedometer" size={14} color="#64748B" />
                  <Text style={styles.cardioInfoText}>Pace: {cardioData.pace}</Text>
                </View>
              </View>

              <View style={styles.resumoCardFooter}>
                <Text style={styles.resumoCardFooterText}>Toque para ver detalhes do cardio</Text>
                <MaterialIcons name="arrow-forward-ios" size={12} color="#1E88E5" />
              </View>
            </TouchableOpacity>

            {/* CARD DE ÁGUA */}
            <TouchableOpacity 
              style={styles.resumoCard}
              onPress={() => setCurrentScreen('agua')}
              activeOpacity={0.7}
            >
              <View style={styles.resumoCardHeader}>
                <View style={[styles.resumoIconCircle, { backgroundColor: '#E3F2FD' }]}>
                  <MaterialCommunityIcons name="water" size={22} color="#1E88E5" />
                </View>
                <View style={styles.resumoCardTitleContainer}>
                  <Text style={styles.resumoCardTitle}>Hidratação</Text>
                  <Text style={styles.resumoCardSubtitle}>Consumo de água</Text>
                </View>
              </View>

              <View style={styles.aguaStats}>
                <View style={styles.aguaStat}>
                  <Text style={styles.aguaStatValue}>{aguaData.consumido}</Text>
                  <Text style={styles.aguaStatLabel}>ml</Text>
                </View>
                <View style={styles.aguaStatDivider} />
                <View style={styles.aguaStat}>
                  <Text style={styles.aguaStatValue}>{aguaData.meta}</Text>
                  <Text style={styles.aguaStatLabel}>meta</Text>
                </View>
                <View style={styles.aguaStatDivider} />
                <View style={styles.aguaStat}>
                  <Text style={styles.aguaStatValue}>{aguaData.copos}</Text>
                  <Text style={styles.aguaStatLabel}>copos</Text>
                </View>
              </View>

              <View style={styles.aguaProgresso}>
                <View style={styles.aguaProgressoBar}>
                  <View 
                    style={[
                      styles.aguaProgressoFill, 
                      { width: `${Math.min((aguaData.consumido / aguaData.meta) * 100, 100)}%` }
                    ]} 
                  />
                </View>
                <Text style={styles.aguaProgressoText}>
                  {Math.round((aguaData.consumido / aguaData.meta) * 100)}% da meta
                </Text>
              </View>

              <View style={styles.resumoCardFooter}>
                <Text style={styles.resumoCardFooterText}>Toque para registrar consumo</Text>
                <MaterialIcons name="arrow-forward-ios" size={12} color="#1E88E5" />
              </View>
            </TouchableOpacity>

            {/* CARD DE TREINO */}
            <TouchableOpacity 
              style={styles.resumoCard}
              onPress={() => setCurrentScreen('treino')}
              activeOpacity={0.7}
            >
              <View style={styles.resumoCardHeader}>
                <View style={[styles.resumoIconCircle, { backgroundColor: '#E8F5E9' }]}>
                  <MaterialCommunityIcons name="dumbbell" size={22} color="#4CAF50" />
                </View>
                <View style={styles.resumoCardTitleContainer}>
                  <Text style={styles.resumoCardTitle}>Treino</Text>
                  <Text style={styles.resumoCardSubtitle}>Treino de hoje</Text>
                </View>
              </View>

              <View style={styles.treinoStats}>
                <View style={styles.treinoStat}>
                  <Text style={styles.treinoStatValue}>{totalExercicios}</Text>
                  <Text style={styles.treinoStatLabel}>exercícios</Text>
                </View>
                <View style={styles.treinoStatDivider} />
                <View style={styles.treinoStat}>
                  <Text style={styles.treinoStatValue}>{treinoAtual.tipo}</Text>
                  <Text style={styles.treinoStatLabel}>tipo</Text>
                </View>
              </View>

              <View style={styles.treinoExerciciosPreview}>
                {treinoAtual.exercicios.slice(0, 3).map((ex, idx) => (
                  <Text key={idx} style={styles.treinoExercicioPreview}>• {ex}</Text>
                ))}
                {treinoAtual.exercicios.length > 3 && (
                  <Text style={styles.treinoExercicioMais}>+{treinoAtual.exercicios.length - 3}</Text>
                )}
              </View>

              <View style={styles.resumoCardFooter}>
                <Text style={styles.resumoCardFooterText}>Toque para ver treino completo</Text>
                <MaterialIcons name="arrow-forward-ios" size={12} color="#1E88E5" />
              </View>
            </TouchableOpacity>

            {/* CARD DE PROGRESSO GERAL */}
            <View style={styles.progressoGeralCard}>
              <Text style={styles.progressoGeralTitle}>Progresso do Dia</Text>
              <View style={styles.progressoGeralBarras}>
                <View style={styles.progressoGeralItem}>
                  <Text style={styles.progressoGeralItemLabel}>Desafio</Text>
                  <View style={styles.progressoGeralItemBar}>
                    <View style={[styles.progressoGeralItemFill, { width: resumoDiario.desafio.preenchido ? '100%' : '0%', backgroundColor: '#8E44AD' }]} />
                  </View>
                </View>
                <View style={styles.progressoGeralItem}>
                  <Text style={styles.progressoGeralItemLabel}>Calendário</Text>
                  <View style={styles.progressoGeralItemBar}>
                    <View style={[styles.progressoGeralItemFill, { width: resumoDiario.calendario.preenchido ? '100%' : '0%', backgroundColor: '#1E88E5' }]} />
                  </View>
                </View>
                <View style={styles.progressoGeralItem}>
                  <Text style={styles.progressoGeralItemLabel}>Medições</Text>
                  <View style={styles.progressoGeralItemBar}>
                    <View 
                      style={[
                        styles.progressoGeralItemFill, 
                        { 
                          width: `${((resumoDiario.medicoes.pesoPreenchido ? 1 : 0) + (resumoDiario.medicoes.cinturaPreenchida ? 1 : 0)) * 50}%`, 
                          backgroundColor: '#EA4335' 
                        }
                      ]} 
                    />
                  </View>
                </View>
                <View style={styles.progressoGeralItem}>
                  <Text style={styles.progressoGeralItemLabel}>Nutrição</Text>
                  <View style={styles.progressoGeralItemBar}>
                    <View style={[styles.progressoGeralItemFill, { width: resumoDiario.nutricao.preenchido ? '100%' : '0%', backgroundColor: '#F39C12' }]} />
                  </View>
                </View>
                <View style={styles.progressoGeralItem}>
                  <Text style={styles.progressoGeralItemLabel}>Cardio</Text>
                  <View style={styles.progressoGeralItemBar}>
                    <View style={[styles.progressoGeralItemFill, { width: '60%', backgroundColor: '#EA4335' }]} />
                  </View>
                </View>
                <View style={styles.progressoGeralItem}>
                  <Text style={styles.progressoGeralItemLabel}>Água</Text>
                  <View style={styles.progressoGeralItemBar}>
                    <View style={[styles.progressoGeralItemFill, { width: `${(aguaData.consumido / aguaData.meta) * 100}%`, backgroundColor: '#1E88E5' }]} />
                  </View>
                </View>
              </View>
              <View style={styles.progressoGeralTotal}>
                <Text style={styles.progressoGeralTotalText}>
                  {Math.round(
                    ((resumoDiario.desafio.preenchido ? 1 : 0) +
                    (resumoDiario.calendario.preenchido ? 1 : 0) +
                    ((resumoDiario.medicoes.pesoPreenchido || resumoDiario.medicoes.cinturaPreenchida) ? 1 : 0) +
                    (resumoDiario.nutricao.preenchido ? 1 : 0) +
                    0.6 + // Cardio (60%)
                    (aguaData.consumido / aguaData.meta)) / 6 * 100
                  )}% completo
                </Text>
              </View>
            </View>
          </ScrollView>
        )}

        {currentScreen === 'calendario' && (
          <CalendarioTab 
            weekDays={weekDays}
            selectedDay={selectedDay}
            onDaySelect={setSelectedDay}
          />
        )}

        {currentScreen === 'medicoes' && (
          <MedicoesTab 
            measurementsSummary={measurementsSummary}
            onWeightPress={() => setWeightModalVisible(true)}
            onWaistPress={() => setWaistModalVisible(true)}
          />
        )}

        {currentScreen === 'nutricao' && (
          <NutricaoTab 
            caloriasData={caloriasData}
            progressoCalorias={progressoCalorias}
            progressoProteinas={progressoProteinas}
            progressoCarboidratos={progressoCarboidratos}
            progressoGorduras={progressoGorduras}
            categoriasRefeicao={categoriasRefeicao}
            onCardPress={() => setCaloriasModalVisible(true)}
            onCategoriaPress={(id: string) => {
              setCategoriaSelecionada(id);
              setAlimentoModalVisible(true);
            }}
            onPersonalizarPress={() => router.push('/refeicoes')}
          />
        )}

        {currentScreen === 'cardio' && (
          <CardioTab 
            cardioData={cardioData}
            onIniciarPress={() => console.log('Iniciar treino cardio')}
            onHistoricoPress={() => console.log('Ver histórico cardio')}
            onConfigPress={() => console.log('Configurar cardio')}
          />
        )}

        {currentScreen === 'agua' && (
          <AguaTab 
            aguaData={aguaData}
            onAddCopo={handleAddCopo}
            onReset={handleResetAgua}
            onInfoPress={() => console.log('Info água')}
          />
        )}

        {currentScreen === 'treino' && (
          <TreinoTab 
            treinoAtual={treinoAtual}
            totalExercicios={totalExercicios}
            getExerciseIcon={getExerciseIcon}
            renderExerciseIcon={renderExerciseIcon}
            onPreconfigPress={() => {
              setTempTreino(null);
              setModalVisible(true);
            }}
            onRegisterPress={irParaRegistro}
          />
        )}
      </Animated.View>

      {/* MODAIS */}
      <CaloriasModal
        visible={caloriasModalVisible}
        onClose={() => setCaloriasModalVisible(false)}
        caloriasData={{ consumidas: caloriasData.consumidas, meta: caloriasData.meta }}
        progressoCalorias={progressoCalorias}
        categoriasRefeicao={categoriasRefeicao}
        onCategoriaPress={(id) => {
          setCategoriaSelecionada(id);
          setAlimentoModalVisible(true);
        }}
        onCriarRefeicoesPress={() => {
          setCaloriasModalVisible(false);
          router.push('/refeicoes');
        }}
      />

      <AlimentoModal
        visible={alimentoModalVisible}
        onClose={() => setAlimentoModalVisible(false)}
        categoriaNome={categoriasRefeicao.find(c => c.id === categoriaSelecionada)?.nome || 'Alimentos'}
        categoriaIcon={categoriasRefeicao.find(c => c.id === categoriaSelecionada)?.icon || 'food'}
        categoriaCor={categoriasRefeicao.find(c => c.id === categoriaSelecionada)?.color || '#F39C12'}
        alimentos={filteredAlimentos}
      />

      <PesoModal
        visible={weightModalVisible}
        onClose={() => setWeightModalVisible(false)}
        editingWeight={editingWeight}
        setEditingWeight={setEditingWeight}
        weightTarget={weightTarget}
        setWeightTarget={setWeightTarget}
        onSave={handleSaveWeight}
      />

      <CinturaModal
        visible={waistModalVisible}
        onClose={() => setWaistModalVisible(false)}
        editingWaist={editingWaist}
        setEditingWaist={setEditingWaist}
        waistTarget={waistTarget}
        setWaistTarget={setWaistTarget}
        onSave={handleSaveWaist}
      />

      <DesafioInfoModal
        visible={modalDesafioDiasVisible}
        onClose={() => setModalDesafioDiasVisible(false)}
        diasSequenciais={diasSequenciais}
        recordeDias={recordeDias}
      />

      <SelecaoTreinoModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        treinos={todosTreinos}
        tempTreino={tempTreino}
        onSelectTreino={selecionarTreinoTemp}
        onAplicar={aplicarTreinoSelecionado}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
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
  tabsWrapper: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  tabsScrollContent: {
    paddingHorizontal: 12,
    paddingVertical: 12,
    gap: 8,
  },
  tabButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 6,
    backgroundColor: '#F8FAFC',
    marginHorizontal: 4,
  },
  tabButtonActive: {
    backgroundColor: '#E3F2FD',
  },
  tabButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#64748B',
  },
  tabButtonTextActive: {
    color: '#1E88E5',
  },
  contentContainer: {
    flex: 1,
  },
  screenContainer: {
    flex: 1,
    padding: 16,
  },
  desafioCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 4,
    borderWidth: 1.5,
    borderColor: '#F1F5F9',
  },
  desafioHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  desafioTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  desafioIconGradient: {
    width: 42,
    height: 42,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#1E88E5',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  desafioTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1E293B',
    letterSpacing: 0.5,
  },
  desafioInfoButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  streakContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  streakItem: {
    alignItems: 'center',
    flex: 1,
  },
  streakNumber: {
    fontSize: 42,
    fontWeight: '800',
    color: '#1E293B',
    lineHeight: 48,
  },
  streakLabel: {
    fontSize: 14,
    color: '#64748B',
    marginBottom: 8,
    fontWeight: '500',
  },
  streakBadge: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  streakBadgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#475569',
    letterSpacing: 0.3,
  },
  recordBadge: {
    backgroundColor: '#FFEAA7',
  },
  recordBadgeText: {
    color: '#B76E00',
  },
  streakDivider: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FFF9E6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  desafioTip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  desafioTipText: {
    fontSize: 13,
    color: '#B76E00',
    flex: 1,
  },
  resumoCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  resumoCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  resumoIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  resumoCardTitleContainer: {
    flex: 1,
  },
  resumoCardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 2,
  },
  resumoCardSubtitle: {
    fontSize: 12,
    color: '#64748B',
  },
  resumoBadge: {
    marginLeft: 8,
  },
  resumoCardContent: {
    marginBottom: 12,
  },
  resumoCardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    gap: 4,
  },
  resumoCardFooterText: {
    fontSize: 11,
    color: '#1E88E5',
    fontWeight: '500',
  },
  calendarioInfo: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  calendarioDia: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1E293B',
  },
  calendarioData: {
    fontSize: 14,
    color: '#64748B',
  },
  calendarioBadge: {
    backgroundColor: '#E3F2FD',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  calendarioBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1E88E5',
  },
  medicoesGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  medicaoItem: {
    flex: 1,
  },
  medicaoLabel: {
    fontSize: 12,
    color: '#64748B',
    marginBottom: 4,
  },
  medicaoValorContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 6,
  },
  medicaoValor: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1E293B',
  },
  medicaoUnidade: {
    fontSize: 12,
    color: '#64748B',
    marginLeft: 2,
  },
  medicaoProgresso: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  medicaoProgressoBar: {
    flex: 1,
    height: 4,
    backgroundColor: '#E2E8F0',
    borderRadius: 2,
    overflow: 'hidden',
  },
  medicaoProgressoFill: {
    height: '100%',
    borderRadius: 2,
  },
  medicaoProgressoText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#64748B',
  },
  medicaoDivider: {
    width: 1,
    height: 40,
    backgroundColor: '#E2E8F0',
    marginHorizontal: 12,
  },
  nutricaoCalorias: {
    marginBottom: 12,
  },
  nutricaoCaloriasLabel: {
    fontSize: 12,
    color: '#64748B',
    marginBottom: 4,
  },
  nutricaoCaloriasValores: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 8,
  },
  nutricaoCaloriasAtual: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1E293B',
  },
  nutricaoCaloriasSeparador: {
    fontSize: 18,
    color: '#94A3B8',
    marginHorizontal: 4,
  },
  nutricaoCaloriasMeta: {
    fontSize: 18,
    color: '#94A3B8',
  },
  nutricaoCaloriasUnidade: {
    fontSize: 12,
    color: '#64748B',
    marginLeft: 4,
  },
  nutricaoProgressoBar: {
    height: 6,
    backgroundColor: '#E2E8F0',
    borderRadius: 3,
    overflow: 'hidden',
  },
  nutricaoProgressoFill: {
    height: '100%',
    backgroundColor: '#F39C12',
    borderRadius: 3,
  },
  macrosContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  macroItemCard: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 6,
    backgroundColor: '#F8FAFC',
    borderRadius: 8,
    marginHorizontal: 2,
  },
  macroLabelCard: {
    fontSize: 10,
    color: '#64748B',
    marginBottom: 2,
  },
  macroValorCard: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1E293B',
  },
  refeicoesCount: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 6,
  },
  refeicoesCountText: {
    fontSize: 11,
    color: '#64748B',
  },
  cardioStats: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    marginBottom: 8,
  },
  cardioStat: {
    alignItems: 'center',
  },
  cardioStatValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1E293B',
  },
  cardioStatLabel: {
    fontSize: 11,
    color: '#64748B',
  },
  cardioStatDivider: {
    width: 1,
    height: 30,
    backgroundColor: '#E2E8F0',
  },
  cardioInfo: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 8,
  },
  cardioInfoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  cardioInfoText: {
    fontSize: 12,
    color: '#64748B',
  },
  aguaStats: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    marginBottom: 8,
  },
  aguaStat: {
    alignItems: 'center',
  },
  aguaStatValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1E293B',
  },
  aguaStatLabel: {
    fontSize: 11,
    color: '#64748B',
  },
  aguaStatDivider: {
    width: 1,
    height: 30,
    backgroundColor: '#E2E8F0',
  },
  aguaProgresso: {
    marginBottom: 8,
  },
  aguaProgressoBar: {
    height: 6,
    backgroundColor: '#E2E8F0',
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 4,
  },
  aguaProgressoFill: {
    height: '100%',
    backgroundColor: '#1E88E5',
    borderRadius: 3,
  },
  aguaProgressoText: {
    fontSize: 11,
    color: '#64748B',
    textAlign: 'right',
  },
  treinoStats: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    marginBottom: 8,
  },
  treinoStat: {
    alignItems: 'center',
  },
  treinoStatValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1E293B',
  },
  treinoStatLabel: {
    fontSize: 11,
    color: '#64748B',
  },
  treinoStatDivider: {
    width: 1,
    height: 30,
    backgroundColor: '#E2E8F0',
  },
  treinoExerciciosPreview: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  treinoExercicioPreview: {
    fontSize: 12,
    color: '#64748B',
  },
  treinoExercicioMais: {
    fontSize: 11,
    color: '#1E88E5',
    fontWeight: '500',
  },
  progressoGeralCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginTop: 8,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  progressoGeralTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#334155',
    marginBottom: 12,
  },
  progressoGeralBarras: {
    gap: 10,
    marginBottom: 12,
  },
  progressoGeralItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  progressoGeralItemLabel: {
    width: 65,
    fontSize: 12,
    color: '#64748B',
  },
  progressoGeralItemBar: {
    flex: 1,
    height: 8,
    backgroundColor: '#E2E8F0',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressoGeralItemFill: {
    height: '100%',
    borderRadius: 4,
  },
  progressoGeralTotal: {
    alignItems: 'center',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  progressoGeralTotalText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4CAF50',
  },
});