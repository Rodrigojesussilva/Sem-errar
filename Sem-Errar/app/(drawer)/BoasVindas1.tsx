import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
export default function BoasVindas1() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push('/BoasVindas2');
    }, 2000); // Aumentei para 2 segundos para dar tempo de ver

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <View style={styles.background}>
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
        
        {/* CONTEÚDO ABAIXO DA IMAGEM */}
        <View style={styles.content}>
          <Text style={styles.welcomeTitle}>Avaliação Premium</Text>
          
          <View style={styles.ratingContainer}>
            <Text style={styles.stars}>★★★★★</Text>
            <Text style={styles.rating}>4,6</Text>
            <Text style={styles.subtitle}>Entre os top avaliados</Text>
          </View>
          
          <View style={styles.featureItem}>
            <FontAwesome name="check-circle" size={20} color="#2ED1A2" />
            <Text style={styles.featureText}>
              Conforme milhões de avaliações em mais de 150 países
            </Text>
          </View>
          
          <View style={styles.communityStats}>
            <View style={styles.statItem}>
              <FontAwesome name="globe" size={14} color="#666666" />
              <Text style={styles.statText}>+150 países</Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
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
    marginBottom: 20,
    lineHeight: 30,
  },

  ratingContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },

  stars: {
    color: '#2ED1A2',
    fontSize: 26,
    marginBottom: 10,
    letterSpacing: 4,
  },

  rating: {
    color: '#000000',
    fontSize: 52,
    fontWeight: '700',
    marginBottom: 6,
  },

  subtitle: {
    color: '#666666',
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 22,
  },

  featureItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    width: '100%',
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E9ECEF',
    marginBottom: 20,
  },

  featureText: {
    color: '#333333',
    fontSize: 14,
    fontWeight: '500',
    flex: 1,
    lineHeight: 20,
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