import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';

export default function BoasVindas3() {
  const router = useRouter();

useEffect(() => {
  const timer = setTimeout(() => {
    router.replace('/'); // Tenta a raiz
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
          <Text style={styles.welcomeTitle}>Faça cada dia valer a pena!</Text>
          <Text style={styles.subtitle}>
            Sua jornada rumo a uma vida mais saudável começa agora
          </Text>
          
          <View style={styles.featuresContainer}>
            <View style={styles.featureRow}>
              <View style={styles.featureItem}>
                <FontAwesome name="heartbeat" size={20} color="#43A047" />
                <Text style={styles.featureText}>Hábitos saudáveis</Text>
              </View>
              
              <View style={styles.featureItem}>
                <FontAwesome name="bar-chart" size={20} color="#1E88E5" />
                <Text style={styles.featureText}>Acompanhe sua evolução</Text>
              </View>
            </View>
            
            <View style={styles.featureRow}>
              <View style={styles.featureItem}>
                <FontAwesome name="bullseye" size={20} color="#EF6C00" />
                <Text style={styles.featureText}>Mantenha o foco</Text>
              </View>
              
              <View style={styles.featureItem}>
                <FontAwesome name="trophy" size={20} color="#8E44AD" />
                <Text style={styles.featureText}>Alcance suas metas</Text>
              </View>
            </View>
          </View>
          
          <View style={styles.divider} />
          
          <View style={styles.ctaContainer}>
            <Text style={styles.ctaTitle}>Pronto para começar?</Text>
            <View style={styles.ctaFeature}>
              <FontAwesome name="check-circle" size={18} color="#2ED1A2" />
              <Text style={styles.ctaText}>
                Em instantes você terá acesso a todos os recursos
              </Text>
            </View>
          </View>
          
          <View style={styles.communityStats}>
            <View style={styles.statItem}>
              <FontAwesome name="rocket" size={14} color="#666666" />
              <Text style={styles.statText}>Comece agora mesmo</Text>
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
    marginBottom: 12,
    lineHeight: 30,
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

  ctaContainer: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 20,
  },

  ctaTitle: {
    color: '#000000',
    fontSize: 18,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 12,
  },

  ctaFeature: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    paddingVertical: 10,
    paddingHorizontal: 14,
    backgroundColor: '#F0F9FF',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#B3E0FF',
    width: '100%',
  },

  ctaText: {
    color: '#0066CC',
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