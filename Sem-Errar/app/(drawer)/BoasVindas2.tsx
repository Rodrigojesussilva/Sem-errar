import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
export default function BoasVindas2() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push('/BoasVindas3');
    }, 2000);

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
          <Text style={styles.welcomeTitle}>Comunidade Global</Text>
          <Text style={styles.subtitle}>
            Junte-se a milhões de usuários satisfeitos
          </Text>
          
          <View style={styles.statsContainer}>
            <View style={styles.statCard}>
              <Text style={styles.bigNumber}>85 milhões</Text>
              <View style={styles.statLabel}>
                <FontAwesome name="users" size={16} color="#1E88E5" />
                <Text style={styles.label}>de usuários satisfeitos</Text>
              </View>
            </View>
            
            <View style={styles.divider} />
            
            <View style={styles.statCard}>
              <Text style={styles.bigNumber}>20 milhões</Text>
              <View style={styles.statLabel}>
                <FontAwesome name="calendar-check-o" size={16} color="#43A047" />
                <Text style={styles.label}>de registros realizados</Text>
              </View>
            </View>
          </View>
          
          <View style={styles.featuresContainer}>
            <View style={styles.featureItem}>
              <FontAwesome name="check-circle" size={18} color="#EF6C00" />
              <Text style={styles.featureText}>Comunidade ativa e engajada</Text>
            </View>
            
            <View style={styles.featureItem}>
              <FontAwesome name="check-circle" size={18} color="#8E44AD" />
              <Text style={styles.featureText}>Resultados comprovados</Text>
            </View>
          </View>
          
          <View style={styles.communityStats}>
            <View style={styles.statItem}>
              <FontAwesome name="line-chart" size={14} color="#666666" />
              <Text style={styles.statText}>Crescimento contínuo</Text>
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
    marginBottom: 8,
    lineHeight: 30,
  },

  subtitle: {
    color: '#666666',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 22,
  },

  statsContainer: {
    width: '100%',
    marginBottom: 24,
  },

  statCard: {
    alignItems: 'center',
    marginVertical: 16,
  },

  bigNumber: {
    color: '#000000',
    fontSize: 40,
    fontWeight: '700',
    marginBottom: 6,
  },

  statLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },

  label: {
    color: '#666666',
    fontSize: 16,
    fontWeight: '500',
  },

  divider: {
    height: 1,
    width: '100%',
    backgroundColor: '#E0E0E0',
    marginVertical: 8,
  },

  featuresContainer: {
    width: '100%',
    gap: 10,
    marginBottom: 20,
  },

  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 10,
    paddingHorizontal: 14,
    backgroundColor: '#F8F9FA',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E9ECEF',
  },

  featureText: {
    color: '#333333',
    fontSize: 14,
    fontWeight: '500',
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