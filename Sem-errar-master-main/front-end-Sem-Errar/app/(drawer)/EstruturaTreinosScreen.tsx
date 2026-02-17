import FontAwesome from '@expo/vector-icons/FontAwesome';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert, Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

export default function EstruturaTreinosScreen() {
  const router = useRouter();
  const [estruturaSelecionada, setEstruturaSelecionada] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const estruturas = [
    {
      id: '1',
      title: 'Sempre o mesmo treino',
      subtitle: 'Full body ou ABC',
      description: 'Faz o mesmo treino todos os dias',
      icon: 'repeat',
      color: '#4CAF50',
    },
    {
      id: '2',
      title: '2 treinos diferentes',
      subtitle: 'Treino A e B',
      description: 'Alterna entre 2 treinos',
      icon: 'exchange',
      color: '#2196F3',
    },
    {
      id: '3',
      title: '3 treinos diferentes',
      subtitle: 'Treino A, B e C',
      description: 'Alterna entre 3 treinos',
      icon: 'random',
      color: '#9C27B0',
    },
    {
      id: '4',
      title: '4 treinos diferentes',
      subtitle: 'Treino A, B, C e D',
      description: 'Alterna entre 4 treinos',
      icon: 'arrows',
      color: '#FF9800',
    },
    {
      id: 'personalizar',
      title: 'Personalizar',
      subtitle: 'Crie seu próprio esquema',
      description: 'Monte seus treinos manualmente',
      icon: 'pencil-square-o',
      color: '#E74C3C',
    },
  ];

  // Carregar estrutura salva ao iniciar a tela
  useEffect(() => {
    carregarEstruturaSalva();
  }, []);

  const carregarEstruturaSalva = async () => {
    try {
      const estruturaSalva = await AsyncStorage.getItem('@estruturaTreinos');
      if (estruturaSalva) {
        setEstruturaSelecionada(estruturaSalva);
      }
    } catch (error) {
      console.error('Erro ao carregar estrutura de treinos:', error);
    }
  };

  const handleProximo = async () => {
    if (estruturaSelecionada) {
      setIsLoading(true);
      try {
        await AsyncStorage.setItem('@estruturaTreinos', estruturaSelecionada);
        
        // Salvar informações adicionais baseado na seleção
        const estruturaInfo = estruturas.find(e => e.id === estruturaSelecionada);
        if (estruturaInfo) {
          await AsyncStorage.setItem('@estruturaTreinosInfo', JSON.stringify(estruturaInfo));
        }
        
        console.log('Estrutura de treinos salva:', estruturaSelecionada);
        
        // Navegar para próxima tela (próxima etapa do cadastro)
        router.push('/ConfigurarTreinoScreen');
      } catch (error) {
        console.error('Erro ao salvar estrutura de treinos:', error);
        Alert.alert('Erro', 'Não foi possível salvar sua escolha. Tente novamente.');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleVoltar = () => {
   // router.push('/BemVindoScreen'); // Ajuste para a tela anterior correta
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
              <Text style={styles.sectionTitle}>🏋️ Estrutura de Treinos</Text>
              <Text style={styles.welcomeTitle}>
                Você faz sempre o mesmo treino ou alterna?
              </Text>
              <Text style={styles.obrigatorio}>* obrigatório</Text>
            </View>
            
            <Text style={styles.subtitle}>
              Escolha como você quer organizar seus treinos durante a semana
            </Text>
            
            {/* OPÇÕES DE ESTRUTURA */}
            <View style={styles.estruturasContainer}>
              <View style={styles.estruturasGrid}>
                {estruturas.map((estrutura) => (
                  <Pressable
                    key={estrutura.id}
                    style={[
                      styles.estruturaItem,
                      estruturaSelecionada === estrutura.id && styles.estruturaItemSelecionado
                    ]}
                    onPress={() => setEstruturaSelecionada(estrutura.id)}
                  >
                    <View style={[
                      styles.estruturaIconContainer,
                      { backgroundColor: `${estrutura.color}15` }
                    ]}>
                      <FontAwesome name={estrutura.icon as any} size={28} color={estrutura.color} />
                    </View>
                    
                    <View style={styles.estruturaContent}>
                      <Text style={[
                        styles.estruturaTitulo,
                        estruturaSelecionada === estrutura.id && styles.estruturaTituloSelecionado
                      ]}>
                        {estrutura.title}
                      </Text>
                      <Text style={styles.estruturaSubtitulo}>{estrutura.subtitle}</Text>
                      <Text style={styles.estruturaDescricao}>{estrutura.description}</Text>
                    </View>
                    
                    <View style={[
                      styles.radioButton,
                      estruturaSelecionada === estrutura.id && styles.radioButtonSelecionado
                    ]}>
                      {estruturaSelecionada === estrutura.id && (
                        <View style={styles.radioButtonInner} />
                      )}
                    </View>
                  </Pressable>
                ))}
              </View>
            </View>
            
            <View style={styles.divider} />
            
            {/* BOTÃO PRÓXIMO */}
            <Pressable 
              style={[
                styles.primaryButton,
                (!estruturaSelecionada || isLoading) && styles.primaryButtonDisabled
              ]}
              onPress={handleProximo}
              disabled={!estruturaSelecionada || isLoading}
            >
              <View style={styles.buttonContent}>
                <FontAwesome name="arrow-right" size={22} color="#FFFFFF" />
                <Text style={styles.primaryText}>
                  {isLoading ? 'Salvando...' : 'Próximo'}
                </Text>
              </View>
              <Text style={styles.buttonSubtitle}>
                {estruturaSelecionada 
                  ? 'Continue para o próximo passo' 
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

  // Estilos para as opções de estrutura
  estruturasContainer: {
    width: '100%',
    marginBottom: 28,
  },

  estruturasGrid: {
    gap: 16,
  },

  estruturaItem: {
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

  estruturaItemSelecionado: {
    backgroundColor: '#F0F9FF',
    borderColor: '#1E88E5',
  },

  estruturaIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },

  estruturaContent: {
    flex: 1,
  },

  estruturaTitulo: {
    color: '#000000',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 4,
  },

  estruturaTituloSelecionado: {
    color: '#1E88E5',
  },

  estruturaSubtitulo: {
    color: '#1E88E5',
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 2,
  },

  estruturaDescricao: {
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