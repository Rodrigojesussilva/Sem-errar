import FontAwesome from '@expo/vector-icons/FontAwesome';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert, Image, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

export default function PescocoScreen() {
  const router = useRouter();

  const [pescocoCm, setPescocoCm] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  // Carregar medida salva
  useEffect(() => {
    const carregarMedida = async () => {
      try {
        const salvo = await AsyncStorage.getItem('@pescocoCm');
        if (salvo) setPescocoCm(salvo);
      } catch (error) {
        console.error('Erro ao carregar:', error);
      }
    };
    carregarMedida();
  }, []);

  const handleProximo = async () => {
    if (pescocoCm) {
      setIsLoading(true);

      try {
        // Salvar medida do pescoço
        await AsyncStorage.setItem('@pescocoCm', pescocoCm);

        console.log('Medida do pescoço salva:', pescocoCm);

        // Navegar para próxima tela
        router.push('/CinturaScreen');
      } catch (error) {
        console.error('Erro ao salvar medida do pescoço:', error);
        Alert.alert(
          'Erro',
          'Não foi possível salvar a medida do pescoço. Tente novamente.'
        );
      } finally {
        setIsLoading(false);
      }
    } else {
      Alert.alert('Atenção', 'Digite a medida do pescoço');
    }
  };


  const handleVoltar = () => {
    router.push('/DiasFixosScreen');
  };

  const handleCmChange = (text: string) => {
    // Aceita apenas números e um ponto
    const cleaned = text.replace(/[^0-9.]/g, '');
    const parts = cleaned.split('.');
    if (parts.length <= 2) {
      if (parts.length === 2 && parts[1].length > 1) {
        setPescocoCm(parts[0] + '.' + parts[1].charAt(0));
      } else {
        setPescocoCm(cleaned);
      }
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
              <Text style={styles.sectionTitle}>📐 Medidas corporais (1 de 3)</Text>
              <Text style={styles.welcomeTitle}>Qual é a medida do seu pescoço?</Text>
              <Text style={styles.obrigatorio}>* obrigatório</Text>
            </View>

            <Text style={styles.subtitle}>
              Meça a parte mais estreita do pescoço, logo abaixo do pomo de Adão
            </Text>

            <View style={styles.illustrationContainer}>
              <View style={styles.illustrationCircle}>
                <FontAwesome name="user-circle" size={80} color="#1E88E5" />
                <View style={styles.neckIndicator}>
                  <FontAwesome name="circle" size={16} color="#FF5722" />
                </View>
              </View>
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Digite a medida em centímetros:</Text>
              <View style={[styles.inputWrapper, pescocoCm && styles.inputWrapperActive]}>
                <FontAwesome name="arrows-alt" size={22} color={pescocoCm ? "#1E88E5" : "#999"} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  value={pescocoCm}
                  onChangeText={handleCmChange}
                  placeholder="Ex: 38.5"
                  placeholderTextColor="#999"
                  keyboardType="decimal-pad"
                />
                {pescocoCm ? <Text style={styles.unidadeTextInput}>cm</Text> : null}
              </View>
              <Text style={styles.inputHelpText}>
                Use uma fita métrica flexível para maior precisão
              </Text>
            </View>

            <View style={styles.tipsContainer}>
              <Text style={styles.tipsTitle}>Dicas para medir:</Text>
              <View style={styles.tipItem}>
                <FontAwesome name="check-circle" size={16} color="#4CAF50" />
                <Text style={styles.tipText}>Fita paralela ao chão</Text>
              </View>
              <View style={styles.tipItem}>
                <FontAwesome name="check-circle" size={16} color="#4CAF50" />
                <Text style={styles.tipText}>Não aperte demais</Text>
              </View>
              <View style={styles.tipItem}>
                <FontAwesome name="check-circle" size={16} color="#4CAF50" />
                <Text style={styles.tipText}>Olhe para frente</Text>
              </View>
            </View>

            <View style={styles.divider} />

            <Pressable
              style={[styles.primaryButton, (!pescocoCm || isLoading) && styles.primaryButtonDisabled]}
              onPress={handleProximo}
              disabled={!pescocoCm || isLoading}
            >
              <View style={styles.buttonContent}>
                <FontAwesome name="arrow-right" size={22} color="#FFFFFF" />
                <Text style={styles.primaryText}>{isLoading ? 'Salvando...' : 'Próximo'}</Text>
              </View>
              <Text style={styles.buttonSubtitle}>
                {pescocoCm ? 'Continue para a próxima medida' : 'Informe a medida para continuar'}
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
  illustrationContainer: { alignItems: 'center', marginBottom: 30 },
  illustrationCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#F0F9FF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#1E88E5',
    position: 'relative'
  },
  neckIndicator: { position: 'absolute', top: 40, right: -8 },
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
  tipsContainer: {
    width: '100%',
    backgroundColor: '#F8F9FA',
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    marginBottom: 25
  },
  tipsTitle: { fontSize: 16, fontWeight: '600', color: '#333', marginBottom: 12 },
  tipItem: { flexDirection: 'row', alignItems: 'center', marginBottom: 8, gap: 10 },
  tipText: { fontSize: 15, color: '#555' },
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