import { AuthContext, Usuario } from "@/app/(drawer)/AuthContext";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useContext, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
  StatusBar,
} from "react-native";
import API_URL from "../../conf/api";

const { width, height } = Dimensions.get("window");

const COLORS = {
  primary: '#622db2',
  dot: '#4ecdc4',
  line: 'rgba(112, 82, 230, 0.15)',
  textMain: '#1A1A1A',
  disabled: '#F0F0F0',
  inputBg: '#F8F9FA',
};

export default function LoginScreen() {
  const router = useRouter();
  const auth = useContext(AuthContext);

  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [loading, setLoading] = useState(false);
  const [erroVisivel, setErroVisivel] = useState(false);
  const [mensagemErro, setMensagemErro] = useState("");

  const emailRef = useRef<TextInput>(null);
  const senhaRef = useRef<TextInput>(null);

  // Elementos estáticos de fundo (igual à tela ObjetivoScreen)
  const renderStaticBackground = () => (
    <View style={styles.visualArea}>
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

  const validarFormulario = (): { valido: boolean; erros: string[] } => {
    const erros: string[] = [];

    if (!email.trim()) {
      erros.push("O email é obrigatório");
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      erros.push("Por favor, insira um email válido");
    }

    if (!senha.trim()) {
      erros.push("A senha é obrigatória");
    } else if (senha.length < 6) {
      erros.push("A senha deve ter pelo menos 6 caracteres");
    }

    return {
      valido: erros.length === 0,
      erros,
    };
  };

  const handleLogin = async () => {
    Keyboard.dismiss();

    const validacao = validarFormulario();
    if (!validacao.valido) {
      setMensagemErro(validacao.erros.join("\n"));
      setErroVisivel(true);
      return;
    }

    try {
      setLoading(true);
      
      const url = `${API_URL}/logar`;
      console.log("📤 Enviando login para:", url);
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, senha }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setMensagemErro(errorData.erro || `Erro ${response.status}`);
        setErroVisivel(true);
        return;
      }

      const data = await response.json();

      if (!data.nome) {
        setMensagemErro("Dados incompletos do servidor");
        setErroVisivel(true);
        return;
      }

      const usuarioReal: Usuario = {
        id: data.id.toString(),
        nome: data.nome,
        email: data.email,
        foto: data.foto,
        altura: data.altura?.toString(),
        peso: data.pesoKg?.toString(),
        idade: data.idade?.toString(),
        objetivo: data.objetivo,
      };

      await auth?.limparTudoEAutenticar(usuarioReal, data.token);
      router.replace("/(drawer)/diarias");
      
    } catch (error: any) {
      let mensagem = "Erro ao conectar ao servidor.";
      
      if (error.message.includes("Network request failed")) {
        mensagem = "Não foi possível conectar ao servidor. Verifique se o backend está rodando.";
      } else {
        mensagem = error.message || "Erro desconhecido";
      }
      
      setMensagemErro(mensagem);
      setErroVisivel(true);
    } finally {
      setLoading(false);
    }
  };

  const handleEsqueciSenha = () => {
    Alert.alert(
      "Recuperar Senha",
      "Digite seu email para receber as instruções de recuperação.",
      [
        { text: "Cancelar", style: "cancel" },
        { 
          text: "Enviar", 
          onPress: async () => {
            if (!email) {
              Alert.alert("Atenção", "Digite seu email primeiro");
              return;
            }
            try {
              setLoading(true);
              const response = await fetch(`${API_URL}/recuperar-senha`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email })
              });
              
              if (response.ok) {
                Alert.alert("Sucesso", "Email de recuperação enviado!");
              } else {
                Alert.alert("Erro", "Email não encontrado");
              }
            } catch (error) {
              Alert.alert("Erro", "Erro ao enviar email");
            } finally {
              setLoading(false);
            }
          }
        }
      ]
    );
  };

  if (!auth) {
    return null;
  }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={Platform.OS === "ios" ? 40 : 0}
      >
        <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
        
        {/* Camada de fundo fixa com elipses */}
        <View style={StyleSheet.absoluteFill}>
          <View style={{ flex: 1, backgroundColor: '#fff' }} />
          {renderStaticBackground()}
        </View>

        {/* Header com botão de voltar */}
        <View style={styles.header}>
          <Pressable 
            onPress={() => router.replace('/(drawer)')} 
            style={styles.backButton}
          >
            <View style={styles.backIconCircle}>
              <Ionicons name="chevron-back" size={12} color={COLORS.primary} />
            </View>
            <Text style={styles.backText}>Voltar</Text>
          </Pressable>
        </View>

        {/* Conteúdo principal centralizado */}
        <View style={styles.content}>
          {/* Logo GIGANTE */}
          <View style={styles.logoContainer}>
            <Image 
              source={require("@/assets/images/completa-sem-fundo1.png")} 
              style={styles.logo}
              resizeMode="contain"
            />
          </View>

          {/* Card de Login */}
          <View style={styles.card}>
            <Text style={styles.welcomeText}>Bem-vindo de volta!</Text>
            <Text style={styles.subtitle}>Entre com sua conta para continuar</Text>

            {/* Formulário */}
            <View style={styles.formContainer}>
              {/* Email */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Email</Text>
                <View style={styles.inputWrapper}>
                  <Ionicons name="mail-outline" size={20} color="#888" style={styles.inputIcon} />
                  <TextInput
                    ref={emailRef}
                    style={styles.input}
                    placeholder="seu@email.com"
                    placeholderTextColor="#999"
                    value={email}
                    onChangeText={setEmail}
                    autoCapitalize="none"
                    keyboardType="email-address"
                    returnKeyType="next"
                    onSubmitEditing={() => senhaRef.current?.focus()}
                    editable={!loading}
                  />
                </View>
              </View>

              {/* Senha */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Senha</Text>
                <View style={styles.inputWrapper}>
                  <Ionicons name="lock-closed-outline" size={20} color="#888" style={styles.inputIcon} />
                  <TextInput
                    ref={senhaRef}
                    style={[styles.input, styles.inputWithIcon]}
                    placeholder="Sua senha"
                    placeholderTextColor="#999"
                    value={senha}
                    onChangeText={setSenha}
                    secureTextEntry={!mostrarSenha}
                    returnKeyType="done"
                    onSubmitEditing={handleLogin}
                    editable={!loading}
                  />
                  <TouchableOpacity
                    style={styles.eyeButton}
                    onPress={() => setMostrarSenha(!mostrarSenha)}
                    disabled={loading}
                  >
                    <Ionicons
                      name={mostrarSenha ? "eye-off-outline" : "eye-outline"}
                      size={20}
                      color="#888"
                    />
                  </TouchableOpacity>
                </View>
              </View>

              {/* Esqueci senha */}
              <TouchableOpacity 
                style={styles.forgotPassword} 
                onPress={handleEsqueciSenha}
                disabled={loading}
              >
                <Text style={styles.forgotPasswordText}>Esqueceu sua senha?</Text>
              </TouchableOpacity>

              {/* Botão Entrar com gradiente */}
              <Pressable
                onPress={handleLogin}
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
                    <Ionicons name="log-in-outline" size={20} color="#FFF" style={styles.buttonIcon} />
                    <Text style={styles.primaryButtonText}>Entrar</Text>
                  </LinearGradient>
                ) : (
                  <View style={[styles.primaryButton, { backgroundColor: COLORS.disabled }]}>
                    <ActivityIndicator color="#FFF" />
                  </View>
                )}
              </Pressable>
            </View>
          </View>

          {/* Termos de uso */}
          <View style={styles.termsContainer}>
            <Text style={styles.termsText}>
              Ao entrar, você concorda com nossos{" "}
              <Text style={styles.termsLink}>Termos de Serviço</Text> e{" "}
              <Text style={styles.termsLink}>Política de Privacidade</Text>.
            </Text>
          </View>
        </View>

        {/* Modal de Erro */}
        {erroVisivel && (
          <View style={styles.overlay}>
            <TouchableWithoutFeedback onPress={() => setErroVisivel(false)}>
              <View style={styles.overlayBackground}>
                <View style={styles.modal}>
                  <View style={styles.modalHeader}>
                    <Ionicons
                      name="alert-circle"
                      size={48}
                      color="#FF6B6B"
                    />
                    <Text style={styles.modalTitle}>Atenção</Text>
                  </View>
                  <Text style={styles.modalMessage}>{mensagemErro}</Text>
                  <TouchableOpacity
                    style={styles.modalButton}
                    onPress={() => setErroVisivel(false)}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.modalButtonText}>Entendi</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableWithoutFeedback>
          </View>
        )}
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#fff',
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
  header: {
    paddingHorizontal: 25,
    paddingTop: StatusBar.currentHeight ? StatusBar.currentHeight + 10 : 40,
    zIndex: 100,
  },
  backButton: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    alignSelf: 'flex-start' 
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
  },
  backText: { 
    color: COLORS.primary, 
    marginLeft: 10, 
    fontWeight: '700', 
    fontSize: 16 
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 25,
    marginTop: -40, // Ajuste fino para centralizar melhor considerando o header
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  logo: {
    width: width * 0.9,
    height: 150,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 24,
    marginBottom: 20,
    borderWidth: 1.5,
    borderColor: '#f4f4f4',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: '900',
    color: COLORS.textMain,
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#888',
    textAlign: 'center',
    marginBottom: 24,
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
  forgotPassword: {
    alignItems: 'center', // Centraliza horizontalmente
    marginTop: 4,
  },
  forgotPasswordText: {
    color: COLORS.primary,
    fontSize: 14,
    fontWeight: '600',
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
  termsContainer: {
    marginTop: 10,
    paddingHorizontal: 10,
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
});