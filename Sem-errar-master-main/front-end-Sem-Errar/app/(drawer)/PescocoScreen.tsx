import FontAwesome from '@expo/vector-icons/FontAwesome';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  Alert,
  Dimensions,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  SafeAreaView,
  StatusBar,
  ActivityIndicator
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

const COLORS = {
  primary: '#622db2', // Roxo
  dot: '#4ecdc4',    // Ciano
  line: 'rgba(112, 82, 230, 0.15)',
  textMain: '#1A1A1A',
  disabled: '#F0F0F0',
};

export default function PescocoScreen() {
  const router = useRouter();
  const [pescocoCm, setPescocoCm] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const carregarMedida = async () => {
      try {
        const salvo = await AsyncStorage.getItem('@pescocoCm');
        if (salvo) setPescocoCm(salvo);
      } catch (error) {
        console.error('Erro ao carregar:', error);
      }
    };
    carregarMedida();
  }, []);

  const handleProximo = async () => {
    if (!pescocoCm) {
      Alert.alert('Atenção', 'Digite a medida do pescoço');
      return;
    }
    
    setIsLoading(true);
    try {
      await AsyncStorage.setItem('@pescocoCm', pescocoCm);
      router.push('/CinturaScreen');
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível salvar a medida.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCmChange = (text: string) => {
    const cleaned = text.replace(/[^0-9.]/g, '');
    const parts = cleaned.split('.');
    if (parts.length <= 2) {
      if (parts.length === 2 && parts[1].length > 1) {
        setPescocoCm(parts[0] + '.' + parts[1].charAt(0));
      } else {
        setPescocoCm(cleaned);
      }
    }
  };

  const renderStaticBackground = () => (
    <View style={styles.visualArea}>
      <View style={[styles.ellipseLine, { width: width * 1.1, height: width * 1.1, top: -width * 0.6, left: -width * 0.2, transform: [{ rotate: '-10deg' }] }]}>
         <View style={[styles.staticDot, { bottom: '15%', right: '25%' }]} />
      </View>
      <View style={[styles.ellipseLine, { width: width * 1.4, height: width * 1.4, bottom: -width * 0.5, right: -width * 0.4, transform: [{ rotate: '45deg' }] }]}>
        <View style={[styles.staticDot, { top: '20%', left: '30%' }]} />
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
        <Pressable onPress={() => router.replace('/(drawer)/QuadroCalcularBFScreen')} style={styles.backButton}>
          <View style={styles.backIconCircle}>
            <FontAwesome name="chevron-left" size={12} color={COLORS.primary} />
          </View>
          <Text style={styles.backText}>Voltar</Text>
        </Pressable>
        <View style={styles.stepIndicator}>
            <Text style={styles.stepText}>Passo 1 de 3</Text>
        </View>
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

          <Text style={styles.title}>Qual é a medida do seu pescoço?</Text>

          <View style={styles.illustrationWrapper}>
            <View style={styles.imageCircle}>
              <Image 
                source={require('../../assets/images/medida-pescoço.png')} 
                style={styles.imageIllustration}
                resizeMode="cover"
              />
            </View>
          </View>
          
          <View style={styles.inputSection}>
            <View style={[styles.inputWrapper, { borderColor: COLORS.primary }]}>
              <TextInput
                style={[styles.input, { color: COLORS.primary }]}
                value={pescocoCm}
                onChangeText={handleCmChange}
                placeholder="00.0"
                placeholderTextColor="#CCC"
                keyboardType="decimal-pad"
              />
              <Text style={[styles.cmLabel, { color: COLORS.dot }]}>cm</Text>
            </View>
            <Text style={styles.inputHelpText}>Use uma fita métrica flexível para maior precisão</Text>
          </View>

          {/* Caixa de Dicas em Roxo com Dicas Concisas */}
          <View style={[styles.instructionsContainer, { borderColor: COLORS.primary }]}>
              <Text style={[styles.instructionsTitle, { color: COLORS.primary }]}>Como medir corretamente:</Text>
              {[
                "Posicione a fita 2,5 cm acima dos ombros.",
                "Mantenha a fita rente ao pescoço, sem apertar.",
                "Certifique-se de que a fita esteja reta.",
                "Olhe para frente com os ombros relaxados."
              ].map((item, index) => (
                <View key={index} style={styles.instructionItem}>
                  <View style={[styles.instructionNumber, { backgroundColor: COLORS.primary }]}><Text style={styles.numberText}>{index + 1}</Text></View>
                  <Text style={styles.instructionText}>{item}</Text>
                </View>
              ))}
          </View>

          <Pressable 
            onPress={handleProximo} 
            disabled={!pescocoCm || isLoading} 
            style={styles.buttonWrapper}
          >
            <LinearGradient 
              colors={!pescocoCm ? ['#F0F0F0', '#F0F0F0'] : ['#4ecdc4', '#622db2', '#4b208c']} 
              start={{ x: 0, y: 0 }} 
              end={{ x: 1, y: 1 }} 
              style={styles.primaryButton}
            >
              {isLoading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={[styles.primaryText, !pescocoCm && { color: '#AAA' }]}>
                  Próximo
                </Text>
              )}
            </LinearGradient>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  visualArea: { ...StyleSheet.absoluteFillObject, overflow: 'hidden', zIndex: 0 },
  ellipseLine: { position: 'absolute', borderWidth: 1.5, borderColor: COLORS.line, borderRadius: 999 },
  staticDot: { position: 'absolute', width: 10, height: 10, borderRadius: 5, borderWidth: 2, borderColor: COLORS.dot, backgroundColor: '#fff' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 25, paddingTop: StatusBar.currentHeight ? StatusBar.currentHeight + 10 : 40, zIndex: 100 },
  backButton: { flexDirection: 'row', alignItems: 'center' },
  backIconCircle: { width: 32, height: 32, borderRadius: 16, backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: COLORS.line, elevation: 3 },
  backText: { color: COLORS.primary, marginLeft: 10, fontWeight: '700', fontSize: 16 },
  stepIndicator: { backgroundColor: 'rgba(78, 205, 196, 0.1)', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12 },
  stepText: { color: COLORS.dot, fontWeight: '800', fontSize: 12 },
  scrollContent: { flexGrow: 1, paddingHorizontal: 25, paddingBottom: 40, justifyContent: 'center' },
  content: { width: '100%', zIndex: 10 },
  logoContainer: { alignItems: 'center', marginBottom: 15 },
  logo: { width: width * 0.4, height: 50 },
  title: { fontSize: 24, fontWeight: '900', color: COLORS.textMain, textAlign: 'center', marginBottom: 25 },
  illustrationWrapper: { alignItems: 'center', marginBottom: 25 },
  imageCircle: { width: 160, height: 160, borderRadius: 80, backgroundColor: '#fff', borderWidth: 3, borderColor: COLORS.dot, overflow: 'hidden', elevation: 6 },
  imageIllustration: { width: '100%', height: '100%' },
  inputSection: { alignItems: 'center', marginBottom: 25 },
  inputWrapper: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', paddingHorizontal: 25, height: 70, borderRadius: 20, borderWidth: 2.5, width: '75%', justifyContent: 'center', elevation: 4 },
  input: { fontSize: 32, fontWeight: '800', textAlign: 'center', width: 100 },
  cmLabel: { fontSize: 22, fontWeight: '900', marginLeft: 8 },
  inputHelpText: { fontSize: 14, color: '#4ecdc4', marginTop: 12, fontWeight: '700', textAlign: 'center', fontStyle: 'italic' },
  instructionsContainer: { backgroundColor: 'rgba(255,255,255,0.9)', padding: 18, borderRadius: 22, borderWidth: 2, marginBottom: 25, elevation: 2 },
  instructionsTitle: { fontSize: 16, fontWeight: '900', marginBottom: 12 },
  instructionItem: { flexDirection: 'row', marginBottom: 8, alignItems: 'flex-start' },
  instructionNumber: { width: 22, height: 22, borderRadius: 11, justifyContent: 'center', alignItems: 'center', marginRight: 12, marginTop: 2 },
  numberText: { color: '#fff', fontSize: 12, fontWeight: '900' },
  instructionText: { flex: 1, fontSize: 13, color: '#555', lineHeight: 18, fontWeight: '600' },
  buttonWrapper: { borderRadius: 22, overflow: 'hidden', elevation: 4 },
  primaryButton: { paddingVertical: 18, alignItems: 'center', minHeight: 60, justifyContent: 'center' },
  primaryText: { color: '#fff', fontSize: 18, fontWeight: '800' },
});