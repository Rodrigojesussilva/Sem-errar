import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, ReactNode, useEffect, useState } from 'react';

// Interface do Usuário - id é obrigatório
export interface Usuario {
  id: string; // OBRIGATÓRIO
  nome: string; // OBRIGATÓRIO
  email: string; // OBRIGATÓRIO
  foto?: string; // opcional
  altura?: string; // opcional
  peso?: string; // opcional
  idade?: string; // opcional
  objetivo?: string; // opcional
}

interface AuthContextData {
  usuario: Usuario | null;
  token: string | null;
  loading: boolean;
  setUsuario: (usuario: Usuario | null) => void;
  setToken: (token: string | null) => void;
  logout: () => Promise<void>;
  limparTudoEAutenticar: (dadosReais: Usuario, novoToken: string) => Promise<void>; // NOVO MÉTODO
}

export const AuthContext = createContext<AuthContextData | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Carregar dados do AsyncStorage ao iniciar
  useEffect(() => {
    async function loadStorageData() {
      try {
        const storagedUser = await AsyncStorage.getItem('@FitnessApp:usuario');
        const storagedToken = await AsyncStorage.getItem('@FitnessApp:token');

        if (storagedUser && storagedToken) {
          // Garante que o usuário do storage tem todos os campos obrigatórios
          const parsedUser = JSON.parse(storagedUser);
          
          // Verifica se é dado mockado (foto do Unsplash ou ID com user_)
          const isMocked = parsedUser.foto?.includes('unsplash') || parsedUser.id?.startsWith('user_');
          
          if (isMocked) {
            console.log('🚨 DADOS MOCKADOS DETECTADOS! Removendo...');
            await AsyncStorage.clear();
            setUsuario(null);
            setToken(null);
          } 
          // Valida se tem os campos obrigatórios
          else if (parsedUser.id && parsedUser.nome && parsedUser.email) {
            console.log('📱 Usuário REAL carregado:', {
              nome: parsedUser.nome,
              email: parsedUser.email,
              foto: parsedUser.foto ? '✅ TEM FOTO' : '❌ SEM FOTO'
            });
            setUsuario(parsedUser);
            setToken(storagedToken);
          } else {
            // Se não tiver campos obrigatórios, limpa o storage
            console.log('⚠️ Dados inválidos, limpando storage...');
            await AsyncStorage.clear();
          }
        }
      } catch (error) {
        console.error('Erro ao carregar dados do storage:', error);
      } finally {
        setLoading(false);
      }
    }

    loadStorageData();
  }, []);

  // Salvar dados no AsyncStorage quando mudar
  useEffect(() => {
    async function saveStorageData() {
      try {
        if (usuario && token) {
          await AsyncStorage.setItem('@FitnessApp:usuario', JSON.stringify(usuario));
          await AsyncStorage.setItem('@FitnessApp:token', token);
          console.log('💾 Dados salvos no storage:', {
            nome: usuario.nome,
            email: usuario.email,
            token: token.substring(0, 20) + '...'
          });
        } else {
          await AsyncStorage.removeItem('@FitnessApp:usuario');
          await AsyncStorage.removeItem('@FitnessApp:token');
        }
      } catch (error) {
        console.error('Erro ao salvar dados no storage:', error);
      }
    }

    saveStorageData();
  }, [usuario, token]);

  const handleSetUsuario = (newUsuario: Usuario | null) => {
    if (newUsuario) {
      // Garante que o usuário tem os campos obrigatórios
      if (!newUsuario.id || !newUsuario.nome || !newUsuario.email) {
        console.error('Usuário sem campos obrigatórios:', newUsuario);
        return;
      }
    }
    setUsuario(newUsuario);
  };

  const handleSetToken = (newToken: string | null) => {
    setToken(newToken);
  };

  const logout = async () => {
    try {
      console.log('🚪 Fazendo logout...');
      setUsuario(null);
      setToken(null);
      await AsyncStorage.clear();
      console.log('✅ Logout concluído');
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  // NOVO MÉTODO: Limpa TUDO e autentica com dados reais
  const limparTudoEAutenticar = async (dadosReais: Usuario, novoToken: string) => {
    try {
      console.log('🧹 INICIANDO LIMPEZA COMPLETA DO STORAGE...');
      
      // 1. Verificar se os dados reais são válidos
      if (!dadosReais.id || !dadosReais.nome || !dadosReais.email) {
        console.error('❌ Dados reais inválidos:', dadosReais);
        throw new Error('Dados do usuário incompletos');
      }

      // 2. Log dos dados que serão salvos
      console.log('📦 Dados REAIS recebidos:');
      console.log('   👤 Nome:', dadosReais.nome);
      console.log('   📧 Email:', dadosReais.email);
      console.log('   🆔 ID:', dadosReais.id);
      console.log('   📸 Foto:', dadosReais.foto ? '✅ TEM FOTO' : '❌ SEM FOTO');
      console.log('   🎂 Idade:', dadosReais.idade);
      console.log('   🎯 Objetivo:', dadosReais.objetivo);
      console.log('   📏 Altura:', dadosReais.altura);
      console.log('   ⚖️ Peso:', dadosReais.peso);

      // 3. Limpar TODO o AsyncStorage
      const todasChaves = await AsyncStorage.getAllKeys();
      if (todasChaves.length > 0) {
        await AsyncStorage.multiRemove(todasChaves);
        console.log(`✅ ${todasChaves.length} chaves removidas do storage`);
      }

      // 4. Atualizar estados
      setUsuario(dadosReais);
      setToken(novoToken);

      // 5. Salvar dados reais
      await AsyncStorage.setItem('@FitnessApp:usuario', JSON.stringify(dadosReais));
      await AsyncStorage.setItem('@FitnessApp:token', novoToken);

      console.log('✅ LIMPEZA E AUTENTICAÇÃO CONCLUÍDAS COM SUCESSO!');
      console.log('💾 Dados REAIS salvos:', {
        nome: dadosReais.nome,
        email: dadosReais.email,
        token: novoToken.substring(0, 20) + '...'
      });

    } catch (error) {
      console.error('❌ Erro ao limpar storage e autenticar:', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        usuario,
        token,
        loading,
        setUsuario: handleSetUsuario,
        setToken: handleSetToken,
        logout,
        limparTudoEAutenticar, // EXPORTA O NOVO MÉTODO
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}