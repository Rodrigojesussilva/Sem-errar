// app/(drawer)/cardio.tsx - versão completa com correção
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

// Interface para exercícios de cardio
interface CardioExercise {
  id: string;
  name: string;
  duration: string;
  distance?: string;
  calories: number;
  category: 'running' | 'cycling' | 'swimming' | 'walking' | 'elliptical' | 'stair';
  intensity: 'baixa' | 'moderada' | 'alta';
  heartRate?: string;
  isFavorite: boolean;
  createdAt: Date;
}

// Categorias de cardio
const cardioCategories = [
  { id: 'running', name: 'Corrida', icon: 'run-fast', color: '#EA4335' },
  { id: 'cycling', name: 'Ciclismo', icon: 'bike', color: '#1E88E5' },
  { id: 'swimming', name: 'Natação', icon: 'swim', color: '#27AE60' },
  { id: 'walking', name: 'Caminhada', icon: 'walk', color: '#8E44AD' },
  { id: 'elliptical', name: 'Elíptico', icon: 'rowing', color: '#F39C12' },
  { id: 'stair', name: 'Escada', icon: 'stairs', color: '#00BCD4' },
];

// Intensidades
const intensities = [
  { id: 'baixa', name: 'Baixa', color: '#27AE60' },
  { id: 'moderada', name: 'Moderada', color: '#F39C12' },
  { id: 'alta', name: 'Alta', color: '#EA4335' },
];

