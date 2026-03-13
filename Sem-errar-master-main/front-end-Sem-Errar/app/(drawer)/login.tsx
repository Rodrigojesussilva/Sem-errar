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
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import API_URL from "../../conf/api";

export default function LoginScreen() {
  const router = useRouter();
  const { height } = Dimensions.get("window");
  const auth = useContext(AuthContext);

  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [loading, setLoading] = useState(false);
  const [erroVisivel, setErroVisivel] = useState(false);
  const [mensagemErro, setMensagemErro] = useState("");

  const emailRef = useRef<TextInput>(null);
  const senhaRef = useRef<TextInput>(null);

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
      
      // CORREÇÃO: usar /logar em vez de /login
      const url = `${API_URL}/logar`;
      console.log("📤 Enviando login para:", url);
      console.log("📧 Email:", email);
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, senha }),
      });

      console.log("📥 Status da resposta:", response.status);
      
      if (!response.ok) {
        const errorData = await response.json();
        console.error("❌ Erro do servidor:", errorData);
        
        setMensagemErro(errorData.erro || `Erro ${response.status}`);
        setErroVisivel(true);
        return;
      }

      const data = await response.json();
      console.log("📦 Resposta do servidor recebida");

      if (!data.nome) {
        console.error("❌ ERRO: Nome não veio na resposta!");
        console.log("Dados recebidos:", data);
        setMensagemErro("Dados incompletos do servidor");
        setErroVisivel(true);
        return;
      }

      console.log("✅ Dados válidos recebidos:");
      console.log("   👤 Nome:", data.nome);
      console.log("   📧 Email:", data.email);
      console.log("   🆔 ID:", data.id);
      console.log("   📸 Foto:", data.foto ? "URL recebida" : "sem foto");

      // Preparar dados do usuário
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

      console.log("🧹 Chamando limparTudoEAutenticar...");
      await auth?.limparTudoEAutenticar(usuarioReal, data.token);
      
      console.log("✅ Login concluído! Redirecionando...");
      router.replace("/(drawer)/TreinoDiarioScreen");
      
    } catch (error: any) {
      console.error("❌ Erro detalhado no login:", error);
      
      let mensagem = "Erro ao conectar ao servidor.";
      
      if (error.message.includes("Network request failed")) {
        mensagem = "Não foi possível conectar ao servidor. Verifique se o backend está rodando em http://10.0.2.2:3000";
      } else {
        mensagem = error.message || "Erro desconhecido";
      }
      
      setMensagemErro(mensagem);
      setErroVisivel(true);
    } finally {
      setLoading(false);
    }
  };

  const handleCadastro = () => {
    router.push("/(drawer)/CadastroScreen");
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

  const handleLoginRapido = (tipo: 'demo' | 'admin') => {
    if (tipo === 'demo') {
      setEmail("rodrigo@gmail.com");
      setSenha("Rjs@1980");
    } else {
      setEmail("admin@fitness.com");
      setSenha("admin123");
    }
  };

  // Verificar se o auth está disponível
  if (!auth) {
    return null;
  }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
      >
        <ScrollView
          contentContainerStyle={[
            styles.scrollContent,
            { minHeight: height },
          ]}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* LOGO */}
          <View style={styles.logoContainer}>
            <LinearGradient
              colors={["#1E88E5", "#8E44AD"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.logoGradient}
            >
              <Image
                source={require("@/assets/images/logo.png")}
                style={[styles.logo, height < 700 && { width: 200, height: 110 }]}
                resizeMode="contain"
              />
            </LinearGradient>
            <Text style={styles.slogan}>Transforme sua saúde com dados inteligentes</Text>
          </View>

          {/* CARD DE LOGIN */}
          <LinearGradient
            colors={["#FFFFFF", "#F8F9FA"]}
            style={styles.card}
          >
            <View style={styles.cardHeader}>
              <Text style={styles.title}>Bem-vindo de volta!</Text>
              <Text style={styles.subtitle}>Entre com sua conta para continuar</Text>
            </View>

            {/* FORMULÁRIO */}
            <View style={styles.formContainer}>
              {/* EMAIL */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>
                  <Ionicons name="mail" size={16} color="#666" /> Email
                </Text>
                <TextInput
                  ref={emailRef}
                  style={[styles.input, loading && styles.inputDisabled]}
                  placeholder="seu@email.com"
                  placeholderTextColor="#999"
                  value={email}
                  onChangeText={setEmail}
                  autoCapitalize="none"
                  keyboardType="email-address"
                  returnKeyType="next"
                  onSubmitEditing={() => senhaRef.current?.focus()}
                  editable={!loading}
                  autoComplete="email"
                />
              </View>

              {/* SENHA */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>
                  <Ionicons name="lock-closed" size={16} color="#666" /> Senha
                </Text>
                <View style={styles.passwordContainer}>
                  <TextInput
                    ref={senhaRef}
                    style={[styles.input, styles.inputPassword, loading && styles.inputDisabled]}
                    placeholder="Sua senha"
                    placeholderTextColor="#999"
                    value={senha}
                    onChangeText={setSenha}
                    secureTextEntry={!mostrarSenha}
                    returnKeyType="done"
                    onSubmitEditing={handleLogin}
                    editable={!loading}
                    autoComplete="password"
                  />
                  <TouchableOpacity
                    style={styles.eyeButton}
                    onPress={() => setMostrarSenha(!mostrarSenha)}
                    disabled={loading}
                  >
                    <Ionicons
                      name={mostrarSenha ? "eye-off" : "eye"}
                      size={22}
                      color="#666"
                    />
                  </TouchableOpacity>
                </View>
              </View>

              {/* ESQUECI SENHA */}
              <TouchableOpacity 
                style={styles.forgotPassword} 
                onPress={handleEsqueciSenha}
                disabled={loading}
              >
                <Text style={styles.forgotPasswordText}>Esqueceu sua senha?</Text>
              </TouchableOpacity>

              {/* BOTÃO ENTRAR */}
              <TouchableOpacity
                style={[styles.button, loading && styles.buttonDisabled]}
                onPress={handleLogin}
                disabled={loading}
                activeOpacity={0.8}
              >
                {loading ? (
                  <ActivityIndicator color="#FFF" />
                ) : (
                  <>
                    <Ionicons name="log-in" size={20} color="#FFF" style={styles.buttonIcon} />
                    <Text style={styles.buttonText}>Entrar</Text>
                  </>
                )}
              </TouchableOpacity>

              {/* LOGIN RÁPIDO PARA TESTE */}
              <View style={styles.quickLoginContainer}>
                <Text style={styles.quickLoginTitle}>Login rápido para teste:</Text>
                <View style={styles.quickLoginButtons}>
                  <TouchableOpacity
                    style={styles.quickLoginButton}
                    onPress={() => handleLoginRapido('demo')}
                    disabled={loading}
                  >
                    <Ionicons name="person" size={16} color="#666" />
                    <Text style={styles.quickLoginButtonText}>Demo</Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* DIVISOR */}
              <View style={styles.divider}>
                <View style={styles.dividerLine} />
                <Text style={styles.dividerText}>ou</Text>
                <View style={styles.dividerLine} />
              </View>

              {/* BOTÃO CADASTRAR */}
              <TouchableOpacity
                style={[styles.secondaryButton, loading && styles.buttonDisabled]}
                onPress={handleCadastro}
                disabled={loading}
                activeOpacity={0.8}
              >
                <Ionicons name="person-add" size={20} color="#1E88E5" style={styles.buttonIcon} />
                <Text style={styles.secondaryButtonText}>Criar nova conta</Text>
              </TouchableOpacity>
            </View>

            {/* BENEFÍCIOS */}
            <View style={styles.benefitsContainer}>
              <Text style={styles.benefitsTitle}>Com uma conta você pode:</Text>
              <View style={styles.benefitsList}>
                <View style={styles.benefitItem}>
                  <Ionicons name="checkmark-circle" size={18} color="#4CAF50" />
                  <Text style={styles.benefitText}>Salvar seus dados biométricos</Text>
                </View>
                <View style={styles.benefitItem}>
                  <Ionicons name="checkmark-circle" size={18} color="#4CAF50" />
                  <Text style={styles.benefitText}>Acompanhar seu progresso</Text>
                </View>
                <View style={styles.benefitItem}>
                  <Ionicons name="checkmark-circle" size={18} color="#4CAF50" />
                  <Text style={styles.benefitText}>Receber planos personalizados</Text>
                </View>
              </View>
            </View>
          </LinearGradient>

          {/* TERMOS */}
          <View style={styles.termsContainer}>
            <Text style={styles.termsText}>
              Ao entrar, você concorda com nossos{" "}
              <Text style={styles.termsLink}>Termos de Serviço</Text> e{" "}
              <Text style={styles.termsLink}>Política de Privacidade</Text>.
            </Text>
          </View>
        </ScrollView>

        {/* MODAL ERRO */}
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
    backgroundColor: "#F8F9FA" 
  },
  scrollContent: {
    flexGrow: 1,
    padding: 20,
    justifyContent: "center",
  },
  logoContainer: { 
    alignItems: "center", 
    marginBottom: 40,
    marginTop: 20 
  },
  logoGradient: {
    width: 240,
    height: 130,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 15,
    shadowColor: "#1E88E5",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  logo: { 
    width: 220, 
    height: 110 
  },
  slogan: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    fontStyle: "italic",
    maxWidth: 280,
    lineHeight: 22,
  },
  card: {
    borderRadius: 24,
    padding: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
    backgroundColor: "#FFF",
  },
  cardHeader: {
    alignItems: "center",
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    color: "#1E88E5",
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
  },
  formContainer: {
    marginBottom: 24,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    color: "#333",
    fontWeight: "600",
    marginBottom: 8,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  input: {
    backgroundColor: "#F8F9FA",
    borderRadius: 12,
    height: 56,
    paddingHorizontal: 16,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#E9ECEF",
    color: "#333",
  },
  inputPassword: {
    paddingRight: 48,
  },
  inputDisabled: {
    opacity: 0.7,
  },
  passwordContainer: {
    position: "relative",
  },
  eyeButton: {
    position: "absolute",
    right: 0,
    height: "100%",
    width: 48,
    justifyContent: "center",
    alignItems: "center",
  },
  forgotPassword: {
    alignSelf: "flex-end",
    marginBottom: 24,
  },
  forgotPasswordText: {
    color: "#1E88E5",
    fontSize: 14,
    fontWeight: "500",
  },
  button: {
    backgroundColor: "#1E88E5",
    height: 56,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    shadowColor: "#1E88E5",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonIcon: {
    marginRight: 10,
  },
  buttonText: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "600",
  },
  quickLoginContainer: {
    marginTop: 20,
    marginBottom: 16,
  },
  quickLoginTitle: {
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
    textAlign: "center",
  },
  quickLoginButtons: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 12,
  },
  quickLoginButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 6,
  },
  quickLoginButtonText: {
    color: "#666",
    fontSize: 14,
    fontWeight: "500",
  },
  divider: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: "#E0E0E0",
  },
  dividerText: {
    color: "#666",
    paddingHorizontal: 15,
    fontSize: 14,
    fontWeight: "500",
  },
  secondaryButton: {
    backgroundColor: "#FFF",
    height: 56,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    borderWidth: 2,
    borderColor: "#1E88E5",
  },
  secondaryButtonText: {
    color: "#1E88E5",
    fontSize: 16,
    fontWeight: "600",
  },
  benefitsContainer: {
    marginTop: 24,
    paddingTop: 24,
    borderTopWidth: 1,
    borderTopColor: "#F0F0F0",
  },
  benefitsTitle: {
    fontSize: 16,
    color: "#333",
    fontWeight: "600",
    marginBottom: 12,
  },
  benefitsList: {
    gap: 10,
  },
  benefitItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  benefitText: {
    fontSize: 14,
    color: "#666",
    flex: 1,
  },
  termsContainer: {
    marginTop: 32,
    paddingHorizontal: 20,
  },
  termsText: {
    fontSize: 12,
    color: "#888",
    textAlign: "center",
    lineHeight: 18,
  },
  termsLink: {
    color: "#1E88E5",
    fontWeight: "500",
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1000,
  },
  overlayBackground: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modal: {
    backgroundColor: "#FFF",
    width: "100%",
    maxWidth: 400,
    borderRadius: 20,
    padding: 24,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
  modalHeader: {
    alignItems: "center",
    marginBottom: 15,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "700",
    marginTop: 10,
    color: "#333",
    textAlign: "center",
  },
  modalMessage: {
    fontSize: 15,
    textAlign: "center",
    marginBottom: 25,
    color: "#555",
    lineHeight: 22,
  },
  modalButton: {
    backgroundColor: "#1E88E5",
    paddingHorizontal: 40,
    paddingVertical: 14,
    borderRadius: 12,
    minWidth: 120,
  },
  modalButtonText: {
    color: "#FFF",
    fontWeight: "600",
    fontSize: 16,
    textAlign: "center",
  },
});