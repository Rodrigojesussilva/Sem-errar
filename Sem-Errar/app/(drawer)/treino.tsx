// app/(drawer)/treino.tsx
import {
  Feather,
  Ionicons,
  MaterialCommunityIcons,
  MaterialIcons
} from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  Dimensions,
  FlatList,
  Modal,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';

const { width } = Dimensions.get('window');

// Interface para exercícios
interface Exercise {
  id: string;
  name: string;
  sets: number;
  reps: string;
  rest: string;
  category: 'peito' | 'costas' | 'pernas' | 'ombros' | 'braços' | 'abs';
  isFavorite: boolean;
  createdAt: Date;
}

// Categorias de exercícios (SEM CARDIO)
const exerciseCategories = [
  { id: 'peito', name: 'Peito', icon: 'arm-flex', color: '#EA4335' },
  { id: 'costas', name: 'Costas', icon: 'human-handsup', color: '#1E88E5' },
  { id: 'pernas', name: 'Pernas', icon: 'run', color: '#27AE60' },
  { id: 'ombros', name: 'Ombros', icon: 'weight-lifter', color: '#8E44AD' },
  { id: 'braços', name: 'Braços', icon: 'arm-flex-outline', color: '#F39C12' },
  { id: 'abs', name: 'Abdominais', icon: 'human-male', color: '#00BCD4' },
];