export default function CardioScreen() {
  const router = useRouter();

  // Estados para modais
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('running');
  const [selectedIntensity, setSelectedIntensity] = useState('moderada');
  const [selectedExercise, setSelectedExercise] = useState<CardioExercise | null>(null);

  // Estados para o formulário
  const [exerciseName, setExerciseName] = useState('');
  const [duration, setDuration] = useState('');
  const [distance, setDistance] = useState('');
  const [calories, setCalories] = useState('');
  const [heartRate, setHeartRate] = useState('');

  // Lista de exercícios de cardio salvos
  const [cardioExercises, setCardioExercises] = useState<CardioExercise[]>([
    {
      id: '1',
      name: 'Corrida na Esteira',
      duration: '30 min',
      distance: '5 km',
      calories: 300,
      category: 'running',
      intensity: 'alta',
      heartRate: '150-165 bpm',
      isFavorite: true,
      createdAt: new Date('2024-12-15'),
    },
    {
      id: '2',
      name: 'Ciclismo Indoor',
      duration: '45 min',
      calories: 400,
      category: 'cycling',
      intensity: 'moderada',
      heartRate: '130-145 bpm',
      isFavorite: true,
      createdAt: new Date('2024-12-14'),
    },
    {
      id: '3',
      name: 'Caminhada Rápida',
      duration: '60 min',
      distance: '6 km',
      calories: 280,
      category: 'walking',
      intensity: 'moderada',
      heartRate: '120-135 bpm',
      isFavorite: false,
      createdAt: new Date('2024-12-13'),
    },
    {
      id: '4',
      name: 'Natação Livre',
      duration: '40 min',
      calories: 350,
      category: 'swimming',
      intensity: 'alta',
      heartRate: '140-155 bpm',
      isFavorite: true,
      createdAt: new Date('2024-12-12'),
    },
    {
      id: '5',
      name: 'Escada Stepper',
      duration: '25 min',
      calories: 220,
      category: 'stair',
      intensity: 'alta',
      heartRate: '145-160 bpm',
      isFavorite: false,
      createdAt: new Date('2024-12-11'),
    },
    {
      id: '6',
      name: 'Elíptico',
      duration: '35 min',
      calories: 280,
      category: 'elliptical',
      intensity: 'moderada',
      heartRate: '125-140 bpm',
      isFavorite: true,
      createdAt: new Date('2024-12-10'),
    },
  ]);

  // Exercícios recentes (hoje)
  const recentExercises = cardioExercises
    .filter(exercise => exercise.createdAt.toDateString() === new Date().toDateString())
    .slice(0, 3);

  // Alternar favorito
  const toggleFavorite = (exerciseId: string) => {
    setCardioExercises(prevExercises =>
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
    setDuration('');
    setDistance('');
    setCalories('');
    setSelectedIntensity('moderada');
    setHeartRate('');
    setAddModalVisible(true);
  };

  // Abrir modal de edição
  const openEditModal = (exercise: CardioExercise) => {
    setSelectedExercise(exercise);
    setExerciseName(exercise.name);
    setDuration(exercise.duration);
    setDistance(exercise.distance || '');
    setCalories(exercise.calories.toString());
    setSelectedCategory(exercise.category);
    setSelectedIntensity(exercise.intensity);
    setHeartRate(exercise.heartRate || '');
    setEditModalVisible(true);
  };

  // Adicionar novo exercício de cardio
  const handleAddExercise = () => {
    if (!exerciseName || !duration || !calories) {
      alert('Preencha todos os campos obrigatórios!');
      return;
    }

    const newExercise: CardioExercise = {
      id: Date.now().toString(),
      name: exerciseName,
      duration: duration,
      distance: distance || undefined,
      calories: parseInt(calories),
      category: selectedCategory as any,
      intensity: selectedIntensity as 'baixa' | 'moderada' | 'alta',
      heartRate: heartRate || undefined,
      isFavorite: false,
      createdAt: new Date(),
    };

    setCardioExercises(prev => [newExercise, ...prev]);
    setAddModalVisible(false);
    resetForm();
  };

  // Atualizar exercício de cardio
  const handleUpdateExercise = () => {
    if (!selectedExercise || !exerciseName || !duration || !calories) {
      alert('Preencha todos os campos obrigatórios!');
      return;
    }

    setCardioExercises(prevExercises =>
      prevExercises.map(exercise =>
        exercise.id === selectedExercise.id
          ? {
            ...exercise,
            name: exerciseName,
            duration: duration,
            distance: distance || undefined,
            calories: parseInt(calories),
            category: selectedCategory as any,
            intensity: selectedIntensity as 'baixa' | 'moderada' | 'alta',
            heartRate: heartRate || undefined,
          }
          : exercise
      )
    );

    setEditModalVisible(false);
    resetForm();
  };

  // Excluir exercício de cardio
  const handleDeleteExercise = (exerciseId: string) => {
    setCardioExercises(prevExercises => prevExercises.filter(exercise => exercise.id !== exerciseId));
    setEditModalVisible(false);
    resetForm();
  };

  // Resetar formulário
  const resetForm = () => {
    setExerciseName('');
    setDuration('');
    setDistance('');
    setCalories('');
    setSelectedIntensity('moderada');
    setHeartRate('');
    setSelectedExercise(null);
  };

  // Renderizar item da lista de exercícios de cardio
  const renderExerciseItem = ({ item }: { item: CardioExercise }) => {
    const category = cardioCategories.find(cat => cat.id === item.category);
    const intensityObj = intensities.find(i => i.id === item.intensity);

    return (
      <TouchableOpacity
        style={styles.exerciseCard}
        onPress={() => openEditModal(item)}
        activeOpacity={0.7}
      >
        <View style={styles.exerciseHeader}>
          <View style={styles.exerciseNameContainer}>
            <Text style={styles.exerciseName}>{item.name}</Text>
            <View style={styles.exerciseCategoryContainer}>
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
              <View style={[styles.intensityBadge, { backgroundColor: `${intensityObj?.color}15` }]}>
                <Text style={[styles.intensityText, { color: intensityObj?.color }]}>
                  {intensityObj?.name}
                </Text>
              </View>
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
            <Text style={styles.detailLabel}>Duração</Text>
            <Text style={styles.detailValue}>{item.duration}</Text>
          </View>
          <View style={styles.detailDivider} />
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Calorias</Text>
            <Text style={styles.detailValue}>{item.calories}</Text>
          </View>
          <View style={styles.detailDivider} />
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Distância</Text>
            <Text style={styles.detailValue}>{item.distance || '-'}</Text>
          </View>
        </View>

        {item.heartRate && (
          <View style={styles.heartRateContainer}>
            <MaterialCommunityIcons name="heart-pulse" size={16} color="#64748B" />
            <Text style={styles.heartRateText}>{item.heartRate}</Text>
          </View>
        )}

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
                alert(`"${item.name}" adicionado ao cardio de hoje!`);
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
  const renderCategory = (category: typeof cardioCategories[0]) => (
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
          {cardioExercises.filter(e => e.category === category.id).length} exercícios
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

      {/* Cabeçalho - CORRIGIDO */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.push('/diarias')} // CORREÇÃO AQUI
          >
            <Ionicons name="arrow-back" size={24} color="#1E293B" />
          </TouchableOpacity>
          <View>
            <Text style={styles.appName}>Cardio</Text>
            <Text style={styles.headerSubtitle}>Gerencie seus exercícios cardiovasculares</Text>
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
          <Text style={styles.sectionTitle}>Tipos de Cardio</Text>
          <Text style={styles.sectionSubtitle}>
            Adicione exercícios cardiovasculares por tipo para usar depois
          </Text>

          <View style={styles.categoriesGrid}>
            {cardioCategories.map(renderCategory)}
          </View>
        </View>

        {/* Seção: Exercícios de Hoje */}
        {recentExercises.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Cardio de Hoje</Text>
              <TouchableOpacity>
                <Text style={styles.seeAllButton}>Ver todos</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.todayExercises}>
              {recentExercises.map((exercise, index) => {
                const category = cardioCategories.find(cat => cat.id === exercise.category);
                const intensityObj = intensities.find(i => i.id === exercise.intensity);
                
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
                      <View style={styles.todayExerciseInfo}>
                        <Text style={styles.todayExerciseName}>{exercise.name}</Text>
                        <View style={styles.todayExerciseMeta}>
                          <View style={[styles.todayIntensityBadge, { backgroundColor: `${intensityObj?.color}15` }]}>
                            <Text style={[styles.todayIntensityText, { color: intensityObj?.color }]}>
                              {intensityObj?.name}
                            </Text>
                          </View>
                        </View>
                      </View>
                    </View>
                    <View style={styles.todayExerciseStats}>
                      <Text style={styles.todayExerciseDuration}>{exercise.duration}</Text>
                      <View style={styles.todayExerciseDetails}>
                        <Text style={styles.todayExerciseDetail}>{exercise.calories} cal</Text>
                        {exercise.distance && (
                          <>
                            <Text style={styles.todayExerciseSeparator}>•</Text>
                            <Text style={styles.todayExerciseDetail}>{exercise.distance}</Text>
                          </>
                        )}
                      </View>
                    </View>
                  </View>
                );
              })}
            </View>
          </View>
        )}

        {/* Seção: Todos os Exercícios de Cardio */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Todos os Exercícios</Text>
            <Text style={styles.exercisesCount}>
              {cardioExercises.length} exercícios salvos
            </Text>
          </View>

          <FlatList
            data={cardioExercises}
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

      {/* Modal para Adicionar Exercício de Cardio */}
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
                  <MaterialCommunityIcons name="run-fast" size={28} color="#EA4335" />
                  <Text style={styles.modalTitle}>Novo Exercício</Text>
                </View>

                {/* Categorias */}
                <View style={styles.modalSection}>
                  <Text style={styles.modalSectionTitle}>Tipo de Cardio</Text>
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

                {/* Intensidade */}
                <View style={styles.modalSection}>
                  <Text style={styles.modalSectionTitle}>Intensidade</Text>
                  <View style={styles.intensityButtons}>
                    {intensities.map(intensity => (
                      <TouchableOpacity
                        key={intensity.id}
                        style={[
                          styles.intensityButton,
                          selectedIntensity === intensity.id && styles.intensityButtonSelected,
                          { borderColor: intensity.color }
                        ]}
                        onPress={() => setSelectedIntensity(intensity.id)}
                      >
                        <Text style={[
                          styles.intensityButtonText,
                          selectedIntensity === intensity.id && styles.intensityButtonTextSelected,
                          { color: selectedIntensity === intensity.id ? '#FFFFFF' : intensity.color }
                        ]}>
                          {intensity.name}
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
                    placeholder="Ex: Corrida na Esteira"
                    placeholderTextColor="#94A3B8"
                  />
                </View>

                <View style={styles.cardioGrid}>
                  <View style={styles.cardioInput}>
                    <Text style={styles.inputLabel}>Duração</Text>
                    <TextInput
                      style={styles.input}
                      value={duration}
                      onChangeText={setDuration}
                      placeholder="Ex: 30 min"
                      placeholderTextColor="#94A3B8"
                    />
                  </View>

                  <View style={styles.cardioInput}>
                    <Text style={styles.inputLabel}>Distância (opcional)</Text>
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
                    <Text style={styles.inputLabel}>Calorias Queimadas</Text>
                    <TextInput
                      style={styles.input}
                      value={calories}
                      onChangeText={setCalories}
                      keyboardType="number-pad"
                      placeholder="Ex: 300"
                      placeholderTextColor="#94A3B8"
                    />
                  </View>

                  <View style={styles.cardioInput}>
                    <Text style={styles.inputLabel}>Frequência Cardíaca (opcional)</Text>
                    <TextInput
                      style={styles.input}
                      value={heartRate}
                      onChangeText={setHeartRate}
                      placeholder="Ex: 140-160 bpm"
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

      {/* Modal para Editar Exercício de Cardio */}
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
                  <MaterialCommunityIcons name="run-fast" size={28} color="#1E88E5" />
                  <Text style={styles.modalTitle}>Editar Exercício</Text>
                </View>

                {/* Categorias */}
                <View style={styles.modalSection}>
                  <Text style={styles.modalSectionTitle}>Tipo de Cardio</Text>
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

                {/* Intensidade */}
                <View style={styles.modalSection}>
                  <Text style={styles.modalSectionTitle}>Intensidade</Text>
                  <View style={styles.intensityButtons}>
                    {intensities.map(intensity => (
                      <TouchableOpacity
                        key={intensity.id}
                        style={[
                          styles.intensityButton,
                          selectedIntensity === intensity.id && styles.intensityButtonSelected,
                          { borderColor: intensity.color }
                        ]}
                        onPress={() => setSelectedIntensity(intensity.id)}
                      >
                        <Text style={[
                          styles.intensityButtonText,
                          selectedIntensity === intensity.id && styles.intensityButtonTextSelected,
                          { color: selectedIntensity === intensity.id ? '#FFFFFF' : intensity.color }
                        ]}>
                          {intensity.name}
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
                    placeholder="Ex: Corrida na Esteira"
                    placeholderTextColor="#94A3B8"
                  />
                </View>

                <View style={styles.cardioGrid}>
                  <View style={styles.cardioInput}>
                    <Text style={styles.inputLabel}>Duração</Text>
                    <TextInput
                      style={styles.input}
                      value={duration}
                      onChangeText={setDuration}
                      placeholder="Ex: 30 min"
                      placeholderTextColor="#94A3B8"
                    />
                  </View>

                  <View style={styles.cardioInput}>
                    <Text style={styles.inputLabel}>Distância (opcional)</Text>
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
                    <Text style={styles.inputLabel}>Calorias Queimadas</Text>
                    <TextInput
                      style={styles.input}
                      value={calories}
                      onChangeText={setCalories}
                      keyboardType="number-pad"
                      placeholder="Ex: 300"
                      placeholderTextColor="#94A3B8"
                    />
                  </View>

                  <View style={styles.cardioInput}>
                    <Text style={styles.inputLabel}>Frequência Cardíaca (opcional)</Text>
                    <TextInput
                      style={styles.input}
                      value={heartRate}
                      onChangeText={setHeartRate}
                      placeholder="Ex: 140-160 bpm"
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
    flex: 1,
  },
  todayExerciseIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  todayExerciseInfo: {
    flex: 1,
  },
  todayExerciseName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 4,
  },
  todayExerciseMeta: {
    flexDirection: 'row',
    gap: 8,
  },
  todayIntensityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  todayIntensityText: {
    fontSize: 10,
    fontWeight: '600',
  },
  todayExerciseStats: {
    alignItems: 'flex-end',
  },
  todayExerciseDuration: {
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
  todayExerciseSeparator: {
    fontSize: 11,
    color: '#CBD5E1',
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
  exerciseCategoryContainer: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
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
  intensityBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  intensityText: {
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
  heartRateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 12,
    paddingHorizontal: 8,
    paddingVertical: 6,
    backgroundColor: '#F8FAFC',
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  heartRateText: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '500',
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
  intensityButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  intensityButton: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1.5,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
  },
  intensityButtonSelected: {
    backgroundColor: '#EA4335',
    borderColor: '#EA4335',
  },
  intensityButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  intensityButtonTextSelected: {
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
  cardioGrid: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  cardioInput: {
    flex: 1,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    marginTop: 8,
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