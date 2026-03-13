import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Haptics from 'expo-haptics';
import * as ImagePicker from 'expo-image-picker';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
  SafeAreaView,
} from 'react-native';
import API_URL from '../../conf/api';

<<<<<<< HEAD
=======
const { width, height } = Dimensions.get("window");

const COLORS = {
  primary: '#622db2',
  dot: '#4ecdc4',
  line: 'rgba(112, 82, 230, 0.15)',
  textMain: '#1A1A1A',
  disabled: '#F0F0F0',
  inputBg: '#F8F9FA',
};

>>>>>>> 15ffb65c04d79bb26a33c4943e3b3f667e969db0
// ============ INTERFACES E TIPOS ============
interface UserData {
  nome?: string;
  objetivo: string;
  sexo: string | null;
  idade: number | null;
  faixaIdade: string | null;
  alturaUnidade: string | null;
  altura: number | null;
  alturaCm: number | null;
  pesoUnidade: string | null;
  pesoKg: number | null;
  pesoEmKg?: number | null; // Campo de fallback
  pesoLb: number | null;
  frequenciaTreino: string;
  nivelAtividade: number | null;
  frequenciaTreinoDescricao: string | null;
  treinaAtualmente: boolean;
  querLembretesAgua: boolean;
  coposAguaDia: number;
  pescocoCm: number;
  cinturaCm: number;
  quadrilCm: number | null;
  id?: string;
}

