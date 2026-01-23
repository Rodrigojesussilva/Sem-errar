
import { Text, View } from '@/components/Themed';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { ScrollView, StyleSheet, TouchableOpacity } from 'react-native';

export default function PrivacidadeScreen() {
  const router = useRouter();

  return (
    <ScrollView style={styles.container}>
      <LinearGradient
        colors={['#1E88E5', '#8E44AD']}
        style={styles.header}
      >
        <Text style={styles.title}>Política de Privacidade</Text>
        <Text style={styles.subtitle}>Última atualização: {new Date().toLocaleDateString('pt-BR')}</Text>
      </LinearGradient>

      <View style={styles.content}>
        <Text style={styles.sectionTitle}>1. Coleta de Informações</Text>
        <Text style={styles.text}>
          Coletamos informações que você nos fornece diretamente, como nome, e-mail, dados biométricos e histórico de exercícios.
        </Text>

        <Text style={styles.sectionTitle}>2. Uso das Informações</Text>
        <Text style={styles.text}>
          Utilizamos seus dados para personalizar seu plano de treino, calcular métricas de saúde e melhorar sua experiência no aplicativo.
        </Text>

        <Text style={styles.sectionTitle}>3. Compartilhamento de Dados</Text>
        <Text style={styles.text}>
          Não vendemos ou compartilhamos seus dados pessoais com terceiros, exceto quando exigido por lei ou com seu consentimento explícito.
        </Text>

        <Text style={styles.sectionTitle}>4. Dados de Saúde</Text>
        <Text style={styles.text}>
          Seus dados de saúde são tratados com confidencialidade máxima e são essenciais para fornecer recomendações personalizadas de fitness.
        </Text>

        <Text style={styles.sectionTitle}>5. Segurança</Text>
        <Text style={styles.text}>
          Implementamos medidas de segurança para proteger seus dados contra acesso não autorizado, alteração ou destruição.
        </Text>

        <Text style={styles.sectionTitle}>6. Seus Direitos</Text>
        <Text style={styles.text}>
          Você tem o direito de acessar, corrigir ou excluir seus dados a qualquer momento através das configurações do aplicativo.
        </Text>

        <Text style={styles.sectionTitle}>7. Contato</Text>
        <Text style={styles.text}>
          Para questões sobre privacidade, entre em contato: privacidade@desafiofitness.com
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