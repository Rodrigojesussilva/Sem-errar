// app/registrar-treino.tsx
import { Feather, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  Dimensions,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';

const { width } = Dimensions.get('window');

const COLORS = {
  primary: '#622db2',
  dot: '#4ecdc4',
  line: 'rgba(112, 82, 230, 0.15)',
  textMain: '#1A1A1A',
  disabled: '#F0F0F0',
  inputBg: '#F8F9FA',
  success: '#622db2',
};

// Interface para registro de exercício
interface ExercicioRegistro {
  nome: string;
  series: {
    numero: number;
    kg: string;
    repeticoes: string;
  }[];
}

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

export default function RegistrarTreinoScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  
  const [treino, setTreino] = useState<Treino | null>(null);
  const [registros, setRegistros] = useState<ExercicioRegistro[]>([]);

  useEffect(() => {
    if (params.treino) {
      try {
        const treinoData = JSON.parse(params.treino as string);
        setTreino(treinoData);
        
        // Inicializa os registros
        const novosRegistros = treinoData.exercicios.map((exercicio: string, index: number) => {
          const seriesCount = parseInt(treinoData.series[index].split('x')[0]) || 3;
          
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
      } catch (error) {
        console.error('Erro ao parsear treino:', error);
      }
    }
  }, [params.treino]);

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
    return { name: 'dumbbell', color: COLORS.primary };
  };

  // Função para renderizar o ícone do exercício
  const renderExerciseIcon = (exercicio: string, size: number = 18) => {
    const icon = getExerciseIcon(exercicio);
    return <MaterialCommunityIcons name={icon.name as any} size={size} color={icon.color} />;
  };

  // Função para atualizar o registro de um exercício
  const atualizarRegistro = (exercicioIndex: number, serieIndex: number, campo: 'kg' | 'repeticoes', valor: string) => {
    const novosRegistros = [...registros];
    novosRegistros[exercicioIndex].series[serieIndex][campo] = valor;
    setRegistros(novosRegistros);
  };

  // Função para voltar para a tela TreinoDiarioScreen
  const voltarParaTreino = () => {
    router.push('/(drawer)/TreinoDiarioScreen');
  };

  // Função para ir para tela de personalizar treino
  const irParaPersonalizarTreino = () => {
    router.push('/EstruturaTreinosScreen');
  };

  // Função para salvar o registro
  const salvarRegistro = () => {
    // Aqui você pode implementar a lógica para salvar os registros
    console.log('Registros salvos:', registros);
    
    Alert.alert(
      'Sucesso',
      'Treino registrado com sucesso!',
      [
        { 
          text: 'OK', 
          onPress: () => {
            router.push('/(drawer)/TreinoDiarioScreen');
          }
        }
      ]
    );
  };

  if (!treino) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Carregando...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#FFFFFF" barStyle="dark-content" />
      
      {/* HEADER COM BOTÃO VOLTAR */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={voltarParaTreino}
          activeOpacity={0.7}
        >
          <View style={styles.backIconCircle}>
            <Ionicons name="arrow-back" size={16} color={COLORS.primary} />
          </View>
          <Text style={styles.backButtonText}>Voltar</Text>
        </TouchableOpacity>
        
        <View style={styles.headerTitleContainer}>
          <MaterialCommunityIcons name="clipboard-text" size={20} color={COLORS.primary} />
          <Text style={styles.headerTitle}>Registrar Treino</Text>
        </View>
        
        <View style={styles.headerRight} />
      </View>

      {/* INFORMAÇÕES DO TREINO */}
      <View style={styles.treinoInfo}>
        <Text style={styles.treinoTipo}>{treino.tipo}</Text>
        <Text style={styles.treinoObs}>{treino.observacao}</Text>
      </View>

      {/* LISTA DE EXERCÍCIOS */}
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {registros.map((exercicio, exercicioIndex) => (
          <View key={exercicioIndex} style={styles.exercicioCard}>
            <View style={styles.exercicioHeader}>
              <View style={[styles.exercicioIcon, { backgroundColor: getExerciseIcon(exercicio.nome).color + '15' }]}>
                {renderExerciseIcon(exercicio.nome, 24)}
              </View>
              <View style={styles.exercicioTitleContainer}>
                <Text style={styles.exercicioNome} numberOfLines={2}>
                  {exercicio.nome}
                </Text>
                <Text style={styles.exercicioSeriesMeta}>
                  {treino.series[exercicioIndex]}
                </Text>
              </View>
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

        {/* BOTÕES DE AÇÃO - ESTILO CONFIGURAR TREINO */}
        <View style={styles.actionButtonsContainer}>
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={voltarParaTreino}
          >
            <Text style={styles.cancelButtonText}>Cancelar</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.customizeButtonWrapper}
            onPress={irParaPersonalizarTreino}
          >
            <LinearGradient
              colors={['#7b42d5', '#622db2', '#4b208c']}
              style={styles.customizeButton}
            >
              <Feather name="edit" size={18} color="#FFFFFF" />
              <Text style={styles.customizeButtonText}>Personalizar</Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.saveButtonWrapper}
            onPress={salvarRegistro}
          >
            <LinearGradient
              colors={['#7b42d5', '#622db2', '#4b208c']}
              style={styles.saveButton}
            >
              <Feather name="check" size={18} color="#FFFFFF" />
              <Text style={styles.saveButtonText}>Salvar</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  
  loadingText: {
    color: COLORS.primary,
    fontWeight: '700',
  },
  
  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 25,
    paddingTop: Platform.OS === 'ios' ? 60 : 50,
    paddingBottom: 20,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backIconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.line,
    elevation: 2,
  },
  backButtonText: {
    color: COLORS.primary,
    fontSize: 16,
    fontWeight: '700',
    marginLeft: 10,
  },
  headerTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.textMain,
  },
  headerRight: {
    width: 40,
  },
  
  // Treino Info
  treinoInfo: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    marginBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  treinoTipo: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.textMain,
    marginBottom: 4,
  },
  treinoObs: {
    fontSize: 13,
    color: '#666',
  },
  
  // ScrollView
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  
  // Exercício Card
  exercicioCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    padding: 18,
    marginBottom: 16,
    borderWidth: 1.5,
    borderColor: '#F0F0F0',
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
  },
  exercicioHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  exercicioIcon: {
    width: 50,
    height: 50,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    flexShrink: 0,
  },
  exercicioTitleContainer: {
    flex: 1,
  },
  exercicioNome: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.textMain,
    marginBottom: 4,
  },
  exercicioSeriesMeta: {
    fontSize: 13,
    color: COLORS.primary,
    fontWeight: '700',
  },
  
  // Table
  tableHeader: {
    flexDirection: 'row',
    paddingHorizontal: 8,
    paddingVertical: 10,
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    marginBottom: 8,
  },
  tableHeaderCell: {
    fontSize: 11,
    fontWeight: '800',
    color: '#888',
    textAlign: 'center',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
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
    fontWeight: '700',
    color: COLORS.primary,
    textAlign: 'center',
  },
  input: {
    height: 45,
    borderWidth: 1.5,
    borderColor: '#F0F0F0',
    borderRadius: 10,
    paddingHorizontal: 12,
    fontSize: 14,
    color: COLORS.textMain,
    backgroundColor: '#F8F9FA',
    textAlign: 'center',
    fontWeight: '600',
  },
  
  // Action Buttons - Estilo Configurar Treino
  actionButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
    marginTop: 20,
    marginBottom: 20,
  },
  cancelButton: {
    flex: 1,
    height: 50,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    borderWidth: 1.5,
    borderColor: '#F0F0F0',
  },
  cancelButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#888',
  },
  customizeButtonWrapper: {
    flex: 1,
    borderRadius: 15,
    overflow: 'hidden',
    elevation: 4,
  },
  customizeButton: {
    height: 50,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  customizeButtonText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  saveButtonWrapper: {
    flex: 1,
    borderRadius: 15,
    overflow: 'hidden',
    elevation: 4,
  },
  saveButton: {
    height: 50,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  saveButtonText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#FFFFFF',
  },
});