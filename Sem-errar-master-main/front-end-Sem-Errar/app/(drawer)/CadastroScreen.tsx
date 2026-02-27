import FontAwesome from '@expo/vector-icons/FontAwesome';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';

// ============ INTERFACES E TIPOS ============
interface ObjetivoCompleto {
  id: string;
  title: string;
  description?: string;
  icon?: string;
  color?: string;
}

interface UserData {
  objetivo: string;
  objetivoCompleto: ObjetivoCompleto | null;
  sexo: string;
  idade: number;
  faixaIdade: string | null;
  alturaUnidade: string | null;
  altura: number | null;
  alturaFt: number | null;
  alturaIn: number | null;
  alturaCm: number;
  pesoUnidade: string | null;
  pesoKg: number | null;
  pesoLb: number | null;
  pesoEmKg: number;
  frequenciaTreino: string;
  nivelAtividade: number | null;
  frequenciaTreinoDescricao: string | null;
  treinaAtualmente: boolean;
  querLembretesAgua: boolean;
  coposAguaDia: number;
  frequenciaCardio: string | null;
  frequenciaCardioDescricao: string | null;
  pescocoCm: number;
  cinturaCm: number;
  quadrilCm: number | null;
}

export default function CadastroScreen() {
  const router = useRouter();
  const { height } = Dimensions.get('window');

  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [confirmarEmail, setConfirmarEmail] = useState('');
  const [idade, setIdade] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');

  const [loading, setLoading] = useState(false);
  const [carregandoDados, setCarregandoDados] = useState(true);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [feedback, setFeedback] = useState({
    visible: false,
    title: '',
    message: '',
    success: false,
  });

  const nomeRef = useRef<TextInput>(null);
  const emailRef = useRef<TextInput>(null);
  const confirmarEmailRef = useRef<TextInput>(null);
  const idadeRef = useRef<TextInput>(null);
  const senhaRef = useRef<TextInput>(null);
  const confirmarSenhaRef = useRef<TextInput>(null);

  // Carregar dados do AsyncStorage ao iniciar
  useEffect(() => {
    console.log('🔄 Componente montado - iniciando carregamento...');
    carregarDadosStorage();
  }, []);

  const carregarDadosStorage = async () => {
    try {
      setCarregandoDados(true);
      
      console.log('🔍 ===== INICIANDO DEBUG DO STORAGE =====');
      
      // Listar todas as chaves no storage
      const todasChaves = await AsyncStorage.getAllKeys();
      console.log('📋 Todas as chaves no storage:', todasChaves);
      
      // Verificar cada chave individualmente
      for (const chave of todasChaves) {
        const valor = await AsyncStorage.getItem(chave);
        console.log(`🔑 ${chave}:`, valor ? `${valor.substring(0, 100)}...` : 'null');
      }
      
      // Tentar diferentes possíveis nomes de chave
      const possiveisChaves = [
        '@userDataCompleto',
        'userDataCompleto',
        '@userData',
        'userData',
        '@dadosUsuario',
        'dadosUsuario'
      ];
      
      let dadosEncontrados = null;
      let chaveEncontrada = '';
      
      for (const chave of possiveisChaves) {
        console.log(`🔎 Procurando na chave: ${chave}`);
        const valor = await AsyncStorage.getItem(chave);
        if (valor) {
          console.log(`✅ Dados encontrados na chave: ${chave}`);
          console.log('📦 Conteúdo bruto:', valor);
          try {
            dadosEncontrados = JSON.parse(valor);
            chaveEncontrada = chave;
            console.log('📦 Conteúdo parseado:', dadosEncontrados);
            break;
          } catch (e) {
            console.log(`❌ Erro ao fazer parse da chave ${chave}:`, e);
          }
        } else {
          console.log(`❌ Nenhum dado na chave: ${chave}`);
        }
      }
      
      if (dadosEncontrados) {
        console.log('✅ userData carregado com sucesso!');
        console.log('📊 Dados completos:', JSON.stringify(dadosEncontrados, null, 2));
        console.log('📋 Campos disponíveis:', Object.keys(dadosEncontrados));
        
        setUserData(dadosEncontrados);
        
        // Se tiver idade no userData, preencher o campo
        if (dadosEncontrados.idade) {
          console.log('📅 Idade encontrada no storage:', dadosEncontrados.idade);
          setIdade(dadosEncontrados.idade.toString());
        }
        
        // Verificar campos específicos
        console.log('✅ objetivo:', dadosEncontrados.objetivo);
        console.log('✅ sexo:', dadosEncontrados.sexo);
        console.log('✅ alturaCm:', dadosEncontrados.alturaCm);
        console.log('✅ pesoEmKg:', dadosEncontrados.pesoEmKg);
        console.log('✅ frequenciaTreino:', dadosEncontrados.frequenciaTreino);
        console.log('✅ pescocoCm:', dadosEncontrados.pescocoCm);
        console.log('✅ cinturaCm:', dadosEncontrados.cinturaCm);
        
      } else {
        console.log('⚠️ Nenhum dado do onboarding encontrado no storage');
        
        // Verificar dados individuais como fallback
        const objetivo = await AsyncStorage.getItem('@objetivo');
        const sexo = await AsyncStorage.getItem('@sexo');
        const alturaCm = await AsyncStorage.getItem('@alturaCm');
        const pesoEmKg = await AsyncStorage.getItem('@pesoEmKg');
        
        console.log('📊 Dados individuais encontrados:');
        console.log('  objetivo:', objetivo);
        console.log('  sexo:', sexo);
        console.log('  alturaCm:', alturaCm);
        console.log('  pesoEmKg:', pesoEmKg);
      }
      
      console.log('🔍 ===== FIM DO DEBUG DO STORAGE =====');

    } catch (error) {
      console.error('❌ Erro ao carregar dados do storage:', error);
    } finally {
      setCarregandoDados(false);
      console.log('✅ Carregamento finalizado');
    }
  };

  const validarFormulario = () => {
    // Verificar campos obrigatórios
    if (!nome || !email || !confirmarEmail || !idade || !senha || !confirmarSenha) {
      setFeedback({
        visible: true,
        title: 'Campos obrigatórios',
        message: 'Preencha todos os campos.',
        success: false,
      });
      return false;
    }

    // Validar email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setFeedback({
        visible: true,
        title: 'E-mail inválido',
        message: 'Digite um e-mail válido.',
        success: false,
      });
      return false;
    }

    // Verificar se emails coincidem
    if (email !== confirmarEmail) {
      setFeedback({
        visible: true,
        title: 'E-mails diferentes',
        message: 'Os e-mails não conferem.',
        success: false,
      });
      return false;
    }

    // Validar idade
    const idadeNum = parseInt(idade);
    if (isNaN(idadeNum) || idadeNum < 14 || idadeNum > 120) {
      setFeedback({
        visible: true,
        title: 'Idade inválida',
        message: 'A idade deve ser entre 14 e 120 anos.',
        success: false,
      });
      return false;
    }

    // Validar senha
    if (senha.length < 6) {
      setFeedback({
        visible: true,
        title: 'Senha muito curta',
        message: 'A senha deve ter no mínimo 6 caracteres.',
        success: false,
      });
      return false;
    }

    // Verificar se senhas coincidem
    if (senha !== confirmarSenha) {
      setFeedback({
        visible: true,
        title: 'Senhas diferentes',
        message: 'As senhas não conferem.',
        success: false,
      });
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    Keyboard.dismiss();

    if (!validarFormulario()) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      return;
    }

    try {
      setLoading(true);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

      console.log('\n🚀 ===== INICIANDO ENVIO DO CADASTRO =====');
      
      // DEBUG: Verificar userData
      console.log('🔍 Verificando userData antes do envio:');
      console.log('  userData existe?', userData !== null);
      
      if (userData) {
        console.log('  userData tipo:', typeof userData);
        console.log('  userData é array?', Array.isArray(userData));
        console.log('  Campos no userData:', Object.keys(userData));
      }
      
      // Tentar carregar do storage novamente se userData estiver null
      let dadosOnboarding = userData;
      if (!dadosOnboarding) {
        console.log('⚠️ userData está null, tentando carregar do storage novamente...');
        
        // Tentar diferentes chaves
        const chavesParaTentar = ['@userDataCompleto', 'userDataCompleto', '@userData', 'userData'];
        
        for (const chave of chavesParaTentar) {
          console.log(`🔎 Tentando chave: ${chave}`);
          const dadosStorage = await AsyncStorage.getItem(chave);
          
          if (dadosStorage) {
            console.log(`✅ Dados encontrados na chave ${chave}:`, dadosStorage.substring(0, 200));
            try {
              dadosOnboarding = JSON.parse(dadosStorage);
              setUserData(dadosOnboarding);
              console.log('✅ Dados parseados com sucesso:', dadosOnboarding);
              break;
            } catch (e) {
              console.log(`❌ Erro ao parsear chave ${chave}:`, e);
            }
          }
        }
      }

      // Preparar dados para envio
      const idadeNum = parseInt(idade);
      
      // Dados base do formulário
      const dadosParaEnvio: any = {
        nome,
        email,
        senha,
        idade: idadeNum,
        tipoUsuario: 0,
        foto: null,
      };

      console.log('📝 Dados base do formulário:', {
        nome,
        email,
        idade: idadeNum,
        tipoUsuario: 0
      });

      // Adicionar dados do onboarding SE existirem
      if (dadosOnboarding) {
        console.log('✅ Dados do onboarding encontrados! Adicionando ao envio...');
        
        // Log detalhado de cada campo sendo adicionado
        console.log('\n📤 CAMPOS DO ONBOARDING:');
        console.log('  objetivo:', dadosOnboarding.objetivo);
        console.log('  objetivoCompleto:', dadosOnboarding.objetivoCompleto);
        console.log('  sexo:', dadosOnboarding.sexo);
        console.log('  faixaIdade:', dadosOnboarding.faixaIdade);
        console.log('  alturaUnidade:', dadosOnboarding.alturaUnidade);
        console.log('  altura:', dadosOnboarding.altura);
        console.log('  alturaFt:', dadosOnboarding.alturaFt);
        console.log('  alturaIn:', dadosOnboarding.alturaIn);
        console.log('  alturaCm:', dadosOnboarding.alturaCm);
        console.log('  pesoUnidade:', dadosOnboarding.pesoUnidade);
        console.log('  pesoKg:', dadosOnboarding.pesoKg);
        console.log('  pesoLb:', dadosOnboarding.pesoLb);
        console.log('  pesoEmKg:', dadosOnboarding.pesoEmKg);
        console.log('  frequenciaTreino:', dadosOnboarding.frequenciaTreino);
        console.log('  nivelAtividade:', dadosOnboarding.nivelAtividade);
        console.log('  frequenciaTreinoDescricao:', dadosOnboarding.frequenciaTreinoDescricao);
        console.log('  treinaAtualmente:', dadosOnboarding.treinaAtualmente);
        console.log('  querLembretesAgua:', dadosOnboarding.querLembretesAgua);
        console.log('  coposAguaDia:', dadosOnboarding.coposAguaDia);
        console.log('  frequenciaCardio:', dadosOnboarding.frequenciaCardio);
        console.log('  frequenciaCardioDescricao:', dadosOnboarding.frequenciaCardioDescricao);
        console.log('  pescocoCm:', dadosOnboarding.pescocoCm);
        console.log('  cinturaCm:', dadosOnboarding.cinturaCm);
        console.log('  quadrilCm:', dadosOnboarding.quadrilCm);
        
        // Adicionar todos os campos ao objeto de envio
        dadosParaEnvio.objetivo = dadosOnboarding.objetivo;
        dadosParaEnvio.objetivoCompleto = dadosOnboarding.objetivoCompleto;
        dadosParaEnvio.sexo = dadosOnboarding.sexo;
        dadosParaEnvio.faixaIdade = dadosOnboarding.faixaIdade;
        dadosParaEnvio.alturaUnidade = dadosOnboarding.alturaUnidade;
        dadosParaEnvio.altura = dadosOnboarding.altura;
        dadosParaEnvio.alturaFt = dadosOnboarding.alturaFt;
        dadosParaEnvio.alturaIn = dadosOnboarding.alturaIn;
        dadosParaEnvio.alturaCm = dadosOnboarding.alturaCm;
        dadosParaEnvio.pesoUnidade = dadosOnboarding.pesoUnidade;
        dadosParaEnvio.pesoKg = dadosOnboarding.pesoKg;
        dadosParaEnvio.pesoLb = dadosOnboarding.pesoLb;
        dadosParaEnvio.pesoEmKg = dadosOnboarding.pesoEmKg;
        dadosParaEnvio.frequenciaTreino = dadosOnboarding.frequenciaTreino;
        dadosParaEnvio.nivelAtividade = dadosOnboarding.nivelAtividade;
        dadosParaEnvio.frequenciaTreinoDescricao = dadosOnboarding.frequenciaTreinoDescricao;
        dadosParaEnvio.treinaAtualmente = dadosOnboarding.treinaAtualmente;
        dadosParaEnvio.querLembretesAgua = dadosOnboarding.querLembretesAgua;
        dadosParaEnvio.coposAguaDia = dadosOnboarding.coposAguaDia;
        dadosParaEnvio.frequenciaCardio = dadosOnboarding.frequenciaCardio;
        dadosParaEnvio.frequenciaCardioDescricao = dadosOnboarding.frequenciaCardioDescricao;
        dadosParaEnvio.pescocoCm = dadosOnboarding.pescocoCm;
        dadosParaEnvio.cinturaCm = dadosOnboarding.cinturaCm;
        dadosParaEnvio.quadrilCm = dadosOnboarding.quadrilCm;
        
        console.log('✅ Todos os campos do onboarding adicionados com sucesso!');
      } else {
        console.log('⚠️ Nenhum dado do onboarding disponível para envio');
      }

      // Log do objeto completo antes do envio
      console.log('\n📦 OBJETO COMPLETO PARA ENVIO:');
      console.log(JSON.stringify(dadosParaEnvio, null, 2));
      
      // Contar campos
      const totalCampos = Object.keys(dadosParaEnvio).length;
      console.log(`\n📊 Total de campos sendo enviados: ${totalCampos}`);

      console.log('\n📤 Enviando requisição para o servidor...');

      const response = await fetch('http://10.0.2.2:3000/usuarios', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(dadosParaEnvio),
      });

      console.log('📥 Resposta recebida - Status:', response.status);

      // Verificar tipo de resposta
      const contentType = response.headers.get('content-type') || '';
      
      let data;
      if (contentType.includes('application/json')) {
        data = await response.json();
        console.log('📦 Dados da resposta:', data);
      } else {
        const text = await response.text();
        console.log('📝 Resposta não-JSON:', text.substring(0, 200));
        throw new Error(`Erro no servidor (Status: ${response.status})`);
      }

      if (!response.ok) {
        throw new Error(data.erro || data.message || `Erro ${response.status}`);
      }

      // Sucesso
      console.log('✅ Cadastro realizado com sucesso!');
      console.log('🆔 ID do usuário:', data.id);
      
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

      setFeedback({
        visible: true,
        title: 'Cadastro realizado 🎉',
        message: 'Sua conta foi criada com sucesso! Faça login para continuar.',
        success: true,
      });

    } catch (error: any) {
      console.error('❌ Erro no cadastro:', error);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      
      let mensagem = 'Erro de conexão com o servidor.';
      
      if (error.message.includes('E11000') || error.message.includes('duplicate')) {
        mensagem = 'Este e-mail já está cadastrado.';
      } else if (error.message.includes('servidor')) {
        mensagem = error.message;
      } else if (error.message) {
        mensagem = error.message;
      }
      
      setFeedback({
        visible: true,
        title: 'Erro no cadastro 😕',
        message: mensagem,
        success: false,
      });
    } finally {
      setLoading(false);
      console.log('🏁 Processo de cadastro finalizado\n');
    }
  };

  // Função para visualizar dados do storage (debug)
