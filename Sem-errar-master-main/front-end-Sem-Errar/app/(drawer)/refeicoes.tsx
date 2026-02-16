// app/(drawer)/refeicoes.tsx
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

// Interface para refeições
interface Meal {
  id: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  category: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  isFavorite: boolean;
  createdAt: Date;
}

// Categorias de refeições
const mealCategories = [
  { id: 'breakfast', name: 'Café da Manhã', icon: 'coffee', color: '#27AE60' },
  { id: 'lunch', name: 'Almoço', icon: 'food', color: '#1E88E5' },
  { id: 'dinner', name: 'Jantar', icon: 'food-fork-drink', color: '#8E44AD' },
  { id: 'snack', name: 'Lanche', icon: 'cookie', color: '#F39C12' },
];

export default function RefeicoesScreen() {
  const router = useRouter();

  // Estados para modais
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('breakfast');
  const [selectedMeal, setSelectedMeal] = useState<Meal | null>(null);

  // Estados para o formulário
  const [mealName, setMealName] = useState('');
  const [calories, setCalories] = useState('');
  const [protein, setProtein] = useState('');
  const [carbs, setCarbs] = useState('');
  const [fat, setFat] = useState('');

  // Lista de refeições salvas
  const [meals, setMeals] = useState<Meal[]>([
    {
      id: '1',
      name: 'Salmão Grelhado',
      calories: 550,
      protein: 36,
      carbs: 40,
      fat: 28,
      category: 'lunch',
      isFavorite: true,
      createdAt: new Date('2024-12-14'),
    },
    {
      id: '2',
      name: 'Panquecas Proteicas',
      calories: 320,
      protein: 25,
      carbs: 35,
      fat: 8,
      category: 'breakfast',
      isFavorite: false,
      createdAt: new Date('2024-12-15'),
    },
    {
      id: '3',
      name: 'Arroz com Frango',
      calories: 450,
      protein: 35,
      carbs: 50,
      fat: 12,
      category: 'lunch',
      isFavorite: true,
      createdAt: new Date('2024-12-13'),
    },
    {
      id: '4',
      name: 'Omelete de Queijo',
      calories: 280,
      protein: 22,
      carbs: 8,
      fat: 18,
      category: 'breakfast',
      isFavorite: false,
      createdAt: new Date('2024-12-12'),
    },
    {
      id: '5',
      name: 'Sopa de Legumes',
      calories: 180,
      protein: 8,
      carbs: 25,
      fat: 5,
      category: 'dinner',
      isFavorite: true,
      createdAt: new Date('2024-12-11'),
    },
    {
      id: '6',
      name: 'Iogurte com Granola',
      calories: 220,
      protein: 12,
      carbs: 30,
      fat: 7,
      category: 'snack',
      isFavorite: false,
      createdAt: new Date('2024-12-10'),
    },
  ]);

  // Refazerções recentes (hoje)
  const recentMeals = meals
    .filter(meal => meal.createdAt.toDateString() === new Date().toDateString())
    .slice(0, 3);

  // Alternar favorito
  const toggleFavorite = (mealId: string) => {
    setMeals(prevMeals =>
      prevMeals.map(meal =>
        meal.id === mealId ? { ...meal, isFavorite: !meal.isFavorite } : meal
      )
    );
  };

  // Abrir modal de adição
  const openAddModal = (category?: string) => {
    if (category) {
      setSelectedCategory(category);
    }
    setMealName('');
    setCalories('');
    setProtein('');
    setCarbs('');
    setFat('');
    setAddModalVisible(true);
  };

  // Abrir modal de edição
  const openEditModal = (meal: Meal) => {
    setSelectedMeal(meal);
    setMealName(meal.name);
    setCalories(meal.calories.toString());
    setProtein(meal.protein.toString());
    setCarbs(meal.carbs.toString());
    setFat(meal.fat.toString());
    setSelectedCategory(meal.category);
    setEditModalVisible(true);
  };

  // Adicionar nova refeição
  const handleAddMeal = () => {
    if (!mealName || !calories || !protein || !carbs || !fat) {
      alert('Preencha todos os campos!');
      return;
    }

    const newMeal: Meal = {
      id: Date.now().toString(),
      name: mealName,
      calories: parseInt(calories),
      protein: parseInt(protein),
      carbs: parseInt(carbs),
      fat: parseInt(fat),
      category: selectedCategory as any,
      isFavorite: false,
      createdAt: new Date(),
    };

    setMeals(prev => [newMeal, ...prev]);
    setAddModalVisible(false);
    resetForm();
  };

  // Atualizar refeição
  const handleUpdateMeal = () => {
    if (!selectedMeal || !mealName || !calories || !protein || !carbs || !fat) {
      alert('Preencha todos os campos!');
      return;
    }

    setMeals(prevMeals =>
      prevMeals.map(meal =>
        meal.id === selectedMeal.id
          ? {
            ...meal,
            name: mealName,
            calories: parseInt(calories),
            protein: parseInt(protein),
            carbs: parseInt(carbs),
            fat: parseInt(fat),
            category: selectedCategory as any,
          }
          : meal
      )
    );

    setEditModalVisible(false);
    resetForm();
  };

  // Excluir refeição
  const handleDeleteMeal = (mealId: string) => {
    setMeals(prevMeals => prevMeals.filter(meal => meal.id !== mealId));
    setEditModalVisible(false);
    resetForm();
  };

  // Resetar formulário
  const resetForm = () => {
    setMealName('');
    setCalories('');
    setProtein('');
    setCarbs('');
    setFat('');
    setSelectedMeal(null);
  };

  // Renderizar item da lista de refeições
  const renderMealItem = ({ item }: { item: Meal }) => {
    const category = mealCategories.find(cat => cat.id === item.category);

    return (
      <TouchableOpacity
        style={styles.mealCard}
        onPress={() => openEditModal(item)}
        activeOpacity={0.7}
      >
        <View style={styles.mealHeader}>
          <View style={styles.mealNameContainer}>
            <Text style={styles.mealName}>{item.name}</Text>
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

        <View style={styles.mealCalories}>
          <Text style={styles.mealCaloriesValue}>{item.calories}</Text>
          <Text style={styles.mealCaloriesLabel}>Calorias</Text>
        </View>

        <View style={styles.mealMacros}>
          <View style={styles.macroItem}>
            <Text style={styles.macroItemValue}>{item.protein}g</Text>
            <Text style={styles.macroItemLabel}>Proteína</Text>
          </View>
          <View style={styles.macroDivider} />
          <View style={styles.macroItem}>
            <Text style={styles.macroItemValue}>{item.carbs}g</Text>
            <Text style={styles.macroItemLabel}>Carbs</Text>
          </View>
          <View style={styles.macroDivider} />
          <View style={styles.macroItem}>
            <Text style={styles.macroItemValue}>{item.fat}g</Text>
            <Text style={styles.macroItemLabel}>Gordura</Text>
          </View>
        </View>

        <View style={styles.mealFooter}>
          <Text style={styles.mealDate}>
            {item.createdAt.toLocaleDateString('pt-BR', {
              day: '2-digit',
              month: '2-digit',
              year: 'numeric'
            })}
          </Text>
          <View style={styles.mealActions}>
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
                // Adicionar à refeição de hoje
                alert(`"${item.name}" adicionado às refeições de hoje!`);
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
  const renderCategory = (category: typeof mealCategories[0]) => (
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
          {meals.filter(m => m.category === category.id).length} refeições
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
            onPress={() => router.replace('/diarias')} // MODIFICAÇÃO AQUI: volta para diária
          >
            <Ionicons name="arrow-back" size={24} color="#1E293B" />
          </TouchableOpacity>
          <View>
            <Text style={styles.appName}>Refeições</Text>
            <Text style={styles.headerSubtitle}>Gerencie suas refeições salvas</Text>
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
            Adicione refeições por categoria para usar depois
          </Text>

          <View style={styles.categoriesGrid}>
            {mealCategories.map(renderCategory)}
          </View>
        </View>

        {/* Seção: Refeições de Hoje */}
        {recentMeals.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Refeições de Hoje</Text>
              <TouchableOpacity>
                <Text style={styles.seeAllButton}>Ver todas</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.todayMeals}>
              {recentMeals.map((meal, index) => {
                const category = mealCategories.find(cat => cat.id === meal.category);
                return (
                  <View 
                    key={meal.id} 
                    style={[
                      styles.todayMealCard,
                      index === recentMeals.length - 1 && styles.todayMealCardLast
                    ]}
                  >
                    <View style={styles.todayMealHeader}>
                      <View style={[styles.todayMealIcon, { backgroundColor: `${category?.color}15` }]}>
                        <MaterialCommunityIcons
                          name={category?.icon as any}
                          size={18}
                          color={category?.color}
                        />
                      </View>
                      <Text style={styles.todayMealName}>{meal.name}</Text>
                    </View>
                    <View style={styles.todayMealInfo}>
                      <Text style={styles.todayMealCalories}>{meal.calories} cal</Text>
                      <View style={styles.todayMealMacros}>
                        <Text style={styles.todayMealMacro}>P: {meal.protein}g</Text>
                        <Text style={styles.todayMealMacro}>C: {meal.carbs}g</Text>
                        <Text style={styles.todayMealMacro}>G: {meal.fat}g</Text>
                      </View>
                    </View>
                  </View>
                );
              })}
            </View>
          </View>
        )}

        {/* Seção: Todas as Refeições */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Todas as Refeições</Text>
            <Text style={styles.mealsCount}>
              {meals.length} refeições salvas
            </Text>
          </View>

          <FlatList
            data={meals}
            renderItem={renderMealItem}
            keyExtractor={item => item.id}
            scrollEnabled={false}
            contentContainerStyle={styles.mealsList}
            ItemSeparatorComponent={() => <View style={styles.mealSeparator} />}
          />
        </View>

        {/* Espaço final */}
        <View style={styles.bottomSpacer} />
      </ScrollView>

      {/* Modal para Adicionar Refeição */}
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
                  <MaterialCommunityIcons name="food" size={28} color="#27AE60" />
                  <Text style={styles.modalTitle}>Nova Refeição</Text>
                </View>

                {/* Categorias */}
                <View style={styles.modalSection}>
                  <Text style={styles.modalSectionTitle}>Categoria</Text>
                  <View style={styles.categoryButtons}>
                    {mealCategories.map(category => (
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
                  <Text style={styles.inputLabel}>Nome da Refeição</Text>
                  <TextInput
                    style={styles.input}
                    value={mealName}
                    onChangeText={setMealName}
                    placeholder="Ex: Salmão Grelhado"
                    placeholderTextColor="#94A3B8"
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Calorias</Text>
                  <TextInput
                    style={styles.input}
                    value={calories}
                    onChangeText={setCalories}
                    keyboardType="number-pad"
                    placeholder="Ex: 550"
                    placeholderTextColor="#94A3B8"
                  />
                </View>

                <View style={styles.macrosGrid}>
                  <View style={styles.macroInput}>
                    <Text style={styles.inputLabel}>Proteína (g)</Text>
                    <TextInput
                      style={styles.input}
                      value={protein}
                      onChangeText={setProtein}
                      keyboardType="number-pad"
                      placeholder="Ex: 36"
                      placeholderTextColor="#94A3B8"
                    />
                  </View>

                  <View style={styles.macroInput}>
                    <Text style={styles.inputLabel}>Carbs (g)</Text>
                    <TextInput
                      style={styles.input}
                      value={carbs}
                      onChangeText={setCarbs}
                      keyboardType="number-pad"
                      placeholder="Ex: 40"
                      placeholderTextColor="#94A3B8"
                    />
                  </View>

                  <View style={styles.macroInput}>
                    <Text style={styles.inputLabel}>Gordura (g)</Text>
                    <TextInput
                      style={styles.input}
                      value={fat}
                      onChangeText={setFat}
                      keyboardType="number-pad"
                      placeholder="Ex: 28"
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
                    onPress={handleAddMeal}
                  >
                    <Text style={styles.saveButtonText}>Salvar</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      {/* Modal para Editar Refeição */}
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
                  <MaterialCommunityIcons name="food" size={28} color="#1E88E5" />
                  <Text style={styles.modalTitle}>Editar Refeição</Text>
                </View>

                {/* Categorias */}
                <View style={styles.modalSection}>
                  <Text style={styles.modalSectionTitle}>Categoria</Text>
                  <View style={styles.categoryButtons}>
                    {mealCategories.map(category => (
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
                  <Text style={styles.inputLabel}>Nome da Refeição</Text>
                  <TextInput
                    style={styles.input}
                    value={mealName}
                    onChangeText={setMealName}
                    placeholder="Ex: Salmão Grelhado"
                    placeholderTextColor="#94A3B8"
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Calorias</Text>
                  <TextInput
                    style={styles.input}
                    value={calories}
                    onChangeText={setCalories}
                    keyboardType="number-pad"
                    placeholder="Ex: 550"
                    placeholderTextColor="#94A3B8"
                  />
                </View>

                <View style={styles.macrosGrid}>
                  <View style={styles.macroInput}>
                    <Text style={styles.inputLabel}>Proteína (g)</Text>
                    <TextInput
                      style={styles.input}
                      value={protein}
                      onChangeText={setProtein}
                      keyboardType="number-pad"
                      placeholder="Ex: 36"
                      placeholderTextColor="#94A3B8"
                    />
                  </View>

                  <View style={styles.macroInput}>
                    <Text style={styles.inputLabel}>Carbs (g)</Text>
                    <TextInput
                      style={styles.input}
                      value={carbs}
                      onChangeText={setCarbs}
                      keyboardType="number-pad"
                      placeholder="Ex: 40"
                      placeholderTextColor="#94A3B8"
                    />
                  </View>

                  <View style={styles.macroInput}>
                    <Text style={styles.inputLabel}>Gordura (g)</Text>
                    <TextInput
                      style={styles.input}
                      value={fat}
                      onChangeText={setFat}
                      keyboardType="number-pad"
                      placeholder="Ex: 28"
                      placeholderTextColor="#94A3B8"
                    />
                  </View>
                </View>

                <View style={styles.modalButtons}>
                  <TouchableOpacity
                    style={[styles.modalButton, styles.deleteButton]}
                    onPress={() => {
                      if (selectedMeal) {
                        handleDeleteMeal(selectedMeal.id);
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
                      onPress={handleUpdateMeal}
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
  mealsCount: {
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

  // Refeições de Hoje
  todayMeals: {
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  todayMealCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  todayMealCardLast: {
    borderBottomWidth: 0,
  },
  todayMealHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  todayMealIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  todayMealName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1E293B',
  },
  todayMealInfo: {
    alignItems: 'flex-end',
  },
  todayMealCalories: {
    fontSize: 14,
    fontWeight: '700',
    color: '#F39C12',
    marginBottom: 4,
  },
  todayMealMacros: {
    flexDirection: 'row',
    gap: 8,
  },
  todayMealMacro: {
    fontSize: 11,
    color: '#64748B',
  },

  // Lista de Refeições
  mealsList: {
    paddingBottom: 8,
  },
  mealCard: {
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
  mealHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  mealNameContainer: {
    flex: 1,
  },
  mealName: {
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
  mealCalories: {
    alignItems: 'center',
    marginBottom: 12,
  },
  mealCaloriesValue: {
    fontSize: 28,
    fontWeight: '700',
    color: '#F39C12',
  },
  mealCaloriesLabel: {
    fontSize: 12,
    color: '#64748B',
  },
  mealMacros: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    paddingTop: 12,
    marginBottom: 12,
  },
  macroItem: {
    alignItems: 'center',
  },
  macroItemValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1E293B',
  },
  macroItemLabel: {
    fontSize: 12,
    color: '#64748B',
  },
  macroDivider: {
    width: 1,
    height: 24,
    backgroundColor: '#E2E8F0',
  },
  mealFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    paddingTop: 12,
  },
  mealDate: {
    fontSize: 12,
    color: '#64748B',
  },
  mealActions: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    padding: 6,
  },
  mealSeparator: {
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
    backgroundColor: '#27AE60',
    borderColor: '#27AE60',
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
  macrosGrid: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  macroInput: {
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