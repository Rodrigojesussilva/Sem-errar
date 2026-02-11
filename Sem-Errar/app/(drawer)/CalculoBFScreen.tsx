import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Image, ScrollView, StyleSheet, Text, View } from 'react-native';

export default function CalculoBFScreen() {
  const router = useRouter();
  const [progresso, setProgresso] = useState(0);

  useEffect(() => {
    // Simular cálculo
    const timer = setInterval(() => {
      setProgresso((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          // Navegar para tela final após 1 segundo
          setTimeout(() => {
            router.push('/PescocoScreen');
          }, 1000);
          return 100;
        }
        return prev + 10;
      });
    }, 200);

    return () => clearInterval(timer);
  }, []);

  return (
    <View style={styles.background}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.mainContainer}>
          <View style={styles.imageContainer}>
            <Image source={require('@/assets/images/logo2.png')} style={styles.topImage} resizeMode="cover" />
          </View>
          
          <View style={styles.content}>
            <View style={styles.headerSection}>
              <Text style={styles.sectionTitle}>📊 Cálculo em andamento</Text>
            </View>
            
            <View style={styles.calculationContainer}>
              <View style={styles.calculationIcon}>
                <FontAwesome name="calculator" size={80} color="#1E88E5" />
              </View>
              
              <Text style={styles.welcomeTitle}>Calculando seu percentual de gordura...</Text>
              
              <View style={styles.progressContainer}>
                <View style={styles.progressBar}>
                  <View style={[styles.progressFill, { width: `${progresso}%` }]} />
                </View>
                <Text style={styles.progressText}>{progresso}%</Text>
              </View>
              
              <View style={styles.stepsContainer}>
                <View style={styles.step}>
                  <FontAwesome name="check-circle" size={20} color="#4CAF50" />
                  <Text style={styles.stepText}>Medidas coletadas</Text>
                </View>
                <View style={styles.step}>
                  <FontAwesome name="check-circle" size={20} color={progresso >= 50 ? "#4CAF50" : "#CCCCCC"} />
                  <Text style={[styles.stepText, progresso >= 50 && styles.stepTextActive]}>Processando dados</Text>
                </View>
                <View style={styles.step}>
                  <FontAwesome name="check-circle" size={20} color={progresso >= 100 ? "#4CAF50" : "#CCCCCC"} />
                  <Text style={[styles.stepText, progresso >= 100 && styles.stepTextActive]}>Cálculo concluído</Text>
                </View>
              </View>
              
              <View style={styles.infoBox}>
                <FontAwesome name="info-circle" size={20} color="#1E88E5" />
                <Text style={styles.infoText}>
                  Isso leva apenas alguns segundos...
                </Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  background: { flex: 1, backgroundColor: '#FFFFFF' },
  scrollView: { flex: 1 },
  scrollContent: { flexGrow: 1, paddingTop: 40, paddingBottom: 30, paddingHorizontal: 5 },
  mainContainer: { backgroundColor: '#FFFFFF', borderRadius: 20, overflow: 'hidden', borderWidth: 1, borderColor: '#E0E0E0', shadowColor: '#000', shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.1, shadowRadius: 8, elevation: 5, marginHorizontal: 15, maxWidth: 400, alignSelf: 'center', width: '92%' },
  imageContainer: { height: 170, width: '100%', overflow: 'hidden', backgroundColor: '#F5F5F5' },
  topImage: { width: '100%', height: '100%', resizeMode: 'cover' },
  content: { paddingHorizontal: 24, paddingTop: 28, paddingBottom: 28, alignItems: 'center' },
  headerSection: { alignItems: 'center', marginBottom: 20 },
  sectionTitle: { color: '#666666', fontSize: 14, fontWeight: '600', textAlign: 'center', marginBottom: 12, backgroundColor: '#F0F9FF', paddingHorizontal: 16, paddingVertical: 6, borderRadius: 20, borderWidth: 1, borderColor: '#1E88E5' },
  calculationContainer: { width: '100%', alignItems: 'center' },
  calculationIcon: { width: 120, height: 120, borderRadius: 60, backgroundColor: '#F0F9FF', justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: '#1E88E5', marginBottom: 25 },
  welcomeTitle: { color: '#000000', fontSize: 24, fontWeight: '700', textAlign: 'center', marginBottom: 30, lineHeight: 30 },
  progressContainer: { width: '100%', marginBottom: 30 },
  progressBar: { height: 10, backgroundColor: '#E0E0E0', borderRadius: 5, overflow: 'hidden', marginBottom: 10 },
  progressFill: { height: '100%', backgroundColor: '#4CAF50', borderRadius: 5 },
  progressText: { textAlign: 'center', fontSize: 18, fontWeight: '600', color: '#333' },
  stepsContainer: { width: '100%', marginBottom: 25 },
  step: { flexDirection: 'row', alignItems: 'center', marginBottom: 15, gap: 12 },
  stepText: { fontSize: 16, color: '#666', flex: 1 },
  stepTextActive: { color: '#333', fontWeight: '500' },
  infoBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F0F9FF', padding: 16, borderRadius: 12, borderWidth: 1, borderColor: '#BBDEFB', gap: 12, width: '100%' },
  infoText: { flex: 1, color: '#1E88E5', fontSize: 16, lineHeight: 22 },
});