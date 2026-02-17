import FontAwesome from '@expo/vector-icons/FontAwesome';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

export default function CinturaScreen() {
  const router = useRouter();

  const [cinturaCm, setCinturaCm] = useState<string>('');
  const [sexo, setSexo] = useState<string>('masculino');
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingSexo, setIsLoadingSexo] = useState(true); // Estado para loading do sexo

  // Buscar sexo salvo anteriormente
  useEffect(() => {
    const carregarSexo = async () => {
      try {
        setIsLoadingSexo(true);
        const sexoSalvo = await AsyncStorage.getItem('@sexo');
        console.log('Sexo carregado:', sexoSalvo); // Debug
        
        if (sexoSalvo) {
          setSexo(sexoSalvo);
        } else {
          // Se não tiver sexo salvo, volta para tela de sexo
          Alert.alert(
            'Informação incompleta',
            'Por favor, selecione seu sexo primeiro.',
            [{ text: 'OK', onPress: () => router.push('/SexoScreen') }]
          );
        }
      } catch (error) {
        console.error('Erro ao carregar sexo:', error);
      } finally {
        setIsLoadingSexo(false);
      }
    };

    carregarSexo();
  }, []);

  const handleProximo = async () => {
    if (!cinturaCm || Number(cinturaCm) <= 0) {
      Alert.alert('Atenção', 'Digite uma medida válida da cintura');
      return;
    }

    setIsLoading(true);

    try {
      // Salvar medida da cintura
      await AsyncStorage.setItem('@cinturaCm', cinturaCm);

      console.log('Medida da cintura salva:', cinturaCm);
      console.log('Sexo atual:', sexo); // Debug

      // Navegação condicional baseada no sexo
      if (sexo === 'feminino') {
        console.log('Navegando para QuadrilScreen (feminino)');
        router.push('/QuadrilScreen');
      } else {
        console.log('Navegando para PreparandoResultadosScreen (masculino)');
        router.push('/PreparandoResultadosScreen');
      }
    } catch (error) {
      console.error('Erro ao salvar medida da cintura:', error);
      Alert.alert(
        'Erro',
        'Não foi possível salvar a medida da cintura. Tente novamente.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleVoltar = () => {
    router.push('/PescocoScreen');
  };

  const handleCmChange = (text: string) => {
    const numericText = text.replace(/[^0-9.]/g, '');
    const parts = numericText.split('.');
    if (parts.length <= 2) {
      setCinturaCm(numericText);
    }
  };

  // Mostrar loading enquanto carrega o sexo
  if (isLoadingSexo) {
    return (
      <View style={[styles.background, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#1E88E5" />
        <Text style={{ marginTop: 16, color: '#666' }}>Carregando...</Text>
      </View>
    );
  }

  return (
    <View style={styles.background}>
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
        <View style={styles.mainContainer}>
          <View style={styles.imageContainer}>
            <Image
              source={require('@/assets/images/logo2.png')}
              style={styles.topImage}
              resizeMode="cover"
            />
          </View>

          <View style={styles.content}>
            <View style={styles.headerSection}>
              <Text style={styles.sectionTitle}>
                📐 Medidas corporais (2 de 3)
              </Text>
              <Text style={styles.welcomeTitle}>
                Qual é a medida da sua cintura?
              </Text>
              <Text style={styles.obrigatorio}>* obrigatório</Text>
              
              {/* Mostrar sexo atual para debug (opcional) */}
              <Text style={styles.sexoInfo}>
                Sexo: {sexo === 'feminino' ? 'Feminino' : 'Masculino'}
              </Text>
            </View>

            <Text style={styles.subtitle}>
              Meça na altura do umbigo, relaxando o abdômen
            </Text>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>
                Digite a medida em centímetros:
              </Text>

              <View
                style={[
                  styles.inputWrapper,
                  cinturaCm && styles.inputWrapperActive,
                ]}
              >
                <FontAwesome
                  name="arrows-h"
                  size={22}
                  color={cinturaCm ? '#1E88E5' : '#999'}
                  style={styles.inputIcon}
                />

                <TextInput
                  style={styles.input}
                  value={cinturaCm}
                  onChangeText={handleCmChange}
                  placeholder="Ex: 85.5"
                  placeholderTextColor="#999"
                  keyboardType="decimal-pad"
                />

                {cinturaCm ? (
                  <Text style={styles.unidadeTextInput}>cm</Text>
                ) : null}
              </View>

              <Text style={styles.inputHelpText}>
                Meça sem prender a respiração
              </Text>
            </View>

            <View style={styles.divider} />

            <Pressable
              style={[
                styles.primaryButton,
                (!cinturaCm || isLoading) && styles.primaryButtonDisabled,
              ]}
              onPress={handleProximo}
              disabled={!cinturaCm || isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <>
                  <View style={styles.buttonContent}>
                    <FontAwesome
                      name="arrow-right"
                      size={22}
                      color="#FFFFFF"
                    />
                    <Text style={styles.primaryText}>
                      {sexo === 'feminino'
                        ? 'Próxima medida'
                        : 'Calcular BF'}
                    </Text>
                  </View>

                  <Text style={styles.buttonSubtitle}>
                    {sexo === 'feminino'
                      ? 'Continue para a medida do quadril'
                      : 'Calcular percentual de gordura'}
                  </Text>
                </>
              )}
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  background: { flex: 1, backgroundColor: '#FFFFFF' },
  headerContainer: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
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
  scrollView: { flex: 1 },
  scrollContent: {
    flexGrow: 1,
    paddingVertical: 20,
  },
  mainContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    marginHorizontal: 20,
    paddingBottom: 30,
  },
  imageContainer: {
    height: 160,
    width: '100%',
  },
  topImage: {
    width: '100%',
    height: '100%',
  },
  content: {
    paddingHorizontal: 24,
    paddingTop: 24,
  },
  headerSection: {
    alignItems: 'center',
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1E88E5',
    marginBottom: 8,
  },
  welcomeTitle: {
    fontSize: 22,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 6,
  },
  obrigatorio: {
    fontSize: 13,
    color: '#FF5722',
  },
  sexoInfo: {
    fontSize: 12,
    color: '#666',
    marginTop: 8,
    fontStyle: 'italic',
  },
  subtitle: {
    textAlign: 'center',
    marginBottom: 25,
    color: '#666',
  },
  inputContainer: {
    marginBottom: 25,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#E0E0E0',
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  inputWrapperActive: {
    borderColor: '#1E88E5',
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 18,
  },
  unidadeTextInput: {
    fontWeight: '600',
    color: '#1E88E5',
  },
  inputHelpText: {
    fontSize: 13,
    color: '#666',
    marginTop: 6,
  },
  divider: {
    height: 1,
    backgroundColor: '#E0E0E0',
    marginVertical: 20,
  },
  primaryButton: {
    backgroundColor: '#1E88E5',
    paddingVertical: 18,
    borderRadius: 16,
    alignItems: 'center',
  },
  primaryButtonDisabled: {
    backgroundColor: '#BDBDBD',
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 6,
  },
  primaryText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
  },
  buttonSubtitle: {
    color: '#FFFFFF',
    fontSize: 13,
  },
});