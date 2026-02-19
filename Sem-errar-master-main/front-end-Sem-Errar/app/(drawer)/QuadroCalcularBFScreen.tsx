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
  dot: '#4ecdc4', // Ciano/Verde padrão
  line: 'rgba(112, 82, 230, 0.15)',
  textMain: '#1A1A1A',
  disabled: '#F0F0F0',
  error: '#ff4444', // Vermelho para o "depois"
};

export default function QuandoCalcularBFScreen() {
  const router = useRouter();
  const [opcaoSelecionada, setOpcaoSelecionada] = useState<string | null>(null);

  const opcoes = [
    {
      id: 'agora',
      title: 'Calcular agora',
      subtitle: 'Vamos fazer as medições necessárias',
      icon: 'rocket', // Ícone igual ao exemplo
      color: COLORS.dot, // Verde
    },
    {
      id: 'depois',
      title: 'Calcular ao entrar',
      subtitle: 'Farei as medições mais tarde',
      icon: 'clock-o', // Ícone igual ao exemplo
      color: COLORS.error, // Vermelho
    },
  ];

  const handleProximo = () => {
    if (!opcaoSelecionada) return;
    if (opcaoSelecionada === 'agora') {
      router.push('/PescocoScreen');
    } else {
      router.push('/FinalizacaoScreen');
    }
  };

  const handleVoltar = () => {
    router.replace('/DiasFixosScreen');
  };

  const renderStaticBackground = () => (
    <View style={styles.visualArea}>
      <View style={[styles.ellipseLine, { width: width * 1.5, height: height * 0.4, top: height * 0.1, left: -width * 0.3, transform: [{ rotate: '-25deg' }] }]}>
        <View style={[styles.staticDot, { top: '20%', right: '15%' }]} />
      </View>
      <View style={[styles.ellipseLine, { width: width * 1.2, height: height * 0.5, top: height * 0.3, right: -width * 0.4, transform: [{ rotate: '35deg' }] }]}>
        <View style={[styles.staticDot, { bottom: '30%', left: '10%' }]} />
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
              source={require('@/assets/images/logo-sem-fundo1.png')} 
              style={styles.logo}
              resizeMode="contain"
            />
          </View>

          {/* Texto ciano do topo removido conforme solicitado */}

          <Text style={styles.title}>Vamos calcular seu percentual de gordura?</Text>
          
          <View style={styles.opcoesContainer}>
            {opcoes.map((opcao) => {
              const isSelected = opcaoSelecionada === opcao.id;
              return (
                <Pressable
                  key={opcao.id}
                  style={[styles.opcaoItem, isSelected && styles.opcaoItemSelecionado]}
                  onPress={() => setOpcaoSelecionada(opcao.id)}
                >
                  <View style={[styles.opcaoIconContainer, { backgroundColor: `${opcao.color}15` }]}>
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

          {/* Caixa de informação agora em tom Ciano */}
          <View style={styles.infoBox}>
            <FontAwesome name="info-circle" size={18} color={COLORS.dot} />
            <Text style={styles.infoText}>
              Você precisará de uma fita métrica flexível para realizar as medições corporais.
            </Text>
          </View>

          <Pressable
            onPress={handleProximo}
            disabled={!opcaoSelecionada}
            style={styles.buttonWrapper}
          >
            {opcaoSelecionada ? (
              <LinearGradient
                colors={['#4ecdc4', '#622db2', '#4b208c']}
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
  scrollContent: { flexGrow: 1, paddingHorizontal: 25, paddingTop: 40, paddingBottom: 40 },
  content: { width: '100%', zIndex: 10 },
  logoContainer: { alignItems: 'center', marginBottom: 30 },
  logo: { width: width * 0.45, height: 60 },
  title: { 
    fontSize: 24, 
    fontWeight: '900', 
    color: COLORS.textMain, 
    textAlign: 'center', 
    marginBottom: 35 
  },
  opcoesContainer: { gap: 15, marginBottom: 25 },
  opcaoItem: { flexDirection: 'row', alignItems: 'center', padding: 18, backgroundColor: '#fff', borderRadius: 20, borderWidth: 1.5, borderColor: '#f4f4f4', elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 5 },
  opcaoItemSelecionado: { borderColor: COLORS.primary, borderWidth: 2 },
  opcaoIconContainer: { width: 48, height: 48, borderRadius: 15, justifyContent: 'center', alignItems: 'center', marginRight: 15 },
  opcaoTitulo: { fontSize: 17, fontWeight: '700', color: COLORS.textMain },
  opcaoDescricaoItem: { fontSize: 14, color: '#888', marginTop: 2 },
  radioButton: { width: 22, height: 22, borderRadius: 11, borderWidth: 2, borderColor: '#E0E0E0', justifyContent: 'center', alignItems: 'center' },
  radioButtonSelecionado: { borderColor: COLORS.primary, backgroundColor: COLORS.primary },
  radioButtonInner: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#fff' },
  infoBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(78, 205, 196, 0.08)', // Fundo ciano bem clarinho
    padding: 16,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: 'rgba(78, 205, 196, 0.3)', // Borda ciano sutil
    marginBottom: 35,
    gap: 12
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    color: '#3BA9A1', // Texto ciano escuro para leitura
    fontWeight: '600',
    lineHeight: 20
  },
  buttonWrapper: { width: '100%', borderRadius: 22, overflow: 'hidden', elevation: 4 },
  primaryButton: { paddingVertical: 18, alignItems: 'center' },
  primaryText: { color: '#fff', fontSize: 18, fontWeight: '800' },
});