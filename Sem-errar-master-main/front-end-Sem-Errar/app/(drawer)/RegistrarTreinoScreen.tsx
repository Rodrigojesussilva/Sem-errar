import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  Dimensions,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  StatusBar,
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

export default function RegistrarTreinoScreen() {
  const router = useRouter();
  const [opcaoSelecionada, setOpcaoSelecionada] = useState<string | null>(null);

  const opcoes = [
    {
      id: 'agora',
      title: 'Vamos lá',
      subtitle: 'Registrar meu treino agora',
      icon: 'rocket',
      color: COLORS.primary,
    },
    {
      id: 'depois',
      title: 'Registrar mais tarde',
      subtitle: 'Voltar para o app depois',
      icon: 'clock-o',
      color: '#757575',
    },
  ];

  const handleProximo = () => {
    if (!opcaoSelecionada) return;
    if (opcaoSelecionada === 'agora') {
      router.push('/EstruturaTreinosScreen');
    } else {
      router.push('/RegistrarCardioScreen');
    }
  };

  const handleVoltar = () => {
    router.replace('/FrequenciaScreen');
  };

  const renderStaticBackground = () => (
    <View style={styles.visualArea}>
      <View style={[styles.ellipseLine, { width: width * 1.5, height: height * 0.4, top: height * 0.1, left: -width * 0.3, transform: [{ rotate: '-25deg' }] }]}>
        <View style={[styles.staticDot, { top: '20%', right: '15%' }]} />
      </View>
      <View style={[styles.ellipseLine, { width: width * 1.2, height: height * 0.5, top: height * 0.3, right: -width * 0.4, transform: [{ rotate: '35deg' }] }]}>
        <View style={[styles.staticDot, { bottom: '30%', left: '10%' }]} />
      </View>
      <View style={[styles.ellipseLine, { width: width * 1.6, height: height * 0.3, bottom: -height * 0.05, left: -width * 0.2, transform: [{ rotate: '5deg' }] }]}>
        <View style={[styles.staticDot, { top: '10%', left: '40%' }]} />
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
        <Pressable onPress={handleVoltar} style={styles.backButton}>
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

          {/* Texto auxiliar menor e com espaçamento */}
          <Text style={styles.subtitleAuxiliar}>
            Use o app para acompanhar seus treinos e sua evolução
          </Text>

          <Text style={styles.title}>Deseja registrar seu treino agora?</Text>
          
          <View style={styles.opcoesContainer}>
            {opcoes.map((opcao) => {
              const isSelected = opcaoSelecionada === opcao.id;
              return (
                <Pressable
                  key={opcao.id}
                  style={[styles.opcaoItem, isSelected && styles.opcaoItemSelecionado]}
                  onPress={() => setOpcaoSelecionada(opcao.id)}
                >
                  <View style={[styles.opcaoIconContainer, { backgroundColor: `${opcao.color}10` }]}>
                    <FontAwesome name={opcao.icon as any} size={22} color={opcao.color} />
                  </View>

                  <View style={{ flex: 1 }}>
                    <Text style={[styles.opcaoTitulo, isSelected && { color: COLORS.primary }]}>
                      {opcao.title}
                    </Text>
                    <Text style={styles.opcaoDescricaoItem}>{opcao.subtitle}</Text>
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
            disabled={!opcaoSelecionada}
            style={styles.buttonWrapper}
          >
            {opcaoSelecionada ? (
              <LinearGradient
                colors={['#7b42d5', '#622db2', '#4b208c']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.primaryButton}
              >
                <Text style={styles.primaryText}>Próximo</Text>
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
  staticDot: { 
    position: 'absolute', 
    width: 10, 
    height: 10, 
    borderRadius: 5, 
    borderWidth: 2, 
    borderColor: COLORS.dot, 
    backgroundColor: '#fff' 
  },
  header: { paddingHorizontal: 25, paddingTop: StatusBar.currentHeight ? StatusBar.currentHeight + 10 : 40, zIndex: 100 },
  backButton: { flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-start' },
  backIconCircle: { width: 32, height: 32, borderRadius: 16, backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: COLORS.line, elevation: 3 },
  backText: { color: COLORS.primary, marginLeft: 10, fontWeight: '700', fontSize: 16 },
  scrollContent: { flexGrow: 1, paddingHorizontal: 25, paddingTop: 60, paddingBottom: 40 },
  content: { width: '100%', zIndex: 10 },
  logoContainer: { alignItems: 'center', marginBottom: 25, marginTop: 10 },
  logo: { width: width * 0.5, height: 70 },
  
  // Ajustes de tamanho e espaçamento
  subtitleAuxiliar: {
    fontSize: 15,
    color: COLORS.dot,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 15, // Aumentado para separar da pergunta
    paddingHorizontal: 20
  },
  title: { 
    fontSize: 26, 
    fontWeight: '900', 
    color: COLORS.textMain, 
    textAlign: 'center', 
    marginBottom: 35 
  },

  opcoesContainer: { gap: 15, marginBottom: 35 },
  opcaoItem: { flexDirection: 'row', alignItems: 'center', padding: 18, backgroundColor: '#fff', borderRadius: 20, borderWidth: 1.5, borderColor: '#f4f4f4', elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 5 },
  opcaoItemSelecionado: { borderColor: COLORS.primary, borderWidth: 2 },
  opcaoIconContainer: { width: 48, height: 48, borderRadius: 15, justifyContent: 'center', alignItems: 'center', marginRight: 15 },
  opcaoTitulo: { fontSize: 17, fontWeight: '700', color: COLORS.textMain },
  opcaoDescricaoItem: { fontSize: 14, color: '#888', marginTop: 2 },
  radioButton: { width: 22, height: 22, borderRadius: 11, borderWidth: 2, borderColor: '#E0E0E0', justifyContent: 'center', alignItems: 'center' },
  radioButtonSelecionado: { borderColor: COLORS.primary, backgroundColor: COLORS.primary },
  radioButtonInner: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#fff' },
  buttonWrapper: { width: '100%', borderRadius: 22, overflow: 'hidden', elevation: 4 },
  primaryButton: { paddingVertical: 18, alignItems: 'center' },
  primaryText: { color: '#fff', fontSize: 18, fontWeight: '800' },
});