export default function CadastroScreen() {
  const router = useRouter();

  // Estados dos campos
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [confirmarEmail, setConfirmarEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');

  // Estados para foto
  const [photo, setPhoto] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  // Estados de controle
  const [loading, setLoading] = useState(false);
  const [carregandoDados, setCarregandoDados] = useState(true);
  const [userData, setUserData] = useState<UserData | null>(null);

  // Estados para visualização de senha
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [mostrarConfirmarSenha, setMostrarConfirmarSenha] = useState(false);
  const [senhaTocada, setSenhaTocada] = useState(false);
  const [confirmarSenhaTocada, setConfirmarSenhaTocada] = useState(false);

  // Estado para requisitos da senha
  const [requisitosSenha, setRequisitosSenha] = useState({
    tamanho: false,
    maiuscula: false,
    minuscula: false,
    numero: false,
    especial: false,
    semEspacos: true
  });

  // Estado para feedback
  const [feedback, setFeedback] = useState({
    visible: false,
    title: '',
    message: '',
    success: false,
  });

  // Refs
  const nomeRef = useRef<TextInput>(null);
  const emailRef = useRef<TextInput>(null);
  const confirmarEmailRef = useRef<TextInput>(null);
  const senhaRef = useRef<TextInput>(null);
  const confirmarSenhaRef = useRef<TextInput>(null);
  const scrollViewRef = useRef<ScrollView>(null);

  // Elementos estáticos de fundo
  const renderStaticBackground = () => (
    <View style={styles.visualArea} pointerEvents="none">
      <View style={[styles.ellipseLine, { width: width * 1.2, height: width * 1.2, top: -width * 0.4, right: -width * 0.3, transform: [{ rotate: '15deg' }] }]}>
        <View style={[styles.staticDot, { bottom: '20%', left: '10%' }]} />
      </View>
      <View style={[styles.ellipseLine, { width: width * 1.0, height: width * 1.0, bottom: -width * 0.2, left: -width * 0.4, transform: [{ rotate: '-20deg' }] }]}>
        <View style={[styles.staticDot, { top: '15%', right: '15%' }]} />
      </View>
      <View style={[styles.ellipseLine, { width: width * 1.5, height: width * 0.8, top: height * 0.2, transform: [{ rotate: '110deg' }] }]}>
        <View style={[styles.staticDot, { top: '50%', right: -5 }]} />
      </View>
    </View>
  );

  // ============ FUNÇÕES DE SENHA ============

  const verificarRequisitosSenha = useCallback((senha: string) => {
    const novosRequisitos = {
      tamanho: senha.length >= 8,
      maiuscula: /[A-Z]/.test(senha),
      minuscula: /[a-z]/.test(senha),
      numero: /[0-9]/.test(senha),
      especial: /[!@#$%^&*(),.?":{}|<>]/.test(senha),
      semEspacos: !/\s/.test(senha)
    };
    return novosRequisitos;
  }, []);

  const atualizarRequisitosSenha = useCallback((text: string) => {
    const novosRequisitos = verificarRequisitosSenha(text);
    setRequisitosSenha(novosRequisitos);
  }, [verificarRequisitosSenha]);

  const getForcaSenhaInfo = useCallback((senha: string) => {
    if (!senha) return { cor: '#E0E0E0', texto: 'Digite uma senha', porcentagem: 0, nivel: 0 };
    const reqs = verificarRequisitosSenha(senha);
    let pontuacao = 0;
    if (reqs.tamanho) pontuacao += 20;
    if (reqs.maiuscula) pontuacao += 20;
    if (reqs.minuscula) pontuacao += 20;
    if (reqs.numero) pontuacao += 20;
    if (reqs.especial) pontuacao += 20;
    if (!reqs.semEspacos) pontuacao = Math.max(0, pontuacao - 30);
    pontuacao = Math.min(100, pontuacao);

    if (pontuacao <= 30) return { cor: '#FF4444', texto: 'Muito Fraca', porcentagem: 20, nivel: 1 };
    if (pontuacao <= 50) return { cor: '#FF7043', texto: 'Fraca', porcentagem: 40, nivel: 2 };
    if (pontuacao <= 70) return { cor: '#FFA726', texto: 'Média', porcentagem: 60, nivel: 3 };
    if (pontuacao <= 90) return { cor: '#4CAF50', texto: 'Forte', porcentagem: 80, nivel: 4 };
    return { cor: '#2E7D32', texto: 'Muito Forte', porcentagem: 100, nivel: 5 };
  }, [verificarRequisitosSenha]);

  const IndicadorForcaSenha = React.memo(() => {
    const forcaInfo = getForcaSenhaInfo(senha);
    return (
      <View style={styles.forcaSenhaContainer}>
        <View style={styles.barraForcaContainer}>
<<<<<<< HEAD
          <View style={[styles.barraForca, { width: `${forcaInfo.porcentagem}%`, backgroundColor: forcaInfo.cor }]} />
=======
          <View style={[
            styles.barraForca,
            {
              width: `${forcaInfo.porcentagem}%`,
              backgroundColor: forcaInfo.cor
            }
          ]} />
>>>>>>> 15ffb65c04d79bb26a33c4943e3b3f667e969db0
        </View>
        <Text style={[styles.textoForca, { color: forcaInfo.cor }]}>{forcaInfo.texto}</Text>
      </View>
    );
  });

  const ListaRequisitosSenha = React.memo(() => {
    const requisitos = [
      { key: 'tamanho', texto: '8+ caracteres', descricao: 'Mínimo 8 caracteres' },
      { key: 'maiuscula', texto: 'Letra maiúscula', descricao: 'Pelo menos uma letra maiúscula (A-Z)' },
      { key: 'minuscula', texto: 'Letra minúscula', descricao: 'Pelo menos uma letra minúscula (a-z)' },
      { key: 'numero', texto: 'Número', descricao: 'Pelo menos um número (0-9)' },
      { key: 'especial', texto: 'Caractere especial', descricao: 'Pelo menos um caractere especial (!@#$%&*)' },
      { key: 'semEspacos', texto: 'Sem espaços', descricao: 'Não pode conter espaços em branco' }
    ];
    const requisitosAtendidos = Object.values(requisitosSenha).filter(v => v).length;

    return (
      <View style={styles.requisitosListaContainer}>
        <Text style={styles.requisitosTitulo}>✓ Requisitos de segurança:</Text>
        {requisitos.map((req) => {
          const atendido = requisitosSenha[req.key as keyof typeof requisitosSenha];
          return (
            <View key={req.key} style={styles.requisitoItem}>
              <View style={[styles.requisitoIcone, atendido ? styles.requisitoIconeOk : styles.requisitoIconePendente]}>
                <FontAwesome name={atendido ? "check" : "lock"} size={10} color="#FFF" />
              </View>
              <View style={styles.requisitoTextoContainer}>
                <Text style={[styles.requisitoItemTexto, atendido && styles.requisitoItemTextoOk]}>{req.texto}</Text>
                {!atendido && senha.length > 0 && <Text style={styles.requisitoItemDescricao}>{req.descricao}</Text>}
              </View>
              {atendido && (
                <View style={styles.requisitoCheck}>
                  <FontAwesome name="check-circle" size={16} color="#4CAF50" />
                </View>
              )}
            </View>
          );
        })}
<<<<<<< HEAD
=======

>>>>>>> 15ffb65c04d79bb26a33c4943e3b3f667e969db0
        {senha.length > 0 && (
          <View style={styles.progressoRequisitos}>
            <View style={styles.progressoBarraContainer}>
              <Text style={styles.progressoBarraTexto}>{requisitosAtendidos} de 6 requisitos atendidos</Text>
              <View style={styles.progressoBarraBackground}>
                <View style={[styles.progressoBarraPreenchimento, { width: `${(requisitosAtendidos / 6) * 100}%` }]} />
              </View>
            </View>
          </View>
        )}
      </View>
    );
  });

  const validarSenhaCompleta = useCallback((senha: string): { valida: boolean; mensagens: string[] } => {
    const erros: string[] = [];
    const reqs = verificarRequisitosSenha(senha);
    if (!senha) {
      erros.push('Senha é obrigatória');
      return { valida: false, mensagens: erros };
    }
    if (!reqs.tamanho) erros.push('• Mínimo de 8 caracteres');
    if (!reqs.maiuscula) erros.push('• Pelo menos 1 letra maiúscula');
    if (!reqs.minuscula) erros.push('• Pelo menos 1 letra minúscula');
    if (!reqs.numero) erros.push('• Pelo menos 1 número');
    if (!reqs.especial) erros.push('• Pelo menos 1 caractere especial (!@#$%&*)');
    if (!reqs.semEspacos) erros.push('• Não pode conter espaços');
    const sequenciasComuns = ['123456', 'abcdef', 'qwerty', 'senha', 'password', '12345678'];
    if (sequenciasComuns.some(seq => senha.toLowerCase().includes(seq))) {
      erros.push('• Evite sequências comuns');
    }
    return { valida: erros.length === 0, mensagens: erros };
  }, [verificarRequisitosSenha]);

  // ============ FUNÇÕES DE CARREGAMENTO ============

  useEffect(() => {
    carregarDadosStorage();
  }, []);

  const carregarDadosStorage = async () => {
    try {
      setCarregandoDados(true);
<<<<<<< HEAD
      console.log('🔍 ===== CARREGANDO DADOS DO STORAGE =====');

      // Tentar carregar objeto completo @userDataCompleto
      const userDataCompleto = await AsyncStorage.getItem('@userDataCompleto');
      
      if (userDataCompleto) {
        try {
          const parsed = JSON.parse(userDataCompleto);
          console.log('✅ @userDataCompleto encontrado:', parsed);
          setUserData(parsed);
          
          if (parsed.nome) {
            setNome(parsed.nome);
          }
          
          setCarregandoDados(false);
          return;
        } catch (e) {
          console.log('❌ Erro ao parsear @userDataCompleto:', e);
        }
      }

      // Se não encontrou objeto completo, tentar chaves individuais
      console.log('⚠️ @userDataCompleto não encontrado. Tentando chaves individuais...');

      const [
        pesoKg,
        pesoLb,
        pesoEmKg,
        alturaCm,
        sexo,
        idade,
        objetivo
      ] = await Promise.all([
        AsyncStorage.getItem('@pesoKg'),
        AsyncStorage.getItem('@pesoLb'),
        AsyncStorage.getItem('@pesoEmKg'),
        AsyncStorage.getItem('@alturaCm'),
        AsyncStorage.getItem('@sexo'),
        AsyncStorage.getItem('@idade'),
        AsyncStorage.getItem('@objetivo')
      ]);

      console.log('📊 Valores das chaves individuais:', {
        pesoKg, pesoLb, pesoEmKg, alturaCm, sexo, idade, objetivo
      });

      // Construir objeto com os dados encontrados - PRIORIDADE para pesoKg
      const dadosCompilados: UserData = {
        objetivo: objetivo || '',
        sexo: sexo || null,
        idade: idade ? parseInt(idade) : null,
        faixaIdade: null,
        alturaUnidade: null,
        altura: null,
        alturaCm: alturaCm ? parseFloat(alturaCm) : null,
        pesoUnidade: null,
        pesoKg: pesoKg ? parseFloat(pesoKg) : (pesoEmKg ? parseFloat(pesoEmKg) : null),
        pesoEmKg: pesoEmKg ? parseFloat(pesoEmKg) : null,
        pesoLb: pesoLb ? parseFloat(pesoLb) : null,
        frequenciaTreino: '',
        nivelAtividade: null,
        frequenciaTreinoDescricao: null,
        treinaAtualmente: false,
        querLembretesAgua: false,
        coposAguaDia: 0,
        pescocoCm: 0,
        cinturaCm: 0,
        quadrilCm: null
      };

      console.log('✅ Dados compilados de chaves individuais:', dadosCompilados);
      setUserData(dadosCompilados);

=======
      const possiveisChaves = [
        '@userDataCompleto',
        'userDataCompleto',
        '@userData',
        'userData',
        '@dadosUsuario',
        'dadosUsuario'
      ];

      let dadosEncontrados = null;

      for (const chave of possiveisChaves) {
        const valor = await AsyncStorage.getItem(chave);
        if (valor) {
          try {
            dadosEncontrados = JSON.parse(valor);
            break;
          } catch (e) {}
        }
      }

      if (dadosEncontrados) {
        setUserData(dadosEncontrados);
        if (dadosEncontrados.nome) {
          setNome(dadosEncontrados.nome);
        }
      }
>>>>>>> 15ffb65c04d79bb26a33c4943e3b3f667e969db0
    } catch (error) {
      console.error('❌ Erro ao carregar dados do storage:', error);
    } finally {
      setCarregandoDados(false);
<<<<<<< HEAD
      console.log('🔍 ===== FIM DO CARREGAMENTO =====\n');
=======
>>>>>>> 15ffb65c04d79bb26a33c4943e3b3f667e969db0
    }
  };

  // ============ FUNÇÕES DE FOTO ============

  const pickImage = async () => {
    Alert.alert(
      "Foto de Perfil",
      "Escolha uma opção",
      [
        {
          text: "Tirar Foto",
          onPress: async () => {
            try {
              setUploading(true);
              const cameraPermission = await ImagePicker.requestCameraPermissionsAsync();
              if (!cameraPermission.granted) {
                alert("Permissão da câmera é necessária!");
                setUploading(false);
                return;
              }

              const result = await ImagePicker.launchCameraAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                quality: 1,
                allowsEditing: true,
                aspect: [1, 1],
              });

              if (!result.canceled && result.assets && result.assets[0]) {
                const uri = result.assets[0].uri;
                setPhoto(uri);
                Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
              }
              setUploading(false);
            } catch (error) {
              console.error('Erro ao tirar foto:', error);
              alert('Erro ao tirar foto. Tente novamente.');
              setUploading(false);
            }
          },
        },
        {
          text: "Escolher da Galeria",
          onPress: async () => {
            try {
              setUploading(true);
              const galleryPermission = await ImagePicker.requestMediaLibraryPermissionsAsync();
              if (!galleryPermission.granted) {
                alert("Permissão de acesso à galeria é necessária!");
                setUploading(false);
                return;
              }

              const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                quality: 1,
                allowsEditing: true,
                aspect: [1, 1],
              });

              if (!result.canceled && result.assets && result.assets[0]) {
                const uri = result.assets[0].uri;
                setPhoto(uri);
                Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
              }
              setUploading(false);
            } catch (error) {
              console.error('Erro ao escolher foto:', error);
              alert('Erro ao escolher foto. Tente novamente.');
              setUploading(false);
            }
          },
        },
        { text: "Cancelar", style: "cancel" }
      ],
      { cancelable: true }
    );
  };

  // ============ FUNÇÕES DE VALIDAÇÃO ============

  const validarFormulario = useCallback(() => {
    if (!nome || !email || !confirmarEmail || !senha || !confirmarSenha) {
      setFeedback({
        visible: true,
        title: 'Campos obrigatórios',
        message: 'Preencha todos os campos.',
        success: false,
      });
      return false;
    }

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

    if (email !== confirmarEmail) {
      setFeedback({
        visible: true,
        title: 'E-mails diferentes',
        message: 'Os e-mails não conferem.',
        success: false,
      });
      return false;
    }

    const validacaoSenha = validarSenhaCompleta(senha);
    if (!validacaoSenha.valida) {
      setFeedback({
        visible: true,
        title: 'Senha fraca',
        message: `Sua senha precisa atender aos requisitos:\n${validacaoSenha.mensagens.join('\n')}`,
        success: false,
      });
      return false;
    }

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
  }, [nome, email, confirmarEmail, senha, confirmarSenha, validarSenhaCompleta]);

  // ============ FUNÇÃO DE ENVIO ============

  const handleSubmit = async () => {
    Keyboard.dismiss();

    if (!validarFormulario()) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      return;
    }

    try {
      setLoading(true);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

<<<<<<< HEAD
      console.log('\n🚀 ===== INICIANDO PROCESSO DE CADASTRO =====');

      // Buscar dados do storage - PRIORIDADE para @userDataCompleto
      let dadosOnboarding = userData;

      if (!dadosOnboarding) {
        // Tentar buscar @userDataCompleto diretamente
        const userDataString = await AsyncStorage.getItem('@userDataCompleto');
        if (userDataString) {
          try {
            dadosOnboarding = JSON.parse(userDataString);
            console.log('✅ @userDataCompleto carregado para envio:', dadosOnboarding);
          } catch (e) {
            console.log('❌ Erro ao parsear @userDataCompleto:', e);
          }
        }
      }

      // Se ainda não tem dados, tentar chaves alternativas
      if (!dadosOnboarding) {
        const chavesParaTentar = ['@userData', 'userDataCompleto', 'userData'];
        for (const chave of chavesParaTentar) {
          const dadosStorage = await AsyncStorage.getItem(chave);
          if (dadosStorage) {
            try {
              dadosOnboarding = JSON.parse(dadosStorage);
              console.log(`✅ Dados carregados de ${chave}:`, dadosOnboarding);
              break;
            } catch (e) { }
          }
        }
      }

      // Fallback para chaves individuais
      if (!dadosOnboarding) {
        const [pesoKg, pesoLb, pesoEmKg] = await Promise.all([
          AsyncStorage.getItem('@pesoKg'),
          AsyncStorage.getItem('@pesoLb'),
          AsyncStorage.getItem('@pesoEmKg')
        ]);

        console.log('📊 Valores das chaves individuais (fallback):', { pesoKg, pesoLb, pesoEmKg });

        dadosOnboarding = {
          objetivo: '',
          sexo: null,
          idade: null,
          faixaIdade: null,
          alturaUnidade: null,
          altura: null,
          alturaCm: null,
          pesoUnidade: null,
          pesoKg: pesoKg ? parseFloat(pesoKg) : (pesoEmKg ? parseFloat(pesoEmKg) : null),
          pesoEmKg: pesoEmKg ? parseFloat(pesoEmKg) : null,
          pesoLb: pesoLb ? parseFloat(pesoLb) : null,
          frequenciaTreino: '',
          nivelAtividade: null,
          frequenciaTreinoDescricao: null,
          treinaAtualmente: false,
          querLembretesAgua: false,
          coposAguaDia: 0,
          pescocoCm: 0,
          cinturaCm: 0,
          quadrilCm: null
        };

        console.log('⚠️ Usando dados de chaves individuais (fallback):', dadosOnboarding);
      }

      // Verificar se a idade existe
      const idadeStorage = dadosOnboarding?.idade;
      if (!idadeStorage) {
        setFeedback({
          visible: true,
          title: 'Idade não encontrada',
          message: 'Complete o onboarding primeiro para informar sua idade.',
          success: false,
        });
        setLoading(false);
        return;
      }

      // Log dos dados que serão enviados
      console.log('📊 DADOS PARA ENVIO:');
      console.log('  - pesoKg:', dadosOnboarding?.pesoKg);
      console.log('  - pesoEmKg:', dadosOnboarding?.pesoEmKg);
      console.log('  - pesoLb:', dadosOnboarding?.pesoLb);
      console.log('  - pesoUnidade:', dadosOnboarding?.pesoUnidade);

      // Enviar e-mail de verificação
=======
>>>>>>> 15ffb65c04d79bb26a33c4943e3b3f667e969db0
      const emailResponse = await fetch(`${API_URL}/usuarios/enviar-codigo-verificacao`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          nome
        }),
      });

      const emailData = await emailResponse.json();

      if (!emailResponse.ok) {
        throw new Error(emailData.erro || 'Erro ao enviar e-mail de verificação');
      }

      const formData = new FormData();

      formData.append('nome', nome);
      formData.append('email', email);
      formData.append('senha', senha);
