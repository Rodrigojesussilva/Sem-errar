// app/(drawer)/treino/components/AguaTab.tsx
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useState } from 'react';
import {
    Modal,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View
} from 'react-native';

interface AguaData {
  consumido: number;
  meta: number;
  copos: number;
  historico: Array<{
    id: string;
    quantidade: number;
    horario: string;
  }>;
}

interface AguaTabProps {
  aguaData: AguaData;
  onAddCopo: (quantidade: number) => void;
  onReset: () => void;
  onInfoPress: () => void;
}

// Componente do copo de água
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
      case 'small': return '#E3F2FD';
      case 'medium': return '#BBDEFB';
      case 'large': return '#90CAF9';
      default: return '#BBDEFB';
    }
  };

  const getGlassColor = () => {
    switch(size) {
      case 'small': return '#1E88E5';
      case 'medium': return '#1565C0';
      case 'large': return '#0D47A1';
      default: return '#1E88E5';
    }
  };

  return (
    <TouchableOpacity 
      style={styles.glassContainer}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={[
        styles.glassShape,
        { 
          height: getGlassHeight(),
          width: getGlassWidth(),
          borderColor: getGlassColor(),
          backgroundColor: '#F8FAFC'
        }
      ]}>
        <View style={[
          styles.waterFill,
          { 
            backgroundColor: getWaterColor(),
            height: getGlassHeight() * 0.7
          }
        ]}>
          <View style={styles.bubbleContainer}>
            <View style={[styles.bubble, { top: 10, left: 8, width: 6, height: 6 }]} />
            <View style={[styles.bubble, { top: 15, left: 25, width: 8, height: 8 }]} />
            <View style={[styles.bubble, { top: 25, left: 12, width: 5, height: 5 }]} />
            <View style={[styles.bubble, { top: 35, left: 20, width: 7, height: 7 }]} />
          </View>
        </View>
        
        <View style={styles.waterLevelLine} />
        <View style={styles.waterLightReflection} />
      </View>
      
      <View style={[
        styles.glassBase,
        { 
          width: getGlassWidth() + 10,
          backgroundColor: getGlassColor()
        }
      ]} />
      
      <Text style={styles.glassAmount}>+{amount} ml</Text>
      
      <View style={styles.waterDropIcon}>
        <MaterialCommunityIcons name="water" size={size === 'large' ? 20 : size === 'medium' ? 16 : 12} color="#1E88E5" />
      </View>
    </TouchableOpacity>
  );
};

