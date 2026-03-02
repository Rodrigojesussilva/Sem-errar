const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Usuario = sequelize.define(
  "Tb_Usuario",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    nome: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    email: {
      type: DataTypes.TEXT,
      allowNull: false,
      unique: true,
    },
    senha: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    tipoUsuario: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    foto: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    
    // Campos do onboarding - APENAS OS QUE EXISTEM NO BANCO
    objetivo: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    sexo: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    idade: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    faixaIdade: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    
    // Altura
    alturaUnidade: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    altura: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    alturaCm: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    
    // Peso
    pesoUnidade: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    pesoKg: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    pesoLb: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    
    // Frequência de treino
    frequenciaTreino: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    nivelAtividade: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    frequenciaTreinoDescricao: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    treinaAtualmente: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
    
    // Água
    querLembretesAgua: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
    coposAguaDia: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    
    // Medidas
    pescocoCm: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    cinturaCm: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    quadrilCm: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
  },
  {
    tableName: "Tb_Usuario",
    timestamps: false,
  }
);

module.exports = Usuario;