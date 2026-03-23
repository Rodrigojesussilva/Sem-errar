// app/(drawer)/treino/modals/CaloriasModal.tsx
import { Feather, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import {
    Modal,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { CategoriaRefeicao } from '../types';

interface CaloriasModalProps {
  visible: boolean;
  onClose: () => void;
  caloriasData: {
    consumidas: number;
    meta: number;
  };
  progressoCalorias: number;
  categoriasRefeicao: CategoriaRefeicao[];
  onCategoriaPress: (id: string) => void;
  onCriarRefeicoesPress: () => void;
}

export const CaloriasModal: React.FC<CaloriasModalProps> = ({
  visible,
  onClose,
  caloriasData,
  progressoCalorias,
  categoriasRefeicao,
  onCategoriaPress,
  onCriarRefeicoesPress
}) => {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <View style={styles.modalTitleContainer}>
              <LinearGradient
                colors={['#F39C12', '#E67E22']}
                style={styles.modalIconGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <MaterialCommunityIcons name="fire" size={24} color="#FFFFFF" />
              </LinearGradient>
              <Text style={styles.modalTitulo}>Registro de Calorias</Text>
            </View>
            <TouchableOpacity
              onPress={onClose}
              style={styles.modalCloseButton}
            >
              <Feather name="x" size={24} color="#64748B" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalScrollView}>
            {/* Resumo do dia */}
            <View style={styles.caloriasResumo}>
              <View style={styles.caloriasResumoItem}>
                <Text style={styles.caloriasResumoLabel}>Consumidas</Text>
                <Text style={styles.caloriasResumoValue}>{caloriasData.consumidas} kcal</Text>
              </View>
              <View style={styles.caloriasResumoDivider} />
              <View style={styles.caloriasResumoItem}>
                <Text style={styles.caloriasResumoLabel}>Meta</Text>
                <Text style={styles.caloriasResumoValue}>{caloriasData.meta} kcal</Text>
              </View>
              <View style={styles.caloriasResumoDivider} />
              <View style={styles.caloriasResumoItem}>
                <Text style={styles.caloriasResumoLabel}>Restantes</Text>
                <Text style={[styles.caloriasResumoValue, { color: caloriasData.meta - caloriasData.consumidas > 0 ? '#27AE60' : '#EA4335' }]}>
                  {caloriasData.meta - caloriasData.consumidas} kcal
                </Text>
              </View>
            </View>

            {/* Barra de progresso grande */}
            <View style={styles.caloriasProgressoGrande}>
              <View style={styles.caloriasProgressBarGrande}>
                <View
                  style={[
                    styles.caloriasProgressFillGrande,
                    { width: `${Math.min(progressoCalorias, 100)}%` }
                  ]}
                />
              </View>
              <Text style={styles.caloriasProgressoTexto}>
                {Math.round(progressoCalorias)}% da meta diária
              </Text>
            </View>

            {/* Lista de categorias de refeição no modal */}
            <View style={styles.categoriasRefeicaoModal}>
              <Text style={styles.categoriasRefeicaoTitulo}>Refeições do Dia</Text>
              {categoriasRefeicao.map(categoria => (
                <TouchableOpacity
                  key={categoria.id}
                  style={styles.categoriaModalItem}
                  onPress={() => {
                    onCategoriaPress(categoria.id);
                  }}
                >
                  <View style={[styles.categoriaIcon, { backgroundColor: `${categoria.color}15` }]}>
                    <MaterialCommunityIcons name={categoria.icon as any} size={20} color={categoria.color} />
                  </View>
                  <View style={styles.categoriaInfo}>
                    <Text style={styles.categoriaNome}>{categoria.nome}</Text>
                    {categoria.refeicoes.map(refeicao => (
                      <Text key={refeicao.id} style={styles.categoriaRefeicaoItemText}>
                        • {refeicao.nome} - {refeicao.calorias} kcal
                      </Text>
                    ))}
                  </View>
                  <MaterialIcons name="chevron-right" size={20} color="#94A3B8" />
                </TouchableOpacity>
              ))}
            </View>

            {/* Botão para criar refeições pré-programadas */}
            <TouchableOpacity
              style={styles.criarRefeicoesButton}
              onPress={onCriarRefeicoesPress}
            >
              <LinearGradient
                colors={['#1E88E5', '#8E44AD']}
                style={styles.criarRefeicoesGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <MaterialIcons name="restaurant-menu" size={24} color="#FFFFFF" />
                <Text style={styles.criarRefeicoesText}>CRIAR REFEIÇÕES PRÉ PROGRAMADAS</Text>
              </LinearGradient>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  modalTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  modalIconGradient: {
    width: 42,
    height: 42,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalTitulo: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1E293B',
  },
  modalCloseButton: {
    padding: 4,
  },
  modalScrollView: {
    maxHeight: '70%',
  },
  caloriasResumo: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#F8FAFC',
    margin: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  caloriasResumoItem: {
    alignItems: 'center',
  },
  caloriasResumoLabel: {
    fontSize: 12,
    color: '#64748B',
    marginBottom: 4,
  },
  caloriasResumoValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1E293B',
  },
  caloriasResumoDivider: {
    width: 1,
    height: 30,
    backgroundColor: '#E2E8F0',
  },
  caloriasProgressoGrande: {
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  caloriasProgressBarGrande: {
    height: 12,
    backgroundColor: '#E2E8F0',
    borderRadius: 6,
    overflow: 'hidden',
    marginBottom: 8,
  },
  caloriasProgressFillGrande: {
    height: '100%',
    backgroundColor: '#F39C12',
    borderRadius: 6,
  },
  caloriasProgressoTexto: {
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
  },
  categoriasRefeicaoModal: {
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  categoriasRefeicaoTitulo: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 16,
  },
  categoriaModalItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  categoriaIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  categoriaInfo: {
    flex: 1,
  },
  categoriaNome: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 2,
  },
  categoriaRefeicaoItemText: {
    fontSize: 12,
    color: '#64748B',
    marginLeft: 8,
    marginTop: 2,
  },
  criarRefeicoesButton: {
    marginHorizontal: 16,
    marginBottom: 30,
    borderRadius: 16,
    overflow: 'hidden',
  },
  criarRefeicoesGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    gap: 12,
  },
  criarRefeicoesText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
});