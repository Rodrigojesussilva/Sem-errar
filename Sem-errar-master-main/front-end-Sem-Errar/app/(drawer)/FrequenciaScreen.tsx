import FontAwesome from '@expo/vector-icons/FontAwesome';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  StatusBar,
  Dimensions,
  Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

const COLORS = {
  primary: '#622db2',
  dot: '#4ecdc4',
  line: 'rgba(112, 82, 230, 0.15)',
  textMain: '#1A1A1A',
  disabled: '#F0F0F0',
};

export default function FrequenciaScreen() {
  const router = useRouter();
  const [frequenciaSelecionada, setFrequenciaSelecionada] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const frequencias = [
    { 
      id: '1-3', 
      title: '1–3 dias', 
      description: 'Atividade leve por semana', 
      icon: 'calendar', 
      color: '#FF9800' 
    },
    { 
      id: '3-5', 
      title: '3–5 dias', 
      description: 'Moderadamente ativo', 
      icon: 'calendar-check-o', 
      color: '#4CAF50' 
    },
    { 
      id: '6-7', 
      title: '6–7 dias', 
      description: 'Extremamente ativo', 
      icon: 'calendar-plus-o', 
      color: COLORS.dot 
    },
  ];

  useEffect(() => {
    carregarFrequenciaSalva();
  }, []);

  const carregarFrequenciaSalva = async () => {
    try {
      const frequenciaSalva = await AsyncStorage.getItem('@frequenciaTreino');
      if (frequenciaSalva && frequenciaSalva !== '0') {
        setFrequenciaSelecionada(frequenciaSalva);
      }
    } catch (error) {
      console.error('Erro ao carregar frequência:', error);
    }
  };

  const calcularNivelAtividade = (frequenciaId: string): string => {
    switch (frequenciaId) {
      case '1-3': return '1.375'; // Levemente ativo
      case '3-5': return '1.55';  // Moderadamente ativo
      case '6-7': return '1.725'; // Muito ativo
      default: return '1.375';
    }
  };

  const handleProximo = async () => {
    if (frequenciaSelecionada) {
      setIsLoading(true);
      try {
        await AsyncStorage.setItem('@frequenciaTreino', frequenciaSelecionada);
        
        const nivelAtividade = calcularNivelAtividade(frequenciaSelecionada);
        await AsyncStorage.setItem('@nivelAtividade', nivelAtividade);
        
        const freqObj = frequencias.find(f => f.id === frequenciaSelecionada);
        if (freqObj) {
          await AsyncStorage.setItem('@frequenciaTreinoDescricao', freqObj.title);
        }

        router.push('/RegistrarTreinoScreen');
      } catch (error) {
        Alert.alert('Erro', 'Não foi possível salvar sua frequência.');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const renderStaticBackground = () => (
    <View style={styles.visualArea}>
      <View style={[styles.ellipseLine, { width: width * 1.2, height: width * 1.2, top: -width * 0.4, right: -width * 0.3, transform: [{ rotate: '15deg' }] }]}>
        <View style={[styles.staticDot, { bottom: '20%', left: '10%' }]} />
      </View>
      <View style={[styles.ellipseLine, { width: width * 1.0, height: width * 1.0, bottom: -width * 0.2, left: -width * 0.4, transform: [{ rotate: '-20deg' }] }]}>
        <View style={[styles.staticDot, { top: '15%', right: '15%' }]} />
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
      
      {/* Background Decorativo */}
      <View style={StyleSheet.absoluteFill}>
        <View style={{ flex: 1, backgroundColor: '#fff' }} />
        {renderStaticBackground()}
      </View>

      {/* Header Fixo com Botão Voltar Corrigido */}
      <View style={styles.header}>
        <Pressable 
          onPress={() => router.replace('/(drawer)/TreinoScreen')} 
          style={styles.backButton}
        >
          <View style={styles.backIconCircle}>
            <FontAwesome name="chevron-left" size={12} color={COLORS.primary} />
          </View>
          <Text style={styles.backText}>Voltar</Text>
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          
          <View style={styles.logoContainer}>
            <Image 
              source={require('../../assets/images/logo-sem-fundo1.png')} 
              style={styles.logo}
              resizeMode="contain"
            />
          </View>

          <Text style={styles.title}>Quantos dias por semana você treina?</Text>

          <View style={styles.opcoesContainer}>
            {frequencias.map((freq) => {
              const isSelected = frequenciaSelecionada === freq.id;
              return (
                <Pressable
                  key={freq.id}
                  style={[styles.opcaoItem, isSelected && styles.opcaoItemSelecionado]}
                  onPress={() => setFrequenciaSelecionada(freq.id)}
                >
                  <View style={[styles.opcaoIconContainer, { backgroundColor: `${freq.color}10` }]}>
                    <FontAwesome name={freq.icon as any} size={22} color={freq.color} />
                  </View>

                  <View style={{ flex: 1 }}>
                    <Text style={[styles.opcaoTitulo, isSelected && { color: COLORS.primary }]}>
                      {freq.title}
                    </Text>
                    <Text style={styles.opcaoDescricao}>{freq.description}</Text>
                  </View>

                  <View style={[styles.radioButton, isSelected && styles.radioButtonSelecionado]}>
                    {isSelected && <View style={styles.radioButtonInner} />}
                  </View>
                </Pressable>
              );
            })}
          </View>

          <Pressable
            onPress={handleProximo}
            disabled={!frequenciaSelecionada || isLoading}
            style={styles.buttonWrapper}
          >
            {frequenciaSelecionada ? (
              <LinearGradient
                colors={['#4ecdc4', '#622db2', '#4b208c']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.primaryButton}
              >
                <Text style={styles.primaryText}>{isLoading ? 'Salvando...' : 'Próximo'}</Text>
              </LinearGradient>
            ) : (
              <View style={[styles.primaryButton, { backgroundColor: COLORS.disabled }]}>
                <Text style={[styles.primaryText, { color: '#AAA' }]}>Selecione uma opção</Text>
              </View>
            )}
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  visualArea: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 0,
    overflow: 'hidden',
  },
  ellipseLine: {
    position: 'absolute',
    borderWidth: 1.5,
    borderColor: COLORS.line,
    borderRadius: 999,
  },
  staticDot: {
    position: 'absolute',
    width: 10,
    height: 10,
    borderRadius: 5,
    borderWidth: 2,
    borderColor: COLORS.dot,
    backgroundColor: '#fff',
  },
  header: {
    paddingHorizontal: 25,
    paddingTop: StatusBar.currentHeight ? StatusBar.currentHeight + 10 : 40,
    zIndex: 100,
  },
  backButton: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    alignSelf: 'flex-start' 
  },
  backIconCircle: { 
    width: 32, 
    height: 32, 
    borderRadius: 16, 
    backgroundColor: '#fff', 
    justifyContent: 'center', 
    alignItems: 'center', 
    borderWidth: 1, 
    borderColor: COLORS.line,
    elevation: 3,
  },
  backText: { 
    color: COLORS.primary, 
    marginLeft: 10, 
    fontWeight: '700', 
    fontSize: 16 
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 25,
    paddingTop: 10,
    paddingBottom: 40,
  },
  content: { width: '100%', zIndex: 10 },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 5,
  },
  logo: {
    width: width * 0.5,
    height: 70,
  },
  title: {
    fontSize: 24,
    fontWeight: '900',
    color: COLORS.textMain,
    textAlign: 'center',
    marginBottom: 40,
  },
  opcoesContainer: { gap: 15, marginBottom: 35 },
  opcaoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 18,
    backgroundColor: '#fff',
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: '#f4f4f4',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
  },
  opcaoItemSelecionado: {
    borderColor: COLORS.primary,
    borderWidth: 2,
  },
  opcaoIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  opcaoTitulo: { fontSize: 17, fontWeight: '700', color: COLORS.textMain },
  opcaoDescricao: { fontSize: 14, color: '#888', marginTop: 2 },
  radioButton: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: '#E0E0E0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioButtonSelecionado: { borderColor: COLORS.primary, backgroundColor: COLORS.primary },
  radioButtonInner: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#fff' },
  buttonWrapper: {
    width: '100%',
    borderRadius: 22,
    overflow: 'hidden',
    elevation: 4,
  },
  primaryButton: { paddingVertical: 18, alignItems: 'center' },
  primaryText: { color: '#fff', fontSize: 18, fontWeight: '800' },
});