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
    // Vai sempre para a tela de objetivo, independente de estar logado ou não
    router.push('/ObjetivoScreen');
  };

  const handleJaTenhoConta = () => {
    router.push('/(drawer)/login');
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
            
            {/* BOTÃO PRINCIPAL - COMEÇAR DESAFIO */}
            <Pressable 
              style={styles.primaryButton}
              onPress={handleIniciarDesafio}
            >
              <View style={styles.buttonContent}>
                <FontAwesome name="bolt" size={22} color="#FFFFFF" />
                <Text style={styles.primaryText}>Começar Desafio</Text>
              </View>
              <Text style={styles.buttonSubtitle}>
                Defina seu objetivo e inicie sua jornada fitness agora
              </Text>
            </Pressable>
            
            {/* BOTÃO JÁ TENHO UMA CONTA */}
            <Pressable 
              style={styles.secondaryButton}
              onPress={handleJaTenhoConta}
            >
              <View style={styles.secondaryButtonContent}>
                <FontAwesome name="user" size={18} color="#1E88E5" />
                <Text style={styles.secondaryButtonText}>Já tenho uma conta</Text>
              </View>
            </Pressable>
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
    justifyContent: 'center',
  },

  topBar: {
    paddingTop: 10,
    paddingHorizontal: 20,
    alignItems: 'flex-end',
    marginBottom: 20,
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
    paddingTop: 25,
    paddingBottom: 25,
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
    marginBottom: 12,
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

  secondaryButton: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingVertical: 18,
    paddingHorizontal: 16,
    borderWidth: 2,
    borderColor: '#1E88E5',
    alignItems: 'center',
  },

  secondaryButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },

  secondaryButtonText: {
    color: '#1E88E5',
    fontSize: 16,
    fontWeight: '600',
  },
});