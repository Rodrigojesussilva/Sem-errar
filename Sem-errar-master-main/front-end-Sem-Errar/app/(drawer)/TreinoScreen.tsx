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
  error: '#ff4444'
};

export default function TreinoScreen() {
  const router = useRouter();
  const [treinaSelecionado, setTreinaSelecionado] = useState<string | null>(null);
  const [frequenciaSelecionada, setFrequenciaSelecionada] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const opcoesFrequencia = [
    { id: '1-3', label: '1–3 dias', value: '1-3' },
    { id: '3-5', label: '3–5 dias', value: '3-5' },
    { id: '6-7', label: '6–7 dias', value: '6-7' },
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
    if (!treinaSelecionado) return;

    setIsLoading(true);

    try {
      await AsyncStorage.setItem('@treinaAtualmente', treinaSelecionado);

      if (treinaSelecionado === 'sim') {
        if (!frequenciaSelecionada) {
          Alert.alert('Atenção', 'Selecione a frequência de treino');
          setIsLoading(false);
          return;
        }

        await AsyncStorage.setItem('@frequenciaTreino', frequenciaSelecionada);
        router.push('/(drawer)/QuadroCalcularBFScreen');
      } else {
        await AsyncStorage.setItem('@frequenciaTreino', '0');
        router.push('/(drawer)/QuadroCalcularBFScreen');
      }
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível salvar.');
    } finally {
      setIsLoading(false);
    }
  };

  const renderStaticBackground = () => (
    <View style={styles.visualArea}>
      <View style={[styles.ellipseLine, { width: width * 1.2, height: width * 1.2, top: -width * 0.4, right: -width * 0.3, transform: [{ rotate: '15deg' }] }]} />
      <View style={[styles.ellipseLine, { width: width * 1.0, height: width * 1.0, bottom: -width * 0.2, left: -width * 0.4, transform: [{ rotate: '-20deg' }] }]} />
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

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>
          <View style={styles.logoContainer}>
            <Image
              source={require('../../assets/images/logo-sem-fundo1.png')}
              style={styles.logo}
              resizeMode="contain"
            />
          </View>

          <Text style={styles.title}>Você treina atualmente?</Text>

          {/* SIM */}
          <Pressable
            style={[
              styles.opcaoItem,
              treinaSelecionado === 'sim' && { borderColor: COLORS.dot, borderWidth: 2 }
            ]}
            onPress={() => {
              setTreinaSelecionado('sim');
              setFrequenciaSelecionada(null);
            }}
          >
            <View style={[styles.opcaoIconContainer, { backgroundColor: `${COLORS.dot}15` }]}>
              <FontAwesome6 name="dumbbell" size={20} color={COLORS.dot} />
            </View>

            <View style={{ flex: 1 }}>
              <Text style={[styles.opcaoTitulo, treinaSelecionado === 'sim' && { color: COLORS.dot }]}>
                Sim
              </Text>
              <Text style={styles.opcaoDescricao}>
                Já tenho uma rotina de treinos
              </Text>

              {treinaSelecionado === 'sim' && (
                <View style={styles.caixaInterna}>
                  <Text style={styles.pergunta}>Quantos dias por semana?</Text>

                  <View style={styles.frequenciaContainer}>
                    {opcoesFrequencia.map((opcao) => (
                      <Pressable
                        key={opcao.id}
                        style={[
                          styles.frequenciaBotao,
                          frequenciaSelecionada === opcao.value && styles.frequenciaSelecionada
                        ]}
                        onPress={() => setFrequenciaSelecionada(opcao.value)}
                      >
                        <Text
                          style={[
                            styles.frequenciaTexto,
                            frequenciaSelecionada === opcao.value && { color: '#fff' }
                          ]}
                        >
                          {opcao.label}
                        </Text>
                      </Pressable>
                    ))}
                  </View>
                </View>
              )}
            </View>
          </Pressable>

          {/* NÃO */}
          <Pressable
            style={[
              styles.opcaoItem,
              treinaSelecionado === 'nao' && { borderColor: COLORS.error, borderWidth: 2 }
            ]}
            onPress={() => {
              setTreinaSelecionado('nao');
              setFrequenciaSelecionada(null);
            }}
          >
            <View style={[styles.opcaoIconContainer, { backgroundColor: `${COLORS.error}15` }]}>
              <FontAwesome6 name="person-running" size={20} color={COLORS.error} />
            </View>

            <View style={{ flex: 1 }}>
              <Text style={[styles.opcaoTitulo, treinaSelecionado === 'nao' && { color: COLORS.error }]}>
                Não
              </Text>
              <Text style={styles.opcaoDescricao}>
                Quero começar a treinar agora
              </Text>
            </View>
          </Pressable>

          {/* BOTÃO */}
          <Pressable
            onPress={handleProximo}
            disabled={!treinaSelecionado || isLoading || (treinaSelecionado === 'sim' && !frequenciaSelecionada)}
            style={styles.buttonWrapper}
          >
            {treinaSelecionado && (treinaSelecionado === 'nao' || (treinaSelecionado === 'sim' && frequenciaSelecionada)) ? (
              <LinearGradient
                colors={['#4ecdc4', '#622db2', '#4b208c']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.primaryButton}
              >
                <Text style={styles.primaryText}>
                  {isLoading ? 'Salvando...' : 'Próximo'}
                </Text>
              </LinearGradient>
            ) : (
              <View style={[styles.primaryButton, { backgroundColor: COLORS.disabled }]}>
                <Text style={[styles.primaryText, { color: '#AAA' }]}>
                  {!treinaSelecionado ? 'Selecione uma opção' : 'Selecione os dias'}
                </Text>
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

  header: {
    paddingHorizontal: 25,
    paddingTop: StatusBar.currentHeight ? StatusBar.currentHeight + 10 : 40,
    zIndex: 100
  },

  backButton: { flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-start' },
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
    justifyContent: 'center',
    paddingHorizontal: 25,
    paddingBottom: 60
  },

  content: { width: '100%' },

  logoContainer: { alignItems: 'center', marginBottom: 25 },
  logo: { width: width * 0.5, height: 70 },

  title: {
    fontSize: 24,
    fontWeight: '900',
    color: COLORS.textMain,
    textAlign: 'center',
    marginBottom: 30
  },

  opcaoItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 18,
    backgroundColor: '#fff',
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: '#f4f4f4',
    marginBottom: 20
  },

  opcaoIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15
  },

  opcaoTitulo: { fontSize: 17, fontWeight: '700', color: COLORS.textMain },
  opcaoDescricao: { fontSize: 14, color: '#888', marginTop: 2 },

  caixaInterna: { marginTop: 15 },
  pergunta: { fontSize: 15, fontWeight: '600', marginBottom: 10, color: COLORS.textMain },

  frequenciaContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10
  },

  frequenciaBotao: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.dot,
    backgroundColor: '#fff',
    minWidth: 90,
    alignItems: 'center'
  },

  frequenciaSelecionada: {
    backgroundColor: COLORS.dot
  },

  frequenciaTexto: {
    fontWeight: '600',
    color: COLORS.dot,
    fontSize: 14
  },

  buttonWrapper: { marginTop: 10, borderRadius: 22, overflow: 'hidden' },
  primaryButton: { paddingVertical: 18, alignItems: 'center' },
  primaryText: { color: '#fff', fontSize: 18, fontWeight: '800' }
});