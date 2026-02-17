import { AuthContext, AuthProvider } from "@/app/(drawer)/AuthContext";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { NavigationState } from "@react-navigation/native";
import { useNavigation } from "expo-router";
import { Drawer } from "expo-router/drawer";
import { useContext, useEffect } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

// Importações das telas adicionais

// Extender os tipos do Expo Router
declare global {
  namespace ReactNavigation {
    interface RootParamList {
      index: undefined;
      login: undefined;
      cadastro: undefined;
      perfil: undefined;
      historico: undefined;
      resultados: undefined;
      diarias: undefined;
      dados: undefined;
      termos: undefined;
      privacidade: undefined;
      configuracoes: undefined;
      ajuda: undefined;
      sobre: undefined;
      BoasVindas1: undefined;
      BoasVindas2: undefined;
      BoasVindas3: undefined;
      ObjetivoScreen: undefined;
      SexoScreen: undefined;
      IdadeScreen: undefined;
      AlturaScreen: undefined;
      PesoScreen: undefined;
      TreinoScreen: undefined;
      FrequenciaScreen: undefined;
      AguaScreen: undefined;
      CardioScreen: undefined;
      RegistrarTreinoScreen: undefined;
      RegistrarCardioScreen: undefined;
      EstruturaTreinosScreen: undefined;
      ContextoBFScreen: undefined;
      QuandoCalcularBFScreen: undefined;
      PescocoScreen: undefined;
      CinturaScreen: undefined;
      QuadrilScreen: undefined;
      CalculoBFScreen: undefined;
      FinalizacaoScreen: undefined;
    }
  }
}

// Tipo para as rotas permitidas
type RouteName =
  | 'index'
  | 'login'
  | 'cadastro'
  | 'perfil'
  | 'historico'
  | 'resultados'
  | 'diarias'
  | 'dados'
  | 'termos'
  | 'privacidade'
  | 'configuracoes'
  | 'ajuda'
  | 'sobre'
  | 'BoasVindas1'
  | 'BoasVindas2'
  | 'BoasVindas3'
  | 'ObjetivoScreen'
  | 'SexoScreen'
  | 'IdadeScreen'
  | 'AlturaScreen'
  | 'PesoScreen'
  | 'TreinoScreen'
  | 'FrequenciaScreen'
  | 'AguaScreen'
  | 'CardioScreen'
  | 'RegistrarTreinoScreen'
  | 'RegistrarCardioScreen'
  | 'EstruturaTreinosScreen'
  | 'ContextoBFScreen'
  | 'QuandoCalcularBFScreen'
  | 'PescocoScreen'
  | 'CinturaScreen'
  | 'QuadrilScreen'
  | 'CalculoBFScreen'
  | 'FinalizacaoScreen';

// Componente para redirecionamento baseado no auth
function AuthRedirect() {
  const navigation = useNavigation();
  const auth = useContext(AuthContext);

  useEffect(() => {
    if (!auth?.loading) {
      const isLoggedIn = !!auth?.usuario;
      const currentState = navigation.getState() as NavigationState;
      const currentRoute = currentState?.routes[currentState.index]?.name as RouteName | undefined;

      console.log('AuthRedirect - Estado:', {
        isLoggedIn,
        currentRoute,
        loading: auth?.loading
      });

      // Se está logado e na tela de login/cadastro, redireciona para home
      if (isLoggedIn && (currentRoute === 'login' || currentRoute === 'cadastro')) {
        console.log('Redirecionando para home...');
        (navigation as any).reset({
          index: 0,
          routes: [{ name: 'index' }],
        });
      }

      // Se não está logado e tentando acessar telas protegidas, redireciona para login
      const protectedRoutes: RouteName[] = ['perfil', 'historico', 'resultados', 'diarias', 'dados'];
      if (!isLoggedIn && currentRoute && protectedRoutes.includes(currentRoute)) {
        console.log('Redirecionando para login...');
        (navigation as any).reset({
          index: 0,
          routes: [{ name: 'login' }],
        });
      }
    }
  }, [auth?.loading, auth?.usuario, navigation]);

  return null;
}

