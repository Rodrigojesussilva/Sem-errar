import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useRef, useState } from 'react';
import {
  ActivityIndicator,
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
      return;
    }

    try {
      setLoading(true);

      console.log('Enviando cadastro:', { nome, email, idade, senha });

      const response = await fetch('http://10.0.2.2:3000/usuarios', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          nome,
          email,
          senha, // Senha real
          idade: parseInt(idade),
          tipoUsuario: 0,
          foto: null,
        }),
      });

      // Verificar tipo de resposta
      const contentType = response.headers.get('content-type') || '';
      
      let data;
      if (contentType.includes('application/json')) {
        data = await response.json();
      } else {
        const text = await response.text();
        console.log('Resposta não-JSON:', text.substring(0, 200));
        throw new Error(`Erro no servidor (Status: ${response.status})`);
      }

      if (!response.ok) {
        throw new Error(data.erro || data.message || `Erro ${response.status}`);
      }

      // Sucesso
      setFeedback({
        visible: true,
        title: 'Cadastro realizado 🎉',
        message: 'Sua conta foi criada com sucesso! Faça login para continuar.',
        success: true,
      });

    } catch (error: any) {
      console.error('Erro no cadastro:', error);
      
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
    }
  };

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
});