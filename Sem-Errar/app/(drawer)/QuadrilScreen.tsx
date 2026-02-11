import FontAwesome from '@expo/vector-icons/FontAwesome';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

export default function QuadrilScreen() {
  const router = useRouter();

  const [quadrilCm, setQuadrilCm] = useState<string>('');
  const [sexo, setSexo] = useState<string>('feminino');
  const [isLoading, setIsLoading] = useState(false);

  // 🔒 Verificar sexo ao entrar na tela
  useEffect(() => {
    verificarSexo();
  }, []);

  const verificarSexo = async () => {
    try {
      const sexoSalvo = await AsyncStorage.getItem('@sexo');

      if (!sexoSalvo || sexoSalvo !== 'feminino') {
        // Se não for feminino, não pode acessar
        router.replace('/CalculoBFScreen');
        return;
      }

      setSexo(sexoSalvo);
    } catch (error) {
      console.error('Erro ao verificar sexo:', error);
      router.replace('/CalculoBFScreen');
    }
  };

  const handleProximo = async () => {
    if (!quadrilCm || Number(quadrilCm) <= 0) {
      Alert.alert('Atenção', 'Digite uma medida válida do quadril');
      return;
    }

    setIsLoading(true);

    try {
      // Salvar quadril
      await AsyncStorage.setItem('@quadrilCm', quadrilCm);

      console.log('Medida do quadril salva:', quadrilCm);

      router.push('/CalculoBFScreen');
    } catch (error) {
      console.error('Erro ao salvar quadril:', error);
      Alert.alert(
        'Erro',
        'Não foi possível salvar a medida do quadril. Tente novamente.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleVoltar = () => {
    router.push('/CinturaScreen');
  };

  const handleCmChange = (text: string) => {
    const numericText = text.replace(/[^0-9.]/g, '');
    const parts = numericText.split('.');
    if (parts.length <= 2) {
      setQuadrilCm(numericText);
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
            />
          </View>

          <View style={styles.content}>
            <Text style={styles.sectionTitle}>
              📐 Medidas corporais (3 de 3)
            </Text>

            <Text style={styles.welcomeTitle}>
              Qual é a medida do seu quadril?
            </Text>

            <Text style={styles.obrigatorio}>* obrigatório</Text>

            <Text style={styles.subtitle}>
              Meça a parte mais larga do quadril, passando pelos glúteos
            </Text>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>
                Digite a medida em centímetros:
              </Text>

              <View
                style={[
                  styles.inputWrapper,
                  quadrilCm && styles.inputWrapperActive,
                ]}
              >
                <FontAwesome
                  name="arrows-alt"
                  size={22}
                  color={quadrilCm ? '#1E88E5' : '#999'}
                  style={styles.inputIcon}
                />

                <TextInput
                  style={styles.input}
                  value={quadrilCm}
                  onChangeText={handleCmChange}
                  placeholder="Ex: 95.5"
                  placeholderTextColor="#999"
                  keyboardType="decimal-pad"
                />

                {quadrilCm ? (
                  <Text style={styles.unidadeTextInput}>cm</Text>
                ) : null}
              </View>
            </View>

            <View style={styles.divider} />

            <Pressable
              style={[
                styles.primaryButton,
                (!quadrilCm || isLoading) && styles.primaryButtonDisabled,
              ]}
              onPress={handleProximo}
              disabled={!quadrilCm || isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <>
                  <View style={styles.buttonContent}>
                    <FontAwesome
                      name="calculator"
                      size={22}
                      color="#FFFFFF"
                    />
                    <Text style={styles.primaryText}>
                      Calcular BF
                    </Text>
                  </View>

                  <Text style={styles.buttonSubtitle}>
                    Calcular percentual de gordura
                  </Text>
                </>
              )}
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
    backgroundColor: '#FCE4EC', 
    justifyContent: 'center', 
    alignItems: 'center', 
    borderWidth: 2, 
    borderColor: '#E91E63', 
    position: 'relative' 
  },
  hipsIndicator: { position: 'absolute', bottom: 20, right: -8 },
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