function CustomDrawerContent(props: any) {
  const { state, navigation } = props;
  const auth = useContext(AuthContext);

  // Se estiver carregando, mostra loading
  if (auth?.loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#1E88E5" />
          <Text style={styles.loadingText}>Carregando...</Text>
        </View>
      </SafeAreaView>
    );
  }

  // Se usuario existir, está logado
  const isLoggedIn = !!auth?.usuario;
  const userData = auth?.usuario;

  const handleLogout = async () => {
    Alert.alert(
      "Sair",
      "Tem certeza que deseja sair da sua conta?",
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Sair",
          style: "destructive",
          onPress: async () => {
            try {
              await auth?.logout();
              (navigation as any).reset({
                index: 0,
                routes: [{ name: "login" }],
              });
            } catch (error) {
              console.error("Erro ao fazer logout:", error);
              Alert.alert("Erro", "Não foi possível fazer logout");
            }
          },
        },
      ]
    );
  };

  const loggedInScreens = [
    {
      name: "index" as RouteName,
      label: "Início",
      iconName: "home",
      iconLib: Ionicons,
      colorScheme: { bg: "#E3F2FD", color: "#1E88E5" },
    },
    {
      name: "diarias" as RouteName,
      label: "Desafios Diários",
      iconName: "trophy-award",
      iconLib: MaterialCommunityIcons,
      colorScheme: { bg: "#F3E5F5", color: "#8E44AD" },
    },
    {
      name: "dados" as RouteName,
      label: "Dados Biométricos",
      iconName: "tape-measure",
      iconLib: MaterialCommunityIcons,
      colorScheme: { bg: "#E0F7FA", color: "#00ACC1" },
    },
    {
      name: "perfil" as RouteName,
      label: "Meu Perfil",
      iconName: "person",
      iconLib: Ionicons,
      colorScheme: { bg: "#FFF3E0", color: "#FF9800" },
    },
    {
      name: "historico" as RouteName,
      label: "Histórico",
      iconName: "time-outline",
      iconLib: Ionicons,
      colorScheme: { bg: "#E8F5E9", color: "#4CAF50" },
    },
    {
      name: "resultados" as RouteName,
      label: "Resultados",
      iconName: "bar-chart",
      iconLib: Ionicons,
      colorScheme: { bg: "#F3E5F5", color: "#9C27B0" },
    },
  ];

  const loggedOutScreens = [
    {
      name: "index" as RouteName,
      label: "Início",
      iconName: "home",
      iconLib: Ionicons,
      colorScheme: { bg: "#E3F2FD", color: "#1E88E5" },
    },
    {
      name: "login" as RouteName,
      label: "Login",
      iconName: "log-in",
      iconLib: Ionicons,
      colorScheme: { bg: "#E8EAF6", color: "#3F51B5" },
    },
    {
      name: "cadastro" as RouteName,
      label: "Cadastro",
      iconName: "person-add",
      iconLib: Ionicons,
      colorScheme: { bg: "#E8F5E9", color: "#4CAF50" },
    },
  ];

  const commonScreens = [
    {
      name: "termos" as RouteName,
      label: "Termos de Uso",
      iconName: "document-text",
      iconLib: Ionicons,
      colorScheme: { bg: "#F5F5F5", color: "#616161" },
    },
    {
      name: "privacidade" as RouteName,
      label: "Privacidade",
      iconName: "shield-checkmark",
      iconLib: Ionicons,
      colorScheme: { bg: "#E0F2F1", color: "#009688" },
    },
    {
      name: "ajuda" as RouteName,
      label: "Ajuda",
      iconName: "help-circle",
      iconLib: Ionicons,
      colorScheme: { bg: "#FFF8E1", color: "#FF8F00" },
    },
    {
      name: "sobre" as RouteName,
      label: "Sobre o App",
      iconName: "information-circle",
      iconLib: Ionicons,
      colorScheme: { bg: "#F5F5F5", color: "#616161" },
    },
  ];

  const configScreens = isLoggedIn
    ? [
      {
        name: "configuracoes" as RouteName,
        label: "Configurações",
        iconName: "settings",
        iconLib: Ionicons,
        colorScheme: { bg: "#F5F5F5", color: "#757575" },
      },
    ]
    : [];

  const mainScreens = isLoggedIn ? loggedInScreens : loggedOutScreens;
  const currentRouteName = state.routes[state.index]?.name as RouteName;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1E88E5" />

      {/* HEADER */}
      <View style={styles.header}>
        <View style={styles.avatarContainer}>
          {isLoggedIn && userData?.foto ? (
            <Image
              source={{ uri: userData.foto }}
              style={styles.userAvatar}
              resizeMode="cover"
            />
          ) : (
            <View style={styles.avatarPlaceholder}>
              <Ionicons name="person" size={40} color="#FFF" />
            </View>
          )}
        </View>

        <Text style={styles.appName}>Fitness Analytics</Text>

        {isLoggedIn && userData ? (
          <>
            <Text style={styles.userName}>
              Olá, {userData?.nome?.split(" ")[0] || "Usuário"}!
            </Text>
            <Text style={styles.userEmail}>{userData.email}</Text>

            {/* Status dos dados biométricos */}
            {userData.altura && userData.peso && userData.idade ? (
              <View style={styles.dadosCompletosBadge}>
                <Ionicons name="checkmark-circle" size={16} color="#4CAF50" />
                <Text style={styles.dadosCompletosText}>Dados completos</Text>
              </View>
            ) : (
              <TouchableOpacity
                style={styles.dadosIncompletosBadge}
                onPress={() => (navigation as any).navigate("dados")}
              >
                <Ionicons name="warning" size={16} color="#FF9800" />
                <Text style={styles.dadosIncompletosText}>Complete seus dados</Text>
              </TouchableOpacity>
            )}
          </>
        ) : (
          <Text style={styles.appSubtitle}>Faça login para continuar</Text>
        )}
      </View>

      {/* MENU ITEMS */}
      <ScrollView
        style={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* MENU PRINCIPAL */}
        <View style={styles.drawerSection}>
          <Text style={styles.sectionTitle}>
            {isLoggedIn ? "MENU PRINCIPAL" : "ACESSO"}
          </Text>

          {mainScreens.map((screen) => {
            const isActive = currentRouteName === screen.name;
            const IconComponent = screen.iconLib;

            return (
              <TouchableOpacity
                key={screen.name}
                style={[
                  styles.drawerItem,
                  isActive && styles.drawerItemActive,
                ]}
                onPress={() => {
                  (navigation as any).jumpTo(screen.name);
                }}
              >
                <View
                  style={[
                    styles.iconContainer,
                    {
                      backgroundColor: isActive
                        ? screen.colorScheme.bg
                        : "#F5F5F5",
                    },
                  ]}
                >
                  <IconComponent
                    name={screen.iconName as any}
                    size={22}
                    color={screen.colorScheme.color}
                  />
                </View>
                <Text style={styles.drawerItemText}>{screen.label}</Text>
                {isActive && (
                  <View style={styles.activeIndicator} />
                )}
              </TouchableOpacity>
            );
          })}
        </View>

        {/* INFORMAÇÕES */}
        <View style={styles.drawerSection}>
          <Text style={styles.sectionTitle}>INFORMAÇÕES</Text>
          {commonScreens.map((screen) => {
            const isActive = currentRouteName === screen.name;
            const IconComponent = screen.iconLib;

            return (
              <TouchableOpacity
                key={screen.name}
                style={[
                  styles.drawerItem,
                  isActive && styles.drawerItemActive,
                ]}
                onPress={() => (navigation as any).navigate(screen.name)}
              >
                <View
                  style={[
                    styles.iconContainer,
                    {
                      backgroundColor: isActive
                        ? screen.colorScheme.bg
                        : "#F5F5F5",
                    },
                  ]}
                >
                  <IconComponent
                    name={screen.iconName as any}
                    size={22}
                    color={screen.colorScheme.color}
                  />
                </View>
                <Text style={styles.drawerItemText}>{screen.label}</Text>
                {isActive && (
                  <View style={styles.activeIndicator} />
                )}
              </TouchableOpacity>
            );
          })}
        </View>

        {/* CONFIGURAÇÕES (apenas logado) */}
        {configScreens.length > 0 && (
          <View style={styles.drawerSection}>
            <Text style={styles.sectionTitle}>CONFIGURAÇÕES</Text>
            {configScreens.map((screen) => {
              const isActive = currentRouteName === screen.name;
              const IconComponent = screen.iconLib;

              return (
                <TouchableOpacity
                  key={screen.name}
                  style={[
                    styles.drawerItem,
                    isActive && styles.drawerItemActive,
                  ]}
                  onPress={() => (navigation as any).navigate(screen.name)}
                >
                  <View
                    style={[
                      styles.iconContainer,
                      {
                        backgroundColor: isActive
                          ? screen.colorScheme.bg
                          : "#F5F5F5",
                      },
                    ]}
                  >
                    <IconComponent
                      name={screen.iconName as any}
                      size={22}
                      color={screen.colorScheme.color}
                    />
                  </View>
                  <Text style={styles.drawerItemText}>{screen.label}</Text>
                  {isActive && (
                    <View style={styles.activeIndicator} />
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        )}
      </ScrollView>

      {/* FOOTER */}
      <View style={styles.footer}>
        {isLoggedIn ? (
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Ionicons name="log-out" size={22} color="#D32F2F" />
            <Text style={styles.logoutText}>Sair da Conta</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={styles.loginButton}
            onPress={() => (navigation as any).navigate("login")}
          >
            <Ionicons name="log-in" size={22} color="#3F51B5" />
            <Text style={styles.loginButtonText}>Fazer Login</Text>
          </TouchableOpacity>
        )}

        {/* VERSÃO */}
        <View style={styles.versionContainer}>
          <Text style={styles.versionText}>Versão 1.0.0</Text>
          <Text style={styles.copyrightText}>© 2024 Fitness Analytics</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

export default function DrawerLayout() {
  return (
    <AuthProvider>
      <AuthRedirect />
      <Drawer
        drawerContent={(props) => <CustomDrawerContent {...props} />}
        screenOptions={({ route }) => {
          const screenOptions: any = {
            headerShown: true,
            drawerType: "front",
            drawerStyle: {
              width: 320,
            },
            headerStyle: {
              backgroundColor: "#1E88E5",
            },
            headerTintColor: "#FFF",
            headerTitleStyle: {
              fontWeight: "600",
              fontSize: 18,
            },
            headerShadowVisible: true,
          };

          // Telas que não mostram header nem drawer
          const hideHeaderAndDrawerRoutes = [
            'login',
            'cadastro',
            'dados',
            'BoasVindas1',
            'BoasVindas2',
            'BoasVindas3',
            'index',
            'ObjetivoScreen',
            'SexoScreen',
            'IdadeScreen',
            'AlturaScreen',
            'PesoScreen',
            'TreinoScreen',
            'FrequenciaScreen',
            'AguaScreen',
            'CardioScreen',
            'RegistrarTreinoScreen',
            'RegistrarCardioScreen',
            'EstruturaTreinosScreen',
            'ContextoBFScreen',
            'QuandoCalcularBFScreen',
            'PescocoScreen',
            'CinturaScreen',
            'QuadrilScreen',
            'CalculoBFScreen',
            'FinalizacaoScreen'
          ];

          if (hideHeaderAndDrawerRoutes.includes(route.name)) {
            screenOptions.headerShown = false;
            screenOptions.swipeEnabled = false; // Desabilita swipe para abrir drawer
          }

          return screenOptions;
        }}
      >
        {/* Telas de boas-vindas (SEM aparecer no drawer) */}
        <Drawer.Screen
          name="BoasVindas1"
          options={{
            drawerItemStyle: { display: 'none' },
            headerShown: false,
          }}
        />
        <Drawer.Screen
          name="BoasVindas2"
          options={{
            drawerItemStyle: { display: 'none' },
            headerShown: false,
          }}
        />
        <Drawer.Screen
          name="BoasVindas3"
          options={{
            drawerItemStyle: { display: 'none' },
            headerShown: false,
          }}
        />

        {/* TELA DE OBJETIVO - SEM DRAWER */}
        <Drawer.Screen
          name="ObjetivoScreen"
          options={{
            title: "Seu Objetivo",
            drawerLabel: "Objetivo",
            drawerItemStyle: { display: 'none' },
            headerShown: false,
          }}
        />

        {/* TELA DE SEXO - SEM DRAWER */}
        <Drawer.Screen
          name="SexoScreen"
          options={{
            title: "Seu Sexo",
            drawerLabel: "Sexo",
            drawerItemStyle: { display: 'none' },
            headerShown: false,
          }}
        />

        {/* TELA DE IDADE - SEM DRAWER */}
        <Drawer.Screen
          name="IdadeScreen"
          options={{
            title: "Sua Idade",
            drawerLabel: "Idade",
            drawerItemStyle: { display: 'none' },
            headerShown: false,
          }}
        />

        {/* TELA DE ALTURA - SEM DRAWER */}
        <Drawer.Screen
          name="AlturaScreen"
          options={{
            title: "Sua Altura",
            drawerLabel: "Altura",
            drawerItemStyle: { display: 'none' },
            headerShown: false,
          }}
        />

        {/* TELA DE PESO - SEM DRAWER */}
        <Drawer.Screen
          name="PesoScreen"
          options={{
            title: "Seu Peso",
            drawerLabel: "Peso",
            drawerItemStyle: { display: 'none' },
            headerShown: false,
          }}
        />

        {/* TELA DE TREINO - SEM DRAWER */}
        <Drawer.Screen
          name="TreinoScreen"
          options={{
            title: "Treino Atual",
            drawerLabel: "Treino",
            drawerItemStyle: { display: 'none' },
            headerShown: false,
          }}
        />

        {/* TELA DE FREQUÊNCIA DE TREINO - SEM DRAWER */}
        <Drawer.Screen
          name="FrequenciaScreen"
          options={{
            title: "Frequência de Treino",
            drawerLabel: "Frequência",
            drawerItemStyle: { display: 'none' },
            headerShown: false,
          }}
        />

        {/* TELA DE ÁGUA - SEM DRAWER */}
        <Drawer.Screen
          name="AguaScreen"
          options={{
            title: "Água",
            drawerLabel: "Água",
            drawerItemStyle: { display: 'none' },
            headerShown: false,
          }}
        />

        {/* TELA DE CARDIO - SEM DRAWER */}
        <Drawer.Screen
          name="CardioScreen"
          options={{
            title: "Cardio",
            drawerLabel: "Cardio",
            drawerItemStyle: { display: 'none' },
            headerShown: false,
          }}
        />

        {/* TELA DE REGISTRAR TREINO - SEM DRAWER */}
        <Drawer.Screen
          name="RegistrarTreinoScreen"
          options={{
            title: "Registrar Treino",
            drawerLabel: "Reg. Treino",
            drawerItemStyle: { display: 'none' },
            headerShown: false,
          }}
        />

        {/* TELA DE REGISTRAR CARDIO - SEM DRAWER */}
        <Drawer.Screen
          name="RegistrarCardioScreen"
          options={{
            title: "Registrar Cardio",
            drawerLabel: "Reg. Cardio",
            drawerItemStyle: { display: 'none' },
            headerShown: false,
          }}
        />

        {/* TELA DE ESTRUTURA DE TREINOS - SEM DRAWER */}
        <Drawer.Screen
          name="EstruturaTreinosScreen"
          options={{
            title: "Estrutura de Treinos",
            drawerLabel: "Estrutura Treinos",
            drawerItemStyle: { display: 'none' },
            headerShown: false,
          }}
        />

        {/* TELA DE CONTEXTO BF - SEM DRAWER */}
        <Drawer.Screen
          name="ContextoBFScreen"
          options={{
            title: "Contexto BF",
            drawerLabel: "Contexto BF",
            drawerItemStyle: { display: 'none' },
            headerShown: false,
          }}
        />

        {/* TELA DE QUANDO CALCULAR BF - SEM DRAWER */}
        <Drawer.Screen
          name="QuandoCalcularBFScreen"
          options={{
            title: "Quando Calcular BF",
            drawerLabel: "Calcular BF",
            drawerItemStyle: { display: 'none' },
            headerShown: false,
          }}
        />

        {/* TELA DE PESCOÇO - SEM DRAWER */}
        <Drawer.Screen
          name="PescocoScreen"
          options={{
            title: "Medida do Pescoço",
            drawerLabel: "Pescoço",
            drawerItemStyle: { display: 'none' },
            headerShown: false,
          }}
        />

        {/* TELA DE CINTURA - SEM DRAWER */}
        <Drawer.Screen
          name="CinturaScreen"
          options={{
            title: "Medida da Cintura",
            drawerLabel: "Cintura",
            drawerItemStyle: { display: 'none' },
            headerShown: false,
          }}
        />

        {/* TELA DE QUADRIL - SEM DRAWER */}
        <Drawer.Screen
          name="QuadrilScreen"
          options={{
            title: "Medida do Quadril",
            drawerLabel: "Quadril",
            drawerItemStyle: { display: 'none' },
            headerShown: false,
          }}
        />

        {/* TELA DE CÁLCULO BF - SEM DRAWER */}
        <Drawer.Screen
          name="CalculoBFScreen"
          options={{
            title: "Calculando BF",
            drawerLabel: "Calculo BF",
            drawerItemStyle: { display: 'none' },
            headerShown: false,
          }}
        />

        {/* TELA DE FINALIZAÇÃO - SEM DRAWER */}
        <Drawer.Screen
          name="FinalizacaoScreen"
          options={{
            title: "Finalização",
            drawerLabel: "Finalização",
            drawerItemStyle: { display: 'none' },
            headerShown: false,
          }}
        />

        {/* TELA INICIAL - SEM DRAWER */}
        <Drawer.Screen
          name="index"
          options={{
            title: "Início",
            drawerLabel: "Início",
            drawerItemStyle: { display: 'none' },
            headerShown: false,
          }}
        />

        {/* Telas públicas */}
        <Drawer.Screen
          name="login"
          options={{
            title: "Login",
            drawerLabel: "Login",
            headerShown: false,
          }}
        />
        <Drawer.Screen
          name="cadastro"
          options={{
            title: "Cadastro",
            drawerLabel: "Cadastro",
            headerShown: false,
          }}
        />

        {/* Telas protegidas */}
        <Drawer.Screen
          name="perfil"
          options={{
            title: "Meu Perfil",
            drawerLabel: "Meu Perfil",
          }}
        />
        <Drawer.Screen
          name="diarias"
          options={{
            title: "Desafios Diários",
            drawerLabel: "Desafios Diários",
          }}
        />
        <Drawer.Screen
          name="dados"
          options={{
            title: "Dados Biométricos",
            drawerLabel: "Dados Biométricos",
            headerShown: false,
          }}
        />
        <Drawer.Screen
          name="historico"
          options={{
            title: "Histórico",
            drawerLabel: "Histórico",
          }}
        />
        <Drawer.Screen
          name="resultados"
          options={{
            title: "Resultados",
            drawerLabel: "Resultados",
          }}
        />

        {/* Telas comuns */}
        <Drawer.Screen
          name="termos"
          options={{
            title: "Termos de Uso",
            drawerLabel: "Termos de Uso",
          }}
        />
        <Drawer.Screen
          name="privacidade"
          options={{
            title: "Política de Privacidade",
            drawerLabel: "Privacidade",
          }}
        />
        <Drawer.Screen
          name="ajuda"
          options={{
            title: "Ajuda",
            drawerLabel: "Ajuda",
          }}
        />
        <Drawer.Screen
          name="sobre"
          options={{
            title: "Sobre o App",
            drawerLabel: "Sobre o App",
          }}
        />

        {/* Telas de configuração */}
        <Drawer.Screen
          name="configuracoes"
          options={{
            title: "Configurações",
            drawerLabel: "Configurações",
          }}
        />
      </Drawer>
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    fontSize: 16,
    color: "#666",
    marginTop: 10,
  },
  header: {
    backgroundColor: "#1E88E5",
    padding: 25,
    paddingTop: 50,
    paddingBottom: 20,
    borderBottomRightRadius: 25,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 15,
    borderWidth: 3,
    borderColor: "rgba(255, 255, 255, 0.3)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
    overflow: "hidden",
  },
  avatarPlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
  },
  userAvatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  appName: {
    fontSize: 22,
    fontWeight: "700",
    color: "#FFFFFF",
    marginBottom: 4,
  },
  appSubtitle: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.8)",
    fontStyle: "italic",
  },
  userName: {
    fontSize: 18,
    fontWeight: "600",
    color: "#FFFFFF",
    marginBottom: 2,
  },
  userEmail: {
    fontSize: 13,
    color: "rgba(255, 255, 255, 0.7)",
    marginBottom: 8,
  },
  dadosCompletosBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(76, 175, 80, 0.15)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    alignSelf: "flex-start",
    borderWidth: 1,
    borderColor: "rgba(76, 175, 80, 0.3)",
  },
  dadosCompletosText: {
    fontSize: 12,
    color: "#4CAF50",
    fontWeight: "600",
    marginLeft: 6,
  },
  dadosIncompletosBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 152, 0, 0.15)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    alignSelf: "flex-start",
    borderWidth: 1,
    borderColor: "rgba(255, 152, 0, 0.3)",
  },
  dadosIncompletosText: {
    fontSize: 12,
    color: "#FF9800",
    fontWeight: "600",
    marginLeft: 6,
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 10,
    paddingBottom: 20,
  },
  drawerSection: {
    marginBottom: 20,
    paddingHorizontal: 15,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: "700",
    color: "#9E9E9E",
    marginBottom: 15,
    marginLeft: 5,
    letterSpacing: 0.8,
    textTransform: "uppercase",
  },
  drawerItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderRadius: 12,
    marginBottom: 6,
    backgroundColor: "#FFF",
    position: "relative",
  },
  drawerItemActive: {
    backgroundColor: "rgba(30, 136, 229, 0.05)",
  },
  drawerItemText: {
    fontSize: 15,
    color: "#333",
    marginLeft: 15,
    fontWeight: "500",
    flex: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  activeIndicator: {
    width: 4,
    height: 24,
    backgroundColor: "#1E88E5",
    borderRadius: 2,
    marginLeft: 10,
  },
  footer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: "#F0F0F0",
    backgroundColor: "#F8F9FA",
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    paddingHorizontal: 10,
    borderRadius: 12,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#FFCDD2",
    marginBottom: 15,
  },
  loginButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    paddingHorizontal: 10,
    borderRadius: 12,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#C5CAE9",
    marginBottom: 15,
  },
  logoutText: {
    fontSize: 15,
    color: "#D32F2F",
    marginLeft: 15,
    fontWeight: "600",
  },
  loginButtonText: {
    fontSize: 15,
    color: "#3F51B5",
    marginLeft: 15,
    fontWeight: "600",
  },
  versionContainer: {
    paddingTop: 15,
    marginTop: 15,
    borderTopWidth: 1,
    borderTopColor: "#E0E0E0",
  },
  versionText: {
    fontSize: 11,
    color: "#9E9E9E",
    textAlign: "center",
    marginBottom: 4,
  },
  copyrightText: {
    fontSize: 11,
    color: "#BDBDBD",
    textAlign: "center",
  },
});