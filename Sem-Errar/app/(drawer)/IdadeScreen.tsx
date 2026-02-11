import FontAwesome from '@expo/vector-icons/FontAwesome';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert, Image, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

export default function IdadeScreen() {
  const router = useRouter();
  const [idade, setIdade] = useState<string>('');
  const [idadeSelecionada, setIdadeSelecionada] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const faixasEtarias = [
    {
      id: '18-25',
      title: '18-25 anos',
      subtitle: 'Jovem adulto',
      icon: 'sun-o',
      color: '#4CAF50',
    },
    {
      id: '26-35',
      title: '26-35 anos',
      subtitle: 'Adulto jovem',
      icon: 'user',
      color: '#2196F3',
    },
    {
      id: '36-45',
      title: '36-45 anos',
      subtitle: 'Adulto',
      icon: 'users',
      color: '#9C27B0',
    },
    {
      id: '46-55',
      title: '46-55 anos',
      subtitle: 'Meia idade',
      icon: 'line-chart',
      color: '#FF9800',
    },
    {
      id: '56-65',
      title: '56-65 anos',
      subtitle: 'Experiente',
      icon: 'star',
      color: '#795548',
    },
    {
      id: '65+',
      title: '65+ anos',
      subtitle: 'Sênior',
      icon: 'heart',
      color: '#F44336',
    },
  ];

  // Carregar idade salva ao iniciar a tela
  useEffect(() => {
    carregarIdadeSalva();
  }, []);

  const carregarIdadeSalva = async () => {
    try {
      const idadeSalva = await AsyncStorage.getItem('@idade');
      const faixaIdadeSalva = await AsyncStorage.getItem('@faixaIdade');
      
      if (idadeSalva) {
        setIdade(idadeSalva);
      }
      
      if (faixaIdadeSalva) {
        setIdadeSelecionada(faixaIdadeSalva);
      }
    } catch (error) {
      console.error('Erro ao carregar idade:', error);
    }
  };

  const handleProximo = async () => {
    const idadeFinal = idade || idadeSelecionada;
    
    if (idadeFinal) {
      setIsLoading(true);
      try {
        // Determinar se é idade numérica ou faixa etária
        if (idade) {
          // Salvar idade numérica
          await AsyncStorage.setItem('@idade', idade);
          await AsyncStorage.setItem('@idadeTipo', 'numero');
          // Limpar faixa etária se existir
          await AsyncStorage.removeItem('@faixaIdade');
        } else if (idadeSelecionada) {
          // Salvar faixa etária
          await AsyncStorage.setItem('@faixaIdade', idadeSelecionada);
          await AsyncStorage.setItem('@idadeTipo', 'faixa');
          // Limpar idade numérica se existir
          await AsyncStorage.removeItem('@idade');
          
          // Salvar também a faixa completa
          const faixaCompleta = faixasEtarias.find(f => f.id === idadeSelecionada);
          if (faixaCompleta) {
            await AsyncStorage.setItem('@faixaIdadeCompleta', JSON.stringify(faixaCompleta));
          }
        }
        
        console.log('Idade salva:', idadeFinal);
        
        // Navegar para próxima tela
        router.push('/AlturaScreen');
      } catch (error) {
        console.error('Erro ao salvar idade:', error);
        Alert.alert('Erro', 'Não foi possível salvar sua idade. Tente novamente.');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleVoltar = () => {
    router.push('/SexoScreen');
  };

  const handleIdadeChange = (text: string) => {
    // Permite apenas números
    const numericText = text.replace(/[^0-9]/g, '');
    setIdade(numericText);
    
    // Limpa a seleção de faixa etária quando digita manualmente
    if (numericText) {
      setIdadeSelecionada(null);
    }
  };

  const handleFaixaEtariaPress = (faixaId: string) => {
    setIdadeSelecionada(faixaId);
    // Limpa o campo de entrada manual
    setIdade('');
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
              <Text style={styles.sectionTitle}>📏 Medidas básicas (1 de 3)</Text>
              <Text style={styles.welcomeTitle}>Qual é a sua idade?</Text>
              <Text style={styles.obrigatorio}>* obrigatório</Text>
            </View>
            
            <Text style={styles.subtitle}>
              Informe sua idade ou selecione uma faixa etária para personalizarmos seu plano
            </Text>
            
            {/* INPUT DE IDADE MANUAL */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Digite sua idade:</Text>
              <View style={[
                styles.inputWrapper,
                idade && styles.inputWrapperActive
              ]}>
                <FontAwesome name="birthday-cake" size={22} color={idade ? "#1E88E5" : "#999"} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  value={idade}
                  onChangeText={handleIdadeChange}
                  placeholder="Ex: 30"
                  placeholderTextColor="#999"
                  keyboardType="numeric"
                  maxLength={3}
                />
                {idade ? (
                  <Text style={styles.anosText}>anos</Text>
                ) : null}
              </View>
              <Text style={styles.inputHelpText}>
                Digite sua idade em anos (ex: 25, 30, 42)
              </Text>
            </View>
            
            {/* DIVISOR "OU" */}
            <View style={styles.ouDivider}>
              <View style={styles.ouLine} />
              <Text style={styles.ouText}>ou</Text>
              <View style={styles.ouLine} />
            </View>
            
            {/* FAIXAS ETÁRIAS */}
            <View style={styles.faixasContainer}>
              <Text style={styles.faixasTitle}>Selecione uma faixa etária:</Text>
              
              <View style={styles.faixasGrid}>
                {faixasEtarias.map((faixa) => (
                  <Pressable
                    key={faixa.id}
                    style={[
                      styles.faixaItem,
                      idadeSelecionada === faixa.id && styles.faixaItemSelecionado
                    ]}
                    onPress={() => handleFaixaEtariaPress(faixa.id)}
                  >
                    <View style={[
                      styles.faixaIconContainer,
                      { backgroundColor: `${faixa.color}15` }
                    ]}>
                      <FontAwesome name={faixa.icon as any} size={24} color={faixa.color} />
                    </View>
                    
                    <View style={styles.faixaContent}>
                      <Text style={[
                        styles.faixaTitulo,
                        idadeSelecionada === faixa.id && styles.faixaTituloSelecionado
                      ]}>
                        {faixa.title}
                      </Text>
                      <Text style={styles.faixaSubtitulo}>{faixa.subtitle}</Text>
                    </View>
                    
                    <View style={[
                      styles.radioButton,
                      idadeSelecionada === faixa.id && styles.radioButtonSelecionado
                    ]}>
                      {idadeSelecionada === faixa.id && (
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
                (!idade && !idadeSelecionada || isLoading) && styles.primaryButtonDisabled
              ]}
              onPress={handleProximo}
              disabled={!idade && !idadeSelecionada || isLoading}
            >
              <View style={styles.buttonContent}>
                <FontAwesome name="arrow-right" size={22} color="#FFFFFF" />
                <Text style={styles.primaryText}>
                  {isLoading ? 'Salvando...' : 'Próximo'}
                </Text>
              </View>
              <Text style={styles.buttonSubtitle}>
                {(idade || idadeSelecionada) 
                  ? 'Continue para a próxima etapa' 
                  : 'Informe sua idade para continuar'}
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

  // Estilos para input de idade
  inputContainer: {
    width: '100%',
    marginBottom: 28,
  },

  inputLabel: {
    color: '#000000',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
    textAlign: 'center',
  },

  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#E9ECEF',
    paddingHorizontal: 20,
    paddingVertical: 16,
    marginBottom: 10,
  },

  inputWrapperActive: {
    borderColor: '#1E88E5',
    backgroundColor: '#F0F9FF',
  },

  inputIcon: {
    marginRight: 12,
  },

  input: {
    flex: 1,
    color: '#000000',
    fontSize: 20,
    fontWeight: '600',
    padding: 0,
    minHeight: 30,
  },

  anosText: {
    color: '#1E88E5',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },

  inputHelpText: {
    color: '#666666',
    fontSize: 14,
    textAlign: 'center',
    fontStyle: 'italic',
  },

  // Divisor "OU"
  ouDivider: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginBottom: 28,
  },

  ouLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#E0E0E0',
  },

  ouText: {
    color: '#666666',
    fontSize: 16,
    fontWeight: '600',
    paddingHorizontal: 16,
  },

  // Estilos para faixas etárias
  faixasContainer: {
    width: '100%',
    marginBottom: 28,
  },

  faixasTitle: {
    color: '#000000',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 20,
    textAlign: 'center',
  },

  faixasGrid: {
    gap: 16,
  },

  faixaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 18,
    backgroundColor: '#F8F9FA',
    borderRadius: 14,
    borderWidth: 2,
    borderColor: '#E9ECEF',
    gap: 16,
  },

  faixaItemSelecionado: {
    backgroundColor: '#F0F9FF',
    borderColor: '#1E88E5',
  },

  faixaIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },

  faixaContent: {
    flex: 1,
  },

  faixaTitulo: {
    color: '#000000',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },

  faixaTituloSelecionado: {
    color: '#1E88E5',
  },

  faixaSubtitulo: {
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