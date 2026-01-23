import { FontAwesome, FontAwesome6, Ionicons, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Dimensions,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

export default function DadosScreen() {
  const router = useRouter();
  const scrollViewRef = useRef<ScrollView>(null);
  
  // Estados dos inputs (agora como string pura)
  const [idade, setIdade] = useState('32');
  const [altura, setAltura] = useState('182');
  const [peso, setPeso] = useState('102.8');
  const [cintura, setCintura] = useState('109');
  const [pescoco, setPescoco] = useState('42');
  const [sexo, setSexo] = useState('masculino');
  
  // Estados para controle do foco
  const [focusedInput, setFocusedInput] = useState<string | null>(null);
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  
  // Estado para o loader
  const [loading, setLoading] = useState(false);
  
  const [erro, setErro] = useState('');
  const { height: screenHeight, width: screenWidth } = Dimensions.get('window');

  // Estados para controle do botão flutuante
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [isScrolledDown, setIsScrolledDown] = useState(false);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [scrollViewHeight, setScrollViewHeight] = useState(0);
  const [contentHeight, setContentHeight] = useState(0);
  
  const buttonAnim = useState(new Animated.Value(0))[0];
  const rotateAnim = useState(new Animated.Value(0))[0];

  // Refs para os inputs
  const idadeRef = useRef<TextInput>(null);
  const alturaRef = useRef<TextInput>(null);
  const pesoRef = useRef<TextInput>(null);
  const cinturaRef = useRef<TextInput>(null);
  const pescocoRef = useRef<TextInput>(null);

  // Animação do loader
  useEffect(() => {
    if (loading) {
      Animated.loop(
        Animated.timing(rotateAnim, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        })
      ).start();
    } else {
      rotateAnim.setValue(0);
    }
  }, [loading]);

  const rotateInterpolate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  // Monitorar teclado
  useEffect(() => {
    const showSubscription = Keyboard.addListener('keyboardDidShow', () => {
      setKeyboardVisible(true);
    });
    const hideSubscription = Keyboard.addListener('keyboardDidHide', () => {
      setKeyboardVisible(false);
    });

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  // Funções para formatar valores
  const formatarNumero = (text: string, maxLength?: number) => {
    let cleaned = text.replace(/[^\d,.]/g, '');
    cleaned = cleaned.replace(',', '.');
    
    const parts = cleaned.split('.');
    if (parts.length > 2) {
      cleaned = parts[0] + '.' + parts.slice(1).join('');
    }
    
    if (maxLength && cleaned.length > maxLength) {
      cleaned = cleaned.substring(0, maxLength);
    }
    
    return cleaned;
  };

  const formatarIdade = (text: string) => {
    const cleaned = formatarNumero(text, 3);
    return cleaned;
  };

  const formatarAltura = (text: string) => {
    const cleaned = formatarNumero(text, 3);
    return cleaned;
  };

  const formatarPeso = (text: string) => {
    const cleaned = formatarNumero(text, 5);
    
    const parts = cleaned.split('.');
    if (parts.length > 1 && parts[1].length > 1) {
      return parts[0] + '.' + parts[1].substring(0, 1);
    }
    
    return cleaned;
  };

  const formatarMedida = (text: string) => {
    const cleaned = formatarNumero(text, 3);
    return cleaned;
  };

  const handleScroll = (event: any) => {
    const yOffset = event.nativeEvent.contentOffset.y;
    setScrollPosition(yOffset);
    
    if (yOffset > 100) {
      setIsScrolledDown(true);
      if (!showScrollButton) setShowScrollButton(true);
    } else {
      setIsScrolledDown(false);
      if (contentHeight > scrollViewHeight + 50 && yOffset < 50) {
        if (!showScrollButton) setShowScrollButton(true);
      }
    }
  };

  const handleContentSizeChange = (w: number, h: number) => {
    setContentHeight(h);
  };

  const handleLayout = (event: any) => {
    const { height } = event.nativeEvent.layout;
    setScrollViewHeight(height);
  };

  const scrollToTop = () => {
    scrollViewRef.current?.scrollTo({ y: 0, animated: true });
    setIsScrolledDown(false);
    Keyboard.dismiss();
  };

  const scrollToBottom = () => {
    scrollViewRef.current?.scrollToEnd({ animated: true });
    setIsScrolledDown(true);
    Keyboard.dismiss();
  };

  useEffect(() => {
    Animated.timing(buttonAnim, {
      toValue: showScrollButton ? 1 : 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [showScrollButton, buttonAnim]);

  // Funções de foco/blur para cada campo
  const handleIdadeFocus = () => {
    setFocusedInput('idade');
    if (keyboardVisible && idadeRef.current) {
      idadeRef.current.measure((x, y, width, height, pageX, pageY) => {
        scrollViewRef.current?.scrollTo({ y: pageY - 100, animated: true });
      });
    }
  };
  
  const handleIdadeBlur = () => setFocusedInput(null);
  
  const handleAlturaFocus = () => {
    setFocusedInput('altura');
    if (keyboardVisible && alturaRef.current) {
      alturaRef.current.measure((x, y, width, height, pageX, pageY) => {
        scrollViewRef.current?.scrollTo({ y: pageY - 100, animated: true });
      });
    }
  };
  
  const handleAlturaBlur = () => setFocusedInput(null);
  
  const handlePesoFocus = () => {
    setFocusedInput('peso');
    if (keyboardVisible && pesoRef.current) {
      pesoRef.current.measure((x, y, width, height, pageX, pageY) => {
        scrollViewRef.current?.scrollTo({ y: pageY - 100, animated: true });
      });
    }
  };
  
  const handlePesoBlur = () => setFocusedInput(null);
  
  const handleCinturaFocus = () => {
    setFocusedInput('cintura');
    if (keyboardVisible && cinturaRef.current) {
      cinturaRef.current.measure((x, y, width, height, pageX, pageY) => {
        scrollViewRef.current?.scrollTo({ y: pageY - 100, animated: true });
      });
    }
  };
  
  const handleCinturaBlur = () => setFocusedInput(null);
  
  const handlePescocoFocus = () => {
    setFocusedInput('pescoco');
    if (keyboardVisible && pescocoRef.current) {
      pescocoRef.current.measure((x, y, width, height, pageX, pageY) => {
        scrollViewRef.current?.scrollTo({ y: pageY - 100, animated: true });
      });
    }
  };
  
  const handlePescocoBlur = () => setFocusedInput(null);

  const handlePressOutside = () => {
    if (keyboardVisible) {
      Keyboard.dismiss();
    }
  };

  function validarDados() {
    const idadeNum = parseInt(idade) || 0;
    const alturaNum = parseInt(altura) || 0;
    const pesoNum = parseFloat(peso) || 0;
    const cinturaNum = parseInt(cintura) || 0;
    const pescocoNum = parseInt(pescoco) || 0;

    if (!idade || idadeNum < 14 || idadeNum > 100) {
      return 'Idade deve estar entre 14 e 100 anos';
    }
    if (!altura || alturaNum < 100 || alturaNum > 250) {
      return 'Altura deve estar entre 100 e 250 cm';
    }
    if (!peso || pesoNum < 30 || pesoNum > 300) {
      return 'Peso deve estar entre 30 e 300 kg';
    }
    if (!cintura || cinturaNum < 50 || cinturaNum > 200) {
      return 'Cintura deve estar entre 50 e 200 cm';
    }
    if (!pescoco || pescocoNum < 20 || pescocoNum > 60) {
      return 'Medida do pescoço deve estar entre 20 e 60 cm';
    }
    return '';
  }

  async function handleCalcular() {
    const erroValidacao = validarDados();
    if (erroValidacao) {
      setErro(erroValidacao);
      return;
    }

    setErro('');
    setLoading(true);
    Keyboard.dismiss();

    // Simular processamento (2 segundos)
    await new Promise(resolve => setTimeout(resolve, 2000));

    const dadosUsuario = {
      idade: parseInt(idade),
      altura: parseInt(altura),
      peso: parseFloat(peso),
      cintura: parseInt(cintura),
      pescoco: parseInt(pescoco),
      sexo: sexo,
    };
    
    setLoading(false);
    router.push({
      pathname: '/resultados',
      params: dadosUsuario
    });
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#F8FAFC' }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        {/* View principal que pode ser clicada para fechar teclado */}
        <View 
          style={{ flex: 1 }} 
          onStartShouldSetResponder={() => true}
          onResponderGrant={handlePressOutside}
        >
          <ScrollView
            ref={scrollViewRef}
            contentContainerStyle={styles.container}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
            style={{ backgroundColor: '#F8FAFC' }}
            onScroll={handleScroll}
            scrollEventThrottle={16}
            onContentSizeChange={handleContentSizeChange}
            onLayout={handleLayout}
          >
            {/* LOGO E CABEÇALHO */}
            <View style={styles.headerContainer}>
              <View style={styles.logoContainer}>
                <View style={styles.logoWrapper}>
                  <Image
                    source={require('@/assets/images/logo.png')}
                    style={[
                      styles.logo,
                      screenHeight < 700 && { width: 220, height: 120 },
                    ]}
                    resizeMode="contain"
                  />
                </View>
              </View>

              <View style={styles.headerTextContainer}>
                <Text style={styles.title}>Dados Biométricos</Text>
                <Text style={styles.subtitle}>
                  Informe suas medidas para calcular seu perfil corporal completo
                </Text>
              </View>
            </View>

            {/* GRID DE CARDS */}
            <View style={styles.cardsGrid}>
              {/* Card Idade */}
              <View style={styles.card}>
                <View style={styles.cardHeader}>
                  <View style={[styles.iconContainer, { backgroundColor: 'rgba(66, 133, 244, 0.1)' }]}>
                    <FontAwesome name="birthday-cake" size={22} color="#4285F4" />
                  </View>
                  <Text style={styles.cardLabel}>Idade</Text>
                </View>
                <View style={styles.inputContainer}>
                  <TextInput
                    ref={idadeRef}
                    style={[
                      styles.cardInput,
                      focusedInput === 'idade' && styles.cardInputFocused
                    ]}
                    placeholder="32"
                    placeholderTextColor="#94A3B8"
                    value={idade}
                    onChangeText={(text) => setIdade(formatarIdade(text))}
                    keyboardType="number-pad"
                    returnKeyType="next"
                    onFocus={handleIdadeFocus}
                    onBlur={handleIdadeBlur}
                    onSubmitEditing={() => alturaRef.current?.focus()}
                    maxLength={3}
                  />
                  <Text style={styles.cardUnit}>anos</Text>
                </View>
                <Text style={styles.cardHelperText}>Mínimo 14 anos</Text>
              </View>

              {/* Card Altura */}
              <View style={styles.card}>
                <View style={styles.cardHeader}>
                  <View style={[styles.iconContainer, { backgroundColor: 'rgba(52, 168, 83, 0.1)' }]}>
                    <MaterialIcons name="straighten" size={22} color="#34A853" />
                  </View>
                  <Text style={styles.cardLabel}>Altura</Text>
                </View>
                <View style={styles.inputContainer}>
                  <TextInput
                    ref={alturaRef}
                    style={[
                      styles.cardInput,
                      focusedInput === 'altura' && styles.cardInputFocused
                    ]}
                    placeholder="182"
                    placeholderTextColor="#94A3B8"
                    value={altura}
                    onChangeText={(text) => setAltura(formatarAltura(text))}
                    keyboardType="number-pad"
                    returnKeyType="next"
                    onFocus={handleAlturaFocus}
                    onBlur={handleAlturaBlur}
                    onSubmitEditing={() => pesoRef.current?.focus()}
                    maxLength={3}
                  />
                  <Text style={styles.cardUnit}>cm</Text>
                </View>
                <Text style={styles.cardHelperText}>Em centímetros</Text>
              </View>

              {/* Card Peso */}
              <View style={styles.card}>
                <View style={styles.cardHeader}>
                  <View style={[styles.iconContainer, { backgroundColor: 'rgba(234, 67, 53, 0.1)' }]}>
                    <MaterialCommunityIcons name="scale-bathroom" size={22} color="#EA4335" />
                  </View>
                  <Text style={styles.cardLabel}>Peso Atual</Text>
                </View>
                <View style={styles.inputContainer}>
                  <TextInput
                    ref={pesoRef}
                    style={[
                      styles.cardInput,
                      focusedInput === 'peso' && styles.cardInputFocused
                    ]}
                    placeholder="102.8"
                    placeholderTextColor="#94A3B8"
                    value={peso}
                    onChangeText={(text) => setPeso(formatarPeso(text))}
                    keyboardType="decimal-pad"
                    returnKeyType="next"
                    onFocus={handlePesoFocus}
                    onBlur={handlePesoBlur}
                    onSubmitEditing={() => cinturaRef.current?.focus()}
                    maxLength={6}
                  />
                  <Text style={styles.cardUnit}>kg</Text>
                </View>
                <Text style={styles.cardHelperText}>Com uma casa decimal</Text>
              </View>

              {/* Card Cintura */}
              <View style={styles.card}>
                <View style={styles.cardHeader}>
                  <View style={[styles.iconContainer, { backgroundColor: 'rgba(251, 188, 4, 0.1)' }]}>
                    <FontAwesome6 name="tape" size={20} color="#FBBC04" />
                  </View>
                  <Text style={styles.cardLabel}>Cintura</Text>
                </View>
                <View style={styles.inputContainer}>
                  <TextInput
                    ref={cinturaRef}
                    style={[
                      styles.cardInput,
                      focusedInput === 'cintura' && styles.cardInputFocused
                    ]}
                    placeholder="109"
                    placeholderTextColor="#94A3B8"
                    value={cintura}
                    onChangeText={(text) => setCintura(formatarMedida(text))}
                    keyboardType="number-pad"
                    returnKeyType="next"
                    onFocus={handleCinturaFocus}
                    onBlur={handleCinturaBlur}
                    onSubmitEditing={() => pescocoRef.current?.focus()}
                    maxLength={3}
                  />
                  <Text style={styles.cardUnit}>cm</Text>
                </View>
                <Text style={styles.cardHelperText}>Na altura do umbigo</Text>
              </View>

              {/* Card Pescoço */}
              <View style={styles.card}>
                <View style={styles.cardHeader}>
                  <View style={[styles.iconContainer, { backgroundColor: 'rgba(66, 133, 244, 0.1)' }]}>
                    <MaterialCommunityIcons name="necklace" size={22} color="#4285F4" />
                  </View>
                  <Text style={styles.cardLabel}>Pescoço</Text>
                </View>
                <View style={styles.inputContainer}>
                  <TextInput
                    ref={pescocoRef}
                    style={[
                      styles.cardInput,
                      focusedInput === 'pescoco' && styles.cardInputFocused
                    ]}
                    placeholder="42"
                    placeholderTextColor="#94A3B8"
                    value={pescoco}
                    onChangeText={(text) => setPescoco(formatarMedida(text))}
                    keyboardType="number-pad"
                    returnKeyType="done"
                    onFocus={handlePescocoFocus}
                    onBlur={handlePescocoBlur}
                    onSubmitEditing={handleCalcular}
                    maxLength={3}
                  />
                  <Text style={styles.cardUnit}>cm</Text>
                </View>
                <Text style={styles.cardHelperText}>Abaixo do gogó</Text>
              </View>
            </View>

            {/* CARD SEXO - MAIOR E DESTACADO */}
            <View style={styles.sexoCard}>
              <View style={styles.sexoCardHeader}>
                <View style={[styles.iconContainer, { backgroundColor: 'rgba(219, 68, 55, 0.1)' }]}>
                  <FontAwesome name="user" size={22} color="#DB4437" />
                </View>
                <Text style={styles.sexoCardLabel}>Sexo Biológico</Text>
              </View>
              <Text style={styles.sexoCardDescription}>
                Para cálculos precisos de % de gordura
              </Text>
              
              <View style={styles.sexoButtonsContainer}>
                <TouchableOpacity
                  style={[
                    styles.sexoButton,
                    sexo === 'masculino' && styles.sexoButtonSelected
                  ]}
                  onPress={() => setSexo('masculino')}
                >
                  <MaterialIcons 
                    name="male" 
                    size={24} 
                    color={sexo === 'masculino' ? '#FFFFFF' : '#64748B'} 
                  />
                  <Text style={[
                    styles.sexoButtonText,
                    sexo === 'masculino' && styles.sexoButtonTextSelected
                  ]}>Masculino</Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={[
                    styles.sexoButton,
                    sexo === 'feminino' && styles.sexoButtonSelected
                  ]}
                  onPress={() => setSexo('feminino')}
                >
                  <MaterialIcons 
                    name="female" 
                    size={24} 
                    color={sexo === 'feminino' ? '#FFFFFF' : '#64748B'} 
                  />
                  <Text style={[
                    styles.sexoButtonText,
                    sexo === 'feminino' && styles.sexoButtonTextSelected
                  ]}>Feminino</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* CARD DE INFORMAÇÃO */}
            <View style={styles.infoCard}>
              <View style={styles.infoHeader}>
                <MaterialIcons name="info" size={22} color="#1E88E5" />
                <Text style={styles.infoTitle}>Importante</Text>
              </View>
              <Text style={styles.infoText}>
                Estas medidas são essenciais para calcular com precisão seu IMC, 
                percentual de gordura, metabolismo basal e criar um plano de treino 
                personalizado para seus objetivos.
              </Text>
            </View>

            {/* ERRO */}
            {erro ? (
              <View style={styles.errorCard}>
                <MaterialIcons name="error-outline" size={22} color="#DC2626" />
                <Text style={styles.errorText}>{erro}</Text>
              </View>
            ) : null}

            {/* BOTÕES DE AÇÃO */}
            <View style={styles.buttonsContainer}>
              <TouchableOpacity
                style={styles.primaryButton}
                onPress={handleCalcular}
                activeOpacity={0.8}
                disabled={loading}
              >
                <View style={styles.buttonContent}>
                  <Text style={styles.primaryButtonText}>
                    {loading ? 'Calculando...' : 'Calcular Resultados'}
                  </Text>
                  {!loading && <MaterialIcons name="calculate" size={22} color="#FFFFFF" />}
                </View>
                <Text style={styles.buttonSubtext}>Ver análise completa</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.secondaryButton, loading && styles.buttonDisabled]}
                onPress={() => {
                  Keyboard.dismiss();
                  router.back();
                }}
                activeOpacity={0.6}
                disabled={loading}
              >
                <Ionicons name="arrow-back" size={18} color="#475569" />
                <Text style={styles.secondaryButtonText}>Voltar</Text>
              </TouchableOpacity>
            </View>
            
            {/* Espaço extra para teclado */}
            <View style={{ height: keyboardVisible ? 300 : 40 }} />
          </ScrollView>
        </View>
      </KeyboardAvoidingView>

      {/* MODAL DO LOADER */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={loading}
        onRequestClose={() => {}}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.loaderContainer}>
            <Animated.View style={[
              styles.loaderCircle,
              { transform: [{ rotate: rotateInterpolate }] }
            ]}>
              <MaterialCommunityIcons name="atom" size={50} color="#1E88E5" />
            </Animated.View>
            
            <Text style={styles.loaderTitle}>Analisando seus dados</Text>
            <Text style={styles.loaderSubtitle}>
              Calculando IMC, percentual de gordura e metabolismo basal...
            </Text>
            
            <View style={styles.loaderDots}>
              <View style={[styles.dot, styles.dot1]} />
              <View style={[styles.dot, styles.dot2]} />
              <View style={[styles.dot, styles.dot3]} />
            </View>
          </View>
        </View>
      </Modal>

      {/* BOTÃO FLUTUANTE DE SCROLL OPACO */}
      <Animated.View
        style={[
          styles.floatingButtonContainer,
          {
            opacity: buttonAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [0, 0.8],
            }),
            transform: [
              {
                translateY: buttonAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [100, 0],
                }),
              },
            ],
          },
        ]}
      >
        <TouchableOpacity
          style={styles.floatingButton}
          onPress={isScrolledDown ? scrollToTop : scrollToBottom}
          activeOpacity={0.9}
          disabled={loading}
        >
          {isScrolledDown ? (
            <>
              <Ionicons name="chevron-up" size={20} color="#FFFFFF" />
              <Text style={styles.floatingButtonText}>Topo</Text>
            </>
          ) : (
            <>
              <Ionicons name="chevron-down" size={20} color="#FFFFFF" />
              <Text style={styles.floatingButtonText}>Final</Text>
            </>
          )}
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#F8FAFC',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingBottom: 40,
  },

  // HEADER
  headerContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  logoContainer: {
    marginBottom: 20,
  },
  logoWrapper: {
    borderRadius: 20,
    padding: 16,
    backgroundColor: 'rgba(30, 136, 229, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(30, 136, 229, 0.1)',
  },
  logo: {
    width: 240,
    height: 130,
  },
  headerTextContainer: {
    alignItems: 'center',
    maxWidth: '90%',
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#1E293B',
    marginBottom: 8,
    textAlign: 'center',
    fontFamily: 'Inter',
  },
  subtitle: {
    fontSize: 15,
    color: '#64748B',
    marginBottom: 4,
    textAlign: 'center',
    lineHeight: 22,
    fontFamily: 'Inter',
  },

  // CARDS GRID
  cardsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  card: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 5,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  cardLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: '#334155',
    fontFamily: 'Inter',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  cardInput: {
    flex: 1,
    height: 52,
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 18,
    fontWeight: '700',
    backgroundColor: '#F8FAFC',
    color: '#1E293B',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    fontFamily: 'Inter',
    includeFontPadding: false,
    textAlignVertical: 'center',
  },
  cardInputFocused: {
    borderColor: '#1E88E5',
    backgroundColor: '#FFFFFF',
    shadowColor: '#1E88E5',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  cardUnit: {
    marginLeft: 12,
    fontSize: 15,
    color: '#64748B',
    fontWeight: '600',
    fontFamily: 'Inter',
  },
  cardHelperText: {
    fontSize: 12,
    color: '#94A3B8',
    fontFamily: 'Inter',
  },

  // SEXO CARD
  sexoCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 8,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  sexoCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  sexoCardLabel: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1E293B',
    fontFamily: 'Inter',
  },
  sexoCardDescription: {
    fontSize: 14,
    color: '#64748B',
    marginBottom: 20,
    fontFamily: 'Inter',
  },
  sexoButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  sexoButton: {
    flex: 1,
    height: 60,
    borderRadius: 14,
    backgroundColor: '#F8FAFC',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#E2E8F0',
    flexDirection: 'row',
    gap: 10,
  },
  sexoButtonSelected: {
    backgroundColor: '#1E88E5',
    borderColor: '#1E88E5',
  },
  sexoButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#64748B',
    fontFamily: 'Inter',
  },
  sexoButtonTextSelected: {
    color: '#FFFFFF',
  },

  // INFO CARD
  infoCard: {
    backgroundColor: '#EFF6FF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#DBEAFE',
  },
  infoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 10,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1E40AF',
    fontFamily: 'Inter',
  },
  infoText: {
    fontSize: 14,
    color: '#1E40AF',
    lineHeight: 22,
    fontFamily: 'Inter',
    opacity: 0.9,
  },

  // ERROR CARD
  errorCard: {
    backgroundColor: '#FEF2F2',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  errorText: {
    fontSize: 14,
    color: '#DC2626',
    flex: 1,
    lineHeight: 20,
    fontFamily: 'Inter',
  },

  // BOTÕES
  buttonsContainer: {
    marginTop: 8,
    marginBottom: 20,
    gap: 16,
  },
  primaryButton: {
    backgroundColor: '#1E88E5',
    borderRadius: 16,
    paddingVertical: 20,
    paddingHorizontal: 24,
    shadowColor: '#1E88E5',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    marginBottom: 6,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
    fontFamily: 'Inter',
  },
  buttonSubtext: {
    color: '#E3F2FD',
    fontSize: 13,
    textAlign: 'center',
    fontFamily: 'Inter',
  },
  secondaryButton: {
    height: 52,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#CBD5E1',
    backgroundColor: 'transparent',
    flexDirection: 'row',
    gap: 8,
  },
  secondaryButtonText: {
    color: '#475569',
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Inter',
  },

  // LOADER MODAL
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loaderContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 40,
    alignItems: 'center',
    width: '85%',
    maxWidth: 350,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  loaderCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#F0F9FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    borderWidth: 3,
    borderColor: '#E0F2FE',
  },
  loaderTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 12,
    textAlign: 'center',
    fontFamily: 'Inter',
  },
  loaderSubtitle: {
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
    fontFamily: 'Inter',
  },
  loaderDots: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#1E88E5',
  },
  dot1: {
    opacity: 0.4,
  },
  dot2: {
    opacity: 0.7,
  },
  dot3: {
    opacity: 1,
  },

  // BOTÃO FLUTUANTE OPACO
  floatingButtonContainer: {
    position: 'absolute',
    bottom: 50,
    right: 20,
    zIndex: 100,
  },
  floatingButton: {
    backgroundColor: 'rgba(30, 136, 229, 0.9)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    minWidth: 100,
  },
  floatingButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 6,
    fontFamily: 'Inter',
  },
});