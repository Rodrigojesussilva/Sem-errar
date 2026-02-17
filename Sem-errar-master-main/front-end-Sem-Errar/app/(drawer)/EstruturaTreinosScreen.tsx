import FontAwesome from '@expo/vector-icons/FontAwesome';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  Dimensions,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  StatusBar,
  Alert,
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

export default function EstruturaTreinosScreen() {
  const router = useRouter();
  const [estruturaSelecionada, setEstruturaSelecionada] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Ícones e cores seguindo o padrão da tela objetivo
  const estruturas = [
    { id: '1', title: 'Sempre o mesmo treino', subtitle: 'Full body ou ABC', icon: 'refresh', color: '#4CAF50' },
    { id: '2', title: '2 treinos diferentes', subtitle: 'Treino A e B', icon: 'retweet', color: '#2196F3' },
    { id: '3', title: '3 treinos diferentes', subtitle: 'Treino A, B e C', icon: 'th-list', color: '#9C27B0' },
    { id: '4', title: '4 treinos diferentes', subtitle: 'Treino A, B, C e D', icon: 'th-large', color: '#FF9800' },
    { id: 'personalizar', title: 'Personalizar', subtitle: 'Crie seu próprio esquema', icon: 'edit', color: '#E74C3C' },
  ];

  useEffect(() => {
    carregarEstruturaSalva();
  }, []);

  const carregarEstruturaSalva = async () => {
    try {
      const estruturaSalva = await AsyncStorage.getItem('@estruturaTreinos');
      if (estruturaSalva) setEstruturaSelecionada(estruturaSalva);
    } catch (error) {
      console.error('Erro ao carregar estrutura:', error);
    }
  };

  const handleProximo = async () => {
    if (!estruturaSelecionada) return;
    setIsLoading(true);
    try {
      await AsyncStorage.setItem('@estruturaTreinos', estruturaSelecionada);
      router.push('/ConfigurarTreinoScreen');
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível salvar sua escolha.');
    } finally {
      setIsLoading(false);
    }
  };

  // ROTA CORRIGIDA: No expo-router, ignoramos os parênteses (drawer)
  const handleVoltar = () => {
    router.replace('/RegistrarTreinoScreen');
  };

  const renderStaticBackground = () => (
    <View style={styles.visualArea}>
      {/* Elipse Superior */}
      <View style={[styles.ellipseLine, { width: width * 1.8, height: height * 0.5, top: -100, left: -width * 0.5, transform: [{ rotate: '-10deg' }] }]}>
        <View style={[styles.staticDot, { bottom: '20%', right: '20%' }]} />
      </View>
      {/* Elipse Inferior */}
      <View style={[styles.ellipseLine, { width: width * 1.5, height: height * 0.4, bottom: height * 0.1, right: -width * 0.4, transform: [{ rotate: '15deg' }] }]}>
        <View style={[styles.staticDot, { top: '15%', left: '10%' }]} />
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
        <Pressable 
          onPress={handleVoltar} 
          style={styles.backButton}
          hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
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

          {/* Sem texto auxiliar, direto na pergunta */}
          <Text style={styles.title}>Você faz sempre o mesmo treino ou alterna?</Text>

          <View style={styles.opcoesContainer}>
            {estruturas.map((item) => {
              const isSelected = estruturaSelecionada === item.id;
              return (
                <Pressable
                  key={item.id}
                  style={[styles.opcaoItem, isSelected && styles.opcaoItemSelecionado]}
                  onPress={() => setEstruturaSelecionada(item.id)}
                >
                  <View style={[styles.opcaoIconContainer, { backgroundColor: `${item.color}15` }]}>
                    <FontAwesome name={item.icon as any} size={22} color={item.color} />
                  </View>

                  <View style={{ flex: 1 }}>
                    <Text style={[styles.opcaoTitulo, isSelected && { color: COLORS.primary }]}>
                      {item.title}
                    </Text>
                    <Text style={styles.opcaoDescricaoItem}>{item.subtitle}</Text>
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
            disabled={!estruturaSelecionada || isLoading}
            style={styles.buttonWrapper}
          >
            {estruturaSelecionada ? (
              <LinearGradient
                colors={['#7b42d5', '#622db2', '#4b208c']}
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
  staticDot: { 
    position: 'absolute', 
    width: 10, 
    height: 10, 
    borderRadius: 5, 
    borderWidth: 2, 
    borderColor: COLORS.dot, 
    backgroundColor: '#fff' 
  },
  header: { 
    paddingHorizontal: 25, 
    paddingTop: StatusBar.currentHeight ? StatusBar.currentHeight + 10 : 40, 
    zIndex: 100 
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
    elevation: 3 
  },
  backText: { color: COLORS.primary, marginLeft: 10, fontWeight: '700', fontSize: 16 },
  scrollContent: { 
    flexGrow: 1, 
    paddingHorizontal: 25, 
    paddingTop: 60, 
    paddingBottom: 40 
  },
  content: { width: '100%', zIndex: 10 },
  logoContainer: { 
    alignItems: 'center', 
    marginBottom: 40 
  },
  logo: { width: width * 0.5, height: 70 },
  title: { 
    fontSize: 26, 
    fontWeight: '900', 
    color: COLORS.textMain, 
    textAlign: 'center', 
    marginBottom: 40,
    paddingHorizontal: 10
  },
  opcoesContainer: { gap: 12, marginBottom: 35 },
  opcaoItem: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    padding: 16, 
    backgroundColor: '#fff', 
    borderRadius: 20, 
    borderWidth: 1.5, 
    borderColor: '#f4f4f4', 
    elevation: 2, 
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 2 }, 
    shadowOpacity: 0.05, 
    shadowRadius: 5 
  },
  opcaoItemSelecionado: { borderColor: COLORS.primary, borderWidth: 2 },
  opcaoIconContainer: { 
    width: 48, 
    height: 48, 
    borderRadius: 15, 
    justifyContent: 'center', 
    alignItems: 'center', 
    marginRight: 15 
  },
  opcaoTitulo: { fontSize: 16, fontWeight: '700', color: COLORS.textMain },
  opcaoDescricaoItem: { fontSize: 13, color: '#888', marginTop: 2 },
  radioButton: { 
    width: 22, 
    height: 22, 
    borderRadius: 11, 
    borderWidth: 2, 
    borderColor: '#E0E0E0', 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  radioButtonSelecionado: { borderColor: COLORS.primary, backgroundColor: COLORS.primary },
  radioButtonInner: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#fff' },
  buttonWrapper: { 
    width: '100%', 
    borderRadius: 22, 
    overflow: 'hidden', 
    elevation: 4 
  },
  primaryButton: { paddingVertical: 18, alignItems: 'center' },
  primaryText: { color: '#fff', fontSize: 18, fontWeight: '800' },
});