import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  Dimensions,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View
} from 'react-native';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

export default function RegistrarTreinoScreen() {
  const router = useRouter();

  // Estado das opções iniciais
  const [opcaoSelecionada, setOpcaoSelecionada] = useState<string | null>(null);

  const opcoes = [
    {
      id: 'agora',
      title: '🚀 Vamos lá',
      subtitle: 'Registrar meu treino agora',
      icon: 'rocket',
      color: '#1E88E5',
    },
    {
      id: 'depois',
      title: '⏳ Registrar mais tarde',
      subtitle: 'Voltar para o app depois',
      icon: 'clock-o',
      color: '#757575',
    },
  ];

  const handleProximo = () => {
    if (!opcaoSelecionada) return;
    
    if (opcaoSelecionada === 'agora') {
      // Se selecionou "Vamos lá", vai para EstruturaTreinosScreen
      router.push('/EstruturaTreinosScreen');
    } else {
      // Se selecionou "depois", vai direto para RegistrarCardioScreen
      router.push('/RegistrarCardioScreen');
    }
  };

  const handleVoltar = () => {
    router.push('/CardioScreen');
  };

  return (
    <View style={styles.background}>
      {/* Cabeçalho */}
      <View style={styles.headerContainer}>
        <Pressable style={styles.backButton} onPress={handleVoltar}>
          <FontAwesome name="arrow-left" size={20} color="#1E88E5" />
          <Text style={styles.backButtonText}>Voltar</Text>
        </Pressable>
      </View>

      {/* Conteúdo principal */}
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.mainContainer}>
          <View style={styles.imageContainer}>
            <Image source={require('@/assets/images/logo2.png')} style={styles.topImage} resizeMode="cover" />
          </View>

          <View style={styles.content}>
            <Text style={styles.welcomeTitle}>Deseja registrar seu treino agora?</Text>

            <View style={styles.infoBox}>
              <FontAwesome name="info-circle" size={20} color="#1E88E5" />
              <Text style={styles.infoText}>
                Use o app para acompanhar seus treinos e sua evolução 💪
              </Text>
            </View>

            <Text style={styles.subtitle}>
              Registrar seus treinos ajuda a acompanhar seu progresso
            </Text>

            <View style={styles.opcoesContainer}>
              {opcoes.map((opcao) => (
                <Pressable 
                  key={opcao.id} 
                  style={[styles.opcaoItem, opcaoSelecionada === opcao.id && styles.opcaoItemSelecionado]} 
                  onPress={() => setOpcaoSelecionada(opcao.id)}
                >
                  <View style={[styles.opcaoIconContainer, { backgroundColor: `${opcao.color}15` }]}>
                    <FontAwesome name={opcao.icon as any} size={28} color={opcao.color} />
                  </View>

                  <View style={styles.opcaoContent}>
                    <Text style={styles.opcaoTitulo}>{opcao.title}</Text>
                    <Text style={styles.opcaoSubtitulo}>{opcao.subtitle}</Text>
                  </View>

                  <View style={[styles.radioButton, opcaoSelecionada === opcao.id && styles.radioButtonSelecionado]}>
                    {opcaoSelecionada === opcao.id && <View style={styles.radioButtonInner} />}
                  </View>
                </Pressable>
              ))}
            </View>

            <Pressable 
              style={[styles.primaryButton, !opcaoSelecionada && styles.primaryButtonDisabled]} 
              onPress={handleProximo} 
              disabled={!opcaoSelecionada}
            >
              <View style={styles.buttonContent}>
                <FontAwesome name="arrow-right" size={22} color="#FFFFFF" />
                <Text style={styles.primaryText}>Próximo</Text>
              </View>
              <Text style={styles.buttonSubtitle}>
                {opcaoSelecionada ? 'Continue para a próxima etapa' : 'Selecione uma opção para continuar'}
              </Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  background: { 
    flex: 1, 
    backgroundColor: '#FFFFFF' 
  },
  headerContainer: { 
    backgroundColor: '#FFFFFF', 
    borderBottomWidth: 1, 
    borderBottomColor: '#E0E0E0', 
    zIndex: 10 
  },
  backButton: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    paddingHorizontal: 20, 
    paddingVertical: 16 
  },
  backButtonText: { 
    color: '#1E88E5', 
    fontSize: 16, 
    fontWeight: '600', 
    marginLeft: 8 
  },
  scrollView: { 
    flex: 1 
  },
  scrollContent: { 
    flexGrow: 1, 
    paddingTop: 15, 
    paddingBottom: 30, 
    paddingHorizontal: 5 
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
    marginTop: 5 
  },
  imageContainer: { 
    height: 170, 
    width: '100%', 
    overflow: 'hidden', 
    backgroundColor: '#F5F5F5' 
  },
  topImage: { 
    width: '100%', 
    height: '100%', 
    resizeMode: 'cover' 
  },
  content: { 
    paddingHorizontal: 24, 
    paddingTop: 28, 
    paddingBottom: 28, 
    alignItems: 'center' 
  },
  welcomeTitle: { 
    color: '#000000', 
    fontSize: 26, 
    fontWeight: '700', 
    textAlign: 'center', 
    marginBottom: 20, 
    lineHeight: 32 
  },
  infoBox: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: '#F0F9FF', 
    padding: 16, 
    borderRadius: 12, 
    borderWidth: 1, 
    borderColor: '#BBDEFB', 
    gap: 12, 
    marginBottom: 20, 
    width: '100%' 
  },
  infoText: { 
    flex: 1, 
    color: '#1E88E5', 
    fontSize: 16, 
    lineHeight: 22 
  },
  subtitle: { 
    color: '#666666', 
    fontSize: 17, 
    textAlign: 'center', 
    marginBottom: 32, 
    lineHeight: 24 
  },
  opcoesContainer: { 
    width: '100%', 
    gap: 20, 
    marginBottom: 25 
  },
  opcaoItem: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    paddingVertical: 20, 
    paddingHorizontal: 16, 
    backgroundColor: '#F8F9FA', 
    borderRadius: 12, 
    borderWidth: 2, 
    borderColor: '#E9ECEF', 
    gap: 20 
  },
  opcaoItemSelecionado: { 
    backgroundColor: '#F0F9FF', 
    borderColor: '#1E88E5' 
  },
  opcaoIconContainer: { 
    width: 60, 
    height: 60, 
    borderRadius: 30, 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  opcaoContent: { 
    flex: 1 
  },
  opcaoTitulo: { 
    color: '#000000', 
    fontSize: 18, 
    fontWeight: '600', 
    marginBottom: 4 
  },
  opcaoSubtitulo: { 
    color: '#666666', 
    fontSize: 14 
  },
  radioButton: { 
    width: 24, 
    height: 24, 
    borderRadius: 12, 
    borderWidth: 2, 
    borderColor: '#CCCCCC', 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  radioButtonSelecionado: { 
    borderColor: '#1E88E5', 
    backgroundColor: '#1E88E5' 
  },
  radioButtonInner: { 
    width: 12, 
    height: 12, 
    borderRadius: 6, 
    backgroundColor: '#FFFFFF' 
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
    shadowRadius: 6.27, 
    elevation: 10 
  },
  primaryButtonDisabled: { 
    opacity: 0.5 
  },
  buttonContent: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    gap: 12 
  },
  primaryText: { 
    color: '#FFFFFF', 
    fontWeight: '700', 
    fontSize: 18 
  },
  buttonSubtitle: { 
    color: '#F1F5F9', 
    fontSize: 14, 
    marginTop: 4 
  }
});