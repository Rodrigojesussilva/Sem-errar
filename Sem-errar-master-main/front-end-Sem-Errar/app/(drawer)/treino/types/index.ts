// app/(drawer)/treino/types/index.ts
export interface Refeicao {
  id: string;
  nome: string;
  calorias: number;
  proteinas: number;
  carboidratos: number;
  gorduras: number;
  horario: string;
  tipo: 'pre-programada' | 'aleatoria';
}

export interface CategoriaRefeicao {
  id: string;
  nome: string;
  icon: string;
  color: string;
  refeicoes: Refeicao[];
}

export interface Treino {
  id: string;
  diasSemana: number;
  dia: number;
  tipo: string;
  exercicios: string[];
  series: string[];
  observacao: string;
}

export interface MeasurementSummary {
  current: string;
  unit: string;
  target: string;
  change: string;
  progress: number;
}

export interface ResumoDiario {
  desafio: {
    sequencia: number;
    recorde: number;
    preenchido: boolean;
  };
  calendario: {
    diaSelecionado: number;
    diaSemana: string;
    data: string;
    preenchido: boolean;
  };
  medicoes: {
    peso: string;
    cintura: string;
    pesoProgresso: number;
    cinturaProgresso: number;
    pesoPreenchido: boolean;
    cinturaPreenchida: boolean;
  };
  nutricao: {
    caloriasConsumidas: number;
    caloriasMeta: number;
    proteinas: number;
    carboidratos: number;
    gorduras: number;
    refeicoesHoje: number;
    preenchido: boolean;
  };
}

export interface WeekDay {
  day: string;
  date: number;
  today?: boolean;
}
// app/(drawer)/treino/types/index.ts

// ... (suas interfaces existentes)

export interface CardioData {
  duracao: number;
  distancia: number;
  calorias: number;
  frequenciaCardiaca: {
    media: number;
    max: number;
  };
  pace: string;
  tipo: string;
}

export interface AguaData {
  consumido: number;
  meta: number;
  copos: number;
  historico: Array<{
    id: string;
    quantidade: number;
    horario: string;
  }>;
}

// app/(drawer)/treino/types.ts

export interface Alimento {
  id: string;
  nome: string;
  quantidade: string;
  calorias: number;
  idr?: string;
  porcao?: string;
  marca?: string;
}

export interface Refeicao {
  id: string;
  nome: string;
  horario: string;
  alimentos: Alimento[];
  calorias: number;
}

export interface CategoriaRefeicao {
  id: string;
  nome: string;
  icon: string;
  color: string;
  refeicoes: Refeicao[];
}