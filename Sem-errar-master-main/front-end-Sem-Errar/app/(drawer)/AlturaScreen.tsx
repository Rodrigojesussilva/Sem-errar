import FontAwesome from '@expo/vector-icons/FontAwesome';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert, Image, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

export default function AlturaScreen() {
  const router = useRouter();
  
  const [alturaCm, setAlturaCm] = useState<string>('');
  const [unidadeSelecionada, setUnidadeSelecionada] = useState<'cm' | 'ft'>('cm');
  const [alturaFt, setAlturaFt] = useState<string>('');
  const [alturaIn, setAlturaIn] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  // Carregar altura salva ao iniciar a tela
  useEffect(() => {
    carregarAlturaSalva();
  }, []);

  const carregarAlturaSalva = async () => {
    try {
      const alturaSalva = await AsyncStorage.getItem('@altura');
      const unidadeSalva = await AsyncStorage.getItem('@alturaUnidade');
      
      if (unidadeSalva === 'cm') {
        setUnidadeSelecionada('cm');
        if (alturaSalva) {
          setAlturaCm(alturaSalva);
        }
      } else if (unidadeSalva === 'ft') {
        setUnidadeSelecionada('ft');
        const ftSalva = await AsyncStorage.getItem('@alturaFt');
        const inSalva = await AsyncStorage.getItem('@alturaIn');
        
        if (ftSalva) setAlturaFt(ftSalva);
        if (inSalva) setAlturaIn(inSalva);
      }
    } catch (error) {
      console.error('Erro ao carregar altura:', error);
    }
  };

  const converterParaCm = (ft: string, inches: string) => {
    const ftNum = parseFloat(ft) || 0;
    const inNum = parseFloat(inches) || 0;
    const totalInches = (ftNum * 12) + inNum;
    return Math.round(totalInches * 2.54);
  };

  const handleProximo = async () => {
    if ((unidadeSelecionada === 'cm' && alturaCm) || 
        (unidadeSelecionada === 'ft' && (alturaFt || alturaIn))) {
      setIsLoading(true);
      
      try {
        // Salvar no AsyncStorage
        await AsyncStorage.setItem('@alturaUnidade', unidadeSelecionada);
        
        if (unidadeSelecionada === 'cm') {
          await AsyncStorage.setItem('@altura', alturaCm);
          // Limpar dados do sistema imperial se existirem
          await AsyncStorage.removeItem('@alturaFt');
          await AsyncStorage.removeItem('@alturaIn');
          
          console.log('Altura salva (cm):', alturaCm);
        } else {
          await AsyncStorage.setItem('@alturaFt', alturaFt || '0');
          await AsyncStorage.setItem('@alturaIn', alturaIn || '0');
          
          // Calcular e salvar também em cm para facilitar cálculos futuros
          const alturaEmCm = converterParaCm(alturaFt, alturaIn);
          await AsyncStorage.setItem('@alturaEmCm', alturaEmCm.toString());
          
          // Limpar dados do sistema métrico se existirem
          await AsyncStorage.removeItem('@altura');
          
          console.log('Altura salva (ft/in):', `${alturaFt || 0}'${alturaIn || 0}"`, `(${alturaEmCm} cm)`);
        }
        
        // Navegar para próxima tela
        router.push('/PesoScreen');
      } catch (error) {
        console.error('Erro ao salvar altura:', error);
        Alert.alert('Erro', 'Não foi possível salvar sua altura. Tente novamente.');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleVoltar = () => {
    router.push('/IdadeScreen');
  };

  const handleCmChange = (text: string) => {
    const numericText = text.replace(/[^0-9]/g, '');
    setAlturaCm(numericText);
  };

  const handleFtChange = (text: string) => {
    const numericText = text.replace(/[^0-9]/g, '');
    setAlturaFt(numericText);
  };

  const handleInChange = (text: string) => {
    const numericText = text.replace(/[^0-9]/g, '');
    setAlturaIn(numericText);
  };

  const temAlturaInformada = () => {
    if (unidadeSelecionada === 'cm') {
      return !!alturaCm;
    } else {
      return !!(alturaFt || alturaIn);
    }
  };

  return (
    <View style={styles.background}>
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
        <View style={styles.mainContainer}>
          <View style={styles.imageContainer}>
            <Image
              source={require('@/assets/images/logo2.png')}
              style={styles.topImage}
              resizeMode="cover"
            />
          </View>
          
          <View style={styles.content}>
            <View style={styles.headerSection}>
              <Text style={styles.sectionTitle}>📏 Medidas básicas (2 de 3)</Text>
              <Text style={styles.welcomeTitle}>Qual é a sua altura?</Text>
              <Text style={styles.obrigatorio}>* obrigatório</Text>
            </View>
            
            <Text style={styles.subtitle}>
              Informe sua altura para calcularmos seu IMC e personalizar seu plano
            </Text>
            
            <View style={styles.unidadeContainer}>
              <Pressable
                style={[
                  styles.unidadeButton,
                  unidadeSelecionada === 'cm' && styles.unidadeButtonSelecionado
                ]}
                onPress={() => setUnidadeSelecionada('cm')}
              >
                <FontAwesome 
                  name="sort-amount-desc"
                  size={20} 
                  color={unidadeSelecionada === 'cm' ? "#1E88E5" : "#666"} 
                />
                <Text style={[
                  styles.unidadeText,
                  unidadeSelecionada === 'cm' && styles.unidadeTextSelecionado
                ]}>
                  Centímetros (cm)
                </Text>
              </Pressable>
              
              <Pressable
                style={[
                  styles.unidadeButton,
                  unidadeSelecionada === 'ft' && styles.unidadeButtonSelecionado
                ]}
                onPress={() => setUnidadeSelecionada('ft')}
              >
                <FontAwesome 
                  name="exchange"
                  size={20} 
                  color={unidadeSelecionada === 'ft' ? "#1E88E5" : "#666"} 
                />
                <Text style={[
                  styles.unidadeText,
                  unidadeSelecionada === 'ft' && styles.unidadeTextSelecionado
                ]}>
                  Pés/Polegadas (ft/in)
                </Text>
              </Pressable>
            </View>
            
            {unidadeSelecionada === 'cm' && (
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Digite sua altura em centímetros:</Text>
                <View style={[
                  styles.inputWrapper,
                  alturaCm && styles.inputWrapperActive
                ]}>
                  <FontAwesome name="arrows-v" size={22} color={alturaCm ? "#1E88E5" : "#999"} style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    value={alturaCm}
                    onChangeText={handleCmChange}
                    placeholder="Ex: 175"
                    placeholderTextColor="#999"
                    keyboardType="numeric"
                    maxLength={3}
                  />
                  {alturaCm ? (
                    <Text style={styles.unidadeTextInput}>cm</Text>
                  ) : null}
                </View>
                <Text style={styles.inputHelpText}>
                  Exemplo: 160 cm = 1.60m, 180 cm = 1.80m
                </Text>
              </View>
            )}
            
            {unidadeSelecionada === 'ft' && (
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Digite sua altura em pés e polegadas:</Text>
                
                <View style={styles.dualInputContainer}>
                  <View style={[
                    styles.dualInputWrapper,
                    alturaFt && styles.inputWrapperActive
                  ]}>
                    <FontAwesome name="user" size={20} color={alturaFt ? "#1E88E5" : "#999"} style={styles.inputIcon} />
                    <TextInput
                      style={styles.dualInput}
                      value={alturaFt}
                      onChangeText={handleFtChange}
                      placeholder="Pés"
                      placeholderTextColor="#999"
                      keyboardType="numeric"
                      maxLength={2}
                    />
                    <Text style={styles.dualInputLabel}>pés</Text>
                  </View>
                  
                  <View style={[
                    styles.dualInputWrapper,
                    alturaIn && styles.inputWrapperActive
                  ]}>
                    <FontAwesome name="arrows-v" size={20} color={alturaIn ? "#1E88E5" : "#999"} style={styles.inputIcon} />
                    <TextInput
                      style={styles.dualInput}
                      value={alturaIn}
                      onChangeText={handleInChange}
                      placeholder="Pol"
                      placeholderTextColor="#999"
                      keyboardType="numeric"
                      maxLength={2}
                    />
                    <Text style={styles.dualInputLabel}>polegadas</Text>
                  </View>
                </View>
                
                <Text style={styles.inputHelpText}>
                  {alturaFt || alturaIn 
                    ? `Equivalente a: ${converterParaCm(alturaFt, alturaIn)} cm`
                    : "Exemplo: 5'9\" = 5 pés e 9 polegadas"
                  }
                </Text>
              </View>
            )}
            
            <View style={styles.divider} />
            
            <Pressable 
              style={[
                styles.primaryButton,
                (!temAlturaInformada() || isLoading) && styles.primaryButtonDisabled
              ]}
              onPress={handleProximo}
              disabled={!temAlturaInformada() || isLoading}
            >
              <View style={styles.buttonContent}>
                <FontAwesome name="arrow-right" size={22} color="#FFFFFF" />
                <Text style={styles.primaryText}>
                  {isLoading ? 'Salvando...' : 'Próximo'}
                </Text>
              </View>
              <Text style={styles.buttonSubtitle}>
                {temAlturaInformada() 
                  ? 'Continue para a próxima etapa' 
                  : 'Informe sua altura para continuar'}
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

  unidadeContainer: {
    flexDirection: 'row',
    width: '100%',
    gap: 12,
    marginBottom: 28,
  },

  unidadeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#E9ECEF',
    gap: 10,
  },

  unidadeButtonSelecionado: {
    backgroundColor: '#F0F9FF',
    borderColor: '#1E88E5',
  },

  unidadeText: {
    color: '#666666',
    fontSize: 15,
    fontWeight: '500',
  },

  unidadeTextSelecionado: {
    color: '#1E88E5',
    fontWeight: '600',
  },

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

  unidadeTextInput: {
    color: '#1E88E5',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },

  dualInputContainer: {
    flexDirection: 'row',
    width: '100%',
    gap: 12,
    marginBottom: 10,
  },

  dualInputWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#E9ECEF',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },

  dualInput: {
    flex: 1,
    color: '#000000',
    fontSize: 18,
    fontWeight: '600',
    padding: 0,
    minHeight: 30,
    textAlign: 'center',
  },

  dualInputLabel: {
    color: '#666666',
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 8,
    minWidth: 60,
  },

  inputHelpText: {
    color: '#666666',
    fontSize: 14,
    textAlign: 'center',
    fontStyle: 'italic',
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