// app/(drawer)/treino/components/CalendarioTab.tsx
import { MaterialIcons } from '@expo/vector-icons';
import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { WeekDay } from '../types';

interface CalendarioTabProps {
  weekDays: WeekDay[];
  selectedDay: number;
  onDaySelect: (date: number) => void;
}

export const CalendarioTab: React.FC<CalendarioTabProps> = ({
  weekDays,
  selectedDay,
  onDaySelect
}) => {
  return (
    <ScrollView style={styles.screenContainer} showsVerticalScrollIndicator={false}>
      <View style={styles.weekCard}>
        <View style={styles.weekHeader}>
          <Text style={styles.weekTitle}>Esta Semana</Text>
          <TouchableOpacity style={styles.weekSeeAll}>
            <Text style={styles.weekSeeAllText}>Ver todos</Text>
            <MaterialIcons name="chevron-right" size={16} color="#1E88E5" />
          </TouchableOpacity>
        </View>

        <View style={styles.weekCalendar}>
          {weekDays.map((day, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.dayCard,
                selectedDay === day.date && styles.dayCardSelected,
                day.today && styles.dayCardToday
              ]}
              onPress={() => onDaySelect(day.date)}
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
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    padding: 16,
  },
  weekCard: {
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
  weekHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  weekTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1E293B',
  },
  weekSeeAll: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  weekSeeAllText: {
    fontSize: 14,
    color: '#1E88E5',
    fontWeight: '600',
    marginRight: 2,
  },
  weekCalendar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
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
});