<<<<<<< HEAD
      formData.append('idade', String(idadeStorage));
=======
>>>>>>> 15ffb65c04d79bb26a33c4943e3b3f667e969db0
      formData.append('tipoUsuario', '0');

      if (photo) {
        const filename = photo.split('/').pop() || 'foto.jpg';
        const match = /\.(\w+)$/.exec(filename);
        const type = match ? `image/${match[1]}` : 'image/jpeg';

        // @ts-ignore
        formData.append('foto', {
          uri: photo,
          name: filename,
          type,
        });
      }

<<<<<<< HEAD
      // Adicionar dados do onboarding
=======
      let dadosOnboarding = userData;
      if (!dadosOnboarding) {
        const chavesParaTentar = ['@userDataCompleto', 'userDataCompleto', '@userData', 'userData'];
        for (const chave of chavesParaTentar) {
          const dadosStorage = await AsyncStorage.getItem(chave);
          if (dadosStorage) {
            try {
              dadosOnboarding = JSON.parse(dadosStorage);
              break;
            } catch (e) { }
          }
        }
      }

>>>>>>> 15ffb65c04d79bb26a33c4943e3b3f667e969db0
      if (dadosOnboarding) {
        console.log('📦 Adicionando campos ao FormData:');
        console.log('🔍 Dados completos do onboarding:', dadosOnboarding);
        
        // PRIORIDADE 1: pesoKg (campo principal)
        // PRIORIDADE 2: pesoEmKg (fallback de outras telas)
        const pesoParaEnviar = dadosOnboarding.pesoKg || dadosOnboarding.pesoEmKg;
        
        if (pesoParaEnviar) {
          formData.append('pesoKg', String(pesoParaEnviar));
          console.log('  ✅ pesoKg:', pesoParaEnviar);
        } else {
          console.log('  ⚠️ Nenhum peso encontrado!');
          console.log('  📊 Valores disponíveis:', {
            pesoKg: dadosOnboarding.pesoKg,
            pesoEmKg: dadosOnboarding.pesoEmKg,
            pesoLb: dadosOnboarding.pesoLb
          });
        }

        // Outros campos
        const campos = [
          { nome: 'objetivo', valor: dadosOnboarding.objetivo },
          { nome: 'sexo', valor: dadosOnboarding.sexo },
          { nome: 'faixaIdade', valor: dadosOnboarding.faixaIdade },
          { nome: 'alturaUnidade', valor: dadosOnboarding.alturaUnidade },
          { nome: 'altura', valor: dadosOnboarding.altura },
          { nome: 'alturaCm', valor: dadosOnboarding.alturaCm },
          { nome: 'pesoUnidade', valor: dadosOnboarding.pesoUnidade },
          { nome: 'pesoLb', valor: dadosOnboarding.pesoLb },
          { nome: 'frequenciaTreino', valor: dadosOnboarding.frequenciaTreino },
          { nome: 'nivelAtividade', valor: dadosOnboarding.nivelAtividade },
          { nome: 'frequenciaTreinoDescricao', valor: dadosOnboarding.frequenciaTreinoDescricao },
          { nome: 'treinaAtualmente', valor: dadosOnboarding.treinaAtualmente },
          { nome: 'querLembretesAgua', valor: dadosOnboarding.querLembretesAgua },
          { nome: 'coposAguaDia', valor: dadosOnboarding.coposAguaDia },
          { nome: 'pescocoCm', valor: dadosOnboarding.pescocoCm },
          { nome: 'cinturaCm', valor: dadosOnboarding.cinturaCm },
          { nome: 'quadrilCm', valor: dadosOnboarding.quadrilCm }
        ];

        campos.forEach(campo => {
          if (campo.valor !== undefined && campo.valor !== null && campo.valor !== '') {
            formData.append(campo.nome, String(campo.valor));
            console.log(`  ✅ ${campo.nome}:`, campo.valor);
          }
        });
      }

