import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useRouter } from 'expo-router';
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

export default function ContextoBFScreen() {
  const router = useRouter();

  const handleProximo = () => {
    router.push('/QuadroCalcularBFScreen');
  };

  const handleVoltar = () => {
    router.push('/RegistrarCardioScreen');
  };

  return (
    <View style={styles.background}>
      <View style={styles.headerContainer}>
        <Pressable style={styles.backButton} onPress={handleVoltar}>
          <FontAwesome name="arrow-left" size={20} color="#1E88E5" />
          <Text style={styles.backButtonText}>Voltar</Text>
        </Pressable>
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.mainContainer}>
          <View style={styles.imageContainer}>
            <Image source={require('@/assets/images/logo2.png')} style={styles.topImage} resizeMode="cover" />
          </View>
          
          <View style={styles.content}>
            <View style={styles.headerSection}>
              <Text style={styles.sectionTitle}>📊 Última etapa: composição corporal</Text>
            </View>
            
            <View style={styles.iconContainer}>
              <FontAwesome name="calculator" size={60} color="#1E88E5" />
            </View>
            
            <Text style={styles.welcomeTitle}>
              Vamos calcular seu percentual de gordura para deixar seu plano mais preciso.
            </Text>
            
            <View style={styles.infoBox}>
              <FontAwesome name="clock-o" size={20} color="#4CAF50" />
              <Text style={styles.infoText}>
                Leva menos de 1 minuto.
              </Text>
            </View>
            
            <View style={styles.detailsBox}>
              <View style={styles.detailItem}>
                <FontAwesome name="check-circle" size={20} color="#4CAF50" />
                <Text style={styles.detailText}>Mais personalização</Text>
              </View>
              <View style={styles.detailItem}>
                <FontAwesome name="check-circle" size={20} color="#4CAF50" />
                <Text style={styles.detailText}>Acompanhamento preciso</Text>
              </View>
              <View style={styles.detailItem}>
                <FontAwesome name="check-circle" size={20} color="#4CAF50" />
                <Text style={styles.detailText}>Metas realistas</Text>
              </View>
            </View>
            
            <View style={styles.divider} />
            
            <Pressable style={styles.primaryButton} onPress={handleProximo}>
              <View style={styles.buttonContent}>
                <FontAwesome name="calculator" size={22} color="#FFFFFF" />
                <Text style={styles.primaryText}>Continuar</Text>
              </View>
              <Text style={styles.buttonSubtitle}>
                Calcular meu percentual de gordura
              </Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  background: { flex: 1, backgroundColor: '#FFFFFF' },
  headerContainer: { backgroundColor: '#FFFFFF', borderBottomWidth: 1, borderBottomColor: '#E0E0E0', zIndex: 10 },
  backButton: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 16 },
  backButtonText: { color: '#1E88E5', fontSize: 16, fontWeight: '600', marginLeft: 8 },
  scrollView: { flex: 1 },
  scrollContent: { flexGrow: 1, paddingTop: 15, paddingBottom: 30, paddingHorizontal: 5 },
  mainContainer: { backgroundColor: '#FFFFFF', borderRadius: 20, overflow: 'hidden', borderWidth: 1, borderColor: '#E0E0E0', shadowColor: '#000', shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.1, shadowRadius: 8, elevation: 5, marginHorizontal: 15, maxWidth: 400, alignSelf: 'center', width: '92%', marginTop: 5 },
  imageContainer: { height: 170, width: '100%', overflow: 'hidden', backgroundColor: '#F5F5F5' },
  topImage: { width: '100%', height: '100%', resizeMode: 'cover' },
  content: { paddingHorizontal: 24, paddingTop: 28, paddingBottom: 28, alignItems: 'center' },
  headerSection: { alignItems: 'center', marginBottom: 20 },
  sectionTitle: { color: '#666666', fontSize: 14, fontWeight: '600', textAlign: 'center', marginBottom: 12, backgroundColor: '#F0F9FF', paddingHorizontal: 16, paddingVertical: 6, borderRadius: 20, borderWidth: 1, borderColor: '#1E88E5' },
  iconContainer: { width: 100, height: 100, borderRadius: 50, backgroundColor: '#F0F9FF', justifyContent: 'center', alignItems: 'center', marginBottom: 20, borderWidth: 2, borderColor: '#1E88E5' },
  welcomeTitle: { color: '#000000', fontSize: 24, fontWeight: '700', textAlign: 'center', marginBottom: 20, lineHeight: 30 },
  infoBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#E8F5E9', padding: 16, borderRadius: 12, borderWidth: 1, borderColor: '#C8E6C9', gap: 12, marginBottom: 20, width: '100%' },
  infoText: { flex: 1, color: '#2E7D32', fontSize: 16, fontWeight: '600' },
  detailsBox: { width: '100%', backgroundColor: '#F8F9FA', padding: 20, borderRadius: 12, borderWidth: 1, borderColor: '#E0E0E0', marginBottom: 20 },
  detailItem: { flexDirection: 'row', alignItems: 'center', marginBottom: 12, gap: 12 },
  detailText: { fontSize: 16, color: '#333', flex: 1 },
  divider: { height: 1, width: '100%', backgroundColor: '#E0E0E0', marginVertical: 22 },
  primaryButton: { width: '100%', backgroundColor: '#1E88E5', borderRadius: 18, paddingVertical: 22, paddingHorizontal: 26, alignItems: 'center', shadowColor: '#1E88E5', shadowOffset: { width: 0, height: 5 }, shadowOpacity: 0.35, shadowRadius: 10, elevation: 8, marginBottom: 12 },
  buttonContent: { flexDirection: 'row', alignItems: 'center', gap: 14, marginBottom: 8 },
  primaryText: { color: '#FFFFFF', fontSize: 21, fontWeight: '700' },
  buttonSubtitle: { color: 'rgba(255, 255, 255, 0.9)', fontSize: 15, fontWeight: '500', textAlign: 'center' },
});