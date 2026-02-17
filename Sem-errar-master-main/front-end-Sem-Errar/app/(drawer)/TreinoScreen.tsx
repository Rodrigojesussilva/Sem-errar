import FontAwesome from '@expo/vector-icons/FontAwesome';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
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

export default function TreinoScreen() {
  const router = useRouter();
  const [treinaSelecionado, setTreinaSelecionado] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const opcoesTreino = [
    {
      id: 'sim',
      title: 'Sim',
      description: 'Já tenho uma rotina de treinos',
      icon: 'dumbbell',
    },
    {
      id: 'nao',
      title: 'Não',
      description: 'Quero começar a treinar agora',
      icon: 'person-running',
    },
  ];

  useEffect(() => {
    carregarTreinoSalvo();
  }, []);

  const carregarTreinoSalvo = async () => {
    try {
      const treinaAtualmente = await AsyncStorage.getItem('@treinaAtualmente');
      if (treinaAtualmente) setTreinaSelecionado(treinaAtualmente);
    } catch (error) {
      console.error('Erro ao carregar:', error);
    }
  };

  const handleProximo = async () => {
    if (treinaSelecionado) {
      setIsLoading(true);
      try {
        await AsyncStorage.setItem('@treinaAtualmente', treinaSelecionado);
        if (treinaSelecionado === 'sim') {
          router.push('/FrequenciaScreen');
        } else {
          await AsyncStorage.setItem('@frequenciaTreino', '0');
          router.push('/FinalizacaoScreen');
        }
      } catch (error) {
        Alert.alert('Erro', 'Não foi possível salvar.');
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
      <View style={[styles.ellipseLine, { width: width * 1.5, height: width * 0.8, top: height * 0.2, transform: [{ rotate: '110deg' }] }]}>
        <View style={[styles.staticDot, { top: '50%', right: -5 }]} />
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
      
      <View style={StyleSheet.absoluteFill}>
        <View style={{ flex: 1, backgroundColor: '#fff' }} />
        {renderStaticBackground()}
      </View>

      <View style={styles.header}>
        <Pressable onPress={() => router.push('/PesoScreen')} style={styles.backButton}>
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

          <Text style={styles.title}>Você treina atualmente?</Text>

          <View style={styles.opcoesContainer}>
            {opcoesTreino.map((opcao) => {
              const isSelected = treinaSelecionado === opcao.id;
              return (
                <Pressable
                  key={opcao.id}
                  style={[styles.opcaoItem, isSelected && styles.opcaoItemSelecionado]}
                  onPress={() => setTreinaSelecionado(opcao.id)}
                >
                  {/* Fundo do ícone agora segue o padrão da tela Objetivo (cinza leve ou roxo transparente) */}
                  <View style={[styles.opcaoIconContainer, { backgroundColor: isSelected ? `${COLORS.primary}10` : '#F4F4F4' }]}>
                    <FontAwesome6 
                        name={opcao.icon} 
                        size={20} 
                        color={isSelected ? COLORS.primary : '#888'} 
                    />
                  </View>

                  <View style={{ flex: 1 }}>
                    <Text style={[styles.opcaoTitulo, isSelected && { color: COLORS.primary }]}>
                      {opcao.title}
                    </Text>
                    <Text style={styles.opcaoDescricao}>{opcao.description}</Text>
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
            disabled={!treinaSelecionado || isLoading}
            style={styles.buttonWrapper}
          >
            {treinaSelecionado ? (
              <LinearGradient
                colors={['#7b42d5', '#622db2', '#4b208c']}
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
  visualArea: { ...StyleSheet.absoluteFillObject, zIndex: 0, overflow: 'hidden' },
  ellipseLine: { position: 'absolute', borderWidth: 1.5, borderColor: COLORS.line, borderRadius: 999 },
  staticDot: { position: 'absolute', width: 10, height: 10, borderRadius: 5, borderWidth: 2, borderColor: COLORS.dot, backgroundColor: '#fff' },
  header: { 
    paddingHorizontal: 25, 
    paddingTop: StatusBar.currentHeight ? StatusBar.currentHeight + 10 : 40, 
    zIndex: 100,
    position: 'absolute',
    top: 0,
    left: 0,
  },
  backButton: { flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-start' },
  backIconCircle: { width: 32, height: 32, borderRadius: 16, backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: COLORS.line, elevation: 3 },
  backText: { color: COLORS.primary, marginLeft: 10, fontWeight: '700', fontSize: 16 },
  
  scrollContent: { 
    flexGrow: 1, 
    paddingHorizontal: 25, 
    justifyContent: 'center', 
    paddingBottom: 40,
    paddingTop: 80, 
  },
  
  content: { width: '100%', zIndex: 10 },
  logoContainer: { alignItems: 'center', marginBottom: 30 },
  logo: { width: width * 0.5, height: 70 },
  title: { fontSize: 24, fontWeight: '900', color: COLORS.textMain, textAlign: 'center', marginBottom: 40 },
  
  opcoesContainer: { gap: 15, marginBottom: 35 },
  opcaoItem: {
    flexDirection: 'row', alignItems: 'center', padding: 18, backgroundColor: '#fff', borderRadius: 20, borderWidth: 1.5, borderColor: '#f4f4f4',
    elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 5,
  },
  opcaoItemSelecionado: { borderColor: COLORS.primary, borderWidth: 2 },
  opcaoIconContainer: { width: 48, height: 48, borderRadius: 15, justifyContent: 'center', alignItems: 'center', marginRight: 15 },
  opcaoTitulo: { fontSize: 17, fontWeight: '700', color: COLORS.textMain },
  opcaoDescricao: { fontSize: 14, color: '#888', marginTop: 2 },
  
  radioButton: { width: 22, height: 22, borderRadius: 11, borderWidth: 2, borderColor: '#E0E0E0', justifyContent: 'center', alignItems: 'center' },
  radioButtonSelecionado: { borderColor: COLORS.primary, backgroundColor: COLORS.primary },
  radioButtonInner: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#fff' },
  
  buttonWrapper: { width: '100%', borderRadius: 22, overflow: 'hidden', elevation: 4 },
  primaryButton: { paddingVertical: 18, alignItems: 'center' },
  primaryText: { color: '#fff', fontSize: 18, fontWeight: '800' },
});