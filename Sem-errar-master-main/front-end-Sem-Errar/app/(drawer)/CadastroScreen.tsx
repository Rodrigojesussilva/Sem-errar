import FontAwesome from '@expo/vector-icons/FontAwesome';
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
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import API_URL from '../../conf/api';

// ============ INTERFACES E TIPOS ============
interface ObjetivoCompleto {
  id: string;
  title: string;
  description?: string;
  icon?: string;
  color?: string;
}

interface UserData {
  nome?: string;
  objetivo: string;
  sexo: string;
  idade: number;
  faixaIdade: string | null;
  alturaUnidade: string | null;
  altura: number | null;
  alturaCm: number;
  pesoUnidade: string | null;
  pesoKg: number | null;
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
  const { height } = Dimensions.get('window');

  // Estados dos campos
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [confirmarEmail, setConfirmarEmail] = useState('');
  const [idade, setIdade] = useState('');
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
  const idadeRef = useRef<TextInput>(null);
  const senhaRef = useRef<TextInput>(null);
  const confirmarSenhaRef = useRef<TextInput>(null);

  // ============ FUNÇÕES DE SENHA ============

  // Função para verificar requisitos em tempo real
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

  // Função para atualizar requisitos (chamada apenas no onChangeText)
  const atualizarRequisitosSenha = useCallback((text: string) => {
    const novosRequisitos = verificarRequisitosSenha(text);
    setRequisitosSenha(novosRequisitos);
  }, [verificarRequisitosSenha]);

  // Função para verificar a força da senha
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

