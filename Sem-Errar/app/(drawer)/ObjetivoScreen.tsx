import FontAwesome from '@expo/vector-icons/FontAwesome';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
export default function ObjetivoScreen() {
  const router = useRouter();
  const [objetivoSelecionado, setObjetivoSelecionado] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const objetivos = [
    {
      id: 'ganhar-massa',
      title: 'Ganhar Massa',
      description: 'Aumentar massa muscular',
      icon: 'trophy',
      color: '#1E88E5',
    },
    {
      id: 'perder-gordura',
      title: 'Perder Gordura',
      description: 'Reduzir gordura corporal',
      icon: 'fire',
      color: '#FF5722',
    },
    {
      id: 'outros',
      title: 'Outros',
      description: 'Outro objetivo específico',
      icon: 'bullseye',
      color: '#607D8B',
    },
  ];

  const handleProximo = async () => {
    if (objetivoSelecionado) {
      setIsLoading(true);
      try {
        // Salvar no AsyncStorage
        await AsyncStorage.setItem('@objetivo', objetivoSelecionado);
        
        // Opcional: Salvar também o objeto completo do objetivo
        const objetivoCompleto = objetivos.find(obj => obj.id === objetivoSelecionado);
        if (objetivoCompleto) {
          await AsyncStorage.setItem('@objetivoCompleto', JSON.stringify(objetivoCompleto));
        }
        
        console.log('Objetivo salvo:', objetivoSelecionado);
        
        // Navegar para próxima tela
        router.push('/(drawer)/SexoScreen');
      } catch (error) {
        console.error('Erro ao salvar objetivo:', error);
        Alert.alert('Erro', 'Não foi possível salvar seu objetivo. Tente novamente.');
      } finally {
        setIsLoading(false);
      }
    }
  };

  // Opcional: Carregar objetivo salvo ao iniciar a tela
  const carregarObjetivoSalvo = async () => {
    try {
      const objetivoSalvo = await AsyncStorage.getItem('@objetivo');
      if (objetivoSalvo) {
        setObjetivoSelecionado(objetivoSalvo);
      }
    } catch (error) {
      console.error('Erro ao carregar objetivo:', error);
    }
  };

  // UseEffect para carregar ao iniciar
  useEffect(() => {
    carregarObjetivoSalvo();
  }, []);

  return (
    <View style={styles.background}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* CONTAINER PRINCIPAL */}
        <View style={styles.mainContainer}>
          {/* IMAGEM NO TOPO - AUMENTEI A ALTURA */}
          <View style={styles.imageContainer}>
            <Image
              source={require('@/assets/images/logo2.png')}
              style={styles.topImage}
              resizeMode="cover"
            />
          </View>
          
          {/* CONTEÚDO ABAIXO DA IMAGEM */}
          <View style={styles.content}>
            <Text style={styles.welcomeTitle}>Qual é o seu principal objetivo?</Text>
            <Text style={styles.subtitle}>
              Escolha o objetivo que melhor descreve sua jornada fitness
            </Text>
            
            {/* OPÇÕES DE OBJETIVO */}
            <View style={styles.opcoesContainer}>
              {objetivos.map((objetivo) => (
                <Pressable
                  key={objetivo.id}
                  style={[
                    styles.opcaoItem,
                    objetivoSelecionado === objetivo.id && styles.opcaoItemSelecionado
                  ]}
                  onPress={() => setObjetivoSelecionado(objetivo.id)}
                >
                  <View style={[
                    styles.opcaoIconContainer,
                    { backgroundColor: `${objetivo.color}15` }
                  ]}>
                    <FontAwesome name={objetivo.icon as any} size={24} color={objetivo.color} />
                  </View>
                  
                  <View style={styles.opcaoContent}>
                    <Text style={styles.opcaoTitulo}>{objetivo.title}</Text>
                    <Text style={styles.opcaoDescricao}>{objetivo.description}</Text>
                  </View>
                  
                  <View style={[
                    styles.radioButton,
                    objetivoSelecionado === objetivo.id && styles.radioButtonSelecionado
                  ]}>
                    {objetivoSelecionado === objetivo.id && (
                      <View style={styles.radioButtonInner} />
                    )}
                  </View>
                </Pressable>
              ))}
            </View>
            
            <View style={styles.divider} />
            
            {/* BOTÃO PRÓXIMO */}
            <Pressable 
              style={[
                styles.primaryButton,
                (!objetivoSelecionado || isLoading) && styles.primaryButtonDisabled
              ]}
              onPress={handleProximo}
              disabled={!objetivoSelecionado || isLoading}
            >
              <View style={styles.buttonContent}>
                <FontAwesome name="arrow-right" size={22} color="#FFFFFF" />
                <Text style={styles.primaryText}>
                  {isLoading ? 'Salvando...' : 'Próximo'}
                </Text>
              </View>
              <Text style={styles.buttonSubtitle}>
                {objetivoSelecionado 
                  ? 'Continue para criar sua conta' 
                  : 'Selecione um objetivo para continuar'}
              </Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

// ... estilos permanecem os mesmos
const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  
  scrollView: {
    flex: 1,
  },
  
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingVertical: 20,
  },

  mainContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
    marginHorizontal: 20,
    maxWidth: 400,
    alignSelf: 'center',
    width: '90%',
  },

  imageContainer: {
    height: 200, // AUMENTEI PARA 200 (era 160)
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
    paddingHorizontal: 20,
    paddingTop: 25, // Aumentei o padding top
    paddingBottom: 25,
    alignItems: 'center',
  },

  welcomeTitle: {
    color: '#000000',
    fontSize: 24,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 12,
    lineHeight: 30,
  },

  subtitle: {
    color: '#666666',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 30, // Aumentei o margin
    lineHeight: 22,
  },

  opcoesContainer: {
    width: '100%',
    gap: 16,
    marginBottom: 25,
  },

  opcaoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 18,
    paddingHorizontal: 16,
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#E9ECEF',
    gap: 16,
  },

  opcaoItemSelecionado: {
    backgroundColor: '#F0F9FF',
    borderColor: '#1E88E5',
  },

  opcaoIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },

  opcaoContent: {
    flex: 1,
    gap: 4,
  },

  opcaoTitulo: {
    color: '#000000',
    fontSize: 16,
    fontWeight: '600',
  },

  opcaoDescricao: {
    color: '#666666',
    fontSize: 14,
    lineHeight: 18,
  },

  radioButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#CCCCCC',
    justifyContent: 'center',
    alignItems: 'center',
  },

  radioButtonSelecionado: {
    borderColor: '#1E88E5',
    backgroundColor: '#1E88E5',
  },

  radioButtonInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#FFFFFF',
  },

  divider: {
    height: 1,
    width: '100%',
    backgroundColor: '#E0E0E0',
    marginVertical: 20,
  },

  primaryButton: {
    width: '100%',
    backgroundColor: '#1E88E5',
    borderRadius: 16,
    paddingVertical: 20,
    paddingHorizontal: 24,
    alignItems: 'center',
    shadowColor: '#1E88E5',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
    marginBottom: 10,
  },

  primaryButtonDisabled: {
    backgroundColor: '#CCCCCC',
    shadowColor: '#CCCCCC',
  },

  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 6,
  },

  primaryText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '700',
  },

  buttonSubtitle: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
  },
});