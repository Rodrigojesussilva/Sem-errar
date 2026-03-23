// app/(drawer)/treino/modals/AlimentoModal.tsx
import { Feather, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
    FlatList,
    Modal,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';

interface AlimentoModalProps {
  visible: boolean;
  onClose: () => void;
  categoriaNome: string;
  categoriaIcon: string;
  categoriaCor: string;
  alimentos: Array<{
    id: string;
    nome: string;
    calorias: number;
    porcao: string;
  }>;
}

export const AlimentoModal: React.FC<AlimentoModalProps> = ({
  visible,
  onClose,
  categoriaNome,
  categoriaIcon,
  categoriaCor,
  alimentos
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredAlimentos = alimentos.filter(alimento => 
    alimento.nome.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
              <MaterialCommunityIcons 
                name={categoriaIcon as any} 
                size={24} 
                color={categoriaCor} 
              />
              <Text style={styles.modalTitulo}>{categoriaNome}</Text>
            </View>
            <View style={styles.modalHeaderRight}>
              <Text style={styles.modalData}>
                {new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'numeric' }).replace('-feira', '')}
              </Text>
              <TouchableOpacity
                onPress={onClose}
                style={styles.modalCloseButton}
              >
                <Feather name="x" size={24} color="#64748B" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Abas */}
          <View style={styles.tabsContainer}>
            <TouchableOpacity style={[styles.tab, styles.tabActive]}>
              <Text style={[styles.tabText, styles.tabTextActive]}>RECEITAS</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.tab}>
              <Text style={styles.tabText}>ALIMENTO</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.tab}>
              <Text style={styles.tabText}>CONSUMIDOS REC</Text>
            </TouchableOpacity>
          </View>

          {/* Barra de pesquisa */}
          <View style={styles.searchContainer}>
            <MaterialIcons name="search" size={20} color="#94A3B8" />
            <TextInput
              style={styles.searchInput}
              placeholder="Pesquisar Alimento"
              placeholderTextColor="#94A3B8"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>

          {/* Lista de alimentos */}
          <FlatList
            data={filteredAlimentos}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity style={styles.alimentoItem}>
                <View style={styles.alimentoInfo}>
                  <Text style={styles.alimentoNome}>{item.nome}</Text>
                  <Text style={styles.alimentoPorcao}>{item.porcao}</Text>
                </View>
                <Text style={styles.alimentoCalorias}>{item.calorias} kcal</Text>
              </TouchableOpacity>
            )}
            contentContainerStyle={styles.alimentosLista}
          />
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
  modalTitulo: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1E293B',
  },
  modalHeaderRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  modalData: {
    fontSize: 14,
    color: '#64748B',
  },
  modalCloseButton: {
    padding: 4,
  },
  tabsContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    paddingHorizontal: 16,
  },
  tab: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginRight: 8,
  },
  tabActive: {
    borderBottomWidth: 2,
    borderBottomColor: '#1E88E5',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#94A3B8',
  },
  tabTextActive: {
    color: '#1E88E5',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    margin: 16,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  searchInput: {
    flex: 1,
    height: 48,
    marginLeft: 8,
    fontSize: 16,
    color: '#1E293B',
  },
  alimentosLista: {
    paddingHorizontal: 16,
    paddingBottom: 30,
  },
  alimentoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  alimentoInfo: {
    flex: 1,
  },
  alimentoNome: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1E293B',
    marginBottom: 2,
  },
  alimentoPorcao: {
    fontSize: 12,
    color: '#94A3B8',
  },
  alimentoCalorias: {
    fontSize: 16,
    fontWeight: '600',
    color: '#F39C12',
  },
});