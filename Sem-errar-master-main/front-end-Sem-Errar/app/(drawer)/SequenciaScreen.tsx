import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
    Alert,
    Dimensions,
    Modal,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

const { width } = Dimensions.get('window');

const COLORS = {
  primary: '#622db2',
  dot: '#4ecdc4',
  line: 'rgba(112, 82, 230, 0.15)',
  textMain: '#1A1A1A',
  disabled: '#F0F0F0',
  inputBg: '#F8F9FA',
  success: '#622db2',
  danger: '#FF5722',
  treino1: '#4CAF50',
  treino2: '#2196F3',
  treino3: '#9C27B0',
  treino4: '#FF9800',
  descanso: '#A0A0A0',
};

type SequenciaItem = {
    id: string;
    tipo: 'treino' | 'descanso';
    nome: string;
    iconeMaterial: string;
    cor: string;
};

export default function SequenciaScreen() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [sequencia, setSequencia] = useState<SequenciaItem[]>([]);
    
    // Modais
    const [modalSucessoVisible, setModalSucessoVisible] = useState(false);
    const [modalMoverVisible, setModalMoverVisible] = useState(false);
    
    // Estado para movimentação
    const [descansoSelecionado, setDescansoSelecionado] = useState<SequenciaItem | null>(null);
    const [posicaoDestino, setPosicaoDestino] = useState<number | null>(null);

    useEffect(() => {
        carregarDados();
    }, []);

    const carregarDados = async () => {
        try {
            const estruturaSalva = await AsyncStorage.getItem('@estruturaTreinos');
            if (estruturaSalva) {
                const numero = parseInt(estruturaSalva);
                const sequenciaSalva = await AsyncStorage.getItem('@sequenciaTreinos');
                
                if (sequenciaSalva) {
                    setSequencia(JSON.parse(sequenciaSalva));
                } else {
                    const sequenciaInicial: SequenciaItem[] = [];
                    for (let i = 1; i <= numero; i++) {
                        sequenciaInicial.push({
                            id: `treino-${i}-${Date.now()}-${Math.random()}`,
                            tipo: 'treino',
                            nome: `Treino ${String.fromCharCode(64 + i)}`, // Treino A, B, C...
                            iconeMaterial: 'weight-lifter',
                            cor: obterCorTreino(i)
                        });
                    }
                    setSequencia(sequenciaInicial);
                }
            }
        } catch (error) {
            console.error('Erro ao carregar dados:', error);
        }
    };

    const obterCorTreino = (numero: number): string => {
        const cores = [COLORS.treino1, COLORS.treino2, COLORS.treino3, COLORS.treino4];
        return cores[(numero - 1) % cores.length];
    };

    const handleAdicionarDescanso = () => {
        const novoDescanso: SequenciaItem = {
            id: `descanso-${Date.now()}-${Math.random()}`,
            tipo: 'descanso',
            nome: 'Descanso',
            iconeMaterial: 'bed-king',
            cor: COLORS.descanso
        };
        setSequencia([...sequencia, novoDescanso]);
    };

    const handleRemoverItem = (id: string) => {
        Alert.alert('Remover', 'Deseja remover este item?', [
            { text: 'Cancelar', style: 'cancel' },
            { text: 'Remover', style: 'destructive', onPress: () => {
                setSequencia(sequencia.filter(item => item.id !== id));
            }}
        ]);
    };

    const handleClicarDescanso = (item: SequenciaItem) => {
        setDescansoSelecionado(item);
        setPosicaoDestino(null);
        setModalMoverVisible(true);
    };

    const handleMoverDescanso = () => {
        if (!descansoSelecionado || posicaoDestino === null) return;
        const novaSequencia = sequencia.filter(item => item.id !== descansoSelecionado.id);
        novaSequencia.splice(posicaoDestino, 0, descansoSelecionado);
        setSequencia(novaSequencia);
        setModalMoverVisible(false);
    };

    const handleSalvar = async () => {
        setIsLoading(true);
        try {
            await AsyncStorage.setItem('@sequenciaTreinos', JSON.stringify(sequencia));
            setModalSucessoVisible(true);
        } catch (error) {
            Alert.alert('Erro', 'Falha ao salvar sequência.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleContinuarParaBF = () => {
        setModalSucessoVisible(false);
        router.push('/QuadroCalcularBFScreenSequencia');
    };

    const handleVoltar = () => {
         router.push('/OrganizacaoTreinosScreen');
    };

    return (
        <GestureHandlerRootView style={styles.container}>
            <View style={styles.backgroundDecoration}>
                <View style={[styles.ellipse, { width: width * 1.5, height: 300, top: -50, right: -width * 0.2 }]} />
            </View>
            
            {/* BOTÃO VOLTAR NO TOPO - IGUAL AO DA DIASFIXOSSCREEN */}
            <View style={styles.headerContainer}>
                <Pressable style={styles.backButton} onPress={handleVoltar}>
                    <View style={styles.backIconCircle}>
                        <FontAwesome name="chevron-left" size={12} color={COLORS.primary} />
                    </View>
                    <Text style={styles.backButtonText}>Voltar</Text>
                </Pressable>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                <View style={styles.titleContainer}>
                    <Text style={styles.mainTitle}>Sua Sequência</Text>
                    <Text style={styles.description}>Defina a ordem e os dias de descanso</Text>
                </View>

                <View style={styles.listaContainer}>
                    {sequencia.map((item, index) => (
                        <View key={item.id} style={[styles.itemContainer, { borderLeftColor: item.cor, borderLeftWidth: 6 }]}>
                            <TouchableOpacity 
                                style={styles.itemContent} 
                                onPress={() => item.tipo === 'descanso' && handleClicarDescanso(item)}
                                activeOpacity={item.tipo === 'descanso' ? 0.6 : 1}
                            >
                                <View style={[styles.itemIcon, { backgroundColor: `${item.cor}15` }]}>
                                    <MaterialCommunityIcons name={item.iconeMaterial as any} size={20} color={item.cor} />
                                </View>
                                <View style={{ flex: 1 }}>
                                    <Text style={styles.itemName}>{item.nome}</Text>
                                    {item.tipo === 'descanso' && <Text style={styles.itemSubtext}>Toque para mover</Text>}
                                </View>
                                <TouchableOpacity onPress={() => handleRemoverItem(item.id)} style={styles.removeButton}>
                                    <Feather name="trash-2" size={18} color={COLORS.danger} />
                                </TouchableOpacity>
                            </TouchableOpacity>
                        </View>
                    ))}
                </View>

                <TouchableOpacity style={styles.addButton} onPress={handleAdicionarDescanso}>
                    <Text style={styles.addButtonText}>+ Adicionar Descanso</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                    style={styles.saveButtonContainer} 
                    onPress={handleSalvar}
                    disabled={isLoading || sequencia.length === 0}
                >
                    <LinearGradient colors={['#7b42d5', '#622db2']} style={styles.saveButton}>
                        <Text style={styles.saveButtonText}>{isLoading ? 'Salvando...' : 'Salvar Sequência'}</Text>
                    </LinearGradient>
                </TouchableOpacity>
            </ScrollView>

            {/* MODAL DE MOVER (POSIÇÃO) */}
            <Modal visible={modalMoverVisible} transparent animationType="slide">
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Mover Descanso</Text>
                        <ScrollView style={{maxHeight: 300}}>
                            <TouchableOpacity style={styles.opcaoDestino} onPress={() => setPosicaoDestino(0)}>
                                <Text>Mover para o topo</Text>
                            </TouchableOpacity>
                            {sequencia.map((item, index) => (
                                item.id !== descansoSelecionado?.id && (
                                    <TouchableOpacity 
                                        key={index} 
                                        style={[styles.opcaoDestino, posicaoDestino === index + 1 && {borderColor: COLORS.primary, borderWidth: 1}]} 
                                        onPress={() => setPosicaoDestino(index + 1)}
                                    >
                                        <Text>Depois de {item.nome}</Text>
                                    </TouchableOpacity>
                                )
                            ))}
                        </ScrollView>
                        <TouchableOpacity style={styles.modalButtonConfirmar} onPress={handleMoverDescanso}>
                            <Text style={{color: '#FFF', fontWeight: 'bold'}}>Confirmar</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

            {/* MODAL DE SUCESSO COM REDIRECIONAMENTO */}
            <Modal visible={modalSucessoVisible} transparent animationType="fade">
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <View style={{alignItems: 'center', padding: 10}}>
                            <Feather name="check-circle" size={60} color={COLORS.treino1} />
                            <Text style={[styles.modalTitle, {marginTop: 15}]}>Tudo Pronto!</Text>
                            <Text style={{textAlign: 'center', color: '#666', marginBottom: 20}}>
                                Sua sequência foi salva. Agora vamos calcular seu percentual de gordura.
                            </Text>
                            
                            <TouchableOpacity style={styles.finalButton} onPress={handleContinuarParaBF}>
                                <LinearGradient colors={['#7b42d5', '#622db2']} style={styles.finalButtonGradient}>
                                    <Text style={styles.finalButtonText}>Continuar</Text>
                                </LinearGradient>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </GestureHandlerRootView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#FFF' },
    backgroundDecoration: { ...StyleSheet.absoluteFillObject },
    ellipse: { position: 'absolute', borderWidth: 1, borderColor: COLORS.line, borderRadius: 999 },
    
    // NOVOS ESTILOS PARA O BOTÃO VOLTAR (IGUAL AO DA DIASFIXOSSCREEN)
    headerContainer: {
        paddingHorizontal: 25,
        paddingTop: 40,
        zIndex: 10,
        backgroundColor: 'transparent',
    },
    backButton: {
        flexDirection: 'row',
        alignItems: 'center',
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
        elevation: 2,
    },
    backButtonText: {
        color: COLORS.primary,
        fontSize: 16,
        fontWeight: '700',
        marginLeft: 10,
    },
    
    // ESTILOS EXISTENTES (MANTIDOS)
    scrollContent: { padding: 20 },
    titleContainer: { marginBottom: 25, alignItems: 'center' },
    mainTitle: { fontSize: 24, fontWeight: '900', color: COLORS.textMain },
    description: { color: '#666' },
    listaContainer: { gap: 12, marginBottom: 20 },
    itemContainer: { backgroundColor: '#FFF', borderRadius: 12, elevation: 3 },
    itemContent: { flexDirection: 'row', alignItems: 'center', padding: 15 },
    itemIcon: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
    itemName: { fontSize: 16, fontWeight: '700' },
    itemSubtext: { fontSize: 12, color: COLORS.primary },
    removeButton: { padding: 5 },
    addButton: { padding: 15, borderRadius: 12, borderStyle: 'dashed', borderWidth: 2, borderColor: COLORS.primary, alignItems: 'center' },
    addButtonText: { color: COLORS.primary, fontWeight: '700' },
    saveButtonContainer: { marginTop: 30, borderRadius: 15, overflow: 'hidden' },
    saveButton: { padding: 18, alignItems: 'center' }, 
    saveButtonText: { color: '#FFF', fontWeight: '800', fontSize: 16 },
    modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'center', alignItems: 'center' },
    modalContent: { backgroundColor: '#FFF', borderRadius: 20, padding: 25, width: '85%' },
    modalTitle: { fontSize: 20, fontWeight: '800', marginBottom: 10 },
    opcaoDestino: { padding: 15, backgroundColor: '#F5F5F5', borderRadius: 10, marginBottom: 8 },
    modalButtonConfirmar: { backgroundColor: COLORS.primary, padding: 15, borderRadius: 10, alignItems: 'center', marginTop: 10 },
    finalButton: { width: '100%', borderRadius: 12, overflow: 'hidden' },
    finalButtonGradient: { padding: 15, alignItems: 'center' },
    finalButtonText: { color: '#FFF', fontWeight: '800', fontSize: 16 }
});