    if (pontuacao <= 30) {
      return { cor: '#FF4444', texto: 'Muito Fraca', porcentagem: 20, nivel: 1 };
    } else if (pontuacao <= 50) {
      return { cor: '#FF7043', texto: 'Fraca', porcentagem: 40, nivel: 2 };
    } else if (pontuacao <= 70) {
      return { cor: '#FFA726', texto: 'Média', porcentagem: 60, nivel: 3 };
    } else if (pontuacao <= 90) {
      return { cor: '#4CAF50', texto: 'Forte', porcentagem: 80, nivel: 4 };
    } else {
      return { cor: '#2E7D32', texto: 'Muito Forte', porcentagem: 100, nivel: 5 };
    }
  }, [verificarRequisitosSenha]);

  // Componente Indicador de Força da Senha
  const IndicadorForcaSenha = React.memo(() => {
    const forcaInfo = getForcaSenhaInfo(senha);

    return (
      <View style={styles.forcaSenhaContainer}>
        <View style={styles.barraForcaContainer}>
          <View style={[
            styles.barraForca,
            {
              width: forcaInfo.porcentagem,
              backgroundColor: forcaInfo.cor
            }
          ]} />
        </View>
        <Text style={[styles.textoForca, { color: forcaInfo.cor }]}>
          {forcaInfo.texto}
        </Text>
      </View>
    );
  });

  // Componente Lista de Requisitos
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
              <View style={[
                styles.requisitoIcone,
                atendido ? styles.requisitoIconeOk : styles.requisitoIconePendente
              ]}>
                <FontAwesome
                  name={atendido ? "check" : "lock"}
                  size={10}
                  color="#FFF"
                />
              </View>
              <View style={styles.requisitoTextoContainer}>
                <Text style={[
                  styles.requisitoItemTexto,
                  atendido && styles.requisitoItemTextoOk
                ]}>
                  {req.texto}
                </Text>
                {!atendido && senha.length > 0 && (
                  <Text style={styles.requisitoItemDescricao}>
                    {req.descricao}
                  </Text>
                )}
              </View>
              {atendido && (
                <View style={styles.requisitoCheck}>
                  <FontAwesome name="check-circle" size={16} color="#4CAF50" />
                </View>
              )}
            </View>
          );
        })}

        {/* Barra de progresso dos requisitos */}
        {senha.length > 0 && (
          <View style={styles.progressoRequisitos}>
            <View style={styles.progressoBarraContainer}>
              <Text style={styles.progressoBarraTexto}>
                {requisitosAtendidos} de 6 requisitos atendidos
              </Text>
              <View style={styles.progressoBarraBackground}>
                <View
                  style={[
                    styles.progressoBarraPreenchimento,
                    { width: `${(requisitosAtendidos / 6) * 100}%` }
                  ]}
                />
              </View>
            </View>
          </View>
        )}
      </View>
    );
  });

  // Função para validar senha completa
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
    console.log('🔄 Componente montado - iniciando carregamento...');
    carregarDadosStorage();
  }, []);

  const carregarDadosStorage = async () => {
    try {
      setCarregandoDados(true);
      console.log('🔍 ===== INICIANDO DEBUG DO STORAGE =====');

      const todasChaves = await AsyncStorage.getAllKeys();
      console.log('📋 Todas as chaves no storage:', todasChaves);

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
        console.log(`🔎 Procurando na chave: ${chave}`);
        const valor = await AsyncStorage.getItem(chave);
        if (valor) {
          console.log(`✅ Dados encontrados na chave: ${chave}`);
          try {
            dadosEncontrados = JSON.parse(valor);
            console.log('📦 Conteúdo parseado:', dadosEncontrados);
            break;
          } catch (e) {
            console.log(`❌ Erro ao fazer parse da chave ${chave}:`, e);
          }
        }
      }

      if (dadosEncontrados) {
        console.log('✅ userData carregado com sucesso!');
        setUserData(dadosEncontrados);

        if (dadosEncontrados.idade) {
          console.log('📅 Idade encontrada no storage:', dadosEncontrados.idade);
          setIdade(dadosEncontrados.idade.toString());
        }

        if (dadosEncontrados.nome) {
          setNome(dadosEncontrados.nome);
        }
      } else {
        console.log('⚠️ Nenhum dado do onboarding encontrado no storage');
      }

      console.log('🔍 ===== FIM DO DEBUG DO STORAGE =====');
    } catch (error) {
      console.error('❌ Erro ao carregar dados do storage:', error);
    } finally {
      setCarregandoDados(false);
      console.log('✅ Carregamento finalizado');
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

              console.log('Resultado da câmera:', result);

              if (!result.canceled && result.assets && result.assets[0]) {
                const uri = result.assets[0].uri;
                console.log('URI da foto:', uri);
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

              console.log('Resultado da galeria:', result);

              if (!result.canceled && result.assets && result.assets[0]) {
                const uri = result.assets[0].uri;
                console.log('URI da foto:', uri);
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
    if (!nome || !email || !confirmarEmail || !idade || !senha || !confirmarSenha) {
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
  }, [nome, email, confirmarEmail, idade, senha, confirmarSenha, validarSenhaCompleta]);

  // ============ FUNÇÃO DE ENVIO ============

  // Substitua a função handleSubmit existente por esta:

  const handleSubmit = async () => {
    Keyboard.dismiss();

    if (!validarFormulario()) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      return;
    }

    try {
      setLoading(true);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

      console.log('\n🚀 ===== INICIANDO PROCESSO DE CADASTRO =====');

      // Primeiro, enviar e-mail de verificação
      // Enviar e-mail de verificação - URL CORRIGIDA
      const emailResponse = await fetch(`${API_URL}/usuarios/enviar-codigo-verificacao`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          nome
        }),
      });;

      const emailData = await emailResponse.json();

      if (!emailResponse.ok) {
        throw new Error(emailData.erro || 'Erro ao enviar e-mail de verificação');
      }

      console.log('✅ E-mail de verificação enviado');

      // Preparar FormData com todos os dados do cadastro
      const formData = new FormData();

      // Campos básicos obrigatórios
      formData.append('nome', nome);
      formData.append('email', email);
      formData.append('senha', senha);
      formData.append('idade', idade);
      formData.append('tipoUsuario', '0');

      // Adicionar foto se existir
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

      // Adicionar dados do onboarding
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

      if (dadosOnboarding) {
        const camposParaEnviar: (keyof UserData)[] = [
          'objetivo', 'sexo', 'faixaIdade',
          'alturaUnidade', 'altura', 'alturaCm',
          'pesoUnidade', 'pesoKg', 'pesoLb',
          'frequenciaTreino', 'nivelAtividade', 'frequenciaTreinoDescricao', 'treinaAtualmente',
          'querLembretesAgua', 'coposAguaDia',
          'pescocoCm', 'cinturaCm', 'quadrilCm'
        ];

        camposParaEnviar.forEach(campo => {
          const valor = dadosOnboarding[campo];
          if (valor !== undefined && valor !== null) {
            formData.append(campo, String(valor));
          }
        });
      }

      // Salvar formData para usar após verificação
      const formDataString = JSON.stringify({
        ...Object.fromEntries(formData as any),
        _photo: photo // salvar referência da foto
      });

      await AsyncStorage.setItem('@dadosCadastroPendente', formDataString);
      if (photo) {
        await AsyncStorage.setItem('@fotoTemp', photo);
      }

      // Redirecionar para verificação
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

  // ============ FUNÇÕES DE RELATÓRIO ============

  const visualizarDadosStorage = async () => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

      const todasChaves = await AsyncStorage.getAllKeys();
      const dados = await AsyncStorage.multiGet(todasChaves);

      let userDataEncontrado = null;

      for (const [key, value] of dados) {
        if (value && (key.includes('userData') || key.includes('@userData'))) {
          try {
            userDataEncontrado = JSON.parse(value);
            break;
          } catch (e) {
            console.log('Erro ao parsear:', e);
          }
        }
      }

      if (!userDataEncontrado) {
        Alert.alert(
          'ℹ️ Nenhum dado encontrado',
          'Complete o onboarding primeiro para ver seus dados.'
        );
        return;
      }

      const relatorio = `
  📊  SEU PERFIL FITNESS  📊
  ══════════════════════

  👤 DADOS PESSOAIS
  ••••••••••••••••••
  📋 Nome: ${userDataEncontrado.nome || nome || 'Não informado'}
  🎂 Idade: ${userDataEncontrado.idade || userDataEncontrado.faixaIdade || idade || 'Não informada'}
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
  📅 Dados salvos em: ${new Date().toLocaleDateString('pt-BR')}

  ✨ DICA DO DIA
  •••••••••••••
  ${gerarDicaDoDia(userDataEncontrado)}

  💪 Continue firme nos seus objetivos!
        `;

      Alert.alert(
        '📋 Meu Relatório Fitness',
        relatorio,
        [
          {
            text: 'Compartilhar',
            onPress: () => {
              Alert.alert('Compartilhar', 'Funcionalidade em desenvolvimento');
            }
          },
          { text: 'Fechar', style: 'cancel' }
        ],
        { cancelable: true }
      );

    } catch (error) {
      console.error('Erro ao gerar relatório:', error);
      Alert.alert('Erro', 'Não foi possível gerar o relatório.');
    }
  };

  // Funções auxiliares para formatação
  const formatarAltura = (dados: any) => {
    if (dados.alturaCm) {
      const metros = (dados.alturaCm / 100).toFixed(2);
      return `${dados.alturaCm} cm (${metros.replace('.', ',')} m)`;
    }
    if (dados.altura) {
      return `${dados.altura} cm`;
    }
    return 'Não informada';
  };

  const formatarPeso = (dados: any) => {
    if (dados.pesoKg) {
      return `${dados.pesoKg} kg`;
    }
    if (dados.pesoLb) {
      return `${dados.pesoLb} lb (${(dados.pesoLb * 0.453592).toFixed(1)} kg)`;
    }
    return 'Não informado';
  };

  const formatarObjetivo = (objetivo: string) => {
    if (!objetivo) return null;

    const icones: { [key: string]: string } = {
      'emagrecer': '🔥',
      'ganhar-massa': '💪',
      'definir': '✨',
      'saude': '❤️',
      'resistencia': '🏃'
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

    if (dados.objetivo === 'emagrecer') {
      return "Combine exercícios aeróbicos com musculação para melhores resultados! 🔥";
    }
    if (dados.objetivo === 'ganhar-massa') {
      return "Foque na progressão de carga e na execução correta dos exercícios! 💪";
    }

    return dicas[Math.floor(Math.random() * dicas.length)];
  };

  // ============ FUNÇÃO DE LIMPAR STORAGE ============

  const limparStorage = async () => {
    Alert.alert(
      'Limpar Storage',
      'Tem certeza que deseja limpar todos os dados?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Limpar',
          style: 'destructive',
          onPress: async () => {
            try {
              await AsyncStorage.clear();
              setUserData(null);
              setIdade('');
              setNome('');
              setPhoto(null);
              Alert.alert('Sucesso', 'Storage limpo com sucesso!');
            } catch (error) {
              console.error('Erro ao limpar storage:', error);
            }
          }
        }
      ]
    );
  };

  // ============ RENDER ============

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

              {__DEV__ && (
                <View style={styles.debugContainer}>
                  <TouchableOpacity
                    style={[styles.debugButton, styles.debugButtonVer]}
                    onPress={visualizarDadosStorage}
                  >
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

            {/* CARD */}
            <LinearGradient colors={['#1E88E5', '#8E44AD']} style={styles.card}>
              <Text style={styles.title}>Crie sua conta</Text>
              <Text style={styles.subtitle}>Informe seus dados para continuar</Text>

              {/* SEÇÃO DE FOTO */}
              <Text style={{ textAlign: 'center', marginBottom: 8, color: '#FFF' }}>
                Clique para adicionar foto de perfil
              </Text>

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
                  <TouchableOpacity
                    style={styles.removePhotoButton}
                    onPress={() => setPhoto(null)}
                  >
                    <FontAwesome name="times-circle" size={20} color="#FF4444" />
                    <Text style={styles.removePhotoText}>Remover Foto</Text>
                  </TouchableOpacity>
                )}
              </View>

              {/* CAMPOS DO FORMULÁRIO */}
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
                onSubmitEditing={() => {
                  setSenhaTocada(true);
                  senhaRef.current?.focus();
                }}
              />

              {/* SEÇÃO DE SENHA - CAMPOS JUNTOS */}
              <View style={styles.senhaSection}>
                <Text style={styles.sectionTitle}>Senha</Text>

                {/* CAMPO SENHA COM VISUALIZAÇÃO */}
                <View style={styles.senhaContainer}>
                  <TextInput
                    ref={senhaRef}
                    style={[styles.input, styles.inputSenha]}
                    placeholder="Crie uma senha forte"
                    placeholderTextColor="#757575"
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
                  />
                  <TouchableOpacity
                    style={styles.iconeSenha}
                    onPress={() => {
                      setMostrarSenha(!mostrarSenha);
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    }}
                  >
                    <FontAwesome
                      name={mostrarSenha ? "eye-slash" : "eye"}
                      size={22}
                      color="#666"
                    />
                  </TouchableOpacity>
                </View>

                {/* CAMPO CONFIRMAR SENHA COM VISUALIZAÇÃO */}
                <View style={[styles.senhaContainer, styles.confirmarSenhaContainer]}>
                  <TextInput
                    ref={confirmarSenhaRef}
                    style={[styles.input, styles.inputSenha]}
                    placeholder="Digite a senha novamente"
                    placeholderTextColor="#757575"
                    secureTextEntry={!mostrarConfirmarSenha}
                    value={confirmarSenha}
                    onChangeText={(text) => {
                      setConfirmarSenha(text);
                      setConfirmarSenhaTocada(true);
                    }}
                    onFocus={() => setConfirmarSenhaTocada(true)}
                    returnKeyType="done"
                    onSubmitEditing={handleSubmit}
                  />
                  <TouchableOpacity
                    style={styles.iconeSenha}
                    onPress={() => {
                      setMostrarConfirmarSenha(!mostrarConfirmarSenha);
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    }}
                  >
                    <FontAwesome
                      name={mostrarConfirmarSenha ? "eye-slash" : "eye"}
                      size={22}
                      color="#666"
                    />
                  </TouchableOpacity>
                </View>

                {/* INDICADOR DE FORÇA DA SENHA */}
                {senhaTocada && senha.length > 0 && (
                  <>
                    <IndicadorForcaSenha />
                    <ListaRequisitosSenha />
                  </>
                )}

                {/* INDICADOR DE CONFIRMAÇÃO DE SENHA */}
                {confirmarSenhaTocada && confirmarSenha.length > 0 && (
                  <View style={styles.senhasCoincidemContainer}>
                    <FontAwesome
                      name={senha === confirmarSenha ? "check-circle" : "exclamation-circle"}
                      size={16}
                      color={senha === confirmarSenha ? "#4CAF50" : "#FF4444"}
                    />
                    <Text style={[
                      styles.senhasCoincidemTexto,
                      { color: senha === confirmarSenha ? "#4CAF50" : "#FF4444" }
                    ]}>
                      {senha === confirmarSenha ? "Senhas coincidem ✓" : "Senhas diferentes ✗"}
                    </Text>
                  </View>
                )}
              </View>

              {/* REQUISITOS BÁSICOS */}
              <View style={styles.requisitosBasicos}>
                <Text style={styles.requisitosBasicosText}>• Idade mínima: 14 anos</Text>
                <Text style={styles.requisitosBasicosText}>• Senha forte: 8+ caracteres, maiúscula, minúscula, número e caractere especial</Text>
              </View>

              {/* INDICADOR DE DADOS CARREGADOS */}
              {userData ? (
                <View style={styles.dadosCarregados}>
                  <FontAwesome name="check-circle" size={16} color="#4CAF50" />
                  <Text style={styles.dadosCarregadosText}>Dados do onboarding carregados ✓</Text>
                </View>
              ) : (
                <View style={[styles.dadosCarregados, { backgroundColor: 'rgba(255, 68, 68, 0.2)' }]}>
                  <FontAwesome name="exclamation-circle" size={16} color="#FF4444" />
                  <Text style={[styles.dadosCarregadosText, { color: '#FF4444' }]}>
                    Nenhum dado do onboarding encontrado
                  </Text>
                </View>
              )}

              {/* BOTÃO DE CADASTRO */}
              <TouchableOpacity
                style={[styles.button, loading && { opacity: 0.7 }]}
                onPress={handleSubmit}
                disabled={loading}
              >
                {loading ? <ActivityIndicator color="#FFF" /> : <Text style={styles.buttonText}>Cadastrar</Text>}
              </TouchableOpacity>

              {/* LINK PARA LOGIN */}
              <View style={styles.footer}>
                <TouchableOpacity onPress={() => router.push('/login')}>
                  <Text style={styles.footerLinkText}>Já tem uma conta? Faça login</Text>
                </TouchableOpacity>
              </View>
            </LinearGradient>
          </ScrollView>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>

      {/* MODAL DE FEEDBACK */}
      {feedback.visible && (
        <View style={styles.overlay}>
          <View style={styles.modal}>
            <Text style={[styles.modalTitle, feedback.success ? styles.modalTitleSuccess : styles.modalTitleError]}>
              {feedback.title}
            </Text>
            <Text style={styles.modalMessage}>{feedback.message}</Text>
            <TouchableOpacity
              style={[styles.modalButton, feedback.success ? styles.modalButtonSuccess : styles.modalButtonError]}
              onPress={() => {
                setFeedback({ ...feedback, visible: false });
                if (feedback.success) router.replace('/login');
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

// ============ STYLES ============
const styles = StyleSheet.create({
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
  photoPlaceholder: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFF',
    borderStyle: 'dashed',
  },
  photoPlaceholderText: { color: '#FFF', fontSize: 12, marginTop: 5, textAlign: 'center' },
  removePhotoButton: { flexDirection: 'row', alignItems: 'center', marginTop: 10, gap: 8 },
  removePhotoText: { color: '#FFF', fontSize: 14 },
  input: { backgroundColor: '#FFF', borderRadius: 14, height: 52, paddingHorizontal: 16, fontSize: 16, borderWidth: 1, borderColor: '#DDD' },

  // SEÇÃO DE SENHA
  senhaSection: {
    marginTop: 16,
    padding: 16,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 16,
  },
  sectionTitle: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },

  // Estilos para senha
  senhaContainer: { position: 'relative', width: '100%' },
  confirmarSenhaContainer: { marginTop: 12 },
  inputSenha: { paddingRight: 50 },
  iconeSenha: { position: 'absolute', right: 16, top: 14, zIndex: 1, padding: 5 },
  forcaSenhaContainer: { marginTop: 8, marginBottom: 12 },
  barraForcaContainer: { height: 6, backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 3, overflow: 'hidden' },
  barraForca: { height: '100%', borderRadius: 3 },
  textoForca: { fontSize: 12, fontWeight: '600', marginTop: 4, textAlign: 'right' },

  // Estilos para lista de requisitos
  requisitosListaContainer: {
    backgroundColor: 'rgba(0,0,0,0.25)',
    borderRadius: 16,
    padding: 16,
    marginTop: 8,
    marginBottom: 8,
  },
  requisitosTitulo: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 12,
  },
  requisitoItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    marginBottom: 12,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 12,
    padding: 10,
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
    color: '#FFF',
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 2,
  },
  requisitoItemTextoOk: {
    color: '#4CAF50',
    textDecorationLine: 'line-through',
  },
  requisitoItemDescricao: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 11,
  },
  requisitoCheck: {
    marginLeft: 'auto',
    paddingLeft: 8,
  },

  // Estilos para barra de progresso
  progressoRequisitos: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.1)',
  },
  progressoBarraContainer: {
    width: '100%',
  },
  progressoBarraTexto: {
    color: '#FFF',
    fontSize: 12,
    textAlign: 'center',
    marginBottom: 8,
  },
  progressoBarraBackground: {
    height: 8,
    backgroundColor: '#FFF',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressoBarraPreenchimento: {
    height: '100%',
    backgroundColor: '#4CAF50',
    borderRadius: 4,
  },

  // Estilos para confirmação de senha
  senhasCoincidemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 8,
    marginBottom: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: 'rgba(0,0,0,0.2)',
    borderRadius: 20,
  },
  senhasCoincidemTexto: {
    fontSize: 13,
    fontWeight: '500',
  },

  // Estilos para requisitos básicos
  requisitosBasicos: {
    marginTop: 12,
    paddingHorizontal: 12,
    backgroundColor: 'rgba(0,0,0,0.15)',
    borderRadius: 12,
    padding: 12,
  },
  requisitosBasicosText: {
    color: '#E0E0E0',
    fontSize: 12,
    marginBottom: 4,
    lineHeight: 18,
  },

  // Outros estilos
  dadosCarregados: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
    gap: 8,
    backgroundColor: 'rgba(76, 175, 80, 0.2)',
    padding: 12,
    borderRadius: 20
  },
  dadosCarregadosText: {
    color: '#FFF',
    fontSize: 13,
    fontWeight: '500'
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
    elevation: 3
  },
  buttonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '600'
  },
  footer: {
    marginTop: 22,
    alignItems: 'center'
  },
  footerLinkText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFF',
    textAlign: 'center',
    textDecorationLine: 'underline'
  },

  // Modal
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000
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
    elevation: 10
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 12,
    textAlign: 'center'
  },
  modalTitleSuccess: {
    color: '#27AE60'
  },
  modalTitleError: {
    color: '#E74C3C'
  },
  modalMessage: {
    fontSize: 15,
    textAlign: 'center',
    marginBottom: 24,
    color: '#555',
    lineHeight: 22
  },
  modalButton: {
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 14,
    minWidth: 150
  },
  modalButtonSuccess: {
    backgroundColor: '#27AE60'
  },
  modalButtonError: {
    backgroundColor: '#1E88E5'
  },
  modalButtonText: {
    color: '#FFF',
    fontWeight: '600',
    fontSize: 16,
    textAlign: 'center'
  },

  // Loading
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFF'
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666'
  },
});