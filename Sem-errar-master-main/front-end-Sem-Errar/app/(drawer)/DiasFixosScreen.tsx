import FontAwesome from '@expo/vector-icons/FontAwesome';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert, Image, Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

export default function DiasFixosScreen() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [diasSemana, setDiasSemana] = useState([
    { id: 'segunda', nome: 'Segunda', treino: 'Descanso', icone: 'calendar', cor: '#E0E0E0' },
    { id: 'terca', nome: 'Terça', treino: 'Descanso', icone: 'calendar', cor: '#E0E0E0' },
    { id: 'quarta', nome: 'Quarta', treino: 'Descanso', icone: 'calendar', cor: '#E0E0E0' },
    { id: 'quinta', nome: 'Quinta', treino: 'Descanso', icone: 'calendar', cor: '#E0E0E0' },
    { id: 'sexta', nome: 'Sexta', treino: 'Descanso', icone: 'calendar', cor: '#E0E0E0' },
    { id: 'sabado', nome: 'Sábado', treino: 'Descanso', icone: 'calendar', cor: '#E0E0E0' },
    { id: 'domingo', nome: 'Domingo', treino: 'Descanso', icone: 'calendar', cor: '#E0E0E0' },
  ]);

  const [modalVisible, setModalVisible] = useState(false);
  const [diaSelecionado, setDiaSelecionado] = useState<any>(null);
  const [quantidadeTreinos, setQuantidadeTreinos] = useState(3); // Valor padrão
  const [opcoesTreino, setOpcoesTreino] = useState<string[]>([]);

  // Carregar quantidade de treinos da Tela 14
  useEffect(() => {
    carregarQuantidadeTreinos();
    carregarDiasSalvos();
  }, []);

  const carregarQuantidadeTreinos = async () => {
    try {
      const estruturaSalva = await AsyncStorage.getItem('@estruturaTreinos');
      if (estruturaSalva) {
        // Extrair número da estrutura (1, 2, 3, 4)
        const numero = parseInt(estruturaSalva);
        setQuantidadeTreinos(numero || 3);
        
        // Gerar opções de treino baseadas na quantidade
        const opcoes = [];
        for (let i = 1; i <= numero; i++) {
          opcoes.push(`Treino ${i}`);
        }
        opcoes.push('Descanso');
        setOpcoesTreino(opcoes);
      }
    } catch (error) {
      console.error('Erro ao carregar quantidade de treinos:', error);
    }
  };

  const carregarDiasSalvos = async () => {
    try {
      const diasSalvos = await AsyncStorage.getItem('@diasFixosTreinos');
      if (diasSalvos) {
        setDiasSemana(JSON.parse(diasSalvos));
      }
    } catch (error) {
      console.error('Erro ao carregar dias salvos:', error);
    }
  };

  const handleDiaPress = (dia: any) => {
    setDiaSelecionado(dia);
    setModalVisible(true);
  };

  const handleSelecionarTreino = (treino: string) => {
    if (!diaSelecionado) return;

    const cor = treino === 'Descanso' ? '#E0E0E0' : obterCorTreino(treino);
    const icone = treino === 'Descanso' ? 'bed' : 'check-circle';

    const diasAtualizados = diasSemana.map(dia => 
      dia.id === diaSelecionado.id 
        ? { ...dia, treino, cor, icone }
        : dia
    );

    setDiasSemana(diasAtualizados);
    setModalVisible(false);
  };

  const obterCorTreino = (treino: string): string => {
    const cores = ['#4CAF50', '#2196F3', '#9C27B0', '#FF9800', '#E74C3C'];
    const index = parseInt(treino.split(' ')[1]) - 1;
    return cores[index] || '#4CAF50';
  };

  const handleSalvar = async () => {
    setIsLoading(true);
    try {
      await AsyncStorage.setItem('@diasFixosTreinos', JSON.stringify(diasSemana));
      
      // Verificar se há pelo menos um treino configurado
      const temTreino = diasSemana.some(dia => dia.treino !== 'Descanso');
      
      if (!temTreino) {
        Alert.alert(
          'Atenção',
          'Você não configurou nenhum treino. Deseja continuar mesmo assim?',
          [
            { text: 'Cancelar', style: 'cancel' },
            { 
              text: 'Continuar', 
              onPress: () => {
                console.log('Dias fixos salvos:', diasSemana);
                router.push('/FinalizacaoScreen');
              }
            }
          ]
        );
        setIsLoading(false);
        return;
      }

      console.log('Dias fixos salvos:', diasSemana);
      router.push('/FinalizacaoScreen');
    } catch (error) {
      console.error('Erro ao salvar dias fixos:', error);
      Alert.alert('Erro', 'Não foi possível salvar sua configuração. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVoltar = () => {
    router.push('/OrganizacaoTreinosScreen'); // Redireciona para a tela de organização
  };

  const getDiaIcone = (treino: string) => {
    return treino === 'Descanso' ? 'bed' : 'check-circle';
  };

  return (
    <View style={styles.background}>
      {/* BOTÃO VOLTAR NO TOPO - FIXO */}
      <View style={styles.headerContainer}>
        <Pressable style={styles.backButton} onPress={handleVoltar}>
          <FontAwesome name="arrow-left" size={20} color="#1E88E5" />
          <Text style={styles.backButtonText}>Voltar</Text>
        </Pressable>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* CONTAINER PRINCIPAL */}
        <View style={styles.mainContainer}>
          {/* IMAGEM NO TOPO */}
          <View style={styles.imageContainer}>
            <Image
              source={require('@/assets/images/logo2.png')}
              style={styles.topImage}
              resizeMode="cover"
            />
          </View>

          {/* CONTEÚDO */}
          <View style={styles.content}>
            <View style={styles.headerSection}>
              <Text style={styles.sectionTitle}>📅 Dias Fixos da Semana</Text>
              <Text style={styles.welcomeTitle}>
                Agora distribua seus treinos na semana
              </Text>
              <Text style={styles.obrigatorio}>* obrigatório</Text>
            </View>

            <Text style={styles.subtitle}>
              Clique em cada dia para escolher qual treino será realizado
            </Text>

            {/* GRADE DE DIAS */}
            <View style={styles.diasGrid}>
              {diasSemana.map((dia) => (
                <Pressable
                  key={dia.id}
                  style={[
                    styles.diaCard,
                    dia.treino !== 'Descanso' && styles.diaCardAtivo,
                    { borderColor: dia.treino !== 'Descanso' ? dia.cor : '#E0E0E0' }
                  ]}
                  onPress={() => handleDiaPress(dia)}
                >
                  <View style={[
                    styles.diaIconContainer,
                    { backgroundColor: dia.treino !== 'Descanso' ? `${dia.cor}15` : '#F5F5F5' }
                  ]}>
                    <FontAwesome 
                      name={getDiaIcone(dia.treino)} 
                      size={24} 
                      color={dia.treino !== 'Descanso' ? dia.cor : '#999999'} 
                    />
                  </View>
                  
                  <Text style={styles.diaNome}>{dia.nome}</Text>
                  
                  <View style={[
                    styles.treinoBadge,
                    dia.treino !== 'Descanso' && styles.treinoBadgeAtivo,
                    { backgroundColor: dia.treino !== 'Descanso' ? dia.cor : '#F0F0F0' }
                  ]}>
                    <Text style={[
                      styles.treinoBadgeText,
                      dia.treino !== 'Descanso' && styles.treinoBadgeTextAtivo
                    ]}>
                      {dia.treino}
                    </Text>
                  </View>

                  <FontAwesome 
                    name="chevron-right" 
                    size={16} 
                    color="#CCCCCC" 
                    style={styles.diaSeta}
                  />
                </Pressable>
              ))}
            </View>

            {/* LEGENDA */}
            <View style={styles.legendaContainer}>
              <View style={styles.legendaItem}>
                <View style={[styles.legendaCor, { backgroundColor: '#4CAF50' }]} />
                <Text style={styles.legendaTexto}>Treino 1</Text>
              </View>
              <View style={styles.legendaItem}>
                <View style={[styles.legendaCor, { backgroundColor: '#2196F3' }]} />
                <Text style={styles.legendaTexto}>Treino 2</Text>
              </View>
              <View style={styles.legendaItem}>
                <View style={[styles.legendaCor, { backgroundColor: '#9C27B0' }]} />
                <Text style={styles.legendaTexto}>Treino 3</Text>
              </View>
              {quantidadeTreinos >= 4 && (
                <View style={styles.legendaItem}>
                  <View style={[styles.legendaCor, { backgroundColor: '#FF9800' }]} />
                  <Text style={styles.legendaTexto}>Treino 4</Text>
                </View>
              )}
              <View style={styles.legendaItem}>
                <View style={[styles.legendaCor, { backgroundColor: '#E0E0E0' }]} />
                <Text style={styles.legendaTexto}>Descanso</Text>
              </View>
            </View>

            {/* DICA */}
            <View style={styles.dicaContainer}>
              <FontAwesome name="info-circle" size={20} color="#1E88E5" />
              <Text style={styles.dicaTexto}>
                Toque em cada dia para escolher o treino. Dias com treino serão destacados.
              </Text>
            </View>

            <View style={styles.divider} />

            {/* BOTÃO SALVAR */}
            <Pressable
              style={[
                styles.primaryButton,
                isLoading && styles.primaryButtonDisabled
              ]}
              onPress={handleSalvar}
              disabled={isLoading}
            >
              <View style={styles.buttonContent}>
                <FontAwesome name="check" size={22} color="#FFFFFF" />
                <Text style={styles.primaryText}>
                  {isLoading ? 'Salvando...' : 'Salvar Configuração'}
                </Text>
              </View>
              <Text style={styles.buttonSubtitle}>
                Seus treinos serão salvos e usados no app
              </Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>

      {/* MODAL DE SELEÇÃO DE TREINO */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitulo}>
                {diaSelecionado?.nome}
              </Text>
              <Pressable 
                onPress={() => setModalVisible(false)}
                style={styles.modalCloseButton}
              >
                <FontAwesome name="close" size={20} color="#666" />
              </Pressable>
            </View>

            <Text style={styles.modalSubtitulo}>
              Escolha o treino para {diaSelecionado?.nome?.toLowerCase()}
            </Text>

            <View style={styles.opcoesContainer}>
              {opcoesTreino.map((treino, index) => (
                <Pressable
                  key={index}
                  style={[
                    styles.opcaoItem,
                    diaSelecionado?.treino === treino && styles.opcaoItemSelecionado,
                    treino === 'Descanso' && styles.opcaoDescanso
                  ]}
                  onPress={() => handleSelecionarTreino(treino)}
                >
                  <View style={[
                    styles.opcaoIconContainer,
                    { 
                      backgroundColor: treino === 'Descanso' 
                        ? '#F5F5F5' 
                        : `${obterCorTreino(treino)}15` 
                    }
                  ]}>
                    <FontAwesome 
                      name={treino === 'Descanso' ? 'bed' : 'check-circle'} 
                      size={24} 
                      color={treino === 'Descanso' ? '#999' : obterCorTreino(treino)} 
                    />
                  </View>
                  <Text style={[
                    styles.opcaoTexto,
                    diaSelecionado?.treino === treino && styles.opcaoTextoSelecionado,
                    treino === 'Descanso' && styles.opcaoTextoDescanso
                  ]}>
                    {treino}
                  </Text>
                  {diaSelecionado?.treino === treino && (
                    <FontAwesome name="check" size={18} color="#1E88E5" />
                  )}
                </Pressable>
              ))}
            </View>

            <Pressable
              style={styles.modalCancelButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.modalCancelText}>Cancelar</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },

  headerContainer: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    zIndex: 10,
  },

  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },

  backButtonText: {
    color: '#1E88E5',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },

  scrollView: {
    flex: 1,
  },

  scrollContent: {
    flexGrow: 1,
    paddingTop: 15,
    paddingBottom: 30,
    paddingHorizontal: 5,
  },

  mainContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    marginHorizontal: 15,
    maxWidth: 400,
    alignSelf: 'center',
    width: '92%',
    marginTop: 5,
  },

  imageContainer: {
    height: 170,
    width: '100%',
    overflow: 'hidden',
    backgroundColor: '#F5F5F5',
  },

  topImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },

  content: {
    paddingHorizontal: 24,
    paddingTop: 28,
    paddingBottom: 28,
    alignItems: 'center',
  },

  headerSection: {
    alignItems: 'center',
    marginBottom: 20,
  },

  sectionTitle: {
    color: '#666666',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 12,
    backgroundColor: '#F0F9FF',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#1E88E5',
  },

  welcomeTitle: {
    color: '#000000',
    fontSize: 26,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 8,
    lineHeight: 32,
  },

  obrigatorio: {
    color: '#FF5722',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 22,
  },

  subtitle: {
    color: '#666666',
    fontSize: 17,
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 24,
  },

  // Grade de dias
  diasGrid: {
    width: '100%',
    gap: 12,
    marginBottom: 24,
  },

  diaCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#F8F9FA',
    borderRadius: 14,
    borderWidth: 2,
    borderColor: '#E9ECEF',
    gap: 12,
  },

  diaCardAtivo: {
    backgroundColor: '#F0F9FF',
    borderWidth: 2,
  },

  diaIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },

  diaNome: {
    flex: 1,
    fontSize: 17,
    fontWeight: '600',
    color: '#333',
  },

  treinoBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginRight: 8,
  },

  treinoBadgeAtivo: {
    backgroundColor: '#4CAF50',
  },

  treinoBadgeText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#666',
  },

  treinoBadgeTextAtivo: {
    color: '#FFFFFF',
  },

  diaSeta: {
    opacity: 0.5,
  },

  // Legenda
  legendaContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 16,
    marginBottom: 20,
    paddingVertical: 16,
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    width: '100%',
  },

  legendaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },

  legendaCor: {
    width: 16,
    height: 16,
    borderRadius: 8,
  },

  legendaTexto: {
    fontSize: 12,
    color: '#666',
  },

  // Dica
  dicaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F9FF',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    gap: 12,
    marginBottom: 16,
    width: '100%',
  },

  dicaTexto: {
    flex: 1,
    color: '#1E88E5',
    fontSize: 14,
    fontWeight: '500',
  },

  divider: {
    height: 1,
    width: '100%',
    backgroundColor: '#E0E0E0',
    marginVertical: 22,
  },

  primaryButton: {
    width: '100%',
    backgroundColor: '#1E88E5',
    borderRadius: 18,
    paddingVertical: 22,
    paddingHorizontal: 26,
    alignItems: 'center',
    shadowColor: '#1E88E5',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 8,
    marginBottom: 12,
  },

  primaryButtonDisabled: {
    backgroundColor: '#CCCCCC',
    shadowColor: '#CCCCCC',
  },

  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    marginBottom: 8,
  },

  primaryText: {
    color: '#FFFFFF',
    fontSize: 21,
    fontWeight: '700',
  },

  buttonSubtitle: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: 15,
    fontWeight: '500',
    textAlign: 'center',
  },

  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },

  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    padding: 24,
    minHeight: 400,
  },

  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },

  modalTitulo: {
    fontSize: 24,
    fontWeight: '700',
    color: '#000',
  },

  modalCloseButton: {
    padding: 8,
  },

  modalSubtitulo: {
    fontSize: 16,
    color: '#666',
    marginBottom: 24,
  },

  opcoesContainer: {
    gap: 12,
    marginBottom: 24,
  },

  opcaoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#F8F9FA',
    borderRadius: 14,
    borderWidth: 2,
    borderColor: '#E9ECEF',
    gap: 16,
  },

  opcaoItemSelecionado: {
    backgroundColor: '#F0F9FF',
    borderColor: '#1E88E5',
  },

  opcaoDescanso: {
    backgroundColor: '#F5F5F5',
  },

  opcaoIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },

  opcaoTexto: {
    flex: 1,
    fontSize: 18,
    fontWeight: '500',
    color: '#333',
  },

  opcaoTextoSelecionado: {
    color: '#1E88E5',
    fontWeight: '700',
  },

  opcaoTextoDescanso: {
    color: '#999',
  },

  modalCancelButton: {
    padding: 16,
    alignItems: 'center',
  },

  modalCancelText: {
    fontSize: 16,
    color: '#1E88E5',
    fontWeight: '600',
  },
});