<<<<<<< HEAD
      // DEBUG: Mostrar tudo que está sendo enviado
      console.log('\n📦 DADOS COMPLETOS DO FORM DATA:');
      // @ts-ignore
      const formDataObj: any = {};
      // @ts-ignore
      for (let pair of formData._parts) {
        formDataObj[pair[0]] = pair[1];
      }
      console.log(JSON.stringify(formDataObj, null, 2));

      // Salvar formData para usar após verificação
      const formDataString = JSON.stringify({
        ...formDataObj,
=======
      const formDataString = JSON.stringify({
        ...Object.fromEntries(formData as any),
>>>>>>> 15ffb65c04d79bb26a33c4943e3b3f667e969db0
        _photo: photo
      });

      await AsyncStorage.setItem('@dadosCadastroPendente', formDataString);
      if (photo) {
        await AsyncStorage.setItem('@fotoTemp', photo);
      }

      router.push({
        pathname: '/(drawer)/VerificarEmailScreen',
        params: {
          email,
          nome
        }
      });

    } catch (error: any) {
      console.error('❌ Erro:', error);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);

      setFeedback({
        visible: true,
        title: 'Erro',
        message: error.message || 'Ocorreu um erro. Tente novamente.',
        success: false,
      });
    } finally {
      setLoading(false);
    }
  };

<<<<<<< HEAD
  // ============ FUNÇÕES DE RELATÓRIO ============

  const visualizarDadosStorage = async () => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

      const todasChaves = await AsyncStorage.getAllKeys();
      const dados = await AsyncStorage.multiGet(todasChaves);

      let userDataEncontrado = null;

      for (const [key, value] of dados) {
        if (key === '@userDataCompleto' && value) {
          try {
            userDataEncontrado = JSON.parse(value);
            break;
          } catch (e) { }
        }
      }

      if (!userDataEncontrado) {
        for (const [key, value] of dados) {
          if (value && (key.includes('userData') || key.includes('@userData'))) {
            try {
              userDataEncontrado = JSON.parse(value);
              break;
            } catch (e) { }
          }
        }
      }

      if (!userDataEncontrado) {
        Alert.alert('ℹ️ Nenhum dado encontrado', 'Complete o onboarding primeiro para ver seus dados.');
        return;
      }

      const relatorio = `
  📊  SEU PERFIL FITNESS  📊
  ══════════════════════

  👤 DADOS PESSOAIS
  ••••••••••••••••••
  📋 Nome: ${userDataEncontrado.nome || nome || 'Não informado'}
  🎂 Idade: ${userDataEncontrado.idade || userDataEncontrado.faixaIdade || 'Não informada'}
  ⚥ Sexo: ${userDataEncontrado.sexo === 'M' ? 'Masculino' : userDataEncontrado.sexo === 'F' ? 'Feminino' : 'Não informado'}

  📏 MEDIDAS ATUAIS
  ••••••••••••••••••
  📈 Altura: ${formatarAltura(userDataEncontrado)}
  ⚖️ Peso: ${formatarPeso(userDataEncontrado)}
  📐 Pescoço: ${userDataEncontrado.pescocoCm ? `${userDataEncontrado.pescocoCm} cm` : 'Não medido'}
  📏 Cintura: ${userDataEncontrado.cinturaCm ? `${userDataEncontrado.cinturaCm} cm` : 'Não medido'}
  📐 Quadril: ${userDataEncontrado.quadrilCm ? `${userDataEncontrado.quadrilCm} cm` : 'Não medido'}

  🎯 OBJETIVOS E TREINO
  ••••••••••••••••••••
  🎯 Objetivo principal: ${formatarObjetivo(userDataEncontrado.objetivo) || 'Não definido'}
  💪 Nível de atividade: ${userDataEncontrado.nivelAtividade ? `${userDataEncontrado.nivelAtividade}/10` : 'Não definido'}
  🏋️ Frequência de treino: ${userDataEncontrado.frequenciaTreinoDescricao || userDataEncontrado.frequenciaTreino || 'Não definida'}

  💧 HÁBITOS
  •••••••••••
  🥤 Copos de água/dia: ${userDataEncontrado.coposAguaDia || 'Não definido'}
  💦 Lembretes de água: ${userDataEncontrado.querLembretesAgua ? '✅ Ativo' : '❌ Inativo'}
  🏃 Treina atualmente: ${userDataEncontrado.treinaAtualmente ? '✅ Sim' : '❌ Não'}

  📱 INFORMAÇÕES DO SISTEMA
  ••••••••••••••••••••••••
  🆔 ID do perfil: ${userDataEncontrado.id || 'Ainda não cadastrado'}

  ✨ DICA DO DIA
  •••••••••••••
  ${gerarDicaDoDia(userDataEncontrado)}

  💪 Continue firme nos seus objetivos!
      `;

      Alert.alert('📋 Meu Relatório Fitness', relatorio, [
        { text: 'Fechar', style: 'cancel' }
      ]);

    } catch (error) {
      console.error('Erro ao gerar relatório:', error);
      Alert.alert('Erro', 'Não foi possível gerar o relatório.');
    }
  };

  const formatarAltura = (dados: any) => {
    if (dados.alturaCm) {
      const metros = (dados.alturaCm / 100).toFixed(2);
      return `${dados.alturaCm} cm (${metros.replace('.', ',')} m)`;
    }
    if (dados.altura) return `${dados.altura} cm`;
    return 'Não informada';
  };

  const formatarPeso = (dados: any) => {
    if (dados.pesoKg) return `${dados.pesoKg} kg`;
    if (dados.pesoEmKg) return `${dados.pesoEmKg} kg (convertido)`;
    if (dados.pesoLb) return `${dados.pesoLb} lb (${(dados.pesoLb * 0.453592).toFixed(1)} kg)`;
    return 'Não informado';
  };

  const formatarObjetivo = (objetivo: string) => {
    if (!objetivo) return null;
    const icones: { [key: string]: string } = {
      'emagrecer': '🔥', 'ganhar-massa': '💪', 'definir': '✨', 'saude': '❤️', 'resistencia': '🏃'
    };
    const icone = icones[objetivo.toLowerCase()] || '🎯';
    return `${icone} ${objetivo}`;
  };

  const gerarDicaDoDia = (dados: any) => {
    const dicas = [
      "Beba água regularmente durante o dia! 💧",
      "Não se esqueça de alongar antes e depois dos treinos 🧘",
      "Durma bem para uma melhor recuperação muscular 😴",
      "Mantenha uma alimentação balanceada 🥗",
      "A consistência é mais importante que a intensidade ⏱️",
      "Registre seus progressos para se motivar 📝",
      "Descanse entre as séries de exercícios ⚡",
      "Varie seus treinos para evitar platôs 🔄"
    ];
    if (dados.objetivo === 'emagrecer') return "Combine exercícios aeróbicos com musculação para melhores resultados! 🔥";
    if (dados.objetivo === 'ganhar-massa') return "Foque na progressão de carga e na execução correta dos exercícios! 💪";
    return dicas[Math.floor(Math.random() * dicas.length)];
  };

  const limparStorage = async () => {
    Alert.alert('Limpar Storage', 'Tem certeza que deseja limpar todos os dados?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Limpar', style: 'destructive',
        onPress: async () => {
          try {
            await AsyncStorage.clear();
            setUserData(null);
            setNome('');
            setPhoto(null);
            Alert.alert('Sucesso', 'Storage limpo com sucesso!');
          } catch (error) {
            console.error('Erro ao limpar storage:', error);
          }
        }
      }
    ]);
  };

=======
>>>>>>> 15ffb65c04d79bb26a33c4943e3b3f667e969db0
  // ============ RENDER ============

  if (carregandoDados) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.loadingText}>Carregando seus dados...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
