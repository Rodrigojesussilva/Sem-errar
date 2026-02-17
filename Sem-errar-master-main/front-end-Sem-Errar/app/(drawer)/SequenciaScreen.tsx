import FontAwesome from '@expo/vector-icons/FontAwesome';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert, Image, Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import DraggableFlatList, { ScaleDecorator } from 'react-native-draggable-flatlist';
import { GestureHandlerRootView, TouchableOpacity } from 'react-native-gesture-handler';

export default function SequenciaScreen() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [quantidadeTreinos, setQuantidadeTreinos] = useState(2); // Valor padrão
    const [sequencia, setSequencia] = useState<any[]>([]);
    const [modalVisible, setModalVisible] = useState(false);

    // Carregar quantidade de treinos da Tela 14
    useEffect(() => {
        carregarQuantidadeTreinos();
        carregarSequenciaSalva();
    }, []);

    const carregarQuantidadeTreinos = async () => {
        try {
            const estruturaSalva = await AsyncStorage.getItem('@estruturaTreinos');
            if (estruturaSalva) {
                const numero = parseInt(estruturaSalva);
                setQuantidadeTreinos(numero || 2);

                // Criar sequência inicial baseada nos treinos
                const sequenciaInicial = [];
                for (let i = 1; i <= numero; i++) {
                    sequenciaInicial.push({
                        id: `treino-${i}-${Date.now()}-${Math.random()}`,
                        tipo: 'treino',
                        nome: `Treino ${i}`,
                        icone: 'check-circle',
                        cor: obterCorTreino(i)
                    });
                }
                setSequencia(sequenciaInicial);
            }
        } catch (error) {
            console.error('Erro ao carregar quantidade de treinos:', error);
        }
    };

    const carregarSequenciaSalva = async () => {
        try {
            const sequenciaSalva = await AsyncStorage.getItem('@sequenciaTreinos');
            if (sequenciaSalva) {
                setSequencia(JSON.parse(sequenciaSalva));
            }
        } catch (error) {
            console.error('Erro ao carregar sequência salva:', error);
        }
    };

    const obterCorTreino = (numero: number): string => {
        const cores = ['#4CAF50', '#2196F3', '#9C27B0', '#FF9800', '#E74C3C'];
        return cores[numero - 1] || '#4CAF50';
    };

    const handleAdicionarDescanso = () => {
        const novoDescanso = {
            id: `descanso-${Date.now()}-${Math.random()}`,
            tipo: 'descanso',
            nome: 'Descanso',
            icone: 'bed',
            cor: '#A0A0A0'
        };

        setSequencia([...sequencia, novoDescanso]);
    };

    const handleRemoverItem = (id: string) => {
        Alert.alert(
            'Remover item',
            'Tem certeza que deseja remover este item da sequência?',
            [
                { text: 'Cancelar', style: 'cancel' },
                {
                    text: 'Remover',
                    style: 'destructive',
                    onPress: () => {
                        setSequencia(sequencia.filter(item => item.id !== id));
                    }
                }
            ]
        );
    };

    const renderItem = ({ item, drag, isActive }: any) => {
        return (
            <ScaleDecorator>
                <TouchableOpacity
                    onLongPress={drag}
                    disabled={isActive}
                    activeOpacity={0.7}
                    style={[
                        styles.sequenciaItem,
                        isActive && styles.sequenciaItemAtivo,
                        { borderColor: item.cor }
                    ]}
                >
                    <View style={styles.sequenciaItemContent}>
                        <View style={styles.sequenciaItemLeft}>
                            <FontAwesome
                                name="bars"
                                size={20}
                                color="#CCCCCC"
                                style={styles.dragIcon}
                            />

                            <View style={[
                                styles.itemIconContainer,
                                { backgroundColor: `${item.cor}15` }
                            ]}>
                                <FontAwesome
                                    name={item.icone}
                                    size={20}
                                    color={item.cor}
                                />
                            </View>

                            <View>
                                <Text style={styles.itemNome}>{item.nome}</Text>
                                {item.tipo === 'descanso' && (
                                    <Text style={styles.itemSubtipo}>Dia de pausa</Text>
                                )}
                            </View>
                        </View>

                        <View style={styles.sequenciaItemRight}>
                            <Text style={[styles.itemBadge, { backgroundColor: item.cor }]}>
                                {item.tipo === 'treino' ? 'T' : 'D'}
                            </Text>

                            <TouchableOpacity
                                onPress={() => handleRemoverItem(item.id)}
                                style={styles.removeButton}
                            >
                                <FontAwesome name="trash" size={18} color="#FF5722" />
                            </TouchableOpacity>
                        </View>
                    </View>
                </TouchableOpacity>
            </ScaleDecorator>
        );
    };

    const handleSalvar = async () => {
        if (sequencia.length === 0) {
            Alert.alert('Atenção', 'Adicione pelo menos um item à sequência.');
            return;
        }

        setIsLoading(true);
        try {
            await AsyncStorage.setItem('@sequenciaTreinos', JSON.stringify(sequencia));

            // Calcular ciclo para exemplo
            const cicloExemplo = gerarCicloExemplo();

            console.log('Sequência salva:', sequencia);

            // Mostrar modal de confirmação com exemplo do ciclo
            setModalVisible(true);

        } catch (error) {
            console.error('Erro ao salvar sequência:', error);
            Alert.alert('Erro', 'Não foi possível salvar sua configuração. Tente novamente.');
        } finally {
            setIsLoading(false);
        }
    };

    const gerarCicloExemplo = () => {
        if (sequencia.length === 0) return [];

        const ciclo: typeof sequencia = []; // Usa o mesmo tipo do array sequencia
        const repeticoes = 3;

        for (let i = 0; i < repeticoes; i++) {
            sequencia.forEach((item, index) => {
                ciclo.push({
                    ...item,
                    dia: i * sequencia.length + index + 1
                });
            });
        }

        return ciclo.slice(0, 8);
    };

    const handleFinalizar = () => {
        setModalVisible(false);
        router.push('/FinalizacaoScreen');
    };

    const handleVoltar = () => {
        router.push('/OrganizacaoTreinosScreen'); // Redireciona para a tela de organização
    };

    const cicloExemplo = gerarCicloExemplo();

    return (
        <GestureHandlerRootView style={styles.background}>
            {/* BOTÃO VOLTAR NO TOPO - FIXO */}
            <View style={styles.headerContainer}>
                <Pressable style={styles.backButton} onPress={handleVoltar}>
                    <FontAwesome name="arrow-left" size={20} color="#1E88E5" />
                    <Text style={styles.backButtonText}>Voltar</Text>
                </Pressable>
            </View>

            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {/* CONTAINER PRINCIPAL */}
                <View style={styles.mainContainer}>
                    {/* IMAGEM NO TOPO */}
                    <View style={styles.imageContainer}>
                        <Image
                            source={require('@/assets/images/logo2.png')}
                            style={styles.topImage}
                            resizeMode="cover"
                        />
                    </View>

                    {/* CONTEÚDO */}
                    <View style={styles.content}>
                        <View style={styles.headerSection}>
                            <Text style={styles.sectionTitle}>🔄 Sequência de Treinos</Text>
                            <Text style={styles.welcomeTitle}>
                                Defina a ordem dos seus treinos
                            </Text>
                            <Text style={styles.obrigatorio}>* obrigatório</Text>
                        </View>

                        <Text style={styles.subtitle}>
                            Organize como seus treinos irão se repetir ao longo dos dias
                        </Text>

                        {/* LISTA DE SEQUÊNCIA */}
                        <View style={styles.sequenciaContainer}>
                            <View style={styles.sequenciaHeader}>
                                <Text style={styles.sequenciaTitulo}>
                                    Sua sequência ({sequencia.length} {sequencia.length === 1 ? 'item' : 'itens'})
                                </Text>
                                <Text style={styles.sequenciaInstrucao}>
                                    Segure e arraste para reordenar
                                </Text>
                            </View>

                            {sequencia.length > 0 ? (
                                <View style={styles.draggableContainer}>
                                    <DraggableFlatList
                                        data={sequencia}
                                        onDragEnd={({ data }) => setSequencia(data)}
                                        keyExtractor={(item) => item.id}
                                        renderItem={renderItem}
                                        containerStyle={styles.flatListContainer}
                                        scrollEnabled={false}
                                    />
                                </View>
                            ) : (
                                <View style={styles.emptyContainer}>
                                    <FontAwesome name="list" size={40} color="#CCCCCC" />
                                    <Text style={styles.emptyText}>
                                        Nenhum item na sequência
                                    </Text>
                                    <Text style={styles.emptySubtext}>
                                        Adicione descansos usando o botão abaixo
                                    </Text>
                                </View>
                            )}

                            {/* BOTÃO ADICIONAR DESCANSO */}
                            <TouchableOpacity
                                style={styles.addButton}
                                onPress={handleAdicionarDescanso}
                            >
                                <View style={styles.addButtonContent}>
                                    <FontAwesome name="plus-circle" size={22} color="#1E88E5" />
                                    <Text style={styles.addButtonText}>Adicionar descanso</Text>
                                </View>
                            </TouchableOpacity>
                        </View>

                        {/* EXEMPLO DA SEQUÊNCIA */}
                        {sequencia.length > 0 && (
                            <View style={styles.exemploContainer}>
                                <Text style={styles.exemploTitulo}>Visualização do ciclo</Text>
                                <Text style={styles.exemploSubtitulo}>
                                    Essa sequência será repetida automaticamente
                                </Text>

                                <View style={styles.cicloContainer}>
                                    {cicloExemplo.map((item, index) => (
                                        <View key={index} style={styles.cicloItem}>
                                            <View style={styles.cicloItemContent}>
                                                <View style={[
                                                    styles.cicloBullet,
                                                    { backgroundColor: item.cor }
                                                ]} />
                                                <Text style={styles.cicloDia}>Dia {item.dia}</Text>
                                            </View>
                                            <View style={[
                                                styles.cicloBadge,
                                                { backgroundColor: `${item.cor}15` }
                                            ]}>
                                                <FontAwesome
                                                    name={item.icone}
                                                    size={12}
                                                    color={item.cor}
                                                />
                                                <Text style={[styles.cicloTexto, { color: item.cor }]}>
                                                    {item.nome}
                                                </Text>
                                            </View>
                                        </View>
                                    ))}

                                    <View style={styles.cicloContinuacao}>
                                        <FontAwesome name="ellipsis-h" size={20} color="#CCCCCC" />
                                        <Text style={styles.cicloContinuacaoTexto}>
                                            ... e assim por diante
                                        </Text>
                                    </View>
                                </View>
                            </View>
                        )}

                        {/* INFORMAÇÃO ADICIONAL */}
                        <View style={styles.infoContainer}>
                            <FontAwesome name="info-circle" size={20} color="#1E88E5" />
                            <Text style={styles.infoTexto}>
                                Essa sequência será repetida automaticamente, independente dos dias da semana.
                                O app vai alternar os treinos na ordem definida.
                            </Text>
                        </View>

                        <View style={styles.divider} />

                        {/* BOTÃO SALVAR */}
                        <Pressable
                            style={[
                                styles.primaryButton,
                                (isLoading || sequencia.length === 0) && styles.primaryButtonDisabled
                            ]}
                            onPress={handleSalvar}
                            disabled={isLoading || sequencia.length === 0}
                        >
                            <View style={styles.buttonContent}>
                                <FontAwesome name="check" size={22} color="#FFFFFF" />
                                <Text style={styles.primaryText}>
                                    {isLoading ? 'Salvando...' : 'Salvar Sequência'}
                                </Text>
                            </View>
                            <Text style={styles.buttonSubtitle}>
                                Sua sequência será usada para alternar os treinos
                            </Text>
                        </Pressable>
                    </View>
                </View>
            </ScrollView>

            {/* MODAL DE CONFIRMAÇÃO */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <View style={styles.modalIconContainer}>
                                <FontAwesome name="check-circle" size={50} color="#4CAF50" />
                            </View>
                            <Text style={styles.modalTitulo}>Sequência salva com sucesso!</Text>
                            <Text style={styles.modalSubtitulo}>
                                Seus treinos vão seguir esta ordem:
                            </Text>
                        </View>

                        <View style={styles.modalCicloContainer}>
                            {sequencia.map((item, index) => (
                                <View key={item.id} style={styles.modalCicloItem}>
                                    <View style={[
                                        styles.modalCicloBadge,
                                        { backgroundColor: `${item.cor}15` }
                                    ]}>
                                        <FontAwesome name={item.icone} size={16} color={item.cor} />
                                    </View>
                                    <Text style={styles.modalCicloTexto}>{item.nome}</Text>
                                    {index < sequencia.length - 1 && (
                                        <FontAwesome name="arrow-right" size={16} color="#CCCCCC" />
                                    )}
                                </View>
                            ))}
                        </View>

                        <View style={styles.modalInfoContainer}>
                            <FontAwesome name="repeat" size={16} color="#1E88E5" />
                            <Text style={styles.modalInfoTexto}>
                                Este ciclo se repetirá automaticamente
                            </Text>
                        </View>

                        <Pressable
                            style={styles.modalButton}
                            onPress={handleFinalizar}
                        >
                            <Text style={styles.modalButtonText}>Continuar</Text>
                        </Pressable>
                    </View>
                </View>
            </Modal>
        </GestureHandlerRootView>
    );
}

