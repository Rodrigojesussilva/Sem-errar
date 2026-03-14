import FontAwesome from '@expo/vector-icons/FontAwesome';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import { useFocusEffect, useRouter } from 'expo-router';
import React, { useCallback, useState } from 'react';
import {
  Alert,
  Dimensions,
  Image,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width, height } = Dimensions.get('window');

const COLORS = {
  primary: '#622db2',
  dot: '#4ecdc4',
  line: 'rgba(112, 82, 230, 0.15)',
  textMain: '#1A1A1A',
  disabled: '#F0F0F0',
};

export default function PesoScreen() {
  const router = useRouter();

  const [pesoKg, setPesoKg] = useState<string>('');
  const [unidadeSelecionada, setUnidadeSelecionada] = useState<'kg' | 'lb'>('kg');
  const [pesoLb, setPesoLb] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  // Reseta todos os campos quando a tela receber foco
  useFocusEffect(
    useCallback(() => {
      setPesoKg('');
      setUnidadeSelecionada('kg');
      setPesoLb('');
    }, [])
  );

  const converterParaKg = (lb: string): string => {
    const lbNum = parseFloat(lb) || 0;
    return (lbNum * 0.453592).toFixed(1);
  };

  const handleProximo = async () => {
    const temValor = unidadeSelecionada === 'kg' ? !!pesoKg : !!pesoLb;
    if (temValor) {
      setIsLoading(true);
      try {
        // Recuperar dados existentes do onboarding
        const existingData = await AsyncStorage.getItem('@userDataCompleto');
        let userData = existingData ? JSON.parse(existingData) : {};

        // Calcular peso em kg
        let pesoKgValue: number;
        let pesoLbValue: number | null = null;

        if (unidadeSelecionada === 'kg') {
          pesoKgValue = parseFloat(pesoKg);
        } else {
          // Converter lb para kg
          pesoKgValue = parseFloat((parseFloat(pesoLb) * 0.453592).toFixed(1));
          pesoLbValue = parseFloat(pesoLb);
        }

        console.log('📊 Salvando peso:', {
          unidade: unidadeSelecionada,
          pesoKg: pesoKgValue,
          pesoLb: pesoLbValue
        });

        // Atualizar objeto completo com os novos dados de peso
        userData = {
          ...userData,
          pesoUnidade: unidadeSelecionada,
          pesoKg: pesoKgValue, // Campo principal que o backend usa
          pesoEmKg: pesoKgValue, // Campo de fallback
          pesoLb: pesoLbValue,
        };

        // Salvar objeto completo
        await AsyncStorage.setItem('@userDataCompleto', JSON.stringify(userData));
        console.log('✅ @userDataCompleto salvo:', userData);

        // Manter compatibilidade com chaves antigas
        await AsyncStorage.setItem('@pesoKg', pesoKgValue.toString());
        await AsyncStorage.setItem('@pesoEmKg', pesoKgValue.toString());
        if (pesoLbValue) {
          await AsyncStorage.setItem('@pesoLb', pesoLbValue.toString());
        } else {
          await AsyncStorage.removeItem('@pesoLb');
        }

        router.push('/(drawer)/TreinoScreen');
      } catch (error) {
        console.error('❌ Erro ao salvar peso:', error);
        Alert.alert('Erro', 'Não foi possível salvar.');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handlePesoChange = (text: string, type: 'kg' | 'lb') => {
    const cleanedText = text.replace(/[^0-9.]/g, '');
    const parts = cleanedText.split('.');
    let finalValue = cleanedText;

    if (parts.length > 2) return;
    if (parts.length === 2 && parts[1].length > 1) {
      finalValue = parts[0] + '.' + parts[1].charAt(0);
    }
    if (type === 'kg') setPesoKg(finalValue);
    else setPesoLb(finalValue);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />

      {/* FUNDO ÚNICO CONSISTENTE */}
      <View style={StyleSheet.absoluteFill}>
        <View style={{ flex: 1, backgroundColor: '#fff' }} />
        <View style={styles.visualArea}>
          <View style={[styles.ellipseLine, { width: width * 1.4, height: width * 1.4, top: -width * 0.5, left: -width * 0.4, transform: [{ rotate: '15deg' }] }]}>
            <View style={[styles.staticDot, { bottom: '30%', right: '20%' }]} />
          </View>
          <View style={[styles.ellipseLine, { width: width * 1.2, height: width * 1.2, bottom: -width * 0.6, right: -width * 0.3 }]}>
            <View style={[styles.staticDot, { top: '20%', left: '40%' }]} />
          </View>
        </View>
      </View>

      <View style={styles.header}>
        <Pressable onPress={() => router.replace('/(drawer)/AlturaScreen')} style={styles.backButton}>
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

          <Text style={styles.title}>Qual é o seu peso atual?</Text>

          <View style={styles.mainInputArea}>
            <View style={[styles.inputContainer, (pesoKg || pesoLb) && styles.inputActive]}>
              <TextInput
                style={styles.input}
                value={unidadeSelecionada === 'kg' ? pesoKg : pesoLb}
                onChangeText={(t) => handlePesoChange(t, unidadeSelecionada)}
                placeholder="0.0"
                placeholderTextColor="#DDD"
                keyboardType="numeric"
                maxLength={3}
              />
              <Text style={styles.unitTag}>{unidadeSelecionada}</Text>
            </View>

            {unidadeSelecionada === 'lb' && pesoLb && (
              <Text style={styles.conversionHint}>≈ {converterParaKg(pesoLb)} kg</Text>
            )}

            <View style={styles.toggleContainer}>
              <Pressable
                onPress={() => setUnidadeSelecionada('kg')}
                style={[styles.tglBtn, unidadeSelecionada === 'kg' && styles.tglBtnActive]}
              >
                <Text style={[styles.tglText, unidadeSelecionada === 'kg' && styles.tglTextActive]}>kg</Text>
              </Pressable>
              <Pressable
                onPress={() => setUnidadeSelecionada('lb')}
                style={[styles.tglBtn, unidadeSelecionada === 'lb' && styles.tglBtnActive]}
              >
                <Text style={[styles.tglText, unidadeSelecionada === 'lb' && styles.tglTextActive]}>lb</Text>
              </Pressable>
            </View>
          </View>

          <Pressable
            onPress={handleProximo}
            disabled={!(unidadeSelecionada === 'kg' ? pesoKg : pesoLb) || isLoading}
            style={styles.buttonWrapper}
          >
            <LinearGradient
              colors={!(unidadeSelecionada === 'kg' ? pesoKg : pesoLb) ? ['#F0F0F0', '#F0F0F0'] : ['#4ecdc4', '#622db2', '#4b208c']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.primaryButton}
            >
              <Text style={[styles.primaryText, !(unidadeSelecionada === 'kg' ? pesoKg : pesoLb) && { color: '#AAA' }]}>
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
    position: 'absolute', width: 10, height: 10, borderRadius: 5,
    borderWidth: 2, borderColor: COLORS.dot, backgroundColor: '#fff',
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

  inputContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'center',
    backgroundColor: '#FFF',
    borderRadius: 25,
    borderWidth: 2,
    borderColor: '#F0F0F0',
    paddingHorizontal: 20,
    paddingVertical: 15,
    width: 200,
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
  },
  inputActive: { borderColor: COLORS.primary, backgroundColor: '#F8F4FF' },
  input: { fontSize: 40, fontWeight: '900', color: COLORS.textMain, textAlign: 'center', minWidth: 80 },
  unitTag: { fontSize: 18, fontWeight: '700', color: COLORS.dot, marginLeft: 8 },
  conversionHint: { marginTop: 10, color: '#AAA', fontSize: 14, fontWeight: '600' },

  toggleContainer: {
    flexDirection: 'row',
    backgroundColor: '#F5F5F5',
    borderRadius: 15,
    padding: 5,
    marginTop: 30,
    width: 150,
  },
  tglBtn: { flex: 1, paddingVertical: 10, alignItems: 'center', borderRadius: 12 },
  tglBtnActive: { backgroundColor: '#FFF', elevation: 2 },
  tglText: { fontSize: 14, fontWeight: '700', color: '#AAA' },
  tglTextActive: { color: COLORS.primary },

  buttonWrapper: { width: '100%', borderRadius: 22, overflow: 'hidden', elevation: 4 },
  primaryButton: { paddingVertical: 18, alignItems: 'center' },
  primaryText: { color: '#fff', fontSize: 18, fontWeight: '800' },
});