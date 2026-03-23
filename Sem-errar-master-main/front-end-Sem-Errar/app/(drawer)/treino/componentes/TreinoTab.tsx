// app/(drawer)/treino/components/TreinoTab.tsx
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { Treino } from '../types';

interface TreinoTabProps {
  treinoAtual: Treino;
  totalExercicios: number;
  getExerciseIcon: (exercicio: string) => { name: string; color: string };
  renderExerciseIcon: (exercicio: string, size?: number) => React.JSX.Element;
  onPreconfigPress: () => void;
  onRegisterPress: () => void;
}

export const TreinoTab: React.FC<TreinoTabProps> = ({
  treinoAtual,
  totalExercicios,
  getExerciseIcon,
  renderExerciseIcon,
  onPreconfigPress,
  onRegisterPress
}) => {
  return (
    <ScrollView style={styles.screenContainer} showsVerticalScrollIndicator={false}>
      <View style={styles.mainCard}>
        <View style={styles.treinoHojeBadge}>
          <MaterialCommunityIcons name="dumbbell" size={14} color="#1E88E5" />
          <Text style={styles.treinoHojeText}>Treino Hoje</Text>
        </View>

        <View style={styles.cardHeader}>
          <View style={styles.titleContainer}>
            <Text style={styles.cardTitle} numberOfLines={1} ellipsizeMode="tail">
              {treinoAtual.tipo}
            </Text>
            <Text style={styles.cardDescription} numberOfLines={1} ellipsizeMode="tail">
              {treinoAtual.observacao}
            </Text>
          </View>
          
          <View style={styles.actionButtons}>
            <TouchableOpacity
              style={styles.preconfigButton}
              onPress={onPreconfigPress}
            >
              <Feather name="settings" size={14} color="#1E88E5" />
              <Text style={styles.preconfigButtonText}>Preconfig.</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.registerButton}
              onPress={onRegisterPress}
            >
              <Feather name="check-square" size={14} color="#FFFFFF" />
              <Text style={styles.registerButtonText}>Registrar</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <MaterialCommunityIcons name="dumbbell" size={18} color="#1E88E5" />
            <Text style={styles.statValue}>{totalExercicios}</Text>
            <Text style={styles.statLabel}>ex</Text>
          </View>

          <View style={styles.statDivider} />

          <View style={styles.statItem}>
            <MaterialCommunityIcons name="clock-outline" size={18} color="#4CAF50" />
            <Text style={styles.statValue}>60</Text>
            <Text style={styles.statLabel}>min</Text>
          </View>

          <View style={styles.statDivider} />

          <View style={styles.statItem}>
            <MaterialCommunityIcons name="fire" size={18} color="#FF9800" />
            <Text style={styles.statValue}>450</Text>
            <Text style={styles.statLabel}>kcal</Text>
          </View>
        </View>

        <View style={styles.exercisesContainer}>
          <Text style={styles.exercisesTitle}>Exercícios principais</Text>
          
          <View style={styles.exercisesGrid}>
            {treinoAtual.exercicios.slice(0, 4).map((exercicio: string, index: number) => (
              <View key={index} style={styles.exerciseChip}>
                <View style={[styles.exerciseChipIcon, { backgroundColor: getExerciseIcon(exercicio).color + '15' }]}>
                  {renderExerciseIcon(exercicio, 14)}
                </View>
                <Text style={styles.exerciseChipText} numberOfLines={1} ellipsizeMode="tail">
                  {exercicio}
                </Text>
              </View>
            ))}
          </View>

          {treinoAtual.exercicios.length > 4 && (
            <TouchableOpacity style={styles.moreButton}>
              <Text style={styles.moreButtonText}>
                + {treinoAtual.exercicios.length - 4} exercícios
              </Text>
              <Feather name="chevron-right" size={14} color="#1E88E5" />
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.tipContainer}>
          <MaterialCommunityIcons name="lightbulb-outline" size={16} color="#FFC107" />
          <Text style={styles.tipText} numberOfLines={1}>
            Beba água a cada 15min
          </Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    padding: 16,
  },
  mainCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 4,
    borderWidth: 1.5,
    borderColor: '#F1F5F9',
  },
  treinoHojeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E3F2FD',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
    marginBottom: 12,
    gap: 4,
  },
  treinoHojeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1E88E5',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  titleContainer: {
    flex: 1,
    marginRight: 8,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 2,
  },
  cardDescription: {
    fontSize: 12,
    color: '#64748B',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 4,
    flexShrink: 0,
  },
  preconfigButton: {
    flexDirection: 'row',
    height: 30,
    borderRadius: 15,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 8,
    gap: 4,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  preconfigButtonText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#1E88E5',
  },
  registerButton: {
    flexDirection: 'row',
    height: 30,
    borderRadius: 15,
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 10,
    gap: 4,
  },
  registerButtonText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    padding: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statValue: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1E293B',
  },
  statLabel: {
    fontSize: 12,
    color: '#64748B',
  },
  statDivider: {
    width: 1,
    height: 20,
    backgroundColor: '#E2E8F0',
  },
  exercisesContainer: {
    marginBottom: 12,
  },
  exercisesTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#334155',
    marginBottom: 10,
  },
  exercisesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  exerciseChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    gap: 6,
    maxWidth: '48%',
  },
  exerciseChipIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    flexShrink: 0,
  },
  exerciseChipText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#1E293B',
    flexShrink: 1,
  },
  moreButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    marginTop: 10,
    paddingVertical: 8,
  },
  moreButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1E88E5',
  },
  tipContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  tipText: {
    fontSize: 12,
    color: '#B76E00',
    flex: 1,
  },
});