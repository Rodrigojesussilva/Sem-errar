import FontAwesome from '@expo/vector-icons/FontAwesome';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert, Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

export default function OrganizacaoTreinosScreen() {
  const router = useRouter();
  const [organizacaoSelecionada, setOrganizacaoSelecionada] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const opcoesOrganizacao = [
    {
      id: 'diasFixos',
      title: 'Dias fixos da semana',
      subtitle: 'segunda, quarta, sexta',
      description: 'Os treinos são sempre nos mesmos dias da semana',
      icon: 'calendar',
      color: '#4CAF50',
      exemplo: 'Segunda: Treino A • Quarta: Treino B • Sexta: Treino C'
    },
    {
      id: 'sequenciaRepetida',
      title: 'Sequência que se repete',
      subtitle: 'Treino 1 → Treino 2 → Descanso',
      description: 'Os treinos seguem um ciclo independente dos dias da semana',
      icon: 'repeat',
      color: '#9C27B0',
      exemplo: 'Treino A → Treino B → Descanso → Treino A → ...'
    },
  ];

  // Carregar organização salva ao iniciar a tela
  useEffect(() => {
    carregarOrganizacaoSalva();
  }, []);

  const carregarOrganizacaoSalva = async () => {
    try {
      const organizacaoSalva = await AsyncStorage.getItem('@organizacaoTreinos');
      if (organizacaoSalva) {
        setOrganizacaoSelecionada(organizacaoSalva);
      }
    } catch (error) {
      console.error('Erro ao carregar organização de treinos:', error);
    }
  };

  const handleProximo = async () => {
    if (organizacaoSelecionada) {
      setIsLoading(true);
      try {
        // Salvar a organização escolhida
        await AsyncStorage.setItem('@organizacaoTreinos', organizacaoSelecionada);
        
        // Salvar informações adicionais baseado na seleção
        const organizacaoInfo = opcoesOrganizacao.find(o => o.id === organizacaoSelecionada);
        if (organizacaoInfo) {
          await AsyncStorage.setItem('@organizacaoTreinosInfo', JSON.stringify(organizacaoInfo));
        }
        
        console.log('Organização de treinos salva:', organizacaoSelecionada);
        
        // Redirecionar baseado na escolha
        if (organizacaoSelecionada === 'diasFixos') {
          console.log('Redirecionando para DiasFixosScreen');
          router.push('/DiasFixosScreen');
        } else if (organizacaoSelecionada === 'sequenciaRepetida') {
          console.log('Redirecionando para SequenciaScreen');
          router.push('/SequenciaScreen');
        } else {
          // Fallback para segurança
          console.log('Opção não reconhecida, redirecionando para tela padrão');
          router.push('/FinalizacaoScreen');
        }
      } catch (error) {
        console.error('Erro ao salvar organização de treinos:', error);
        Alert.alert('Erro', 'Não foi possível salvar sua escolha. Tente novamente.');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleVoltar = () => {
    router.back(); // Volta para a tela anterior (ConfiguracaoTreinosScreen)
  };

  return (
    <View style={styles.background}>
      {/* BOTÃO VOLTAR NO TOPO - FIXO */}
      <View style={styles.headerContainer}>
        <Pressable 
          style={styles.backButton}
          onPress={handleVoltar}
        >
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
          
          {/* CONTEÚDO ABAIXO DA IMAGEM */}
          <View style={styles.content}>
            <View style={styles.headerSection}>
              <Text style={styles.sectionTitle}>📅 Organização dos Treinos</Text>
              <Text style={styles.welcomeTitle}>
                Como você prefere organizar seus treinos?
              </Text>
              <Text style={styles.obrigatorio}>* obrigatório</Text>
            </View>
            
            <Text style={styles.subtitle}>
              Essa escolha ajudará a definir a visualização e o agendamento dos treinos no app
            </Text>
            
            {/* OPÇÕES DE ORGANIZAÇÃO */}
            <View style={styles.opcoesContainer}>
              <View style={styles.opcoesGrid}>
                {opcoesOrganizacao.map((opcao) => (
                  <Pressable
                    key={opcao.id}
                    style={[
                      styles.opcaoItem,
                      organizacaoSelecionada === opcao.id && styles.opcaoItemSelecionado
                    ]}
                    onPress={() => setOrganizacaoSelecionada(opcao.id)}
                  >
                    <View style={[
                      styles.opcaoIconContainer,
                      { backgroundColor: `${opcao.color}15` }
                    ]}>
                      <FontAwesome name={opcao.icon as any} size={32} color={opcao.color} />
                    </View>
                    
                    <View style={styles.opcaoContent}>
                      <Text style={[
                        styles.opcaoTitulo,
                        organizacaoSelecionada === opcao.id && styles.opcaoTituloSelecionado
                      ]}>
                        {opcao.title}
                      </Text>
                      <Text style={styles.opcaoSubtitulo}>{opcao.subtitle}</Text>
                      <Text style={styles.opcaoDescricao}>{opcao.description}</Text>
                    </View>
                    
                    <View style={[
                      styles.radioButton,
                      organizacaoSelecionada === opcao.id && styles.radioButtonSelecionado
                    ]}>
                      {organizacaoSelecionada === opcao.id && (
                        <View style={styles.radioButtonInner} />
                      )}
                    </View>
                  </Pressable>
                ))}
              </View>
            </View>
            
            {/* DICA VISUAL BASEADA NA SELEÇÃO */}
            {organizacaoSelecionada && (
              <View style={styles.dicaContainer}>
                <FontAwesome name="info-circle" size={20} color="#1E88E5" />
                <Text style={styles.dicaTexto}>
                  {organizacaoSelecionada === 'diasFixos' 
                    ? 'Você poderá definir quais dias da semana serão dedicados a cada treino'
                    : 'Você poderá definir a ordem dos treinos e dias de descanso no ciclo'}
                </Text>
              </View>
            )}
            
            <View style={styles.divider} />
            
            {/* BOTÃO PRÓXIMO */}
            <Pressable 
              style={[
                styles.primaryButton,
                (!organizacaoSelecionada || isLoading) && styles.primaryButtonDisabled
              ]}
              onPress={handleProximo}
              disabled={!organizacaoSelecionada || isLoading}
            >
              <View style={styles.buttonContent}>
                <FontAwesome name="arrow-right" size={22} color="#FFFFFF" />
                <Text style={styles.primaryText}>
                  {isLoading ? 'Salvando...' : 'Próximo'}
                </Text>
              </View>
              <Text style={styles.buttonSubtitle}>
                {organizacaoSelecionada === 'diasFixos' 
                  ? 'Configurar dias fixos da semana'
                  : organizacaoSelecionada === 'sequenciaRepetida'
                  ? 'Configurar sequência de treinos'
                  : 'Selecione uma opção para continuar'}
              </Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },

  // Header fixo com botão voltar
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

  // Estilos para as opções de organização
  opcoesContainer: {
    width: '100%',
    marginBottom: 28,
  },

  opcoesGrid: {
    gap: 16,
  },

  opcaoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 18,
    paddingHorizontal: 18,
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

  opcaoIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },

  opcaoContent: {
    flex: 1,
  },

  opcaoTitulo: {
    color: '#000000',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 4,
  },

  opcaoTituloSelecionado: {
    color: '#1E88E5',
  },

  opcaoSubtitulo: {
    color: '#1E88E5',
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 2,
  },

  opcaoDescricao: {
    color: '#666666',
    fontSize: 14,
  },

  radioButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#CCCCCC',
    justifyContent: 'center',
    alignItems: 'center',
  },

  radioButtonSelecionado: {
    borderColor: '#1E88E5',
    backgroundColor: '#1E88E5',
  },

  radioButtonInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#FFFFFF',
  },

  dicaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F9FF',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    gap: 12,
    marginBottom: 16,
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
});