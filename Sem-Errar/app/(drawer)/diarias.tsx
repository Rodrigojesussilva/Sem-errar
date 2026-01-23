// app/(drawer)/diaria.tsx - Versão com copos reais
import {
  FontAwesome5,
  Ionicons,
  MaterialCommunityIcons,
  MaterialIcons
} from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  Dimensions,
  Modal,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View
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

// Adicione esta interface para o treino do dia
interface DailyWorkout {
  id: string;
  name: string;
  duration: string;
  exercises: number;
  calories: number;
  type: string;
  color: string;
}

export default function DiariaScreen() {
  const router = useRouter();
  const [selectedDay, setSelectedDay] = useState(15);
  const [currentTime, setCurrentTime] = useState('12:30');

  // Estados para os modais
  const [weightModalVisible, setWeightModalVisible] = useState(false);
  const [waistModalVisible, setWaistModalVisible] = useState(false);
  const [waterInfoModalVisible, setWaterInfoModalVisible] = useState(false);

  // Estados para os valores editáveis
  const [editingWeight, setEditingWeight] = useState('102.8');
  const [editingWaist, setEditingWaist] = useState('109');
  const [weightTarget, setWeightTarget] = useState('95.0');
  const [waistTarget, setWaistTarget] = useState('95');

  // Estado para o treino do dia
  const [dailyWorkout, setDailyWorkout] = useState<DailyWorkout>({
    id: '1',
    name: 'Treino de Peito e Tríceps',
    duration: '60 min',
    exercises: 8,
    calories: 450,
    type: 'musculação',
    color: '#EA4335'
  });

  // Estado para o consumo de água
  const [waterIntake, setWaterIntake] = useState({
    consumed: 300, // ml
    target: 2205, // ml
    percentage: 13 // 300 ÷ 2205 × 100 ≈ 13%
  });

  // Dados das tarefas diárias com tipagem correta
  const [dailyTasks, setDailyTasks] = useState<Task[]>([
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
    calories: { current: 1250, target: 2500 },
    protein: { current: 75, target: 150 },
    carbs: { current: 138, target: 275 },
    fat: { current: 35, target: 70 }
  };

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
        if (task.id === '1' && task.measurement) { // Medir Cintura
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

  // Gerenciar consumo de água
  const handleWaterConsumption = (amount: number) => {
    const newConsumed = waterIntake.consumed + amount;
    const newPercentage = Math.min((newConsumed / waterIntake.target) * 100, 100);
    
    setWaterIntake({
      ...waterIntake,
      consumed: newConsumed,
      percentage: Math.round(newPercentage)
    });
  };

  // Resetar consumo de água
  const handleResetWater = () => {
    setWaterIntake({
      consumed: 0,
      target: 2205,
      percentage: 0
    });
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

  // Componente de copo de água
  const WaterGlass = ({ amount, size, onPress }: { amount: number, size: 'small' | 'medium' | 'large', onPress: () => void }) => {
    const getGlassHeight = () => {
      switch(size) {
        case 'small': return 60;
        case 'medium': return 80;
        case 'large': return 100;
        default: return 70;
      }
    };

    const getGlassWidth = () => {
      switch(size) {
        case 'small': return 40;
        case 'medium': return 50;
        case 'large': return 60;
        default: return 45;
      }
    };

    const getWaterColor = () => {
      switch(size) {
        case 'small': return '#E3F2FD'; // Azul muito claro
        case 'medium': return '#BBDEFB'; // Azul claro
        case 'large': return '#90CAF9'; // Azul médio
        default: return '#BBDEFB';
      }
    };

    const getGlassColor = () => {
      switch(size) {
        case 'small': return '#1E88E5'; // Azul principal
        case 'medium': return '#1565C0'; // Azul mais escuro
        case 'large': return '#0D47A1'; // Azul mais escuro ainda
        default: return '#1E88E5';
      }
    };

    return (
      <TouchableOpacity 
        style={styles.glassContainer}
        onPress={onPress}
        activeOpacity={0.7}
      >
        {/* Recipiente do copo */}
        <View style={[
          styles.glassShape,
          { 
            height: getGlassHeight(),
            width: getGlassWidth(),
            borderColor: getGlassColor(),
            backgroundColor: '#F8FAFC'
          }
        ]}>
          {/* Água dentro do copo */}
          <View style={[
            styles.waterFill,
            { 
              backgroundColor: getWaterColor(),
              height: getGlassHeight() * 0.7 // 70% cheio
            }
          ]}>
            {/* Bolhas de ar */}
            <View style={styles.bubbleContainer}>
              <View style={[styles.bubble, { top: 10, left: 8, width: 6, height: 6 }]} />
              <View style={[styles.bubble, { top: 15, left: 25, width: 8, height: 8 }]} />
              <View style={[styles.bubble, { top: 25, left: 12, width: 5, height: 5 }]} />
              <View style={[styles.bubble, { top: 35, left: 20, width: 7, height: 7 }]} />
            </View>
          </View>
          
          {/* Linha de nível da água */}
          <View style={styles.waterLevelLine} />
          
          {/* Refração da luz na água */}
          <View style={styles.waterLightReflection} />
        </View>
        
        {/* Base do copo */}
        <View style={[
          styles.glassBase,
          { 
            width: getGlassWidth() + 10,
            backgroundColor: getGlassColor()
          }
        ]} />
        
        {/* Quantidade abaixo do copo */}
        <Text style={styles.glassAmount}>+{amount} ml</Text>
        
        {/* Ícone de gota dentro do copo (opcional) */}
        <View style={styles.waterDropIcon}>
          <MaterialCommunityIcons name="water" size={size === 'large' ? 20 : size === 'medium' ? 16 : 12} color="#1E88E5" />
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

        {/* Seção: Consumo de Água */}
        <View style={styles.waterSection}>
          <View style={styles.waterSectionHeader}>
            <View style={styles.waterTitleContainer}>
              <MaterialCommunityIcons name="water" size={24} color="#1E88E5" />
              <Text style={styles.sectionTitle}>Hidratação</Text>
            </View>
            <TouchableOpacity 
              style={styles.infoButton}
              onPress={() => setWaterInfoModalVisible(true)}
            >
              <MaterialIcons name="info-outline" size={20} color="#64748B" />
            </TouchableOpacity>
          </View>

          <Text style={styles.waterTip}>
            Evite beber água durante as refeições
          </Text>

          <View style={styles.waterProgressContainer}>
            <View style={styles.waterPercentageCircle}>
              <Text style={styles.waterPercentageText}>
                {waterIntake.percentage}%
              </Text>
            </View>

            <View style={styles.waterStats}>
              <View style={styles.waterStat}>
                <Text style={styles.waterStatLabel}>CONSUMO</Text>
                <Text style={styles.waterStatValue}>{waterIntake.consumed} ml</Text>
              </View>

              <View style={styles.waterStatDivider} />

              <View style={styles.waterStat}>
                <Text style={styles.waterStatLabel}>META</Text>
                <Text style={styles.waterStatValue}>{waterIntake.target} ml</Text>
              </View>
            </View>
          </View>

          <View style={styles.waterControls}>
            <Text style={styles.waterControlsTitle}>Adicionar água:</Text>
            
            <View style={styles.glassesContainer}>
              <WaterGlass 
                amount={150} 
                size="small" 
                onPress={() => handleWaterConsumption(150)} 
              />
              
              <WaterGlass 
                amount={250} 
                size="medium" 
                onPress={() => handleWaterConsumption(250)} 
              />
              
              <WaterGlass 
                amount={500} 
                size="large" 
                onPress={() => handleWaterConsumption(500)} 
              />
            </View>

            <TouchableOpacity 
              style={styles.resetButton}
              onPress={handleResetWater}
            >
              <MaterialIcons name="refresh" size={20} color="#EA4335" />
              <Text style={styles.resetButtonText}>Resetar consumo</Text>
            </TouchableOpacity>
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

        {/* Seção: Nutrição */}
        <TouchableOpacity
          style={styles.nutritionSection}
          onPress={() => router.push('/refeicoes')}
          activeOpacity={0.7}
        >
          <View style={styles.nutritionSectionHeader}>
            <Text style={styles.sectionTitle}>Nutrição Hoje</Text>
            <View style={styles.caloriesContainer}>
              <View style={styles.caloriesValueContainer}>
                <Text style={styles.caloriesCurrent}>{nutritionData.calories.current}</Text>
                <View style={styles.caloriesDividerLine} />
                <Text style={styles.caloriesTotal}>{nutritionData.calories.target}</Text>
              </View>
              <Text style={styles.caloriesLabel}>Calories eaten</Text>
              <View style={styles.arrowContainer}>
                <MaterialIcons name="arrow-forward-ios" size={16} color="#1E88E5" />
              </View>
            </View>
          </View>

          <View style={styles.macrosContainer}>
            <View style={styles.macroRow}>
              <View style={styles.macroItemCompact}>
                <Text style={styles.macroLabelCompact}>Proteína</Text>
                <Text style={styles.macroValueCompact}>
                  {nutritionData.protein.current}/{nutritionData.protein.target}g
                </Text>
                <View style={styles.macroProgressBarCompact}>
                  <View
                    style={[
                      styles.macroProgressFillCompact,
                      {
                        width: `${Math.min((nutritionData.protein.current / nutritionData.protein.target) * 100, 100)}%`,
                        backgroundColor: '#27AE60'
                      }
                    ]}
                  />
                </View>
              </View>

              <View style={styles.macroItemCompact}>
                <Text style={styles.macroLabelCompact}>Carbs</Text>
                <Text style={styles.macroValueCompact}>
                  {nutritionData.carbs.current}/{nutritionData.carbs.target}g
                </Text>
                <View style={styles.macroProgressBarCompact}>
                  <View
                    style={[
                      styles.macroProgressFillCompact,
                      {
                        width: `${Math.min((nutritionData.carbs.current / nutritionData.carbs.target) * 100, 100)}%`,
                        backgroundColor: '#1E88E5'
                      }
                    ]}
                  />
                </View>
              </View>

              <View style={styles.macroItemCompact}>
                <Text style={styles.macroLabelCompact}>Gorduras</Text>
                <Text style={styles.macroValueCompact}>
                  {nutritionData.fat.current}/{nutritionData.fat.target}g
                </Text>
                <View style={styles.macroProgressBarCompact}>
                  <View
                    style={[
                      styles.macroProgressFillCompact,
                      {
                        width: `${Math.min((nutritionData.fat.current / nutritionData.fat.target) * 100, 100)}%`,
                        backgroundColor: '#F39C12'
                      }
                    ]}
                  />
                </View>
              </View>
            </View>
          </View>
        </TouchableOpacity>

        {/* Seção: Treino do Dia */}
        <TouchableOpacity
          style={styles.workoutSection}
          onPress={() => router.push('/treino')}
          activeOpacity={0.7}
        >
          <View style={styles.workoutSectionHeader}>
            <Text style={styles.sectionTitle}>Treino Hoje</Text>
            <View style={styles.workoutInfoContainer}>
              <View style={styles.workoutStats}>
                <View style={styles.workoutStat}>
                  <Text style={styles.workoutStatValue}>{dailyWorkout.exercises}</Text>
                  <Text style={styles.workoutStatLabel}>Exercícios</Text>
                </View>
                <View style={styles.workoutStat}>
                  <Text style={styles.workoutStatValue}>{dailyWorkout.duration}</Text>
                  <Text style={styles.workoutStatLabel}>Duração</Text>
                </View>
                <View style={styles.workoutStat}>
                  <Text style={styles.workoutStatValue}>{dailyWorkout.calories}</Text>
                  <Text style={styles.workoutStatLabel}>Calorias</Text>
                </View>
              </View>
              <View style={styles.arrowContainer}>
                <MaterialIcons name="arrow-forward-ios" size={16} color="#1E88E5" />
              </View>
            </View>
          </View>

          <View style={styles.workoutDetails}>
            <View style={styles.workoutNameContainer}>
              <View style={[styles.workoutIcon, { backgroundColor: `${dailyWorkout.color}15` }]}>
                <MaterialCommunityIcons name="dumbbell" size={24} color={dailyWorkout.color} />
              </View>
              <View>
                <Text style={styles.workoutName}>{dailyWorkout.name}</Text>
                <Text style={styles.workoutType}>{dailyWorkout.type}</Text>
              </View>
            </View>

            <View style={styles.exercisesPreview}>
              <Text style={styles.exercisesPreviewTitle}>Exercícios principais:</Text>
              <View style={styles.exerciseTags}>
                <View style={[styles.exerciseTag, { backgroundColor: '#EA433515' }]}>
                  <Text style={[styles.exerciseTagText, { color: '#EA4335' }]}>Supino</Text>
                </View>
                <View style={[styles.exerciseTag, { backgroundColor: '#1E88E515' }]}>
                  <Text style={[styles.exerciseTagText, { color: '#1E88E5' }]}>Crucifixo</Text>
                </View>
                <View style={[styles.exerciseTag, { backgroundColor: '#8E44AD15' }]}>
                  <Text style={[styles.exerciseTagText, { color: '#8E44AD' }]}>Tríceps</Text>
                </View>
                <View style={[styles.exerciseTag, { backgroundColor: '#27AE6015' }]}>
                  <Text style={[styles.exerciseTagText, { color: '#27AE60' }]}>Abdominal</Text>
                </View>
              </View>
            </View>
          </View>
        </TouchableOpacity>

        {/* Seção: Cardio do Dia */}
        <TouchableOpacity
          style={styles.cardioSection}
          onPress={() => router.push('/cardio')}
          activeOpacity={0.7}
        >
          <View style={styles.cardioSectionHeader}>
            <Text style={styles.sectionTitle}>Cardio Hoje</Text>
            <View style={styles.cardioInfoContainer}>
              <View style={styles.cardioStats}>
                <View style={styles.cardioStat}>
                  <Text style={styles.cardioStatValue}>30 min</Text>
                  <Text style={styles.cardioStatLabel}>Duração</Text>
                </View>
                <View style={styles.cardioStat}>
                  <Text style={styles.cardioStatValue}>300</Text>
                  <Text style={styles.cardioStatLabel}>Calorias</Text>
                </View>
                <View style={styles.cardioStat}>
                  <Text style={styles.cardioStatValue}>Alta</Text>
                  <Text style={styles.cardioStatLabel}>Intensidade</Text>
                </View>
              </View>
              <View style={styles.arrowContainer}>
                <MaterialIcons name="arrow-forward-ios" size={16} color="#1E88E5" />
              </View>
            </View>
          </View>

          <View style={styles.cardioDetails}>
            <View style={styles.cardioNameContainer}>
              <View style={[styles.cardioIcon, { backgroundColor: '#EA433515' }]}>
                <MaterialCommunityIcons name="run-fast" size={24} color="#EA4335" />
              </View>
              <View>
                <Text style={styles.cardioName}>Corrida na Esteira</Text>
                <Text style={styles.cardioType}>Cardiovascular</Text>
              </View>
            </View>

            <View style={styles.cardioInfoRow}>
              <View style={styles.cardioInfoItem}>
                <MaterialCommunityIcons name="map-marker-distance" size={16} color="#64748B" />
                <Text style={styles.cardioInfoText}>5 km</Text>
              </View>
              <View style={styles.cardioInfoItem}>
                <MaterialCommunityIcons name="heart-pulse" size={16} color="#64748B" />
                <Text style={styles.cardioInfoText}>150-165 bpm</Text>
              </View>
            </View>
          </View>
        </TouchableOpacity>

        {/* Seção: Tarefas de Hoje */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Tarefas de Hoje</Text>
          
          {dailyTasks.map((task, index) => (
            <View key={task.id} style={[
              index === dailyTasks.length - 1 ? null : styles.taskSeparator
            ]}>
              {renderTaskItem({ item: task })}
            </View>
          ))}
        </View>

        {/* Espaço final */}
        <View style={styles.bottomSpacer} />
      </ScrollView>

      {/* Modal para informações sobre água */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={waterInfoModalVisible}
        onRequestClose={() => setWaterInfoModalVisible(false)}
      >
        <TouchableWithoutFeedback onPress={() => setWaterInfoModalVisible(false)}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback>
              <View style={styles.modalContainer}>
                <View style={styles.modalHeader}>
                  <MaterialCommunityIcons name="water" size={28} color="#1E88E5" />
                  <Text style={styles.modalTitle}>Sobre Hidratação</Text>
                </View>

                <View style={styles.modalSection}>
                  <Text style={styles.modalSectionTitle}>Por que beber água?</Text>
                  <Text style={styles.modalText}>
                    • Ajuda na digestão e metabolismo{"\n"}
                    • Melhora a performance física{"\n"}
                    • Mantém a pele saudável{"\n"}
                    • Regula a temperatura corporal{"\n"}
                    • Transporta nutrientes
                  </Text>
                </View>

                <View style={styles.modalSection}>
                  <Text style={styles.modalSectionTitle}>Dica Importante</Text>
                  <Text style={styles.modalText}>
                    Beber água durante as refeições pode diluir o suco gástrico, 
                    dificultando a digestão. Recomenda-se beber água 30 minutos 
                    antes ou após as refeições.
                  </Text>
                </View>

                <View style={styles.modalSection}>
                  <Text style={styles.modalSectionTitle}>Meta Diária</Text>
                  <Text style={styles.modalText}>
                    A meta de 2.2L é baseada na recomendação padrão para adultos. 
                    Ajuste conforme sua atividade física, clima e peso corporal.
                  </Text>
                </View>

                <TouchableOpacity
                  style={[styles.modalButton, styles.saveButton]}
                  onPress={() => setWaterInfoModalVisible(false)}
                >
                  <Text style={styles.saveButtonText}>Entendi</Text>
                </TouchableOpacity>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

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

  // Seção de Água (MELHORADA)
  waterSection: {
    paddingHorizontal: 20,
    marginTop: 24,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginHorizontal: 20,
    borderWidth: 1.5,
    borderColor: '#F1F5F9',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  waterSectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  waterTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  infoButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  waterTip: {
    fontSize: 14,
    color: '#EA4335',
    fontStyle: 'italic',
    textAlign: 'center',
    marginBottom: 24,
    paddingHorizontal: 12,
    backgroundColor: '#FFEBEE',
    paddingVertical: 10,
    borderRadius: 10,
    borderLeftWidth: 3,
    borderLeftColor: '#EA4335',
  },
  waterProgressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  waterPercentageCircle: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: '#E3F2FD',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 5,
    borderColor: '#1E88E5',
    shadowColor: '#1E88E5',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  waterPercentageText: {
    fontSize: 36,
    fontWeight: '800',
    color: '#1E88E5',
  },
  waterStats: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginLeft: 20,
  },
  waterStat: {
    alignItems: 'center',
    minWidth: 80,
  },
  waterStatLabel: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '700',
    marginBottom: 6,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  waterStatValue: {
    fontSize: 28,
    fontWeight: '800',
    color: '#1E293B',
  },
  waterStatDivider: {
    width: 1,
    height: 50,
    backgroundColor: '#E2E8F0',
  },
  waterControls: {
    marginTop: 10,
  },
  waterControlsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#334155',
    marginBottom: 20,
    textAlign: 'center',
  },
  glassesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    marginBottom: 24,
  },
  glassContainer: {
    alignItems: 'center',
    position: 'relative',
  },
  glassShape: {
    borderRadius: 8,
    borderWidth: 3,
    overflow: 'hidden',
    position: 'relative',
  },
  waterFill: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    borderBottomLeftRadius: 5,
    borderBottomRightRadius: 5,
  },
  bubbleContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  bubble: {
    position: 'absolute',
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    borderRadius: 50,
  },
  waterLevelLine: {
    position: 'absolute',
    top: '30%',
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: 'rgba(30, 136, 229, 0.3)',
  },
  waterLightReflection: {
    position: 'absolute',
    top: 10,
    right: 5,
    width: 15,
    height: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    borderRadius: 4,
    transform: [{ skewY: '-20deg' }],
  },
  glassBase: {
    height: 6,
    borderRadius: 3,
    marginTop: -2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  glassAmount: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1E88E5',
    marginTop: 8,
  },
  waterDropIcon: {
    position: 'absolute',
    top: '25%',
    left: '50%',
    transform: [{ translateX: -10 }],
    opacity: 0.7,
  },
  resetButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingHorizontal: 20,
    paddingVertical: 14,
    backgroundColor: '#FFEBEE',
    borderRadius: 12,
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#FFCDD2',
  },
  resetButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#EA4335',
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

  // Seção de Nutrição
  nutritionSection: {
    paddingHorizontal: 20,
    marginTop: 24,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 20,
    borderWidth: 1.5,
    borderColor: '#F1F5F9',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  nutritionSectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  caloriesContainer: {
    alignItems: 'center',
    position: 'relative',
  },
  caloriesValueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  caloriesCurrent: {
    fontSize: 40,
    fontWeight: '700',
    color: '#1E293B',
  },
  caloriesDividerLine: {
    width: 1,
    height: 30,
    backgroundColor: '#CBD5E1',
    marginHorizontal: 12,
  },
  caloriesTotal: {
    fontSize: 40,
    fontWeight: '700',
    color: '#CBD5E1',
  },
  caloriesLabel: {
    fontSize: 14,
    color: '#64748B',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  arrowContainer: {
    position: 'absolute',
    right: -30,
    top: '50%',
    marginTop: -8,
  },
  macrosContainer: {
    marginTop: 16,
  },
  macroRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  macroItemCompact: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
  },
  macroLabelCompact: {
    fontSize: 12,
    fontWeight: '600',
    color: '#334155',
    marginBottom: 4,
  },
  macroValueCompact: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 8,
  },
  macroProgressBarCompact: {
    width: '100%',
    height: 6,
    backgroundColor: '#E2E8F0',
    borderRadius: 3,
    overflow: 'hidden',
  },
  macroProgressFillCompact: {
    height: '100%',
    borderRadius: 3,
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
    fontSize: 16,
    fontWeight: '600',
    color: '#334155',
    marginBottom: 8,
  },
  modalText: {
    fontSize: 14,
    color: '#64748B',
    lineHeight: 20,
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

  // Seção de Treino
  workoutSection: {
    paddingHorizontal: 20,
    marginTop: 24,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 20,
    borderWidth: 1.5,
    borderColor: '#F1F5F9',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  workoutSectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  workoutInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  workoutStats: {
    flexDirection: 'row',
    gap: 16,
    marginRight: 12,
  },
  workoutStat: {
    alignItems: 'center',
  },
  workoutStatValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1E293B',
  },
  workoutStatLabel: {
    fontSize: 12,
    color: '#64748B',
  },
  workoutDetails: {
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 16,
  },
  workoutNameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 12,
  },
  workoutIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  workoutName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
  },
  workoutType: {
    fontSize: 12,
    color: '#64748B',
  },
  exercisesPreview: {
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    paddingTop: 16,
  },
  exercisesPreviewTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#334155',
    marginBottom: 12,
  },
  exerciseTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  exerciseTag: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  exerciseTagText: {
    fontSize: 12,
    fontWeight: '600',
  },

  // Seção de Cardio
  cardioSection: {
    paddingHorizontal: 20,
    marginTop: 24,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 20,
    borderWidth: 1.5,
    borderColor: '#F1F5F9',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  cardioSectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  cardioInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardioStats: {
    flexDirection: 'row',
    gap: 16,
    marginRight: 12,
  },
  cardioStat: {
    alignItems: 'center',
  },
  cardioStatValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1E293B',
  },
  cardioStatLabel: {
    fontSize: 12,
    color: '#64748B',
  },
  cardioDetails: {
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 16,
  },
  cardioNameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 12,
  },
  cardioIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardioName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
  },
  cardioType: {
    fontSize: 12,
    color: '#64748B',
  },
  cardioInfoRow: {
    flexDirection: 'row',
    gap: 24,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    paddingTop: 16,
  },
  cardioInfoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  cardioInfoText: {
    fontSize: 14,
    color: '#64748B',
  },

  // Espaçamento
  bottomSpacer: {
    height: 40,
  },
});