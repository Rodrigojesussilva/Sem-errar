// app/(drawer)/treino/components/NutricaoTab.tsx
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRealTimeTranscription } from 'expo-speech-transcriber';
import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Modal,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { AlimentoData, buscarAlimentos } from '../data/alimentos';
import { Alimento, CategoriaRefeicao } from '../types';

interface NutricaoTabProps {
  caloriasData: {
    consumidas: number;
    meta: number;
    proteinas: number;
    metaProteinas: number;
    carboidratos: number;
    metaCarboidratos: number;
    gorduras: number;
    metaGorduras: number;
  };
  progressoCalorias: number;
  progressoProteinas: number;
  progressoCarboidratos: number;
  progressoGorduras: number;
  categoriasRefeicao: CategoriaRefeicao[];
  onPersonalizarPress: () => void;
}

export const NutricaoTab: React.FC<NutricaoTabProps> = ({
  caloriasData,
  progressoCalorias,
  progressoProteinas,
  progressoCarboidratos,
  progressoGorduras,
  categoriasRefeicao,
  onPersonalizarPress
}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [searchResults, setSearchResults] = useState<AlimentoData[]>([]);
  const [categoriaSelecionada, setCategoriaSelecionada] = useState<CategoriaRefeicao | null>(null);
  const [alimentosAdicionados, setAlimentosAdicionados] = useState<Alimento[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  
  // Estados para reconhecimento de voz
  const [recognizedText, setRecognizedText] = useState('');
  const [voiceResults, setVoiceResults] = useState<string[]>([]);
  const [isProcessingVoice, setIsProcessingVoice] = useState(false);

  // Hook do expo-speech-transcriber para transcrição em tempo real
  const {
    state,
    error,
    startTranscription,
    stopTranscription,
    isTranscribing,
    hasPermissions,
    requestPermissions
  } = useRealTimeTranscription({
    locale: 'pt-BR',
    onTranscription: (transcription) => {
      console.log('Transcrição parcial:', transcription);
      setRecognizedText(transcription);
    },
    onTranscriptionComplete: (finalText) => {
      console.log('Transcrição final:', finalText);
      setVoiceResults(prev => [...prev, finalText]);
      processVoiceInput(finalText);
    }
  });

  // Verificar e solicitar permissões ao abrir o modal
  useEffect(() => {
    if (modalVisible && !hasPermissions) {
      requestPermissions();
    }
  }, [modalVisible, hasPermissions]);

  const startListening = useCallback(async () => {
    try {
      console.log('Iniciando reconhecimento de voz...');
      setVoiceResults([]);
      setRecognizedText('');
      setSearchResults([]);
      
      await startTranscription();
      
    } catch (error: any) {
      console.error('Erro ao iniciar reconhecimento de voz:', error);
      
      let errorMessage = 'Não foi possível iniciar o reconhecimento de voz.';
      
      if (error?.message) {
        if (error.message.includes('permission')) {
          errorMessage = 'Permissão de microfone negada.';
        }
      }
      
      Alert.alert('Erro', errorMessage);
    }
  }, [startTranscription]);

  const stopListening = useCallback(async () => {
    try {
      console.log('Parando reconhecimento de voz...');
      await stopTranscription();
    } catch (error) {
      console.error('Erro ao parar reconhecimento de voz:', error);
    }
  }, [stopTranscription]);

  const processVoiceInput = useCallback((text: string) => {
    setIsProcessingVoice(true);
    
    // Limpar o texto e dividir em palavras-chave
    const palavras = text.toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^\w\s]/g, ' ')
      .split(' ')
      .filter(p => p.length > 2);

    console.log('Palavras extraídas:', palavras);

    // Buscar alimentos que correspondam às palavras faladas
    const resultados: AlimentoData[] = [];
    const idsAdicionados = new Set();

    palavras.forEach(palavra => {
      const matches = buscarAlimentos(palavra);
      matches.forEach(alimento => {
        if (!idsAdicionados.has(alimento.id)) {
          idsAdicionados.add(alimento.id);
          resultados.push(alimento);
        }
      });
    });

    // Se não encontrou nada, tenta buscar com a frase completa
    if (resultados.length === 0) {
      const matches = buscarAlimentos(text);
      resultados.push(...matches);
    }

    setSearchResults(resultados.slice(0, 10));
    setIsProcessingVoice(false);

    if (resultados.length === 0) {
      Alert.alert(
        'Nenhum alimento encontrado',
        'Não encontramos alimentos correspondentes ao que você falou. Tente ser mais específico ou digite o nome do alimento.'
      );
    }
  }, []);

  // Efeito para buscar alimentos quando o texto muda
  useEffect(() => {
    if (searchText.trim().length > 1) {
      setIsSearching(true);
      const timeoutId = setTimeout(() => {
        const results = buscarAlimentos(searchText);
        setSearchResults(results);
        setIsSearching(false);
      }, 300);
      
      return () => clearTimeout(timeoutId);
    } else {
      setSearchResults([]);
    }
  }, [searchText]);

  const handleCategoriaPress = (categoriaId: string) => {
    const categoria = categoriasRefeicao.find(c => c.id === categoriaId);
    if (categoria) {
      setCategoriaSelecionada(categoria);
      setSearchText('');
      setSearchResults([]);
      setAlimentosAdicionados([]);
      setRecognizedText('');
      setVoiceResults([]);
      setModalVisible(true);
    }
  };

  const handleAddAlimento = (alimento: AlimentoData) => {
    const novoAlimento: Alimento = {
      id: Date.now().toString(),
      nome: alimento.nome,
      quantidade: alimento.quantidade,
      calorias: alimento.calorias,
    };

    setAlimentosAdicionados([...alimentosAdicionados, novoAlimento]);
    
    // Limpar resultados e texto após adicionar
    setSearchText('');
    setSearchResults([]);
    setRecognizedText('');
    setVoiceResults([]);
  };

  const handleAddAllVoiceResults = () => {
    if (searchResults.length > 0) {
      const novosAlimentos = searchResults.map(alimento => ({
        id: Date.now().toString() + alimento.id,
        nome: alimento.nome,
        quantidade: alimento.quantidade,
        calorias: alimento.calorias,
      }));
      
      setAlimentosAdicionados([...alimentosAdicionados, ...novosAlimentos]);
      
      // Limpar resultados
      setSearchResults([]);
      setRecognizedText('');
      setVoiceResults([]);
      
      Alert.alert('Sucesso', `${novosAlimentos.length} alimentos adicionados!`);
    }
  };

  const renderAlimentoConsumido = (alimento: Alimento, index: number) => {
    return (
      <View key={alimento.id || index} style={styles.alimentoConsumidoItem}>
        <View style={styles.alimentoConsumidoInfo}>
          <Text style={styles.alimentoConsumidoNome}>{alimento.nome}</Text>
          <View style={styles.alimentoConsumidoDetalhes}>
            <Text style={styles.alimentoConsumidoQuantidade}>{alimento.quantidade}</Text>
            <Text style={styles.alimentoConsumidoCalorias}>{alimento.calorias} kcal</Text>
          </View>
        </View>
        <TouchableOpacity 
          style={styles.removeButton}
          onPress={() => {
            const novosAlimentos = alimentosAdicionados.filter((_, i) => i !== index);
            setAlimentosAdicionados(novosAlimentos);
          }}
        >
          <MaterialIcons name="close" size={18} color="#EF4444" />
        </TouchableOpacity>
      </View>
    );
  };

  const renderSearchResult = ({ item }: { item: AlimentoData }) => (
    <TouchableOpacity 
      style={styles.searchResultItem}
      onPress={() => handleAddAlimento(item)}
    >
      <View style={styles.searchResultInfo}>
        <Text style={styles.searchResultNome}>{item.nome}</Text>
        <Text style={styles.searchResultQuantidade}>{item.quantidade}</Text>
      </View>
      <View style={styles.searchResultCalorias}>
        <Text style={styles.searchResultCaloriasValue}>{item.calorias}</Text>
        <Text style={styles.searchResultCaloriasUnit}>kcal</Text>
      </View>
    </TouchableOpacity>
  );

  const renderVoiceResult = (text: string, index: number) => (
    <TouchableOpacity 
      key={index}
      style={styles.voiceResultItem}
      onPress={() => processVoiceInput(text)}
    >
      <MaterialIcons name="mic" size={20} color="#1E88E5" />
      <Text style={styles.voiceResultText}>{text}</Text>
    </TouchableOpacity>
  );

  const renderCategoriaRefeicao = (categoria: CategoriaRefeicao) => {
    const totalCalorias = categoria.refeicoes.reduce((sum, r) => sum + r.calorias, 0);
    const totalItens = categoria.refeicoes.length;

    return (
      <TouchableOpacity
        key={categoria.id}
        style={styles.categoriaRefeicaoContainer}
        onPress={() => handleCategoriaPress(categoria.id)}
        activeOpacity={0.7}
      >
        <View style={[styles.categoriaIcon, { backgroundColor: `${categoria.color}15` }]}>
          <MaterialCommunityIcons name={categoria.icon as any} size={20} color={categoria.color} />
        </View>
        <View style={styles.categoriaInfo}>
          <Text style={styles.categoriaNome}>{categoria.nome}</Text>
          {totalItens > 0 ? (
            <Text style={styles.categoriaDetalhes}>
              {totalItens} {totalItens === 1 ? 'refeição' : 'refeições'} • {totalCalorias} kcal
            </Text>
          ) : (
            <Text style={styles.categoriaDetalhes}>Nenhuma refeição</Text>
          )}
        </View>
        <MaterialIcons name="chevron-right" size={20} color="#94A3B8" />
      </TouchableOpacity>
    );
  };

  // Determinar o texto do botão de voz
  const getVoiceButtonText = () => {
    if (isTranscribing) return 'Parar';
    if (!hasPermissions) return 'Permitir microfone';
    return 'Falar';
  };

  return (
    <>
      <ScrollView style={styles.screenContainer} showsVerticalScrollIndicator={false}>
        {/* Card de Calorias */}
        <View style={styles.caloriasCard}>
          <View style={styles.caloriasHeader}>
            <View style={styles.caloriasTitleContainer}>
              <LinearGradient
                colors={['#F39C12', '#E67E22']}
                style={styles.caloriasIconGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <MaterialCommunityIcons name="fire" size={20} color="#FFFFFF" />
              </LinearGradient>
              <Text style={styles.caloriasTitle}>Nutrição Hoje</Text>
            </View>
            <View style={styles.caloriasValueContainer}>
              <Text style={styles.caloriasCurrent}>{caloriasData.consumidas}</Text>
              <Text style={styles.caloriasSeparator}>/</Text>
              <Text style={styles.caloriasTotal}>{caloriasData.meta}</Text>
              <Text style={styles.caloriasUnit}>kcal</Text>
            </View>
          </View>

          <View style={styles.caloriasProgressContainer}>
            <View style={styles.caloriasProgressBar}>
              <View
                style={[
                  styles.caloriasProgressFill,
                  { width: `${Math.min(progressoCalorias, 100)}%` }
                ]}
              />
            </View>
            <Text style={styles.caloriasProgressText}>
              {Math.round(progressoCalorias)}% da meta diária
            </Text>
          </View>

          <View style={styles.macrosRow}>
            <View style={styles.macroItem}>
              <Text style={styles.macroLabel}>Proteínas</Text>
              <View style={styles.macroValueRow}>
                <Text style={styles.macroValue}>{caloriasData.proteinas}</Text>
                <Text style={styles.macroSeparator}>/</Text>
                <Text style={styles.macroTarget}>{caloriasData.metaProteinas}g</Text>
              </View>
              <View style={styles.macroProgressBar}>
                <View
                  style={[
                    styles.macroProgressFill,
                    { width: `${Math.min(progressoProteinas, 100)}%`, backgroundColor: '#27AE60' }
                  ]}
                />
              </View>
            </View>

            <View style={styles.macroItem}>
              <Text style={styles.macroLabel}>Carboidratos</Text>
              <View style={styles.macroValueRow}>
                <Text style={styles.macroValue}>{caloriasData.carboidratos}</Text>
                <Text style={styles.macroSeparator}>/</Text>
                <Text style={styles.macroTarget}>{caloriasData.metaCarboidratos}g</Text>
              </View>
              <View style={styles.macroProgressBar}>
                <View
                  style={[
                    styles.macroProgressFill,
                    { width: `${Math.min(progressoCarboidratos, 100)}%`, backgroundColor: '#3498DB' }
                  ]}
                />
              </View>
            </View>

            <View style={styles.macroItem}>
              <Text style={styles.macroLabel}>Gorduras</Text>
              <View style={styles.macroValueRow}>
                <Text style={styles.macroValue}>{caloriasData.gorduras}</Text>
                <Text style={styles.macroSeparator}>/</Text>
                <Text style={styles.macroTarget}>{caloriasData.metaGorduras}g</Text>
              </View>
              <View style={styles.macroProgressBar}>
                <View
                  style={[
                    styles.macroProgressFill,
                    { width: `${Math.min(progressoGorduras, 100)}%`, backgroundColor: '#F39C12' }
                  ]}
                />
              </View>
            </View>
          </View>
        </View>

        <View style={styles.categoriasRefeicao}>
          {categoriasRefeicao.map((categoria) => renderCategoriaRefeicao(categoria))}
          
          <TouchableOpacity 
            style={styles.personalizarButton}
            onPress={onPersonalizarPress}
          >
            <MaterialIcons name="settings" size={18} color="#1E88E5" />
            <Text style={styles.personalizarButtonText}>Personalizar Refeições</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <Modal
        visible={modalVisible}
        animationType="slide"
        onRequestClose={() => {
          setModalVisible(false);
          setCategoriaSelecionada(null);
          setSearchText('');
          setSearchResults([]);
          setAlimentosAdicionados([]);
          setRecognizedText('');
          setVoiceResults([]);
          if (isTranscribing) stopTranscription();
        }}
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity 
              onPress={() => {
                setModalVisible(false);
                setCategoriaSelecionada(null);
                setSearchText('');
                setSearchResults([]);
                setAlimentosAdicionados([]);
                setRecognizedText('');
                setVoiceResults([]);
                if (isTranscribing) stopTranscription();
              }}
              style={styles.modalBackButton}
            >
              <MaterialIcons name="arrow-back" size={24} color="#1E293B" />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>{categoriaSelecionada?.nome}</Text>
            <View style={{ width: 40 }} />
          </View>

          <View style={styles.modalContent}>
            {/* Lista de alimentos adicionados */}
            <ScrollView 
              style={styles.alimentosList} 
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.alimentosListContent}
            >
              {alimentosAdicionados.length > 0 ? (
                alimentosAdicionados.map((alimento, index) => renderAlimentoConsumido(alimento, index))
              ) : (
                <View style={styles.emptyStateContainer}>
                  <MaterialCommunityIcons name="food-apple-outline" size={48} color="#CBD5E1" />
                  <Text style={styles.emptyStateText}>Nenhum alimento adicionado</Text>
                  <Text style={styles.emptyStateSubtext}>
                    Use os botões abaixo para buscar alimentos por texto ou voz
                  </Text>
                </View>
              )}
            </ScrollView>

            {/* Área de busca */}
            <View style={styles.buscaContainer}>
              {/* Botões de ação */}
              <View style={styles.actionButtonsRow}>
                <TouchableOpacity 
                  style={[styles.actionButton, styles.textSearchButton]}
                  onPress={() => {
                    setSearchText('');
                    setSearchResults([]);
                    setRecognizedText('');
                  }}
                >
                  <MaterialIcons name="keyboard" size={20} color="#1E88E5" />
                  <Text style={styles.actionButtonText}>Digitar</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                  style={[
                    styles.actionButton, 
                    styles.voiceSearchButton, 
                    isTranscribing && styles.listeningButton,
                    !hasPermissions && styles.permissionButton
                  ]}
                  onPress={() => {
                    if (!hasPermissions) {
                      requestPermissions();
                    } else if (isTranscribing) {
                      stopTranscription();
                    } else {
                      startListening();
                    }
                  }}
                >
                  <MaterialIcons 
                    name={
                      !hasPermissions ? "mic-off" :
                      isTranscribing ? "stop" : "mic"
                    } 
                    size={20} 
                    color={
                      !hasPermissions ? "#FFA500" :
                      isTranscribing ? "#EF4444" : "#1E88E5"
                    } 
                  />
                  <Text style={[
                    styles.actionButtonText, 
                    isTranscribing && styles.listeningText,
                    !hasPermissions && styles.permissionText
                  ]}>
                    {getVoiceButtonText()}
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Campo de texto ou indicador de voz */}
              {isTranscribing ? (
                <View style={styles.listeningContainer}>
                  <ActivityIndicator size="large" color="#1E88E5" />
                  <Text style={styles.listeningText}>Ouvindo... {recognizedText || 'fale algo'}</Text>
                  <TouchableOpacity style={styles.cancelButton} onPress={stopTranscription}>
                    <Text style={styles.cancelButtonText}>Cancelar</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <>
                  <View style={styles.searchBox}>
                    <MaterialIcons name="search" size={20} color="#94A3B8" style={styles.searchIcon} />
                    <TextInput
                      style={styles.searchInput}
                      placeholder="Digite o nome do alimento..."
                      placeholderTextColor="#94A3B8"
                      value={searchText}
                      onChangeText={setSearchText}
                      returnKeyType="search"
                    />
                    {searchText.length > 0 && (
                      <TouchableOpacity onPress={() => setSearchText('')} style={styles.clearButton}>
                        <MaterialIcons name="close" size={20} color="#94A3B8" />
                      </TouchableOpacity>
                    )}
                  </View>
                </>
              )}

              {/* Resultados da voz */}
              {voiceResults.length > 0 && (
                <View style={styles.voiceResultsContainer}>
                  <Text style={styles.voiceResultsTitle}>Resultados da voz:</Text>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.voiceResultsScroll}>
                    {voiceResults.map((text, index) => renderVoiceResult(text, index))}
                  </ScrollView>
                </View>
              )}

              {/* Resultados da busca por texto ou voz processada */}
              {isProcessingVoice ? (
                <View style={styles.loadingContainer}>
                  <ActivityIndicator size="small" color="#1E88E5" />
                  <Text style={styles.loadingText}>Processando sua fala...</Text>
                </View>
              ) : searchResults.length > 0 ? (
                <View style={styles.searchResultsContainer}>
                  <View style={styles.searchResultsHeader}>
                    <Text style={styles.searchResultsTitle}>
                      {recognizedText ? `Resultados para: "${recognizedText}"` : 'Resultados encontrados:'}
                    </Text>
                    {recognizedText && searchResults.length > 1 && (
                      <TouchableOpacity onPress={handleAddAllVoiceResults}>
                        <Text style={styles.addAllButton}>Adicionar todos</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                  <FlatList
                    data={searchResults}
                    renderItem={renderSearchResult}
                    keyExtractor={(item) => item.id}
                    style={styles.searchResultsList}
                    keyboardShouldPersistTaps="handled"
                    showsVerticalScrollIndicator={false}
                  />
                </View>
              ) : searchText.length > 1 && !isSearching && (
                <View style={styles.noResultsContainer}>
                  <MaterialIcons name="search-off" size={32} color="#CBD5E1" />
                  <Text style={styles.noResultsText}>Nenhum alimento encontrado</Text>
                </View>
              )}
            </View>
          </View>
        </SafeAreaView>
      </Modal>
    </>
  );
};

