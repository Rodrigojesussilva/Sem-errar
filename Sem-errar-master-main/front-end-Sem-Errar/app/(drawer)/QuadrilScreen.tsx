import FontAwesome from '@expo/vector-icons/FontAwesome';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter, useFocusEffect } from 'expo-router';
import React, { useState, useCallback, useEffect } from 'react';
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
  primary: '#622db2',
  dot: '#4ecdc4',
  line: 'rgba(112, 82, 230, 0.15)',
  textMain: '#1A1A1A',
  disabled: '#F0F0F0',
  error: '#ff4444',
};

export default function QuadrilScreen() {
  const router = useRouter();
  const [quadrilCm, setQuadrilCm] = useState<string>('');
  const [sexo, setSexo] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingInitial, setIsLoadingInitial] = useState(true);

  // Carregar sexo ao iniciar e verificar se é feminino
  useEffect(() => {
    const carregarDados = async () => {
      try {
        setIsLoadingInitial(true);
        const sexoSalvo = await AsyncStorage.getItem('@sexo');
        
        if (sexoSalvo) {
          setSexo(sexoSalvo);
          
          // Se for masculino, redireciona direto para resultados
          if (sexoSalvo === 'masculino') {
            Alert.alert(
              'Atenção', 
              'Para homens, não é necessário medir o quadril. Redirecionando...',
              [{ text: 'OK', onPress: () => router.replace('/PreparandoResultadosScreen') }]
            );
            return;
          }
        } else {
          Alert.alert('Atenção', 'Selecione o sexo primeiro.', [
            { text: 'OK', onPress: () => router.push('/SexoScreen') }
          ]);
        }
      } catch (error) {
        console.error('Erro ao carregar:', error);
      } finally {
        setIsLoadingInitial(false);
      }
    };
    
    carregarDados();
  }, []);

  // Resetar o valor quando a tela receber foco
  useFocusEffect(
    useCallback(() => {
      setQuadrilCm('');
    }, [])
  );

  const handleProximo = async () => {
    if (!quadrilCm || Number(quadrilCm) <= 0) {
      Alert.alert('Atenção', 'Digite uma medida válida do quadril');
      return;
    }
    
    setIsLoading(true);
    try {
      await AsyncStorage.setItem('@quadrilCm', quadrilCm);
      router.push('/PreparandoResultadosScreen');
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível salvar a medida.');
    } finally {
      setIsLoading(false);
    }
  };

  // APENAS NÚMEROS INTEIROS, LIMITE DE 4 DÍGITOS
  const handleCmChange = (text: string) => {
    const onlyNums = text.replace(/[^0-9]/g, '');
    
    if (onlyNums.length <= 4) {
      setQuadrilCm(onlyNums);
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

  if (isLoadingInitial) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  // Se for masculino, não renderiza nada (já vai redirecionar)
  if (sexo === 'masculino') {
    return null;
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
      
      <View style={StyleSheet.absoluteFill}>
        <View style={{ flex: 1, backgroundColor: '#fff' }} />
        {renderStaticBackground()}
      </View>

      <View style={styles.header}>
        <Pressable onPress={() => router.push('/CinturaScreen')} style={styles.backButton}>
          <View style={styles.backIconCircle}>
            <FontAwesome name="chevron-left" size={12} color={COLORS.primary} />
          </View>
          <Text style={styles.backText}>Voltar</Text>
        </Pressable>
        <View style={styles.stepIndicator}>
            <Text style={styles.stepText}>Passo 3 de 3</Text>
        </View>
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

          <Text style={styles.title}>Qual é a medida do seu quadril?</Text>

          <View style={styles.illustrationWrapper}>
            <View style={styles.imageCircle}>
              <Image 
                source={require('../../assets/images/medida-quadril.png')} 
                style={styles.imageIllustration}
                resizeMode="cover"
              />
            </View>
          </View>
          
          <View style={styles.inputSection}>
            <View style={[styles.inputWrapper, { borderColor: COLORS.primary }]}>
              <TextInput
                style={[styles.input, { color: COLORS.primary }]}
                value={quadrilCm}
                onChangeText={handleCmChange}
                placeholder="00"
                placeholderTextColor="#CCC"
                keyboardType="number-pad"
                maxLength={4}
              />
              <Text style={[styles.cmLabel, { color: COLORS.dot }]}>cm</Text>
            </View>
            <Text style={styles.inputHelpText}>Digite o valor inteiro em centímetros</Text>
          </View>

          <View style={[styles.instructionsContainer, { borderColor: COLORS.primary }]}>
              <Text style={[styles.instructionsTitle, { color: COLORS.primary }]}>Como medir corretamente:</Text>
              {[
                "Meça a circunferência do quadril na parte mais larga, geralmente na altura dos glúteos.",
                "Mantenha a fita métrica nivelada e paralela ao chão.",
                "Não aperte demais a fita; ela deve estar rente à pele.",
                "Fique em pé, com os pés juntos e os músculos relaxados."
              ].map((item, index) => (
                <View key={index} style={styles.instructionItem}>
                  <View style={[styles.instructionNumber, { backgroundColor: COLORS.primary }]}><Text style={styles.numberText}>{index + 1}</Text></View>
                  <Text style={styles.instructionText}>{item}</Text>
                </View>
              ))}
          </View>

          <Pressable 
            onPress={handleProximo} 
            disabled={!quadrilCm || isLoading} 
            style={styles.buttonWrapper}
          >
            <LinearGradient 
              colors={!quadrilCm ? ['#F0F0F0', '#F0F0F0'] : ['#4ecdc4', '#622db2', '#4b208c']} 
              start={{ x: 0, y: 0 }} 
              end={{ x: 1, y: 1 }} 
              style={styles.primaryButton}
            >
              {isLoading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={[styles.primaryText, !quadrilCm && { color: '#AAA' }]}>
                  Próximo
                </Text>
              )}
            </LinearGradient>
          </Pressable>

          {/* ESPAÇO EXTRA PARA ROLAGEM */}
          <View style={styles.extraScrollSpace} />
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
  
  header: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between', 
    paddingHorizontal: 25, 
    paddingTop: StatusBar.currentHeight ? StatusBar.currentHeight + 10 : 40, 
    zIndex: 100 
  },
  
  backButton: { flexDirection: 'row', alignItems: 'center' },
  backIconCircle: { width: 32, height: 32, borderRadius: 16, backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: COLORS.line, elevation: 3 },
  backText: { color: COLORS.primary, marginLeft: 10, fontWeight: '700', fontSize: 16 },
  stepIndicator: { backgroundColor: 'rgba(78, 205, 196, 0.1)', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12 },
  stepText: { color: COLORS.dot, fontWeight: '800', fontSize: 12 },
  
  scrollContent: { 
    flexGrow: 1, 
    paddingHorizontal: 25
  },
  
  content: { width: '100%', zIndex: 10 },
  logoContainer: { alignItems: 'center', marginBottom: 15 },
  logo: { width: width * 0.4, height: 50 },
  title: { fontSize: 24, fontWeight: '900', color: COLORS.textMain, textAlign: 'center', marginBottom: 25 },
  illustrationWrapper: { alignItems: 'center', marginBottom: 25 },
  imageCircle: { width: 160, height: 160, borderRadius: 80, backgroundColor: '#fff', borderWidth: 3, borderColor: COLORS.dot, overflow: 'hidden', elevation: 6 },
  imageIllustration: { width: '100%', height: '100%' },
  inputSection: { alignItems: 'center', marginBottom: 25 },
  inputWrapper: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', paddingHorizontal: 25, height: 70, borderRadius: 20, borderWidth: 2.5, width: '65%', justifyContent: 'center', elevation: 4 },
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
  
  // Espaço extra para rolagem
  extraScrollSpace: {
    height: height * 0.1,
    width: '100%',
  },
});