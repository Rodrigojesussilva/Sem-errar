
// app/(drawer)/treino/modals/DesafioInfoModal.tsx
import { Feather } from '@expo/vector-icons';
import React from 'react';
import {
    Modal,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';

interface DesafioInfoModalProps {
  visible: boolean;
  onClose: () => void;
  diasSequenciais: number;
  recordeDias: number;
}

export const DesafioInfoModal: React.FC<DesafioInfoModalProps> = ({
  visible,
  onClose,
  diasSequenciais,
  recordeDias
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
            <Text style={styles.modalTitulo}>Sequência Atual</Text>
            <TouchableOpacity
              onPress={onClose}
              style={styles.modalCloseButton}
            >
              <Feather name="x" size={24} color="#64748B" />
            </TouchableOpacity>
          </View>
          <View style={styles.modalBody}>
            <View style={styles.modalStreakInfo}>
              <View style={styles.modalStreakItem}>
                <Text style={styles.modalStreakValue}>{diasSequenciais}</Text>
                <Text style={styles.modalStreakLabel}>dias atuais</Text>
              </View>
              <View style={styles.modalStreakDivider} />
              <View style={styles.modalStreakItem}>
                <Text style={styles.modalStreakValue}>{recordeDias}</Text>
                <Text style={styles.modalStreakLabel}>recorde</Text>
              </View>
            </View>
            <Text style={styles.modalText}>
              Parabéns! Você está mantendo uma sequência consistente. Continue assim para bater seu recorde pessoal!
            </Text>
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
  modalBody: {
    padding: 24,
    minHeight: 200,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalStreakInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 20,
  },
  modalStreakItem: {
    alignItems: 'center',
  },
  modalStreakValue: {
    fontSize: 48,
    fontWeight: '800',
    color: '#1E293B',
  },
  modalStreakLabel: {
    fontSize: 14,
    color: '#64748B',
    fontWeight: '500',
  },
  modalStreakDivider: {
    width: 1,
    height: 40,
    backgroundColor: '#E2E8F0',
  },
  modalText: {
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 20,
  },
});