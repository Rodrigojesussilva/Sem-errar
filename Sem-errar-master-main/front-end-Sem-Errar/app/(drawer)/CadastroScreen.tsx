import FontAwesome from '@expo/vector-icons/FontAwesome';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Haptics from 'expo-haptics';
import * as ImagePicker from 'expo-image-picker';
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

  // Estado para a foto
  const [photo, setPhoto] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

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

  // FUNÇÃO pickImage - IGUAL AO EXEMPLO
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

  const validarFormulario = () => {
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

    if (senha.length < 6) {
      setFeedback({
        visible: true,
        title: 'Senha muito curta',
        message: 'A senha deve ter no mínimo 6 caracteres.',
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

      let dadosOnboarding = userData;
      if (!dadosOnboarding) {
        console.log('⚠️ userData está null, tentando carregar do storage novamente...');

        const chavesParaTentar = ['@userDataCompleto', 'userDataCompleto', '@userData', 'userData'];

        for (const chave of chavesParaTentar) {
          const dadosStorage = await AsyncStorage.getItem(chave);
          if (dadosStorage) {
            try {
              dadosOnboarding = JSON.parse(dadosStorage);
              setUserData(dadosOnboarding);
              break;
            } catch (e) {
              console.log(`❌ Erro ao parsear chave ${chave}:`, e);
            }
          }
        }
      }

      const formData = new FormData();

      // Campos básicos
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

        // @ts-ignore - Necessário para FormData no React Native
        formData.append('foto', {
          uri: photo,
          name: filename,
          type,
        });

        console.log('📸 Foto anexada:', filename);
      }

      // Adicionar dados do onboarding
      if (dadosOnboarding) {
        console.log('✅ Dados do onboarding encontrados! Adicionando ao envio...');

        const camposParaEnviar: (keyof UserData)[] = [
          'objetivo', 'objetivoCompleto', 'sexo', 'faixaIdade',
          'alturaUnidade', 'altura', 'alturaFt', 'alturaIn', 'alturaCm',
          'pesoUnidade', 'pesoKg', 'pesoLb', 'pesoEmKg',
          'frequenciaTreino', 'nivelAtividade', 'frequenciaTreinoDescricao', 'treinaAtualmente',
          'querLembretesAgua', 'coposAguaDia',
          'frequenciaCardio', 'frequenciaCardioDescricao',
          'pescocoCm', 'cinturaCm', 'quadrilCm'
        ];

        camposParaEnviar.forEach(campo => {
          const valor = dadosOnboarding[campo];

          if (valor !== undefined && valor !== null) {
            let valorParaEnvio: string;

            if (typeof valor === 'object') {
              valorParaEnvio = JSON.stringify(valor);
            } else {
              valorParaEnvio = String(valor);
            }

            formData.append(campo, valorParaEnvio);
            console.log(`  ${campo}:`, valor);
          }
        });
      } else {
        console.log('⚠️ Nenhum dado do onboarding disponível para envio');
      }

      console.log('\n📤 Enviando requisição para o servidor...');

      const response = await fetch('http://10.0.2.2:3000/usuarios', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'multipart/form-data',
        },
        body: formData,
      });

      const contentType = response.headers.get('content-type') || '';
      let data;

      if (contentType.includes('application/json')) {
        data = await response.json();
      } else {
        const text = await response.text();
        throw new Error(`Erro no servidor (Status: ${response.status})`);
      }

      if (!response.ok) {
        throw new Error(data.erro || data.message || `Erro ${response.status}`);
      }

      console.log('✅ Cadastro realizado com sucesso!');
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
    }
  };

  // Função para visualizar dados do storage
  const visualizarDadosStorage = async () => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

      const todasChaves = await AsyncStorage.getAllKeys();
      const dados = await AsyncStorage.multiGet(todasChaves);

      let mensagem = '📱  DADOS DO STORAGE  📱\n';
      mensagem += '══════════════════════════\n\n';

      dados.forEach(([key, value]) => {
        if (value) {
          mensagem += `🔑 ${key}\n`;
          mensagem += `📌 ${value.substring(0, 100)}${value.length > 100 ? '...' : ''}\n\n`;
        }
      });

      Alert.alert('📦 Dados do Storage', mensagem);
    } catch (error) {
      console.error('Erro ao ler storage:', error);
    }
  };

  // Função para limpar storage
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
                  <TouchableOpacity style={styles.debugButton} onPress={visualizarDadosStorage}>
                    <FontAwesome name="database" size={16} color="#666" />
                    <Text style={styles.debugButtonText}>Ver dados</Text>
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

              {/* SEÇÃO DE FOTO - SEM IMAGEM, SÓ ÍCONE */}
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

              <TouchableOpacity
                style={[styles.button, loading && { opacity: 0.7 }]}
                onPress={handleSubmit}
                disabled={loading}
              >
                {loading ? <ActivityIndicator color="#FFF" /> : <Text style={styles.buttonText}>Cadastrar</Text>}
              </TouchableOpacity>

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

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF' },
  scrollContent: { flexGrow: 1, padding: 20, justifyContent: 'center' },
  logoContainer: { alignItems: 'center', marginBottom: 30 },
  logo: { width: 240, height: 130 },
  slogan: { fontSize: 16, color: '#666', marginTop: 10, fontStyle: 'italic', textAlign: 'center' },
  debugContainer: { flexDirection: 'row', justifyContent: 'center', gap: 10, marginTop: 10 },
  debugButton: { flexDirection: 'row', alignItems: 'center', padding: 8, backgroundColor: '#F0F0F0', borderRadius: 20, gap: 8 },
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
  requisitos: { marginTop: 12, paddingHorizontal: 8 },
  requisitosText: { color: '#E0E0E0', fontSize: 12, marginBottom: 2 },
  dadosCarregados: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 16, gap: 8, backgroundColor: 'rgba(76, 175, 80, 0.2)', padding: 10, borderRadius: 20 },
  dadosCarregadosText: { color: '#FFF', fontSize: 13, fontWeight: '500' },
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
});