export default function TreinoScreen() {
  const router = useRouter();

  // Estados para modais
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('peito');
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);

  // Estados para o formulário
  const [exerciseName, setExerciseName] = useState('');
  const [sets, setSets] = useState('');
  const [reps, setReps] = useState('');
  const [rest, setRest] = useState('');

  // Lista de exercícios salvos (SEM EXERCÍCIOS DE CARDIO)
  const [exercises, setExercises] = useState<Exercise[]>([
    {
      id: '1',
      name: 'Supino Reto',
      sets: 4,
      reps: '8-12',
      rest: '60s',
      category: 'peito',
      isFavorite: true,
      createdAt: new Date('2024-12-14'),
    },
    {
      id: '2',
      name: 'Agachamento Livre',
      sets: 5,
      reps: '6-10',
      rest: '90s',
      category: 'pernas',
      isFavorite: true,
      createdAt: new Date('2024-12-15'),
    },
    {
      id: '3',
      name: 'Remada Curvada',
      sets: 4,
      reps: '8-12',
      rest: '60s',
      category: 'costas',
      isFavorite: false,
      createdAt: new Date('2024-12-13'),
    },
    {
      id: '4',
      name: 'Desenvolvimento',
      sets: 4,
      reps: '10-15',
      rest: '60s',
      category: 'ombros',
      isFavorite: true,
      createdAt: new Date('2024-12-12'),
    },
    {
      id: '5',
      name: 'Rosca Direta',
      sets: 3,
      reps: '12-15',
      rest: '45s',
      category: 'braços',
      isFavorite: false,
      createdAt: new Date('2024-12-11'),
    },
    {
      id: '6',
      name: 'Prancha',
      sets: 3,
      reps: '30-60s',
      rest: '30s',
      category: 'abs',
      isFavorite: true,
      createdAt: new Date('2024-12-10'),
    },
  ]);

  // Exercícios recentes (hoje)
  const recentExercises = exercises
    .filter(exercise => exercise.createdAt.toDateString() === new Date().toDateString())
    .slice(0, 3);

  // Alternar favorito
  const toggleFavorite = (exerciseId: string) => {
    setExercises(prevExercises =>
      prevExercises.map(exercise =>
        exercise.id === exerciseId ? { ...exercise, isFavorite: !exercise.isFavorite } : exercise
      )
    );
  };

  // Abrir modal de adição
  const openAddModal = (category?: string) => {
    if (category) {
      setSelectedCategory(category);
    }
    setExerciseName('');
    setSets('');
    setReps('');
    setRest('');
    setAddModalVisible(true);
  };

  // Abrir modal de edição
  const openEditModal = (exercise: Exercise) => {
    setSelectedExercise(exercise);
    setExerciseName(exercise.name);
    setSets(exercise.sets.toString());
    setReps(exercise.reps);
    setRest(exercise.rest);
    setSelectedCategory(exercise.category);
    setEditModalVisible(true);
  };

  // Adicionar novo exercício
  const handleAddExercise = () => {
    if (!exerciseName || !sets || !reps || !rest) {
      alert('Preencha todos os campos!');
      return;
    }

    const newExercise: Exercise = {
      id: Date.now().toString(),
      name: exerciseName,
      sets: parseInt(sets),
      reps: reps,
      rest: rest,
      category: selectedCategory as any,
      isFavorite: false,
      createdAt: new Date(),
    };

    setExercises(prev => [newExercise, ...prev]);
    setAddModalVisible(false);
    resetForm();
  };

  // Atualizar exercício
  const handleUpdateExercise = () => {
    if (!selectedExercise || !exerciseName || !sets || !reps || !rest) {
      alert('Preencha todos os campos!');
      return;
    }

    setExercises(prevExercises =>
      prevExercises.map(exercise =>
        exercise.id === selectedExercise.id
          ? {
            ...exercise,
            name: exerciseName,
            sets: parseInt(sets),
            reps: reps,
            rest: rest,
            category: selectedCategory as any,
          }
          : exercise
      )
    );

    setEditModalVisible(false);
    resetForm();
  };

  // Excluir exercício
  const handleDeleteExercise = (exerciseId: string) => {
    setExercises(prevExercises => prevExercises.filter(exercise => exercise.id !== exerciseId));
    setEditModalVisible(false);
    resetForm();
  };

  // Resetar formulário
  const resetForm = () => {
    setExerciseName('');
    setSets('');
    setReps('');
    setRest('');
    setSelectedExercise(null);
  };

  // Renderizar item da lista de exercícios
  const renderExerciseItem = ({ item }: { item: Exercise }) => {
    const category = exerciseCategories.find(cat => cat.id === item.category);

    return (
      <TouchableOpacity
        style={styles.exerciseCard}
        onPress={() => openEditModal(item)}
        activeOpacity={0.7}
      >
        <View style={styles.exerciseHeader}>
          <View style={styles.exerciseNameContainer}>
            <Text style={styles.exerciseName}>{item.name}</Text>
            <View style={[styles.categoryBadge, { backgroundColor: `${category?.color}15` }]}>
              <MaterialCommunityIcons
                name={category?.icon as any}
                size={14}
                color={category?.color}
              />
              <Text style={[styles.categoryText, { color: category?.color }]}>
                {category?.name}
              </Text>
            </View>
          </View>

          <TouchableOpacity
            style={styles.favoriteButton}
            onPress={(e) => {
              e.stopPropagation();
              toggleFavorite(item.id);
            }}
          >
            <MaterialIcons
              name={item.isFavorite ? 'favorite' : 'favorite-border'}
              size={20}
              color={item.isFavorite ? '#EA4335' : '#CBD5E1'}
            />
          </TouchableOpacity>
        </View>

        <View style={styles.exerciseDetails}>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Séries</Text>
            <Text style={styles.detailValue}>{item.sets}</Text>
          </View>
          <View style={styles.detailDivider} />
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Repetições</Text>
            <Text style={styles.detailValue}>{item.reps}</Text>
          </View>
          <View style={styles.detailDivider} />
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Descanso</Text>
            <Text style={styles.detailValue}>{item.rest}</Text>
          </View>
        </View>

        <View style={styles.exerciseFooter}>
          <Text style={styles.exerciseDate}>
            {item.createdAt.toLocaleDateString('pt-BR', {
              day: '2-digit',
              month: '2-digit',
              year: 'numeric'
            })}
          </Text>
          <View style={styles.exerciseActions}>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={(e) => {
                e.stopPropagation();
                openEditModal(item);
              }}
            >
              <MaterialIcons name="edit" size={18} color="#64748B" />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={(e) => {
                e.stopPropagation();
                // Adicionar ao treino de hoje
                alert(`"${item.name}" adicionado ao treino de hoje!`);
              }}
            >
              <MaterialIcons name="add-circle" size={18} color="#27AE60" />
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  // Renderizar categoria
  const renderCategory = (category: typeof exerciseCategories[0]) => (
    <TouchableOpacity
      key={category.id}
      style={styles.categoryCard}
      onPress={() => openAddModal(category.id)}
      activeOpacity={0.7}
    >
      <LinearGradient
        colors={[`${category.color}15`, `${category.color}05`]}
        style={styles.categoryGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <MaterialCommunityIcons
          name={category.icon as any}
          size={32}
          color={category.color}
        />
        <Text style={[styles.categoryTitle, { color: category.color }]}>
          {category.name}
        </Text>
        <Text style={styles.categoryCount}>
          {exercises.filter(e => e.category === category.id).length} exercícios
        </Text>
        <View style={styles.addButtonCategory}>
          <Feather name="plus" size={20} color="#FFFFFF" />
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#FFFFFF" barStyle="dark-content" />

      {/* Cabeçalho */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.replace('/diarias')}
          >
            <Ionicons name="arrow-back" size={24} color="#1E293B" />
          </TouchableOpacity>
          <View>
            <Text style={styles.appName}>Treino</Text>
            <Text style={styles.headerSubtitle}>Gerencie seus exercícios salvos</Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.addButton}
          onPress={() => openAddModal()}
        >
          <LinearGradient
            colors={['#1E88E5', '#8E44AD']}
            style={styles.addButtonGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Feather name="plus" size={24} color="#FFFFFF" />
          </LinearGradient>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Seção: Categorias */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Categorias</Text>
          <Text style={styles.sectionSubtitle}>
            Adicione exercícios por grupo muscular para usar depois
          </Text>

          <View style={styles.categoriesGrid}>
            {exerciseCategories.map(renderCategory)}
          </View>
        </View>

        {/* Seção: Exercícios de Hoje */}
        {recentExercises.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Exercícios de Hoje</Text>
              <TouchableOpacity>
                <Text style={styles.seeAllButton}>Ver todos</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.todayExercises}>
              {recentExercises.map((exercise, index) => {
                const category = exerciseCategories.find(cat => cat.id === exercise.category);
                return (
                  <View 
                    key={exercise.id} 
                    style={[
                      styles.todayExerciseCard,
                      index === recentExercises.length - 1 && styles.todayExerciseCardLast
                    ]}
                  >
                    <View style={styles.todayExerciseHeader}>
                      <View style={[styles.todayExerciseIcon, { backgroundColor: `${category?.color}15` }]}>
                        <MaterialCommunityIcons
                          name={category?.icon as any}
                          size={18}
                          color={category?.color}
                        />
                      </View>
                      <Text style={styles.todayExerciseName}>{exercise.name}</Text>
                    </View>
                    <View style={styles.todayExerciseInfo}>
                      <Text style={styles.todayExerciseSets}>{exercise.sets} séries</Text>
                      <View style={styles.todayExerciseDetails}>
                        <Text style={styles.todayExerciseDetail}>{exercise.reps} reps</Text>
                        <Text style={styles.todayExerciseDetail}>•</Text>
                        <Text style={styles.todayExerciseDetail}>{exercise.rest} desc</Text>
                      </View>
                    </View>
                  </View>
                );
              })}
            </View>
          </View>
        )}

        {/* Seção: Todos os Exercícios */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Todos os Exercícios</Text>
            <Text style={styles.exercisesCount}>
              {exercises.length} exercícios salvos
            </Text>
          </View>

          <FlatList
            data={exercises}
            renderItem={renderExerciseItem}
            keyExtractor={item => item.id}
            scrollEnabled={false}
            contentContainerStyle={styles.exercisesList}
            ItemSeparatorComponent={() => <View style={styles.exerciseSeparator} />}
          />
        </View>

        {/* Espaço final */}
        <View style={styles.bottomSpacer} />
      </ScrollView>

      {/* Modal para Adicionar Exercício */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={addModalVisible}
        onRequestClose={() => setAddModalVisible(false)}
      >
        <TouchableWithoutFeedback onPress={() => setAddModalVisible(false)}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback>
              <View style={styles.modalContainer}>
                <View style={styles.modalHeader}>
                  <MaterialCommunityIcons name="dumbbell" size={28} color="#EA4335" />
                  <Text style={styles.modalTitle}>Novo Exercício</Text>
                </View>

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

                {/* Campos do formulário */}
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

                <View style={styles.modalButtons}>
                  <TouchableOpacity
                    style={[styles.modalButton, styles.cancelButton]}
                    onPress={() => setAddModalVisible(false)}
                  >
                    <Text style={styles.cancelButtonText}>Cancelar</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.modalButton, styles.saveButton]}
                    onPress={handleAddExercise}
                  >
                    <Text style={styles.saveButtonText}>Salvar</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      {/* Modal para Editar Exercício */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={editModalVisible}
        onRequestClose={() => setEditModalVisible(false)}
      >
        <TouchableWithoutFeedback onPress={() => setEditModalVisible(false)}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback>
              <View style={styles.modalContainer}>
                <View style={styles.modalHeader}>
                  <MaterialCommunityIcons name="dumbbell" size={28} color="#1E88E5" />
                  <Text style={styles.modalTitle}>Editar Exercício</Text>
                </View>

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

                {/* Campos do formulário */}
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

                <View style={styles.modalButtons}>
                  <TouchableOpacity
                    style={[styles.modalButton, styles.deleteButton]}
                    onPress={() => {
                      if (selectedExercise) {
                        handleDeleteExercise(selectedExercise.id);
                      }
                    }}
                  >
                    <MaterialIcons name="delete" size={20} color="#FFFFFF" />
                    <Text style={styles.deleteButtonText}>Excluir</Text>
                  </TouchableOpacity>

                  <View style={styles.editButtons}>
                    <TouchableOpacity
                      style={[styles.modalButton, styles.cancelButton]}
                      onPress={() => setEditModalVisible(false)}
                    >
                      <Text style={styles.cancelButtonText}>Cancelar</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={[styles.modalButton, styles.saveButton]}
                      onPress={handleUpdateExercise}
                    >
                      <Text style={styles.saveButtonText}>Atualizar</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
  },

  // Header
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  backButton: {
    padding: 6,
  },
  appName: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1E293B',
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#64748B',
  },
  addButton: {
    shadowColor: '#1E88E5',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  addButtonGradient: {
    width: 48,
    height: 48,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Seções
  section: {
    paddingHorizontal: 20,
    marginTop: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1E293B',
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#64748B',
    marginBottom: 20,
  },
  seeAllButton: {
    fontSize: 14,
    color: '#1E88E5',
    fontWeight: '600',
  },
  exercisesCount: {
    fontSize: 14,
    color: '#64748B',
    fontWeight: '600',
  },

  // Categorias
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
    marginBottom: 8,
  },
  categoryCard: {
    width: '48%',
    marginBottom: 12,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  categoryGradient: {
    padding: 20,
    alignItems: 'center',
    position: 'relative',
  },
  categoryTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginTop: 12,
    marginBottom: 4,
  },
  categoryCount: {
    fontSize: 12,
    color: '#64748B',
  },
  addButtonCategory: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Exercícios de Hoje
  todayExercises: {
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  todayExerciseCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  todayExerciseCardLast: {
    borderBottomWidth: 0,
  },
  todayExerciseHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  todayExerciseIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  todayExerciseName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1E293B',
  },
  todayExerciseInfo: {
    alignItems: 'flex-end',
  },
  todayExerciseSets: {
    fontSize: 14,
    fontWeight: '700',
    color: '#EA4335',
    marginBottom: 4,
  },
  todayExerciseDetails: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
  },
  todayExerciseDetail: {
    fontSize: 11,
    color: '#64748B',
  },

  // Lista de Exercícios
  exercisesList: {
    paddingBottom: 8,
  },
  exerciseCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1.5,
    borderColor: '#F1F5F9',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  exerciseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  exerciseNameContainer: {
    flex: 1,
  },
  exerciseName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 8,
  },
  categoryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  categoryText: {
    fontSize: 11,
    fontWeight: '600',
  },
  favoriteButton: {
    padding: 4,
  },
  exerciseDetails: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    paddingTop: 12,
    marginBottom: 12,
  },
  detailItem: {
    alignItems: 'center',
  },
  detailLabel: {
    fontSize: 12,
    color: '#64748B',
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1E293B',
  },
  detailDivider: {
    width: 1,
    height: 24,
    backgroundColor: '#E2E8F0',
  },
  exerciseFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    paddingTop: 12,
  },
  exerciseDate: {
    fontSize: 12,
    color: '#64748B',
  },
  exerciseActions: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    padding: 6,
  },
  exerciseSeparator: {
    height: 12,
  },

  // Modais
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    width: '100%',
    maxWidth: 400,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1E293B',
    marginLeft: 12,
  },
  modalSection: {
    marginBottom: 20,
  },
  modalSectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#334155',
    marginBottom: 12,
  },
  categoryButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  categoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1.5,
    backgroundColor: '#FFFFFF',
  },
  categoryButtonSelected: {
    backgroundColor: '#EA4335',
    borderColor: '#EA4335',
  },
  categoryButtonText: {
    fontSize: 12,
    fontWeight: '600',
  },
  categoryButtonTextSelected: {
    color: '#FFFFFF',
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#334155',
    marginBottom: 8,
  },
  input: {
    height: 52,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    color: '#1E293B',
    backgroundColor: '#F8FAFC',
  },
  exerciseGrid: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  exerciseInput: {
    flex: 1,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  editButtons: {
    flexDirection: 'row',
    gap: 12,
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalButton: {
    height: 52,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  cancelButton: {
    backgroundColor: '#F1F5F9',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingHorizontal: 24,
  },
  saveButton: {
    backgroundColor: '#1E88E5',
    paddingHorizontal: 24,
  },
  deleteButton: {
    backgroundColor: '#EA4335',
    paddingHorizontal: 20,
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#64748B',
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  deleteButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },

  // Espaçamento
  bottomSpacer: {
    height: 40,
  },
});