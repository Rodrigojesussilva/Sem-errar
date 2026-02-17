import FontAwesome from '@expo/vector-icons/FontAwesome';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  StatusBar,
  Dimensions,
  Modal,
  FlatList,
  Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

const COLORS = {
  primary: '#622db2',
  dot: '#4ecdc4',
  line: 'rgba(112, 82, 230, 0.15)',
  textMain: '#1A1A1A',
  disabled: '#F0F0F0',
  error: '#ff6b6b'
};

const CustomSelect = ({ label, value, options, onSelect, placeholder }: any) => {
  const [modalVisible, setModalVisible] = useState(false);
  const displayLabel = options.find((o: any) => (typeof o === 'string' ? o === value : o.value === value));
  const currentText = typeof displayLabel === 'object' ? displayLabel.label : displayLabel || placeholder;

  return (
    <View style={styles.pickerWrapper}>
      <Text style={styles.pickerLabel}>{label}</Text>
      <Pressable 
        style={[styles.pickerContainer, value && styles.pickerSelected]} 
        onPress={() => setModalVisible(true)}
      >
        <Text style={[styles.pickerValueText, !value && { color: '#999' }]}>
          {currentText}
        </Text>
        <FontAwesome name="chevron-down" size={10} color={value ? COLORS.primary : '#CCC'} />
      </Pressable>

      <Modal transparent visible={modalVisible} animationType="slide">
        <Pressable style={styles.modalOverlay} onPress={() => setModalVisible(false)}>
          <View style={styles.modalContent}>
            <View style={styles.modalIndicator} />
            <Text style={styles.modalTitle}>Selecione o {label}</Text>
            <FlatList
              data={options}
              keyExtractor={(item) => (typeof item === 'string' ? item : item.value)}
              renderItem={({ item }) => {
                const itemValue = typeof item === 'string' ? item : item.value;
                const itemLabel = typeof item === 'string' ? item : item.labelFull || item.label;
                const isSelected = itemValue === value;

                return (
                  <Pressable 
                    style={[styles.modalOption, isSelected && styles.modalOptionSelected]}
                    onPress={() => {
                      onSelect(itemValue);
                      setModalVisible(false);
                    }}
                  >
                    <Text style={[styles.modalOptionText, isSelected && styles.modalOptionTextSelected]}>
                      {itemLabel}
                    </Text>
                    {isSelected && <FontAwesome name="check-circle" size={18} color={COLORS.primary} />}
                  </Pressable>
                );
              }}
            />
          </View>
        </Pressable>
      </Modal>
    </View>
  );
};

