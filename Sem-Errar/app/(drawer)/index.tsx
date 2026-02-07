import { Text } from '@/components/Themed';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Link, useRouter } from 'expo-router';
import { useContext } from 'react';
import {
  Dimensions,
  Image,
  Pressable,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  View,
} from 'react-native';
import { AuthContext } from './AuthContext';

export default function HomeScreen() {
  const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
  const router = useRouter();
  const auth = useContext(AuthContext);
  
  const isLoggedIn = !!auth?.usuario;
  const userName = auth?.usuario?.nome?.split(' ')[0] || '';

  const handleIniciarDesafio = () => {
    if (isLoggedIn) {
      router.push('/(drawer)/diarias');
    } else {
      router.push('/(drawer)/login');
    }
  };

  const handleVerResultados = () => {
    if (isLoggedIn) {
      //router.push('/(drawer)/resultados');
    } else {
      router.push('/(drawer)/login');
    }
  };

  const handleAcompanharProgresso = () => {
    if (isLoggedIn) {
     // router.push('/(drawer)/historico');
    } else {
      router.push('/(drawer)/login');
    }
  };

  return (
    <View style={styles.background}>
      <SafeAreaView style={styles.safeArea}>
        {/* TOPO */}
        <View style={styles.topBar}>
          <Link href="/modal" asChild>
            <Pressable style={styles.infoButton}>
              <FontAwesome name="info-circle" size={20} color="#000000" />
              <Text style={styles.infoText}>Informações</Text>
            </Pressable>
          </Link>
        </View>

        {/* CONTAINER PRINCIPAL COM IMAGEM NO TOPO */}
        <View style={[
          styles.mainContainer,
          { 
            marginHorizontal: 20,
            maxWidth: 400,
            alignSelf: 'center',
            width: '90%',
            maxHeight: screenHeight * 0.8,
          }
        ]}>
          {/* IMAGEM NO TOPO DO CONTAINER */}
          <View style={styles.imageContainer}>
            <Image
              source={require('@/assets/images/logo2.png')}
              style={styles.topImage}
              resizeMode="cover"
            />
          </View>
          
          {/* CONTEÚDO ABAIXO DA IMAGEM */}
          <View style={styles.content}>
            {/* SAUDAÇÃO PERSONALIZADA */}
            {isLoggedIn ? (
              <Text style={styles.welcomeTitle}>
                Bem-vindo de volta, <Text style={styles.userName}>{userName}!</Text>
              </Text>
            ) : (
              <Text style={styles.welcomeTitle}>Transforme objetivos em conquistas</Text>
            )}
            
            <Text style={styles.subtitle}>
              {isLoggedIn 
                ? 'Pronto para seu próximo desafio?' 
                : 'Junte-se à comunidade fitness mais motivadora!'}
            </Text>
            
            {/* FEATURES SIMPLIFICADAS */}
            <View style={styles.featuresContainer}>
              <View style={styles.featureRow}>
                <View style={styles.featureItem}>
                  <FontAwesome name="check-circle" size={20} color="#1E88E5" />
                  <Text style={styles.featureText}>Planos personalizados</Text>
                </View>
                
                <View style={styles.featureItem}>
                  <FontAwesome name="bar-chart" size={20} color="#8E44AD" />
                  <Text style={styles.featureText}>Acompanhamento detalhado</Text>
                </View>
              </View>
              
              <View style={styles.featureRow}>
                <View style={styles.featureItem}>
                  <FontAwesome name="users" size={20} color="#EF6C00" />
                  <Text style={styles.featureText}>Comunidade ativa</Text>
                </View>
                
                <View style={styles.featureItem}>
                  <FontAwesome name="trophy" size={20} color="#43A047" />
                  <Text style={styles.featureText}>Desafios diários</Text>
                </View>
              </View>
            </View>
            
            <View style={styles.divider} />
            
            {/* BOTÃO PRINCIPAL - INICIAR DESAFIO */}
            <Pressable 
              style={styles.primaryButton}
              onPress={handleIniciarDesafio}
            >
              <View style={styles.buttonContent}>
                <FontAwesome name="bolt" size={22} color="#FFFFFF" />
                <Text style={styles.primaryText}>Iniciar Desafio</Text>
              </View>
              <Text style={styles.buttonSubtitle}>
                {isLoggedIn ? 'Comece agora seu treino do dia' : 'Faça login para começar'}
              </Text>
            </Pressable>
            
            {/* AÇÕES SECUNDÁRIAS */}
            <View style={styles.secondaryActions}>
              <Pressable 
                style={styles.secondaryButton}
                onPress={handleVerResultados}
              >
                <View style={styles.secondaryButtonContent}>
                  <FontAwesome name="line-chart" size={18} color="#1E88E5" />
                  <Text style={styles.secondaryText}>Ver Resultados</Text>
                </View>
              </Pressable>
              
              <Pressable 
                style={styles.secondaryButton}
                onPress={handleAcompanharProgresso}
              >
                <View style={styles.secondaryButtonContent}>
                  <FontAwesome name="calendar" size={18} color="#8E44AD" />
                  <Text style={styles.secondaryText}>Acompanhar Progresso</Text>
                </View>
              </Pressable>
            </View>
            
            {/* FOOTER DINÂMICO */}
            <Text style={styles.footerText}>
              {isLoggedIn ? (
                <>
                  <Text>Complete desafios e ganhe recompensas. </Text>
                  <Link href="/(drawer)/perfil" asChild>
                    <Text style={styles.linkText}>Ver meu perfil →</Text>
                  </Link>
                </>
              ) : (
                <>
                  Já tem uma conta?{' '}
                  <Link href="/(drawer)/login" asChild>
                    <Text style={styles.linkText}>Entre aqui</Text>
                  </Link>
                  {' • '}
                  <Link href="/(drawer)/cadastro" asChild>
                    <Text style={styles.linkText}>Criar conta</Text>
                  </Link>
                </>
              )}
            </Text>
            
            {/* ESTATÍSTICAS DA COMUNIDADE */}
            <View style={styles.communityStats}>
              <View style={styles.statItem}>
                <FontAwesome name="users" size={14} color="#666666" />
                <Text style={styles.statText}>+10k membros</Text>
              </View>
              <View style={styles.statItem}>
                <FontAwesome name="trophy" size={14} color="#666666" />
                <Text style={styles.statText}>+50k desafios</Text>
              </View>
              <View style={styles.statItem}>
                <FontAwesome name="heartbeat" size={14} color="#666666" />
                <Text style={styles.statText}>Transformando vidas</Text>
              </View>
            </View>
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
  },
  
  safeArea: {
    flex: 1,
    paddingTop: StatusBar.currentHeight || 0,
    justifyContent: 'space-between',
  },

  topBar: {
    paddingTop: 10,
    paddingHorizontal: 20,
    alignItems: 'flex-end',
  },

  infoButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.1)',
  },

  infoText: {
    color: '#000000',
    fontSize: 14,
    fontWeight: '600',
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
    marginBottom: 20,
  },

  imageContainer: {
    height: 180,
    width: '100%',
    overflow: 'hidden',
    backgroundColor: '#F5F5F5',
  },

  topImage: {
    width: '100%',
    height: '100%',
  },

  content: {
    paddingHorizontal: 20,
    paddingVertical: 25,
    alignItems: 'center',
  },

  welcomeTitle: {
    color: '#000000',
    fontSize: 24,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 8,
    lineHeight: 30,
  },

  userName: {
    color: '#1E88E5',
  },

  subtitle: {
    color: '#666666',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 22,
  },

  featuresContainer: {
    width: '100%',
    marginBottom: 24,
    gap: 12,
  },

  featureRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },

  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 8,
    paddingHorizontal: 12,
    width: '48%',
    backgroundColor: '#F8F9FA',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E9ECEF',
  },

  featureText: {
    color: '#333333',
    fontSize: 14,
    fontWeight: '500',
    flex: 1,
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
    marginBottom: 16,
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

  secondaryActions: {
    width: '100%',
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },

  secondaryButton: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderWidth: 2,
    borderColor: '#E0E0E0',
    alignItems: 'center',
  },

  secondaryButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },

  secondaryText: {
    color: '#333333',
    fontSize: 14,
    fontWeight: '600',
  },

  footerText: {
    color: '#666666',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 20,
  },

  linkText: {
    color: '#1E88E5',
    fontWeight: '600',
  },

  communityStats: {
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
    gap: 20,
    marginTop: 10,
  },

  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },

  statText: {
    color: '#666666',
    fontSize: 12,
    fontWeight: '500',
  },
});