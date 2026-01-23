const Usuario = require("../models/Usuario");

module.exports = {
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