// Mantenha os mesmos styles da versão anterior
const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    padding: 16,
  },
  caloriasCard: {
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
  caloriasHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  caloriasTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  caloriasIconGradient: {
    width: 42,
    height: 42,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#F39C12',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  caloriasTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1E293B',
  },
  caloriasValueContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  caloriasCurrent: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1E293B',
  },
  caloriasSeparator: {
    fontSize: 18,
    color: '#94A3B8',
    marginHorizontal: 4,
  },
  caloriasTotal: {
    fontSize: 18,
    color: '#94A3B8',
  },
  caloriasUnit: {
    fontSize: 14,
    color: '#64748B',
    marginLeft: 4,
  },
  caloriasProgressContainer: {
    marginBottom: 20,
  },
  caloriasProgressBar: {
    height: 8,
    backgroundColor: '#E2E8F0',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 6,
  },
  caloriasProgressFill: {
    height: '100%',
    backgroundColor: '#F39C12',
    borderRadius: 4,
  },
  caloriasProgressText: {
    fontSize: 12,
    color: '#64748B',
  },
  macrosRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
    gap: 8,
  },
  macroItem: {
    flex: 1,
  },
  macroLabel: {
    fontSize: 11,
    color: '#64748B',
    marginBottom: 4,
  },
  macroValueRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 6,
  },
  macroValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1E293B',
  },
  macroSeparator: {
    fontSize: 12,
    color: '#94A3B8',
    marginHorizontal: 2,
  },
  macroTarget: {
    fontSize: 12,
    color: '#94A3B8',
  },
  macroProgressBar: {
    height: 4,
    backgroundColor: '#E2E8F0',
    borderRadius: 2,
    overflow: 'hidden',
  },
  macroProgressFill: {
    height: '100%',
    borderRadius: 2,
  },
  categoriasRefeicao: {
    marginTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    paddingTop: 12,
  },
  categoriaRefeicaoContainer: {
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
  categoriaDetalhes: {
    fontSize: 12,
    color: '#64748B',
  },
  personalizarButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    marginTop: 8,
    gap: 6,
  },
  personalizarButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1E88E5',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  modalBackButton: {
    padding: 4,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1E293B',
  },
  modalContent: {
    flex: 1,
    position: 'relative',
  },
  alimentosList: {
    flex: 1,
    padding: 16,
  },
  alimentosListContent: {
    flexGrow: 1,
    paddingBottom: 300,
  },
  emptyStateContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyStateText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#94A3B8',
    marginTop: 12,
    marginBottom: 4,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#CBD5E1',
    textAlign: 'center',
    paddingHorizontal: 32,
  },
  alimentoConsumidoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  alimentoConsumidoInfo: {
    flex: 1,
  },
  alimentoConsumidoNome: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 4,
  },
  alimentoConsumidoDetalhes: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  alimentoConsumidoQuantidade: {
    fontSize: 14,
    color: '#64748B',
  },
  alimentoConsumidoCalorias: {
    fontSize: 14,
    color: '#F39C12',
    fontWeight: '600',
  },
  removeButton: {
    padding: 4,
    marginLeft: 8,
  },
  buscaContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#F8FAFC',
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    padding: 16,
    paddingBottom: 24,
    maxHeight: '60%',
  },
  actionButtonsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    gap: 8,
  },
  textSearchButton: {
    backgroundColor: '#E3F2FD',
    borderColor: '#1E88E5',
  },
  voiceSearchButton: {
    backgroundColor: '#F3E5F5',
    borderColor: '#1E88E5',
  },
  listeningButton: {
    backgroundColor: '#FFEBEE',
    borderColor: '#EF4444',
  },
  permissionButton: {
    backgroundColor: '#FFF3E0',
    borderColor: '#FFA500',
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1E88E5',
  },
  listeningText: {
    color: '#EF4444',
  },
  permissionText: {
    color: '#FFA500',
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    marginBottom: 12,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 14,
    fontSize: 16,
    color: '#1E293B',
  },
  clearButton: {
    padding: 4,
  },
  listeningContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#E3F2FD',
    borderRadius: 12,
    marginBottom: 12,
    gap: 12,
  },
  cancelButton: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#EF4444',
  },
  cancelButtonText: {
    color: '#EF4444',
    fontSize: 14,
    fontWeight: '600',
  },
  voiceResultsContainer: {
    marginBottom: 12,
  },
  voiceResultsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 8,
  },
  voiceResultsScroll: {
    flexDirection: 'row',
  },
  voiceResultItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E3F2FD',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    marginRight: 8,
    gap: 6,
  },
  voiceResultText: {
    fontSize: 14,
    color: '#1E88E5',
    fontWeight: '500',
  },
  searchResultsContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    overflow: 'hidden',
    maxHeight: 200,
  },
  searchResultsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  searchResultsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1E293B',
    flex: 1,
  },
  addAllButton: {
    fontSize: 12,
    color: '#1E88E5',
    fontWeight: '600',
  },
  searchResultsList: {
    maxHeight: 150,
  },
  searchResultItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  searchResultInfo: {
    flex: 1,
  },
  searchResultNome: {
    fontSize: 15,
    fontWeight: '500',
    color: '#1E293B',
    marginBottom: 2,
  },
  searchResultQuantidade: {
    fontSize: 12,
    color: '#64748B',
  },
  searchResultCalorias: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginLeft: 8,
  },
  searchResultCaloriasValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#F39C12',
  },
  searchResultCaloriasUnit: {
    fontSize: 12,
    color: '#94A3B8',
    marginLeft: 2,
  },
  loadingContainer: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  loadingText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#64748B',
  },
  noResultsContainer: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  noResultsText: {
    fontSize: 15,
    fontWeight: '500',
    color: '#94A3B8',
    marginTop: 8,
  },
});