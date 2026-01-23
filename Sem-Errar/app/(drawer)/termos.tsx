import { Text, View } from '@/components/Themed';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { ScrollView, StyleSheet, TouchableOpacity } from 'react-native';

export default function TermosScreen() {
  const router = useRouter();

  return (
    <ScrollView style={styles.container}>
      <LinearGradient
        colors={['#1E88E5', '#8E44AD']}
        style={styles.header}
      >
        <Text style={styles.title}>Termos de Uso</Text>
        <Text style={styles.subtitle}>Última atualização: {new Date().toLocaleDateString('pt-BR')}</Text>
      </LinearGradient>

      <View style={styles.content}>
        <Text style={styles.sectionTitle}>1. Aceitação dos Termos</Text>
        <Text style={styles.text}>
          Ao acessar e usar o aplicativo Desafio Fitness, você concorda em cumprir e ficar vinculado aos seguintes Termos de Uso.
        </Text>

        <Text style={styles.sectionTitle}>2. Descrição do Serviço</Text>
        <Text style={styles.text}>
          O Desafio Fitness é um aplicativo que fornece planos de treino personalizados, acompanhamento de métricas de saúde e desafios fitness.
        </Text>

        <Text style={styles.sectionTitle}>3. Registro e Conta</Text>
        <Text style={styles.text}>
          Você é responsável por manter a confidencialidade de sua conta e senha. Todas as atividades realizadas em sua conta são de sua responsabilidade.
        </Text>

        <Text style={styles.sectionTitle}>4. Dados de Saúde</Text>
        <Text style={styles.text}>
          As informações de saúde fornecidas são usadas apenas para personalizar seu plano de treino e não são compartilhadas com terceiros sem seu consentimento.
        </Text>

        <Text style={styles.sectionTitle}>5. Limitação de Responsabilidade</Text>
        <Text style={styles.text}>
          O aplicativo fornece recomendações gerais de fitness. Consulte um profissional de saúde antes de iniciar qualquer programa de exercícios.
        </Text>

        <Text style={styles.sectionTitle}>6. Modificações</Text>
        <Text style={styles.text}>
          Reservamo-nos o direito de modificar estes termos a qualquer momento. Alterações significativas serão comunicadas aos usuários.
        </Text>

        <TouchableOpacity
          style={styles.button}
          onPress={() => router.back()}
        >
          <Text style={styles.buttonText}>Voltar</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 40,
    paddingTop: 60,
    alignItems: 'center',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
  },
  content: {
    padding: 20,
    paddingTop: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 20,
    marginBottom: 10,
  },
  text: {
    fontSize: 15,
    color: '#666',
    lineHeight: 22,
    marginBottom: 15,
  },
  button: {
    backgroundColor: '#1E88E5',
    height: 56,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 30,
    marginBottom: 40,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});