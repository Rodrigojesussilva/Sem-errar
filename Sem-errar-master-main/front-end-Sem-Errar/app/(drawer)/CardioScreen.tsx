import FontAwesome from '@expo/vector-icons/FontAwesome';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert, Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

export default function CardioScreen() {
  const router = useRouter();
  const [cardioSelecionado, setCardioSelecionado] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const opcoesCardio = [
    { id: 'nao', title: 'Não faço', icon: 'times-circle', color: '#F44336' },
    { id: 'raramente', title: 'Raramente', icon: 'meh-o', color: '#FF9800' },
    { id: '1-2', title: '1–2x por semana', icon: 'heartbeat', color: '#4CAF50' },
    { id: '3-4', title: '3–4x por semana', icon: 'heart', color: '#2196F3' },
    { id: 'quase-todos', title: 'Quase todos os dias', icon: 'fire', color: '#E91E63' },
  ];

  // Carregar dados ao iniciar a tela
  useEffect(() => {
    carregarCardioSalvo();
  }, []);

  const carregarCardioSalvo = async () => {
    try {
      const cardioSalvo = await AsyncStorage.getItem('@frequenciaCardio');
      if (cardioSalvo) {
        setCardioSelecionado(cardioSalvo);
      }
    } catch (error) {
      console.error('Erro ao carregar cardio:', error);
    }
  };

  const handleProximo = async () => {
    if (cardioSelecionado) {
      setIsLoading(true);
      
      try {
        // Salvar frequência de cardio
        await AsyncStorage.setItem('@frequenciaCardio', cardioSelecionado);
        
        // Salvar também a descrição
        const cardioSelecionadoObj = opcoesCardio.find(c => c.id === cardioSelecionado);
        if (cardioSelecionadoObj) {
          await AsyncStorage.setItem('@frequenciaCardioDescricao', cardioSelecionadoObj.title);
        }
        
        console.log('Cardio salvo:', cardioSelecionado);
        
        // Navegar para próxima tela
        router.push('/RegistrarTreinoScreen');
      } catch (error) {
        console.error('Erro ao salvar cardio:', error);
        Alert.alert('Erro', 'Não foi possível salvar sua informação de cardio. Tente novamente.');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleVoltar = () => {
    router.push('/AguaScreen');
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
            <Text style={styles.welcomeTitle}>Com que frequência você faz cardio?</Text>
            <Text style={styles.obrigatorio}>* obrigatório</Text>
            
            <Text style={styles.subtitle}>
              Cardio inclui caminhadas, corridas, bike, natação e outras atividades
            </Text>
            
            <View style={styles.opcoesContainer}>
              {opcoesCardio.map((opcao) => (
                <Pressable 
                  key={opcao.id} 
                  style={[
                    styles.opcaoItem, 
                    cardioSelecionado === opcao.id && styles.opcaoItemSelecionado
                  ]} 
                  onPress={() => setCardioSelecionado(opcao.id)}
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
                    cardioSelecionado === opcao.id && styles.radioButtonSelecionado
                  ]}>
                    {cardioSelecionado === opcao.id && <View style={styles.radioButtonInner} />}
                  </View>
                </Pressable>
              ))}
            </View>
            
            <View style={styles.divider} />
            
            <Pressable 
              style={[
                styles.primaryButton, 
                (!cardioSelecionado || isLoading) && styles.primaryButtonDisabled
              ]} 
              onPress={handleProximo} 
              disabled={!cardioSelecionado || isLoading}
            >
              <View style={styles.buttonContent}>
                <FontAwesome name="arrow-right" size={22} color="#FFFFFF" />
                <Text style={styles.primaryText}>
                  {isLoading ? 'Salvando...' : 'Próximo'}
                </Text>
              </View>
              <Text style={styles.buttonSubtitle}>
                {cardioSelecionado ? 'Continue para a próxima etapa' : 'Selecione uma opção para continuar'}
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
  welcomeTitle: { color: '#000000', fontSize: 26, fontWeight: '700', textAlign: 'center', marginBottom: 8, lineHeight: 32 },
  obrigatorio: { color: '#FF5722', fontSize: 14, fontWeight: '600', textAlign: 'center', marginBottom: 22 },
  subtitle: { color: '#666666', fontSize: 17, textAlign: 'center', marginBottom: 32, lineHeight: 24 },
  opcoesContainer: { width: '100%', gap: 20, marginBottom: 25 },
  opcaoItem: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    paddingVertical: 20, 
    paddingHorizontal: 16, 
    backgroundColor: '#F8F9FA', 
    borderRadius: 12, 
    borderWidth: 2, 
    borderColor: '#E9ECEF', 
    gap: 20 
  },
  opcaoItemSelecionado: { backgroundColor: '#F0F9FF', borderColor: '#1E88E5' },
  opcaoIconContainer: { width: 60, height: 60, borderRadius: 30, justifyContent: 'center', alignItems: 'center' },
  opcaoContent: { flex: 1 },
  opcaoTitulo: { color: '#000000', fontSize: 18, fontWeight: '600', marginBottom: 4 },
  radioButton: { width: 24, height: 24, borderRadius: 12, borderWidth: 2, borderColor: '#CCCCCC', justifyContent: 'center', alignItems: 'center' },
  radioButtonSelecionado: { borderColor: '#1E88E5', backgroundColor: '#1E88E5' },
  radioButtonInner: { width: 12, height: 12, borderRadius: 6, backgroundColor: '#FFFFFF' },
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