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
  View
} from 'react-native';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

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
    { id: 'Peito', nome: 'Peito', cor: '#EA4335' },
    { id: 'Costas', nome: 'Costas', cor: '#1E88E5' },
    { id: 'Pernas', nome: 'Pernas', cor: '#27AE60' },
    { id: 'Ombros', nome: 'Ombros', cor: '#8E44AD' },
    { id: 'Braços', nome: 'Braços', cor: '#F39C12' },
    { id: 'Abdômen', nome: 'Abdômen', cor: '#00BCD4' },
  ];

  // Usar useFocusEffect para recarregar sempre que a tela ganhar foco
  useFocusEffect(
    useCallback(() => {
      console.log('Tela de configuração ganhou foco - recarregando treinos');
      carregarQuantidadeTreinos();
    }, [])
  );

  const carregarQuantidadeTreinos = async () => {
    setIsLoading(true);
    try {
      // Buscar a estrutura de treinos escolhida pelo usuário
      const estruturaSalva = await AsyncStorage.getItem('@estruturaTreinos');
      const estruturaInfo = await AsyncStorage.getItem('@estruturaTreinosInfo');

      console.log('Estrutura salva:', estruturaSalva);
      console.log('Estrutura info:', estruturaInfo);

      let quantidade = 0;

      if (estruturaSalva) {
        // Converter a escolha do usuário em número de treinos
        switch (estruturaSalva) {
          case '1':
            quantidade = 1;
            break;
          case '2':
            quantidade = 2;
            break;
          case '3':
            quantidade = 3;
            break;
          case '4':
            quantidade = 4;
            break;
          case 'personalizar':
            // Para personalizar, podemos perguntar ao usuário ou definir um padrão
            quantidade = 3; // Valor padrão para personalizar
            break;
          default:
            quantidade = 1;
        }
      } else {
        // Se não encontrar, usar valor padrão
        quantidade = 1;
      }

      setQuantidadeTreinos(quantidade);
      console.log('Quantidade de treinos carregada:', quantidade);

      // Criar treinos baseado na quantidade
      const novosTreinos: Treino[] = [];
      for (let i = 1; i <= quantidade; i++) {
        // Verificar se já existem exercícios salvos para este treino
        const treinoSalvo = await AsyncStorage.getItem(`@treino_${i}`);
        let exerciciosSalvos: ExercicioConfigurado[] = [];

        if (treinoSalvo) {
          try {
            exerciciosSalvos = JSON.parse(treinoSalvo);
            console.log(`Treino ${i} carregado com ${exerciciosSalvos.length} exercícios`);
          } catch (e) {
            console.error('Erro ao parsear treino salvo:', e);
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
      console.error('Erro ao carregar quantidade de treinos:', error);
      Alert.alert('Erro', 'Não foi possível carregar seus treinos. Tente novamente.');
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
        prev.includes(grupoId)
          ? prev.filter(g => g !== grupoId)
          : [...prev, grupoId]
      );
    }
  };

  const toggleExercicioSelecionado = (exercicioId: string) => {
    setSelectedExercises(prev =>
      prev.includes(exercicioId)
        ? prev.filter(id => id !== exercicioId)
        : [...prev, exercicioId]
    );
  };

  const handleAdicionarExercicios = async () => {
    if (!treinoSelecionado || selectedExercises.length === 0) return;

    // Criar exercícios configurados a partir dos selecionados
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
        cor: grupo?.cor || '#1E88E5',
      };
    });

    // Atualizar o treino
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

    // Salvar no AsyncStorage
    try {
      const treinoAtualizado = treinosAtualizados.find(t => t.id === treinoSelecionado.id);
      if (treinoAtualizado) {
        const numeroTreino = treinoSelecionado.id.split('-')[1];
        await AsyncStorage.setItem(`@treino_${numeroTreino}`, JSON.stringify(treinoAtualizado.exercicios));
        console.log(`Treino ${numeroTreino} salvo com ${treinoAtualizado.exercicios.length} exercícios`);
      }
    } catch (error) {
      console.error('Erro ao salvar treino:', error);
    }

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

    // Atualizar AsyncStorage
    try {
      const treinoAtualizado = treinosAtualizados.find(t => t.id === treinoId);
      if (treinoAtualizado) {
        const numeroTreino = treinoId.split('-')[1];
        await AsyncStorage.setItem(`@treino_${numeroTreino}`, JSON.stringify(treinoAtualizado.exercicios));
      }
    } catch (error) {
      console.error('Erro ao remover exercício:', error);
    }
  };

  const handleVoltar = () => {
    router.push('/RegistrarTreinoScreen');
  };

  const handleContinuar = () => {
    // Verificar se todos os treinos têm pelo menos 1 exercício
    const todosConfigurados = treinos.every(t => t.exercicios.length > 0);
    if (todosConfigurados) {
      router.push('/OrganizacaoTreinosScreen');
    }
  };

  // Filtrar exercícios baseado na pesquisa e grupos selecionados
  const exerciciosFiltrados = exerciciosDisponiveis.filter(ex => {
    const matchesSearch = ex.nome.toLowerCase().includes(searchText.toLowerCase());
    const matchesGroup = selectedGroups.length === 0 || selectedGroups.includes(ex.grupoMuscular);
    return matchesSearch && matchesGroup;
  });

  const todosConfigurados = treinos.every(t => t.exercicios.length > 0);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Carregando seus treinos...</Text>
      </View>
    );
  }

  return (
    <View style={styles.background}>
      {/* Cabeçalho */}
      <View style={styles.headerContainer}>
        <Pressable style={styles.backButton} onPress={handleVoltar}>
          <FontAwesome name="arrow-left" size={20} color="#1E88E5" />
          <Text style={styles.backButtonText}>Voltar</Text>
        </Pressable>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.mainContainer}>
          <View style={styles.imageContainer}>
            <Image
              source={require('@/assets/images/logo2.png')}
              style={styles.topImage}
              resizeMode="cover"
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
                  style={[
                    styles.treinoCard,
                    treino.configurado && styles.treinoCardConfigurado
                  ]}
                  onPress={() => handleTreinoPress(treino)}
                >
                  <View style={styles.treinoHeader}>
                    <View style={[
                      styles.treinoIcon,
                      { backgroundColor: treino.configurado ? '#4CAF50' : '#E0E0E0' }
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
                  </View>

                  {treino.configurado && (
                    <View style={styles.exerciciosPreview}>
                      {treino.exercicios.slice(0, 2).map((ex, index) => (
                        <View key={ex.id} style={styles.exercicioPreviewItem}>
                          <View style={[styles.exercicioPreviewBullet, { backgroundColor: ex.cor }]} />
                          <Text style={styles.exercicioPreviewText}>{ex.nome}</Text>
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

            <View style={styles.divider} />

            {/* Botão Continuar */}
            <TouchableOpacity
              style={[
                styles.primaryButton,
                (!todosConfigurados) && styles.primaryButtonDisabled
              ]}
              onPress={handleContinuar}
              disabled={!todosConfigurados}
            >
              <View style={styles.buttonContent}>
                <FontAwesome name="arrow-right" size={22} color="#FFFFFF" />
                <Text style={styles.primaryText}>Continuar</Text>
              </View>
              <Text style={styles.buttonSubtitle}>
                {todosConfigurados
                  ? 'Ir para o próximo passo'
                  : 'Configure todos os treinos para continuar'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* MODAL - Formulário de Adicionar Exercícios */}
      <Modal
        visible={modalFormVisible}
        transparent={true}
        animationType="none"
      >
        <Animated.View style={[styles.fullScreenModal, { transform: [{ translateY: slideFormAnim }] }]}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={closeFormModal} style={styles.modalBackButton}>
              <MaterialIcons name="arrow-back" size={24} color="#1E88E5" />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>
              {treinoSelecionado?.nome || 'Configurar Treino'}
            </Text>
            <View style={{ width: 40 }} />
          </View>

          <View style={styles.modalContent}>
            {/* Campo de busca */}
            <View style={styles.searchContainer}>
              <Feather name="search" size={20} color="#94A3B8" style={styles.searchIcon} />
              <TextInput
                style={styles.searchInput}
                placeholder="Buscar exercício por nome"
                placeholderTextColor="#94A3B8"
                value={searchText}
                onChangeText={setSearchText}
              />
            </View>

            {/* Filtro de grupo muscular */}
            <View style={styles.filterContainer}>
              <TouchableOpacity
                style={styles.filterButton}
                onPress={() => setFilterMenuVisible(!filterMenuVisible)}
              >
                <MaterialIcons name="filter-list" size={20} color="#1E88E5" />
                <Text style={styles.filterButtonText}>Grupo muscular</Text>
                <MaterialIcons
                  name={filterMenuVisible ? 'keyboard-arrow-up' : 'keyboard-arrow-down'}
                  size={20}
                  color="#666"
                />
              </TouchableOpacity>

              {filterMenuVisible && (
                <View style={styles.filterMenu}>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    {gruposMusculares.map((grupo) => (
                      <TouchableOpacity
                        key={grupo.id}
                        style={[
                          styles.filterChip,
                          grupo.id === 'todos' && selectedGroups.length === 0 && styles.filterChipSelected,
                          selectedGroups.includes(grupo.id) && styles.filterChipSelected,
                        ]}
                        onPress={() => toggleGrupoMuscular(grupo.id)}
                      >
                        <Text style={[
                          styles.filterChipText,
                          (grupo.id === 'todos' && selectedGroups.length === 0) && styles.filterChipTextSelected,
                          selectedGroups.includes(grupo.id) && styles.filterChipTextSelected,
                        ]}>
                          {grupo.nome}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>
              )}
            </View>

            {/* Lista de exercícios */}
            <FlatList
              data={exerciciosFiltrados}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => {
                const isSelected = selectedExercises.includes(item.id);
                const grupo = gruposMusculares.find(g => g.nome === item.grupoMuscular);

                return (
                  <TouchableOpacity
                    style={[
                      styles.exercicioItem,
                      isSelected && styles.exercicioItemSelected
                    ]}
                    onPress={() => toggleExercicioSelecionado(item.id)}
                  >
                    <View style={styles.exercicioItemContent}>
                      <View style={[styles.exercicioIcon, { backgroundColor: `${grupo?.cor}15` || '#F0F9FF' }]}>
                        <MaterialCommunityIcons
                          name={item.icone as any}
                          size={20}
                          color={grupo?.cor || '#1E88E5'}
                        />
                      </View>
                      <View style={styles.exercicioInfo}>
                        <Text style={styles.exercicioNome}>{item.nome}</Text>
                        <Text style={styles.exercicioGrupo}>{item.grupoMuscular}</Text>
                      </View>
                    </View>

                    <View style={[
                      styles.exercicioCheckbox,
                      isSelected && styles.exercicioCheckboxSelected
                    ]}>
                      {isSelected && (
                        <Feather name="check" size={16} color="#FFFFFF" />
                      )}
                    </View>
                  </TouchableOpacity>
                );
              }}
              contentContainerStyle={styles.exerciciosList}
              showsVerticalScrollIndicator={false}
            />

            {/* Botão inferior dinâmico */}
            <View style={styles.bottomButtonContainer}>
              <TouchableOpacity
                style={[
                  styles.bottomButton,
                  selectedExercises.length === 0 && styles.bottomButtonDisabled
                ]}
                onPress={handleAdicionarExercicios}
                disabled={selectedExercises.length === 0}
              >
                <LinearGradient
                  colors={selectedExercises.length > 0 ? ['#1E88E5', '#8E44AD'] : ['#CCCCCC', '#CCCCCC']}
                  style={styles.bottomButtonGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <Text style={styles.bottomButtonText}>
                    {selectedExercises.length === 0
                      ? 'Selecionar exercícios'
                      : `Adicionar ${selectedExercises.length} exercício(s)`}
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
        </Animated.View>
      </Modal>

      {/* MODAL - Edição do Treino */}
      <Modal
        visible={modalEdicaoVisible}
        transparent={true}
        animationType="none"
      >
        <Animated.View style={[styles.fullScreenModal, { transform: [{ translateY: slideEdicaoAnim }] }]}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={closeEdicaoModal} style={styles.modalBackButton}>
              <MaterialIcons name="arrow-back" size={24} color="#1E88E5" />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>
              {treinoSelecionado?.nome || 'Editar Treino'}
            </Text>
            <View style={{ width: 40 }} />
          </View>

          <View style={styles.modalContent}>
            <ScrollView showsVerticalScrollIndicator={false}>
              {/* Lista de exercícios configurados */}
              {treinoSelecionado?.exercicios.map((exercicio, index) => (
                <View key={exercicio.id} style={styles.exercicioConfiguradoCard}>
                  <View style={styles.exercicioConfiguradoHeader}>
                    <View style={styles.exercicioConfiguradoInfo}>
                      <View style={[styles.exercicioConfiguradoIcon, { backgroundColor: `${exercicio.cor}15` }]}>
                        <MaterialCommunityIcons
                          name={exercicio.icone as any}
                          size={20}
                          color={exercicio.cor}
                        />
                      </View>
                      <View>
                        <Text style={styles.exercicioConfiguradoNome}>{exercicio.nome}</Text>
                        <Text style={styles.exercicioConfiguradoGrupo}>{exercicio.grupoMuscular}</Text>
                      </View>
                    </View>

                    <TouchableOpacity
                      style={styles.removeExerciseButton}
                      onPress={() => {
                        if (treinoSelecionado) {
                          handleRemoveExercicio(treinoSelecionado.id, exercicio.id);
                        }
                      }}
                    >
                      <MaterialIcons name="close" size={20} color="#F44336" />
                    </TouchableOpacity>
                  </View>

                  {/* Configurações do exercício */}
                  <View style={styles.exercicioConfiguracoes}>
                    <View style={styles.configuracaoItem}>
                      <Text style={styles.configuracaoLabel}>Séries</Text>
                      <TextInput
                        style={styles.configuracaoInput}
                        value={exercicio.series.toString()}
                        keyboardType="number-pad"
                        placeholder="3"
                        placeholderTextColor="#94A3B8"
                        onChangeText={(text) => {
                          // Implementar atualização das séries
                          const novosTreinos = treinos.map(t => {
                            if (t.id === treinoSelecionado?.id) {
                              return {
                                ...t,
                                exercicios: t.exercicios.map(ex => {
                                  if (ex.id === exercicio.id) {
                                    return { ...ex, series: parseInt(text) || 0 };
                                  }
                                  return ex;
                                })
                              };
                            }
                            return t;
                          });
                          setTreinos(novosTreinos);
                        }}
                      />
                    </View>

                    <View style={styles.configuracaoItem}>
                      <Text style={styles.configuracaoLabel}>Repetições</Text>
                      <TextInput
                        style={styles.configuracaoInput}
                        value={exercicio.repeticoes}
                        placeholder="8-12"
                        placeholderTextColor="#94A3B8"
                        onChangeText={(text) => {
                          // Implementar atualização das repetições
                          const novosTreinos = treinos.map(t => {
                            if (t.id === treinoSelecionado?.id) {
                              return {
                                ...t,
                                exercicios: t.exercicios.map(ex => {
                                  if (ex.id === exercicio.id) {
                                    return { ...ex, repeticoes: text };
                                  }
                                  return ex;
                                })
                              };
                            }
                            return t;
                          });
                          setTreinos(novosTreinos);
                        }}
                      />
                    </View>

                    <View style={styles.configuracaoItem}>
                      <Text style={styles.configuracaoLabel}>Descanso</Text>
                      <TextInput
                        style={styles.configuracaoInput}
                        value={exercicio.descanso}
                        placeholder="60s"
                        placeholderTextColor="#94A3B8"
                        onChangeText={(text) => {
                          // Implementar atualização do descanso
                          const novosTreinos = treinos.map(t => {
                            if (t.id === treinoSelecionado?.id) {
                              return {
                                ...t,
                                exercicios: t.exercicios.map(ex => {
                                  if (ex.id === exercicio.id) {
                                    return { ...ex, descanso: text };
                                  }
                                  return ex;
                                })
                              };
                            }
                            return t;
                          });
                          setTreinos(novosTreinos);
                        }}
                      />
                    </View>
                  </View>

                  {/* Handle para arrastar (reordenar) */}
                  <View style={styles.dragHandle}>
                    <MaterialIcons name="drag-handle" size={24} color="#CCCCCC" />
                  </View>
                </View>
              ))}

              {/* Botão Adicionar Exercício */}
              <TouchableOpacity
                style={styles.addExerciseButton}
                onPress={() => {
                  closeEdicaoModal();
                  if (treinoSelecionado) {
                    openFormModal(treinoSelecionado);
                  }
                }}
              >
                <Feather name="plus" size={20} color="#1E88E5" />
                <Text style={styles.addExerciseButtonText}>Adicionar exercício</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </Animated.View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: '#FFFFFF'
  },
  headerContainer: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    zIndex: 10
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16
  },
  backButtonText: {
    color: '#1E88E5',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8
  },
  scrollView: {
    flex: 1
  },
  scrollContent: {
    flexGrow: 1,
    paddingTop: 15,
    paddingBottom: 30,
    paddingHorizontal: 5
  },
  mainContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    marginHorizontal: 15,
    maxWidth: 400,
    alignSelf: 'center',
    width: '92%',
    marginTop: 5
  },
  imageContainer: {
    height: 170,
    width: '100%',
    overflow: 'hidden',
    backgroundColor: '#F5F5F5'
  },
  topImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover'
  },
  content: {
    paddingHorizontal: 24,
    paddingTop: 28,
    paddingBottom: 28,
    alignItems: 'center'
  },
  welcomeTitle: {
    color: '#000000',
    fontSize: 26,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 12,
    lineHeight: 32
  },
  subtitle: {
    color: '#666666',
    fontSize: 17,
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 24
  },
  treinosContainer: {
    width: '100%',
    gap: 16,
    marginBottom: 24,
  },
  treinoCard: {
    backgroundColor: '#F8F9FA',
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#E9ECEF',
    padding: 16,
  },
  treinoCardConfigurado: {
    borderColor: '#4CAF50',
    backgroundColor: '#F1F8E9',
  },
  treinoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  treinoIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  treinoInfo: {
    flex: 1,
  },
  treinoNome: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 4,
  },
  treinoNomeNaoConfigurado: {
    opacity: 0.5,
  },
  treinoStatus: {
    fontSize: 14,
    color: '#666666',
  },
  exerciciosPreview: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    gap: 8,
  },
  exercicioPreviewItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  exercicioPreviewBullet: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  exercicioPreviewText: {
    fontSize: 14,
    color: '#333333',
  },
  maisExerciciosText: {
    fontSize: 12,
    color: '#1E88E5',
    fontWeight: '500',
    marginTop: 4,
  },
  divider: {
    height: 1,
    width: '100%',
    backgroundColor: '#E0E0E0',
    marginVertical: 22,
  },
  primaryButton: {
    width: '100%',
    backgroundColor: '#1E88E5',
    borderRadius: 18,
    paddingVertical: 22,
    paddingHorizontal: 26,
    alignItems: 'center',
    shadowColor: '#1E88E5',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.35,
    shadowRadius: 6.27,
    elevation: 10
  },
  primaryButtonDisabled: {
    opacity: 0.5
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12
  },
  primaryText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 18
  },
  buttonSubtitle: {
    color: '#F1F5F9',
    fontSize: 14,
    marginTop: 4
  },
  fullScreenModal: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#FFFFFF',
    zIndex: 50,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 50,
    paddingBottom: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  modalBackButton: {
    padding: 8,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000000',
  },
  modalContent: {
    flex: 1,
    padding: 20,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    paddingHorizontal: 12,
    marginBottom: 12,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 48,
    fontSize: 16,
    color: '#000000',
  },
  filterContainer: {
    marginBottom: 16,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
  },
  filterButtonText: {
    flex: 1,
    fontSize: 15,
    color: '#333333',
  },
  filterMenu: {
    marginTop: 8,
    paddingVertical: 8,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#F8F9FA',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    marginRight: 8,
  },
  filterChipSelected: {
    backgroundColor: '#1E88E5',
    borderColor: '#1E88E5',
  },
  filterChipText: {
    fontSize: 14,
    color: '#333333',
  },
  filterChipTextSelected: {
    color: '#FFFFFF',
  },
  exerciciosList: {
    paddingBottom: 100,
  },
  exercicioItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  exercicioItemSelected: {
    backgroundColor: '#F0F9FF',
    borderColor: '#1E88E5',
  },
  exercicioItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  exercicioIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  exercicioInfo: {
    flex: 1,
  },
  exercicioNome: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000000',
    marginBottom: 2,
  },
  exercicioGrupo: {
    fontSize: 13,
    color: '#666666',
  },
  exercicioCheckbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#CCCCCC',
    justifyContent: 'center',
    alignItems: 'center',
  },
  exercicioCheckboxSelected: {
    backgroundColor: '#1E88E5',
    borderColor: '#1E88E5',
  },
  bottomButtonContainer: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
  },
  bottomButton: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  bottomButtonDisabled: {
    opacity: 0.5,
  },
  bottomButtonGradient: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  bottomButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  exercicioConfiguradoCard: {
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  exercicioConfiguradoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  exercicioConfiguradoInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  exercicioConfiguradoIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  exercicioConfiguradoNome: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 2,
  },
  exercicioConfiguradoGrupo: {
    fontSize: 13,
    color: '#666666',
  },
  removeExerciseButton: {
    padding: 4,
  },
  exercicioConfiguracoes: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 8,
  },
  configuracaoItem: {
    flex: 1,
  },
  configuracaoLabel: {
    fontSize: 12,
    color: '#666666',
    marginBottom: 4,
  },
  configuracaoInput: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 6,
    fontSize: 14,
    color: '#000000',
  },
  dragHandle: {
    alignItems: 'center',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  addExerciseButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 16,
    borderWidth: 1,
    borderColor: '#1E88E5',
    borderRadius: 12,
    marginTop: 8,
    marginBottom: 30,
  },
  addExerciseButtonText: {
    color: '#1E88E5',
    fontSize: 16,
    fontWeight: '600',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});