export const AguaTab: React.FC<AguaTabProps> = ({
  aguaData,
  onAddCopo,
  onReset,
  onInfoPress
}) => {
  const [infoModalVisible, setInfoModalVisible] = useState(false);

  const progresso = (aguaData.consumido / aguaData.meta) * 100;

  return (
    <ScrollView style={styles.screenContainer} showsVerticalScrollIndicator={false}>
      
      {/* CARD PRINCIPAL - HIDRATAÇÃO */}
      <LinearGradient
        colors={['#1E88E5', '#0D47A1']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.mainCard}
      >
        <View style={styles.mainCardHeader}>
          <View style={styles.mainCardTitleContainer}>
            <MaterialCommunityIcons name="water" size={24} color="#FFFFFF" />
            <Text style={styles.mainCardTitle}>Hidratação</Text>
          </View>
          <TouchableOpacity style={styles.mainCardInfoButton} onPress={() => setInfoModalVisible(true)}>
            <MaterialIcons name="info-outline" size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        <Text style={styles.mainCardTip}>
          Evite beber água durante as refeições
        </Text>

        <View style={styles.waterProgressContainer}>
          <View style={styles.waterPercentageCircle}>
            <Text style={styles.waterPercentageText}>
              {Math.round(progresso)}%
            </Text>
          </View>

          <View style={styles.waterStats}>
            <View style={styles.waterStat}>
              <Text style={styles.waterStatLabel}>CONSUMO</Text>
              <Text style={styles.waterStatValue}>{aguaData.consumido} ml</Text>
            </View>

            <View style={styles.waterStatDivider} />

            <View style={styles.waterStat}>
              <Text style={styles.waterStatLabel}>META</Text>
              <Text style={styles.waterStatValue}>{aguaData.meta} ml</Text>
            </View>
          </View>
        </View>

        <View style={styles.coposInfo}>
          <MaterialCommunityIcons name="cup-water" size={16} color="#FFFFFF" />
          <Text style={styles.coposInfoText}>
            {aguaData.copos} copos • {Math.round(aguaData.meta / 250)} copos recomendados
          </Text>
        </View>
      </LinearGradient>

      {/* CARD DE ADICIONAR ÁGUA */}
      <View style={styles.addWaterCard}>
        <Text style={styles.addWaterTitle}>Adicionar água:</Text>
        
        <View style={styles.glassesContainer}>
          <WaterGlass 
            amount={150} 
            size="small" 
            onPress={() => onAddCopo(150)} 
          />
          
          <WaterGlass 
            amount={250} 
            size="medium" 
            onPress={() => onAddCopo(250)} 
          />
          
          <WaterGlass 
            amount={500} 
            size="large" 
            onPress={() => onAddCopo(500)} 
          />
        </View>

        <TouchableOpacity 
          style={styles.resetButton}
          onPress={onReset}
        >
          <MaterialIcons name="refresh" size={20} color="#EA4335" />
          <Text style={styles.resetButtonText}>Resetar consumo</Text>
        </TouchableOpacity>
      </View>

      {/* CARD DE HISTÓRICO DE HOJE */}
      <View style={styles.historicoCard}>
        <Text style={styles.historicoTitle}>Consumo de Hoje</Text>

        {aguaData.historico.length > 0 ? (
          <View style={styles.historicoLista}>
            {aguaData.historico.map((item) => (
              <View key={item.id} style={styles.historicoItem}>
                <View style={styles.historicoItemLeft}>
                  <View style={styles.historicoItemIcon}>
                    <MaterialCommunityIcons name="water" size={16} color="#1E88E5" />
                  </View>
                  <View>
                    <Text style={styles.historicoItemQuantidade}>{item.quantidade} ml</Text>
                    <Text style={styles.historicoItemHorario}>{item.horario}</Text>
                  </View>
                </View>
                <MaterialCommunityIcons name="check-circle" size={20} color="#4CAF50" />
              </View>
            ))}
          </View>
        ) : (
          <View style={styles.emptyHistorico}>
            <MaterialCommunityIcons name="water-off" size={40} color="#CBD5E1" />
            <Text style={styles.emptyHistoricoText}>
              Nenhum consumo registrado hoje
            </Text>
          </View>
        )}
      </View>

      {/* CARD DE BENEFÍCIOS */}
      <View style={styles.beneficiosCard}>
        <Text style={styles.beneficiosTitle}>Benefícios da Hidratação</Text>
        
        <View style={styles.beneficioItem}>
          <MaterialCommunityIcons name="flash" size={20} color="#1E88E5" />
          <Text style={styles.beneficioText}>Aumenta a energia e disposição</Text>
        </View>
        
        <View style={styles.beneficioItem}>
          <MaterialCommunityIcons name="brain" size={20} color="#1E88E5" />
          <Text style={styles.beneficioText}>Melhora a concentração</Text>
        </View>
        
        <View style={styles.beneficioItem}>
          <MaterialCommunityIcons name="food-apple" size={20} color="#1E88E5" />
          <Text style={styles.beneficioText}>Auxilia na digestão</Text>
        </View>
        
        <View style={styles.beneficioItem}>
          <MaterialCommunityIcons name="arm-flex" size={20} color="#1E88E5" />
          <Text style={styles.beneficioText}>Melhora a performance nos treinos</Text>
        </View>
        
        <View style={styles.beneficioItem}>
          <MaterialCommunityIcons name="human" size={20} color="#1E88E5" />
          <Text style={styles.beneficioText}>Mantém a pele saudável</Text>
        </View>
      </View>

      {/* MODAL DE INFORMAÇÕES */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={infoModalVisible}
        onRequestClose={() => setInfoModalVisible(false)}
      >
        <TouchableWithoutFeedback onPress={() => setInfoModalVisible(false)}>
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
                  style={styles.modalButton}
                  onPress={() => setInfoModalVisible(false)}
                >
                  <Text style={styles.modalButtonText}>Entendi</Text>
                </TouchableOpacity>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
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
    shadowColor: '#1E88E5',
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
  mainCardInfoButton: {
    padding: 4,
  },
  mainCardTip: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
    fontStyle: 'italic',
    textAlign: 'center',
    marginBottom: 24,
    paddingHorizontal: 12,
    backgroundColor: 'rgba(255,255,255,0.1)',
    paddingVertical: 10,
    borderRadius: 10,
    borderLeftWidth: 3,
    borderLeftColor: '#FFFFFF',
  },
  waterProgressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  waterPercentageCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: '#FFFFFF',
  },
  waterPercentageText: {
    fontSize: 28,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  waterStats: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginLeft: 16,
  },
  waterStat: {
    alignItems: 'center',
  },
  waterStatLabel: {
    fontSize: 10,
    color: 'rgba(255,255,255,0.7)',
    fontWeight: '700',
    marginBottom: 4,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  waterStatValue: {
    fontSize: 22,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  waterStatDivider: {
    width: 1,
    height: 40,
    backgroundColor: 'rgba(255,255,255,0.3)',
  },
  coposInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.2)',
  },
  coposInfoText: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
  },
  addWaterCard: {
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
  addWaterTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 20,
    textAlign: 'center',
  },
  glassesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    marginBottom: 20,
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
    borderWidth: 1,
    borderColor: '#FFCDD2',
  },
  resetButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#EA4335',
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
  historicoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 16,
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
    backgroundColor: '#E3F2FD',
    justifyContent: 'center',
    alignItems: 'center',
  },
  historicoItemQuantidade: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1E293B',
  },
  historicoItemHorario: {
    fontSize: 11,
    color: '#94A3B8',
  },
  emptyHistorico: {
    alignItems: 'center',
    padding: 20,
  },
  emptyHistoricoText: {
    fontSize: 14,
    color: '#94A3B8',
    marginTop: 8,
  },
  beneficiosCard: {
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
  beneficiosTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 12,
  },
  beneficioItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 8,
  },
  beneficioText: {
    fontSize: 14,
    color: '#334155',
    flex: 1,
  },
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
  modalButton: {
    backgroundColor: '#1E88E5',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 8,
  },
  modalButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});