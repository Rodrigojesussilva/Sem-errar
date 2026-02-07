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
          // Valida se tem os campos obrigatórios
          if (parsedUser.id && parsedUser.nome && parsedUser.email) {
            setUsuario(parsedUser);
            setToken(storagedToken);
          } else {
            // Se não tiver campos obrigatórios, limpa o storage
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
      setUsuario(null);
      setToken(null);
      await AsyncStorage.clear();
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
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
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}