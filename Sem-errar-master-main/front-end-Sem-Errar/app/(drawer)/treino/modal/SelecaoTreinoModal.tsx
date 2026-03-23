// app/(drawer)/treino/modals/SelecaoTreinoModal.tsx
import { Feather, FontAwesome5 } from '@expo/vector-icons';
import React from 'react';
import {
    FlatList,
    Modal,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';

interface TreinoItem {
  id: string;
  tipo: string;
  diasSemana: number;
  dia: number;
  observacao: string;
  exercicios: string[];
}

interface SelecaoTreinoModalProps {
  visible: boolean;
  onClose: () => void;
  treinos: TreinoItem[];
  tempTreino: TreinoItem | null;
  onSelectTreino: (treino: TreinoItem) => void;
  onAplicar: () => void;
}

export const SelecaoTreinoModal: React.FC<SelecaoTreinoModalProps> = ({
  visible,
  onClose,
  treinos,
  tempTreino,
  onSelectTreino,
  onAplicar
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
            <Text style={styles.modalTitulo}>Escolha seu treino</Text>
            <TouchableOpacity
              onPress={onClose}
              style={styles.modalCloseButton}
            >
              <Feather name="x" size={24} color="#64748B" />
            </TouchableOpacity>
          </View>

          <FlatList
            data={treinos}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[
                  styles.treinoItem,
                  tempTreino?.id === item.id && styles.treinoItemSelecionado
                ]}
                onPress={() => onSelectTreino(item)}
                activeOpacity={0.7}
              >
                <View style={styles.treinoItemHeader}>
                  <FontAwesome5 name="dumbbell" size={14} color="#1E88E5" />
                  <Text style={styles.treinoItemTipo}>{item.tipo}</Text>
                  <View style={styles.treinoItemBadge}>
                    <Text style={styles.treinoItemBadgeTexto}>{item.diasSemana}d • dia {item.dia}</Text>
                  </View>
                </View>
                
                <Text style={styles.treinoItemObs}>{item.observacao}</Text>
                
                <View style={styles.treinoItemExercicios}>
                  {item.exercicios.slice(0, 3).map((ex: string, idx: number) => (
                    <Text key={idx} style={styles.treinoItemExercicio}>• {ex}</Text>
                  ))}
                  {item.exercicios.length > 3 && (
                    <Text style={styles.treinoItemMais}>+{item.exercicios.length - 3}</Text>
                  )}
                </View>

                {tempTreino?.id === item.id && (
                  <View style={styles.treinoItemCheck}>
                    <Feather name="check-circle" size={18} color="#4CAF50" />
                  </View>
                )}
              </TouchableOpacity>
            )}
            contentContainerStyle={styles.modalLista}
          />

          <View style={styles.modalFooter}>
            <TouchableOpacity
              style={[
                styles.aplicarButton,
                !tempTreino && styles.aplicarButtonDisabled
              ]}
              onPress={onAplicar}
              disabled={!tempTreino}
            >
              <Text style={styles.aplicarButtonTexto}>
                {tempTreino ? 'Carregar Treino' : 'Selecione um treino'}
              </Text>
            </TouchableOpacity>
          </View>
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
  modalTitulo: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1E293B',
  },
  modalCloseButton: {
    padding: 4,
  },
  modalLista: {
    padding: 16,
    gap: 8,
  },
  modalFooter: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
  },
  aplicarButton: {
    backgroundColor: '#1E88E5',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  aplicarButtonDisabled: {
    backgroundColor: '#94A3B8',
    opacity: 0.5,
  },
  aplicarButtonTexto: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  treinoItem: {
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    position: 'relative',
  },
  treinoItemSelecionado: {
    borderColor: '#1E88E5',
    borderWidth: 2,
    backgroundColor: '#F0F9FF',
  },
  treinoItemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
    flexWrap: 'wrap',
    gap: 6,
  },
  treinoItemTipo: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1E293B',
    flex: 1,
  },
  treinoItemBadge: {
    backgroundColor: '#E3F2FD',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
  },
  treinoItemBadgeTexto: {
    fontSize: 10,
    fontWeight: '600',
    color: '#1E88E5',
  },
  treinoItemObs: {
    fontSize: 12,
    color: '#64748B',
    marginBottom: 6,
  },
  treinoItemExercicios: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: 4,
  },
  treinoItemExercicio: {
    fontSize: 12,
    color: '#1E293B',
  },
  treinoItemMais: {
    fontSize: 11,
    color: '#1E88E5',
    fontWeight: '500',
  },
  treinoItemCheck: {
    position: 'absolute',
    top: 14,
    right: 14,
  },
});