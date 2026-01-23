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

  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState({
    visible: false,
    title: '',
    message: '',
    success: false,
  });

  const emailRef = useRef<TextInput>(null);
  const confirmarEmailRef = useRef<TextInput>(null);
  const idadeRef = useRef<TextInput>(null);

  const handleSubmit = async () => {
    Keyboard.dismiss();

    // validações
    if (!nome || !email || !confirmarEmail || !idade) {
      return setFeedback({
        visible: true,
        title: 'Campos obrigatórios',
        message: 'Preencha todos os campos.',
        success: false,
      });
    }

    if (email !== confirmarEmail) {
      return setFeedback({
        visible: true,
        title: 'E-mails diferentes',
        message: 'Os e-mails não conferem.',
        success: false,
      });
    }

    if (Number(idade) < 14) {
      return setFeedback({
        visible: true,
        title: 'Idade inválida',
        message: 'Idade mínima: 14 anos.',
        success: false,
      });
    }

    try {
      setLoading(true);

      const response = await fetch('http://10.0.2.2:3000/usuarios', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nome,
          email,
          senha: idade, // provisório
          tipoUsuario: 0,
          foto: null,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Erro ao cadastrar');
      }

      setFeedback({
        visible: true,
        title: 'Cadastro realizado 🎉',
        message: 'Sua conta foi criada com sucesso!',
        success: true,
      });
    } catch (error: any) {
      setFeedback({
        visible: true,
        title: 'Erro 😕',
        message: error.message || 'Erro de conexão',
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
            </View>

            {/* CARD */}
            <LinearGradient colors={['#1E88E5', '#8E44AD']} style={styles.card}>
              <Text style={styles.title}>Crie sua conta</Text>
              <Text style={styles.subtitle}>
                Informe seus dados para continuar
              </Text>

              <Text style={styles.label}>Nome completo</Text>
              <TextInput
                style={styles.input}
                value={nome}
                onChangeText={setNome}
                returnKeyType="next"
                onSubmitEditing={() => emailRef.current?.focus()}
              />

              <Text style={styles.label}>E-mail</Text>
              <TextInput
                ref={emailRef}
                style={styles.input}
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
                returnKeyType="next"
                onSubmitEditing={() => confirmarEmailRef.current?.focus()}
              />

              <Text style={styles.label}>Confirmar e-mail</Text>
              <TextInput
                ref={confirmarEmailRef}
                style={styles.input}
                keyboardType="email-address"
                autoCapitalize="none"
                value={confirmarEmail}
                onChangeText={setConfirmarEmail}
                returnKeyType="next"
                onSubmitEditing={() => idadeRef.current?.focus()}
              />

              <Text style={styles.label}>Idade</Text>
              <TextInput
                ref={idadeRef}
                style={styles.input}
                keyboardType="numeric"
                value={idade}
                onChangeText={setIdade}
                returnKeyType="done"
                onSubmitEditing={handleSubmit}
              />

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
            </LinearGradient>

            <View style={{ height: 80 }} />
          </ScrollView>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>

      {/* MODAL */}
      {feedback.visible && (
        <View style={styles.overlay}>
          <View style={styles.modal}>
            <Text style={styles.modalTitle}>{feedback.title}</Text>
            <Text style={styles.modalMessage}>{feedback.message}</Text>

            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => {
                setFeedback({ ...feedback, visible: false });
                if (feedback.success) {
                  router.replace('/login'); // redireciona para login
                }
              }}
            >
              <Text style={styles.modalButtonText}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
}

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF' },
  scrollContent: { flexGrow: 1, padding: 20, justifyContent: 'center' },
  logoContainer: { alignItems: 'center', marginBottom: 30 },
  logo: { width: 240, height: 130 },
  card: {
    borderRadius: 24,
    padding: 24,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 6,
  },
  title: { fontSize: 22, color: '#FFF', fontWeight: '600', textAlign: 'center', marginBottom: 8 },
  subtitle: { fontSize: 14, color: '#E0E0E0', textAlign: 'center', marginBottom: 20 },
  label: { color: '#FFF', fontWeight: '600', marginBottom: 6, marginTop: 12 },
  input: { backgroundColor: '#FFF', borderRadius: 14, height: 52, paddingHorizontal: 16, fontSize: 16 },
  button: { backgroundColor: '#27AE60', height: 56, borderRadius: 16, justifyContent: 'center', alignItems: 'center', marginTop: 28 },
  buttonText: { color: '#FFF', fontSize: 18, fontWeight: '600' },
  overlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.45)', justifyContent: 'center', alignItems: 'center' },
  modal: { backgroundColor: '#FFF', width: '80%', borderRadius: 20, padding: 24, alignItems: 'center' },
  modalTitle: { fontSize: 18, fontWeight: '600', marginBottom: 8 },
  modalMessage: { fontSize: 15, textAlign: 'center', marginBottom: 20, color: '#555' },
  modalButton: { backgroundColor: '#1E88E5', paddingHorizontal: 24, paddingVertical: 10, borderRadius: 14 },
  modalButtonText: { color: '#FFF', fontWeight: '600', fontSize: 16 },
});
