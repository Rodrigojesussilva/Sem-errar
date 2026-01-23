import { Text } from '@/components/Themed';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Link } from 'expo-router';
import {
  Dimensions,
  Image,
  Pressable,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  View,
} from 'react-native';

export default function HomeScreen() {
  const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
  
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
            maxHeight: screenHeight * 0.75, // Limita a altura máxima
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
            {/* TEXTO COMPLEMENTAR */}
            <Text style={styles.complementaryTitle}>Transforme objetivos em conquistas</Text>
            
            {/* FEATURES SIMPLIFICADAS */}
            <View style={styles.featuresContainer}>
              <View style={styles.featureRow}>
                <View style={styles.featureItem}>
                  <FontAwesome name="check-circle" size={18} color="#1E88E5" />
                  <Text style={styles.featureText}>Planos personalizados</Text>
                </View>
                
                <View style={styles.featureItem}>
                  <FontAwesome name="bar-chart" size={18} color="#1E88E5" />
                  <Text style={styles.featureText}>Acompanhamento</Text>
                </View>
              </View>
              
              <View style={styles.featureRow}>
                <View style={styles.featureItem}>
                  <FontAwesome name="users" size={18} color="#1E88E5" />
                  <Text style={styles.featureText}>Comunidade</Text>
                </View>
                
                <View style={styles.featureItem}>
                  <FontAwesome name="trophy" size={18} color="#1E88E5" />
                  <Text style={styles.featureText}>Desafios</Text>
                </View>
              </View>
            </View>
            
            <View style={styles.divider} />
            
            <Text style={styles.sectionTitle}>Comece agora</Text>
            
            {/* BOTÕES */}
            <View style={styles.buttons}>
              <Link href="/login" asChild>
                <Pressable style={styles.primaryButton}>
                  <Text style={styles.primaryText}>Entrar</Text>
                </Pressable>
              </Link>

              <Link href="/cadastro" asChild>
                <Pressable style={styles.secondaryButton}>
                  <Text style={styles.secondaryText}>Criar conta</Text>
                </Pressable>
              </Link>
            </View>
            
            <Text style={styles.footerText}>
              Já tem uma conta? <Link href="/login" asChild><Text style={styles.linkText}>Entre aqui</Text></Link>
            </Text>
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
    height: 180, // Reduzida
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
    paddingVertical: 20,
    alignItems: 'center',
  },

  complementaryTitle: {
    color: '#000000',
    fontSize: 20,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 26,
  },

  featuresContainer: {
    width: '100%',
    marginBottom: 20,
    gap: 8,
  },

  featureRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },

  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 6,
    width: '48%', // Cada item ocupa quase metade da linha
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
    marginVertical: 15,
  },

  sectionTitle: {
    color: '#000000',
    fontSize: 18,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 20,
  },

  buttons: {
    width: '100%',
    gap: 12,
    marginBottom: 15,
  },

  primaryButton: {
    height: 52,
    borderRadius: 14,
    backgroundColor: '#1E88E5',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },

  primaryText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
  },

  secondaryButton: {
    height: 52,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: '#1E88E5',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },

  secondaryText: {
    color: '#1E88E5',
    fontSize: 16,
    fontWeight: '600',
  },

  footerText: {
    color: '#666666',
    fontSize: 13,
    textAlign: 'center',
    marginTop: 5,
  },

  linkText: {
    color: '#1E88E5',
    fontWeight: '600',
  },
});