export default function IdadeScreen() {
  const router = useRouter();
  const [dia, setDia] = useState('');
  const [mes, setMes] = useState('');
  const [ano, setAno] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [idade, setIdade] = useState<number | null>(null);

  const dias = Array.from({ length: 31 }, (_, i) => (i + 1).toString().padStart(2, '0'));
  const meses = [
    { value: '01', label: 'Jan', labelFull: 'Janeiro' },
    { value: '02', label: 'Fev', labelFull: 'Fevereiro' },
    { value: '03', label: 'Mar', labelFull: 'Março' },
    { value: '04', label: 'Abr', labelFull: 'Abril' },
    { value: '05', label: 'Mai', labelFull: 'Maio' },
    { value: '06', label: 'Jun', labelFull: 'Junho' },
    { value: '07', label: 'Jul', labelFull: 'Julho' },
    { value: '08', label: 'Ago', labelFull: 'Agosto' },
    { value: '09', label: 'Set', labelFull: 'Setembro' },
    { value: '10', label: 'Out', labelFull: 'Outubro' },
    { value: '11', label: 'Nov', labelFull: 'Novembro' },
    { value: '12', label: 'Dez', labelFull: 'Dezembro' }
  ];
  const anos = Array.from({ length: 100 }, (_, i) => (new Date().getFullYear() - i).toString());

  useEffect(() => {
    if (dia && mes && ano) {
      const hoje = new Date();
      const nascimento = new Date(parseInt(ano), parseInt(mes) - 1, parseInt(dia));
      let idadeCalc = hoje.getFullYear() - nascimento.getFullYear();
      if (hoje.getMonth() < nascimento.getMonth() || (hoje.getMonth() === nascimento.getMonth() && hoje.getDate() < nascimento.getDate())) {
        idadeCalc--;
      }
      setIdade(nascimento > hoje ? -1 : idadeCalc);
    }
  }, [dia, mes, ano]);

  const handleProximo = async () => {
    if (idade !== null && idade >= 0) {
      setIsLoading(true);
      try {
        await AsyncStorage.setItem('@idade', idade.toString());
        router.push('/(drawer)/AlturaScreen');
      } catch (error) {
        Alert.alert('Erro', 'Não foi possível salvar.');
      } finally {
        setIsLoading(false);
      }
    }
  };

  // PADRÃO DE FUNDO EXCLUSIVO PARA ESTA TELA
  const renderStaticBackground = () => (
    <View style={styles.visualArea}>
      {/* Elipse superior esquerda mais suave */}
      <View style={[styles.ellipseLine, { width: width * 1.1, height: width * 1.1, top: -width * 0.6, left: -width * 0.2, transform: [{ rotate: '-10deg' }] }]}>
         <View style={[styles.staticDot, { bottom: '15%', right: '25%' }]} />
      </View>
      
      {/* Elipse grande que sobe do fundo à direita - Diferente da tela de objetivo */}
      <View style={[styles.ellipseLine, { width: width * 1.4, height: width * 1.4, bottom: -width * 0.5, right: -width * 0.4, transform: [{ rotate: '45deg' }] }]}>
        <View style={[styles.staticDot, { top: '20%', left: '30%' }]} />
      </View>

      {/* Linha central sutil */}
      <View style={[styles.ellipseLine, { width: width * 0.8, height: height * 0.5, top: height * 0.25, left: -width * 0.5, transform: [{ rotate: '20deg' }], borderStyle: 'dashed', opacity: 0.5 }]}>
        <View style={[styles.staticDot, { bottom: '10%', right: '5%' }]} />
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" translucent backgroundColor="transparent" />
      
      <View style={StyleSheet.absoluteFill}>
        <View style={{ flex: 1, backgroundColor: '#fff' }} />
        {renderStaticBackground()}
      </View>

      <View style={styles.header}>
        <Pressable onPress={() => router.replace('/(drawer)/SexoScreen')} style={styles.backButton}>
          <View style={styles.backIconCircle}>
            <FontAwesome name="chevron-left" size={12} color={COLORS.primary} />
          </View>
          <Text style={styles.backText}>Voltar</Text>
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <View style={styles.logoContainer}>
            <Image 
              source={require('../../assets/images/logo-sem-fundo1.png')} 
              style={styles.logo}
              resizeMode="contain"
            />
          </View>

          <Text style={styles.title}>Qual sua data de nascimento?</Text>

          <View style={styles.pickerRow}>
            <CustomSelect label="Dia" value={dia} options={dias} onSelect={setDia} placeholder="--" />
            <CustomSelect label="Mês" value={mes} options={meses} onSelect={setMes} placeholder="--" />
            <CustomSelect label="Ano" value={ano} options={anos} onSelect={setAno} placeholder="----" />
          </View>

          {idade !== null && (
            <View style={[styles.feedbackCard, idade < 0 && { borderColor: COLORS.error, backgroundColor: '#FFF5F5' }]}>
              <FontAwesome name={idade < 0 ? "exclamation-triangle" : "birthday-cake"} size={18} color={idade < 0 ? COLORS.error : COLORS.primary} />
              <Text style={[styles.feedbackText, idade < 0 && { color: COLORS.error }]}>
                {idade < 0 ? "Data inválida" : `Você tem ${idade} anos`}
              </Text>
            </View>
          )}

          <Pressable 
            onPress={handleProximo} 
            disabled={!dia || !mes || !ano || idade! < 0 || isLoading} 
            style={styles.buttonWrapper}
          >
            <LinearGradient
              colors={(!dia || !mes || !ano || idade! < 0) ? ['#F0F0F0', '#F0F0F0'] : ['#7b42d5', '#622db2', '#4b208c']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.primaryButton}
            >
              <Text style={[styles.primaryText, (!dia || !mes || !ano || idade! < 0) && { color: '#AAA' }]}>
                {isLoading ? 'Salvando...' : 'Próximo'}
              </Text>
            </LinearGradient>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  visualArea: { ...StyleSheet.absoluteFillObject, overflow: 'hidden', zIndex: 0 },
  ellipseLine: { position: 'absolute', borderWidth: 1.5, borderColor: COLORS.line, borderRadius: 999 },
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
  backButton: { flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-start' },
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
  backText: { color: COLORS.primary, marginLeft: 10, fontWeight: '700', fontSize: 16 },
  scrollContent: { flexGrow: 1, paddingHorizontal: 25, paddingBottom: 40, justifyContent: 'center' },
  content: { width: '100%', zIndex: 10 },
  logoContainer: { alignItems: 'center', marginBottom: 20, marginTop: 5 },
  logo: { width: width * 0.5, height: 70 },
  title: { fontSize: 26, fontWeight: '900', color: COLORS.textMain, textAlign: 'center', marginBottom: 40 },
  pickerRow: { flexDirection: 'row', gap: 12, marginBottom: 30 },
  pickerWrapper: { flex: 1 },
  pickerLabel: { fontSize: 12, fontWeight: '800', color: COLORS.primary, marginBottom: 8, textAlign: 'center', textTransform: 'uppercase' },
  pickerContainer: { 
    height: 62, 
    backgroundColor: '#fff', 
    borderRadius: 18, 
    borderWidth: 1.5, 
    borderColor: '#F0F0F0', 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'center', 
    elevation: 3,
  },
  pickerSelected: { borderColor: COLORS.primary, borderWidth: 2 },
  pickerValueText: { fontSize: 16, fontWeight: '700', color: COLORS.textMain, marginRight: 5 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: '#fff', borderTopLeftRadius: 35, borderTopRightRadius: 35, padding: 25, maxHeight: height * 0.7 },
  modalIndicator: { width: 40, height: 5, backgroundColor: '#EEE', borderRadius: 3, alignSelf: 'center', marginBottom: 15 },
  modalTitle: { fontSize: 20, fontWeight: '900', color: COLORS.textMain, textAlign: 'center', marginBottom: 20 },
  modalOption: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 18, borderBottomWidth: 1, borderBottomColor: '#F8F8F8' },
  modalOptionSelected: { backgroundColor: '#F8F4FF', borderRadius: 15, paddingHorizontal: 10 },
  modalOptionText: { fontSize: 17, color: '#555', fontWeight: '500' },
  modalOptionTextSelected: { color: COLORS.primary, fontWeight: '800' },
  feedbackCard: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginBottom: 30, backgroundColor: '#F8F4FF', padding: 18, borderRadius: 20, borderWidth: 1, borderColor: COLORS.line },
  feedbackText: { marginLeft: 10, fontSize: 16, fontWeight: '700', color: COLORS.primary },
  buttonWrapper: { borderRadius: 22, overflow: 'hidden', elevation: 4 },
  primaryButton: { paddingVertical: 18, alignItems: 'center' },
  primaryText: { color: '#fff', fontSize: 18, fontWeight: '800' },
});