<<<<<<< HEAD
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
          <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
            
            <View style={styles.logoContainer}>
              <Image source={require('@/assets/images/logo.png')} style={[styles.logo, height < 700 && { width: 200, height: 110 }]} resizeMode="contain" />
              <Text style={styles.slogan}>Crie sua conta gratuitamente</Text>
              {__DEV__ && (
                <View style={styles.debugContainer}>
                  <TouchableOpacity style={[styles.debugButton, styles.debugButtonVer]} onPress={visualizarDadosStorage}>
                    <FontAwesome name="bar-chart" size={16} color="#1E88E5" />
                    <Text style={[styles.debugButtonText, { color: '#1E88E5' }]}>Meu Relatório</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={[styles.debugButton, styles.debugButtonLimpar]} onPress={limparStorage}>
                    <FontAwesome name="trash" size={16} color="#FF4444" />
                    <Text style={[styles.debugButtonText, { color: '#FF4444' }]}>Limpar</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>

            <LinearGradient colors={['#1E88E5', '#8E44AD']} style={styles.card}>
              <Text style={styles.title}>Crie sua conta</Text>
              <Text style={styles.subtitle}>Informe seus dados para continuar</Text>

              <Text style={{ textAlign: 'center', marginBottom: 8, color: '#FFF' }}>Clique para adicionar foto de perfil</Text>

              <View style={styles.photoContainer}>
                <TouchableOpacity onPress={pickImage} disabled={uploading}>
                  {uploading ? (
                    <View style={[styles.photo, styles.photoPlaceholder]}>
                      <ActivityIndicator size="large" color="#FFF" />
                    </View>
                  ) : photo ? (
                    <Image source={{ uri: photo }} style={styles.photo} />
                  ) : (
                    <View style={[styles.photo, styles.photoPlaceholder]}>
                      <FontAwesome name="camera" size={40} color="#FFF" />
                      <Text style={styles.photoPlaceholderText}>Adicionar</Text>
                    </View>
                  )}
                </TouchableOpacity>
                {photo && (
                  <TouchableOpacity style={styles.removePhotoButton} onPress={() => setPhoto(null)}>
                    <FontAwesome name="times-circle" size={20} color="#FF4444" />
                    <Text style={styles.removePhotoText}>Remover Foto</Text>
                  </TouchableOpacity>
                )}
              </View>

              <Text style={styles.label}>Nome completo *</Text>
              <TextInput ref={nomeRef} style={styles.input} placeholder="Seu nome completo" placeholderTextColor="#757575" value={nome} onChangeText={setNome} returnKeyType="next" onSubmitEditing={() => emailRef.current?.focus()} />

              <Text style={styles.label}>E-mail *</Text>
              <TextInput ref={emailRef} style={styles.input} placeholder="seu@email.com" placeholderTextColor="#757575" keyboardType="email-address" autoCapitalize="none" value={email} onChangeText={setEmail} returnKeyType="next" onSubmitEditing={() => confirmarEmailRef.current?.focus()} />

              <Text style={styles.label}>Confirmar e-mail *</Text>
              <TextInput ref={confirmarEmailRef} style={styles.input} placeholder="seu@email.com novamente" placeholderTextColor="#757575" keyboardType="email-address" autoCapitalize="none" value={confirmarEmail} onChangeText={setConfirmarEmail} returnKeyType="next" onSubmitEditing={() => { setSenhaTocada(true); senhaRef.current?.focus(); }} />

              <View style={styles.senhaSection}>
                <Text style={styles.sectionTitle}>Senha</Text>

                <View style={styles.senhaContainer}>
                  <TextInput ref={senhaRef} style={[styles.input, styles.inputSenha]} placeholder="Crie uma senha forte" placeholderTextColor="#757575" secureTextEntry={!mostrarSenha} value={senha} onChangeText={(text) => { setSenha(text); atualizarRequisitosSenha(text); setSenhaTocada(true); }} onFocus={() => setSenhaTocada(true)} returnKeyType="next" onSubmitEditing={() => { setConfirmarSenhaTocada(true); confirmarSenhaRef.current?.focus(); }} />
                  <TouchableOpacity style={styles.iconeSenha} onPress={() => { setMostrarSenha(!mostrarSenha); Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); }}>
                    <FontAwesome name={mostrarSenha ? "eye-slash" : "eye"} size={22} color="#666" />
                  </TouchableOpacity>
                </View>

                <View style={[styles.senhaContainer, styles.confirmarSenhaContainer]}>
                  <TextInput ref={confirmarSenhaRef} style={[styles.input, styles.inputSenha]} placeholder="Digite a senha novamente" placeholderTextColor="#757575" secureTextEntry={!mostrarConfirmarSenha} value={confirmarSenha} onChangeText={(text) => { setConfirmarSenha(text); setConfirmarSenhaTocada(true); }} onFocus={() => setConfirmarSenhaTocada(true)} returnKeyType="done" onSubmitEditing={handleSubmit} />
                  <TouchableOpacity style={styles.iconeSenha} onPress={() => { setMostrarConfirmarSenha(!mostrarConfirmarSenha); Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); }}>
                    <FontAwesome name={mostrarConfirmarSenha ? "eye-slash" : "eye"} size={22} color="#666" />
                  </TouchableOpacity>
                </View>

                {senhaTocada && senha.length > 0 && (
                  <>
                    <IndicadorForcaSenha />
                    <ListaRequisitosSenha />
                  </>
                )}

                {confirmarSenhaTocada && confirmarSenha.length > 0 && (
                  <View style={styles.senhasCoincidemContainer}>
                    <FontAwesome name={senha === confirmarSenha ? "check-circle" : "exclamation-circle"} size={16} color={senha === confirmarSenha ? "#4CAF50" : "#FF4444"} />
                    <Text style={[styles.senhasCoincidemTexto, { color: senha === confirmarSenha ? "#4CAF50" : "#FF4444" }]}>
                      {senha === confirmarSenha ? "Senhas coincidem ✓" : "Senhas diferentes ✗"}
                    </Text>
                  </View>
                )}
              </View>

              <View style={styles.requisitosBasicos}>
                <Text style={styles.requisitosBasicosText}>• Sua idade será obtida do onboarding</Text>
                <Text style={styles.requisitosBasicosText}>• Seu peso será obtido do onboarding</Text>
                <Text style={styles.requisitosBasicosText}>• Senha forte: 8+ caracteres, maiúscula, minúscula, número e caractere especial</Text>
              </View>

              {userData ? (
                <View style={styles.dadosCarregados}>
                  <FontAwesome name="check-circle" size={16} color="#4CAF50" />
                  <Text style={styles.dadosCarregadosText}>
                    Dados do onboarding carregados ✓
                    {userData.idade && ` (Idade: ${userData.idade} anos)`}
                    {userData.pesoKg && ` • Peso: ${userData.pesoKg} kg`}
                  </Text>
                </View>
              ) : (
                <View style={[styles.dadosCarregados, { backgroundColor: 'rgba(255, 68, 68, 0.2)' }]}>
                  <FontAwesome name="exclamation-circle" size={16} color="#FF4444" />
                  <Text style={[styles.dadosCarregadosText, { color: '#FF4444' }]}>
                    Complete o onboarding primeiro (peso e idade necessários)
                  </Text>
                </View>
              )}

              <TouchableOpacity style={[styles.button, loading && { opacity: 0.7 }]} onPress={handleSubmit} disabled={loading || !userData}>
                {loading ? <ActivityIndicator color="#FFF" /> : <Text style={styles.buttonText}>Cadastrar</Text>}
