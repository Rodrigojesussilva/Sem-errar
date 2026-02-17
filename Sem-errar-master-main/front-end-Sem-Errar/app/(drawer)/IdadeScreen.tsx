import FontAwesome from '@expo/vector-icons/FontAwesome';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from '@react-native-picker/picker';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert, Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

export default function IdadeScreen() {
  const router = useRouter();
  const [dia, setDia] = useState<string>('');
  const [mes, setMes] = useState<string>('');
  const [ano, setAno] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [idade, setIdade] = useState<number | null>(null);

  // Gerar arrays para os pickers
  const dias = Array.from({ length: 31 }, (_, i) => (i + 1).toString().padStart(2, '0'));
  const meses = [
    { value: '01', label: 'Jan' },
    { value: '02', label: 'Fev' },
    { value: '03', label: 'Mar' },
    { value: '04', label: 'Abr' },
    { value: '05', label: 'Mai' },
    { value: '06', label: 'Jun' },
    { value: '07', label: 'Jul' },
    { value: '08', label: 'Ago' },
    { value: '09', label: 'Set' },
    { value: '10', label: 'Out' },
    { value: '11', label: 'Nov' },
    { value: '12', label: 'Dez' }
  ];
  const anoAtual = new Date().getFullYear();
  const anos = Array.from({ length: 120 }, (_, i) => (anoAtual - i).toString());

  // Carregar data salva ao iniciar a tela
  useEffect(() => {
    carregarDataSalva();
  }, []);

  const carregarDataSalva = async () => {
    try {
      const dataSalva = await AsyncStorage.getItem('@dataNascimento');
      
      if (dataSalva) {
        const [anoSalvo, mesSalvo, diaSalvo] = dataSalva.split('-');
        setDia(diaSalvo);
        setMes(mesSalvo);
        setAno(anoSalvo);
        calcularIdade(parseInt(anoSalvo), parseInt(mesSalvo) - 1, parseInt(diaSalvo));
      }
    } catch (error) {
      console.error('Erro ao carregar data de nascimento:', error);
    }
  };

  const calcularIdade = (anoNum: number, mesNum: number, diaNum: number) => {
    const hoje = new Date();
    const nascimento = new Date(anoNum, mesNum, diaNum);
    
    // Verificar se a data é válida
    if (isNaN(nascimento.getTime())) {
      setIdade(null);
      return;
    }

    // Verificar se a data não é futura
    if (nascimento > hoje) {
      setIdade(null);
      Alert.alert('Data inválida', 'A data de nascimento não pode ser no futuro.');
      return;
    }

    let idadeCalculada = hoje.getFullYear() - nascimento.getFullYear();
    const mesAtual = hoje.getMonth();
    const diaAtual = hoje.getDate();
    
    if (mesAtual < mesNum || (mesAtual === mesNum && diaAtual < diaNum)) {
      idadeCalculada--;
    }
    
    setIdade(idadeCalculada);
  };

  const handleDateChange = () => {
    if (dia && mes && ano) {
      calcularIdade(parseInt(ano), parseInt(mes) - 1, parseInt(dia));
    } else {
      setIdade(null);
    }
  };

  // Atualizar idade quando dia, mês ou ano mudar
  useEffect(() => {
    handleDateChange();
  }, [dia, mes, ano]);

  const handleProximo = async () => {
    if (dia && mes && ano) {
      if (idade !== null && idade >= 0) {
        setIsLoading(true);
        try {
          // Formatar data no padrão ISO para salvar
          const dataFormatada = `${ano}-${mes}-${dia}`;
          await AsyncStorage.setItem('@dataNascimento', dataFormatada);
          
          // Salvar idade também para compatibilidade
          await AsyncStorage.setItem('@idade', idade.toString());
          
          console.log('Data de nascimento salva:', `${dia}/${mes}/${ano}`);
          console.log('Idade calculada:', idade);
          
          // Navegar para próxima tela
          router.push('/AlturaScreen');
        } catch (error) {
          console.error('Erro ao salvar data de nascimento:', error);
          Alert.alert('Erro', 'Não foi possível salvar sua data de nascimento. Tente novamente.');
        } finally {
          setIsLoading(false);
        }
      } else {
        Alert.alert('Data inválida', 'Por favor, selecione uma data de nascimento válida.');
      }
    }
  };

  const handleVoltar = () => {
    router.push('/SexoScreen');
  };

  const dataCompleta = dia && mes && ano && idade !== null && idade >= 0;

  return (
    <View style={styles.background}>
      {/* BOTÃO VOLTAR NO TOPO - FIXO */}
      <View style={styles.headerContainer}>
        <Pressable 
          style={styles.backButton}
          onPress={handleVoltar}
        >
          <FontAwesome name="arrow-left" size={20} color="#1E88E5" />
          <Text style={styles.backButtonText}>Voltar</Text>
        </Pressable>
      </View>

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* CONTAINER PRINCIPAL */}
        <View style={styles.mainContainer}>
          {/* IMAGEM NO TOPO */}
          <View style={styles.imageContainer}>
            <Image
              source={require('@/assets/images/logo2.png')}
              style={styles.topImage}
              resizeMode="cover"
            />
          </View>
          
          {/* CONTEÚDO ABAIXO DA IMAGEM */}
          <View style={styles.content}>
            <View style={styles.headerSection}>
              <Text style={styles.sectionTitle}>📏 Medidas básicas (1 de 3)</Text>
              <Text style={styles.welcomeTitle}>Qual é sua data de nascimento?</Text>
              <Text style={styles.obrigatorio}>* obrigatório</Text>
            </View>
            
            <Text style={styles.subtitle}>
              Sua idade influencia na quantidade de energia que seu corpo precisa por dia.
            </Text>
            
            {/* SELETOR DE DATA COM 3 COLUNAS */}
            <View style={styles.dateContainer}>
              <Text style={styles.dateLabel}>Data de nascimento:</Text>
              
              <View style={styles.pickerRow}>
                {/* PICKER DE DIA */}
                <View style={styles.pickerWrapper}>
                  <Text style={styles.pickerLabel}>Dia</Text>
                  <View style={[
                    styles.pickerContainer,
                    dia && styles.pickerContainerSelected
                  ]}>
                    <Picker
                      selectedValue={dia}
                      onValueChange={(itemValue) => setDia(itemValue)}
                      style={styles.picker}
                      dropdownIconColor="#1E88E5"
                    >
                      <Picker.Item label="DD" value="" />
                      {dias.map((d) => (
                        <Picker.Item key={d} label={d} value={d} />
                      ))}
                    </Picker>
                  </View>
                </View>

                {/* PICKER DE MÊS */}
                <View style={styles.pickerWrapper}>
                  <Text style={styles.pickerLabel}>Mês</Text>
                  <View style={[
                    styles.pickerContainer,
                    mes && styles.pickerContainerSelected
                  ]}>
                    <Picker
                      selectedValue={mes}
                      onValueChange={(itemValue) => setMes(itemValue)}
                      style={styles.picker}
                      dropdownIconColor="#1E88E5"
                    >
                      <Picker.Item label="MÊS" value="" />
                      {meses.map((m) => (
                        <Picker.Item key={m.value} label={m.label} value={m.value} />
                      ))}
                    </Picker>
                  </View>
                </View>

                {/* PICKER DE ANO */}
                <View style={styles.pickerWrapper}>
                  <Text style={styles.pickerLabel}>Ano</Text>
                  <View style={[
                    styles.pickerContainer,
                    ano && styles.pickerContainerSelected
                  ]}>
                    <Picker
                      selectedValue={ano}
                      onValueChange={(itemValue) => setAno(itemValue)}
                      style={styles.picker}
                      dropdownIconColor="#1E88E5"
                    >
                      <Picker.Item label="AAAA" value="" />
                      {anos.map((a) => (
                        <Picker.Item key={a} label={a} value={a} />
                      ))}
                    </Picker>
                  </View>
                </View>
              </View>
              
              {idade !== null && idade >= 0 && dataCompleta && (
                <View style={styles.idadeInfo}>
                  <FontAwesome name="birthday-cake" size={18} color="#1E88E5" />
                  <Text style={styles.idadeText}>
                    Você tem <Text style={styles.idadeDestaque}>{idade} anos</Text>
                  </Text>
                </View>
              )}

              {idade !== null && idade < 0 && (
                <View style={[styles.idadeInfo, styles.idadeInfoError]}>
                  <FontAwesome name="exclamation-circle" size={18} color="#FF5722" />
                  <Text style={styles.idadeTextError}>
                    Data de nascimento inválida
                  </Text>
                </View>
              )}
            </View>
            
            <View style={styles.divider} />
            
            {/* BOTÃO PRÓXIMO */}
            <Pressable 
              style={[
                styles.primaryButton,
                (!dataCompleta || isLoading) && styles.primaryButtonDisabled
              ]}
              onPress={handleProximo}
              disabled={!dataCompleta || isLoading}
            >
              <View style={styles.buttonContent}>
                <FontAwesome name="arrow-right" size={22} color="#FFFFFF" />
                <Text style={styles.primaryText}>
                  {isLoading ? 'Salvando...' : 'Próximo'}
                </Text>
              </View>
              <Text style={styles.buttonSubtitle}>
                {dataCompleta 
                  ? 'Continue para a próxima etapa' 
                  : 'Selecione sua data de nascimento para continuar'}
              </Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },

  // Header fixo com botão voltar
  headerContainer: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    zIndex: 10,
  },

  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },

  backButtonText: {
    color: '#1E88E5',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  
  scrollView: {
    flex: 1,
  },
  
  scrollContent: {
    flexGrow: 1,
    paddingTop: 15,
    paddingBottom: 30,
    paddingHorizontal: 5,
  },

  mainContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    marginHorizontal: 15,
    maxWidth: 400,
    alignSelf: 'center',
    width: '92%',
    marginTop: 5,
  },

  imageContainer: {
    height: 170,
    width: '100%',
    overflow: 'hidden',
    backgroundColor: '#F5F5F5',
  },

  topImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },

  content: {
    paddingHorizontal: 20,
    paddingTop: 28,
    paddingBottom: 28,
    alignItems: 'center',
  },

  headerSection: {
    alignItems: 'center',
    marginBottom: 20,
  },

  sectionTitle: {
    color: '#666666',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 12,
    backgroundColor: '#F0F9FF',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#1E88E5',
  },

  welcomeTitle: {
    color: '#000000',
    fontSize: 26,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 8,
    lineHeight: 32,
  },

  obrigatorio: {
    color: '#FF5722',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 22,
  },

  subtitle: {
    color: '#666666',
    fontSize: 17,
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 24,
  },

  // Estilos para os pickers
  dateContainer: {
    width: '100%',
    marginBottom: 28,
  },

  dateLabel: {
    color: '#000000',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 20,
    textAlign: 'center',
  },

  pickerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
    marginBottom: 20,
  },

  pickerWrapper: {
    flex: 1,
  },

  pickerLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
    marginLeft: 2,
    fontWeight: '500',
  },

  pickerContainer: {
    backgroundColor: '#F8F9FA',
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: '#E0E0E0',
    overflow: 'hidden',
    height: 55, // AUMENTEI A ALTURA DE 45 PARA 55
    justifyContent: 'center',
  },

  pickerContainerSelected: {
    borderColor: '#1E88E5',
    backgroundColor: '#F0F9FF',
    borderWidth: 1.5,
  },

  picker: {
    height: 55, // AUMENTEI A ALTURA DE 45 PARA 55
    width: '100%',
    color: '#000000',
    backgroundColor: 'transparent',
    marginLeft: -5,
  },

  idadeInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F0F9FF',
    paddingVertical: 14,
    paddingHorizontal: 18,
    borderRadius: 12,
    marginTop: 8,
    borderWidth: 1,
    borderColor: '#1E88E5',
  },

  idadeInfoError: {
    backgroundColor: '#FFF1F0',
    borderColor: '#FF5722',
  },

  idadeText: {
    color: '#333333',
    fontSize: 16,
    marginLeft: 8,
  },

  idadeTextError: {
    color: '#FF5722',
    fontSize: 16,
    marginLeft: 8,
    fontWeight: '500',
  },

  idadeDestaque: {
    color: '#1E88E5',
    fontWeight: '700',
    fontSize: 18,
  },

  divider: {
    height: 1,
    width: '100%',
    backgroundColor: '#E0E0E0',
    marginVertical: 22,
  },

  primaryButton: {
    width: '100%',
    backgroundColor: '#1E88E5',
    borderRadius: 18,
    paddingVertical: 22,
    paddingHorizontal: 26,
    alignItems: 'center',
    shadowColor: '#1E88E5',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 8,
    marginBottom: 12,
  },

  primaryButtonDisabled: {
    backgroundColor: '#CCCCCC',
    shadowColor: '#CCCCCC',
  },

  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    marginBottom: 8,
  },

  primaryText: {
    color: '#FFFFFF',
    fontSize: 21,
    fontWeight: '700',
  },

  buttonSubtitle: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: 15,
    fontWeight: '500',
    textAlign: 'center',
  },
});