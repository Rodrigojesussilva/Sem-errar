// app/(drawer)/perfil.tsx - VERSÃO COMPLETA COM LOGO
import { Feather, FontAwesome5, Ionicons, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Easing,
  Platform,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

export default function PerfilScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const scrollViewRef = useRef<ScrollView>(null);
  
  // Estado para controle do botão flutuante
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [isScrolledDown, setIsScrolledDown] = useState(false);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [scrollViewHeight, setScrollViewHeight] = useState(0);
  const [contentHeight, setContentHeight] = useState(0);
  
  // Dados do perfil do usuário
  const [userProfile, setUserProfile] = useState({
    nome: 'Haje',
    idade: parseInt(params.idade as string) || 50,
    altura: parseInt(params.altura as string) || 170,
    peso: parseFloat(params.peso as string) || 102.8,
    cintura: parseInt(params.cintura as string) || 109,
    pescoco: parseInt(params.pescoco as string) || 42,
    sexo: params.sexo as string || 'masculino',
  });

  // Animações
  const fadeAnim = useState(new Animated.Value(0))[0];
  const slideAnim = useState(new Animated.Value(30))[0];
  const buttonAnim = useState(new Animated.Value(0))[0];

  // Resultados calculados
  const [resultados, setResultados] = useState({
    imc: 0,
    classificacaoIMC: '',
    pesoIdealMin: 0,
    pesoIdealMax: 0,
    bfPercentual: 0,
    massaGorda: 0,
    massaMagra: 0,
    metabolismoBasal: 0,
    caloriasManter: 0,
    caloriasPerder: 0,
    nivelGordura: '',
    aguaDiaria: 0,
  });

  useEffect(() => {
    // Animações de entrada
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 500,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();

    // Calcular resultados
    calcularResultados();
  }, []);

  useEffect(() => {
    // Animar entrada/saída do botão flutuante
    Animated.timing(buttonAnim, {
      toValue: showScrollButton ? 1 : 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [showScrollButton, buttonAnim]);

  const handleScroll = (event: any) => {
    const yOffset = event.nativeEvent.contentOffset.y;
    setScrollPosition(yOffset);
    
    // Se o usuário rolou para baixo mais de 100px, mostrar botão "subir"
    if (yOffset > 100) {
      setIsScrolledDown(true);
      if (!showScrollButton) setShowScrollButton(true);
    } else {
      setIsScrolledDown(false);
      // Mostrar botão "descer" apenas se houver mais conteúdo abaixo
      if (canScrollDown && yOffset < 50) {
        if (!showScrollButton) setShowScrollButton(true);
      } else if (!canScrollDown && showScrollButton) {
        setShowScrollButton(false);
      }
    }
    
    // Esconder botão se estiver no topo sem conteúdo para descer
    if (yOffset < 50 && !canScrollDown && showScrollButton) {
      setShowScrollButton(false);
    }
  };

  const handleContentSizeChange = (w: number, h: number) => {
    setContentHeight(h);
    // Verificar se há conteúdo suficiente para scroll
    if (h > scrollViewHeight && !showScrollButton) {
      setShowScrollButton(true);
    }
  };

  const handleLayout = (event: any) => {
    const { height } = event.nativeEvent.layout;
    setScrollViewHeight(height);
  };

  const scrollToTop = () => {
    scrollViewRef.current?.scrollTo({ y: 0, animated: true });
    setIsScrolledDown(false);
  };

  const scrollToBottom = () => {
    scrollViewRef.current?.scrollToEnd({ animated: true });
    setIsScrolledDown(true);
  };

  function calcularResultados() {
    const alturaM = userProfile.altura / 100;
    const imc = userProfile.peso / (alturaM * alturaM);

    // Cálculo % Gordura (US Navy Method)
    let bfPercentual;
    if (userProfile.sexo === 'masculino') {
      bfPercentual = 495 / (1.0324 - 0.19077 * Math.log10(userProfile.cintura - userProfile.pescoco) + 0.15456 * Math.log10(userProfile.altura)) - 450;
    } else {
      bfPercentual = 495 / (1.29579 - 0.35004 * Math.log10(userProfile.cintura + userProfile.altura - userProfile.pescoco) + 0.22100 * Math.log10(userProfile.altura)) - 450;
    }

    // Massa gorda e magra
    const massaGorda = (userProfile.peso * bfPercentual) / 100;
    const massaMagra = userProfile.peso - massaGorda;

    // Peso ideal (IMC 18.5 - 24.9)
    const pesoIdealMin = 18.5 * (alturaM * alturaM);
    const pesoIdealMax = 24.9 * (alturaM * alturaM);

    // Metabolismo basal (Harris-Benedict)
    let metabolismoBasal;
    if (userProfile.sexo === 'masculino') {
      metabolismoBasal = 88.362 + (13.397 * userProfile.peso) + (4.799 * userProfile.altura) - (5.677 * userProfile.idade);
    } else {
      metabolismoBasal = 447.593 + (9.247 * userProfile.peso) + (3.098 * userProfile.altura) - (4.330 * userProfile.idade);
    }

    // Calorias para manutenção (sedentário)
    const caloriasManter = metabolismoBasal * 1.2;
    const caloriasPerder = caloriasManter * 0.85;

    // Classificação IMC
    let classificacaoIMC = '';
    let nivelGordura = '';

    if (imc < 18.5) classificacaoIMC = 'Abaixo do peso';
    else if (imc < 25) classificacaoIMC = 'Peso normal';
    else if (imc < 30) classificacaoIMC = 'Sobrepeso';
    else if (imc < 35) classificacaoIMC = 'Obesidade Grau I';
    else if (imc < 40) classificacaoIMC = 'Obesidade Grau II';
    else classificacaoIMC = 'Obesidade Grau III';

    // Classificação % Gordura
    if (userProfile.sexo === 'masculino') {
      if (bfPercentual < 6) nivelGordura = 'Essencial';
      else if (bfPercentual < 14) nivelGordura = 'Atleta';
      else if (bfPercentual < 18) nivelGordura = 'Fitness';
      else if (bfPercentual < 25) nivelGordura = 'Aceitável';
      else nivelGordura = 'Obeso';
    } else {
      if (bfPercentual < 14) nivelGordura = 'Essencial';
      else if (bfPercentual < 21) nivelGordura = 'Atleta';
      else if (bfPercentual < 25) nivelGordura = 'Fitness';
      else if (bfPercentual < 32) nivelGordura = 'Aceitável';
      else nivelGordura = 'Obeso';
    }

    // Água diária (ml)
    const aguaDiaria = userProfile.peso * 35;

    setResultados({
      imc: parseFloat(imc.toFixed(2)),
      classificacaoIMC,
      pesoIdealMin: parseFloat(pesoIdealMin.toFixed(1)),
      pesoIdealMax: parseFloat(pesoIdealMax.toFixed(1)),
      bfPercentual: parseFloat(bfPercentual.toFixed(1)),
      massaGorda: parseFloat(massaGorda.toFixed(1)),
      massaMagra: parseFloat(massaMagra.toFixed(1)),
      metabolismoBasal: Math.round(metabolismoBasal),
      caloriasManter: Math.round(caloriasManter),
      caloriasPerder: Math.round(caloriasPerder),
      nivelGordura,
      aguaDiaria: Math.round(aguaDiaria),
    });
  }

  const getIMCColor = () => {
    if (resultados.imc < 18.5) return '#4FC3F7';
    if (resultados.imc < 25) return '#4CAF50';
    if (resultados.imc < 30) return '#FF9800';
    return '#F44336';
  };

  const getBFColor = () => {
    if (resultados.bfPercentual < 25) return '#4CAF50';
    if (resultados.bfPercentual < 32) return '#FF9800';
    return '#F44336';
  };

  const shareResults = async () => {
    try {
      const message = `Meus resultados corporais:
📊 IMC: ${resultados.imc} (${resultados.classificacaoIMC})
📏 Altura: ${userProfile.altura}cm | Peso: ${userProfile.peso}kg
💪 Massa Magra: ${resultados.massaMagra}kg | Gordura: ${resultados.massaGorda}kg
🎯 Peso Ideal: ${resultados.pesoIdealMin}-${resultados.pesoIdealMax}kg`;

      await Share.share({
        message,
        title: 'Meus Resultados Corporais',
      });
    } catch (error) {
      console.log(error);
    }
  };

  // Função para editar nome (simulação)
  const handleEditName = () => {
    // Em uma implementação real, isso abriria um modal de edição
    alert('Funcionalidade de edição de nome em desenvolvimento');
  };

  // Função para editar foto (simulação)
  const handleEditPhoto = () => {
    // Em uma implementação real, isso abriria um seletor de imagem
    alert('Funcionalidade de edição de foto em desenvolvimento');
  };

  // Calcula se pode rolar para baixo/para cima
  const canScrollDown = contentHeight > scrollViewHeight;
  const canScrollUp = scrollPosition > 100;

  return (
    <View style={{ flex: 1, backgroundColor: '#F5F7FA' }}>
      <ScrollView
        ref={scrollViewRef}
        style={{ flex: 1 }}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentContainer}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        onContentSizeChange={handleContentSizeChange}
        onLayout={handleLayout}
      >
        {/* LOGO DO APLICATIVO NO TOPO */}
        <View style={styles.logoHeader}>
          <View style={styles.logoContainer}>
            <View style={styles.logoBackground}>
              <Text style={styles.logoText}>FIT</Text>
            </View>
            <View>
              <Text style={styles.appName}>FitnessPro</Text>
              <Text style={styles.appTagline}>Seu progresso em um só lugar</Text>
            </View>
          </View>
        </View>

        {/* HEADER COM PERFIL DO USUÁRIO */}
        <View style={styles.profileHeader}>
          <View style={styles.profileTopBar}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => router.push('/dados')}
            >
              <Ionicons name="arrow-back" size={24} color="#1E88E5" />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.shareButton}
              onPress={shareResults}
            >
              <Feather name="share-2" size={22} color="#1E88E5" />
            </TouchableOpacity>
          </View>

          {/* PERFIL DO USUÁRIO */}
          <View style={styles.profileInfoContainer}>
            {/* Foto do perfil (com ícone) */}
            <TouchableOpacity 
              style={styles.profileImageContainer}
              onPress={handleEditPhoto}
              activeOpacity={0.7}
            >
              <View style={styles.profileImage}>
                <FontAwesome5 
                  name="user-circle" 
                  size={76} 
                  color="#1E88E5" 
                />
              </View>
              <View style={styles.editPhotoBadge}>
                <MaterialIcons name="edit" size={14} color="#FFFFFF" />
              </View>
            </TouchableOpacity>

            {/* Nome e botão de editar */}
            <View style={styles.nameContainer}>
              <View style={styles.nameRow}>
                <Text style={styles.profileName}>{userProfile.nome}</Text>
                <TouchableOpacity 
                  style={styles.editNameButton}
                  onPress={handleEditName}
                >
                  <Feather name="edit-2" size={16} color="#64748B" />
                </TouchableOpacity>
              </View>
              
              <View style={styles.profileBadge}>
                <MaterialIcons 
                  name={userProfile.sexo === 'masculino' ? 'male' : 'female'} 
                  size={14} 
                  color="#1E88E5" 
                />
                <Text style={styles.profileBadgeText}>
                  {userProfile.sexo === 'masculino' ? 'Homem' : 'Mulher'} • {userProfile.idade} anos
                </Text>
              </View>
            </View>
          </View>

          {/* CARD RESUMO RÁPIDO */}
          <View style={styles.quickStatsCard}>
            <View style={styles.quickStat}>
              <Text style={styles.quickStatValue}>{userProfile.altura}<Text style={styles.quickStatUnit}>cm</Text></Text>
              <Text style={styles.quickStatLabel}>Altura</Text>
            </View>

            <View style={styles.quickStatDivider} />

            <View style={styles.quickStat}>
              <Text style={styles.quickStatValue}>{userProfile.peso}<Text style={styles.quickStatUnit}>kg</Text></Text>
              <Text style={styles.quickStatLabel}>Peso</Text>
            </View>

            <View style={styles.quickStatDivider} />

            <View style={styles.quickStat}>
              <Text style={styles.quickStatValue}>{resultados.imc.toFixed(1)}</Text>
              <Text style={styles.quickStatLabel}>IMC</Text>
            </View>
          </View>
        </View>

        {/* SEÇÃO 1: DADOS CORPORAIS COMPLETOS */}
        <Animated.View
          style={[
            styles.section,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <Text style={styles.sectionTitle}>Dados Corporais</Text>

          <View style={styles.dadosContainer}>
            {/* Linha 1: Sexo + Idade */}
            <View style={styles.dadosRow}>
              <View style={styles.dadoItem}>
                <View style={[styles.iconContainer, { backgroundColor: '#E3F2FD' }]}>
                  {userProfile.sexo === 'masculino' ? (
                    <MaterialIcons name="male" size={28} color="#1E88E5" />
                  ) : (
                    <MaterialIcons name="female" size={28} color="#E91E63" />
                  )}
                </View>
                <Text style={styles.dadoLabel}>
                  {userProfile.sexo === 'masculino' ? 'Homem' : 'Mulher'}
                </Text>
                <Text style={styles.dadoValue}>{userProfile.idade}<Text style={styles.dadoUnit}>anos</Text></Text>
              </View>

              <View style={styles.dadoItem}>
                <View style={[styles.iconContainer, { backgroundColor: '#FFF3E0' }]}>
                  <MaterialCommunityIcons name="cake" size={28} color="#FF9800" />
                </View>
                <Text style={styles.dadoLabel}>Idade</Text>
                <Text style={styles.dadoValue}>{userProfile.idade}<Text style={styles.dadoUnit}>anos</Text></Text>
              </View>
            </View>

            {/* Linha 2: Altura + Peso */}
            <View style={styles.dadosRow}>
              <View style={styles.dadoItem}>
                <View style={[styles.iconContainer, { backgroundColor: '#E8F5E9' }]}>
                  <MaterialCommunityIcons name="human-male-height" size={28} color="#4CAF50" />
                </View>
                <Text style={styles.dadoLabel}>Altura</Text>
                <Text style={styles.dadoValue}>{userProfile.altura}<Text style={styles.dadoUnit}>cm</Text></Text>
              </View>

              <View style={styles.dadoItem}>
                <View style={[styles.iconContainer, { backgroundColor: '#FCE4EC' }]}>
                  <MaterialCommunityIcons name="scale" size={28} color="#E91E63" />
                </View>
                <Text style={styles.dadoLabel}>Peso Atual</Text>
                <Text style={styles.dadoValue}>{userProfile.peso}<Text style={styles.dadoUnit}>kg</Text></Text>
              </View>
            </View>

            {/* Linha 3: Cintura + Pescoço */}
            <View style={styles.dadosRow}>
              <View style={styles.dadoItem}>
                <View style={[styles.iconContainer, { backgroundColor: '#F3E5F5' }]}>
                  <MaterialCommunityIcons name="tape-measure" size={28} color="#9C27B0" />
                </View>
                <Text style={styles.dadoLabel}>Cintura</Text>
                <Text style={styles.dadoValue}>{userProfile.cintura}<Text style={styles.dadoUnit}>cm</Text></Text>
              </View>

              <View style={styles.dadoItem}>
                <View style={[styles.iconContainer, { backgroundColor: '#E0F7FA' }]}>
                  <MaterialCommunityIcons name="necklace" size={28} color="#00BCD4" />
                </View>
                <Text style={styles.dadoLabel}>Pescoço</Text>
                <Text style={styles.dadoValue}>{userProfile.pescoco}<Text style={styles.dadoUnit}>cm</Text></Text>
              </View>
            </View>
          </View>
        </Animated.View>

        {/* SEÇÃO 2: ÍNDICE DE MASSA CORPORAL */}
        <Animated.View
          style={[
            styles.section,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <Text style={styles.sectionTitle}>Índice de Massa Corporal</Text>

          <View style={styles.imcCard}>
            <View style={styles.imcHeader}>
              <Text style={styles.imcNumber}>{resultados.imc.toFixed(2)}</Text>
              <Text style={styles.imcLabel}>IMC</Text>
            </View>

            <Text style={[styles.imcClassification, { color: getIMCColor() }]}>
              {resultados.classificacaoIMC}
            </Text>

            <Text style={styles.imcIdealWeight}>
              Peso ideal: {resultados.pesoIdealMin} - {resultados.pesoIdealMax} kg
            </Text>

            <View style={styles.progressContainer}>
              <View style={styles.progressBar}>
                <View
                  style={[
                    styles.progressFill,
                    {
                      width: `${Math.min(resultados.imc / 40 * 100, 100)}%`,
                      backgroundColor: getIMCColor(),
                    }
                  ]}
                />
              </View>
              <View style={styles.progressLabels}>
                <Text style={styles.progressLabel}>18.5</Text>
                <Text style={styles.progressLabel}>25</Text>
                <Text style={styles.progressLabel}>30</Text>
                <Text style={styles.progressLabel}>40+</Text>
              </View>
            </View>
          </View>
        </Animated.View>

        {/* SEÇÃO 3: COMPOSIÇÃO CORPORAL */}
        <Animated.View
          style={[
            styles.section,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <Text style={styles.sectionTitle}>Composição Corporal</Text>

          <View style={styles.compositionContainer}>
            {/* Gordura Corporal */}
            <View style={styles.compositionCard}>
              <View style={styles.compositionHeader}>
                <FontAwesome5 name="weight" size={22} color="#FF6B6B" />
                <Text style={styles.compositionTitle}>Gordura Corporal</Text>
              </View>
              <View style={[styles.bfCircle, { borderColor: getBFColor() }]}>
                <Text style={styles.bfPercent}>{resultados.bfPercentual}%</Text>
                <Text style={styles.bfLabel}>BF%</Text>
              </View>
              <Text style={[styles.bfClassification, { color: getBFColor() }]}>
                {resultados.nivelGordura}
              </Text>
            </View>

            {/* Massa Muscular */}
            <View style={styles.compositionCard}>
              <View style={styles.compositionHeader}>
                <FontAwesome5 name="dumbbell" size={22} color="#4CAF50" />
                <Text style={styles.compositionTitle}>Massa Muscular</Text>
              </View>

              <View style={styles.massRow}>
                <View style={styles.massItem}>
                  <Text style={styles.massValue}>{resultados.massaMagra}kg</Text>
                  <Text style={styles.massLabel}>Magra</Text>
                </View>

                <View style={styles.massDivider} />

                <View style={styles.massItem}>
                  <Text style={styles.massValue}>{resultados.massaGorda}kg</Text>
                  <Text style={styles.massLabel}>Gorda</Text>
                </View>
              </View>
            </View>
          </View>
        </Animated.View>

        {/* SEÇÃO 4: METABOLISMO & CALORIAS */}
        <Animated.View
          style={[
            styles.section,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <Text style={styles.sectionTitle}>Metabolismo & Calorias</Text>

          <View style={styles.caloriesGrid}>
            <View style={[styles.calorieCard, { backgroundColor: '#FFF8E1' }]}>
              <Feather name="activity" size={24} color="#FF9800" />
              <Text style={styles.calorieValue}>{resultados.metabolismoBasal}</Text>
              <Text style={styles.calorieLabel}>Metabolismo Basal</Text>
              <Text style={styles.calorieUnit}>kcal/dia</Text>
            </View>

            <View style={[styles.calorieCard, { backgroundColor: '#E8F5E9' }]}>
              <Feather name="trending-up" size={24} color="#4CAF50" />
              <Text style={styles.calorieValue}>{resultados.caloriasManter}</Text>
              <Text style={styles.calorieLabel}>Manter Peso</Text>
              <Text style={styles.calorieUnit}>kcal/dia</Text>
            </View>

            <View style={[styles.calorieCard, { backgroundColor: '#FFEBEE' }]}>
              <Feather name="trending-down" size={24} color="#F44336" />
              <Text style={styles.calorieValue}>{resultados.caloriasPerder}</Text>
              <Text style={styles.calorieLabel}>Perder Peso</Text>
              <Text style={styles.calorieUnit}>kcal/dia</Text>
            </View>

            <View style={[styles.calorieCard, { backgroundColor: '#E3F2FD' }]}>
              <Ionicons name="water" size={24} color="#2196F3" />
              <Text style={styles.calorieValue}>{resultados.aguaDiaria}</Text>
              <Text style={styles.calorieLabel}>Água Diária</Text>
              <Text style={styles.calorieUnit}>ml</Text>
            </View>
          </View>
        </Animated.View>

        {/* BOTÕES DE AÇÃO */}
        <Animated.View
          style={[
            styles.actionContainer,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={() => router.push('/dados')}
          >
            <Feather name="refresh-cw" size={20} color="#FFFFFF" />
            <Text style={styles.primaryButtonText}>Atualizar Dados</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={() => router.push('/')}
          >
            <Text style={styles.secondaryButtonText}>Voltar ao Início</Text>
          </TouchableOpacity>
        </Animated.View>
      </ScrollView>

      {/* BOTÃO FLUTUANTE DE SCROLL OPACO */}
      <Animated.View
        style={[
          styles.floatingButtonContainer,
          {
            opacity: buttonAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [0, 0.7], // OPACIDADE AJUSTADA (0.7 = 70% opaco)
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
        >
          {isScrolledDown ? (
            <>
              <Ionicons name="chevron-up" size={22} color="#FFFFFF" />
              <Text style={styles.floatingButtonText}>Subir</Text>
            </>
          ) : (
            <>
              <Ionicons name="chevron-down" size={22} color="#FFFFFF" />
              <Text style={styles.floatingButtonText}>Descer</Text>
            </>
          )}
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  contentContainer: {
    flexGrow: 1,
    paddingBottom: 30,
    backgroundColor: '#F5F7FA',
  },
  // LOGO DO APLICATIVO
  logoHeader: {
    backgroundColor: '#FFFFFF',
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  logoBackground: {
    width: 60,
    height: 60,
    borderRadius: 16,
    backgroundColor: '#1E88E5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
    shadowColor: '#1E88E5',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  logoText: {
    fontSize: 28,
    fontWeight: '900',
    color: '#FFFFFF',
    fontFamily: 'Inter',
  },
  appName: {
    fontSize: 24,
    fontWeight: '800',
    color: '#1E293B',
    fontFamily: 'Inter',
  },
  appTagline: {
    fontSize: 14,
    color: '#64748B',
    fontFamily: 'Inter',
    marginTop: 4,
  },
  // HEADER COM PERFIL
  profileHeader: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 20,
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  profileTopBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  profileInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  profileImageContainer: {
    position: 'relative',
    marginRight: 16,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 3,
    borderColor: '#1E88E5',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#E3F2FD',
  },
  editPhotoBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#1E88E5',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  nameContainer: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  profileName: {
    fontSize: 28,
    fontWeight: '700',
    color: '#333333',
    fontFamily: 'Inter',
    marginRight: 10,
  },
  editNameButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F5F7FA',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  profileBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E3F2FD',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    alignSelf: 'flex-start',
  },
  profileBadgeText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1E88E5',
    marginLeft: 6,
    fontFamily: 'Inter',
  },
  quickStatsCard: {
    flexDirection: 'row',
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 20,
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  quickStat: {
    flex: 1,
    alignItems: 'center',
  },
  quickStatValue: {
    fontSize: 24,
    fontWeight: '800',
    color: '#333333',
    fontFamily: 'Inter',
  },
  quickStatUnit: {
    fontSize: 14,
    fontWeight: '400',
    color: '#666666',
    marginLeft: 2,
  },
  quickStatLabel: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 4,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  quickStatDivider: {
    width: 1,
    height: 30,
    backgroundColor: '#E2E8F0',
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#F5F7FA',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  shareButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#F5F7FA',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  // SEÇÃO GERAL
  section: {
    marginHorizontal: 16,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333333',
    marginBottom: 16,
    marginLeft: 4,
    fontFamily: 'Inter',
  },
  // DADOS RECUPERADOS
  dadosContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  dadosRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  dadoItem: {
    flex: 1,
    alignItems: 'center',
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  dadoLabel: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 4,
    fontFamily: 'Inter',
  },
  dadoValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#333333',
    fontFamily: 'Inter',
  },
  dadoUnit: {
    fontSize: 14,
    fontWeight: '400',
    color: '#666666',
    marginLeft: 2,
    fontFamily: 'Inter',
  },
  // IMC
  imcCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  imcHeader: {
    alignItems: 'center',
    marginBottom: 12,
  },
  imcNumber: {
    fontSize: 48,
    fontWeight: '800',
    color: '#333333',
    fontFamily: 'Inter',
  },
  imcLabel: {
    fontSize: 18,
    color: '#666666',
    marginTop: -8,
    fontFamily: 'Inter',
  },
  imcClassification: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 8,
    textAlign: 'center',
    fontFamily: 'Inter',
  },
  imcIdealWeight: {
    fontSize: 16,
    color: '#666666',
    marginBottom: 20,
    textAlign: 'center',
    fontFamily: 'Inter',
  },
  progressContainer: {
    width: '100%',
  },
  progressBar: {
    height: 8,
    backgroundColor: '#EEEEEE',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  progressLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  progressLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#999999',
    fontFamily: 'Inter',
  },
  // COMPOSIÇÃO CORPORAL
  compositionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  compositionCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 4,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  compositionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  compositionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333333',
    marginLeft: 8,
    fontFamily: 'Inter',
  },
  bfCircle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    borderWidth: 3,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  bfPercent: {
    fontSize: 24,
    fontWeight: '800',
    color: '#333333',
    fontFamily: 'Inter',
  },
  bfLabel: {
    fontSize: 12,
    color: '#666666',
    marginTop: 2,
    fontFamily: 'Inter',
  },
  bfClassification: {
    fontSize: 14,
    fontWeight: '600',
    marginTop: 4,
    fontFamily: 'Inter',
  },
  massRow: {
    alignItems: 'center',
    marginTop: 8,
  },
  massItem: {
    alignItems: 'center',
    marginVertical: 6,
  },
  massValue: {
    fontSize: 22,
    fontWeight: '800',
    color: '#333333',
    fontFamily: 'Inter',
  },
  massLabel: {
    fontSize: 12,
    color: '#666666',
    marginTop: 2,
    fontFamily: 'Inter',
  },
  massDivider: {
    width: 50,
    height: 1,
    backgroundColor: '#EEEEEE',
    marginVertical: 6,
  },
  // CALORIAS
  caloriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  calorieCard: {
    width: '48%',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  calorieValue: {
    fontSize: 22,
    fontWeight: '800',
    color: '#333333',
    marginVertical: 8,
    fontFamily: 'Inter',
  },
  calorieLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666666',
    textAlign: 'center',
    marginBottom: 2,
    fontFamily: 'Inter',
  },
  calorieUnit: {
    fontSize: 11,
    color: '#999999',
    textAlign: 'center',
    fontFamily: 'Inter',
  },
  // BOTÕES
  actionContainer: {
    paddingHorizontal: 16,
    marginTop: 20,
    marginBottom: 30,
  },
  primaryButton: {
    backgroundColor: '#1E88E5',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    paddingVertical: 16,
    marginBottom: 12,
    shadowColor: '#1E88E5',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginLeft: 8,
    fontFamily: 'Inter',
  },
  secondaryButton: {
    borderWidth: 2,
    borderColor: '#1E88E5',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E88E5',
    fontFamily: 'Inter',
  },
  // BOTÃO FLUTUANTE OPACO
  floatingButtonContainer: {
    position: 'absolute',
    bottom: 50,
    right: 20,
    zIndex: 100,
  },
  floatingButton: {
    backgroundColor: 'rgba(30, 136, 229, 0.85)', // COR OPACA (85% opacidade)
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 25,
    paddingHorizontal: 16,
    paddingVertical: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    minWidth: 110,
  },
  floatingButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
    marginLeft: 6,
    fontFamily: 'Inter',
  },
});