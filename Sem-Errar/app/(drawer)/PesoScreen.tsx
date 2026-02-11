import FontAwesome from '@expo/vector-icons/FontAwesome';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert, Image, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

export default function PesoScreen() {
  const router = useRouter();
  
  const [pesoKg, setPesoKg] = useState<string>('');
  const [unidadeSelecionada, setUnidadeSelecionada] = useState<'kg' | 'lb'>('kg');
  const [pesoLb, setPesoLb] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  // Carregar peso salvo ao iniciar a tela
  useEffect(() => {
    carregarPesoSalvo();
  }, []);

  const carregarPesoSalvo = async () => {
    try {
      const unidadeSalva = await AsyncStorage.getItem('@pesoUnidade');
      
      if (unidadeSalva === 'kg') {
        setUnidadeSelecionada('kg');
        const pesoKgSalvo = await AsyncStorage.getItem('@pesoKg');
        if (pesoKgSalvo) {
          setPesoKg(pesoKgSalvo);
        }
      } else if (unidadeSalva === 'lb') {
        setUnidadeSelecionada('lb');
        const pesoLbSalvo = await AsyncStorage.getItem('@pesoLb');
        if (pesoLbSalvo) {
          setPesoLb(pesoLbSalvo);
        }
      }
    } catch (error) {
      console.error('Erro ao carregar peso:', error);
    }
  };

  const handleProximo = async () => {
    if ((unidadeSelecionada === 'kg' && pesoKg) || (unidadeSelecionada === 'lb' && pesoLb)) {
      setIsLoading(true);
      
      try {
        // Salvar no AsyncStorage
        await AsyncStorage.setItem('@pesoUnidade', unidadeSelecionada);
        
        if (unidadeSelecionada === 'kg') {
          await AsyncStorage.setItem('@pesoKg', pesoKg);
          // Salvar também o valor convertido para kg (para consistência)
          await AsyncStorage.setItem('@pesoEmKg', pesoKg);
          // Limpar dados em lb se existirem
          await AsyncStorage.removeItem('@pesoLb');
          
          console.log('Peso salvo (kg):', pesoKg);
        } else {
          await AsyncStorage.setItem('@pesoLb', pesoLb);
          
          // Calcular e salvar também em kg para cálculos (como IMC)
          const pesoEmKg = converterParaKg(pesoLb);
          await AsyncStorage.setItem('@pesoEmKg', pesoEmKg);
          
          // Limpar dados em kg se existirem
          await AsyncStorage.removeItem('@pesoKg');
          
          console.log('Peso salvo (lb):', pesoLb, `(${pesoEmKg} kg)`);
        }
        
        // Navegar para próxima tela
        router.push('/TreinoScreen');
      } catch (error) {
        console.error('Erro ao salvar peso:', error);
        Alert.alert('Erro', 'Não foi possível salvar seu peso. Tente novamente.');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleVoltar = () => {
    router.push('/AlturaScreen');
  };

  const handleKgChange = (text: string) => {
    // Permite números e um ponto decimal
    const cleanedText = text.replace(/[^0-9.]/g, '');
    
    // Verifica se há mais de um ponto
    const parts = cleanedText.split('.');
    if (parts.length <= 2) {
      // Verifica se há mais de uma casa decimal
      if (parts.length === 2 && parts[1].length > 1) {
        // Permite apenas uma casa decimal
        setPesoKg(parts[0] + '.' + parts[1].charAt(0));
      } else {
        setPesoKg(cleanedText);
      }
    }
  };

  const handleLbChange = (text: string) => {
    // Permite números e um ponto decimal
    const cleanedText = text.replace(/[^0-9.]/g, '');
    
    // Verifica se há mais de um ponto
    const parts = cleanedText.split('.');
    if (parts.length <= 2) {
      // Verifica se há mais de uma casa decimal
      if (parts.length === 2 && parts[1].length > 1) {
        // Permite apenas uma casa decimal
        setPesoLb(parts[0] + '.' + parts[1].charAt(0));
      } else {
        setPesoLb(cleanedText);
      }
    }
  };

  const converterParaKg = (lb: string): string => {
    const lbNum = parseFloat(lb) || 0;
    return (lbNum * 0.453592).toFixed(1);
  };

  const temPesoInformado = () => {
    if (unidadeSelecionada === 'kg') {
      return !!pesoKg;
    } else {
      return !!pesoLb;
    }
  };

  return (
    <View style={styles.background}>
      <View style={styles.headerContainer}>
        <Pressable style={styles.backButton} onPress={handleVoltar}>
          <FontAwesome name="arrow-left" size={20} color="#1E88E5" />
          <Text style={styles.backButtonText}>Voltar</Text>
        </Pressable>
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.mainContainer}>
          <View style={styles.imageContainer}>
            <Image source={require('@/assets/images/logo2.png')} style={styles.topImage} resizeMode="cover" />
          </View>

          <View style={styles.content}>
            <View style={styles.headerSection}>
              <Text style={styles.sectionTitle}>📏 Medidas básicas (3 de 3)</Text>
              <Text style={styles.welcomeTitle}>Qual é o seu peso atual?</Text>
              <Text style={styles.obrigatorio}>* obrigatório</Text>
            </View>

            <Text style={styles.subtitle}>
              Informe seu peso para calcularmos seu IMC e personalizar seu plano
            </Text>

            <View style={styles.unidadeContainer}>
              <Pressable 
                style={[styles.unidadeButton, unidadeSelecionada === 'kg' && styles.unidadeButtonSelecionado]} 
                onPress={() => setUnidadeSelecionada('kg')}
              >
                <FontAwesome name="balance-scale" size={20} color={unidadeSelecionada === 'kg' ? "#1E88E5" : "#666"} />
                <Text style={[styles.unidadeText, unidadeSelecionada === 'kg' && styles.unidadeTextSelecionado]}>
                  Quilogramas (kg)
                </Text>
              </Pressable>

              <Pressable 
                style={[styles.unidadeButton, unidadeSelecionada === 'lb' && styles.unidadeButtonSelecionado]} 
                onPress={() => setUnidadeSelecionada('lb')}
              >
                <FontAwesome name="exchange" size={20} color={unidadeSelecionada === 'lb' ? "#1E88E5" : "#666"} />
                <Text style={[styles.unidadeText, unidadeSelecionada === 'lb' && styles.unidadeTextSelecionado]}>
                  Libras (lb)
                </Text>
              </Pressable>
            </View>

            {unidadeSelecionada === 'kg' && (
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Digite seu peso em quilogramas:</Text>
                <View style={[styles.inputWrapper, pesoKg && styles.inputWrapperActive]}>
                  <FontAwesome name="balance-scale" size={22} color={pesoKg ? "#1E88E5" : "#999"} style={styles.inputIcon} />
                  <TextInput 
                    style={styles.input} 
                    value={pesoKg} 
                    onChangeText={handleKgChange} 
                    placeholder="Ex: 75.5" 
                    placeholderTextColor="#999" 
                    keyboardType="decimal-pad" 
                  />
                  {pesoKg ? <Text style={styles.unidadeTextInput}>kg</Text> : null}
                </View>
                <Text style={styles.inputHelpText}>
                  Exemplo: 68.5 kg, 82 kg, 75.3 kg
                </Text>
              </View>
            )}

            {unidadeSelecionada === 'lb' && (
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Digite seu peso em libras:</Text>
                <View style={[styles.inputWrapper, pesoLb && styles.inputWrapperActive]}>
                  <FontAwesome name="balance-scale" size={22} color={pesoLb ? "#1E88E5" : "#999"} style={styles.inputIcon} />
                  <TextInput 
                    style={styles.input} 
                    value={pesoLb} 
                    onChangeText={handleLbChange} 
                    placeholder="Ex: 165" 
                    placeholderTextColor="#999" 
                    keyboardType="decimal-pad" 
                  />
                  {pesoLb ? <Text style={styles.unidadeTextInput}>lb</Text> : null}
                </View>
                <Text style={styles.inputHelpText}>
                  {pesoLb 
                    ? `Equivalente a: ${converterParaKg(pesoLb)} kg`
                    : "Exemplo: 150 lb, 180.5 lb, 200 lb"
                  }
                </Text>
              </View>
            )}

            <View style={styles.divider} />

            <Pressable 
              style={[
                styles.primaryButton, 
                (!temPesoInformado() || isLoading) && styles.primaryButtonDisabled
              ]} 
              onPress={handleProximo} 
              disabled={!temPesoInformado() || isLoading}
            >
              <View style={styles.buttonContent}>
                <FontAwesome name="arrow-right" size={22} color="#FFFFFF" />
                <Text style={styles.primaryText}>
                  {isLoading ? 'Salvando...' : 'Próximo'}
                </Text>
              </View>
              <Text style={styles.buttonSubtitle}>
                {temPesoInformado() ? 'Continue para a próxima etapa' : 'Informe seu peso para continuar'}
              </Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}


const styles = StyleSheet.create({
  background: { flex: 1, backgroundColor: '#FFFFFF' },
  headerContainer: { backgroundColor: '#FFFFFF', borderBottomWidth: 1, borderBottomColor: '#E0E0E0', zIndex: 10 },
  backButton: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 16 },
  backButtonText: { color: '#1E88E5', fontSize: 16, fontWeight: '600', marginLeft: 8 },
  scrollView: { flex: 1 },
  scrollContent: { flexGrow: 1, paddingTop: 15, paddingBottom: 30, paddingHorizontal: 5 },
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
    marginTop: 5 
  },
  imageContainer: { height: 170, width: '100%', overflow: 'hidden', backgroundColor: '#F5F5F5' },
  topImage: { width: '100%', height: '100%', resizeMode: 'cover' },
  content: { paddingHorizontal: 24, paddingTop: 28, paddingBottom: 28, alignItems: 'center' },
  headerSection: { alignItems: 'center', marginBottom: 20 },
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
    borderColor: '#1E88E5' 
  },
  welcomeTitle: { color: '#000000', fontSize: 26, fontWeight: '700', textAlign: 'center', marginBottom: 8, lineHeight: 32 },
  obrigatorio: { color: '#FF5722', fontSize: 14, fontWeight: '600', textAlign: 'center', marginBottom: 22 },
  subtitle: { color: '#666666', fontSize: 17, textAlign: 'center', marginBottom: 32, lineHeight: 24 },
  unidadeContainer: { flexDirection: 'row', width: '100%', gap: 12, marginBottom: 28 },
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
    gap: 10 
  },
  unidadeButtonSelecionado: { backgroundColor: '#F0F9FF', borderColor: '#1E88E5' },
  unidadeText: { color: '#666666', fontSize: 15, fontWeight: '500' },
  unidadeTextSelecionado: { color: '#1E88E5', fontWeight: '600' },
  inputContainer: { width: '100%', marginBottom: 28 },
  inputLabel: { color: '#000000', fontSize: 18, fontWeight: '600', marginBottom: 12, textAlign: 'center' },
  inputWrapper: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: '#F8F9FA', 
    borderRadius: 16, 
    borderWidth: 2, 
    borderColor: '#E9ECEF', 
    paddingHorizontal: 20, 
    paddingVertical: 16, 
    marginBottom: 10 
  },
  inputWrapperActive: { borderColor: '#1E88E5', backgroundColor: '#F0F9FF' },
  inputIcon: { marginRight: 12 },
  input: { flex: 1, color: '#000000', fontSize: 20, fontWeight: '600', padding: 0, minHeight: 30 },
  unidadeTextInput: { color: '#1E88E5', fontSize: 16, fontWeight: '600', marginLeft: 8 },
  inputHelpText: { color: '#666666', fontSize: 14, textAlign: 'center', fontStyle: 'italic' },
  divider: { height: 1, width: '100%', backgroundColor: '#E0E0E0', marginVertical: 22 },
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
    marginBottom: 12 
  },
  primaryButtonDisabled: { backgroundColor: '#CCCCCC', shadowColor: '#CCCCCC' },
  buttonContent: { flexDirection: 'row', alignItems: 'center', gap: 14, marginBottom: 8 },
  primaryText: { color: '#FFFFFF', fontSize: 21, fontWeight: '700' },
  buttonSubtitle: { color: 'rgba(255, 255, 255, 0.9)', fontSize: 15, fontWeight: '500', textAlign: 'center' },
});