// Função para visualizar dados do storage com formatação melhorada
const visualizarDadosStorage = async () => {
  try {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    
    const todasChaves = await AsyncStorage.getAllKeys();
    const dados = await AsyncStorage.multiGet(todasChaves);
    
    // Organizar dados por categoria
    const dadosCategorizados = {
      '👤 USUÁRIO': [] as { key: string; value: string }[],
      '📊 ONBOARDING': [] as { key: string; value: string }[],
      '💪 TREINOS': [] as { key: string; value: string }[],
      '📏 MEDIDAS': [] as { key: string; value: string }[],
      '⚙️ CONFIGURAÇÕES': [] as { key: string; value: string }[],
      '📈 MÉTRICAS': [] as { key: string; value: string }[],
      '📦 OUTROS': [] as { key: string; value: string }[],
    };
    
    // Categorizar cada chave
    dados.forEach(([key, value]) => {
      if (!value) return;
      
      // Tentar parsear JSON para mostrar de forma mais bonita
      let valorFormatado = value;
      try {
        const parsed = JSON.parse(value);
        valorFormatado = JSON.stringify(parsed, null, 2);
        if (valorFormatado.length > 200) {
          valorFormatado = valorFormatado.substring(0, 200) + '...';
        }
      } catch {
        // Não é JSON, manter como está
        if (valorFormatado.length > 100) {
          valorFormatado = valorFormatado.substring(0, 100) + '...';
        }
      }
      
      const item = { key, value: valorFormatado };
      
      if (key.includes('FitnessApp') || key.includes('usuario') || key.includes('token')) {
        dadosCategorizados['👤 USUÁRIO'].push(item);
      } else if (key.includes('objetivo') || key.includes('sexo') || key.includes('idade') || 
                 key.includes('faixaIdade') || key.includes('frequencia') || key.includes('nivelAtividade') ||
                 key.includes('treina') || key.includes('querLembretes') || key.includes('copos') ||
                 key.includes('cardio') || key.includes('dataNascimento') || key.includes('idadeTipo')) {
        dadosCategorizados['📊 ONBOARDING'].push(item);
      } else if (key.includes('treino_') || key.includes('diasFixos') || key.includes('estrutura') || 
                 key.includes('organizacao')) {
        dadosCategorizados['💪 TREINOS'].push(item);
      } else if (key.includes('altura') || key.includes('peso') || key.includes('cintura') || 
                 key.includes('pescoco') || key.includes('quadril')) {
        dadosCategorizados['📏 MEDIDAS'].push(item);
      } else if (key.includes('onboardingCompleto') || key.includes('ultimaAnalise') || 
                 key.includes('userData')) {
        dadosCategorizados['⚙️ CONFIGURAÇÕES'].push(item);
      } else if (key.includes('metricas') || key.includes('imc') || key.includes('tmb') || 
                 key.includes('tdee') || key.includes('aguaRecomendada') || key.includes('calorias')) {
        dadosCategorizados['📈 MÉTRICAS'].push(item);
      } else {
        dadosCategorizados['📦 OUTROS'].push(item);
      }
    });

    // Construir mensagem formatada
    let mensagem = '📱  DADOS DO STORAGE  📱\n';
    mensagem += '══════════════════════════\n\n';
    
    let totalItems = 0;
    
    // Função para adicionar categoria
    const adicionarCategoria = (titulo: string, itens: { key: string; value: string }[]) => {
      if (itens.length === 0) return;
      
      mensagem += `${titulo} (${itens.length})\n`;
      mensagem += '────────────────────\n';
      
      itens.forEach((item, index) => {
        const numero = (index + 1).toString().padStart(2, '0');
        mensagem += `${numero}. ${item.key}\n`;
        
        // Tentar mostrar valor de forma mais legível
        if (item.value.startsWith('{') || item.value.startsWith('[')) {
          mensagem += `   📄 JSON\n`;
        } else {
          mensagem += `   📌 ${item.value}\n`;
        }
        mensagem += '\n';
      });
      
      totalItems += itens.length;
    };
    
    // Adicionar categorias em ordem
    adicionarCategoria('👤 USUÁRIO', dadosCategorizados['👤 USUÁRIO']);
    adicionarCategoria('📊 ONBOARDING', dadosCategorizados['📊 ONBOARDING']);
    adicionarCategoria('📏 MEDIDAS', dadosCategorizados['📏 MEDIDAS']);
    adicionarCategoria('💪 TREINOS', dadosCategorizados['💪 TREINOS']);
    adicionarCategoria('📈 MÉTRICAS', dadosCategorizados['📈 MÉTRICAS']);
    adicionarCategoria('⚙️ CONFIGURAÇÕES', dadosCategorizados['⚙️ CONFIGURAÇÕES']);
    adicionarCategoria('📦 OUTROS', dadosCategorizados['📦 OUTROS']);
    
    mensagem += '══════════════════════════\n';
    mensagem += `📊 TOTAL: ${totalItems} itens\n`;
    mensagem += `📱 ${new Date().toLocaleString('pt-BR')}`;
    
    Alert.alert(
      '📦 Dados do Storage',
      mensagem,
      [
        { 
          text: 'OK', 
          onPress: () => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)
        },
        {
          text: '📋 Copiar',
          onPress: () => {
            // Aqui você pode adicionar lógica para copiar
            Alert.alert('✅ Copiado!', 'Dados copiados para área de transferência');
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          }
        }
      ],
      { cancelable: true }
    );
    
    console.log('📊 Storage visualizado pelo usuário');
    
  } catch (error) {
    console.error('Erro ao ler storage:', error);
    Alert.alert(
      '❌ Erro',
      'Não foi possível ler os dados do storage.',
      [{ text: 'OK' }]
    );
  }
};

  // Função para limpar storage (debug)
  const limparStorage = async () => {
    Alert.alert(
      'Limpar Storage',
      'Tem certeza que deseja limpar todos os dados do storage?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Limpar',
          style: 'destructive',
          onPress: async () => {
            try {
              await AsyncStorage.clear();
              console.log('🗑️ Storage limpo');
              Alert.alert('Sucesso', 'Storage limpo com sucesso!');
              setUserData(null);
              setIdade('');
            } catch (error) {
              console.error('Erro ao limpar storage:', error);
            }
          }
        }
      ]
    );
  };

  if (carregandoDados) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#1E88E5" />
        <Text style={styles.loadingText}>Carregando seus dados...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            {/* LOGO */}
            <View style={styles.logoContainer}>
              <Image
                source={require('@/assets/images/logo.png')}
                style={[styles.logo, height < 700 && { width: 200, height: 110 }]}
                resizeMode="contain"
              />
              <Text style={styles.slogan}>Crie sua conta gratuitamente</Text>
              
              {/* Botões de debug (visíveis apenas em desenvolvimento) */}
              {__DEV__ && (
                <View style={styles.debugContainer}>
                  <TouchableOpacity 
                    style={styles.debugButton}
                    onPress={visualizarDadosStorage}
                  >
                    <FontAwesome name="database" size={16} color="#666" />
                    <Text style={styles.debugButtonText}>Ver dados</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity 
                    style={[styles.debugButton, styles.debugButtonLimpar]}
                    onPress={limparStorage}
                  >
                    <FontAwesome name="trash" size={16} color="#FF4444" />
                    <Text style={[styles.debugButtonText, { color: '#FF4444' }]}>Limpar</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>

            {/* CARD */}
            <LinearGradient colors={['#1E88E5', '#8E44AD']} style={styles.card}>
              <Text style={styles.title}>Crie sua conta</Text>
              <Text style={styles.subtitle}>
                Informe seus dados para continuar
              </Text>

              <Text style={styles.label}>Nome completo *</Text>
              <TextInput
                ref={nomeRef}
                style={styles.input}
                placeholder="Seu nome completo"
                placeholderTextColor="#757575"
                value={nome}
                onChangeText={setNome}
                returnKeyType="next"
                onSubmitEditing={() => emailRef.current?.focus()}
              />

              <Text style={styles.label}>E-mail *</Text>
              <TextInput
                ref={emailRef}
                style={styles.input}
                placeholder="seu@email.com"
                placeholderTextColor="#757575"
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
                returnKeyType="next"
                onSubmitEditing={() => confirmarEmailRef.current?.focus()}
              />

              <Text style={styles.label}>Confirmar e-mail *</Text>
              <TextInput
                ref={confirmarEmailRef}
                style={styles.input}
                placeholder="seu@email.com novamente"
                placeholderTextColor="#757575"
                keyboardType="email-address"
                autoCapitalize="none"
                value={confirmarEmail}
                onChangeText={setConfirmarEmail}
                returnKeyType="next"
                onSubmitEditing={() => idadeRef.current?.focus()}
              />

              <Text style={styles.label}>Idade *</Text>
              <TextInput
                ref={idadeRef}
                style={styles.input}
                placeholder="Sua idade"
                placeholderTextColor="#757575"
                keyboardType="numeric"
                value={idade}
                onChangeText={setIdade}
                returnKeyType="next"
                onSubmitEditing={() => senhaRef.current?.focus()}
              />

              <Text style={styles.label}>Senha *</Text>
              <TextInput
                ref={senhaRef}
                style={styles.input}
                placeholder="Mínimo 6 caracteres"
                placeholderTextColor="#757575"
                secureTextEntry
                value={senha}
                onChangeText={setSenha}
                returnKeyType="next"
                onSubmitEditing={() => confirmarSenhaRef.current?.focus()}
              />

              <Text style={styles.label}>Confirmar senha *</Text>
              <TextInput
                ref={confirmarSenhaRef}
                style={styles.input}
                placeholder="Digite a senha novamente"
                placeholderTextColor="#757575"
                secureTextEntry
                value={confirmarSenha}
                onChangeText={setConfirmarSenha}
                returnKeyType="done"
                onSubmitEditing={handleSubmit}
              />

              <View style={styles.requisitos}>
                <Text style={styles.requisitosText}>• Idade mínima: 14 anos</Text>
                <Text style={styles.requisitosText}>• Senha mínima: 6 caracteres</Text>
              </View>

              {/* Indicador de dados carregados */}
              {userData ? (
                <View style={styles.dadosCarregados}>
                  <FontAwesome name="check-circle" size={16} color="#4CAF50" />
                  <Text style={styles.dadosCarregadosText}>
                    Dados do onboarding carregados ✓
                  </Text>
                </View>
              ) : (
                <View style={[styles.dadosCarregados, { backgroundColor: 'rgba(255, 68, 68, 0.2)' }]}>
                  <FontAwesome name="exclamation-circle" size={16} color="#FF4444" />
                  <Text style={[styles.dadosCarregadosText, { color: '#FF4444' }]}>
                    Nenhum dado do onboarding encontrado
                  </Text>
                </View>
              )}

              <TouchableOpacity
                style={[styles.button, loading && { opacity: 0.7 }]}
                onPress={handleSubmit}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#FFF" />
                ) : (
                  <Text style={styles.buttonText}>Cadastrar</Text>
                )}
              </TouchableOpacity>

              <View style={styles.footer}>
                <TouchableOpacity onPress={() => router.push('/login')}>
                  <Text style={styles.footerLinkText}>
                    Já tem uma conta? Faça login
                  </Text>
                </TouchableOpacity>
              </View>
            </LinearGradient>

            <View style={{ height: 80 }} />
          </ScrollView>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>

      {/* MODAL DE FEEDBACK */}
      {feedback.visible && (
        <View style={styles.overlay}>
          <View style={styles.modal}>
            <Text style={[
              styles.modalTitle,
              feedback.success ? styles.modalTitleSuccess : styles.modalTitleError
            ]}>
              {feedback.title}
            </Text>
            <Text style={styles.modalMessage}>{feedback.message}</Text>

            <TouchableOpacity
              style={[
                styles.modalButton,
                feedback.success ? styles.modalButtonSuccess : styles.modalButtonError
              ]}
              onPress={() => {
                setFeedback({ ...feedback, visible: false });
                if (feedback.success) {
                  router.replace('/login');
                }
              }}
            >
              <Text style={styles.modalButtonText}>
                {feedback.success ? 'Ir para Login' : 'Tentar Novamente'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF' },
  scrollContent: { flexGrow: 1, padding: 20, justifyContent: 'center' },
  logoContainer: { 
    alignItems: 'center', 
    marginBottom: 30 
  },
  logo: { 
    width: 240, 
    height: 130 
  },
  slogan: { 
    fontSize: 16, 
    color: '#666', 
    marginTop: 10, 
    fontStyle: 'italic',
    textAlign: 'center',
  },
  debugContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
    marginTop: 10,
  },
  debugButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    backgroundColor: '#F0F0F0',
    borderRadius: 20,
    gap: 8,
  },
  debugButtonLimpar: {
    backgroundColor: '#FFE5E5',
  },
  debugButtonText: {
    fontSize: 12,
    color: '#666',
  },
  card: {
    borderRadius: 24,
    padding: 24,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 6,
  },
  title: { 
    fontSize: 22, 
    color: '#FFF', 
    fontWeight: '600', 
    textAlign: 'center', 
    marginBottom: 8 
  },
  subtitle: { 
    fontSize: 14, 
    color: '#E0E0E0', 
    textAlign: 'center', 
    marginBottom: 20 
  },
  label: { 
    color: '#FFF', 
    fontWeight: '600', 
    marginBottom: 6, 
    marginTop: 12,
    fontSize: 14,
  },
  input: { 
    backgroundColor: '#FFF', 
    borderRadius: 14, 
    height: 52, 
    paddingHorizontal: 16, 
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#DDD',
  },
  requisitos: {
    marginTop: 12,
    paddingHorizontal: 8,
  },
  requisitosText: {
    color: '#E0E0E0',
    fontSize: 12,
    marginBottom: 2,
  },
  dadosCarregados: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
    gap: 8,
    backgroundColor: 'rgba(76, 175, 80, 0.2)',
    padding: 10,
    borderRadius: 20,
  },
  dadosCarregadosText: {
    color: '#FFF',
    fontSize: 13,
    fontWeight: '500',
  },
  button: { 
    backgroundColor: '#27AE60', 
    height: 56, 
    borderRadius: 16, 
    justifyContent: 'center', 
    alignItems: 'center', 
    marginTop: 28,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonText: { 
    color: '#FFF', 
    fontSize: 18, 
    fontWeight: '600' 
  },
  footer: { 
    marginTop: 22, 
    alignItems: 'center',
  },
  footerLinkText: { 
    fontSize: 16, 
    fontWeight: '600', 
    color: '#FFF', 
    textAlign: 'center', 
    textDecorationLine: 'underline',
  },
  overlay: { 
    position: 'absolute', 
    top: 0, 
    left: 0, 
    right: 0, 
    bottom: 0, 
    backgroundColor: 'rgba(0,0,0,0.45)', 
    justifyContent: 'center', 
    alignItems: 'center',
    zIndex: 1000,
  },
  modal: { 
    backgroundColor: '#FFF', 
    width: '85%', 
    borderRadius: 20, 
    padding: 24, 
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
  },
  modalTitle: { 
    fontSize: 20, 
    fontWeight: '700', 
    marginBottom: 12,
    textAlign: 'center',
  },
  modalTitleSuccess: {
    color: '#27AE60',
  },
  modalTitleError: {
    color: '#E74C3C',
  },
  modalMessage: { 
    fontSize: 15, 
    textAlign: 'center', 
    marginBottom: 24, 
    color: '#555',
    lineHeight: 22,
  },
  modalButton: { 
    paddingHorizontal: 32, 
    paddingVertical: 14, 
    borderRadius: 14,
    minWidth: 150,
  },
  modalButtonSuccess: {
    backgroundColor: '#27AE60',
  },
  modalButtonError: {
    backgroundColor: '#1E88E5',
  },
  modalButtonText: { 
    color: '#FFF', 
    fontWeight: '600', 
    fontSize: 16,
    textAlign: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFF',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
});