// app/(drawer)/_layout.tsx
import { Ionicons, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { Drawer } from 'expo-router/drawer';
import {
  Image,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

// Componente personalizado para o Drawer
function CustomDrawerContent(props: any) {
  const { state, navigation } = props;

  // Definir as telas principais que devem aparecer no Drawer com cores temáticas
  const mainScreens = [
    {
      name: 'index',
      label: 'Início',
      iconName: 'home',
      iconLib: Ionicons,
      colorScheme: {
        bg: '#E3F2FD', // Azul claro
        color: '#1E88E5', // Azul
      }
    },
    {
      name: 'login',
      label: 'Login',
      iconName: 'log-in',
      iconLib: Ionicons,
      colorScheme: {
        bg: '#E8EAF6', // Índigo claro
        color: '#3F51B5', // Índigo
      }
    },
    {
      name: 'cadastro',
      label: 'Cadastro',
      iconName: 'person-add',
      iconLib: Ionicons,
      colorScheme: {
        bg: '#E8F5E9', // Verde claro
        color: '#43A047', // Verde
      }
    },
    {
      name: 'diarias',
      label: 'Desafios Diários',
      iconName: 'trophy-award', // 🏆 Prêmio/trofeu - representa conquistas
      iconLib: MaterialCommunityIcons,
      colorScheme: {
        bg: '#F3E5F5', // Roxo claro
        color: '#8E44AD', // Roxo (usei a cor da sua paleta)
      }
    },
    {
      name: 'dados',
      label: 'Dados Biométricos',
      iconName: 'tape-measure',
      iconLib: MaterialCommunityIcons,
      colorScheme: {
        bg: '#F3E5F5', // Roxo claro
        color: '#8E24AA', // Roxo
      }
    },
    {
      name: 'perfil',
      label: 'Perfil',
      iconName: 'bar-chart',
      iconLib: Ionicons,
      colorScheme: {
        bg: '#FFF3E0', // Laranja claro
        color: '#EF6C00', // Laranja
      }
    },
    {
      name: 'termos',
      label: 'Termos de Uso',
      iconName: 'description',
      iconLib: MaterialIcons,
      colorScheme: {
        bg: '#E0F7FA', // Ciano claro
        color: '#00ACC1', // Ciano
      }
    },
    {
      name: 'privacidade',
      label: 'Privacidade',
      iconName: 'shield-checkmark',
      iconLib: Ionicons,
      colorScheme: {
        bg: '#E0F2F1', // Verde-água claro
        color: '#009688', // Verde-água
      }
    },
  ];

  // Configurações com cores temáticas
  const configScreens = [
    {
      name: 'configuracoes',
      label: 'Configurações',
      iconName: 'settings',
      iconLib: Ionicons,
      colorScheme: {
        bg: '#FCE4EC', // Rosa claro
        color: '#C2185B', // Rosa
      }
    },
    {
      name: 'ajuda',
      label: 'Ajuda & Suporte',
      iconName: 'help-circle',
      iconLib: Ionicons,
      colorScheme: {
        bg: '#FFF8E1', // Amarelo claro
        color: '#FF8F00', // Âmbar
      }
    },
    {
      name: 'sobre',
      label: 'Sobre o App',
      iconName: 'info',
      iconLib: MaterialIcons,
      colorScheme: {
        bg: '#F5F5F5', // Cinza claro
        color: '#616161', // Cinza
      }
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1E88E5" />

      {/* Cabeçalho do Drawer */}
      <View style={styles.header}>
        <View style={styles.avatarContainer}>
          <Image
            source={require('@/assets/images/logo.png')}
            style={styles.avatar}
            resizeMode="contain"
          />
        </View>
        <Text style={styles.appName}>Fitness Analytics</Text>
        <Text style={styles.appSubtitle}>Seu corpo em dados</Text>
      </View>

      {/* ScrollView para o conteúdo do Drawer */}
      <ScrollView
        style={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.drawerSection}>
          <Text style={styles.sectionTitle}>MENU PRINCIPAL</Text>

          {mainScreens.map((screen) => {
            const isActive = state.routes[state.index].name === screen.name;
            const IconComponent = screen.iconLib;

            return (
              <TouchableOpacity
                key={screen.name}
                style={[
                  styles.drawerItem,
                  isActive && styles.drawerItemActive
                ]}
                onPress={() => navigation.navigate(screen.name)}
              >
                <View style={[
                  styles.iconContainer,
                  {
                    backgroundColor: isActive ? screen.colorScheme.bg : '#F5F5F5',
                    borderWidth: 1,
                    borderColor: '#E0E0E0'
                  }
                ]}>
                  <IconComponent
                    name={screen.iconName as any}
                    size={22}
                    color={screen.colorScheme.color} // Ícone sempre colorido
                  />
                </View>
                <Text style={[
                  styles.drawerItemText,
                  {
                    color: isActive ? screen.colorScheme.color : '#333',
                    fontWeight: isActive ? '600' : '500'
                  }
                ]}>
                  {screen.label}
                </Text>

                {/* Indicador de tela ativa */}
                {isActive && <View style={[styles.activeIndicator, { backgroundColor: screen.colorScheme.color }]} />}
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={styles.drawerSection}>
          <Text style={styles.sectionTitle}>CONFIGURAÇÕES</Text>

          {configScreens.map((screen) => {
            const IconComponent = screen.iconLib;
            const isActive = state.routes[state.index].name === screen.name;

            return (
              <TouchableOpacity
                key={screen.name}
                style={[
                  styles.drawerItem,
                  isActive && styles.drawerItemActive
                ]}
                onPress={() => navigation.navigate(screen.name)}
              >
                <View style={[
                  styles.iconContainer,
                  {
                    backgroundColor: isActive ? screen.colorScheme.bg : '#F5F5F5',
                    borderWidth: 1,
                    borderColor: '#E0E0E0'
                  }
                ]}>
                  <IconComponent
                    name={screen.iconName as any}
                    size={22}
                    color={screen.colorScheme.color} // Ícone sempre colorido
                  />
                </View>
                <Text style={[
                  styles.drawerItemText,
                  {
                    color: isActive ? screen.colorScheme.color : '#333',
                    fontWeight: isActive ? '600' : '500'
                  }
                ]}>
                  {screen.label}
                </Text>

                {/* Indicador de tela ativa */}
                {isActive && <View style={[styles.activeIndicator, { backgroundColor: screen.colorScheme.color }]} />}
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Espaço extra no final para garantir que tudo seja rolável */}
        <View style={styles.spacer} />
      </ScrollView>

      {/* Rodapé do Drawer (FIXO no final) */}
      <View style={styles.footer}>
        <View style={styles.versionContainer}>
          <Text style={styles.versionText}>Versão 1.0.0</Text>
          <Text style={styles.copyrightText}>© 2024 Fitness Analytics</Text>
        </View>

        <TouchableOpacity
          style={styles.logoutButton}
          onPress={() => navigation.navigate('login')}
        >
          <View style={[styles.iconContainer, {
            backgroundColor: '#FFEBEE',
            borderWidth: 1,
            borderColor: '#E0E0E0'
          }]}>
            <Ionicons name="log-out" size={22} color="#D32F2F" />
          </View>
          <Text style={styles.logoutText}>Sair</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

export default function DrawerLayout() {
  return (
    <Drawer
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        drawerHideStatusBarOnOpen: false,
        headerStyle: {
          backgroundColor: '#1E88E5',
          elevation: 0,
          shadowOpacity: 0,
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: '600',
        },
        headerShadowVisible: false,
        drawerStyle: {
          width: 300,
          backgroundColor: 'transparent',
        },
        swipeEnabled: true,
      }}
    >
      {/* Telas principais */}
      <Drawer.Screen
        name="index"
        options={{
          title: 'Início',
          headerShown: true,
        }}
      />
      <Drawer.Screen
        name="login"
        options={{
          title: 'Login',
          headerShown: true,
        }}
      />
      <Drawer.Screen
        name="cadastro"
        options={{
          title: 'Cadastro',
          headerShown: true,
        }}
      />
      <Drawer.Screen
        name="dados"
        options={{
          title: 'Dados Biométricos',
          headerShown: true,
        }}
      />
      <Drawer.Screen
        name="resultados"
        options={{
          title: 'Resultados',
          headerShown: true,
        }}
      />
      <Drawer.Screen
        name="termos"
        options={{
          title: 'Termos de Uso',
          headerShown: true,
        }}
      />
      <Drawer.Screen
        name="privacidade"
        options={{
          title: 'Privacidade',
          headerShown: true,
        }}
      />

      {/* Telas que não aparecem no Drawer mas existem na navegação */}
      <Drawer.Screen
        name="esqucci-senha"
        options={{
          title: 'Recuperar Senha',
          headerShown: true,
          drawerItemStyle: { display: 'none' }
        }}
      />

      {/* Telas de configurações */}
      <Drawer.Screen
        name="configuracoes"
        options={{
          title: 'Configurações',
          headerShown: true,
        }}
      />
      <Drawer.Screen
        name="ajuda"
        options={{
          title: 'Ajuda & Suporte',
          headerShown: true,
        }}
      />
      <Drawer.Screen
        name="sobre"
        options={{
          title: 'Sobre o App',
          headerShown: true,
        }}
      />
    </Drawer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    backgroundColor: '#1E88E5',
    padding: 25,
    paddingTop: 50,
    paddingBottom: 20,
    borderBottomRightRadius: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
    borderWidth: 3,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  avatar: {
    width: 60,
    height: 60,
  },
  appName: {
    fontSize: 22,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  appSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    fontStyle: 'italic',
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
    fontSize: 12,
    fontWeight: '600',
    color: '#9E9E9E',
    marginBottom: 15,
    marginLeft: 5,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  drawerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderRadius: 12,
    marginBottom: 4,
    backgroundColor: '#FFF',
    position: 'relative',
  },
  drawerItemActive: {
    backgroundColor: 'rgba(30, 136, 229, 0.05)',
  },
  drawerItemText: {
    fontSize: 15,
    color: '#333',
    marginLeft: 15,
    fontWeight: '500',
    flex: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  activeIndicator: {
    width: 4,
    height: 24,
    backgroundColor: '#1E88E5',
    borderRadius: 2,
    position: 'absolute',
    right: 10,
  },
  spacer: {
    height: 20,
  },
  footer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    backgroundColor: '#F8F9FA',
  },
  versionContainer: {
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    marginBottom: 15,
  },
  versionText: {
    fontSize: 12,
    color: '#9E9E9E',
    textAlign: 'center',
    marginBottom: 4,
  },
  copyrightText: {
    fontSize: 11,
    color: '#BDBDBD',
    textAlign: 'center',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#FFCDD2',
  },
  logoutText: {
    fontSize: 15,
    color: '#D32F2F',
    marginLeft: 15,
    fontWeight: '600',
  },
});