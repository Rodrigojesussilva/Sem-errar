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

export default function SexoScreen() {
  const router = useRouter();
  const [sexoSelecionado, setSexoSelecionado] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const opcoesSexo = [
    {
      id: 'masculino',
      title: 'Masculino',
      icon: 'mars',
      color: '#1E88E5',
    },
    {
      id: 'feminino',
      title: 'Feminino',
      icon: 'venus',
      color: '#E91E63',
    },
  ];

  useEffect(() => {
    carregarSexoSalvo();
  }, []);

  const carregarSexoSalvo = async () => {
    try {
      const sexoSalvo = await AsyncStorage.getItem('@sexo');
      if (sexoSalvo) setSexoSelecionado(sexoSalvo);
    } catch (error) {
      console.error('Erro ao carregar sexo:', error);
    }
  };

  const handleProximo = async () => {
    if (sexoSelecionado) {
      setIsLoading(true);
      try {
        await AsyncStorage.setItem('@sexo', sexoSelecionado);
        router.push('/IdadeScreen');
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

      {/* Botão Voltar Fixo */}
      <Pressable style={styles.backButton} onPress={() => router.back()}>
        <FontAwesome name="chevron-left" size={16} color={COLORS.primary} />
        <Text style={styles.backButtonText}>Voltar</Text>
      </Pressable>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <Text style={styles.title}>Qual é o seu sexo?</Text>
          <Text style={styles.subtitle}>Essa informação nos ajuda a personalizar seu plano de treino</Text>

          <View style={styles.opcoesContainer}>
            {opcoesSexo.map((opcao) => {
              const isSelected = sexoSelecionado === opcao.id;
              return (
                <Pressable
                  key={opcao.id}
                  style={[styles.opcaoItem, isSelected && styles.opcaoItemSelecionado]}
                  onPress={() => setSexoSelecionado(opcao.id)}
                >
                  <View style={[styles.opcaoIconContainer, { backgroundColor: `${opcao.color}10` }]}>
                    <FontAwesome name={opcao.icon as any} size={26} color={opcao.color} />
                  </View>

                  <View style={{ flex: 1 }}>
                    <Text style={[styles.opcaoTitulo, isSelected && { color: COLORS.primary }]}>
                      {opcao.title}
                    </Text>
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
            disabled={!sexoSelecionado || isLoading}
            style={styles.buttonWrapper}
          >
            {sexoSelecionado ? (
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
  backButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    flexDirection: 'row',
    alignItems: 'center',
    zIndex: 20,
    padding: 10,
  },
  backButtonText: { marginLeft: 8, fontSize: 16, fontWeight: '600', color: COLORS.primary },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 25,
    paddingTop: 100,
    paddingBottom: 40,
    justifyContent: 'center',
  },
  content: { width: '100%', zIndex: 10 },
  title: { fontSize: 28, fontWeight: '900', color: COLORS.textMain, textAlign: 'center', marginBottom: 8 },
  subtitle: { fontSize: 15, color: COLORS.dot, fontWeight: '700', textAlign: 'center', marginBottom: 40, paddingHorizontal: 20 },
  opcoesContainer: { gap: 15, marginBottom: 40 },
  opcaoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
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
  opcaoItemSelecionado: { borderColor: COLORS.primary, borderWidth: 2, shadowColor: COLORS.primary, shadowOpacity: 0.1 },
  opcaoIconContainer: { width: 56, height: 56, borderRadius: 18, justifyContent: 'center', alignItems: 'center', marginRight: 15 },
  opcaoTitulo: { fontSize: 18, fontWeight: '700', color: COLORS.textMain },
  radioButton: { width: 22, height: 22, borderRadius: 11, borderWidth: 2, borderColor: '#E0E0E0', justifyContent: 'center', alignItems: 'center' },
  radioButtonSelecionado: { borderColor: COLORS.primary, backgroundColor: COLORS.primary },
  radioButtonInner: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#fff' },
  buttonWrapper: { width: '100%', borderRadius: 22, overflow: 'hidden', elevation: 4 },
  primaryButton: { paddingVertical: 18, alignItems: 'center' },
  primaryText: { color: '#fff', fontSize: 18, fontWeight: '800' },
});