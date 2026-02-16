import {
  Feather,
  MaterialCommunityIcons,
  MaterialIcons
} from '@expo/vector-icons';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useRef, useState } from 'react';
import {
  Animated,
  Dimensions,
  Easing,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

export default function RegistrarTreinoScreen() {
  const router = useRouter();

  // Estado das opções iniciais
  const [opcaoSelecionada, setOpcaoSelecionada] = useState<string | null>(null);

  // Estado do form animado
  const [formVisible, setFormVisible] = useState(false);
  const slideAnim = useRef(new Animated.Value(SCREEN_HEIGHT)).current; // começa fora da tela

  // Estados do formulário
  const [selectedCategory, setSelectedCategory] = useState('peito');
  const [exerciseName, setExerciseName] = useState('');
  const [sets, setSets] = useState('');
  const [reps, setReps] = useState('');
  const [rest, setRest] = useState('');
  const [exercisesAdded, setExercisesAdded] = useState<any[]>([]);

  const opcoes = [
    {
      id: 'agora',
      title: '🚀 Vamos lá',
      subtitle: 'Registrar meu treino agora',
      icon: 'rocket',
      color: '#1E88E5',
    },
    {
      id: 'depois',
      title: '⏳ Registrar mais tarde',
      subtitle: 'Voltar para o app depois',
      icon: 'clock-o',
      color: '#757575',
    },
  ];

  const exerciseCategories = [
    { id: 'peito', name: 'Peito', icon: 'arm-flex', color: '#EA4335' },
    { id: 'costas', name: 'Costas', icon: 'human-handsup', color: '#1E88E5' },
    { id: 'pernas', name: 'Pernas', icon: 'run', color: '#27AE60' },
    { id: 'ombros', name: 'Ombros', icon: 'weight-lifter', color: '#8E44AD' },
    { id: 'braços', name: 'Braços', icon: 'arm-flex-outline', color: '#F39C12' },
    { id: 'abs', name: 'Abdominais', icon: 'human-male', color: '#00BCD4' },
  ];

  const handleProximo = () => {
    if (!opcaoSelecionada) return;
    if (opcaoSelecionada === 'agora') {
      openForm();
    } else {
      // Se selecionou "depois", vai direto para CardioScreen
      router.push('/RegistrarCardioScreen');
    }
  };

  const handleVoltar = () => {
    router.push('/CardioScreen');
  };

  const openForm = () => {
    setFormVisible(true);
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 300,
      easing: Easing.out(Easing.ease),
      useNativeDriver: true,
    }).start();
  };

  const closeForm = () => {
    Animated.timing(slideAnim, {
      toValue: SCREEN_HEIGHT,
      duration: 250,
      easing: Easing.in(Easing.ease),
      useNativeDriver: true,
    }).start(() => setFormVisible(false));
  };

  const handleAddExercise = () => {
    if (!exerciseName || !sets || !reps || !rest) {
      alert('Preencha todos os campos!');
      return;
    }

    const category = exerciseCategories.find(cat => cat.id === selectedCategory);

    const newExercise = {
      id: Date.now().toString(),
      name: exerciseName,
      sets: parseInt(sets),
      reps: reps,
      rest: rest,
      category: selectedCategory,
      categoryName: category?.name,
      categoryColor: category?.color,
      categoryIcon: category?.icon,
    };

    setExercisesAdded(prev => [...prev, newExercise]);

    // Limpar campos
    setExerciseName('');
    setSets('');
    setReps('');
    setRest('');
  };

  const removeExercise = (exerciseId: string) => {
    setExercisesAdded(prev => prev.filter(ex => ex.id !== exerciseId));
  };

  const handleContinue = () => {
    closeForm();
    // Redireciona para RegistrarCardioScreen
    router.push('/RegistrarCardioScreen');
  };

  const handleAddAnother = () => {
    alert('Preencha os campos abaixo para adicionar outro exercício!');
  };

  return (
    <View style={styles.background}>
      {/* Cabeçalho */}
      <View style={styles.headerContainer}>
        <Pressable style={styles.backButton} onPress={handleVoltar}>
          <FontAwesome name="arrow-left" size={20} color="#1E88E5" />
          <Text style={styles.backButtonText}>Voltar</Text>
        </Pressable>
      </View>

      {/* Conteúdo principal */}
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.mainContainer}>
          <View style={styles.imageContainer}>
            <Image source={require('@/assets/images/logo2.png')} style={styles.topImage} resizeMode="cover" />
          </View>

          <View style={styles.content}>
            <Text style={styles.welcomeTitle}>Deseja registrar seu treino agora?</Text>

            <View style={styles.infoBox}>
              <FontAwesome name="info-circle" size={20} color="#1E88E5" />
              <Text style={styles.infoText}>
                Use o app para acompanhar seus treinos e sua evolução 💪
              </Text>
            </View>

            <Text style={styles.subtitle}>
              Registrar seus treinos ajuda a acompanhar seu progresso
            </Text>

            <View style={styles.opcoesContainer}>
              {opcoes.map((opcao) => (
                <Pressable 
                  key={opcao.id} 
                  style={[styles.opcaoItem, opcaoSelecionada === opcao.id && styles.opcaoItemSelecionado]} 
                  onPress={() => setOpcaoSelecionada(opcao.id)}
                >
                  <View style={[styles.opcaoIconContainer, { backgroundColor: `${opcao.color}15` }]}>
                    <FontAwesome name={opcao.icon as any} size={28} color={opcao.color} />
                  </View>

                  <View style={styles.opcaoContent}>
                    <Text style={styles.opcaoTitulo}>{opcao.title}</Text>
                    <Text style={styles.opcaoSubtitulo}>{opcao.subtitle}</Text>
                  </View>

                  <View style={[styles.radioButton, opcaoSelecionada === opcao.id && styles.radioButtonSelecionado]}>
                    {opcaoSelecionada === opcao.id && <View style={styles.radioButtonInner} />}
                  </View>
                </Pressable>
              ))}
            </View>

            <Pressable 
              style={[styles.primaryButton, !opcaoSelecionada && styles.primaryButtonDisabled]} 
              onPress={handleProximo} 
              disabled={!opcaoSelecionada}
            >
              <View style={styles.buttonContent}>
                <FontAwesome name="arrow-right" size={22} color="#FFFFFF" />
                <Text style={styles.primaryText}>Próximo</Text>
              </View>
              <Text style={styles.buttonSubtitle}>
                {opcaoSelecionada ? 'Continue para a próxima etapa' : 'Selecione uma opção para continuar'}
              </Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>

      {/* Formulário animado de tela cheia */}
      {formVisible && (
        <Animated.View style={[styles.fullScreenForm, { transform: [{ translateY: slideAnim }] }]}>
          <ScrollView style={{ flex: 1 }} contentContainerStyle={styles.formScrollContent}>
            {/* Botão fechar */}
            <TouchableOpacity onPress={closeForm} style={styles.closeButtonForm}>
              <MaterialIcons name="close" size={24} color="#64748B" />
            </TouchableOpacity>

            {/* Cabeçalho do form */}
            <View style={styles.modalHeader}>
              <MaterialCommunityIcons name="dumbbell" size={28} color="#1E88E5" />
              <View style={styles.modalHeaderTexts}>
                <Text style={styles.modalTitle}>Registrar Treino</Text>
                <Text style={styles.modalSubtitle}>
                  {exercisesAdded.length > 0 
                    ? `${exercisesAdded.length} exercício(s) adicionado(s)` 
                    : 'Adicione os exercícios realizados'}
                </Text>
              </View>
            </View>

            {/* Lista de exercícios adicionados */}
            {exercisesAdded.length > 0 && (
              <View style={styles.exercisesAddedContainer}>
                <Text style={styles.exercisesAddedTitle}>Seus Exercícios</Text>
                {exercisesAdded.map((exercise) => (
                  <View key={exercise.id} style={styles.exerciseAddedCard}>
                    <View style={styles.exerciseAddedInfo}>
                      <View style={[styles.exerciseAddedIcon, { backgroundColor: `${exercise.categoryColor}15` }]}>
                        <MaterialCommunityIcons name={exercise.categoryIcon as any} size={16} color={exercise.categoryColor} />
                      </View>
                      <View style={styles.exerciseAddedDetails}>
                        <Text style={styles.exerciseAddedName}>{exercise.name}</Text>
                        <Text style={styles.exerciseAddedStats}>
                          {exercise.sets} séries × {exercise.reps} reps • {exercise.rest} descanso
                        </Text>
                      </View>
                    </View>
                    <TouchableOpacity onPress={() => removeExercise(exercise.id)} style={styles.removeExerciseButton}>
                      <MaterialIcons name="close" size={20} color="#F44336" />
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            )}

            {/* Formulário */}
            <View style={styles.formContainer}>
              <Text style={styles.formTitle}>
                {exercisesAdded.length > 0 ? 'Adicionar mais um exercício' : 'Adicione seu primeiro exercício'}
              </Text>

              {/* Categorias */}
              <View style={styles.modalSection}>
                <Text style={styles.modalSectionTitle}>Grupo Muscular</Text>
                <View style={styles.categoryButtons}>
                  {exerciseCategories.map(category => (
                    <TouchableOpacity
                      key={category.id}
                      style={[
                        styles.categoryButton,
                        selectedCategory === category.id && styles.categoryButtonSelected,
                        { borderColor: category.color }
                      ]}
                      onPress={() => setSelectedCategory(category.id)}
                    >
                      <MaterialCommunityIcons
                        name={category.icon as any}
                        size={20}
                        color={selectedCategory === category.id ? '#FFFFFF' : category.color}
                      />
                      <Text style={[
                        styles.categoryButtonText,
                        selectedCategory === category.id && styles.categoryButtonTextSelected,
                        { color: selectedCategory === category.id ? '#FFFFFF' : category.color }
                      ]}>
                        {category.name}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Inputs */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Nome do Exercício</Text>
                <TextInput
                  style={styles.input}
                  value={exerciseName}
                  onChangeText={setExerciseName}
                  placeholder="Ex: Supino Reto"
                  placeholderTextColor="#94A3B8"
                />
              </View>

              <View style={styles.exerciseGrid}>
                <View style={styles.exerciseInput}>
                  <Text style={styles.inputLabel}>Séries</Text>
                  <TextInput
                    style={styles.input}
                    value={sets}
                    onChangeText={setSets}
                    keyboardType="number-pad"
                    placeholder="Ex: 4"
                    placeholderTextColor="#94A3B8"
                  />
                </View>

                <View style={styles.exerciseInput}>
                  <Text style={styles.inputLabel}>Repetições</Text>
                  <TextInput
                    style={styles.input}
                    value={reps}
                    onChangeText={setReps}
                    placeholder="Ex: 8-12"
                    placeholderTextColor="#94A3B8"
                  />
                </View>

                <View style={styles.exerciseInput}>
                  <Text style={styles.inputLabel}>Descanso</Text>
                  <TextInput
                    style={styles.input}
                    value={rest}
                    onChangeText={setRest}
                    placeholder="Ex: 60s"
                    placeholderTextColor="#94A3B8"
                  />
                </View>
              </View>

              <TouchableOpacity
                style={[styles.modalActionButton, styles.addButton]}
                onPress={handleAddExercise}
              >
                <Feather name="plus" size={20} color="#FFFFFF" />
                <Text style={styles.addButtonText}>
                  {exercisesAdded.length > 0 ? 'Adicionar mais um' : 'Adicionar Exercício'}
                </Text>
              </TouchableOpacity>

              {/* Botões de ação */}
              <View style={styles.actionButtonsContainer}>
                <TouchableOpacity
                  style={[styles.actionButton, styles.continueButton]}
                  onPress={handleContinue}
                >
                  <LinearGradient
                    colors={exercisesAdded.length > 0 ? ['#1E88E5', '#8E44AD'] : ['#4CAF50', '#2E7D32']}
                    style={styles.continueButtonGradient}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                  >
                    <FontAwesome name="arrow-right" size={20} color="#FFFFFF" />
                    <Text style={styles.continueButtonText}>
                      {exercisesAdded.length > 0 ? 'Continuar' : 'Pular e Continuar'}
                    </Text>
                  </LinearGradient>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.actionButton, styles.addAnotherButton]}
                  onPress={handleAddAnother}
                >
                  <MaterialIcons name="add-circle-outline" size={20} color="#1E88E5" />
                  <Text style={styles.addAnotherButtonText}>Adicionar outro treino</Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </Animated.View>
      )}
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
    marginBottom: 20, 
    lineHeight: 32 
  },
  infoBox: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: '#F0F9FF', 
    padding: 16, 
    borderRadius: 12, 
    borderWidth: 1, 
    borderColor: '#BBDEFB', 
    gap: 12, 
    marginBottom: 20, 
    width: '100%' 
  },
  infoText: { 
    flex: 1, 
    color: '#1E88E5', 
    fontSize: 16, 
    lineHeight: 22 
  },
  subtitle: { 
    color: '#666666', 
    fontSize: 17, 
    textAlign: 'center', 
    marginBottom: 32, 
    lineHeight: 24 
  },
  opcoesContainer: { 
    width: '100%', 
    gap: 20, 
    marginBottom: 25 
  },
  opcaoItem: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    paddingVertical: 20, 
    paddingHorizontal: 16, 
    backgroundColor: '#F8F9FA', 
    borderRadius: 12, 
    borderWidth: 2, 
    borderColor: '#E9ECEF', 
    gap: 20 
  },
  opcaoItemSelecionado: { 
    backgroundColor: '#F0F9FF', 
    borderColor: '#1E88E5' 
  },
  opcaoIconContainer: { 
    width: 60, 
    height: 60, 
    borderRadius: 30, 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  opcaoContent: { 
    flex: 1 
  },
  opcaoTitulo: { 
    color: '#000000', 
    fontSize: 18, 
    fontWeight: '600', 
    marginBottom: 4 
  },
  opcaoSubtitulo: { 
    color: '#666666', 
    fontSize: 14 
  },
  radioButton: { 
    width: 24, 
    height: 24, 
    borderRadius: 12, 
    borderWidth: 2, 
    borderColor: '#CCCCCC', 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  radioButtonSelecionado: { 
    borderColor: '#1E88E5', 
    backgroundColor: '#1E88E5' 
  },
  radioButtonInner: { 
    width: 12, 
    height: 12, 
    borderRadius: 6, 
    backgroundColor: '#FFFFFF' 
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
  fullScreenForm: { 
    position: 'absolute', 
    top: 0, 
    left: 0, 
    right: 0, 
    bottom: 0, 
    backgroundColor: '#FFFFFF', 
    zIndex: 50 
  },
  formScrollContent: { 
    padding: 20 
  },
  closeButtonForm: { 
    position: 'absolute', 
    top: 15, 
    right: 15, 
    zIndex: 10 
  },
  modalHeader: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    gap: 12, 
    marginTop: 50, 
    marginBottom: 20 
  },
  modalHeaderTexts: {
    flex: 1
  },
  modalTitle: { 
    fontSize: 24, 
    fontWeight: '700', 
    color: '#000000' 
  },
  modalSubtitle: { 
    fontSize: 16, 
    color: '#64748B' 
  },
  exercisesAddedContainer: { 
    marginBottom: 20 
  },
  exercisesAddedTitle: { 
    fontSize: 16, 
    fontWeight: '600', 
    marginBottom: 12,
    color: '#000000'
  },
  exerciseAddedCard: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    padding: 12, 
    backgroundColor: '#F8F9FA', 
    borderRadius: 12, 
    marginBottom: 8 
  },
  exerciseAddedInfo: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    gap: 12 
  },
  exerciseAddedIcon: { 
    width: 32, 
    height: 32, 
    borderRadius: 16, 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  exerciseAddedDetails: {
    flex: 1
  },
  exerciseAddedName: { 
    fontSize: 15, 
    fontWeight: '600', 
    color: '#000000' 
  },
  exerciseAddedStats: { 
    fontSize: 13, 
    color: '#64748B' 
  },
  removeExerciseButton: {
    padding: 4
  },
  formContainer: {},
  formTitle: { 
    fontSize: 18, 
    fontWeight: '600', 
    marginBottom: 12,
    color: '#000000'
  },
  modalSection: { 
    marginVertical: 12 
  },
  modalSectionTitle: { 
    fontSize: 14, 
    fontWeight: '600', 
    marginBottom: 8, 
    color: '#64748B' 
  },
  categoryButtons: { 
    flexDirection: 'row', 
    flexWrap: 'wrap', 
    gap: 10 
  },
  categoryButton: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    gap: 6, 
    paddingHorizontal: 12, 
    paddingVertical: 6, 
    borderWidth: 1, 
    borderRadius: 12 
  },
  categoryButtonSelected: { 
    backgroundColor: '#1E88E5', 
    borderColor: '#1E88E5' 
  },
  categoryButtonText: { 
    fontSize: 14, 
    fontWeight: '500' 
  },
  categoryButtonTextSelected: { 
    color: '#FFFFFF' 
  },
  inputGroup: { 
    marginBottom: 12 
  },
  inputLabel: { 
    fontSize: 14, 
    fontWeight: '600', 
    marginBottom: 6, 
    color: '#64748B' 
  },
  input: { 
    borderWidth: 1, 
    borderColor: '#E2E8F0', 
    borderRadius: 12, 
    paddingHorizontal: 12, 
    paddingVertical: 10, 
    fontSize: 16, 
    color: '#000000',
    backgroundColor: '#FFFFFF'
  },
  exerciseGrid: { 
    flexDirection: 'row', 
    gap: 12, 
    marginBottom: 12 
  },
  exerciseInput: { 
    flex: 1 
  },
  modalActionButton: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'center', 
    paddingVertical: 14, 
    borderRadius: 12, 
    gap: 6, 
    marginVertical: 10 
  },
  addButton: { 
    backgroundColor: '#1E88E5' 
  },
  addButtonText: { 
    color: '#FFFFFF', 
    fontWeight: '600', 
    fontSize: 16 
  },
  actionButtonsContainer: { 
    marginTop: 20, 
    gap: 12 
  },
  actionButton: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'center', 
    paddingVertical: 12, 
    borderRadius: 12, 
    gap: 8 
  },
  continueButton: {
    overflow: 'hidden'
  },
  continueButtonGradient: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'center', 
    width: '100%',
    height: '100%',
    borderRadius: 12, 
    paddingVertical: 12, 
    gap: 8 
  },
  continueButtonText: { 
    color: '#FFFFFF', 
    fontWeight: '600', 
    fontSize: 16 
  },
  addAnotherButton: { 
    borderWidth: 1, 
    borderColor: '#1E88E5' 
  },
  addAnotherButtonText: { 
    color: '#1E88E5', 
    fontWeight: '600', 
    fontSize: 16 
  },
});