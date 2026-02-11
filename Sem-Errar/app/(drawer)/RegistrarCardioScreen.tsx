import {
  Feather,
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

export default function RegistrarCardioScreen() {
  const router = useRouter();
  const [opcaoSelecionada, setOpcaoSelecionada] = useState<string | null>(null);
  
  // Estado do form animado
  const [formVisible, setFormVisible] = useState(false);
  const slideAnim = useRef(new Animated.Value(SCREEN_HEIGHT)).current;

  // Estados para o formulário de cardio
  const [selectedCategory, setSelectedCategory] = useState('running');
  const [exerciseName, setExerciseName] = useState('');
  const [duration, setDuration] = useState('');
  const [distance, setDistance] = useState('');
  const [calories, setCalories] = useState('');
  const [intensity, setIntensity] = useState('moderada');
  const [heartRate, setHeartRate] = useState('');
  const [exercisesAdded, setExercisesAdded] = useState<any[]>([]);

  const opcoes = [
    {
      id: 'agora',
      title: '🏃 Vamos lá',
      subtitle: 'Registrar meu cardio agora',
      icon: 'heartbeat',
      color: '#E91E63',
    },
    {
      id: 'depois',
      title: '⏳ Registrar mais tarde',
      subtitle: 'Voltar para o app depois',
      icon: 'clock-o',
      color: '#757575',
    },
  ];

  // Categorias de cardio
  const cardioCategories = [
    { id: 'running', name: 'Corrida', icon: 'run', color: '#EA4335' },
    { id: 'walking', name: 'Caminhada', icon: 'walk', color: '#8E44AD' },
    { id: 'cycling', name: 'Ciclismo', icon: 'bicycle', color: '#1E88E5' },
    { id: 'swimming', name: 'Natação', icon: 'tint', color: '#27AE60' },
    { id: 'elliptical', name: 'Elíptico', icon: 'circle-o-notch', color: '#F39C12' },
    { id: 'stair', name: 'Escada', icon: 'sort-asc', color: '#00BCD4' },
  ];

  // Intensidades
  const intensities = [
    { id: 'baixa', name: 'Baixa', color: '#27AE60' },
    { id: 'moderada', name: 'Moderada', color: '#F39C12' },
    { id: 'alta', name: 'Alta', color: '#EA4335' },
  ];

  const handleProximo = () => {
    if (!opcaoSelecionada) return;
    if (opcaoSelecionada === 'agora') {
      openForm();
    } else {
      router.push('/ContextoBFScreen');
    }
  };

  const handleVoltar = () => {
    router.push('/RegistrarTreinoScreen');
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
    if (!exerciseName || !duration || !calories) {
      alert('Preencha todos os campos obrigatórios!');
      return;
    }

    const category = cardioCategories.find(cat => cat.id === selectedCategory);
    
    const newExercise = {
      id: Date.now().toString(),
      name: exerciseName,
      duration: duration,
      distance: distance || undefined,
      calories: calories,
      intensity: intensity,
      heartRate: heartRate || undefined,
      category: selectedCategory,
      categoryName: category?.name,
      categoryColor: category?.color,
      categoryIcon: category?.icon,
    };

    setExercisesAdded(prev => [...prev, newExercise]);
    
    // Resetar formulário
    setExerciseName('');
    setDuration('');
    setDistance('');
    setCalories('');
    setHeartRate('');
  };

  const removeExercise = (exerciseId: string) => {
    setExercisesAdded(prev => prev.filter(ex => ex.id !== exerciseId));
  };

  const handleContinue = () => {
    // Primeiro fecha o formulário com animação
    Animated.timing(slideAnim, {
      toValue: SCREEN_HEIGHT,
      duration: 250,
      easing: Easing.in(Easing.ease),
      useNativeDriver: true,
    }).start(() => {
      setFormVisible(false);
      // Redireciona APÓS a animação terminar
      router.push('/ContextoBFScreen');
    });
  };

  const handleAddAnother = () => {
    alert('Preencha os campos abaixo para adicionar outra atividade!');
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
            <Text style={styles.welcomeTitle}>Deseja registrar seu cardio agora?</Text>
            
            <View style={styles.infoBox}>
              <FontAwesome name="info-circle" size={20} color="#1E88E5" />
              <Text style={styles.infoText}>
                Registre caminhadas, corridas, bike e outras atividades ❤️
              </Text>
            </View>
            
            <Text style={styles.subtitle}>
              Acompanhar seu cardio ajuda a melhorar sua saúde cardiovascular
            </Text>
            
            <View style={styles.opcoesContainer}>
              {opcoes.map((opcao) => (
                <Pressable key={opcao.id} style={[styles.opcaoItem, opcaoSelecionada === opcao.id && styles.opcaoItemSelecionado]} onPress={() => setOpcaoSelecionada(opcao.id)}>
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
            
            <Pressable style={[styles.primaryButton, !opcaoSelecionada && styles.primaryButtonDisabled]} onPress={handleProximo} disabled={!opcaoSelecionada}>
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
              <FontAwesome name="heartbeat" size={28} color="#E91E63" />
              <View style={styles.modalHeaderTexts}>
                <Text style={styles.modalTitle}>Registrar Cardio</Text>
                <Text style={styles.modalSubtitle}>
                  {exercisesAdded.length > 0 
                    ? `${exercisesAdded.length} atividade(s) adicionada(s)` 
                    : 'Adicione suas atividades cardiovasculares'}
                </Text>
              </View>
            </View>

            {/* Lista de atividades adicionadas */}
            {exercisesAdded.length > 0 && (
              <View style={styles.exercisesAddedContainer}>
                <Text style={styles.exercisesAddedTitle}>Suas Atividades</Text>
                {exercisesAdded.map((exercise) => (
                  <View key={exercise.id} style={styles.exerciseAddedCard}>
                    <View style={styles.exerciseAddedInfo}>
                      <View style={[styles.exerciseAddedIcon, { backgroundColor: `${exercise.categoryColor}15` }]}>
                        <FontAwesome
                          name={exercise.categoryIcon as any}
                          size={16}
                          color={exercise.categoryColor}
                        />
                      </View>
                      <View style={styles.exerciseAddedDetails}>
                        <Text style={styles.exerciseAddedName}>{exercise.name}</Text>
                        <Text style={styles.exerciseAddedStats}>
                          {exercise.duration} • {exercise.calories} cal
                          {exercise.distance && ` • ${exercise.distance}`}
                          {exercise.heartRate && ` • ${exercise.heartRate}`}
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
                {exercisesAdded.length > 0 ? 'Adicionar mais uma atividade' : 'Adicione sua primeira atividade'}
              </Text>
              
              {/* Categorias */}
              <View style={styles.modalSection}>
                <Text style={styles.modalSectionTitle}>Tipo de Atividade</Text>
                <View style={styles.categoryButtons}>
                  {cardioCategories.map(category => (
                    <TouchableOpacity
                      key={category.id}
                      style={[
                        styles.categoryButton,
                        selectedCategory === category.id && styles.categoryButtonSelected,
                        { borderColor: category.color }
                      ]}
                      onPress={() => setSelectedCategory(category.id)}
                    >
                      <FontAwesome
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

              {/* Intensidade */}
              <View style={styles.modalSection}>
                <Text style={styles.modalSectionTitle}>Intensidade</Text>
                <View style={styles.intensityButtons}>
                  {intensities.map(intensityItem => (
                    <TouchableOpacity
                      key={intensityItem.id}
                      style={[
                        styles.intensityButton,
                        intensity === intensityItem.id && styles.intensityButtonSelected,
                        { borderColor: intensityItem.color }
                      ]}
                      onPress={() => setIntensity(intensityItem.id)}
                    >
                      <Text style={[
                        styles.intensityButtonText,
                        intensity === intensityItem.id && styles.intensityButtonTextSelected,
                        { color: intensity === intensityItem.id ? '#FFFFFF' : intensityItem.color }
                      ]}>
                        {intensityItem.name}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Campos do formulário */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Nome da Atividade</Text>
                <TextInput
                  style={styles.input}
                  value={exerciseName}
                  onChangeText={setExerciseName}
                  placeholder="Ex: Corrida no Parque"
                  placeholderTextColor="#94A3B8"
                />
              </View>

              <View style={styles.cardioGrid}>
                <View style={styles.cardioInput}>
                  <Text style={styles.inputLabel}>Duração *</Text>
                  <TextInput
                    style={styles.input}
                    value={duration}
                    onChangeText={setDuration}
                    placeholder="Ex: 30 min"
                    placeholderTextColor="#94A3B8"
                  />
                </View>

                <View style={styles.cardioInput}>
                  <Text style={styles.inputLabel}>Distância</Text>
                  <TextInput
                    style={styles.input}
                    value={distance}
                    onChangeText={setDistance}
                    placeholder="Ex: 5 km"
                    placeholderTextColor="#94A3B8"
                  />
                </View>
              </View>

              <View style={styles.cardioGrid}>
                <View style={styles.cardioInput}>
                  <Text style={styles.inputLabel}>Calorias *</Text>
                  <TextInput
                    style={styles.input}
                    value={calories}
                    onChangeText={setCalories}
                    placeholder="Ex: 300"
                    placeholderTextColor="#94A3B8"
                    keyboardType="number-pad"
                  />
                </View>

                <View style={styles.cardioInput}>
                  <Text style={styles.inputLabel}>Frequência Cardíaca</Text>
                  <TextInput
                    style={styles.input}
                    value={heartRate}
                    onChangeText={setHeartRate}
                    placeholder="Ex: 140-160 bpm"
                    placeholderTextColor="#94A3B8"
                  />
                </View>
              </View>

              {/* Botão de Adicionar */}
              <TouchableOpacity
                style={[styles.modalActionButton, styles.addButton]}
                onPress={handleAddExercise}
              >
                <Feather name="plus" size={20} color="#FFFFFF" />
                <Text style={styles.addButtonText}>
                  {exercisesAdded.length > 0 ? 'Adicionar mais uma' : 'Adicionar Atividade'}
                </Text>
              </TouchableOpacity>

              {/* Botões de Ação */}
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
                  <Text style={styles.addAnotherButtonText}>Adicionar outro cardio</Text>
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
    backgroundColor: '#E91E63', 
    borderColor: '#E91E63' 
  },
  categoryButtonText: { 
    fontSize: 14, 
    fontWeight: '500' 
  },
  categoryButtonTextSelected: { 
    color: '#FFFFFF' 
  },
  intensityButtons: { 
    flexDirection: 'row', 
    gap: 10 
  },
  intensityButton: { 
    flex: 1, 
    paddingHorizontal: 12, 
    paddingVertical: 8, 
    borderWidth: 1, 
    borderRadius: 12,
    alignItems: 'center'
  },
  intensityButtonSelected: { 
    backgroundColor: '#E91E63', 
    borderColor: '#E91E63' 
  },
  intensityButtonText: { 
    fontSize: 14, 
    fontWeight: '500' 
  },
  intensityButtonTextSelected: { 
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
  cardioGrid: { 
    flexDirection: 'row', 
    gap: 12, 
    marginBottom: 12 
  },
  cardioInput: { 
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
    backgroundColor: '#E91E63' 
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