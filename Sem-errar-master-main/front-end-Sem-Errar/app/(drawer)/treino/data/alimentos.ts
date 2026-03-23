// app/(drawer)/treino/data/alimentos.ts
export interface AlimentoData {
  id: string;
  nome: string;
  calorias: number;
  quantidade: string;
  categoria?: 'cafe' | 'almoco' | 'jantar' | 'lanche' | 'bebida';
  proteinas?: number;
  carboidratos?: number;
  gorduras?: number;
}

export const alimentos: AlimentoData[] = [
  // CAFÉ DA MANHÃ
  { id: '1', nome: 'Pão Francês', calorias: 135, quantidade: '1 unidade (50g)', categoria: 'cafe', proteinas: 4, carboidratos: 25, gorduras: 2 },
  { id: '2', nome: 'Pão de Forma Integral', calorias: 110, quantidade: '2 fatias (50g)', categoria: 'cafe', proteinas: 4, carboidratos: 18, gorduras: 2 },
  { id: '3', nome: 'Pão de Queijo', calorias: 120, quantidade: '1 unidade (40g)', categoria: 'cafe', proteinas: 3, carboidratos: 15, gorduras: 5 },
  { id: '4', nome: 'Ovo Frito', calorias: 90, quantidade: '1 unidade', categoria: 'cafe', proteinas: 6, carboidratos: 0.5, gorduras: 7 },
  { id: '5', nome: 'Ovo Cozido', calorias: 78, quantidade: '1 unidade', categoria: 'cafe', proteinas: 6, carboidratos: 0.5, gorduras: 5 },
  { id: '6', nome: 'Omelete', calorias: 150, quantidade: '2 ovos', categoria: 'cafe', proteinas: 12, carboidratos: 1, gorduras: 10 },
  { id: '7', nome: 'Leite Integral', calorias: 120, quantidade: '1 copo (200ml)', categoria: 'cafe', proteinas: 6, carboidratos: 9, gorduras: 6 },
  { id: '8', nome: 'Leite Desnatado', calorias: 70, quantidade: '1 copo (200ml)', categoria: 'cafe', proteinas: 6, carboidratos: 9, gorduras: 0.5 },
  { id: '9', nome: 'Café com Açúcar', calorias: 40, quantidade: '1 xícara (50ml)', categoria: 'cafe' },
  { id: '10', nome: 'Café sem Açúcar', calorias: 5, quantidade: '1 xícara (50ml)', categoria: 'cafe' },
  { id: '11', nome: 'Café com Leite', calorias: 80, quantidade: '1 xícara (150ml)', categoria: 'cafe', proteinas: 4, carboidratos: 8, gorduras: 3 },
  { id: '12', nome: 'Iogurte Natural', calorias: 80, quantidade: '1 pote (170g)', categoria: 'cafe', proteinas: 6, carboidratos: 8, gorduras: 2 },
  { id: '13', nome: 'Iogurte de Frutas', calorias: 150, quantidade: '1 pote (170g)', categoria: 'cafe', proteinas: 5, carboidratos: 25, gorduras: 2 },
  { id: '14', nome: 'Queijo Minas', calorias: 80, quantidade: '1 fatia (30g)', categoria: 'cafe', proteinas: 5, carboidratos: 0.5, gorduras: 6 },
  { id: '15', nome: 'Queijo Mussarela', calorias: 85, quantidade: '1 fatia (30g)', categoria: 'cafe', proteinas: 6, carboidratos: 0.5, gorduras: 6 },
  { id: '16', nome: 'Requeijão', calorias: 70, quantidade: '1 colher sopa (25g)', categoria: 'cafe', proteinas: 2, carboidratos: 1, gorduras: 6 },
  { id: '17', nome: 'Manteiga', calorias: 75, quantidade: '1 colher chá (10g)', categoria: 'cafe', proteinas: 0, carboidratos: 0, gorduras: 8 },
  { id: '18', nome: 'Margarina', calorias: 70, quantidade: '1 colher chá (10g)', categoria: 'cafe', proteinas: 0, carboidratos: 0, gorduras: 8 },
  { id: '19', nome: 'Presunto', calorias: 30, quantidade: '1 fatia (15g)', categoria: 'cafe', proteinas: 3, carboidratos: 0.5, gorduras: 2 },
  { id: '20', nome: 'Peito de Peru', calorias: 25, quantidade: '1 fatia (15g)', categoria: 'cafe', proteinas: 4, carboidratos: 0.5, gorduras: 1 },
  
  // FRUTAS
  { id: '21', nome: 'Banana', calorias: 105, quantidade: '1 unidade (100g)', categoria: 'lanche', proteinas: 1, carboidratos: 27, gorduras: 0.3 },
  { id: '22', nome: 'Maçã', calorias: 95, quantidade: '1 unidade (150g)', categoria: 'lanche', proteinas: 0.5, carboidratos: 25, gorduras: 0.3 },
  { id: '23', nome: 'Laranja', calorias: 70, quantidade: '1 unidade (150g)', categoria: 'lanche', proteinas: 1.5, carboidratos: 15, gorduras: 0.2 },
  { id: '24', nome: 'Morango', calorias: 30, quantidade: '10 unidades (100g)', categoria: 'lanche', proteinas: 0.7, carboidratos: 7, gorduras: 0.3 },
  { id: '25', nome: 'Abacate', calorias: 160, quantidade: '1/2 unidade (100g)', categoria: 'lanche', proteinas: 2, carboidratos: 8, gorduras: 14 },
  { id: '26', nome: 'Mamão', calorias: 55, quantidade: '1 fatia (100g)', categoria: 'lanche', proteinas: 0.5, carboidratos: 13, gorduras: 0.2 },
  { id: '27', nome: 'Melancia', calorias: 30, quantidade: '1 fatia (100g)', categoria: 'lanche', proteinas: 0.6, carboidratos: 7, gorduras: 0.1 },
  { id: '28', nome: 'Uva', calorias: 70, quantidade: '1 cacho (100g)', categoria: 'lanche', proteinas: 0.6, carboidratos: 18, gorduras: 0.1 },
  { id: '29', nome: 'Abacaxi', calorias: 50, quantidade: '1 fatia (100g)', categoria: 'lanche', proteinas: 0.5, carboidratos: 13, gorduras: 0.1 },
  { id: '30', nome: 'Melão', calorias: 30, quantidade: '1 fatia (100g)', categoria: 'lanche', proteinas: 0.5, carboidratos: 7, gorduras: 0.1 },
  
  // ALMOÇO E JANTAR
  { id: '31', nome: 'Arroz Branco Cozido', calorias: 130, quantidade: '1 colher servir (100g)', categoria: 'almoco', proteinas: 2, carboidratos: 28, gorduras: 0.2 },
  { id: '32', nome: 'Arroz Integral Cozido', calorias: 110, quantidade: '1 colher servir (100g)', categoria: 'almoco', proteinas: 2.5, carboidratos: 23, gorduras: 0.8 },
  { id: '33', nome: 'Feijão Preto Cozido', calorias: 80, quantidade: '1 concha (100g)', categoria: 'almoco', proteinas: 5, carboidratos: 14, gorduras: 0.5 },
  { id: '34', nome: 'Feijão Carioca Cozido', calorias: 75, quantidade: '1 concha (100g)', categoria: 'almoco', proteinas: 4.5, carboidratos: 13, gorduras: 0.4 },
  { id: '35', nome: 'Lentilha Cozida', calorias: 90, quantidade: '1 concha (100g)', categoria: 'almoco', proteinas: 7, carboidratos: 15, gorduras: 0.3 },
  { id: '36', nome: 'Grão de Bico Cozido', calorias: 140, quantidade: '1 concha (100g)', categoria: 'almoco', proteinas: 7, carboidratos: 22, gorduras: 2 },
  
  // CARNES
  { id: '37', nome: 'Frango Grelhado', calorias: 165, quantidade: '1 filé (100g)', categoria: 'almoco', proteinas: 31, carboidratos: 0, gorduras: 3.6 },
  { id: '38', nome: 'Frango Cozido', calorias: 150, quantidade: '1 pedaço (100g)', categoria: 'almoco', proteinas: 28, carboidratos: 0, gorduras: 3 },
  { id: '39', nome: 'Carne Bovina Grelhada', calorias: 200, quantidade: '1 bife (100g)', categoria: 'jantar', proteinas: 26, carboidratos: 0, gorduras: 10 },
  { id: '40', nome: 'Carne Moída Refogada', calorias: 215, quantidade: '1 porção (100g)', categoria: 'jantar', proteinas: 24, carboidratos: 0, gorduras: 12 },
  { id: '41', nome: 'Peixe Grelhado', calorias: 120, quantidade: '1 filé (100g)', categoria: 'jantar', proteinas: 22, carboidratos: 0, gorduras: 3 },
  { id: '42', nome: 'Salmão Grelhado', calorias: 200, quantidade: '1 filé (100g)', categoria: 'jantar', proteinas: 22, carboidratos: 0, gorduras: 12 },
  { id: '43', nome: 'Atum em Lata (água)', calorias: 110, quantidade: '1 lata (100g)', categoria: 'almoco', proteinas: 24, carboidratos: 0, gorduras: 1 },
  { id: '44', nome: 'Atum em Lata (óleo)', calorias: 160, quantidade: '1 lata (100g)', categoria: 'almoco', proteinas: 24, carboidratos: 0, gorduras: 6 },
  { id: '45', nome: 'Ovo de Codorna', calorias: 14, quantidade: '1 unidade', categoria: 'lanche', proteinas: 1, carboidratos: 0, gorduras: 1 },
  
  // MASSAS
  { id: '46', nome: 'Macarrão Cozido', calorias: 140, quantidade: '1 prato (100g)', categoria: 'almoco', proteinas: 5, carboidratos: 28, gorduras: 0.5 },
  { id: '47', nome: 'Macarrão Integral Cozido', calorias: 130, quantidade: '1 prato (100g)', categoria: 'almoco', proteinas: 5.5, carboidratos: 25, gorduras: 0.8 },
  { id: '48', nome: 'Lasanha', calorias: 300, quantidade: '1 pedaço (200g)', categoria: 'jantar', proteinas: 12, carboidratos: 30, gorduras: 15 },
  { id: '49', nome: 'Nhoque', calorias: 180, quantidade: '1 prato (150g)', categoria: 'jantar', proteinas: 5, carboidratos: 35, gorduras: 2 },
  { id: '50', nome: 'Ravioli', calorias: 250, quantidade: '1 prato (150g)', categoria: 'jantar', proteinas: 10, carboidratos: 30, gorduras: 8 },
  
  // SALADAS E LEGUMES
  { id: '51', nome: 'Alface', calorias: 5, quantidade: '1 prato (30g)', categoria: 'almoco', proteinas: 0.5, carboidratos: 1, gorduras: 0 },
  { id: '52', nome: 'Tomate', calorias: 15, quantidade: '1 unidade (100g)', categoria: 'almoco', proteinas: 0.8, carboidratos: 3, gorduras: 0.2 },
  { id: '53', nome: 'Cenoura Crua', calorias: 40, quantidade: '1 unidade (100g)', categoria: 'almoco', proteinas: 1, carboidratos: 9, gorduras: 0.2 },
  { id: '54', nome: 'Brócolis Cozido', calorias: 35, quantidade: '1 xícara (100g)', categoria: 'almoco', proteinas: 2.5, carboidratos: 5, gorduras: 0.4 },
  { id: '55', nome: 'Couve-flor Cozida', calorias: 25, quantidade: '1 xícara (100g)', categoria: 'almoco', proteinas: 2, carboidratos: 4, gorduras: 0.2 },
  { id: '56', nome: 'Espinafre Cozido', calorias: 25, quantidade: '1 xícara (100g)', categoria: 'almoco', proteinas: 2.5, carboidratos: 3, gorduras: 0.3 },
  { id: '57', nome: 'Batata Cozida', calorias: 85, quantidade: '1 unidade (100g)', categoria: 'almoco', proteinas: 2, carboidratos: 20, gorduras: 0.1 },
  { id: '58', nome: 'Batata Doce Cozida', calorias: 90, quantidade: '1 unidade (100g)', categoria: 'almoco', proteinas: 1.5, carboidratos: 20, gorduras: 0.1 },
  { id: '59', nome: 'Mandioca Cozida', calorias: 120, quantidade: '1 pedaço (100g)', categoria: 'almoco', proteinas: 1, carboidratos: 28, gorduras: 0.2 },
  { id: '60', nome: 'Inhame Cozido', calorias: 110, quantidade: '1 pedaço (100g)', categoria: 'almoco', proteinas: 1.5, carboidratos: 25, gorduras: 0.1 },
  { id: '61', nome: 'Abobrinha Refogada', calorias: 20, quantidade: '1 xícara (100g)', categoria: 'jantar', proteinas: 1, carboidratos: 3, gorduras: 0.5 },
  { id: '62', nome: 'Chuchu Cozido', calorias: 15, quantidade: '1 xícara (100g)', categoria: 'jantar', proteinas: 0.5, carboidratos: 3, gorduras: 0.1 },
  { id: '63', nome: 'Vagem Cozida', calorias: 35, quantidade: '1 xícara (100g)', categoria: 'jantar', proteinas: 2, carboidratos: 6, gorduras: 0.2 },
  
  // LANCHES E PETISCOS
  { id: '64', nome: 'Batata Frita', calorias: 300, quantidade: '1 porção (100g)', categoria: 'lanche', proteinas: 3, carboidratos: 35, gorduras: 16 },
  { id: '65', nome: 'Batata Chips', calorias: 150, quantidade: '1 pacote (50g)', categoria: 'lanche', proteinas: 2, carboidratos: 15, gorduras: 10 },
  { id: '66', nome: 'Salgadinho', calorias: 250, quantidade: '1 pacote (80g)', categoria: 'lanche', proteinas: 3, carboidratos: 28, gorduras: 14 },
  { id: '67', nome: 'Coxinha', calorias: 200, quantidade: '1 unidade (80g)', categoria: 'lanche', proteinas: 6, carboidratos: 20, gorduras: 10 },
  { id: '68', nome: 'Empada', calorias: 300, quantidade: '1 unidade (100g)', categoria: 'lanche', proteinas: 5, carboidratos: 25, gorduras: 20 },
  { id: '69', nome: 'Pastel', calorias: 250, quantidade: '1 unidade (80g)', categoria: 'lanche', proteinas: 5, carboidratos: 25, gorduras: 14 },
  { id: '70', nome: 'Pão de Batata', calorias: 180, quantidade: '1 unidade (70g)', categoria: 'lanche', proteinas: 4, carboidratos: 22, gorduras: 8 },
  
  // BEBIDAS
  { id: '71', nome: 'Refrigerante', calorias: 140, quantidade: '1 lata (350ml)', categoria: 'bebida', carboidratos: 35 },
  { id: '72', nome: 'Refrigerante Zero', calorias: 0, quantidade: '1 lata (350ml)', categoria: 'bebida' },
  { id: '73', nome: 'Suco Natural de Laranja', calorias: 120, quantidade: '1 copo (250ml)', categoria: 'bebida', carboidratos: 28 },
  { id: '74', nome: 'Suco em Pó', calorias: 80, quantidade: '1 copo (250ml)', categoria: 'bebida', carboidratos: 20 },
  { id: '75', nome: 'Água', calorias: 0, quantidade: '1 copo (200ml)', categoria: 'bebida' },
  { id: '76', nome: 'Água de Coco', calorias: 45, quantidade: '1 copo (250ml)', categoria: 'bebida', carboidratos: 10 },
  { id: '77', nome: 'Chá Gelado', calorias: 70, quantidade: '1 lata (350ml)', categoria: 'bebida', carboidratos: 17 },
  { id: '78', nome: 'Cerveja', calorias: 140, quantidade: '1 lata (350ml)', categoria: 'bebida', carboidratos: 10 },
  { id: '79', nome: 'Vinho Tinto', calorias: 125, quantidade: '1 taça (150ml)', categoria: 'bebida', carboidratos: 4 },
  { id: '80', nome: 'Vinho Branco', calorias: 120, quantidade: '1 taça (150ml)', categoria: 'bebida', carboidratos: 3 },
  { id: '81', nome: 'Vodka', calorias: 64, quantidade: '1 dose (50ml)', categoria: 'bebida' },
  { id: '82', nome: 'Cachaça', calorias: 55, quantidade: '1 dose (50ml)', categoria: 'bebida' },
  
  // DOCES E SOBREMESAS
  { id: '83', nome: 'Chocolate ao Leite', calorias: 150, quantidade: '1 barra (30g)', categoria: 'lanche', proteinas: 2, carboidratos: 15, gorduras: 9 },
  { id: '84', nome: 'Chocolate Amargo', calorias: 160, quantidade: '1 barra (30g)', categoria: 'lanche', proteinas: 2, carboidratos: 10, gorduras: 12 },
  { id: '85', nome: 'Bolo Simples', calorias: 180, quantidade: '1 fatia (60g)', categoria: 'lanche', proteinas: 3, carboidratos: 25, gorduras: 7 },
  { id: '86', nome: 'Bolo de Chocolate', calorias: 250, quantidade: '1 fatia (70g)', categoria: 'lanche', proteinas: 3, carboidratos: 30, gorduras: 12 },
  { id: '87', nome: 'Pudim', calorias: 200, quantidade: '1 fatia (80g)', categoria: 'lanche', proteinas: 4, carboidratos: 25, gorduras: 9 },
  { id: '88', nome: 'Sorvete', calorias: 150, quantidade: '1 bola (70g)', categoria: 'lanche', proteinas: 2, carboidratos: 18, gorduras: 8 },
  { id: '89', nome: 'Brigadeiro', calorias: 90, quantidade: '1 unidade (20g)', categoria: 'lanche', proteinas: 1, carboidratos: 10, gorduras: 5 },
  { id: '90', nome: 'Beijinho', calorias: 85, quantidade: '1 unidade (20g)', categoria: 'lanche', proteinas: 1, carboidratos: 9, gorduras: 5 },
  { id: '91', nome: 'Doce de Leite', calorias: 70, quantidade: '1 colher sopa (25g)', categoria: 'lanche', proteinas: 1, carboidratos: 12, gorduras: 2 },
  { id: '92', nome: 'Mel', calorias: 60, quantidade: '1 colher sopa (20g)', categoria: 'lanche', carboidratos: 16 },
  
  // SUPLEMENTOS
  { id: '93', nome: 'Whey Protein', calorias: 120, quantidade: '1 scoop (30g)', categoria: 'lanche', proteinas: 24, carboidratos: 3, gorduras: 1.5 },
  { id: '94', nome: 'Creatina', calorias: 0, quantidade: '1 dose (5g)', categoria: 'lanche' },
  { id: '95', nome: 'BCAA', calorias: 10, quantidade: '1 dose (5g)', categoria: 'lanche' },
  { id: '96', nome: 'Barra de Cereal', calorias: 100, quantidade: '1 unidade (25g)', categoria: 'lanche', proteinas: 2, carboidratos: 15, gorduras: 3 },
  { id: '97', nome: 'Pasta de Amendoim', calorias: 190, quantidade: '2 colheres sopa (30g)', categoria: 'lanche', proteinas: 7, carboidratos: 6, gorduras: 16 },
  
  // OUTROS
  { id: '98', nome: 'Azeite de Oliva', calorias: 120, quantidade: '1 colher sopa (15ml)', categoria: 'almoco', gorduras: 13 },
  { id: '99', nome: 'Maionese', calorias: 100, quantidade: '1 colher sopa (15g)', categoria: 'lanche', gorduras: 10 },
  { id: '100', nome: 'Ketchup', calorias: 20, quantidade: '1 colher sopa (15g)', categoria: 'lanche', carboidratos: 4 },
  { id: '101', nome: 'Mostarda', calorias: 10, quantidade: '1 colher sopa (15g)', categoria: 'lanche' },
  { id: '102', nome: 'Molho Shoyu', calorias: 10, quantidade: '1 colher sopa (15ml)', categoria: 'jantar' },
  { id: '103', nome: 'Farinha de Mandioca', calorias: 60, quantidade: '1 colher sopa (20g)', categoria: 'almoco', carboidratos: 13 },
  { id: '104', nome: 'Farinha de Rosca', calorias: 70, quantidade: '1 colher sopa (20g)', categoria: 'almoco', carboidratos: 12 },
];

// Função para buscar alimentos
export const buscarAlimentos = (query: string): AlimentoData[] => {
  if (!query.trim()) return [];
  
  const termos = query.toLowerCase().trim().split(' ');
  
  return alimentos.filter(alimento => {
    const nomeLower = alimento.nome.toLowerCase();
    // Verifica se todos os termos estão presentes no nome
    return termos.every(termo => nomeLower.includes(termo));
  }).slice(0, 15); // Limita a 15 resultados
};

// Função para buscar por categoria
export const buscarPorCategoria = (categoria: string): AlimentoData[] => {
  return alimentos.filter(alimento => alimento.categoria === categoria);
};