import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useState } from 'react';
import {
  Alert,
  Dimensions,
  Image,
  Pressable,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

const { width, height } = Dimensions.get('window');

const COLORS = {
  primary: '#622db2',
  dot: '#4ecdc4',
  line: 'rgba(112, 82, 230, 0.15)',
  textMain: '#1A1A1A',
  disabled: '#F0F0F0',
};

interface ObjetivoScreenProps {
  navigation?: {
    replace: (screen: string) => void;
    push: (screen: string) => void;
  };
}

export default function ObjetivoScreen({ navigation }: ObjetivoScreenProps) {
  const [objetivoSelecionado, setObjetivoSelecionado] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  React.useEffect(() => {
    setObjetivoSelecionado(null);
  }, []);

  const objetivos = [
    {
      id: 'ganhar-massa',
      title: 'Ganhar massa',
      description: 'Aumentar massa muscular',
      icon: '🏆',
      color: COLORS.primary,
    },
    {
      id: 'perder-gordura',
      title: 'Perder gordura',
      description: 'Reduzir gordura corporal',
      icon: '🔥',
      color: '#e96f04',
    },
    {
      id: 'outros',
      title: 'Outros',
      description: 'Outro objetivo específico',
      icon: '🎯',
      color: COLORS.dot,
    },
  ];

  const handleProximo = async () => {
    if (objetivoSelecionado) {
      setIsLoading(true);
      try {
        await AsyncStorage.setItem('@objetivo', objetivoSelecionado);
        if (navigation?.push) {
          navigation.push('SexoScreen');
        }
      } catch (error) {
        Alert.alert('Erro', 'Não foi possível salvar.');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleVoltar = () => {
    if (navigation?.replace) {
      navigation.replace('Home');
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
      
      <View style={StyleSheet.absoluteFillObject}>
        <View style={{ flex: 1, backgroundColor: '#fff' }} />
        {renderStaticBackground()}
      </View>

      <View style={styles.header}>
        <Pressable onPress={handleVoltar} style={styles.backButton}>
          <View style={styles.backIconCircle}>
            <Text style={styles.backArrow}>←</Text>
          </View>
          <Text style={styles.backText}>Voltar</Text>
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <View style={styles.logoContainer}>
            <Image 
              source={require('../assets/images/logo-sem-fundo1.png')} 
              style={styles.logo}
              resizeMode="contain"
            />
          </View>

          <Text style={styles.title}>Qual é seu principal objetivo agora?</Text>

          <View style={styles.opcoesContainer}>
            {objetivos.map((objetivo) => {
              const isSelected = objetivoSelecionado === objetivo.id;
              return (
                <Pressable
                  key={objetivo.id}
                  style={[styles.opcaoItem, isSelected && styles.opcaoItemSelecionado]}
                  onPress={() => setObjetivoSelecionado(objetivo.id)}
                >
                  <View style={[styles.opcaoIconContainer, { backgroundColor: `${objetivo.color}10` }]}>
                    <Text style={{ fontSize: 24, color: objetivo.color }}>{objetivo.icon}</Text>
                  </View>

                  <View style={{ flex: 1 }}>
                    <Text style={[styles.opcaoTitulo, isSelected && { color: COLORS.primary }]}>
                      {objetivo.title}
                    </Text>
                    <Text style={styles.opcaoDescricao}>{objetivo.description}</Text>
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
            disabled={!objetivoSelecionado || isLoading}
            style={styles.buttonWrapper}
          >
            {objetivoSelecionado ? (
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
  container: { 
    flex: 1, 
    backgroundColor: '#fff' 
  },
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
    paddingHorizontal: 20,
    paddingTop: StatusBar.currentHeight ? StatusBar.currentHeight + 10 : 40,
    zIndex: 100,
  },
  backButton: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    alignSelf: 'flex-start',
  },
  backIconCircle: { 
    width: 56, 
    height: 56, 
    borderRadius: 28, 
    backgroundColor: '#fff', 
    justifyContent: 'center', 
    alignItems: 'center',
    borderWidth: 1.5, 
    borderColor: COLORS.line,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 5,
  },
  backArrow: {
    fontSize: 36,
    color: COLORS.primary,
    fontWeight: 'bold',
    textAlign: 'center',
    includeFontPadding: false,
    lineHeight: 36,
    marginTop: -2,
  },
  backText: { 
    color: COLORS.primary, 
    marginLeft: 12, 
    fontWeight: '600', 
    fontSize: 18,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 25,
    paddingTop: 10,
    paddingBottom: 40,
  },
  content: { 
    width: '100%', 
    zIndex: 10 
  },
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
  opcoesContainer: { 
    gap: 15, 
    marginBottom: 35 
  },
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
  opcaoTitulo: { 
    fontSize: 17, 
    fontWeight: '700', 
    color: COLORS.textMain 
  },
  opcaoDescricao: { 
    fontSize: 14, 
    color: '#888', 
    marginTop: 2 
  },
  radioButton: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: '#E0E0E0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioButtonSelecionado: { 
    borderColor: COLORS.primary, 
    backgroundColor: COLORS.primary 
  },
  radioButtonInner: { 
    width: 8, 
    height: 8, 
    borderRadius: 4, 
    backgroundColor: '#fff' 
  },
  buttonWrapper: {
    width: '100%',
    borderRadius: 22,
    overflow: 'hidden',
    elevation: 4,
  },
  primaryButton: { 
    paddingVertical: 18, 
    alignItems: 'center' 
  },
  primaryText: { 
    color: '#fff', 
    fontSize: 18, 
    fontWeight: '800' 
  },
});