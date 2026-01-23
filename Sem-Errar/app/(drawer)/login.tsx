import AsyncStorage from '@react-native-async-storage/async-storage';
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

export default function LoginScreen() {
  const router = useRouter();
  const { height } = Dimensions.get('window');

  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [loading, setLoading] = useState(false);
  const [erroVisivel, setErroVisivel] = useState(false);
  const [mensagemErro, setMensagemErro] = useState('');

  const emailRef = useRef<TextInput>(null);
  const senhaRef = useRef<TextInput>(null);

  const handleLogin = async () => {
    Keyboard.dismiss();

    if (!email || !senha) {
      setMensagemErro('Preencha todos os campos.');
      setErroVisivel(true);
      return;
    }

    // Validação básica de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setMensagemErro('Digite um e-mail válido.');
      setErroVisivel(true);
      return;
    }

    try {
      setLoading(true);

      // URL CORRETA: /logar (não /usuarios/logar)
      const response = await fetch('http://10.0.2.2:3000/logar', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ email, senha }),
      });

      // Verificar se a resposta é JSON
      const contentType = response.headers.get('content-type') || '';
      
      if (!contentType.includes('application/json')) {
        const text = await response.text();
        throw new Error('Erro no servidor. Tente novamente.');
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.erro || 'Erro ao fazer login');
      }

      // Validar dados recebidos
      if (!data || !data.id) {
        throw new Error('Dados inválidos recebidos do servidor.');
      }

      // Salvar usuário no AsyncStorage
      await AsyncStorage.setItem('@usuario', JSON.stringify(data));

      // Navegar para a tela home
      router.replace('/');

    } catch (error: any) {
      let mensagem = 'Não foi possível conectar ao servidor.';
      
      if (error.message.includes('Usuário')) {
        mensagem = error.message;
      } else if (error.message.includes('Senha')) {
        mensagem = error.message;
      } else if (error.message.includes('servidor')) {
        mensagem = 'Erro no servidor. Tente novamente.';
      } else if (error.message.includes('Network')) {
        mensagem = 'Não foi possível conectar ao servidor. Verifique sua conexão.';
      }
      
      setMensagemErro(mensagem);
      setErroVisivel(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 40 : 0}
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
            <Text style={styles.slogan}>Evolua com dados, siga o plano</Text>
          </View>

          {/* CARD */}
          <LinearGradient colors={['#1E88E5', '#8E44AD']} style={styles.card}>
            <Text style={styles.title}>Entrar</Text>

            <Text style={styles.label}>E-mail</Text>
            <TextInput
              ref={emailRef}
              style={styles.input}
              placeholder="seu@email.com"
              placeholderTextColor="#757575"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
              returnKeyType="next"
              onSubmitEditing={() => senhaRef.current?.focus()}
            />

            <Text style={styles.label}>Senha</Text>
            <TextInput
              ref={senhaRef}
              style={styles.input}
              placeholder="Sua senha"
              placeholderTextColor="#757575"
              value={senha}
              onChangeText={setSenha}
              secureTextEntry
              returnKeyType="done"
              onSubmitEditing={handleLogin}
            />

            <TouchableOpacity
              style={[styles.button, loading && { opacity: 0.7 }]}
              onPress={handleLogin}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#FFF" />
              ) : (
                <Text style={styles.buttonText}>Entrar</Text>
              )}
            </TouchableOpacity>

            <View style={styles.footer}>
              <TouchableOpacity onPress={() => router.push('/cadastro')}>
                <Text style={styles.footerLinkText}>
                  Não tem conta? Cadastre-se
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.esqueciSenha}
                onPress={() => {
                  setMensagemErro('Funcionalidade em desenvolvimento.');
                  setErroVisivel(true);
                }}
              >
                <Text style={styles.esqueciSenhaText}>Esqueci minha senha</Text>
              </TouchableOpacity>
            </View>
          </LinearGradient>

          <View style={{ height: 80 }} />
        </ScrollView>

        {/* MODAL DE ERRO */}
        {erroVisivel && (
          <View style={styles.overlay}>
            <View style={styles.modal}>
              <Text style={styles.modalTitle}>Atenção</Text>
              <Text style={styles.modalMessage}>{mensagemErro}</Text>
              <TouchableOpacity
                style={styles.modalButton}
                onPress={() => setErroVisivel(false)}
              >
                <Text style={styles.modalButtonText}>OK</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF' },
  scrollContent: { flexGrow: 1, padding: 20, justifyContent: 'center' },
  logoContainer: { alignItems: 'center', marginBottom: 30 },
  logo: { width: 240, height: 130 },
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
    marginBottom: 20 
  },
  label: { 
    color: '#FFF', 
    fontWeight: '600', 
    marginBottom: 6, 
    marginTop: 12,
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
    marginBottom: 10,
  },
  esqueciSenha: {
    marginTop: 8,
  },
  esqueciSenhaText: {
    fontSize: 14,
    color: '#E0E0E0',
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
  },
  modal: { 
    backgroundColor: '#FFF', 
    width: '80%', 
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
    fontSize: 18, 
    fontWeight: '600', 
    marginBottom: 8,
    color: '#333',
  },
  modalMessage: { 
    fontSize: 15, 
    textAlign: 'center', 
    marginBottom: 20, 
    color: '#555',
    lineHeight: 22,
  },
  modalButton: { 
    backgroundColor: '#1E88E5', 
    paddingHorizontal: 32, 
    paddingVertical: 12, 
    borderRadius: 14,
    minWidth: 100,
  },
  modalButtonText: { 
    color: '#FFF', 
    fontWeight: '600', 
    fontSize: 16,
  },
});