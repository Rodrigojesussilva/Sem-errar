// app/(drawer)/treino/components/CardioTab.tsx
import { Feather, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';

interface CardioData {
  duracao: number;
  distancia: number;
  calorias: number;
  frequenciaCardiaca: {
    media: number;
    max: number;
  };
  pace: string;
  tipo: string;
}

interface CardioTabProps {
  cardioData: CardioData;
  onIniciarPress: () => void;
  onHistoricoPress: () => void;
  onConfigPress: () => void;
}

export const CardioTab: React.FC<CardioTabProps> = ({
  cardioData,
  onIniciarPress,
  onHistoricoPress,
  onConfigPress
}) => {
  return (
    <ScrollView style={styles.screenContainer} showsVerticalScrollIndicator={false}>
      
      {/* CARD PRINCIPAL - TREINO CARDIO HOJE */}
      <LinearGradient
        colors={['#EA4335', '#D32F2F']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.mainCard}
      >
        <View style={styles.mainCardHeader}>
          <View style={styles.mainCardTitleContainer}>
            <MaterialCommunityIcons name="run-fast" size={24} color="#FFFFFF" />
            <Text style={styles.mainCardTitle}>Cardio Hoje</Text>
          </View>
          <TouchableOpacity style={styles.mainCardConfigButton} onPress={onConfigPress}>
            <Feather name="more-vertical" size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        <Text style={styles.mainCardSubtitulo}>Corrida na Esteira</Text>

        <View style={styles.mainCardStats}>
          <View style={styles.mainCardStat}>
            <Text style={styles.mainCardStatValue}>{cardioData.duracao}</Text>
            <Text style={styles.mainCardStatLabel}>min</Text>
          </View>
          <View style={styles.mainCardStatDivider} />
          <View style={styles.mainCardStat}>
            <Text style={styles.mainCardStatValue}>{cardioData.distancia}</Text>
            <Text style={styles.mainCardStatLabel}>km</Text>
          </View>
          <View style={styles.mainCardStatDivider} />
          <View style={styles.mainCardStat}>
            <Text style={styles.mainCardStatValue}>{cardioData.calorias}</Text>
            <Text style={styles.mainCardStatLabel}>kcal</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.iniciarButton} onPress={onIniciarPress}>
          <Text style={styles.iniciarButtonText}>INICIAR TREINO</Text>
          <MaterialIcons name="play-arrow" size={20} color="#FFFFFF" />
        </TouchableOpacity>
      </LinearGradient>

      {/* CARD DE ESTATÍSTICAS CARDIO */}
      <View style={styles.statsCard}>
        <Text style={styles.statsCardTitle}>Estatísticas do Treino</Text>

        <View style={styles.statsGrid}>
          <View style={styles.statBox}>
            <MaterialCommunityIcons name="heart-pulse" size={24} color="#EA4335" />
            <Text style={styles.statBoxValue}>{cardioData.frequenciaCardiaca.media}</Text>
            <Text style={styles.statBoxLabel}>FC Média</Text>
          </View>

          <View style={styles.statBox}>
            <MaterialCommunityIcons name="heart" size={24} color="#EA4335" />
            <Text style={styles.statBoxValue}>{cardioData.frequenciaCardiaca.max}</Text>
            <Text style={styles.statBoxLabel}>FC Máx</Text>
          </View>

          <View style={styles.statBox}>
            <MaterialCommunityIcons name="speedometer" size={24} color="#EA4335" />
            <Text style={styles.statBoxValue}>{cardioData.pace}</Text>
            <Text style={styles.statBoxLabel}>Pace</Text>
          </View>

          <View style={styles.statBox}>
            <MaterialCommunityIcons name="run" size={24} color="#EA4335" />
            <Text style={styles.statBoxValue}>{cardioData.tipo}</Text>
            <Text style={styles.statBoxLabel}>Tipo</Text>
          </View>
        </View>
      </View>

      {/* CARD DE ÚLTIMOS TREINOS */}
      <View style={styles.historicoCard}>
        <View style={styles.historicoHeader}>
          <Text style={styles.historicoTitle}>Últimos Treinos</Text>
          <TouchableOpacity style={styles.verTodosButton} onPress={onHistoricoPress}>
            <Text style={styles.verTodosText}>Ver todos</Text>
            <MaterialIcons name="chevron-right" size={16} color="#1E88E5" />
          </TouchableOpacity>
        </View>

        <View style={styles.historicoLista}>
          <View style={styles.historicoItem}>
            <View style={styles.historicoItemLeft}>
              <View style={styles.historicoItemIcon}>
                <MaterialCommunityIcons name="run-fast" size={16} color="#EA4335" />
              </View>
              <View>
                <Text style={styles.historicoItemTitulo}>Corrida na Esteira</Text>
                <Text style={styles.historicoItemData}>Hoje, 07:30</Text>
              </View>
            </View>
            <Text style={styles.historicoItemValor}>30 min • 5 km</Text>
          </View>

          <View style={styles.historicoItem}>
            <View style={styles.historicoItemLeft}>
              <View style={styles.historicoItemIcon}>
                <MaterialCommunityIcons name="run-fast" size={16} color="#EA4335" />
              </View>
              <View>
                <Text style={styles.historicoItemTitulo}>Bicicleta</Text>
                <Text style={styles.historicoItemData}>Ontem, 18:00</Text>
              </View>
            </View>
            <Text style={styles.historicoItemValor}>45 min • 15 km</Text>
          </View>

          <View style={styles.historicoItem}>
            <View style={styles.historicoItemLeft}>
              <View style={styles.historicoItemIcon}>
                <MaterialCommunityIcons name="run-fast" size={16} color="#EA4335" />
              </View>
              <View>
                <Text style={styles.historicoItemTitulo}>Caminhada</Text>
                <Text style={styles.historicoItemData}>12 Mar, 19:30</Text>
              </View>
            </View>
            <Text style={styles.historicoItemValor}>60 min • 4 km</Text>
          </View>
        </View>
      </View>

      {/* CARD DE METAS */}
      <View style={styles.metasCard}>
        <Text style={styles.metasTitle}>Metas da Semana</Text>

        <View style={styles.metaItem}>
          <View style={styles.metaInfo}>
            <Text style={styles.metaLabel}>Minutos de cardio</Text>
            <Text style={styles.metaValor}>180/300 min</Text>
          </View>
          <View style={styles.metaBarra}>
            <View style={[styles.metaBarraFill, { width: '60%', backgroundColor: '#EA4335' }]} />
          </View>
        </View>

        <View style={styles.metaItem}>
          <View style={styles.metaInfo}>
            <Text style={styles.metaLabel}>Distância percorrida</Text>
            <Text style={styles.metaValor}>24/50 km</Text>
          </View>
          <View style={styles.metaBarra}>
            <View style={[styles.metaBarraFill, { width: '48%', backgroundColor: '#EA4335' }]} />
          </View>
        </View>

        <View style={styles.metaItem}>
          <View style={styles.metaInfo}>
            <Text style={styles.metaLabel}>Calorias queimadas</Text>
            <Text style={styles.metaValor}>1850/3000 kcal</Text>
          </View>
          <View style={styles.metaBarra}>
            <View style={[styles.metaBarraFill, { width: '62%', backgroundColor: '#EA4335' }]} />
          </View>
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
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#EA4335',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 5,
  },
  mainCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  mainCardTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  mainCardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  mainCardConfigButton: {
    padding: 4,
  },
  mainCardSubtitulo: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    marginBottom: 16,
  },
  mainCardStats: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  mainCardStat: {
    alignItems: 'center',
  },
  mainCardStatValue: {
    fontSize: 28,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  mainCardStatLabel: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.7)',
  },
  mainCardStatDivider: {
    width: 1,
    height: 30,
    backgroundColor: 'rgba(255,255,255,0.3)',
  },
  iniciarButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 30,
    gap: 8,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  iniciarButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 1,
  },
  statsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  statsCardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  statBox: {
    flex: 1,
    minWidth: '45%',
    alignItems: 'center',
    backgroundColor: '#FEF2F2',
    borderRadius: 12,
    padding: 12,
  },
  statBoxValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1E293B',
    marginTop: 8,
  },
  statBoxLabel: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
  },
  historicoCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  historicoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  historicoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
  },
  verTodosButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  verTodosText: {
    fontSize: 12,
    color: '#1E88E5',
    fontWeight: '600',
  },
  historicoLista: {
    gap: 12,
  },
  historicoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  historicoItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  historicoItemIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FEF2F2',
    justifyContent: 'center',
    alignItems: 'center',
  },
  historicoItemTitulo: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1E293B',
  },
  historicoItemData: {
    fontSize: 11,
    color: '#94A3B8',
  },
  historicoItemValor: {
    fontSize: 12,
    fontWeight: '600',
    color: '#EA4335',
  },
  metasCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  metasTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 16,
  },
  metaItem: {
    marginBottom: 12,
  },
  metaInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  metaLabel: {
    fontSize: 12,
    color: '#64748B',
  },
  metaValor: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1E293B',
  },
  metaBarra: {
    height: 6,
    backgroundColor: '#E2E8F0',
    borderRadius: 3,
    overflow: 'hidden',
  },
  metaBarraFill: {
    height: '100%',
    borderRadius: 3,
  },
});