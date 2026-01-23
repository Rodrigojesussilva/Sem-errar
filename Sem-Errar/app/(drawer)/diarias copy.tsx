// app/(drawer)/diaria.tsx
import {
  Feather,
  FontAwesome5,
  Ionicons,
  MaterialCommunityIcons,
  MaterialIcons,
} from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
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

// Definindo interfaces para tipagem
interface Measurement {
  type: string;
  value: string;
  unit: string;
  target: string;
  change: string;
}

interface Task {
  id: string;
  title: string;
  time: string;
  duration: string;
  completed: boolean;
  icon: string;
  type: string;
  color: string;
  description: string;
  measurement?: Measurement;
}

export default function DiariaScreen() {
  const [selectedDay, setSelectedDay] = useState(15);
  const [currentTime, setCurrentTime] = useState('12:30');
  
  // Estados para os modais
  const [weightModalVisible, setWeightModalVisible] = useState(false);
  const [waistModalVisible, setWaistModalVisible] = useState(false);
  
  // Estados para os valores editáveis
  const [editingWeight, setEditingWeight] = useState('102.8');
  const [editingWaist, setEditingWaist] = useState('109');
  const [weightTarget, setWeightTarget] = useState('95.0');
  const [waistTarget, setWaistTarget] = useState('95');

  // Dados das tarefas diárias com tipagem correta
  const [dailyTasks, setDailyTasks] = useState<Task[]>([
    {
      id: '1',
      title: 'Medir Cintura',
      time: '12:00',
      duration: '5 min',
      completed: false,
      icon: 'tape-measure',
      type: 'measurement',
      color: '#FBBC04',
      description: `Cintura atual: ${editingWaist} cm`,
      measurement: {
        type: 'waist',
        value: editingWaist,
        unit: 'cm',
        target: waistTarget,
        change: '-3'
      }
    },
    {
      id: '2',
      title: 'Medir Peso',
      time: '08:00',
      duration: '5 min',
      completed: false,
      icon: 'scale-bathroom',
      type: 'measurement',
      color: '#EA4335',
      description: `Peso atual: ${editingWeight} kg`,
      measurement: {
        type: 'weight',
        value: editingWeight,
        unit: 'kg',
        target: weightTarget,
        change: '-2.2'
      }
    },
    {
      id: '1',
      title: 'Treino de Força',
      time: '07:30',
      duration: '60 min',
      completed: true,
      icon: 'dumbbell',
      type: 'workout',
      color: '#8E44AD',
      description: 'Treino A - Peito e Tríceps'
    },
    {
      id: '2',
      title: 'Medir Peso',
      time: '08:00',
      duration: '5 min',
      completed: false,
      icon: 'scale-bathroom',
      type: 'measurement',
      color: '#EA4335',
      description: `Peso atual: ${editingWeight} kg`,
      measurement: {
        type: 'weight',
        value: editingWeight,
        unit: 'kg',
        target: weightTarget,
        change: '-2.2'
      }
    },
    {
      id: '3',
      title: 'Café da Manhã',
      time: '08:30',
      duration: '20 min',
      completed: true,
      icon: 'coffee',
      type: 'nutrition',
      color: '#27AE60',
      description: 'Ovos, aveia e frutas'
    },
    {
      id: '4',
      title: 'Reunião de Trabalho',
      time: '10:00',
      duration: '90 min',
      completed: false,
      icon: 'briefcase',
      type: 'work',
      color: '#1E88E5',
      description: 'Planejamento semanal'
    },    
    {
      id: '6',
      title: 'Almoço',
      time: '12:30',
      duration: '30 min',
      completed: false,
      icon: 'food',
      type: 'nutrition',
      color: '#27AE60',
      description: 'Arroz integral, frango e salada'
    },
    {
      id: '7',
      title: 'Treino Cardio',
      time: '16:00',
      duration: '45 min',
      completed: false,
      icon: 'running',
      type: 'workout',
      color: '#8E44AD',
      description: 'Esteira ou corrida ao ar livre'
    },
    {
      id: '8',
      title: 'Jantar',
      time: '19:30',
      duration: '30 min',
      completed: false,
      icon: 'food-fork-drink',
      type: 'nutrition',
      color: '#27AE60',
      description: 'Salmão grelhado e vegetais'
    },
    {
      id: '9',
      title: 'Meditação',
      time: '21:00',
      duration: '15 min',
      completed: false,
      icon: 'meditation',
      type: 'wellness',
      color: '#F39C12',
      description: 'Mindfulness e respiração'
    },
  ]);

  // Dados de medições resumo
  interface MeasurementSummary {
    current: string;
    unit: string;
    target: string;
    change: string;
    progress: number;
  }

  const [measurementsSummary, setMeasurementsSummary] = useState<{
    weight: MeasurementSummary;
    waist: MeasurementSummary;
  }>({
    weight: {
      current: editingWeight,
      unit: 'kg',
      target: weightTarget,
      change: '-2.2',
      progress: 65
    },
    waist: {
      current: editingWaist,
      unit: 'cm',
      target: waistTarget,
      change: '-3',
      progress: 45
    }
  });

  // Dados dos dias da semana
  const weekDays = [
    { day: 'Dom', date: 10 },
    { day: 'Seg', date: 11 },
    { day: 'Ter', date: 12 },
    { day: 'Qua', date: 13 },
    { day: 'Qui', date: 14 },
    { day: 'Sex', date: 15, today: true },
    { day: 'Sáb', date: 16 },
  ];

  // Macros nutricionais
  const nutritionData = {
    calories: { current: 1250, target: 2000 },
    protein: { current: 75, target: 150 },
    carbs: { current: 138, target: 275 },
    fat: { current: 35, target: 70 }
  };

  // Refeições recentes
  const recentMeals = [
    {
      id: '1',
      name: 'Salmão Grelhado',
      calories: 550,
      protein: 36,
      carbs: 40,
      fat: 28,
      time: 'Almoço'
    },
    {
      id: '2',
      name: 'Panquecas Proteicas',
      calories: 320,
      protein: 25,
      carbs: 35,
      fat: 8,
      time: 'Café da Manhã'
    }
  ];

  // Alternar estado de completude da tarefa
  const toggleTaskCompletion = (taskId: string) => {
    setDailyTasks(prevTasks =>
      prevTasks.map(task =>
        task.id === taskId ? { ...task, completed: !task.completed } : task
      )
    );
  };

  // Calcular progresso do dia
  const calculateDayProgress = () => {
    const completedTasks = dailyTasks.filter(task => task.completed).length;
    return (completedTasks / dailyTasks.length) * 100;
  };

  // Atualizar tarefas com novos valores - CORRIGIDO
  const updateTasksWithMeasurements = () => {
    setDailyTasks(prevTasks =>
      prevTasks.map(task => {
        if (task.id === '2' && task.measurement) { // Medir Peso
          return {
            ...task,
            description: `Peso atual: ${editingWeight} kg`,
            measurement: {
              ...task.measurement,
              value: editingWeight,
              target: weightTarget
            }
          };
        }
        if (task.id === '5' && task.measurement) { // Medir Cintura
          return {
            ...task,
            description: `Cintura atual: ${editingWaist} cm`,
            measurement: {
              ...task.measurement,
              value: editingWaist,
              target: waistTarget
            }
          };
        }
        return task;
      })
    );
  };

  // Salvar peso
  const handleSaveWeight = () => {
    const current = parseFloat(editingWeight);
    const target = parseFloat(weightTarget);
    
    // Calcular progresso (simplificado)
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
    
    updateTasksWithMeasurements();
    setWeightModalVisible(false);
  };

  // Salvar cintura
  const handleSaveWaist = () => {
    const current = parseInt(editingWaist);
    const target = parseInt(waistTarget);
    
    // Calcular progresso (simplificado)
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
    
    updateTasksWithMeasurements();
    setWaistModalVisible(false);
  };

  // Renderizar item da lista de tarefas
  const renderTaskItem = ({ item }: { item: Task }) => (
    <TouchableOpacity 
      style={[
        styles.taskCard,
        item.completed && styles.taskCardCompleted
      ]}
      onPress={() => {
        if (item.type === 'measurement' && item.measurement) {
          if (item.measurement.type === 'weight') {
            setWeightModalVisible(true);
          } else {
            setWaistModalVisible(true);
          }
        } else {
          toggleTaskCompletion(item.id);
        }
      }}
      activeOpacity={0.7}
    >
      <View style={styles.taskLeftContainer}>
        <View style={[styles.taskIconContainer, { backgroundColor: `${item.color}15` }]}>
          {item.icon === 'dumbbell' && (
            <FontAwesome5 name="dumbbell" size={20} color={item.color} />
          )}
          {item.icon === 'scale-bathroom' && (
            <MaterialCommunityIcons name="scale-bathroom" size={20} color={item.color} />
          )}
          {item.icon === 'coffee' && (
            <MaterialCommunityIcons name="coffee" size={20} color={item.color} />
          )}
          {item.icon === 'briefcase' && (
            <MaterialCommunityIcons name="briefcase" size={20} color={item.color} />
          )}
          {item.icon === 'tape-measure' && (
            <MaterialCommunityIcons name="tape-measure" size={20} color={item.color} />
          )}
          {item.icon === 'food' && (
            <MaterialCommunityIcons name="food" size={20} color={item.color} />
          )}
          {item.icon === 'running' && (
            <FontAwesome5 name="running" size={20} color={item.color} />
          )}
          {item.icon === 'food-fork-drink' && (
            <MaterialCommunityIcons name="food-fork-drink" size={20} color={item.color} />
          )}
          {item.icon === 'meditation' && (
            <MaterialCommunityIcons name="meditation" size={20} color={item.color} />
          )}
        </View>
        
        <View style={styles.taskInfo}>
          <Text style={[
            styles.taskTitle,
            item.completed && styles.taskTitleCompleted
          ]}>
            {item.title}
          </Text>
          <Text style={styles.taskDescription}>{item.description}</Text>
          
          {/* Mostrar progresso da medição se for uma tarefa de medida */}
          {item.measurement && (
            <View style={styles.measurementProgress}>
              <View style={styles.measurementValues}>
                <Text style={styles.measurementCurrent}>
                  {item.measurement.value} {item.measurement.unit}
                </Text>
                <Text style={styles.measurementTarget}>
                  Meta: {item.measurement.target} {item.measurement.unit}
                </Text>
              </View>
              <View style={styles.measurementChange}>
                <Text style={[
                  styles.changeText,
                  item.measurement.change.startsWith('-') ? styles.changeNegative : styles.changePositive
                ]}>
                  {item.measurement.change} {item.measurement.unit}
                </Text>
              </View>
            </View>
          )}
          
          <View style={styles.taskMeta}>
            <View style={styles.taskTime}>
              <MaterialIcons name="access-time" size={14} color="#64748B" />
              <Text style={styles.taskMetaText}>{item.time}</Text>
              <Text style={styles.taskMetaText}> • {item.duration}</Text>
            </View>
            <View style={[
              styles.taskTypeBadge,
              { backgroundColor: `${item.color}15` }
            ]}>
              <Text style={[styles.taskTypeText, { color: item.color }]}>
                {item.type === 'workout' ? 'Treino' : 
                 item.type === 'nutrition' ? 'Nutrição' : 
                 item.type === 'work' ? 'Trabalho' : 
                 item.type === 'measurement' ? 'Medição' : 'Bem-estar'}
              </Text>
            </View>
          </View>
        </View>
      </View>

      {item.type === 'measurement' ? (
        <TouchableOpacity 
          style={styles.editButton}
          onPress={() => {
            if (item.measurement?.type === 'weight') {
              setWeightModalVisible(true);
            } else if (item.measurement?.type === 'waist') {
              setWaistModalVisible(true);
            }
          }}
        >
          <MaterialIcons name="edit" size={20} color="#1E88E5" />
        </TouchableOpacity>
      ) : (
        <TouchableOpacity 
          style={[
            styles.completionCircle,
            item.completed && styles.completionCircleCompleted
          ]}
          onPress={() => toggleTaskCompletion(item.id)}
        >
          {item.completed && (
            <Ionicons name="checkmark" size={20} color="#FFFFFF" />
          )}
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );

  // Renderizar barra de progresso de macros
  const renderMacroBar = (label: string, current: number, target: number, color: string) => {
    const percentage = Math.min((current / target) * 100, 100);
    
    return (
      <View style={styles.macroContainer}>
        <View style={styles.macroHeader}>
          <Text style={styles.macroLabel}>{label}</Text>
          <Text style={styles.macroValue}>{current}/{target}g</Text>
        </View>
        <View style={styles.progressBarContainer}>
          <View style={styles.progressBarBackground}>
            <View 
              style={[
                styles.progressBarFill, 
                { width: `${percentage}%`, backgroundColor: color }
              ]} 
            />
          </View>
          <Text style={styles.macroPercentage}>{Math.round(percentage)}%</Text>
        </View>
      </View>
    );
  };

  // Renderizar card de medição
  const renderMeasurementCard = (type: 'weight' | 'waist', data: MeasurementSummary) => {
    const icon = type === 'weight' ? 'scale-bathroom' : 'tape-measure';
    const label = type === 'weight' ? 'Peso' : 'Cintura';
    const color = type === 'weight' ? '#EA4335' : '#FBBC04';
    
    return (
      <TouchableOpacity 
        style={styles.measurementCard}
        onPress={() => {
          if (type === 'weight') {
            setWeightModalVisible(true);
          } else {
            setWaistModalVisible(true);
          }
        }}
        activeOpacity={0.7}
      >
        <View style={styles.measurementHeader}>
          <View style={[styles.measurementIcon, { backgroundColor: `${color}15` }]}>
            <MaterialCommunityIcons name={icon} size={24} color={color} />
          </View>
          <View style={styles.measurementTitleContainer}>
            <Text style={styles.measurementTitle}>{label}</Text>
            <Text style={styles.measurementSubtitle}>Medição Diária</Text>
          </View>
          <TouchableOpacity 
            style={styles.cardEditButton}
            onPress={() => {
              if (type === 'weight') {
                setWeightModalVisible(true);
              } else {
                setWaistModalVisible(true);
              }
            }}
          >
            <MaterialIcons name="edit" size={18} color={color} />
          </TouchableOpacity>
        </View>
        
        <View style={styles.measurementValuesCard}>
          <View style={styles.currentMeasurement}>
            <Text style={styles.currentValue}>{data.current}</Text>
            <Text style={styles.currentUnit}>{data.unit}</Text>
          </View>
          
          <View style={styles.measurementProgressCard}>
            <Text style={styles.progressLabel}>Progresso</Text>
            <View style={styles.progressBarSmall}>
              <View 
                style={[
                  styles.progressBarFillSmall, 
                  { width: `${data.progress}%`, backgroundColor: color }
                ]} 
              />
            </View>
            <View style={styles.targetContainer}>
              <Text style={styles.targetLabel}>Meta: {data.target} {data.unit}</Text>
              <Text style={[
                styles.changeTextCard,
                data.change.startsWith('-') ? styles.changeNegative : styles.changePositive
              ]}>
                {data.change} {data.unit}
              </Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#FFFFFF" barStyle="dark-content" />
      
      {/* Cabeçalho */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.logoContainer}>
            <LinearGradient
              colors={['#1E88E5', '#8E44AD']}
              style={styles.logoGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Text style={styles.logoText}>D</Text>
            </LinearGradient>
          </View>
          <View>
            <Text style={styles.appName}>Diária</Text>
            <Text style={styles.headerSubtitle}>Seu dia, sem errar!</Text>
          </View>
        </View>
        
        <View style={styles.timeContainer}>
          <Text style={styles.currentTime}>{currentTime}</Text>
          <Text style={styles.dateText}>Sex, 15 Dez</Text>
        </View>
      </View>

      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Seção: Progresso do Dia */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Progresso do Dia</Text>
            <Text style={styles.progressPercentage}>
              {Math.round(calculateDayProgress())}%
            </Text>
          </View>
          
          <View style={styles.dayProgressContainer}>
            <View style={styles.dayProgressBar}>
              <View 
                style={[
                  styles.dayProgressFill, 
                  { width: `${calculateDayProgress()}%` }
                ]} 
              />
            </View>
            <Text style={styles.progressText}>
              {dailyTasks.filter(t => t.completed).length} de {dailyTasks.length} tarefas completadas
            </Text>
          </View>
        </View>

        {/* Seção: Medições Diárias */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Medições Diárias</Text>
          
          <View style={styles.measurementsGrid}>
            {renderMeasurementCard('weight', measurementsSummary.weight)}
            {renderMeasurementCard('waist', measurementsSummary.waist)}
          </View>
        </View>

        {/* Seção: Calendário Semanal */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Esta Semana</Text>
          
          <View style={styles.weekCalendar}>
            {weekDays.map((day, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.dayCard,
                  selectedDay === day.date && styles.dayCardSelected,
                  day.today && styles.dayCardToday
                ]}
                onPress={() => setSelectedDay(day.date)}
              >
                <Text style={[
                  styles.dayName,
                  selectedDay === day.date && styles.dayNameSelected
                ]}>
                  {day.day}
                </Text>
                <View style={[
                  styles.dateCircle,
                  selectedDay === day.date && styles.dateCircleSelected,
                  day.today && styles.dateCircleToday
                ]}>
                  <Text style={[
                    styles.dateNumber,
                    selectedDay === day.date && styles.dateNumberSelected
                  ]}>
                    {day.date}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Seção: Tarefas do Dia */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Tarefas de Hoje</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllButton}>Ver todas</Text>
            </TouchableOpacity>
          </View>

          <FlatList
            data={dailyTasks}
            renderItem={renderTaskItem}
            keyExtractor={item => item.id}
            scrollEnabled={false}
            contentContainerStyle={styles.tasksList}
            ItemSeparatorComponent={() => <View style={styles.taskSeparator} />}
          />
        </View>

        {/* Seção: Nutrição */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Nutrição Hoje</Text>
            <View style={styles.caloriesContainer}>
              <Text style={styles.caloriesValue}>{nutritionData.calories.current}</Text>
              <Text style={styles.caloriesLabel}>Calorias</Text>
            </View>
          </View>

          {renderMacroBar('Proteína', nutritionData.protein.current, nutritionData.protein.target, '#27AE60')}
          {renderMacroBar('Carboidratos', nutritionData.carbs.current, nutritionData.carbs.target, '#1E88E5')}
          {renderMacroBar('Gorduras', nutritionData.fat.current, nutritionData.fat.target, '#F39C12')}
        </View>

        {/* Seção: Refeições Recentes */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Refeições Recentes</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllButton}>Adicionar</Text>
            </TouchableOpacity>
          </View>

          {recentMeals.map(meal => (
            <View key={meal.id} style={styles.mealCard}>
              <View style={styles.mealHeader}>
                <Text style={styles.mealName}>{meal.name}</Text>
                <View style={styles.mealTimeBadge}>
                  <MaterialIcons name="access-time" size={12} color="#FFFFFF" />
                  <Text style={styles.mealTimeText}>{meal.time}</Text>
                </View>
              </View>
              
              <View style={styles.mealCalories}>
                <Text style={styles.mealCaloriesValue}>{meal.calories}</Text>
                <Text style={styles.mealCaloriesLabel}>Calorias</Text>
              </View>
              
              <View style={styles.mealMacros}>
                <View style={styles.macroItem}>
                  <Text style={styles.macroItemValue}>{meal.protein}g</Text>
                  <Text style={styles.macroItemLabel}>Proteína</Text>
                </View>
                <View style={styles.macroDivider} />
                <View style={styles.macroItem}>
                  <Text style={styles.macroItemValue}>{meal.carbs}g</Text>
                  <Text style={styles.macroItemLabel}>Carbs</Text>
                </View>
                <View style={styles.macroDivider} />
                <View style={styles.macroItem}>
                  <Text style={styles.macroItemValue}>{meal.fat}g</Text>
                  <Text style={styles.macroItemLabel}>Gordura</Text>
                </View>
              </View>
            </View>
          ))}
        </View>

        {/* Espaço final */}
        <View style={styles.bottomSpacer} />
      </ScrollView>

      {/* Botão de Ação Flutuante */}
      <TouchableOpacity style={styles.fab}>
        <LinearGradient
          colors={['#1E88E5', '#8E44AD']}
          style={styles.fabGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <Feather name="plus" size={28} color="#FFFFFF" />
        </LinearGradient>
      </TouchableOpacity>

      {/* Modal para Editar Peso */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={weightModalVisible}
        onRequestClose={() => setWeightModalVisible(false)}
      >
        <TouchableWithoutFeedback onPress={() => setWeightModalVisible(false)}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback>
              <View style={styles.modalContainer}>
                <View style={styles.modalHeader}>
                  <MaterialCommunityIcons name="scale-bathroom" size={28} color="#EA4335" />
                  <Text style={styles.modalTitle}>Editar Peso</Text>
                </View>
                
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Peso Atual (kg)</Text>
                  <TextInput
                    style={styles.input}
                    value={editingWeight}
                    onChangeText={setEditingWeight}
                    keyboardType="decimal-pad"
                    placeholder="Ex: 85.5"
                    placeholderTextColor="#94A3B8"
                  />
                </View>
                
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Meta de Peso (kg)</Text>
                  <TextInput
                    style={styles.input}
                    value={weightTarget}
                    onChangeText={setWeightTarget}
                    keyboardType="decimal-pad"
                    placeholder="Ex: 75.0"
                    placeholderTextColor="#94A3B8"
                  />
                </View>
                
                <View style={styles.modalButtons}>
                  <TouchableOpacity 
                    style={[styles.modalButton, styles.cancelButton]}
                    onPress={() => setWeightModalVisible(false)}
                  >
                    <Text style={styles.cancelButtonText}>Cancelar</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity 
                    style={[styles.modalButton, styles.saveButton]}
                    onPress={handleSaveWeight}
                  >
                    <Text style={styles.saveButtonText}>Salvar</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      {/* Modal para Editar Cintura */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={waistModalVisible}
        onRequestClose={() => setWaistModalVisible(false)}
      >
        <TouchableWithoutFeedback onPress={() => setWaistModalVisible(false)}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback>
              <View style={styles.modalContainer}>
                <View style={styles.modalHeader}>
                  <MaterialCommunityIcons name="tape-measure" size={28} color="#FBBC04" />
                  <Text style={styles.modalTitle}>Editar Cintura</Text>
                </View>
                
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Cintura Atual (cm)</Text>
                  <TextInput
                    style={styles.input}
                    value={editingWaist}
                    onChangeText={setEditingWaist}
                    keyboardType="number-pad"
                    placeholder="Ex: 95"
                    placeholderTextColor="#94A3B8"
                  />
                </View>
                
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Meta de Cintura (cm)</Text>
                  <TextInput
                    style={styles.input}
                    value={waistTarget}
                    onChangeText={setWaistTarget}
                    keyboardType="number-pad"
                    placeholder="Ex: 85"
                    placeholderTextColor="#94A3B8"
                  />
                </View>
                
                <View style={styles.modalButtons}>
                  <TouchableOpacity 
                    style={[styles.modalButton, styles.cancelButton]}
                    onPress={() => setWaistModalVisible(false)}
                  >
                    <Text style={styles.cancelButtonText}>Cancelar</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity 
                    style={[styles.modalButton, styles.saveButton]}
                    onPress={handleSaveWaist}
                  >
                    <Text style={styles.saveButtonText}>Salvar</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </SafeAreaView>
  );
}

// Mantenha os estyles exatamente como estão (não mudei nada dos estilos)
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
  },
  logoContainer: {
    marginRight: 12,
  },
  logoGradient: {
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
  logoText: {
    fontSize: 22,
    fontWeight: '800',
    color: '#FFFFFF',
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
  timeContainer: {
    alignItems: 'flex-end',
  },
  currentTime: {
    fontSize: 32,
    fontWeight: '700',
    color: '#1E88E5',
  },
  dateText: {
    fontSize: 14,
    color: '#64748B',
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
  seeAllButton: {
    fontSize: 14,
    color: '#1E88E5',
    fontWeight: '600',
  },
  
  // Progresso do Dia
  progressPercentage: {
    fontSize: 24,
    fontWeight: '700',
    color: '#27AE60',
  },
  dayProgressContainer: {
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  dayProgressBar: {
    height: 12,
    backgroundColor: '#E2E8F0',
    borderRadius: 6,
    overflow: 'hidden',
    marginBottom: 8,
  },
  dayProgressFill: {
    height: '100%',
    backgroundColor: '#27AE60',
    borderRadius: 6,
  },
  progressText: {
    fontSize: 14,
    color: '#64748B',
  },
  
  // Medições Diárias
  measurementsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  measurementCard: {
    flex: 1,
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
  measurementHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    position: 'relative',
  },
  measurementIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  measurementTitleContainer: {
    flex: 1,
  },
  measurementTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
  },
  measurementSubtitle: {
    fontSize: 12,
    color: '#64748B',
  },
  cardEditButton: {
    padding: 6,
  },
  measurementValuesCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  currentMeasurement: {
    alignItems: 'center',
  },
  currentValue: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1E293B',
  },
  currentUnit: {
    fontSize: 14,
    color: '#64748B',
  },
  measurementProgressCard: {
    flex: 1,
    marginLeft: 16,
  },
  progressLabel: {
    fontSize: 12,
    color: '#64748B',
    marginBottom: 4,
  },
  progressBarSmall: {
    height: 6,
    backgroundColor: '#E2E8F0',
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressBarFillSmall: {
    height: '100%',
    borderRadius: 3,
  },
  targetContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  targetLabel: {
    fontSize: 12,
    color: '#64748B',
  },
  changeTextCard: {
    fontSize: 12,
    fontWeight: '600',
  },
  changePositive: {
    color: '#27AE60',
  },
  changeNegative: {
    color: '#EA4335',
  },
  
  // Calendário Semanal
  weekCalendar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  dayCard: {
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 4,
    borderRadius: 12,
    minWidth: 40,
  },
  dayCardSelected: {
    backgroundColor: '#1E88E5',
  },
  dayCardToday: {
    borderWidth: 2,
    borderColor: '#F39C12',
  },
  dayName: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748B',
    marginBottom: 8,
  },
  dayNameSelected: {
    color: '#FFFFFF',
  },
  dateCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  dateCircleSelected: {
    backgroundColor: '#FFFFFF',
    borderColor: '#FFFFFF',
  },
  dateCircleToday: {
    backgroundColor: '#F39C12',
    borderColor: '#F39C12',
  },
  dateNumber: {
    fontSize: 16,
    fontWeight: '600',
    color: '#334155',
  },
  dateNumberSelected: {
    color: '#1E88E5',
  },
  
  // Tarefas
  tasksList: {
    paddingBottom: 8,
  },
  taskCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#F1F5F9',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  taskCardCompleted: {
    backgroundColor: '#F8FAFC',
    borderColor: '#E2E8F0',
  },
  taskLeftContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  taskIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  taskInfo: {
    flex: 1,
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 4,
  },
  taskTitleCompleted: {
    textDecorationLine: 'line-through',
    color: '#94A3B8',
  },
  taskDescription: {
    fontSize: 14,
    color: '#64748B',
    marginBottom: 8,
  },
  measurementProgress: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
    padding: 8,
    backgroundColor: '#F8FAFC',
    borderRadius: 8,
  },
  measurementValues: {
    flex: 1,
  },
  measurementCurrent: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1E293B',
  },
  measurementTarget: {
    fontSize: 12,
    color: '#64748B',
  },
  measurementChange: {
    marginLeft: 8,
  },
  changeText: {
    fontSize: 12,
    fontWeight: '600',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  taskMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  taskTime: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  taskMetaText: {
    fontSize: 12,
    color: '#64748B',
  },
  taskTypeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  taskTypeText: {
    fontSize: 11,
    fontWeight: '600',
  },
  editButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#E3F2FD',
    marginLeft: 12,
  },
  completionCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 2,
    borderColor: '#CBD5E1',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 12,
  },
  completionCircleCompleted: {
    backgroundColor: '#27AE60',
    borderColor: '#27AE60',
  },
  taskSeparator: {
    height: 12,
  },
  
  // Nutrição
  caloriesContainer: {
    alignItems: 'flex-end',
  },
  caloriesValue: {
    fontSize: 32,
    fontWeight: '700',
    color: '#1E88E5',
  },
  caloriesLabel: {
    fontSize: 14,
    color: '#64748B',
  },
  macroContainer: {
    marginBottom: 16,
  },
  macroHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  macroLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#334155',
  },
  macroValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748B',
  },
  progressBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  progressBarBackground: {
    flex: 1,
    height: 8,
    backgroundColor: '#E2E8F0',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  macroPercentage: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748B',
    minWidth: 30,
  },
  
  // Refeições
  mealCard: {
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  mealHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  mealName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
  },
  mealTimeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#8E44AD',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  mealTimeText: {
    fontSize: 11,
    color: '#FFFFFF',
    fontWeight: '600',
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
  
  // Botão Flutuante
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 10,
  },
  fabGradient: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
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
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#334155',
    marginBottom: 8,
  },
  input: {
    height: 56,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    color: '#1E293B',
    backgroundColor: '#F8FAFC',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    marginTop: 8,
  },
  modalButton: {
    flex: 1,
    height: 52,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#F1F5F9',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  saveButton: {
    backgroundColor: '#1E88E5',
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
  
  // Espaçamento
  bottomSpacer: {
    height: 40,
  },
});