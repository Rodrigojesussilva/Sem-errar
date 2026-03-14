import FontAwesome from '@expo/vector-icons/FontAwesome';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import { useFocusEffect, useRouter } from 'expo-router';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  Image,
  Keyboard,
  Platform,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View
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

export default function PescocoScreen() {
  const router = useRouter();
  const [pescocoCm, setPescocoCm] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  // Monitorar quando o teclado abre/fecha
  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow',
      (event) => {
        // Salva a altura do teclado e permite rolagem
        setKeyboardHeight(event.endCoordinates.height);
      }
    );
    const keyboardDidHideListener = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide',
      () => {
        // Reseta a altura do teclado
        setKeyboardHeight(0);
      }
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  // Resetar o valor quando a tela receber foco
  useFocusEffect(
    useCallback(() => {
      setPescocoCm('');
    }, [])
  );

  const handleProximo = async () => {
    // Validação básica de preenchimento
    if (!pescocoCm || Number(pescocoCm) <= 0) {
      Alert.alert('Atenção', 'Por favor, insira uma medida válida.');
      return;
    }

    setIsLoading(true);
    try {
      await AsyncStorage.setItem('@pescocoCm', pescocoCm);
      router.push('/CinturaScreen');
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível guardar a medida.');
    } finally {
      setIsLoading(false);
    }
  };

  // LÓGICA DE TRAVA: APENAS NÚMEROS INTEIROS, MÁXIMO 3 DÍGITOS
  const handleCmChange = (text: string) => {
    // Remove qualquer caractere que não seja número
    const onlyNums = text.replace(/[^0-9]/g, '');

    // Agora permite até 3 dígitos (ex: até 999)
    if (onlyNums.length <= 3) {
      setPescocoCm(onlyNums);
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

      {/* ScrollView SEMPRE presente, mas com comportamento diferente */}
      <ScrollView
        ref={scrollViewRef}
        style={styles.scrollView}
        contentContainerStyle={[
          styles.scrollContent,
          keyboardHeight > 0 && { paddingBottom: 40 }
        ]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        scrollEnabled={keyboardHeight > 0} // Só permite rolar quando o teclado está aberto
      >
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
                placeholder="00"
                placeholderTextColor="#CCC"
                keyboardType="number-pad"
                maxLength={3}
              />
              <Text style={[styles.cmLabel, { color: COLORS.dot }]}>cm</Text>
            </View>
          </View>

          <View style={[styles.instructionsContainer, { borderColor: COLORS.primary }]}>
            <Text style={[styles.instructionsTitle, { color: COLORS.primary }]}>Como medir corretamente:</Text>
            {[
              "Posicione a fita abaixo do pomo de adão.",
              "Mantenha a fita rente ao pescoço.",
              "Certifique-se de que a fita esteja reta."
            ].map((item, index) => (
              <View key={index} style={styles.instructionItem}>
                <View style={[styles.instructionNumber, { backgroundColor: COLORS.primary }]}>
                  <Text style={styles.numberText}>{index + 1}</Text>
                </View>
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
  container: {
    flex: 1,
    backgroundColor: '#fff'
  },

  scrollView: {
    flex: 1,
  },

  visualArea: {
    ...StyleSheet.absoluteFillObject,
    overflow: 'hidden',
    zIndex: 0
  },

  ellipseLine: {
    position: 'absolute',
    borderWidth: 1.5,
    borderColor: COLORS.line,
    borderRadius: 999
  },

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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 25,
    paddingTop: StatusBar.currentHeight ? StatusBar.currentHeight + 10 : 40,
    zIndex: 100,
    backgroundColor: 'transparent',
  },

  backButton: {
    flexDirection: 'row',
    alignItems: 'center'
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

  backText: {
    color: COLORS.primary,
    marginLeft: 10,
    fontWeight: '700',
    fontSize: 16
  },

  stepIndicator: {
    backgroundColor: 'rgba(78, 205, 196, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12
  },

  stepText: {
    color: COLORS.dot,
    fontWeight: '800',
    fontSize: 12
  },

  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 25
  },

  content: {
    width: '100%',
    zIndex: 10
  },

  logoContainer: {
    alignItems: 'center',
    marginBottom: 15
  },

  logo: {
    width: width * 0.4,
    height: 50
  },

  title: {
    fontSize: 24,
    fontWeight: '900',
    color: COLORS.textMain,
    textAlign: 'center',
    marginBottom: 25
  },

  illustrationWrapper: {
    alignItems: 'center',
    marginBottom: 25
  },

  imageCircle: {
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: '#fff',
    borderWidth: 3,
    borderColor: COLORS.dot,
    overflow: 'hidden',
    elevation: 6
  },

  imageIllustration: {
    width: '100%',
    height: '100%'
  },

  inputSection: {
    alignItems: 'center',
    marginBottom: 25
  },

  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 25,
    height: 70,
    borderRadius: 20,
    borderWidth: 2.5,
    width: '65%',
    justifyContent: 'center',
    elevation: 4
  },

  input: {
    fontSize: 32,
    fontWeight: '800',
    textAlign: 'center',
    width: 80
  },

  cmLabel: {
    fontSize: 22,
    fontWeight: '900',
    marginLeft: 8
  },

  instructionsContainer: {
    backgroundColor: 'rgba(255,255,255,0.9)',
    padding: 18,
    borderRadius: 22,
    borderWidth: 2,
    marginBottom: 25,
    elevation: 2
  },

  instructionsTitle: {
    fontSize: 16,
    fontWeight: '900',
    marginBottom: 12
  },

  instructionItem: {
    flexDirection: 'row',
    marginBottom: 8,
    alignItems: 'flex-start'
  },

  instructionNumber: {
    width: 22,
    height: 22,
    borderRadius: 11,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    marginTop: 2
  },

  numberText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '900'
  },

  instructionText: {
    flex: 1,
    fontSize: 13,
    color: '#555',
    lineHeight: 18,
    fontWeight: '600'
  },

  buttonWrapper: {
    borderRadius: 22,
    overflow: 'hidden',
    elevation: 4
  },

  primaryButton: {
    paddingVertical: 18,
    alignItems: 'center',
    minHeight: 60,
    justifyContent: 'center'
  },

  primaryText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '800'
  },
});