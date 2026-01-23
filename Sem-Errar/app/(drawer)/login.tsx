import { LinearGradient } from 'expo-linear-gradient';
import { Link } from 'expo-router';
import React, { useRef, useState } from 'react';
import {
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
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const scrollViewRef = useRef<ScrollView>(null);
  const emailRef = useRef<TextInput>(null);
  const passwordRef = useRef<TextInput>(null);
  const { height: screenHeight } = Dimensions.get('window');

  const handleSubmit = () => {
    Keyboard.dismiss();
    // Lógica de login aqui
    console.log('Login com:', { email, password });
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 40 : 0}
      >
        <ScrollView
          ref={scrollViewRef}
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* LOGO */}
          <View style={styles.logoContainer}>
            <View style={styles.logoWrapper}>
              <Image
                source={require('@/assets/images/logo.png')}
                style={[
                  styles.logo,
                  screenHeight < 700 && { width: 220, height: 120 }
                ]}
                resizeMode="contain"
              />
            </View>
          </View>

          {/* CARD COM DEGRADÊ */}
          <LinearGradient
            colors={['#1E88E5', '#8E44AD']}
            style={[
              styles.card,
              screenHeight < 700 && styles.cardCompact
            ]}
          >
            <Text style={styles.cardTitle}>Entrar</Text>

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
              onSubmitEditing={() => passwordRef.current?.focus()}
              blurOnSubmit={false}
            />

            <Text style={styles.label}>Senha</Text>
            <TextInput
              ref={passwordRef}
              style={styles.input}
              placeholder="Sua senha"
              placeholderTextColor="#757575"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              returnKeyType="done"
              onSubmitEditing={handleSubmit}
            />

            {/* BOTÃO ENTRAR */}
            <TouchableOpacity 
              style={styles.button}
              onPress={handleSubmit}
              activeOpacity={0.8}
            >
              <Text style={styles.buttonText}>Entrar</Text>
            </TouchableOpacity>

            {/* FOOTER - CORRIGIDO */}
            <View style={styles.footer}>
              <Link href="/cadastro" asChild>
                <TouchableOpacity>
                  <Text style={styles.footerLinkText}>Não tem conta? Cadastre-se</Text>
                </TouchableOpacity>
              </Link>
            </View>
          </LinearGradient>
          
          {/* Espaço extra para evitar que o teclado cubra */}
          <View style={{ height: 50 }} />
        </ScrollView>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
}

// ESTILOS FORA DO COMPONENTE
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingVertical: 20,
  },

  /* LOGO */
  logoContainer: {
    alignItems: 'center',
    marginBottom: 30,
    marginTop: 20,
  },

  logoWrapper: {
    borderRadius: 24,
    padding: 14,
    backgroundColor: 'rgba(30,136,229,0.08)',
  },

  logo: {
    width: 240,
    height: 130,
  },

  /* CARD */
  card: {
    borderRadius: 24,
    paddingTop: 24,
    paddingHorizontal: 24,
    paddingBottom: 24,
    shadowColor: '#000',
    shadowOpacity: 0.18,
    shadowRadius: 14,
    elevation: 6,
    marginBottom: 20,
  },

  cardCompact: {
    paddingTop: 20,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },

  cardTitle: {
    fontSize: 22,
    fontFamily: 'Inter',
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 22,
    textAlign: 'center',
  },

  label: {
    fontSize: 14,
    fontFamily: 'Inter',
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 6,
    marginTop: 14,
  },

  input: {
    height: 52,
    borderRadius: 14,
    paddingHorizontal: 16,
    fontSize: 16,
    fontFamily: 'Inter',
    backgroundColor: '#FFFFFF',
    color: '#333333',
  },

  /* BOTÃO */
  button: {
    backgroundColor: '#27AE60',
    height: 56,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 28,
  },

  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontFamily: 'Inter',
    fontWeight: '600',
  },

  /* FOOTER */
  footer: {
    marginTop: 22,
    alignItems: 'center',
    backgroundColor: 'transparent',
  },

  footerLinkText: {
    fontSize: 16,
    fontFamily: 'Inter',
    fontWeight: '600',
    color: '#FFFFFF',
    textAlign: 'center',
    textDecorationLine: 'underline',
  },
});