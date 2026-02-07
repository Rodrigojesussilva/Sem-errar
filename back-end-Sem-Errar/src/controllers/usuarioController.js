const Usuario = require("../models/Usuario");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
module.exports = {

  async logar(req, res) {
    try {
      const { email, senha } = req.body;

      if (!email || !senha) {
        return res.status(400).json({
          erro: "Email e senha são obrigatórios",
        });
      }

      const usuario = await Usuario.findOne({ where: { email } });

      if (!usuario) {
        return res.status(404).json({
          erro: "Usuário não encontrado",
        });
      }

      const senhaValida = await bcrypt.compare(senha, usuario.senha);

      if (!senhaValida) {
        return res.status(401).json({
          erro: "Senha incorreta",
        });
      }

      const JWT_SECRET = process.env.JWT_SECRET || "CHAVE_SUPER_SECRETA_123";

      const token = jwt.sign(
        {
          id: usuario.id,
          tipoUsuario: usuario.tipoUsuario,
        },
        JWT_SECRET,
        { expiresIn: "7d" }
      );

      const { senha: _senha, ...usuarioSemSenha } = usuario.toJSON();

      return res.status(200).json({
        ...usuarioSemSenha,
        token,
      });

    } catch (error) {
      console.error("ERRO LOGIN:", error);
      return res.status(500).json({
        erro: "Erro interno ao realizar login",
      });
    }
  },

  async listar(req, res) {
    try {
      const usuarios = await Usuario.findAll({
        attributes: { exclude: ["senha"] },
      });
      return res.json(usuarios);
    } catch (error) {
      return res.status(500).json({ erro: error.message });
    }
  },

  async criar(req, res) {
    try {
      const { nome, email, senha, tipoUsuario, foto } = req.body;

      const usuario = await Usuario.create({
        nome,
        email,
        senha,
        tipoUsuario,
        foto,
      });

      return res.status(201).json(usuario);
    } catch (error) {
      return res.status(500).json({ erro: error.message });
    }
  },

  async buscarPorId(req, res) {
    try {
      const usuario = await Usuario.findByPk(req.params.id, {
        attributes: { exclude: ["senha"] },
      });

      if (!usuario) {
        return res.status(404).json({ erro: "Usuário não encontrado" });
      }

      return res.json(usuario);
    } catch (error) {
      return res.status(500).json({ erro: error.message });
    }
  },

  async deletar(req, res) {
    try {
      const usuario = await Usuario.destroy({
        where: { id: req.params.id },
      });

      if (!usuario) {
        return res.status(404).json({ erro: "Usuário não encontrado" });
      }

      return res.json({ mensagem: "Usuário removido com sucesso" });
    } catch (error) {
      return res.status(500).json({ erro: error.message });
    }
  },
};
