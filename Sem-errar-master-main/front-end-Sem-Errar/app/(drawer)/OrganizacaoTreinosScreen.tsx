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
  View,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

const COLORS = {
  primary: '#622db2',
  primaryLight: '#7b42d5',
  dot: '#4ecdc4',
  line: 'rgba(112, 82, 230, 0.15)',
  textMain: '#1A1A1A',
  disabled: '#F0F0F0',
};

export default function OrganizacaoTreinosScreen() {
  const router = useRouter();
  const [organizacaoSelecionada, setOrganizacaoSelecionada] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Alteração das cores aqui: Azul para calendário e Laranja para sequência
  const opcoesOrganizacao = [
    {
      id: 'diasFixos',
      title: 'Dias fixos da semana',
      subtitle: 'Segunda → Quarta → Sexta',
      icon: 'calendar',
      iconColor: '#2196F3', // Azul
    },
    {
      id: 'sequenciaRepetida',
      title: 'Sequência que se repete',
      subtitle: 'Treino 1 → Treino 2 → Descanso',
      icon: 'repeat',
      iconColor: '#FF9800', // Laranja
    },
  ];

  useEffect(() => {
    carregarOrganizacaoSalva();
  }, []);

  const carregarOrganizacaoSalva = async () => {
    try {
      const organizacaoSalva = await AsyncStorage.getItem('@organizacaoTreinos');
      if (organizacaoSalva) {
        setOrganizacaoSelecionada(organizacaoSalva);
      }
    } catch (error) {
      console.error('Erro ao carregar organização de treinos:', error);
    }
  };

  const handleProximo = async () => {
    if (organizacaoSelecionada) {
      setIsLoading(true);
      try {
        await AsyncStorage.setItem('@organizacaoTreinos', organizacaoSelecionada);
        
        if (organizacaoSelecionada === 'diasFixos') {
          router.push('/DiasFixosScreen');
        } else if (organizacaoSelecionada === 'sequenciaRepetida') {
          router.push('/SequenciaScreen');
        }
      } catch (error) {
        Alert.alert('Erro', 'Não foi possível salvar sua escolha.');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleVoltar = () => {
    router.push('/(drawer)/ConfigurarTreinoScreen');
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

      <ScrollView 
        contentContainerStyle={styles.scrollContent} 
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>
          <View style={styles.logoContainer}>
            <Image 
              source={require('@/assets/images/logo-sem-fundo1.png')} 
              style={styles.logo}
              resizeMode="contain"
            />
          </View>
          
          <View style={styles.opcoesContainer}>
            {opcoesOrganizacao.map((opcao) => {
              const isSelected = organizacaoSelecionada === opcao.id;
              return (
                <Pressable
                  key={opcao.id}
                  style={[styles.opcaoItem, isSelected && styles.opcaoItemSelecionado]}
                  onPress={() => setOrganizacaoSelecionada(opcao.id)}
                >
                  {/* Fundo do ícone agora usa a cor personalizada com opacidade */}
                  <View style={[styles.opcaoIconContainer, { backgroundColor: `${opcao.iconColor}15` }]}>
                    <FontAwesome name={opcao.icon as any} size={24} color={opcao.iconColor} />
                  </View>

                  <View style={{ flex: 1 }}>
                    <Text style={[styles.opcaoTitulo, isSelected && { color: COLORS.primary }]}>
                      {opcao.title}
                    </Text>
                    <Text style={styles.opcaoSubtituloText}>{opcao.subtitle}</Text>
                  </View>

                  <View style={[styles.radioButton, isSelected && styles.radioButtonSelecionado]}>
                    {isSelected && <View style={styles.radioButtonInner} />}
                  </View>
                </Pressable>
              );
            })}
          </View>

          {organizacaoSelecionada && (
            <View style={styles.dicaContainer}>
              <FontAwesome name="info-circle" size={18} color={COLORS.dot} />
              <Text style={styles.dicaTexto}>
                {organizacaoSelecionada === 'diasFixos' 
                  ? 'Os treinos são sempre nos mesmos dias da semana' 
                  : 'Os treinos seguem um ciclo independente dos dias'}
              </Text>
            </View>
          )}

          <TouchableOpacity
            onPress={handleProximo}
            disabled={!organizacaoSelecionada || isLoading}
            style={styles.buttonWrapper}
          >
            {organizacaoSelecionada ? (
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
          </TouchableOpacity>
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
  scrollContent: { 
    flexGrow: 1, 
    paddingHorizontal: 25, 
    justifyContent: 'center', 
    paddingBottom: 40 
  },
  content: { width: '100%', zIndex: 10 },
  logoContainer: { alignItems: 'center', marginBottom: 50 },
  logo: { width: width * 0.45, height: 70 },
  opcoesContainer: { gap: 15, marginBottom: 20 },
  opcaoItem: { flexDirection: 'row', alignItems: 'center', padding: 20, backgroundColor: '#fff', borderRadius: 22, borderWidth: 1.5, borderColor: '#f4f4f4', elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 5 },
  opcaoItemSelecionado: { borderColor: COLORS.primary, borderWidth: 2, backgroundColor: '#fcfaff' },
  opcaoIconContainer: { width: 52, height: 52, borderRadius: 16, justifyContent: 'center', alignItems: 'center', marginRight: 15 },
  opcaoTitulo: { fontSize: 18, fontWeight: '800', color: COLORS.textMain },
  opcaoSubtituloText: { fontSize: 14, fontWeight: '700', marginTop: 2, color: COLORS.primary },
  radioButton: { width: 22, height: 22, borderRadius: 11, borderWidth: 2, borderColor: '#E0E0E0', justifyContent: 'center', alignItems: 'center' },
  radioButtonSelecionado: { borderColor: COLORS.primary, backgroundColor: COLORS.primary },
  radioButtonInner: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#fff' },
  dicaContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f0f9ff', padding: 15, borderRadius: 18, gap: 10, marginBottom: 25, borderWidth: 1, borderColor: `${COLORS.dot}30` },
  dicaTexto: { flex: 1, color: COLORS.dot, fontSize: 14, fontWeight: '700' },
  buttonWrapper: { width: '100%', borderRadius: 22, overflow: 'hidden', elevation: 4 },
  primaryButton: { paddingVertical: 18, alignItems: 'center' },
  primaryText: { color: '#fff', fontSize: 18, fontWeight: '800' },
});