const styles = StyleSheet.create({
    background: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },

    headerContainer: {
        backgroundColor: '#FFFFFF',
        borderBottomWidth: 1,
        borderBottomColor: '#E0E0E0',
        zIndex: 10,
    },

    backButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 16,
    },

    backButtonText: {
        color: '#1E88E5',
        fontSize: 16,
        fontWeight: '600',
        marginLeft: 8,
    },

    scrollView: {
        flex: 1,
    },

    scrollContent: {
        flexGrow: 1,
        paddingTop: 15,
        paddingBottom: 30,
        paddingHorizontal: 5,
    },

    mainContainer: {
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: '#E0E0E0',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 5,
        marginHorizontal: 15,
        maxWidth: 400,
        alignSelf: 'center',
        width: '92%',
        marginTop: 5,
    },

    imageContainer: {
        height: 170,
        width: '100%',
        overflow: 'hidden',
        backgroundColor: '#F5F5F5',
    },

    topImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },

    content: {
        paddingHorizontal: 24,
        paddingTop: 28,
        paddingBottom: 28,
        alignItems: 'center',
    },

    headerSection: {
        alignItems: 'center',
        marginBottom: 20,
    },

    sectionTitle: {
        color: '#666666',
        fontSize: 14,
        fontWeight: '600',
        textAlign: 'center',
        marginBottom: 12,
        backgroundColor: '#F0F9FF',
        paddingHorizontal: 16,
        paddingVertical: 6,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#1E88E5',
    },

    welcomeTitle: {
        color: '#000000',
        fontSize: 26,
        fontWeight: '700',
        textAlign: 'center',
        marginBottom: 8,
        lineHeight: 32,
    },

    obrigatorio: {
        color: '#FF5722',
        fontSize: 14,
        fontWeight: '600',
        textAlign: 'center',
        marginBottom: 22,
    },

    subtitle: {
        color: '#666666',
        fontSize: 17,
        textAlign: 'center',
        marginBottom: 32,
        lineHeight: 24,
    },

    // Sequência Container
    sequenciaContainer: {
        width: '100%',
        marginBottom: 24,
    },

    sequenciaHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },

    sequenciaTitulo: {
        fontSize: 16,
        fontWeight: '700',
        color: '#333',
    },

    sequenciaInstrucao: {
        fontSize: 12,
        color: '#999',
        fontStyle: 'italic',
    },

    draggableContainer: {
        backgroundColor: '#F8F9FA',
        borderRadius: 14,
        padding: 8,
        marginBottom: 12,
    },

    flatListContainer: {
        borderRadius: 14,
    },

    sequenciaItem: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        marginVertical: 4,
        borderWidth: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 2,
    },

    sequenciaItemAtivo: {
        shadowColor: '#1E88E5',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 8,
        transform: [{ scale: 1.02 }],
    },

    sequenciaItemContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 16,
    },

    sequenciaItemLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
        gap: 12,
    },

    dragIcon: {
        marginRight: 4,
    },

    itemIconContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },

    itemNome: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
    },

    itemSubtipo: {
        fontSize: 12,
        color: '#999',
        marginTop: 2,
    },

    sequenciaItemRight: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },

    itemBadge: {
        width: 24,
        height: 24,
        borderRadius: 12,
        textAlign: 'center',
        lineHeight: 24,
        color: '#FFFFFF',
        fontSize: 12,
        fontWeight: '700',
    },

    removeButton: {
        padding: 8,
    },

    emptyContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 32,
        backgroundColor: '#F8F9FA',
        borderRadius: 14,
        marginBottom: 12,
    },

    emptyText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#666',
        marginTop: 12,
    },

    emptySubtext: {
        fontSize: 14,
        color: '#999',
        marginTop: 4,
        textAlign: 'center',
    },

    addButton: {
        backgroundColor: '#F0F9FF',
        borderRadius: 12,
        padding: 16,
        borderWidth: 2,
        borderColor: '#1E88E5',
        borderStyle: 'dashed',
    },

    addButtonContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
    },

    addButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1E88E5',
    },

    // Exemplo Container
    exemploContainer: {
        width: '100%',
        backgroundColor: '#F8F9FA',
        borderRadius: 14,
        padding: 16,
        marginBottom: 20,
    },

    exemploTitulo: {
        fontSize: 16,
        fontWeight: '700',
        color: '#333',
        marginBottom: 4,
    },

    exemploSubtitulo: {
        fontSize: 14,
        color: '#666',
        marginBottom: 16,
    },

    cicloContainer: {
        gap: 8,
    },

    cicloItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#E0E0E0',
    },

    cicloItemContent: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },

    cicloBullet: {
        width: 8,
        height: 8,
        borderRadius: 4,
    },

    cicloDia: {
        fontSize: 14,
        fontWeight: '600',
        color: '#666',
    },

    cicloBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
        gap: 6,
    },

    cicloTexto: {
        fontSize: 12,
        fontWeight: '600',
    },

    cicloContinuacao: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        paddingTop: 12,
    },

    cicloContinuacaoTexto: {
        fontSize: 14,
        color: '#999',
        fontStyle: 'italic',
    },

    // Info Container
    infoContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F0F9FF',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderRadius: 12,
        gap: 12,
        marginBottom: 16,
        width: '100%',
    },

    infoTexto: {
        flex: 1,
        color: '#1E88E5',
        fontSize: 14,
        fontWeight: '500',
    },

    divider: {
        height: 1,
        width: '100%',
        backgroundColor: '#E0E0E0',
        marginVertical: 22,
    },

    primaryButton: {
        width: '100%',
        backgroundColor: '#1E88E5',
        borderRadius: 18,
        paddingVertical: 22,
        paddingHorizontal: 26,
        alignItems: 'center',
        shadowColor: '#1E88E5',
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.35,
        shadowRadius: 10,
        elevation: 8,
        marginBottom: 12,
    },

    primaryButtonDisabled: {
        backgroundColor: '#CCCCCC',
        shadowColor: '#CCCCCC',
    },

    buttonContent: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 14,
        marginBottom: 8,
    },

    primaryText: {
        color: '#FFFFFF',
        fontSize: 21,
        fontWeight: '700',
    },

    buttonSubtitle: {
        color: 'rgba(255, 255, 255, 0.9)',
        fontSize: 15,
        fontWeight: '500',
        textAlign: 'center',
    },

    // Modal Styles
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },

    modalContent: {
        backgroundColor: '#FFFFFF',
        borderRadius: 25,
        padding: 24,
        width: '85%',
        maxWidth: 400,
    },

    modalHeader: {
        alignItems: 'center',
        marginBottom: 24,
    },

    modalIconContainer: {
        marginBottom: 16,
    },

    modalTitulo: {
        fontSize: 22,
        fontWeight: '700',
        color: '#333',
        textAlign: 'center',
        marginBottom: 8,
    },

    modalSubtitulo: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
    },

    modalCicloContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 12,
        marginBottom: 20,
        padding: 16,
        backgroundColor: '#F8F9FA',
        borderRadius: 14,
    },

    modalCicloItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },

    modalCicloBadge: {
        width: 32,
        height: 32,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
    },

    modalCicloTexto: {
        fontSize: 14,
        fontWeight: '600',
        color: '#333',
    },

    modalInfoContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        marginBottom: 24,
        padding: 12,
        backgroundColor: '#F0F9FF',
        borderRadius: 12,
    },

    modalInfoTexto: {
        fontSize: 14,
        color: '#1E88E5',
        fontWeight: '500',
    },

    modalButton: {
        backgroundColor: '#1E88E5',
        borderRadius: 12,
        padding: 16,
        alignItems: 'center',
    },

    modalButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '700',
    },
});