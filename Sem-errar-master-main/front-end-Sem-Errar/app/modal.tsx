import FontAwesome from '@expo/vector-icons/FontAwesome';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import {
  Dimensions,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

const { width } = Dimensions.get('window');

// Tipos explícitos para os ícones
type IconName = 'heart' | 'apple' | 'bar-chart' | 'users' | 'check-circle' | 'flask' | 'book' | 'user-md' | 'arrow-right' | 'user' | 'arrow-left';

interface Metodologia {
  icon: IconName;
  title: string;
  description: string;
}

export default function ModalScreen() {
  const metodologias: Metodologia[] = [
    {
      icon: 'heart',
      title: 'Treino Inteligente',
      description: 'Exercícios baseados em ciência que maximizam resultados minimizando lesões',
    },
    {
      icon: 'apple',
      title: 'Nutrição Personalizada',
      description: 'Planos alimentares adaptados ao seu metabolismo e objetivos',
    },
    {
      icon: 'bar-chart',
      title: 'Monitoramento Contínuo',
      description: 'Acompanhamento diário de métricas com ajustes automáticos',
    },
    {
      icon: 'users',
      title: 'Suporte Comunitário',
      description: 'Comunidade ativa para motivação e troca de experiências',
    },
  ];

  const beneficios = [
    'Perda de peso sustentável',
    'Ganho de massa muscular',
    'Melhora da saúde cardiovascular',
    'Aumento de energia',
    'Melhora do sono',
    'Redução do estresse',
  ];

  const depoimentos = [
    {
      nome: 'Ana Silva',
      resultado: '-12kg em 3 meses',
      texto: 'Finalmente encontrei um método que se adapta à minha rotina!',
    },
    {
      nome: 'Carlos Mendes',
      resultado: '+5kg massa muscular',
      texto: 'Os treinos são desafiadores mas os resultados aparecem rápido!',
    },
    {
      nome: 'Mariana Costa',
      resultado: '-8% gordura corporal',
      texto: 'A dieta foi fácil de seguir e nunca me senti privada de nada.',
    },
  ];

  // Função para voltar
  const handleGoBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/');
    }
  };

  const handleStartNow = () => {
    router.push('/cadastro');
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* BOTÃO VOLTAR NO TOPO */}
      <View style={styles.headerContainer}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={handleGoBack}
          activeOpacity={0.7}
        >
          <FontAwesome name="arrow-left" size={22} color="#1E88E5" />
          <Text style={styles.backButtonText}>Voltar</Text>
        </TouchableOpacity>
      </View>

      {/* CABEÇALHO COM GRADIENTE */}
      <LinearGradient
        colors={['#1E88E5', '#8E44AD']}
        style={styles.header}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
      >
        <Text style={styles.headerTitle}>Desafio Fitness</Text>
        <Text style={styles.headerSubtitle}>Transformando vidas através da ciência do movimento</Text>
      </LinearGradient>

      {/* MISSÃO E VISÃO */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Nossa Missão</Text>
        <Text style={styles.sectionText}>
          Democratizar o acesso a um programa de emagrecimento baseado em evidências científicas, 
          combinando exercícios eficientes com orientação nutricional personalizada.
        </Text>
        
        <View style={styles.divider} />
        
        <Text style={styles.sectionTitle}>Por que somos diferentes?</Text>
        <Text style={styles.sectionText}>
          Não prometemos milagres, mas resultados reais através de um método sustentável 
          que ensina você a manter os resultados para a vida toda.
        </Text>
      </View>

      {/* METODOLOGIA */}
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitleLarge}>Nossa Metodologia</Text>
        <Text style={styles.sectionSubtitle}>
          Baseada em 4 pilares fundamentais para resultados duradouros
        </Text>

        {metodologias.map((item, index) => (
          <View key={index} style={styles.metodologiaCard}>
            <View style={styles.iconContainer}>
              <FontAwesome name={item.icon} size={24} color="#1E88E5" />
            </View>
            <View style={styles.metodologiaContent}>
              <Text style={styles.metodologiaTitle}>{item.title}</Text>
              <Text style={styles.metodologiaDescription}>{item.description}</Text>
            </View>
          </View>
        ))}
      </View>

      {/* BENEFÍCIOS */}
      <LinearGradient
        colors={['rgba(30,136,229,0.1)', 'rgba(142,68,173,0.1)']}
        style={styles.beneficiosContainer}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
      >
        <Text style={styles.sectionTitleLarge}>O que você vai conquistar</Text>
        
        <View style={styles.beneficiosGrid}>
          {beneficios.map((beneficio, index) => (
            <View key={index} style={styles.beneficioItem}>
              <View style={styles.checkIconContainer}>
                <FontAwesome name="check-circle" size={18} color="#27AE60" />
              </View>
              <Text style={styles.beneficioText}>{beneficio}</Text>
            </View>
          ))}
        </View>
      </LinearGradient>

      {/* DEPOIMENTOS */}
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitleLarge}>Histórias reais</Text>
        <Text style={styles.sectionSubtitle}>O que nossos alunos dizem</Text>

        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.depoimentosScroll}
          contentContainerStyle={styles.depoimentosContent}
        >
          {depoimentos.map((depoimento, index) => (
            <LinearGradient
              key={index}
              colors={['#FFFFFF', '#F8F9FA']}
              style={styles.depoimentoCard}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <View style={styles.depoimentoHeader}>
                <View style={styles.avatar}>
                  <FontAwesome name="user" size={24} color="#FFFFFF" />
                </View>
                <View>
                  <Text style={styles.depoimentoNome}>{depoimento.nome}</Text>
                  <Text style={styles.depoimentoResultado}>{depoimento.resultado}</Text>
                </View>
              </View>
              <Text style={styles.depoimentoTexto}>"{depoimento.texto}"</Text>
            </LinearGradient>
          ))}
        </ScrollView>
      </View>

      {/* CIÊNCIA POR TRÁS */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Base Científica</Text>
        <View style={styles.cienciaItem}>
          <View style={[styles.cienciaIconContainer, { backgroundColor: 'rgba(30,136,229,0.1)' }]}>
            <FontAwesome name="flask" size={20} color="#1E88E5" />
          </View>
          <Text style={styles.cienciaText}>
            Protocolos de HIIT com eficácia comprovada para queima de gordura
          </Text>
        </View>
        <View style={styles.cienciaItem}>
          <View style={[styles.cienciaIconContainer, { backgroundColor: 'rgba(30,136,229,0.1)' }]}>
            <FontAwesome name="book" size={20} color="#1E88E5" />
          </View>
          <Text style={styles.cienciaText}>
            Dietas baseadas em déficit calórico inteligente e macrobalanceamento
          </Text>
        </View>
        <View style={styles.cienciaItem}>
          <View style={[styles.cienciaIconContainer, { backgroundColor: 'rgba(30,136,229,0.1)' }]}>
            <FontAwesome name="user-md" size={20} color="#1E88E5" />
          </View>
          <Text style={styles.cienciaText}>
            Acompanhamento por profissionais de educação física e nutrição
          </Text>
        </View>
      </View>

      {/* CTA FINAL */}
      <LinearGradient
        colors={['#1E88E5', '#8E44AD']}
        style={styles.ctaContainer}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
      >
        <Text style={styles.ctaTitle}>Pronto para transformar seu corpo?</Text>
        <Text style={styles.ctaSubtitle}>
          Junte-se a mais de 10.000 pessoas que já alcançaram seus objetivos
        </Text>
        
        <TouchableOpacity 
          style={styles.ctaButton}
          onPress={handleStartNow}
          activeOpacity={0.8}
        >
          <Text style={styles.ctaButtonText}>Começar agora</Text>
          <FontAwesome name="arrow-right" size={16} color="#FFFFFF" style={{ marginLeft: 8 }} />
        </TouchableOpacity>
      </LinearGradient>

      <StatusBar style={Platform.OS === 'ios' ? 'light' : 'auto'} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  // Novo container para o botão de voltar
  headerContainer: {
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingBottom: 10,
    backgroundColor: '#F8F9FA',
  },
  // Estilos do botão de voltar
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    alignSelf: 'flex-start',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E88E5',
    marginLeft: 8,
    fontFamily: 'Inter',
  },
  header: {
    paddingTop: 20,
    paddingBottom: 40,
    paddingHorizontal: 20,
    alignItems: 'center',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: '900',
    color: '#FFFFFF',
    marginBottom: 12,
    textAlign: 'center',
    fontFamily: 'Inter',
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#FFFFFF',
    opacity: 0.95,
    textAlign: 'center',
    maxWidth: '90%',
    lineHeight: 22,
    fontFamily: 'Inter',
  },
  card: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    marginTop: 10,
    padding: 24,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 5,
  },
  sectionContainer: {
    marginTop: 30,
    paddingHorizontal: 20,
  },
  sectionTitleLarge: {
    fontSize: 26,
    fontWeight: '800',
    color: '#1A1A1A',
    marginBottom: 8,
    fontFamily: 'Inter',
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 12,
    fontFamily: 'Inter',
  },
  sectionSubtitle: {
    fontSize: 16,
    color: '#666666',
    marginBottom: 24,
    lineHeight: 22,
    fontFamily: 'Inter',
  },
  sectionText: {
    fontSize: 16,
    color: '#444444',
    lineHeight: 24,
    marginBottom: 16,
    fontFamily: 'Inter',
  },
  divider: {
    height: 1,
    backgroundColor: '#E0E0E0',
    marginVertical: 20,
  },
  metodologiaCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 16,
    marginBottom: 12,
    alignItems: 'flex-start',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 14,
    backgroundColor: 'rgba(30,136,229,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  metodologiaContent: {
    flex: 1,
  },
  metodologiaTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 6,
    fontFamily: 'Inter',
  },
  metodologiaDescription: {
    fontSize: 14,
    color: '#666666',
    lineHeight: 20,
    fontFamily: 'Inter',
  },
  beneficiosContainer: {
    marginTop: 30,
    paddingVertical: 30,
    paddingHorizontal: 20,
    borderRadius: 20,
    marginHorizontal: 20,
  },
  beneficiosGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  beneficioItem: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '48%',
    marginBottom: 14,
    paddingVertical: 8,
  },
  checkIconContainer: {
    marginRight: 10,
  },
  beneficioText: {
    fontSize: 15,
    color: '#333333',
    fontWeight: '500',
    flex: 1,
    fontFamily: 'Inter',
  },
  depoimentosScroll: {
    marginTop: 20,
  },
  depoimentosContent: {
    paddingRight: 20,
    paddingBottom: 10,
  },
  depoimentoCard: {
    width: width * 0.8,
    borderRadius: 20,
    padding: 24,
    marginRight: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
    borderWidth: 1,
    borderColor: '#E8E8E8',
  },
  depoimentoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#1E88E5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
    shadowColor: '#1E88E5',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 4,
  },
  depoimentoNome: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A1A1A',
    fontFamily: 'Inter',
  },
  depoimentoResultado: {
    fontSize: 14,
    color: '#27AE60',
    fontWeight: '600',
    marginTop: 4,
    fontFamily: 'Inter',
  },
  depoimentoTexto: {
    fontSize: 15,
    color: '#555555',
    fontStyle: 'italic',
    lineHeight: 22,
    fontFamily: 'Inter',
  },
  cienciaItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 18,
  },
  cienciaIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    marginTop: 2,
  },
  cienciaText: {
    fontSize: 15,
    color: '#444444',
    flex: 1,
    lineHeight: 22,
    fontFamily: 'Inter',
  },
  ctaContainer: {
    marginTop: 40,
    marginHorizontal: 20,
    padding: 32,
    borderRadius: 24,
    alignItems: 'center',
    marginBottom: 40,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
  },
  ctaTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 8,
    fontFamily: 'Inter',
  },
  ctaSubtitle: {
    fontSize: 16,
    color: '#FFFFFF',
    opacity: 0.95,
    textAlign: 'center',
    marginBottom: 28,
    maxWidth: '90%',
    lineHeight: 22,
    fontFamily: 'Inter',
  },
  ctaButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#27AE60',
    paddingHorizontal: 36,
    paddingVertical: 18,
    borderRadius: 16,
    shadowColor: '#27AE60',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 6,
  },
  ctaButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    fontFamily: 'Inter',
  },
});