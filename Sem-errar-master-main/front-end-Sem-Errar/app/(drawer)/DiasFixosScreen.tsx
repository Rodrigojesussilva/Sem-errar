import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert, Dimensions, Image, Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

const { width } = Dimensions.get('window');

const COLORS = {
  primary: '#622db2',
  dot: '#4ecdc4',
  line: 'rgba(112, 82, 230, 0.15)',
  textMain: '#1A1A1A',
  disabled: '#F0F0F0',
  inputBg: '#F8F9FA',
  success: '#622db2',
  // Cores dos treinos
  treino1: '#4CAF50',
  treino2: '#2196F3',
  treino3: '#9C27B0',
  treino4: '#FF9800',
  descanso: '#E0E0E0',
};

export default function DiasFixosScreen() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [diasSemana, setDiasSemana] = useState([
    { id: 'segunda', nome: 'Segunda', treino: 'Descanso', icone: 'bed', cor: COLORS.descanso },
    { id: 'terca', nome: 'Terça', treino: 'Descanso', icone: 'bed', cor: COLORS.descanso },
    { id: 'quarta', nome: 'Quarta', treino: 'Descanso', icone: 'bed', cor: COLORS.descanso },
    { id: 'quinta', nome: 'Quinta', treino: 'Descanso', icone: 'bed', cor: COLORS.descanso },
    { id: 'sexta', nome: 'Sexta', treino: 'Descanso', icone: 'bed', cor: COLORS.descanso },
    { id: 'sabado', nome: 'Sábado', treino: 'Descanso', icone: 'bed', cor: COLORS.descanso },
    { id: 'domingo', nome: 'Domingo', treino: 'Descanso', icone: 'bed', cor: COLORS.descanso },
  ]);

  const [modalVisible, setModalVisible] = useState(false);
  const [diaSelecionado, setDiaSelecionado] = useState<any>(null);
  const [quantidadeTreinos, setQuantidadeTreinos] = useState(3);
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
        const numero = parseInt(estruturaSalva);
        setQuantidadeTreinos(numero || 3);

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

    const cor = treino === 'Descanso' ? COLORS.descanso : obterCorTreino(treino);
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
    const cores = [COLORS.treino1, COLORS.treino2, COLORS.treino3, COLORS.treino4];
    const index = parseInt(treino.split(' ')[1]) - 1;
    return cores[index] || COLORS.treino1;
  };

  const handleProximo = async () => {
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
                router.push('/PescocoScreen');
              }
            }
          ]
        );
        setIsLoading(false);
        return;
      }

      console.log('Dias fixos salvos:', diasSemana);
      router.push('/QuadroCalcularBFScreenDiasFixos');

    } catch (error) {
      console.error('Erro ao salvar dias fixos:', error);
      Alert.alert('Erro', 'Não foi possível salvar sua configuração. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVoltar = () => {
    router.push('/OrganizacaoTreinosScreen');
  };

  const getDiaIcone = (treino: string) => {
    return treino === 'Descanso' ? 'bed' : 'check-circle';
  };

  const renderBackground = () => (
    <View style={styles.visualArea}>
      <View style={[styles.ellipseLine, { width: width * 1.5, height: 300, top: -50, right: -width * 0.2, transform: [{ rotate: '15deg' }] }]}>
        <View style={[styles.staticDot, { bottom: '20%', left: '20%' }]} />
      </View>
      <View style={[styles.ellipseLine, { width: width * 1.7, height: 400, bottom: -100, left: -width * 0.3, transform: [{ rotate: '-10deg' }] }]}>
        <View style={[styles.staticDot, { top: '30%', right: '25%' }]} />
      </View>
    </View>
  );

  return (
    <View style={styles.background}>
      {renderBackground()}

      {/* BOTÃO VOLTAR NO TOPO - FIXO */}
      <View style={styles.headerContainer}>
        <Pressable style={styles.backButton} onPress={handleVoltar}>
          <View style={styles.backIconCircle}>
            <FontAwesome name="chevron-left" size={12} color={COLORS.primary} />
          </View>
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
              source={require('@/assets/images/logo-sem-fundo1.png')}
              style={styles.topImage}
              resizeMode="contain"
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
                    <MaterialCommunityIcons
                      name={getDiaIcone(dia.treino) === 'bed' ? 'bed' : 'check-circle'}
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
                <View style={[styles.legendaCor, { backgroundColor: COLORS.treino1 }]} />
                <Text style={styles.legendaTexto}>Treino 1</Text>
              </View>
              <View style={styles.legendaItem}>
                <View style={[styles.legendaCor, { backgroundColor: COLORS.treino2 }]} />
                <Text style={styles.legendaTexto}>Treino 2</Text>
              </View>
              <View style={styles.legendaItem}>
                <View style={[styles.legendaCor, { backgroundColor: COLORS.treino3 }]} />
                <Text style={styles.legendaTexto}>Treino 3</Text>
              </View>
              {quantidadeTreinos >= 4 && (
                <View style={styles.legendaItem}>
                  <View style={[styles.legendaCor, { backgroundColor: COLORS.treino4 }]} />
                  <Text style={styles.legendaTexto}>Treino 4</Text>
                </View>
              )}
              <View style={styles.legendaItem}>
                <View style={[styles.legendaCor, { backgroundColor: COLORS.descanso }]} />
                <Text style={styles.legendaTexto}>Descanso</Text>
              </View>
            </View>

            {/* DICA */}
            <View style={styles.dicaContainer}>
              <Feather name="info" size={20} color={COLORS.primary} />
              <Text style={styles.dicaTexto}>
                Toque em cada dia para escolher o treino. Dias com treino serão destacados.
              </Text>
            </View>

            <View style={styles.divider} />

            {/* BOTÃO PRÓXIMO - PADRONIZADO COM A TELA DE CONFIGURAR TREINO */}
            <Pressable
              style={styles.primaryButtonWrapper}
              onPress={handleProximo}
              disabled={isLoading}
            >
              <LinearGradient
                colors={!isLoading ? ['#7b42d5', '#622db2', '#4b208c'] : ['#CCCCCC', '#BBBBBB']}
                style={styles.primaryButton}
              >
                <Text style={[styles.primaryText, isLoading && { color: '#AAAAAA' }]}>
                  {isLoading ? 'Salvando...' : 'Próximo'}
                </Text>
              </LinearGradient>
              <Text style={styles.buttonSubtitle}>
                Continuar para medidas corporais
              </Text>
            </Pressable>

            {/* INFORMAÇÃO ADICIONAL */}
            <View style={styles.infoProximoPasso}>
              <Feather name="info" size={14} color="#999" />
              <Text style={styles.infoProximoPassoText}>
                Após configurar seus dias, você irá para as medidas corporais
              </Text>
            </View>
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
                <Feather name="x" size={20} color="#666" />
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
                    <MaterialCommunityIcons
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
                    <Feather name="check" size={18} color={COLORS.primary} />
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
  visualArea: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 0,
    overflow: 'hidden',
  },
  ellipseLine: {
    position: 'absolute',
    borderWidth: 1.5,
    borderColor: COLORS.line,
    borderRadius: 999,
  },
  staticDot: {
    position: 'absolute',
    width: 10,
    height: 10,
    borderRadius: 5,
    borderWidth: 2,
    borderColor: COLORS.dot,
    backgroundColor: '#fff',
  },

  headerContainer: {
    paddingHorizontal: 25,
    paddingTop: 40,
    zIndex: 10,
    backgroundColor: 'transparent',
  },

  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  backIconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.line,
    elevation: 2,
  },

  backButtonText: {
    color: COLORS.primary,
    fontSize: 16,
    fontWeight: '700',
    marginLeft: 10,
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
    height: 100,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    marginTop: 20,
  },

  topImage: {
    width: width * 0.4,
    height: 60,
  },

  content: {
    paddingHorizontal: 24,
    paddingTop: 10,
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
    borderColor: COLORS.primary,
  },

  welcomeTitle: {
    color: COLORS.textMain,
    fontSize: 26,
    fontWeight: '900',
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
    backgroundColor: COLORS.treino1,
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
    color: COLORS.primary,
    fontSize: 14,
    fontWeight: '500',
  },

  divider: {
    height: 1,
    width: '100%',
    backgroundColor: '#E0E0E0',
    marginVertical: 22,
  },

  // Botão Próximo - Estilo padronizado com ConfigurarTreinoScreen
  primaryButtonWrapper: {
    width: '100%',
    alignItems: 'center',
  },

  primaryButton: {
    width: '100%',
    paddingVertical: 18,
    borderRadius: 20,
    alignItems: 'center',
    elevation: 4,
  },

  primaryText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '800',
  },

  buttonSubtitle: {
    fontSize: 12,
    color: '#999',
    marginTop: 10,
    textAlign: 'center',
  },

  infoProximoPasso: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 16,
    paddingHorizontal: 20,
  },

  infoProximoPassoText: {
    flex: 1,
    fontSize: 12,
    color: '#999',
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
    fontWeight: '800',
    color: COLORS.textMain,
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
    borderColor: COLORS.primary,
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
    fontWeight: '600',
    color: '#333',
  },

  opcaoTextoSelecionado: {
    color: COLORS.primary,
    fontWeight: '800',
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
    color: COLORS.primary,
    fontWeight: '600',
  },
});