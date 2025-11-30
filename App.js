import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  ActivityIndicator,
  Alert,
  ScrollView,
} from 'react-native';
import axios from 'axios';

const obterDetalhes = (classificacao) => {
  switch (classificacao) {
    case 'Underweight':
    case 'Severe Thinness':
    case 'Moderate Thinness':
    case 'Mild Thinness':
      return { emoji: '🙁', mensagem: 'Cuidado! Você está abaixo do peso.', cor: '#3498db' }; 
    case 'Normal weight':
      return { emoji: '😀', mensagem: 'Muito bem! Você está com peso ideal.', cor: '#2ecc71' }; 
    case 'Overweight':
      return { emoji: '😟', mensagem: 'Preocupante! Você está com sobrepeso.', cor: '#f39c12' }; 
    case 'Obese Class I':
      return { emoji: '🚨', mensagem: 'Cuidado! Você está com obesidade Grau I.', cor: '#e67e22' }; 
    case 'Obese Class II':
    case 'Obese Class III':
      return { emoji: '❗', mensagem: 'Cuidado! Você está com Obesidade Mórbida.', cor: '#c0392b' };
    default:
      return { emoji: '❓', mensagem: 'Classificação não encontrada.', cor: '#7f8c8d' };
  }
};

const AppCalculadoraImc = () => {
  const [peso, definirPeso] = useState('');
  const [altura, definirAltura] = useState('');
  const [dadosIMC, definirDadosIMC] = useState(null); 
  const [carregando, definirCarregando] = useState(false);

  const calcularIMC = async () => {
    definirDadosIMC(null); 

    const pesoNum = parseFloat(peso.replace(',', '.'));
    const alturaNum = parseFloat(altura.replace(',', '.'));

    if (isNaN(pesoNum) || isNaN(alturaNum) || pesoNum <= 0 || alturaNum <= 0) {
      Alert.alert('Erro!', 'Insira peso e altura válidos.');
      return;
    }

    const url = `https://bmicalculatorapi.vercel.app/api/bmi/${pesoNum}/${alturaNum}`;
    definirCarregando(true);

    try {
      const resposta = await axios.get(url);
      definirDadosIMC(resposta.data); 
      
    } catch (erro) {
      Alert.alert('Erro!', 'Não foi possível conectar o serviço de cálculo.');
    } finally {
      definirCarregando(false);
    }
  };

  const detalhesResultado = dadosIMC ? obterDetalhes(dadosIMC.Category) : null;

  return (
    <ScrollView contentContainerStyle={estilos.container}>
      
      <View style={estilos.contentContainer}>
        <Text style={estilos.cabecalho}>Calculadora de IMC Unifacisa</Text>
        
        <TextInput
          style={estilos.entrada}
          placeholder="Peso (kg) Ex: 80.0"
          keyboardType="numeric"
          onChangeText={definirPeso}
          value={peso}
        />
        <TextInput
          style={estilos.entrada}
          placeholder="Altura (m) Ex: 1.65"
          keyboardType="numeric"
          onChangeText={definirAltura}
          value={altura}
        />

        <View style={estilos.containerBotao}>
          <Button
            title="Calcular"
            onPress={calcularIMC}
            disabled={carregando}
            color="#3498db"
          />
        </View>

        {carregando && <ActivityIndicator size="large" color="#3498db" style={{ marginTop: 20 }} />}

        {dadosIMC && detalhesResultado && (
          <View style={[estilos.caixaResultado, { backgroundColor: detalhesResultado.cor }]}>
            
            <Text style={estilos.emojiResultado}>{detalhesResultado.emoji}</Text>
            
            <Text style={estilos.rotuloValorIMC}>Seu IMC é:</Text>
            <Text style={estilos.valorIMC}>
              {dadosIMC.bmi.toFixed(2)}
            </Text>
            
            <Text style={estilos.categoria}>
              {detalhesResultado.mensagem.split('.')[0]}
            </Text>

            <Text style={estilos.textoInterpretacao}>
              {detalhesResultado.mensagem}
            </Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
};

const estilos = StyleSheet.create({
  container: {
    padding: 20,
    paddingTop: 50,
    backgroundColor: '#f5f5f5',
    flexGrow: 1, 
    alignItems: 'center', 
  },
  contentContainer: {
    width: '50%', 
    alignItems: 'center', 
  },
  cabecalho: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 30,
    textAlign: 'center',
    width: '100%', 
  },
  entrada: {
    height: 50,
    backgroundColor: '#fff',
    borderColor: '#bdc3c7',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    fontSize: 16,
    marginBottom: 15,
    width: '100%',
    textAlign: 'center', 
  },
  containerBotao: {
    marginTop: 10,
    marginBottom: 20,
    width: '100%', 
  },
  caixaResultado: {
    marginTop: 20,
    padding: 20,
    borderRadius: 8,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 4,
    width: '100%', 
  },
  emojiResultado: {
    fontSize: 60,
    marginBottom: 10,
  },
  rotuloValorIMC: {
    fontSize: 18,
    color: '#fff',
    fontWeight: '500',
  },
  valorIMC: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  categoria: {
    fontSize: 22,
    fontWeight: '600',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 10,
  },
  textoInterpretacao: {
    fontSize: 16,
    textAlign: 'center',
    color: '#fff',
    paddingHorizontal: 10,
    opacity: 0.9,
  },
});

export default AppCalculadoraImc;