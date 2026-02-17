import {
  Feather,
  MaterialCommunityIcons,
  MaterialIcons
} from '@expo/vector-icons';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback, useRef, useState } from 'react';
import {
  Alert,
  Animated,
  Dimensions,
  Easing,
  FlatList,
  Image,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  SafeAreaView,
  StatusBar
} from 'react-native';

const { width, height: SCREEN_HEIGHT } = Dimensions.get('window');

const COLORS = {
  primary: '#622db2',
  dot: '#4ecdc4',
  line: 'rgba(112, 82, 230, 0.15)',
  textMain: '#1A1A1A',
  disabled: '#F0F0F0',
  inputBg: '#F8F9FA',
  success: '#622db2' // Alterado de verde para Roxo conforme pedido
};

// Tipos
type Exercicio = {
  id: string;
  nome: string;
  grupoMuscular: string;
  icone: string;
};

type ExercicioConfigurado = {
  id: string;
  nome: string;
  series: number;
  repeticoes: string;
  descanso: string;
  grupoMuscular: string;
  icone: string;
  cor: string;
};

type Treino = {
  id: string;
  nome: string;
  configurado: boolean;
  exercicios: ExercicioConfigurado[];
};

export default function ConfiguracaoTreinosScreen() {
  const router = useRouter();
  const [quantidadeTreinos, setQuantidadeTreinos] = useState<number>(0);
  const [treinos, setTreinos] = useState<Treino[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Estados para modais
  const [modalFormVisible, setModalFormVisible] = useState(false);
  const [modalEdicaoVisible, setModalEdicaoVisible] = useState(false);
  const [treinoSelecionado, setTreinoSelecionado] = useState<Treino | null>(null);

  // Estados do formulário de adicionar exercícios
  const [searchText, setSearchText] = useState('');
  const [selectedGroups, setSelectedGroups] = useState<string[]>([]);
  const [filterMenuVisible, setFilterMenuVisible] = useState(false);
  const [selectedExercises, setSelectedExercises] = useState<string[]>([]);

  // Animações
  const slideFormAnim = useRef(new Animated.Value(SCREEN_HEIGHT)).current;
  const slideEdicaoAnim = useRef(new Animated.Value(SCREEN_HEIGHT)).current;

  // Mock de exercícios disponíveis
  const exerciciosDisponiveis: Exercicio[] = [
    { id: '1', nome: 'Supino Reto', grupoMuscular: 'Peito', icone: 'arm-flex' },
    { id: '2', nome: 'Supino Inclinado', grupoMuscular: 'Peito', icone: 'arm-flex' },
    { id: '3', nome: 'Crucifixo', grupoMuscular: 'Peito', icone: 'arm-flex' },
    { id: '4', nome: 'Puxada Frontal', grupoMuscular: 'Costas', icone: 'human-handsup' },
    { id: '5', nome: 'Remada Curvada', grupoMuscular: 'Costas', icone: 'human-handsup' },
    { id: '6', nome: 'Agachamento', grupoMuscular: 'Pernas', icone: 'run' },
    { id: '7', nome: 'Leg Press', grupoMuscular: 'Pernas', icone: 'run' },
    { id: '8', nome: 'Cadeira Extensora', grupoMuscular: 'Pernas', icone: 'run' },
    { id: '9', nome: 'Desenvolvimento', grupoMuscular: 'Ombros', icone: 'weight-lifter' },
    { id: '10', nome: 'Elevação Lateral', grupoMuscular: 'Ombros', icone: 'weight-lifter' },
    { id: '11', nome: 'Rosca Direta', grupoMuscular: 'Braços', icone: 'arm-flex-outline' },
    { id: '12', nome: 'Tríceps Pulley', grupoMuscular: 'Braços', icone: 'arm-flex-outline' },
    { id: '13', nome: 'Abdominal', grupoMuscular: 'Abdômen', icone: 'human-male' },
    { id: '14', nome: 'Prancha', grupoMuscular: 'Abdômen', icone: 'human-male' },
  ];

  const gruposMusculares = [
    { id: 'todos', nome: 'Todos os grupos' },
    { id: 'Peito', nome: 'Peito', cor: '#622db2' },
    { id: 'Costas', nome: 'Costas', cor: '#7b42d5' },
    { id: 'Pernas', nome: 'Pernas', cor: '#4ecdc4' },
    { id: 'Ombros', nome: 'Ombros', cor: '#8E44AD' },
    { id: 'Braços', nome: 'Braços', cor: '#F39C12' },
    { id: 'Abdômen', nome: 'Abdômen', cor: '#00BCD4' },
  ];

  useFocusEffect(
    useCallback(() => {
      carregarQuantidadeTreinos();
    }, [])
  );

  const carregarQuantidadeTreinos = async () => {
    setIsLoading(true);
    try {
      const estruturaSalva = await AsyncStorage.getItem('@estruturaTreinos');
      let quantidade = 0;
      if (estruturaSalva) {
        switch (estruturaSalva) {
          case '1': quantidade = 1; break;
          case '2': quantidade = 2; break;
          case '3': quantidade = 3; break;
          case '4': quantidade = 4; break;
          case 'personalizar': quantidade = 3; break;
          default: quantidade = 1;
        }
      } else {
        quantidade = 1;
      }

      setQuantidadeTreinos(quantidade);
      const novosTreinos: Treino[] = [];
      for (let i = 1; i <= quantidade; i++) {
        const treinoSalvo = await AsyncStorage.getItem(`@treino_${i}`);
        let exerciciosSalvos: ExercicioConfigurado[] = [];
        if (treinoSalvo) {
          try {
            exerciciosSalvos = JSON.parse(treinoSalvo);
          } catch (e) {
            console.error(e);
          }
        }
        novosTreinos.push({
          id: `treino-${i}`,
          nome: `Treino ${i}`,
          configurado: exerciciosSalvos.length > 0,
          exercicios: exerciciosSalvos,
        });
      }
      setTreinos(novosTreinos);
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível carregar seus treinos.');
    } finally {
      setIsLoading(false);
    }
  };

  const openFormModal = (treino: Treino) => {
    setTreinoSelecionado(treino);
    setSelectedExercises([]);
    setSearchText('');
    setSelectedGroups([]);
    setModalFormVisible(true);
    Animated.timing(slideFormAnim, {
      toValue: 0,
      duration: 300,
      easing: Easing.out(Easing.ease),
      useNativeDriver: true,
    }).start();
  };

  const closeFormModal = () => {
    Animated.timing(slideFormAnim, {
      toValue: SCREEN_HEIGHT,
      duration: 250,
      easing: Easing.in(Easing.ease),
      useNativeDriver: true,
    }).start(() => setModalFormVisible(false));
  };

  const openEdicaoModal = (treino: Treino) => {
    setTreinoSelecionado(treino);
    setModalEdicaoVisible(true);
    Animated.timing(slideEdicaoAnim, {
      toValue: 0,
      duration: 300,
      easing: Easing.out(Easing.ease),
      useNativeDriver: true,
    }).start();
  };

  const closeEdicaoModal = () => {
    Animated.timing(slideEdicaoAnim, {
      toValue: SCREEN_HEIGHT,
      duration: 250,
      easing: Easing.in(Easing.ease),
      useNativeDriver: true,
    }).start(() => setModalEdicaoVisible(false));
  };

  const handleTreinoPress = (treino: Treino) => {
    if (treino.configurado) {
      openEdicaoModal(treino);
    } else {
      openFormModal(treino);
    }
  };

  const toggleGrupoMuscular = (grupoId: string) => {
    if (grupoId === 'todos') {
      setSelectedGroups([]);
    } else {
      setSelectedGroups(prev =>
        prev.includes(grupoId) ? prev.filter(g => g !== grupoId) : [...prev, grupoId]
      );
    }
  };

  const toggleExercicioSelecionado = (exercicioId: string) => {
    setSelectedExercises(prev =>
      prev.includes(exercicioId) ? prev.filter(id => id !== exercicioId) : [...prev, exercicioId]
    );
  };

  const handleAdicionarExercicios = async () => {
    if (!treinoSelecionado || selectedExercises.length === 0) return;
    const novosExercicios: ExercicioConfigurado[] = selectedExercises.map(exId => {
      const exercicio = exerciciosDisponiveis.find(ex => ex.id === exId)!;
      const grupo = gruposMusculares.find(g => g.nome === exercicio.grupoMuscular);
      return {
        id: Date.now().toString() + exId,
        nome: exercicio.nome,
        series: 3,
        repeticoes: '8-12',
        descanso: '60s',
        grupoMuscular: exercicio.grupoMuscular,
        icone: exercicio.icone,
        cor: grupo?.cor || '#622db2',
      };
    });

    const treinosAtualizados = treinos.map(t => {
      if (t.id === treinoSelecionado.id) {
        return {
          ...t,
          configurado: true,
          exercicios: [...t.exercicios, ...novosExercicios],
        };
      }
      return t;
    });

    setTreinos(treinosAtualizados);
    try {
      const treinoAtualizado = treinosAtualizados.find(t => t.id === treinoSelecionado.id);
      if (treinoAtualizado) {
        const numeroTreino = treinoSelecionado.id.split('-')[1];
        await AsyncStorage.setItem(`@treino_${numeroTreino}`, JSON.stringify(treinoAtualizado.exercicios));
      }
    } catch (error) { console.error(error); }
    closeFormModal();
  };

  const handleRemoveExercicio = async (treinoId: string, exercicioId: string) => {
    const treinosAtualizados = treinos.map(t => {
      if (t.id === treinoId) {
        const exerciciosFiltrados = t.exercicios.filter(ex => ex.id !== exercicioId);
        return {
          ...t,
          configurado: exerciciosFiltrados.length > 0,
          exercicios: exerciciosFiltrados,
        };
      }
      return t;
    });
    setTreinos(treinosAtualizados);
    try {
      const treinoAtualizado = treinosAtualizados.find(t => t.id === treinoId);
      if (treinoAtualizado) {
        const numeroTreino = treinoId.split('-')[1];
        await AsyncStorage.setItem(`@treino_${numeroTreino}`, JSON.stringify(treinoAtualizado.exercicios));
      }
    } catch (error) { console.error(error); }
  };

  // Alteração do destino do botão voltar conforme solicitado
  const handleVoltar = () => router.push('/(drawer)/EstruturaTreinosScreen');
  
  const handleContinuar = () => {
    if (treinos.every(t => t.exercicios.length > 0)) {
      router.push('/OrganizacaoTreinosScreen');
    }
  };

  const exerciciosFiltrados = exerciciosDisponiveis.filter(ex => {
    const matchesSearch = ex.nome.toLowerCase().includes(searchText.toLowerCase());
    const matchesGroup = selectedGroups.length === 0 || selectedGroups.includes(ex.grupoMuscular);
    return matchesSearch && matchesGroup;
  });

  const todosConfigurados = treinos.every(t => t.exercicios.length > 0);

  const renderBackground = () => (
    <View style={styles.visualArea}>
      <View style={[styles.ellipseLine, { width: width * 1.5, height: SCREEN_HEIGHT * 0.3, top: -50, right: -width * 0.2, transform: [{ rotate: '15deg' }] }]}>
        <View style={[styles.staticDot, { bottom: '20%', left: '20%' }]} />
      </View>
      <View style={[styles.ellipseLine, { width: width * 1.7, height: SCREEN_HEIGHT * 0.4, bottom: -100, left: -width * 0.3, transform: [{ rotate: '-10deg' }] }]}>
        <View style={[styles.staticDot, { top: '30%', right: '25%' }]} />
      </View>
    </View>
  );

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={{ color: COLORS.primary, fontWeight: '700' }}>Carregando seus treinos...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.background}>
      <StatusBar barStyle="dark-content" />
      {renderBackground()}

      {/* Cabeçalho */}
      <View style={styles.headerContainer}>
        <Pressable style={styles.backButton} onPress={handleVoltar}>
          <View style={styles.backIconCircle}>
            <FontAwesome name="chevron-left" size={12} color={COLORS.primary} />
          </View>
          <Text style={styles.backButtonText}>Voltar</Text>
        </Pressable>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.logoContainer}>
          <Image
            source={require('@/assets/images/logo-sem-fundo1.png')}
            style={styles.topImage}
            resizeMode="contain"
          />
        </View>

        <View style={styles.content}>
          <Text style={styles.welcomeTitle}>Vamos organizar seus treinos</Text>
          <Text style={styles.subtitle}>
            Toque em cada treino para configurar os exercícios.
          </Text>

          {/* Lista de treinos */}
          <View style={styles.treinosContainer}>
            {treinos.map((treino) => (
              <TouchableOpacity
                key={treino.id}
                activeOpacity={0.7}
                style={[
                  styles.treinoCard,
                  treino.configurado && styles.treinoCardConfigurado
                ]}
                onPress={() => handleTreinoPress(treino)}
              >
                <View style={styles.treinoHeader}>
                  <View style={[
                    styles.treinoIcon,
                    { backgroundColor: treino.configurado ? COLORS.success : '#E0E0E0' }
                  ]}>
                    <MaterialCommunityIcons
                      name="dumbbell"
                      size={24}
                      color={treino.configurado ? '#FFFFFF' : '#999999'}
                    />
                  </View>
                  <View style={styles.treinoInfo}>
                    <Text style={[
                      styles.treinoNome,
                      !treino.configurado && styles.treinoNomeNaoConfigurado
                    ]}>
                      {treino.nome}
                    </Text>
                    <Text style={styles.treinoStatus}>
                      {treino.configurado
                        ? `${treino.exercicios.length} exercício(s)`
                        : 'Não configurado'}
                    </Text>
                  </View>
                  <FontAwesome name="chevron-right" size={14} color={treino.configurado ? COLORS.success : '#CCC'} />
                </View>

                {treino.configurado && (
                  <View style={styles.exerciciosPreview}>
                    {treino.exercicios.slice(0, 2).map((ex) => (
                      <View key={ex.id} style={styles.exercicioPreviewItem}>
                        <View style={[styles.exercicioPreviewBullet, { backgroundColor: ex.cor }]} />
                        <Text style={styles.exercicioPreviewText} numberOfLines={1}>{ex.nome}</Text>
                      </View>
                    ))}
                    {treino.exercicios.length > 2 && (
                      <Text style={styles.maisExerciciosText}>
                        +{treino.exercicios.length - 2} exercícios
                      </Text>
                    )}
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </View>

          {/* Botão Continuar */}
          <TouchableOpacity
            style={styles.primaryButtonWrapper}
            onPress={handleContinuar}
            disabled={!todosConfigurados}
          >
            <LinearGradient
              colors={todosConfigurados ? ['#7b42d5', '#622db2', '#4b208c'] : [COLORS.disabled, COLORS.disabled]}
              style={styles.primaryButton}
            >
              <Text style={[styles.primaryText, !todosConfigurados && { color: '#AAA' }]}>
                Continuar
              </Text>
            </LinearGradient>
            <Text style={styles.buttonSubtitle}>
              {todosConfigurados
                ? 'Ir para o próximo passo'
                : 'Configure todos os treinos para continuar'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* MODAL - Formulário de Adicionar Exercícios */}
      <Modal visible={modalFormVisible} transparent animationType="none">
        <Animated.View style={[styles.fullScreenModal, { transform: [{ translateY: slideFormAnim }] }]}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={closeFormModal} style={styles.modalBackButton}>
              <MaterialIcons name="close" size={24} color={COLORS.primary} />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>{treinoSelecionado?.nome || 'Configurar Treino'}</Text>
            <View style={{ width: 40 }} />
          </View>

          <View style={styles.modalContent}>
            <View style={styles.searchContainer}>
              <Feather name="search" size={20} color="#94A3B8" />
              <TextInput
                style={styles.searchInput}
                placeholder="Buscar exercício..."
                placeholderTextColor="#94A3B8"
                value={searchText}
                onChangeText={setSearchText}
              />
            </View>

            <View style={styles.filterContainer}>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {gruposMusculares.map((grupo) => (
                  <TouchableOpacity
                    key={grupo.id}
                    style={[
                      styles.filterChip,
                      (grupo.id === 'todos' && selectedGroups.length === 0) || selectedGroups.includes(grupo.id) ? styles.filterChipSelected : null
                    ]}
                    onPress={() => toggleGrupoMuscular(grupo.id)}
                  >
                    <Text style={[
                      styles.filterChipText,
                      (grupo.id === 'todos' && selectedGroups.length === 0) || selectedGroups.includes(grupo.id) ? styles.filterChipTextSelected : null
                    ]}>
                      {grupo.nome}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            <FlatList
              data={exerciciosFiltrados}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => {
                const isSelected = selectedExercises.includes(item.id);
                const grupo = gruposMusculares.find(g => g.nome === item.grupoMuscular);
                return (
                  <TouchableOpacity
                    style={[styles.exercicioItem, isSelected && styles.exercicioItemSelected]}
                    onPress={() => toggleExercicioSelecionado(item.id)}
                  >
                    <View style={styles.exercicioItemContent}>
                      <View style={[styles.exercicioIconBox, { backgroundColor: `${grupo?.cor}15` }]}>
                        <MaterialCommunityIcons name={item.icone as any} size={20} color={grupo?.cor || COLORS.primary} />
                      </View>
                      <View>
                        <Text style={styles.exercicioNomeText}>{item.nome}</Text>
                        <Text style={styles.exercicioGrupoText}>{item.grupoMuscular}</Text>
                      </View>
                    </View>
                    <View style={[styles.checkbox, isSelected && styles.checkboxSelected]}>
                      {isSelected && <Feather name="check" size={14} color="#FFF" />}
                    </View>
                  </TouchableOpacity>
                );
              }}
              contentContainerStyle={{ paddingBottom: 100 }}
            />

            <View style={styles.bottomButtonContainer}>
              <TouchableOpacity
                onPress={handleAdicionarExercicios}
                disabled={selectedExercises.length === 0}
                style={styles.bottomPressable}
              >
                <LinearGradient
                  colors={selectedExercises.length > 0 ? ['#7b42d5', '#622db2'] : ['#CCC', '#BBB']}
                  style={styles.bottomButtonGradient}
                >
                  <Text style={styles.bottomButtonText}>
                    {selectedExercises.length === 0 ? 'Selecionar' : `Adicionar ${selectedExercises.length}`}
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
        </Animated.View>
      </Modal>

      {/* MODAL - Edição do Treino (O roxo agora predomina aqui) */}
      <Modal visible={modalEdicaoVisible} transparent animationType="none">
        <Animated.View style={[styles.fullScreenModal, { transform: [{ translateY: slideEdicaoAnim }] }]}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={closeEdicaoModal} style={styles.modalBackButton}>
              <MaterialIcons name="arrow-back" size={24} color={COLORS.primary} />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>{treinoSelecionado?.nome}</Text>
            <TouchableOpacity onPress={() => { closeEdicaoModal(); openFormModal(treinoSelecionado!); }}>
              <Feather name="plus" size={24} color={COLORS.primary} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent} contentContainerStyle={{ paddingBottom: 40 }}>
            {treinoSelecionado?.exercicios.map((exercicio) => (
              <View key={exercicio.id} style={styles.exercicioConfiguradoCard}>
                <View style={styles.exHeader}>
                  <View style={styles.exInfo}>
                    <View style={[styles.exIcon, { backgroundColor: `${COLORS.primary}15` }]}>
                      <MaterialCommunityIcons name={exercicio.icone as any} size={20} color={COLORS.primary} />
                    </View>
                    <View>
                      <Text style={styles.exNome}>{exercicio.nome}</Text>
                      <Text style={styles.exGrupo}>{exercicio.grupoMuscular}</Text>
                    </View>
                  </View>
                  <TouchableOpacity onPress={() => handleRemoveExercicio(treinoSelecionado.id, exercicio.id)}>
                    <MaterialIcons name="delete-outline" size={22} color={COLORS.primary} />
                  </TouchableOpacity>
                </View>

                <View style={styles.configGrid}>
                  <View style={styles.configItem}>
                    <Text style={styles.configLabel}>Séries</Text>
                    <TextInput
                      style={styles.configInput}
                      value={exercicio.series.toString()}
                      keyboardType="numeric"
                      onChangeText={(text) => {
                        const novos = treinos.map(t => t.id === treinoSelecionado.id ? 
                          {...t, exercicios: t.exercicios.map(ex => ex.id === exercicio.id ? {...ex, series: parseInt(text) || 0} : ex)} : t);
                        setTreinos(novos);
                      }}
                    />
                  </View>
                  <View style={styles.configItem}>
                    <Text style={styles.configLabel}>Reps</Text>
                    <TextInput
                      style={styles.configInput}
                      value={exercicio.repeticoes}
                      onChangeText={(text) => {
                        const novos = treinos.map(t => t.id === treinoSelecionado.id ? 
                          {...t, exercicios: t.exercicios.map(ex => ex.id === exercicio.id ? {...ex, repeticoes: text} : ex)} : t);
                        setTreinos(novos);
                      }}
                    />
                  </View>
                  <View style={styles.configItem}>
                    <Text style={styles.configLabel}>Descanso</Text>
                    <TextInput
                      style={styles.configInput}
                      value={exercicio.descanso}
                      onChangeText={(text) => {
                        const novos = treinos.map(t => t.id === treinoSelecionado.id ? 
                          {...t, exercicios: t.exercicios.map(ex => ex.id === exercicio.id ? {...ex, descanso: text} : ex)} : t);
                        setTreinos(novos);
                      }}
                    />
                  </View>
                </View>
              </View>
            ))}
          </ScrollView>
        </Animated.View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  background: { flex: 1, backgroundColor: '#FFFFFF' },
  visualArea: { ...StyleSheet.absoluteFillObject, zIndex: 0, overflow: 'hidden' },
  ellipseLine: { position: 'absolute', borderWidth: 1.5, borderColor: COLORS.line, borderRadius: 999 },
  staticDot: { position: 'absolute', width: 10, height: 10, borderRadius: 5, borderWidth: 2, borderColor: COLORS.dot, backgroundColor: '#fff' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  headerContainer: { paddingHorizontal: 25, paddingTop: 20, zIndex: 10 },
  backButton: { flexDirection: 'row', alignItems: 'center' },
  backIconCircle: { width: 32, height: 32, borderRadius: 16, backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: COLORS.line, elevation: 2 },
  backButtonText: { color: COLORS.primary, fontSize: 16, fontWeight: '700', marginLeft: 10 },
  scrollView: { flex: 1 },
  scrollContent: { paddingHorizontal: 25, paddingBottom: 40 },
  logoContainer: { alignItems: 'center', marginVertical: 30 },
  topImage: { width: width * 0.4, height: 60 },
  content: { flex: 1 },
  welcomeTitle: { color: COLORS.textMain, fontSize: 24, fontWeight: '900', textAlign: 'center', marginBottom: 10 },
  subtitle: { color: '#666', fontSize: 16, textAlign: 'center', marginBottom: 30, lineHeight: 22 },
  treinosContainer: { gap: 15, marginBottom: 40 },
  treinoCard: { backgroundColor: '#FFF', borderRadius: 20, padding: 18, borderWidth: 1.5, borderColor: '#F0F0F0', elevation: 3, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 10 },
  treinoCardConfigurado: { borderColor: COLORS.success + '40', backgroundColor: '#F9FFF9' },
  treinoHeader: { flexDirection: 'row', alignItems: 'center', gap: 15 },
  treinoIcon: { width: 50, height: 50, borderRadius: 15, justifyContent: 'center', alignItems: 'center' },
  treinoInfo: { flex: 1 },
  treinoNome: { fontSize: 18, fontWeight: '800', color: COLORS.textMain },
  treinoNomeNaoConfigurado: { color: '#AAA' },
  treinoStatus: { fontSize: 13, color: '#888', marginTop: 2 },
  exerciciosPreview: { marginTop: 15, paddingTop: 15, borderTopWidth: 1, borderTopColor: '#F0F0F0', flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  exercicioPreviewItem: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F5F5F5', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 10 },
  exercicioPreviewBullet: { width: 6, height: 6, borderRadius: 3, marginRight: 6 },
  exercicioPreviewText: { fontSize: 11, color: '#666', fontWeight: '600', maxWidth: 100 },
  maisExerciciosText: { fontSize: 11, color: COLORS.primary, fontWeight: '700' },
  primaryButtonWrapper: { width: '100%', alignItems: 'center' },
  primaryButton: { width: '100%', paddingVertical: 18, borderRadius: 20, alignItems: 'center', elevation: 4 },
  primaryText: { color: '#fff', fontSize: 18, fontWeight: '800' },
  buttonSubtitle: { fontSize: 12, color: '#999', marginTop: 10, textAlign: 'center' },
  fullScreenModal: { flex: 1, backgroundColor: '#FFF', borderTopLeftRadius: 30, borderTopRightRadius: 30, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 20, elevation: 20 },
  modalHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 25, borderBottomWidth: 1, borderBottomColor: '#F0F0F0' },
  modalBackButton: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#F8F9FA', justifyContent: 'center', alignItems: 'center' },
  modalTitle: { fontSize: 20, fontWeight: '800', color: COLORS.textMain },
  modalContent: { flex: 1, padding: 20 },
  searchContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F5F5F5', borderRadius: 15, paddingHorizontal: 15, height: 55, marginBottom: 20 },
  searchInput: { flex: 1, marginLeft: 10, fontSize: 16, fontWeight: '600' },
  filterContainer: { marginBottom: 20 },
  filterChip: { paddingHorizontal: 18, paddingVertical: 10, borderRadius: 25, backgroundColor: '#F0F0F0', marginRight: 10, borderWidth: 1, borderColor: '#E0E0E0' },
  filterChipSelected: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  filterChipText: { fontSize: 13, fontWeight: '700', color: '#666' },
  filterChipTextSelected: { color: '#FFF' },
  exercicioItem: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 15, backgroundColor: '#FFF', borderRadius: 18, marginBottom: 12, borderWidth: 1, borderColor: '#F0F0F0' },
  exercicioItemSelected: { borderColor: COLORS.primary, backgroundColor: `${COLORS.primary}05` },
  exercicioItemContent: { flexDirection: 'row', alignItems: 'center', gap: 15 },
  exercicioIconBox: { width: 45, height: 45, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  exercicioNomeText: { fontSize: 16, fontWeight: '700', color: COLORS.textMain },
  exercicioGrupoText: { fontSize: 12, color: '#888' },
  checkbox: { width: 22, height: 22, borderRadius: 6, borderWidth: 2, borderColor: '#DDD', justifyContent: 'center', alignItems: 'center' },
  checkboxSelected: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  bottomButtonContainer: { position: 'absolute', bottom: 30, left: 20, right: 20 },
  bottomPressable: { borderRadius: 20, overflow: 'hidden', elevation: 8 },
  bottomButtonGradient: { paddingVertical: 18, alignItems: 'center' },
  bottomButtonText: { color: '#FFF', fontSize: 16, fontWeight: '800' },
  exercicioConfiguradoCard: { backgroundColor: '#FFF', borderRadius: 22, padding: 20, marginBottom: 15, borderWidth: 1, borderColor: '#F0F0F0', elevation: 2 },
  exHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  exInfo: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  exIcon: { width: 40, height: 40, borderRadius: 10, justifyContent: 'center', alignItems: 'center' },
  exNome: { fontSize: 16, fontWeight: '800', color: COLORS.textMain },
  exGrupo: { fontSize: 12, color: '#999' },
  configGrid: { flexDirection: 'row', gap: 10 },
  configItem: { flex: 1, backgroundColor: '#F8F9FA', borderRadius: 12, padding: 10 },
  configLabel: { fontSize: 10, fontWeight: '700', color: '#AAA', marginBottom: 5, textTransform: 'uppercase' },
  configInput: { fontSize: 15, fontWeight: '700', color: COLORS.primary, padding: 0 }
});