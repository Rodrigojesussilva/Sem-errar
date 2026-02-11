import FontAwesome from '@expo/vector-icons/FontAwesome';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert, Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

export default function SexoScreen() {
  const router = useRouter();
  
  const [sexoSelecionado, setSexoSelecionado] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const opcoesSexo = [
    {
      id: 'masculino',
      title: 'Masculino',
      icon: 'mars',
      color: '#1E88E5',
    },
    {
      id: 'feminino',
      title: 'Feminino',
      icon: 'venus',
      color: '#E91E63',
    },
  ];

  // Carregar sexo salvo ao iniciar a tela
  useEffect(() => {
    carregarSexoSalvo();
  }, []);

  const carregarSexoSalvo = async () => {
    try {
      const sexoSalvo = await AsyncStorage.getItem('@sexo');
      if (sexoSalvo) {
        setSexoSelecionado(sexoSalvo);
      }
    } catch (error) {
      console.error('Erro ao carregar sexo:', error);
    }
  };

  const handleProximo = async () => {
    if (sexoSelecionado) {
      setIsLoading(true);
      try {
        // Salvar o sexo no AsyncStorage
        await AsyncStorage.setItem('@sexo', sexoSelecionado);
        
        console.log('Sexo salvo:', sexoSelecionado);
        
        // Navegar para próxima tela
        router.push('/IdadeScreen');
      } catch (error) {
        console.error('Erro ao salvar sexo:', error);
        Alert.alert('Erro', 'Não foi possível salvar seu sexo. Tente novamente.');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleVoltar = () => {
    router.push('/ObjetivoScreen');
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
            <Text style={styles.welcomeTitle}>Qual é o seu sexo?</Text>
            <Text style={styles.obrigatorio}>* obrigatório</Text>
            
            <Text style={styles.subtitle}>
              Essa informação nos ajuda a personalizar seu plano de treino
            </Text>
            
            {/* OPÇÕES DE SEXO */}
            <View style={styles.opcoesContainer}>
              {opcoesSexo.map((opcao) => (
                <Pressable
                  key={opcao.id}
                  style={[
                    styles.opcaoItem,
                    sexoSelecionado === opcao.id && styles.opcaoItemSelecionado
                  ]}
                  onPress={() => setSexoSelecionado(opcao.id)}
                >
                  <View style={[
                    styles.opcaoIconContainer,
                    { backgroundColor: `${opcao.color}15` }
                  ]}>
                    <FontAwesome name={opcao.icon as any} size={28} color={opcao.color} />
                  </View>
                  
                  <View style={styles.opcaoContent}>
                    <Text style={styles.opcaoTitulo}>{opcao.title}</Text>
                  </View>
                  
                  <View style={[
                    styles.radioButton,
                    sexoSelecionado === opcao.id && styles.radioButtonSelecionado
                  ]}>
                    {sexoSelecionado === opcao.id && (
                      <View style={styles.radioButtonInner} />
                    )}
                  </View>
                </Pressable>
              ))}
            </View>
            
            <View style={styles.divider} />
            
            {/* BOTÃO PRÓXIMO */}
            <Pressable 
              style={[
                styles.primaryButton,
                (!sexoSelecionado || isLoading) && styles.primaryButtonDisabled
              ]}
              onPress={handleProximo}
              disabled={!sexoSelecionado || isLoading}
            >
              <View style={styles.buttonContent}>
                <FontAwesome name="arrow-right" size={22} color="#FFFFFF" />
                <Text style={styles.primaryText}>
                  {isLoading ? 'Salvando...' : 'Próximo'}
                </Text>
              </View>
              <Text style={styles.buttonSubtitle}>
                {sexoSelecionado 
                  ? 'Continue para a próxima etapa' 
                  : 'Selecione uma opção para continuar'}
              </Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

// ... os estilos permanecem exatamente os mesmos

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

  // Estilos para o botão voltar
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

  opcoesContainer: {
    width: '100%',
    gap: 22,
    marginBottom: 28,
  },

  opcaoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 22,
    paddingHorizontal: 18,
    backgroundColor: '#F8F9FA',
    borderRadius: 14,
    borderWidth: 2,
    borderColor: '#E9ECEF',
    gap: 22,
  },

  opcaoItemSelecionado: {
    backgroundColor: '#F0F9FF',
    borderColor: '#1E88E5',
  },

  opcaoIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },

  opcaoContent: {
    flex: 1,
  },

  opcaoTitulo: {
    color: '#000000',
    fontSize: 19,
    fontWeight: '600',
  },

  radioButton: {
    width: 26,
    height: 26,
    borderRadius: 13,
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
    width: 13,
    height: 13,
    borderRadius: 6.5,
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