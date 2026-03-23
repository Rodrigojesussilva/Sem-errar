// app/(drawer)/treino/components/MedicoesTab.tsx
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import React from 'react';
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { MeasurementSummary } from '../types';

interface MedicoesTabProps {
  measurementsSummary: {
    weight: MeasurementSummary;
    waist: MeasurementSummary;
  };
  onWeightPress: () => void;
  onWaistPress: () => void;
}

export const MedicoesTab: React.FC<MedicoesTabProps> = ({
  measurementsSummary,
  onWeightPress,
  onWaistPress
}) => {
  const renderMeasurementCard = (type: 'weight' | 'waist', data: MeasurementSummary) => {
    const icon = type === 'weight' ? 'scale-bathroom' : 'tape-measure';
    const label = type === 'weight' ? 'Peso' : 'Cintura';
    const color = type === 'weight' ? '#EA4335' : '#FBBC04';

    return (
      <TouchableOpacity
        style={styles.measurementCard}
        onPress={type === 'weight' ? onWeightPress : onWaistPress}
        activeOpacity={0.7}
      >
        <View style={styles.measurementHeader}>
          <View style={[styles.measurementIcon, { backgroundColor: `${color}15` }]}>
            <MaterialCommunityIcons name={icon as any} size={24} color={color} />
          </View>
          <View style={styles.measurementTitleContainer}>
            <Text style={styles.measurementTitle}>{label}</Text>
            <Text style={styles.measurementSubtitle}>Medição Diária</Text>
          </View>
          <TouchableOpacity
            style={styles.cardEditButton}
            onPress={type === 'weight' ? onWeightPress : onWaistPress}
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
    <ScrollView style={styles.screenContainer} showsVerticalScrollIndicator={false}>
      <Text style={styles.sectionTitle}>Medições Diárias</Text>
      <View style={styles.measurementsGrid}>
        {renderMeasurementCard('weight', measurementsSummary.weight)}
        {renderMeasurementCard('waist', measurementsSummary.waist)}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 16,
    paddingHorizontal: 4,
  },
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
});