import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert, Dimensions, Image, Modal, Pressable, ScrollView, StyleSheet, Text, View, StatusBar, SafeAreaView } from 'react-native';

const { width, height } = Dimensions.get('window');

const COLORS = {
  primary: '#622db2',
  dot: '#4ecdc4',
  line: 'rgba(112, 82, 230, 0.15)',
  textMain: '#1A1A1A',
  disabled: '#F0F0F0',
  inputBg: '#F8F9FA',
  success: '#622db2',
  // Cores dos treinos
  treino1: '#4CAF50',
  treino2: '#2196F3',
  treino3: '#9C27B0',
  treino4: '#FF9800',
  descanso: '#E0E0E0',
};

export default function DiasFixosScreen() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [diasSemana, setDiasSemana] = useState([
    { id: 'segunda', nome: 'Segunda', treino: 'Descanso', icone: 'bed', cor: COLORS.descanso },
    { id: 'terca', nome: 'Terça', treino: 'Descanso', icone: 'bed', cor: COLORS.descanso },
    { id: 'quarta', nome: 'Quarta', treino: 'Descanso', icone: 'bed', cor: COLORS.descanso },
    { id: 'quinta', nome: 'Quinta', treino: 'Descanso', icone: 'bed', cor: COLORS.descanso },
    { id: 'sexta', nome: 'Sexta', treino: 'Descanso', icone: 'bed', cor: COLORS.descanso },
    { id: 'sabado', nome: 'Sábado', treino: 'Descanso', icone: 'bed', cor: COLORS.descanso },
    { id: 'domingo', nome: 'Domingo', treino: 'Descanso', icone: 'bed', cor: COLORS.descanso },
  ]);

  const [modalVisible, setModalVisible] = useState(false);
  const [diaSelecionado, setDiaSelecionado] = useState<any>(null);
  const [quantidadeTreinos, setQuantidadeTreinos] = useState(3);
  const [opcoesTreino, setOpcoesTreino] = useState<string[]>([]);

  useEffect(() => {
    carregarQuantidadeTreinos();
    carregarDiasSalvos();
  }, []);

  const carregarQuantidadeTreinos = async () => {
    try {
      const estruturaSalva = await AsyncStorage.getItem('@estruturaTreinos');
      if (estruturaSalva) {
        const numero = parseInt(estruturaSalva);
        setQuantidadeTreinos(numero || 3);
        const opcoes = [];
        for (let i = 1; i <= numero; i++) {
          opcoes.push(`Treino ${i}`);
        }
        opcoes.push('Descanso');
        setOpcoesTreino(opcoes);
      }
    } catch (error) {
      console.error('Erro ao carregar quantidade de treinos:', error);
    }
  };

  const carregarDiasSalvos = async () => {
    try {
      const diasSalvos = await AsyncStorage.getItem('@diasFixosTreinos');
      if (diasSalvos) {
        setDiasSemana(JSON.parse(diasSalvos));
      }
    } catch (error) {
      console.error('Erro ao carregar dias salvos:', error);
    }
  };

  const handleDiaPress = (dia: any) => {
    setDiaSelecionado(dia);
    setModalVisible(true);
  };

  const handleSelecionarTreino = (treino: string) => {
    if (!diaSelecionado) return;
    const cor = treino === 'Descanso' ? COLORS.descanso : obterCorTreino(treino);
    const icone = treino === 'Descanso' ? 'bed' : 'check-circle';
    const diasAtualizados = diasSemana.map(dia =>
      dia.id === diaSelecionado.id ? { ...dia, treino, cor, icone } : dia
    );
    setDiasSemana(diasAtualizados);
    setModalVisible(false);
  };

  const obterCorTreino = (treino: string): string => {
    const cores = [COLORS.treino1, COLORS.treino2, COLORS.treino3, COLORS.treino4];
    const index = parseInt(treino.split(' ')[1]) - 1;
    return cores[index] || COLORS.treino1;
  };

  const handleProximo = async () => {
    setIsLoading(true);
    try {
      await AsyncStorage.setItem('@diasFixosTreinos', JSON.stringify(diasSemana));
      const temTreino = diasSemana.some(dia => dia.treino !== 'Descanso');
      if (!temTreino) {
        Alert.alert(
          'Atenção',
          'Você não configurou nenhum treino. Deseja continuar mesmo assim?',
          [
            { text: 'Cancelar', style: 'cancel' },
            { text: 'Continuar', onPress: () => router.push('/PescocoScreen') }
          ]
        );
        setIsLoading(false);
        return;
      }
      router.push('/QuadroCalcularBFScreenDiasFixos');
    } catch (error) {
      console.error('Erro ao salvar dias fixos:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVoltar = () => {
    router.push('/OrganizacaoTreinosScreen');
  };

  const getDiaIcone = (treino: string) => {
    return treino === 'Descanso' ? 'bed' : 'check-circle';
  };

  const renderBackground = () => (
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
    <SafeAreaView style={styles.background}>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
      {renderBackground()}

      <View style={styles.headerContainer}>
        <Pressable style={styles.backButton} onPress={handleVoltar}>
          <View style={styles.backIconCircle}>
            <FontAwesome name="chevron-left" size={12} color={COLORS.primary} />
          </View>
          <Text style={styles.backButtonText}>Voltar</Text>
        </Pressable>
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <View style={styles.imageContainer}>
            <Image source={require('@/assets/images/logo-sem-fundo1.png')} style={styles.topImage} resizeMode="contain" />
          </View>

          <View style={styles.headerSection}>
            <Text style={styles.welcomeTitle}>Agora estruture seus treinos na semana.</Text>
            
            <View style={styles.dicaContainer}>
              <FontAwesome name="info-circle" size={18} color={COLORS.dot} />
              <Text style={styles.dicaTexto}>
                Clique no dia desejado e atribua o treino. Dias programados serão destacados.
              </Text>
            </View>
          </View>

          <View style={styles.diasGrid}>
            {diasSemana.map((dia) => (
              <Pressable
                key={dia.id}
                style={[
                  styles.diaCard,
                  dia.treino !== 'Descanso' && styles.diaCardAtivo,
                  { borderColor: dia.treino !== 'Descanso' ? dia.cor : '#f4f4f4' }
                ]}
                onPress={() => handleDiaPress(dia)}
              >
                <View style={[styles.diaIconContainer, { backgroundColor: dia.treino !== 'Descanso' ? `${dia.cor}15` : '#F5F5F5' }]}>
                  <MaterialCommunityIcons name={getDiaIcone(dia.treino) as any} size={24} color={dia.treino !== 'Descanso' ? dia.cor : '#999999'} />
                </View>
                <Text style={styles.diaNome}>{dia.nome}</Text>
                <View style={[styles.treinoBadge, { backgroundColor: dia.treino !== 'Descanso' ? dia.cor : '#F0F0F0' }]}>
                  <Text style={[styles.treinoBadgeText, dia.treino !== 'Descanso' && { color: '#FFF' }]}>{dia.treino}</Text>
                </View>
                <FontAwesome name="chevron-right" size={14} color="#CCCCCC" />
              </Pressable>
            ))}
          </View>

          <View style={styles.legendaContainer}>
            {[1, 2, 3, 4].map(num => (
              quantidadeTreinos >= num && (
                <View key={num} style={styles.legendaItem}>
                  <View style={[styles.legendaCor, { backgroundColor: (COLORS as any)[`treino${num}`] }]} />
                  <Text style={styles.legendaTexto}>Treino {num}</Text>
                </View>
              )
            ))}
            <View style={styles.legendaItem}>
              <View style={[styles.legendaCor, { backgroundColor: COLORS.descanso }]} />
              <Text style={styles.legendaTexto}>Descanso</Text>
            </View>
          </View>

          <Pressable style={styles.primaryButtonWrapper} onPress={handleProximo} disabled={isLoading}>
            <LinearGradient
              colors={['#4ecdc4', '#622db2', '#4b208c']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.primaryButton}
            >
              <Text style={styles.primaryText}>{isLoading ? 'Salvando...' : 'Próximo'}</Text>
            </LinearGradient>
          </Pressable>
        </View>
      </ScrollView>

      <Modal animationType="slide" transparent={true} visible={modalVisible} onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitulo}>{diaSelecionado?.nome}</Text>
              <Pressable onPress={() => setModalVisible(false)} style={styles.modalCloseButton}>
                <Feather name="x" size={20} color="#666" />
              </Pressable>
            </View>
            <View style={styles.opcoesContainerModal}>
              {opcoesTreino.map((treino, index) => (
                <Pressable
                  key={index}
                  style={[styles.opcaoItemModal, diaSelecionado?.treino === treino && styles.opcaoItemSelecionadoModal]}
                  onPress={() => handleSelecionarTreino(treino)}
                >
                  <Text style={styles.opcaoTextoModal}>{treino}</Text>
                  {diaSelecionado?.treino === treino && <Feather name="check" size={18} color={COLORS.primary} />}
                </Pressable>
              ))}
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  background: { flex: 1, backgroundColor: '#FFFFFF' },
  visualArea: { ...StyleSheet.absoluteFillObject, zIndex: 0, overflow: 'hidden' },
  ellipseLine: { position: 'absolute', borderWidth: 1.5, borderColor: COLORS.line, borderRadius: 999 },
  staticDot: { position: 'absolute', width: 10, height: 10, borderRadius: 5, borderWidth: 2, borderColor: COLORS.dot, backgroundColor: '#fff' },
  headerContainer: { paddingHorizontal: 25, paddingTop: StatusBar.currentHeight ? StatusBar.currentHeight + 10 : 40, zIndex: 10 },
  backButton: { flexDirection: 'row', alignItems: 'center' },
  backIconCircle: { width: 32, height: 32, borderRadius: 16, backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: COLORS.line, elevation: 3 },
  backButtonText: { color: COLORS.primary, fontSize: 16, fontWeight: '700', marginLeft: 10 },
  scrollView: { flex: 1 },
  scrollContent: { flexGrow: 1, paddingHorizontal: 25, paddingBottom: 40 },
  content: { width: '100%', zIndex: 10 },
  imageContainer: { alignItems: 'center', marginVertical: 20 },
  topImage: { width: width * 0.4, height: 60 },
  headerSection: { alignItems: 'center', marginBottom: 20 },
  welcomeTitle: { color: COLORS.textMain, fontSize: 24, fontWeight: '800', textAlign: 'center', marginBottom: 20, paddingHorizontal: 10 },
  dicaContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f0f9ff', padding: 15, borderRadius: 18, gap: 10, width: '100%', borderWidth: 1, borderColor: `${COLORS.dot}30` },
  dicaTexto: { flex: 1, color: COLORS.dot, fontSize: 14, fontWeight: '700' },
  diasGrid: { gap: 12, marginBottom: 20 },
  diaCard: { flexDirection: 'row', alignItems: 'center', padding: 16, backgroundColor: '#fff', borderRadius: 22, borderWidth: 1.5, borderColor: '#f4f4f4', elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 5 },
  diaCardAtivo: { backgroundColor: '#fcfaff' },
  diaIconContainer: { width: 44, height: 44, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  diaNome: { flex: 1, fontSize: 17, fontWeight: '700', color: COLORS.textMain },
  treinoBadge: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12, marginRight: 8 },
  treinoBadgeText: { fontSize: 13, fontWeight: '800', color: '#666' },
  legendaContainer: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 12, marginBottom: 25, padding: 15, backgroundColor: '#f8f9fa', borderRadius: 18 },
  legendaItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  legendaCor: { width: 12, height: 12, borderRadius: 6 },
  legendaTexto: { fontSize: 12, fontWeight: '700', color: '#666' },
  primaryButtonWrapper: { width: '100%', borderRadius: 22, overflow: 'hidden', elevation: 4 },
  primaryButton: { paddingVertical: 18, alignItems: 'center' },
  primaryText: { color: '#fff', fontSize: 18, fontWeight: '800' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.5)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: '#FFFFFF', borderTopLeftRadius: 30, borderTopRightRadius: 30, padding: 25, minHeight: 350 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  modalTitulo: { fontSize: 22, fontWeight: '800', color: COLORS.textMain },
  modalCloseButton: { padding: 5 },
  opcoesContainerModal: { gap: 10 },
  opcaoItemModal: { flexDirection: 'row', alignItems: 'center', padding: 18, backgroundColor: '#F8F9FA', borderRadius: 18, borderWidth: 1.5, borderColor: '#E9ECEF' },
  opcaoItemSelecionadoModal: { borderColor: COLORS.primary, backgroundColor: '#fcfaff' },
  opcaoTextoModal: { flex: 1, fontSize: 16, fontWeight: '700', color: COLORS.textMain },
});