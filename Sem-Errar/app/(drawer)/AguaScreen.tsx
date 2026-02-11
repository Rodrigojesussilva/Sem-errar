import FontAwesome from '@expo/vector-icons/FontAwesome';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert, Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

export default function AguaScreen() {
  const router = useRouter();
  
  const [aguaSelecionada, setAguaSelecionada] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [aguaRecomendada, setAguaRecomendada] = useState<number | null>(null);

  const opcoesAgua = [
    {
      id: 'sim',
      title: '💧 Sim, quero lembretes',
      subtitle: 'Vou te lembrar de beber água durante o dia',
      icon: 'tint',
      color: '#2196F3',
    },
    {
      id: 'nao',
      title: 'Não agora',
      subtitle: 'Prefiro gerenciar minha hidratação sozinho',
      icon: 'bell-slash',
      color: '#9E9E9E',
    },
  ];

  // Carregar dados ao iniciar a tela
  useEffect(() => {
    carregarDados();
  }, []);

  const carregarDados = async () => {
    try {
      // Carregar preferência de água salva
      const aguaSalva = await AsyncStorage.getItem('@querLembretesAgua');
      if (aguaSalva) {
        setAguaSelecionada(aguaSalva);
      }
      
      // Calcular água recomendada baseada no peso
      await calcularAguaRecomendada();
    } catch (error) {
      console.error('Erro ao carregar dados de água:', error);
    }
  };

  const calcularAguaRecomendada = async () => {
    try {
      const pesoEmKg = await AsyncStorage.getItem('@pesoEmKg');
      
      if (pesoEmKg) {
        const pesoNum = parseFloat(pesoEmKg) || 70;
        // Fórmula: 35ml por kg de peso corporal
        const aguaRecomendadaLitros = Math.round((pesoNum * 35) / 1000);
        setAguaRecomendada(aguaRecomendadaLitros);
        
        // Salvar cálculo para uso futuro
        await AsyncStorage.setItem('@aguaRecomendadaLitros', aguaRecomendadaLitros.toString());
        await AsyncStorage.setItem('@coposAguaRecomendados', (aguaRecomendadaLitros * 4).toString()); // 1 copo = 250ml
      }
    } catch (error) {
      console.error('Erro ao calcular água recomendada:', error);
    }
  };

  const handleProximo = async () => {
    if (aguaSelecionada) {
      setIsLoading(true);
      
      try {
        // Salvar preferência de lembretes de água
        await AsyncStorage.setItem('@querLembretesAgua', aguaSelecionada);
        
        console.log('Preferência de água salva:', aguaSelecionada);
        
        // Se selecionou sim para lembretes, configurar valor padrão para copos de água
        if (aguaSelecionada === 'sim') {
          await AsyncStorage.setItem('@coposAguaDia', '8'); // Valor padrão
        }
        
        // Navegar para tela de finalização
        router.push('/CardioScreen');
      } catch (error) {
        console.error('Erro ao salvar preferência de água:', error);
        Alert.alert('Erro', 'Não foi possível salvar sua preferência. Tente novamente.');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleVoltar = () => {
    router.push('/FrequenciaScreen');
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
            <Text style={styles.welcomeTitle}>Quer ajuda para beber mais água durante o dia?</Text>
            
            <Text style={styles.subtitle}>
              A hidratação adequada é essencial para seus resultados
            </Text>
            
            {/* Informação sobre água recomendada */}
            {aguaRecomendada && (
              <View style={styles.infoContainer}>
                <FontAwesome name="tint" size={24} color="#2196F3" />
                <Text style={styles.infoText}>
                  Baseado no seu peso, recomendamos aproximadamente{' '}
                  <Text style={styles.infoHighlight}>{aguaRecomendada}L</Text> de água por dia
                </Text>
              </View>
            )}
            
            <View style={styles.opcoesContainer}>
              {opcoesAgua.map((opcao) => (
                <Pressable 
                  key={opcao.id} 
                  style={[
                    styles.opcaoItem, 
                    aguaSelecionada === opcao.id && styles.opcaoItemSelecionado
                  ]} 
                  onPress={() => setAguaSelecionada(opcao.id)}
                >
                  <View style={[
                    styles.opcaoIconContainer, 
                    { backgroundColor: `${opcao.color}15` }
                  ]}>
                    <FontAwesome name={opcao.icon as any} size={28} color={opcao.color} />
                  </View>
                  
                  <View style={styles.opcaoContent}>
                    <Text style={styles.opcaoTitulo}>{opcao.title}</Text>
                    <Text style={styles.opcaoSubtitulo}>{opcao.subtitle}</Text>
                  </View>
                  
                  <View style={[
                    styles.radioButton, 
                    aguaSelecionada === opcao.id && styles.radioButtonSelecionado
                  ]}>
                    {aguaSelecionada === opcao.id && <View style={styles.radioButtonInner} />}
                  </View>
                </Pressable>
              ))}
            </View>
            
            <View style={styles.divider} />
            
            <Pressable 
              style={[
                styles.primaryButton, 
                (!aguaSelecionada || isLoading) && styles.primaryButtonDisabled
              ]} 
              onPress={handleProximo} 
              disabled={!aguaSelecionada || isLoading}
            >
              <View style={styles.buttonContent}>
                <FontAwesome name="arrow-right" size={22} color="#FFFFFF" />
                <Text style={styles.primaryText}>
                  {isLoading ? 'Salvando...' : 'Ver Resultados'}
                </Text>
              </View>
              <Text style={styles.buttonSubtitle}>
                {aguaSelecionada ? 'Veja sua análise completa' : 'Selecione uma opção para continuar'}
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
  welcomeTitle: { 
    color: '#000000', 
    fontSize: 26, 
    fontWeight: '700', 
    textAlign: 'center', 
    marginBottom: 8, 
    lineHeight: 32 
  },
  subtitle: { 
    color: '#666666', 
    fontSize: 17, 
    textAlign: 'center', 
    marginBottom: 24, 
    lineHeight: 24 
  },
  infoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E3F2FD',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    marginBottom: 24,
    gap: 12,
    width: '100%',
  },
  infoText: {
    flex: 1,
    color: '#0D47A1',
    fontSize: 15,
    fontWeight: '500',
    lineHeight: 20,
  },
  infoHighlight: {
    fontWeight: '700',
    color: '#2196F3',
  },
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
  opcaoSubtitulo: { color: '#666666', fontSize: 14 },
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