=======
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
      
      {/* Camada de fundo fixa com elipses */}
      <View style={StyleSheet.absoluteFill} pointerEvents="none">
        <View style={{ flex: 1, backgroundColor: '#fff' }} />
        {renderStaticBackground()}
      </View>

      {/* Header com botão de voltar */}
      <SafeAreaView style={styles.headerSafeArea}>
        <View style={styles.header}>
          <Pressable 
            onPress={() => router.push('/(drawer)/FinalizacaoScreen')} 
            style={styles.backButton}
            android_ripple={{ color: 'rgba(98, 45, 178, 0.1)', radius: 20 }}
          >
            <View style={styles.backIconCircle}>
              <Ionicons name="chevron-back" size={16} color={COLORS.primary} />
            </View>
            <Text style={styles.backText}>Voltar</Text>
          </Pressable>
        </View>
      </SafeAreaView>

      {/* KeyboardAvoidingView para melhor tratamento do teclado */}
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={Platform.OS === "ios" ? 40 : 0}
      >
        {/* ScrollView com propriedades melhoradas para scroll fluido */}
        <ScrollView
          ref={scrollViewRef}
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContentContainer}
          keyboardShouldPersistTaps="always"
          showsVerticalScrollIndicator={true}
          bounces={true}
          overScrollMode="always"
          decelerationRate="normal"
          scrollEventThrottle={16}
          nestedScrollEnabled={true}
          scrollEnabled={true}
          alwaysBounceVertical={true}
        >
          {/* Conteúdo */}
          <View style={styles.content}>
            {/* Logo */}
            <View style={styles.logoContainer}>
              <Image
                source={require('@/assets/images/completa-sem-fundo1.png')}
                style={styles.logo}
                resizeMode="contain"
              />
            </View>

            {/* Card de Cadastro com Pressable para fechar teclado */}
            <Pressable onPress={Keyboard.dismiss}>
              <View style={styles.card}>
                <Text style={styles.title}>Criar Conta</Text>
                <Text style={styles.subtitle}>Preencha seus dados para começar</Text>

                {/* Seção de Foto */}
                <View style={styles.photoSection}>
                  <Text style={styles.photoLabel}>Foto de perfil (opcional)</Text>
                  <View style={styles.photoContainer}>
                    <TouchableOpacity onPress={pickImage} disabled={uploading} style={styles.photoWrapper}>
                      {uploading ? (
                        <View style={[styles.photo, styles.photoPlaceholder]}>
                          <ActivityIndicator size="large" color={COLORS.primary} />
                        </View>
                      ) : photo ? (
                        <Image source={{ uri: photo }} style={styles.photo} />
                      ) : (
                        <View style={[styles.photo, styles.photoPlaceholder]}>
                          <Ionicons name="camera-outline" size={40} color={COLORS.primary} />
                          <Text style={styles.photoPlaceholderText}>Adicionar</Text>
                        </View>
                      )}
                    </TouchableOpacity>

                    {photo && (
                      <TouchableOpacity
                        style={styles.removePhotoButton}
                        onPress={() => setPhoto(null)}
                      >
                        <Ionicons name="close-circle" size={20} color="#FF6B6B" />
                        <Text style={styles.removePhotoText}>Remover</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                </View>

                {/* Formulário */}
                <View style={styles.formContainer}>
                  {/* Nome */}
                  <View style={styles.inputGroup}>
                    <Text style={styles.label}>Nome completo *</Text>
                    <View style={styles.inputWrapper}>
                      <Ionicons name="person-outline" size={20} color="#888" style={styles.inputIcon} />
                      <TextInput
                        ref={nomeRef}
                        style={styles.input}
                        placeholder="Seu nome completo"
                        placeholderTextColor="#999"
                        value={nome}
                        onChangeText={setNome}
                        returnKeyType="next"
                        onSubmitEditing={() => emailRef.current?.focus()}
                        editable={!loading}
                      />
                    </View>
                  </View>

                  {/* Email */}
                  <View style={styles.inputGroup}>
                    <Text style={styles.label}>E-mail *</Text>
                    <View style={styles.inputWrapper}>
                      <Ionicons name="mail-outline" size={20} color="#888" style={styles.inputIcon} />
                      <TextInput
                        ref={emailRef}
                        style={styles.input}
                        placeholder="seu@email.com"
                        placeholderTextColor="#999"
                        keyboardType="email-address"
                        autoCapitalize="none"
                        value={email}
                        onChangeText={setEmail}
                        returnKeyType="next"
                        onSubmitEditing={() => confirmarEmailRef.current?.focus()}
                        editable={!loading}
                      />
                    </View>
                  </View>

                  {/* Confirmar Email */}
                  <View style={styles.inputGroup}>
                    <Text style={styles.label}>Confirmar e-mail *</Text>
                    <View style={styles.inputWrapper}>
                      <Ionicons name="mail-outline" size={20} color="#888" style={styles.inputIcon} />
                      <TextInput
                        ref={confirmarEmailRef}
                        style={styles.input}
                        placeholder="seu@email.com novamente"
                        placeholderTextColor="#999"
                        keyboardType="email-address"
                        autoCapitalize="none"
                        value={confirmarEmail}
                        onChangeText={setConfirmarEmail}
                        returnKeyType="next"
                        onSubmitEditing={() => senhaRef.current?.focus()}
                        editable={!loading}
                      />
                    </View>
                  </View>

                  {/* Seção de Senha */}
                  <View style={styles.senhaSection}>
                    <Text style={styles.sectionTitle}>Senha</Text>

                    {/* Campo Senha */}
                    <View style={styles.inputGroup}>
                      <Text style={styles.label}>Crie uma senha *</Text>
                      <View style={styles.inputWrapper}>
                        <Ionicons name="lock-closed-outline" size={20} color="#888" style={styles.inputIcon} />
                        <TextInput
                          ref={senhaRef}
                          style={[styles.input, styles.inputWithIcon]}
                          placeholder="Crie uma senha forte"
                          placeholderTextColor="#999"
                          secureTextEntry={!mostrarSenha}
                          value={senha}
                          onChangeText={(text) => {
                            setSenha(text);
                            atualizarRequisitosSenha(text);
                            setSenhaTocada(true);
                          }}
                          onFocus={() => setSenhaTocada(true)}
                          returnKeyType="next"
                          onSubmitEditing={() => {
                            setConfirmarSenhaTocada(true);
                            confirmarSenhaRef.current?.focus();
                          }}
                          editable={!loading}
                        />
                        <TouchableOpacity
                          style={styles.eyeButton}
                          onPress={() => {
                            setMostrarSenha(!mostrarSenha);
                            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                          }}
                        >
                          <Ionicons
                            name={mostrarSenha ? "eye-off-outline" : "eye-outline"}
                            size={20}
                            color="#888"
                          />
                        </TouchableOpacity>
                      </View>
                    </View>

                    {/* Indicador de Força da Senha */}
                    {senhaTocada && senha.length > 0 && (
                      <>
                        <IndicadorForcaSenha />
                        <ListaRequisitosSenha />
                      </>
                    )}

                    {/* Campo Confirmar Senha */}
                    <View style={[styles.inputGroup, styles.confirmarSenhaGroup]}>
                      <Text style={styles.label}>Confirmar senha *</Text>
                      <View style={styles.inputWrapper}>
                        <Ionicons name="lock-closed-outline" size={20} color="#888" style={styles.inputIcon} />
                        <TextInput
                          ref={confirmarSenhaRef}
                          style={[styles.input, styles.inputWithIcon]}
                          placeholder="Digite a senha novamente"
                          placeholderTextColor="#999"
                          secureTextEntry={!mostrarConfirmarSenha}
                          value={confirmarSenha}
                          onChangeText={(text) => {
                            setConfirmarSenha(text);
                            setConfirmarSenhaTocada(true);
                          }}
                          onFocus={() => setConfirmarSenhaTocada(true)}
                          returnKeyType="done"
                          onSubmitEditing={handleSubmit}
                          editable={!loading}
                        />
                        <TouchableOpacity
                          style={styles.eyeButton}
                          onPress={() => {
                            setMostrarConfirmarSenha(!mostrarConfirmarSenha);
                            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                          }}
                        >
                          <Ionicons
                            name={mostrarConfirmarSenha ? "eye-off-outline" : "eye-outline"}
                            size={20}
                            color="#888"
                          />
                        </TouchableOpacity>
                      </View>
                    </View>

                    {/* Indicador de Confirmação de Senha */}
                    {confirmarSenhaTocada && confirmarSenha.length > 0 && (
                      <View style={styles.senhasCoincidemContainer}>
                        <Ionicons
                          name={senha === confirmarSenha ? "checkmark-circle" : "alert-circle"}
                          size={20}
                          color={senha === confirmarSenha ? "#4CAF50" : "#FF6B6B"}
                        />
                        <Text style={[
                          styles.senhasCoincidemTexto,
                          { color: senha === confirmarSenha ? "#4CAF50" : "#FF6B6B" }
                        ]}>
                          {senha === confirmarSenha ? "Senhas coincidem" : "Senhas diferentes"}
                        </Text>
                      </View>
                    )}
                  </View>

                  {/* Requisitos Básicos */}
                  <View style={styles.requisitosBasicos}>
                    <Text style={styles.requisitosBasicosText}>• Idade mínima: 14 anos</Text>
                    <Text style={styles.requisitosBasicosText}>• Senha forte: 8+ caracteres, maiúscula, minúscula, número e caractere especial</Text>
                  </View>

                  {/* Botão Cadastrar */}
                  <Pressable
                    onPress={handleSubmit}
                    disabled={loading}
                    style={styles.buttonWrapper}
                  >
                    {!loading ? (
                      <LinearGradient
                        colors={['#4ecdc4', '#622db2', '#4b208c']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={styles.primaryButton}
                      >
                        <Ionicons name="person-add-outline" size={20} color="#FFF" style={styles.buttonIcon} />
                        <Text style={styles.primaryButtonText}>Cadastrar</Text>
                      </LinearGradient>
                    ) : (
                      <View style={[styles.primaryButton, { backgroundColor: COLORS.disabled }]}>
                        <ActivityIndicator color="#FFF" />
                      </View>
                    )}
                  </Pressable>
                </View>
              </View>
            </Pressable>

            {/* Link para Login */}
            <View style={styles.footer}>
              <TouchableOpacity onPress={() => router.push('/login')}>
                <Text style={styles.footerLinkText}>Já tem uma conta? Faça login</Text>
>>>>>>> 15ffb65c04d79bb26a33c4943e3b3f667e969db0
              </TouchableOpacity>
            </View>

<<<<<<< HEAD
              <View style={styles.footer}>
                <TouchableOpacity onPress={() => router.push('/login')}>
                  <Text style={styles.footerLinkText}>Já tem uma conta? Faça login</Text>
                </TouchableOpacity>
              </View>
            </LinearGradient>
          </ScrollView>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>

      {feedback.visible && (
        <View style={styles.overlay}>
          <View style={styles.modal}>
            <Text style={[styles.modalTitle, feedback.success ? styles.modalTitleSuccess : styles.modalTitleError]}>{feedback.title}</Text>
            <Text style={styles.modalMessage}>{feedback.message}</Text>
            <TouchableOpacity style={[styles.modalButton, feedback.success ? styles.modalButtonSuccess : styles.modalButtonError]} onPress={() => { setFeedback({ ...feedback, visible: false }); if (feedback.success) router.replace('/login'); }}>
              <Text style={styles.modalButtonText}>{feedback.success ? 'Ir para Login' : 'Tentar Novamente'}</Text>
            </TouchableOpacity>
          </View>
=======
            {/* Termos de uso */}
            <View style={styles.termsContainer}>
              <Text style={styles.termsText}>
                Ao se cadastrar, você concorda com nossos{" "}
                <Text style={styles.termsLink}>Termos de Serviço</Text> e{" "}
                <Text style={styles.termsLink}>Política de Privacidade</Text>.
              </Text>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Modal de Feedback */}
      {feedback.visible && (
        <View style={styles.overlay}>
          <TouchableWithoutFeedback onPress={() => setFeedback({ ...feedback, visible: false })}>
            <View style={styles.overlayBackground}>
              <View style={styles.modal}>
                <View style={styles.modalHeader}>
                  <Ionicons
                    name={feedback.success ? "checkmark-circle" : "alert-circle"}
                    size={48}
                    color={feedback.success ? "#4CAF50" : "#FF6B6B"}
                  />
                  <Text style={styles.modalTitle}>{feedback.title}</Text>
                </View>
                <Text style={styles.modalMessage}>{feedback.message}</Text>
                <TouchableOpacity
                  style={styles.modalButton}
                  onPress={() => {
                    setFeedback({ ...feedback, visible: false });
                    if (feedback.success) router.replace('/login');
                  }}
                  activeOpacity={0.8}
                >
                  <Text style={styles.modalButtonText}>
                    {feedback.success ? 'Ir para Login' : 'Tentar Novamente'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableWithoutFeedback>
>>>>>>> 15ffb65c04d79bb26a33c4943e3b3f667e969db0
        </View>
      )}
    </View>
  );
}

// ============ STYLES ============
const styles = StyleSheet.create({
<<<<<<< HEAD
  container: { flex: 1, backgroundColor: '#FFF' },
  scrollContent: { flexGrow: 1, padding: 20, justifyContent: 'center' },
  logoContainer: { alignItems: 'center', marginBottom: 30 },
  logo: { width: 240, height: 130 },
  slogan: { fontSize: 16, color: '#666', marginTop: 10, fontStyle: 'italic', textAlign: 'center' },
  debugContainer: { flexDirection: 'row', justifyContent: 'center', gap: 10, marginTop: 10 },
  debugButton: { flexDirection: 'row', alignItems: 'center', padding: 8, backgroundColor: '#F0F0F0', borderRadius: 20, gap: 8 },
  debugButtonVer: { backgroundColor: '#E3F2FD', borderWidth: 1, borderColor: '#1E88E5' },
  debugButtonLimpar: { backgroundColor: '#FFE5E5' },
  debugButtonText: { fontSize: 12, color: '#666' },
  card: { borderRadius: 24, padding: 24, shadowColor: '#000', shadowOpacity: 0.2, shadowRadius: 12, elevation: 6 },
  title: { fontSize: 22, color: '#FFF', fontWeight: '600', textAlign: 'center', marginBottom: 8 },
  subtitle: { fontSize: 14, color: '#E0E0E0', textAlign: 'center', marginBottom: 20 },
  label: { color: '#FFF', fontWeight: '600', marginBottom: 6, marginTop: 12, fontSize: 14 },
  photoContainer: { alignItems: 'center', marginVertical: 10 },
  photo: { width: 120, height: 120, borderRadius: 60, borderWidth: 3, borderColor: '#FFF' },
  photoPlaceholder: { backgroundColor: 'rgba(255,255,255,0.2)', justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: '#FFF', borderStyle: 'dashed' },
  photoPlaceholderText: { color: '#FFF', fontSize: 12, marginTop: 5, textAlign: 'center' },
  removePhotoButton: { flexDirection: 'row', alignItems: 'center', marginTop: 10, gap: 8 },
  removePhotoText: { color: '#FFF', fontSize: 14 },
  input: { backgroundColor: '#FFF', borderRadius: 14, height: 52, paddingHorizontal: 16, fontSize: 16, borderWidth: 1, borderColor: '#DDD' },
  senhaSection: { marginTop: 16, padding: 16, backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 16 },
  sectionTitle: { color: '#FFF', fontSize: 16, fontWeight: '600', marginBottom: 12 },
  senhaContainer: { position: 'relative', width: '100%' },
  confirmarSenhaContainer: { marginTop: 12 },
  inputSenha: { paddingRight: 50 },
  iconeSenha: { position: 'absolute', right: 16, top: 14, zIndex: 1, padding: 5 },
  forcaSenhaContainer: { marginTop: 8, marginBottom: 12 },
  barraForcaContainer: { height: 6, backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 3, overflow: 'hidden' },
  barraForca: { height: '100%', borderRadius: 3 },
  textoForca: { fontSize: 12, fontWeight: '600', marginTop: 4, textAlign: 'right' },
  requisitosListaContainer: { backgroundColor: 'rgba(0,0,0,0.25)', borderRadius: 16, padding: 16, marginTop: 8, marginBottom: 8 },
  requisitosTitulo: { color: '#FFF', fontSize: 14, fontWeight: '600', marginBottom: 12 },
  requisitoItem: { flexDirection: 'row', alignItems: 'flex-start', gap: 12, marginBottom: 12, backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 12, padding: 10 },
  requisitoIcone: { width: 20, height: 20, borderRadius: 10, justifyContent: 'center', alignItems: 'center', marginTop: 2 },
  requisitoIconeOk: { backgroundColor: '#4CAF50' },
  requisitoIconePendente: { backgroundColor: '#FFA726' },
  requisitoTextoContainer: { flex: 1 },
  requisitoItemTexto: { color: '#FFF', fontSize: 14, fontWeight: '500', marginBottom: 2 },
  requisitoItemTextoOk: { color: '#4CAF50', textDecorationLine: 'line-through' },
  requisitoItemDescricao: { color: 'rgba(255,255,255,0.6)', fontSize: 11 },
  requisitoCheck: { marginLeft: 'auto', paddingLeft: 8 },
  progressoRequisitos: { marginTop: 16, paddingTop: 16, borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.1)' },
  progressoBarraContainer: { width: '100%' },
  progressoBarraTexto: { color: '#FFF', fontSize: 12, textAlign: 'center', marginBottom: 8 },
  progressoBarraBackground: { height: 8, backgroundColor: '#FFF', borderRadius: 4, overflow: 'hidden' },
  progressoBarraPreenchimento: { height: '100%', backgroundColor: '#4CAF50', borderRadius: 4 },
  senhasCoincidemContainer: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 8, marginBottom: 8, paddingHorizontal: 12, paddingVertical: 8, backgroundColor: 'rgba(0,0,0,0.2)', borderRadius: 20 },
  senhasCoincidemTexto: { fontSize: 13, fontWeight: '500' },
  requisitosBasicos: { marginTop: 12, paddingHorizontal: 12, backgroundColor: 'rgba(0,0,0,0.15)', borderRadius: 12, padding: 12 },
  requisitosBasicosText: { color: '#E0E0E0', fontSize: 12, marginBottom: 4, lineHeight: 18 },
  dadosCarregados: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 16, gap: 8, backgroundColor: 'rgba(76, 175, 80, 0.2)', padding: 12, borderRadius: 20, flexWrap: 'wrap' },
  dadosCarregadosText: { color: '#FFF', fontSize: 13, fontWeight: '500', textAlign: 'center' },
  button: { backgroundColor: '#27AE60', height: 56, borderRadius: 16, justifyContent: 'center', alignItems: 'center', marginTop: 28, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3 },
  buttonText: { color: '#FFF', fontSize: 18, fontWeight: '600' },
  footer: { marginTop: 22, alignItems: 'center' },
  footerLinkText: { fontSize: 16, fontWeight: '600', color: '#FFF', textAlign: 'center', textDecorationLine: 'underline' },
  overlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.45)', justifyContent: 'center', alignItems: 'center', zIndex: 1000 },
  modal: { backgroundColor: '#FFF', width: '85%', borderRadius: 20, padding: 24, alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 10 },
  modalTitle: { fontSize: 20, fontWeight: '700', marginBottom: 12, textAlign: 'center' },
  modalTitleSuccess: { color: '#27AE60' },
  modalTitleError: { color: '#E74C3C' },
  modalMessage: { fontSize: 15, textAlign: 'center', marginBottom: 24, color: '#555', lineHeight: 22 },
  modalButton: { paddingHorizontal: 32, paddingVertical: 14, borderRadius: 14, minWidth: 150 },
  modalButtonSuccess: { backgroundColor: '#27AE60' },
  modalButtonError: { backgroundColor: '#1E88E5' },
  modalButtonText: { color: '#FFF', fontWeight: '600', fontSize: 16, textAlign: 'center' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#FFF' },
  loadingText: { marginTop: 16, fontSize: 16, color: '#666' },
=======
  container: { 
    flex: 1, 
    backgroundColor: '#fff',
    position: 'relative',
  },
  visualArea: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 0,
    overflow: 'hidden',
  },
  ellipseLine: {
    position: 'absolute',
    borderWidth: 1.5,
    borderColor: COLORS.line,
    borderRadius: 999,
  },
  staticDot: {
    position: 'absolute',
    width: 10,
    height: 10,
    borderRadius: 5,
    borderWidth: 2,
    borderColor: COLORS.dot,
    backgroundColor: '#fff',
  },
  headerSafeArea: {
    backgroundColor: 'transparent',
    zIndex: 10,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight || 20 : 10,
    paddingBottom: 10,
    backgroundColor: 'transparent',
  },
  backButton: { 
    flexDirection: 'row', 
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
  backIconCircle: { 
    width: 32, 
    height: 32, 
    borderRadius: 16, 
    backgroundColor: '#fff', 
    justifyContent: 'center', 
    alignItems: 'center', 
    borderWidth: 1, 
    borderColor: COLORS.line,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  backText: { 
    color: COLORS.primary, 
    marginLeft: 10, 
    fontWeight: '700', 
    fontSize: 16 
  },
  keyboardView: {
    flex: 1,
    width: '100%',
  },
  scrollView: {
    flex: 1,
    width: '100%',
  },
  scrollContentContainer: {
    flexGrow: 1,
    paddingHorizontal: 25,
    paddingBottom: 30,
    paddingTop: 10,
  },
  content: {
    width: '100%',
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  logo: {
    width: width * 0.9,
    height: 150,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1.5,
    borderColor: '#f4f4f4',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
  },
  title: {
    fontSize: 24,
    fontWeight: '900',
    color: COLORS.textMain,
    textAlign: 'center',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#888',
    textAlign: 'center',
    marginBottom: 20,
  },
  photoSection: {
    marginBottom: 20,
  },
  photoLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textMain,
    marginBottom: 10,
    textAlign: 'center',
  },
  photoContainer: {
    alignItems: 'center',
  },
  photoWrapper: {
    marginBottom: 10,
  },
  photo: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: COLORS.primary,
  },
  photoPlaceholder: {
    backgroundColor: '#F8F9FA',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: COLORS.line,
    borderStyle: 'dashed',
  },
  photoPlaceholderText: {
    color: COLORS.primary,
    fontSize: 12,
    marginTop: 5,
    textAlign: 'center',
  },
  removePhotoButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    padding: 8,
    backgroundColor: '#FEE',
    borderRadius: 20,
  },
  removePhotoText: {
    color: '#FF6B6B',
    fontSize: 12,
    fontWeight: '600',
  },
  formContainer: {
    gap: 16,
  },
  inputGroup: {
    gap: 6,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textMain,
    marginLeft: 4,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.inputBg,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#f0f0f0',
    paddingHorizontal: 12,
  },
  inputIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    height: 48,
    fontSize: 15,
    color: COLORS.textMain,
  },
  inputWithIcon: {
    paddingRight: 40,
  },
  eyeButton: {
    position: 'absolute',
    right: 12,
    height: '100%',
    justifyContent: 'center',
  },
  senhaSection: {
    backgroundColor: '#F8F9FA',
    borderRadius: 16,
    padding: 16,
    marginTop: 8,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.textMain,
    marginBottom: 12,
  },
  confirmarSenhaGroup: {
    marginTop: 8,
  },
  forcaSenhaContainer: {
    marginTop: 8,
    marginBottom: 12,
  },
  barraForcaContainer: {
    height: 6,
    backgroundColor: '#E0E0E0',
    borderRadius: 3,
    overflow: 'hidden',
  },
  barraForca: {
    height: '100%',
    borderRadius: 3,
  },
  textoForca: {
    fontSize: 12,
    fontWeight: '600',
    marginTop: 4,
    textAlign: 'right',
  },
  requisitosListaContainer: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 12,
    marginTop: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  requisitosTitulo: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textMain,
    marginBottom: 12,
  },
  requisitoItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    marginBottom: 10,
    padding: 8,
    backgroundColor: '#F8F9FA',
    borderRadius: 8,
  },
  requisitoIcone: {
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 2,
  },
  requisitoIconeOk: {
    backgroundColor: '#4CAF50',
  },
  requisitoIconePendente: {
    backgroundColor: '#FFA726',
  },
  requisitoTextoContainer: {
    flex: 1,
  },
  requisitoItemTexto: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.textMain,
    marginBottom: 2,
  },
  requisitoItemTextoOk: {
    color: '#4CAF50',
    textDecorationLine: 'line-through',
  },
  requisitoItemDescricao: {
    color: '#888',
    fontSize: 11,
  },
  requisitoCheck: {
    marginLeft: 'auto',
    paddingLeft: 8,
  },
  progressoRequisitos: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  progressoBarraContainer: {
    width: '100%',
  },
  progressoBarraTexto: {
    fontSize: 12,
    textAlign: 'center',
    marginBottom: 8,
    color: COLORS.textMain,
  },
  progressoBarraBackground: {
    height: 8,
    backgroundColor: '#E0E0E0',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressoBarraPreenchimento: {
    height: '100%',
    backgroundColor: '#4CAF50',
    borderRadius: 4,
  },
  senhasCoincidemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#FFF',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  senhasCoincidemTexto: {
    fontSize: 13,
    fontWeight: '500',
  },
  requisitosBasicos: {
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  requisitosBasicosText: {
    color: '#666',
    fontSize: 12,
    marginBottom: 4,
    lineHeight: 18,
  },
  buttonWrapper: {
    width: '100%',
    borderRadius: 22,
    overflow: 'hidden',
    elevation: 4,
    marginTop: 8,
  },
  primaryButton: {
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '800',
  },
  buttonIcon: {
    marginRight: 8,
  },
  footer: {
    marginBottom: 15,
    alignItems: 'center',
  },
  footerLinkText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.primary,
    textAlign: 'center',
  },
  termsContainer: {
    marginTop: 5,
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  termsText: {
    fontSize: 12,
    color: '#888',
    textAlign: 'center',
    lineHeight: 18,
  },
  termsLink: {
    color: COLORS.primary,
    fontWeight: '600',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1000,
  },
  overlayBackground: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modal: {
    backgroundColor: '#FFF',
    width: '100%',
    maxWidth: 400,
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#f4f4f4',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  modalHeader: {
    alignItems: 'center',
    marginBottom: 15,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginTop: 10,
    color: COLORS.textMain,
    textAlign: 'center',
  },
  modalMessage: {
    fontSize: 15,
    textAlign: 'center',
    marginBottom: 25,
    color: '#555',
    lineHeight: 22,
  },
  modalButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 40,
    paddingVertical: 14,
    borderRadius: 20,
    minWidth: 120,
  },
  modalButtonText: {
    color: '#FFF',
    fontWeight: '700',
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
>>>>>>> 15ffb65c04d79bb26a33c4943e3b3f667e969db0
});