import FontAwesome from '@expo/vector-icons/FontAwesome';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
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

export default function VerificarEmailScreen() {
  const router = useRouter();
  const { email: emailParam, nome: nomeParam } = useLocalSearchParams<{ email: string; nome: string }>();
  
  const [codigo, setCodigo] = useState(['', '', '', '', '', '']);
  const [email, setEmail] = useState(emailParam || '');
  const [loading, setLoading] = useState(false);
  const [reenviando, setReenviando] = useState(false);
  const [tempoRestante, setTempoRestante] = useState(60);
  const [podeReenviar, setPodeReenviar] = useState(false);
  
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const inputRefs = useRef<Array<TextInput | null>>([]);

  useEffect(() => {
    if (!email) {
      router.replace('/CadastroScreen');
    }
  }, [email]);

  useEffect(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    if (tempoRestante > 0 && !podeReenviar) {
      timerRef.current = setTimeout(() => {
        setTempoRestante(prev => prev - 1);
      }, 1000);
    } else if (tempoRestante === 0) {
      setPodeReenviar(true);
    }

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [tempoRestante, podeReenviar]);

  const handleCodigoChange = (text: string, index: number) => {
    if (text.length > 1) {
      const codigoCompleto = text.slice(0, 6).split('');
      const novoCodigo = [...codigo];
      codigoCompleto.forEach((char, i) => {
        if (i < 6) novoCodigo[i] = char;
      });
      setCodigo(novoCodigo);
      
      if (inputRefs.current[5]) {
        inputRefs.current[5]?.focus();
      }
    } else {
      const novoCodigo = [...codigo];
      novoCodigo[index] = text;
      setCodigo(novoCodigo);

      if (text && index < 5) {
        inputRefs.current[index + 1]?.focus();
      }
    }

    // Se completou 6 dígitos, verificar automaticamente
    const codigoCompleto = [...codigo];
    codigoCompleto[index] = text;
    if (codigoCompleto.every(d => d !== '')) {
      setTimeout(() => verificarCodigo(), 300);
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === 'Backspace' && !codigo[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const setInputRef = (index: number) => (ref: TextInput | null) => {
    inputRefs.current[index] = ref;
  };

  const criarContaEAutenticar = async (tokenVerificacao: string) => {
    try {
      console.log('📝 Criando conta...');
      
      // Recuperar dados salvos
      const dadosString = await AsyncStorage.getItem('@dadosCadastroPendente');
      const fotoTemp = await AsyncStorage.getItem('@fotoTemp');
      
      if (!dadosString) {
        throw new Error('Dados do cadastro não encontrados');
      }

      const dadosObj = JSON.parse(dadosString);
      
      // Recriar FormData
      const formData = new FormData();
      
      // Adicionar todos os campos
      Object.entries(dadosObj).forEach(([key, value]) => {
        if (key !== '_photo' && value !== null && value !== undefined) {
          formData.append(key, String(value));
        }
      });

      // Adicionar foto se existir
      if (fotoTemp) {
        const filename = fotoTemp.split('/').pop() || 'foto.jpg';
        const match = /\.(\w+)$/.exec(filename);
        const type = match ? `image/${match[1]}` : 'image/jpeg';

        // @ts-ignore
        formData.append('foto', {
          uri: fotoTemp,
          name: filename,
          type,
        });
      }

      // Enviar para o servidor com token de verificação
      const response = await fetch(`${API_URL}/usuarios`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'x-verification-token': tokenVerificacao,
        },
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.erro || 'Erro ao criar conta');
      }

      console.log('✅ Conta criada! ID:', data.usuario.id);

      // Fazer login automático
      const loginResponse = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          senha: dadosObj.senha,
        }),
      });

      const loginData = await loginResponse.json();

      if (!loginResponse.ok) {
        throw new Error('Erro no login automático');
      }

      console.log('✅ Login automático realizado!');

      // Salvar token e dados do usuário
      await AsyncStorage.setItem('@token', loginData.token);
      await AsyncStorage.setItem('@userLogado', JSON.stringify(loginData));

      // Limpar dados temporários
      await AsyncStorage.removeItem('@dadosCadastroPendente');
      await AsyncStorage.removeItem('@fotoTemp');

      // Feedback de sucesso
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      
      Alert.alert(
        '🎉 Cadastro concluído!',
        `Bem-vindo ao FitApp, ${loginData.nome || nomeParam}!`,
        [
          {
            text: 'Continuar',
            onPress: () => router.replace('/(drawer)/perfil'), // Redirecionar para a tela principal
          },
        ]
      );

    } catch (error: any) {
      console.error('❌ Erro:', error);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Alert.alert(
        'Erro',
        error.message || 'Erro ao criar conta. Tente novamente.',
        [
          {
            text: 'Voltar',
            onPress: () => router.replace('/CadastroScreen'),
          },
        ]
      );
    }
  };

  const verificarCodigo = async () => {
    const codigoCompleto = codigo.join('');
    
    if (codigoCompleto.length < 6) {
      Alert.alert('Código incompleto', 'Digite o código de 6 dígitos');
      return;
    }

    try {
      setLoading(true);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

      const response = await fetch(`${API_URL}/verificar-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          email, 
          codigo: codigoCompleto 
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.tentativasRestantes) {
          Alert.alert(
            'Código inválido',
            `Restam ${data.tentativasRestantes} tentativas.`
          );
        } else {
          throw new Error(data.erro || 'Código inválido');
        }
        return;
      }

      console.log('✅ Código verificado!');

      // Criar conta e fazer login automático
      await criarContaEAutenticar(data.token);

    } catch (error: any) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Alert.alert('Erro', error.message);
    } finally {
      setLoading(false);
    }
  };

  const reenviarCodigo = async () => {
    if (!podeReenviar) return;

    try {
      setReenviando(true);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

      const response = await fetch(`${API_URL}/reenviar-codigo`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.erro || 'Erro ao reenviar código');
      }

      setTempoRestante(60);
      setPodeReenviar(false);
      
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      Alert.alert('Sucesso', 'Código reenviado com sucesso!');
      
    } catch (error: any) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Alert.alert('Erro', error.message);
    } finally {
      setReenviando(false);
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
          >
            <LinearGradient colors={['#1E88E5', '#8E44AD']} style={styles.card}>
              <View style={styles.iconContainer}>
                <FontAwesome name="envelope" size={60} color="#FFF" />
              </View>

              <Text style={styles.title}>Verifique seu e-mail</Text>
              
              <Text style={styles.subtitle}>
                Enviamos um código de verificação para:
              </Text>
              
              <Text style={styles.emailDestino}>{email}</Text>

              <Text style={styles.instrucao}>
                Digite o código de 6 dígitos
              </Text>

              <View style={styles.codigoContainer}>
                {[0, 1, 2, 3, 4, 5].map((index) => (
                  <TextInput
                    key={index}
                    ref={setInputRef(index)}
                    style={styles.codigoInput}
                    value={codigo[index]}
                    onChangeText={(text) => handleCodigoChange(text, index)}
                    onKeyPress={(e) => handleKeyPress(e, index)}
                    keyboardType="number-pad"
                    maxLength={1}
                    selectTextOnFocus
                    editable={!loading}
                  />
                ))}
              </View>

              <View style={styles.reenviarContainer}>
                {podeReenviar ? (
                  <TouchableOpacity 
                    onPress={reenviarCodigo}
                    disabled={reenviando}
                  >
                    {reenviando ? (
                      <ActivityIndicator size="small" color="#FFF" />
                    ) : (
                      <Text style={styles.reenviarTextoAtivo}>
                        Reenviar código
                      </Text>
                    )}
                  </TouchableOpacity>
                ) : (
                  <Text style={styles.reenviarTextoInativo}>
                    Reenviar em {tempoRestante}s
                  </Text>
                )}
              </View>

              <TouchableOpacity
                style={[styles.button, loading && styles.buttonDisabled]}
                onPress={verificarCodigo}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#FFF" />
                ) : (
                  <Text style={styles.buttonText}>Verificar e continuar</Text>
                )}
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.voltarLink}
                onPress={() => router.back()}
              >
                <Text style={styles.voltarTexto}>
                  Voltar para o cadastro
                </Text>
              </TouchableOpacity>

              <View style={styles.dicaContainer}>
                <FontAwesome name="info-circle" size={16} color="#E0E0E0" />
                <Text style={styles.dicaTexto}>
                  Não recebeu? Verifique sua caixa de spam
                </Text>
              </View>
            </LinearGradient>
          </ScrollView>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  scrollContent: {
    flexGrow: 1,
    padding: 20,
    justifyContent: 'center',
  },
  card: {
    borderRadius: 24,
    padding: 24,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 6,
  },
  iconContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    color: '#FFF',
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 14,
    color: '#E0E0E0',
    textAlign: 'center',
    marginBottom: 8,
  },
  emailDestino: {
    fontSize: 16,
    color: '#FFF',
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    alignSelf: 'center',
  },
  instrucao: {
    fontSize: 14,
    color: '#E0E0E0',
    textAlign: 'center',
    marginBottom: 24,
  },
  codigoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  codigoInput: {
    width: 45,
    height: 55,
    backgroundColor: '#FFF',
    borderRadius: 12,
    textAlign: 'center',
    fontSize: 22,
    fontWeight: '600',
    borderWidth: 2,
    borderColor: '#DDD',
    color: '#333',
  },
  reenviarContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  reenviarTextoAtivo: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
  reenviarTextoInativo: {
    color: '#E0E0E0',
    fontSize: 14,
  },
  button: {
    backgroundColor: '#27AE60',
    height: 56,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '600',
  },
  voltarLink: {
    alignItems: 'center',
    marginBottom: 16,
  },
  voltarTexto: {
    color: '#FFF',
    fontSize: 15,
    textDecorationLine: 'underline',
  },
  dicaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: 'rgba(0,0,0,0.2)',
    padding: 12,
    borderRadius: 12,
  },
  dicaTexto: {
    color: '#E0E0E0',
    fontSize: 12,
    flex: 1,
  },
});