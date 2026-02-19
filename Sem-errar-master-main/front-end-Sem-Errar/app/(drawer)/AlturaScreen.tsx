import FontAwesome from '@expo/vector-icons/FontAwesome';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
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
  TextInput,
  View,
} from 'react-native';

const { width, height } = Dimensions.get('window');

const COLORS = {
  primary: '#622db2',
  dot: '#4ecdc4',
  line: 'rgba(112, 82, 230, 0.15)',
  textMain: '#1A1A1A',
  disabled: '#F0F0F0',
};

export default function AlturaScreen() {
  const router = useRouter();
  
  const [alturaCm, setAlturaCm] = useState<string>('');
  const [unidadeSelecionada, setUnidadeSelecionada] = useState<'cm' | 'ft'>('cm');
  const [alturaFt, setAlturaFt] = useState<string>('');
  const [alturaIn, setAlturaIn] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    carregarAlturaSalva();
  }, []);

  const carregarAlturaSalva = async () => {
    try {
      const alturaSalva = await AsyncStorage.getItem('@altura');
      const unidadeSalva = await AsyncStorage.getItem('@alturaUnidade');
      
      if (unidadeSalva === 'ft') {
        setUnidadeSelecionada('ft');
        const ftSalva = await AsyncStorage.getItem('@alturaFt');
        const inSalva = await AsyncStorage.getItem('@alturaIn');
        if (ftSalva) setAlturaFt(ftSalva);
        if (inSalva) setAlturaIn(inSalva);
      } else {
        setUnidadeSelecionada('cm');
        if (alturaSalva) setAlturaCm(alturaSalva);
      }
    } catch (error) {
      console.error('Erro ao carregar altura:', error);
    }
  };

  const formatarAlturaVisual = (val: string) => {
    if (!val) return '';
    if (val.length === 3) {
      return `${val.slice(0, 1)},${val.slice(1)}`;
    }
    return val;
  };

  const handleCmChange = (text: string) => {
    const numericValue = text.replace(/[^0-9]/g, '');
    if (numericValue.length <= 3) {
      setAlturaCm(numericValue);
    }
  };

  const handleProximo = async () => {
    const temValor = unidadeSelecionada === 'cm' ? !!alturaCm : (!!alturaFt || !!alturaIn);
    if (temValor) {
      setIsLoading(true);
      try {
        await AsyncStorage.setItem('@alturaUnidade', unidadeSelecionada);
        if (unidadeSelecionada === 'cm') {
          await AsyncStorage.setItem('@altura', alturaCm);
        } else {
          await AsyncStorage.setItem('@alturaFt', alturaFt || '0');
          await AsyncStorage.setItem('@alturaIn', alturaIn || '0');
        }
        router.push('/(drawer)/PesoScreen');
      } catch (error) {
        Alert.alert('Erro', 'Não foi possível salvar.');
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
      
      <View style={StyleSheet.absoluteFill}>
        <View style={{ flex: 1, backgroundColor: '#fff' }} />
        
        {/* FUNDO ÚNICO SEMELHANTE À TELA OBJETIVO */}
        <View style={styles.visualArea}>
            {/* Elipse Superior Esquerda */}
            <View style={[styles.ellipseLine, { width: width * 1.3, height: width * 1.3, top: -width * 0.7, left: -width * 0.3 }]}>
                <View style={[styles.staticDot, { bottom: '20%', right: '30%' }]} />
            </View>
            
            {/* Elipse Inferior Direita */}
            <View style={[styles.ellipseLine, { width: width * 1.1, height: width * 1.1, bottom: -width * 0.4, right: -width * 0.2 }]}>
                <View style={[styles.staticDot, { top: '25%', left: '20%' }]} />
            </View>

            {/* Ponto flutuante extra para exclusividade */}
            <View style={[styles.staticDot, { top: '45%', right: '10%', opacity: 0.5 }]} />
        </View>
      </View>

      <View style={styles.header}>
        <Pressable onPress={() => router.replace('/(drawer)/IdadeScreen')} style={styles.backButton}>
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

          <Text style={styles.title}>Qual é a sua altura?</Text>

          <View style={styles.mainInputArea}>
            {unidadeSelecionada === 'cm' ? (
              <View style={[styles.inputContainerCm, !!alturaCm && styles.inputContainerActive]}>
                <TextInput
                  style={styles.input}
                  value={formatarAlturaVisual(alturaCm)}
                  onChangeText={handleCmChange}
                  placeholder="0,00"
                  placeholderTextColor="#DDD"
                  keyboardType="numeric"
                  maxLength={4}
                />
                <Text style={styles.unitTag}>{alturaCm.length === 3 ? 'm' : 'cm'}</Text>
              </View>
            ) : (
              <View style={styles.dualInputRow}>
                <View style={[styles.inputContainerFt, !!alturaFt && styles.inputContainerActive]}>
                  <TextInput
                    style={styles.input}
                    value={alturaFt}
                    onChangeText={(t) => setAlturaFt(t.replace(/[^0-9]/g, ''))}
                    placeholder="0"
                    placeholderTextColor="#DDD"
                    keyboardType="numeric"
                    maxLength={1}
                  />
                  <Text style={styles.unitTag}>ft</Text>
                </View>

                <View style={[styles.inputContainerFt, !!alturaIn && styles.inputContainerActive]}>
                  <TextInput
                    style={styles.input}
                    value={alturaIn}
                    onChangeText={(t) => setAlturaIn(t.replace(/[^0-9]/g, ''))}
                    placeholder="0"
                    placeholderTextColor="#DDD"
                    keyboardType="numeric"
                    maxLength={2}
                  />
                  <Text style={styles.unitTag}>in</Text>
                </View>
              </View>
            )}

            <View style={styles.unidadeToggleContainer}>
              <Pressable 
                onPress={() => setUnidadeSelecionada('cm')}
                style={[styles.toggleBtn, unidadeSelecionada === 'cm' && styles.toggleBtnActive]}
              >
                <Text style={[styles.toggleText, unidadeSelecionada === 'cm' && styles.toggleTextActive]}>cm</Text>
              </Pressable>
              <Pressable 
                onPress={() => setUnidadeSelecionada('ft')}
                style={[styles.toggleBtn, unidadeSelecionada === 'ft' && styles.toggleBtnActive]}
              >
                <Text style={[styles.toggleText, unidadeSelecionada === 'ft' && styles.toggleTextActive]}>ft/in</Text>
              </Pressable>
            </View>
          </View>

          <Pressable
            onPress={handleProximo}
            disabled={!(unidadeSelecionada === 'cm' ? alturaCm : (alturaFt || alturaIn)) || isLoading}
            style={styles.buttonWrapper}
          >
            <LinearGradient
              colors={!(unidadeSelecionada === 'cm' ? alturaCm : (alturaFt || alturaIn)) ? ['#F0F0F0', '#F0F0F0'] : ['#4ecdc4', '#622db2', '#4b208c']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.primaryButton}
            >
              <Text style={[styles.primaryText, !(unidadeSelecionada === 'cm' ? alturaCm : (alturaFt || alturaIn)) && { color: '#AAA' }]}>
                {isLoading ? 'Salvando...' : 'Próximo'}
              </Text>
            </LinearGradient>
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
    backgroundColor: '#fff',
  },
  header: {
    paddingHorizontal: 25,
    paddingTop: StatusBar.currentHeight ? StatusBar.currentHeight + 10 : 40,
    zIndex: 100,
  },
  backButton: { flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-start' },
  backIconCircle: { 
    width: 32, height: 32, borderRadius: 16, backgroundColor: '#fff', 
    justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: COLORS.line, elevation: 3 
  },
  backText: { color: COLORS.primary, marginLeft: 10, fontWeight: '700', fontSize: 16 },
  scrollContent: { flexGrow: 1, paddingHorizontal: 25, paddingBottom: 40, justifyContent: 'center' },
  content: { width: '100%', zIndex: 10 },
  logoContainer: { alignItems: 'center', marginBottom: 20 },
  logo: { width: width * 0.5, height: 70 },
  title: { fontSize: 26, fontWeight: '900', color: COLORS.textMain, textAlign: 'center', marginBottom: 40 },
  mainInputArea: { marginBottom: 50, alignItems: 'center' },
  
  inputContainerCm: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'center',
    backgroundColor: '#FFF',
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#F0F0F0',
    paddingHorizontal: 15,
    paddingVertical: 10,
    width: 180,
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
  },

  dualInputRow: { 
    flexDirection: 'row', 
    gap: 12, 
    justifyContent: 'center',
    width: '100%' 
  },
  inputContainerFt: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'center',
    backgroundColor: '#FFF',
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#F0F0F0',
    paddingHorizontal: 12,
    paddingVertical: 10,
    width: 110,
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
  },

  inputContainerActive: { borderColor: COLORS.primary, backgroundColor: '#F8F4FF' },
  input: {
    fontSize: 40,
    fontWeight: '900',
    color: COLORS.textMain,
    textAlign: 'center',
    minWidth: 45,
  },
  unitTag: { fontSize: 18, fontWeight: '700', color: COLORS.dot, marginLeft: 4 },

  unidadeToggleContainer: {
    flexDirection: 'row',
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    padding: 4,
    marginTop: 25,
    width: 140,
  },
  toggleBtn: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 10,
  },
  toggleBtnActive: {
    backgroundColor: '#FFF',
    elevation: 2,
  },
  toggleText: { fontSize: 13, fontWeight: '700', color: '#AAA' },
  toggleTextActive: { color: COLORS.primary },
  buttonWrapper: { width: '100%', borderRadius: 22, overflow: 'hidden', elevation: 4 },
  primaryButton: { paddingVertical: 18, alignItems: 'center' },
  primaryText: { color: '#fff', fontSize: 18, fontWeight: '800' },
});