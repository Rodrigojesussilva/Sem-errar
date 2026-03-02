const Usuario = require("../models/Usuario");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const fs = require('fs');
const path = require('path');
const { Op } = require('sequelize');

// Garantir que a pasta uploads existe
const uploadDir = path.join(__dirname, '..', '..', 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

module.exports = {

  // ============ LOGIN ============
  async logar(req, res) {
    try {
      const { email, senha } = req.body;

      if (!email || !senha) {
        return res.status(400).json({
          erro: "Email e senha são obrigatórios",
        });
      }

      const usuario = await Usuario.findOne({ 
        where: { email } 
      });

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
        { id: usuario.id, tipoUsuario: usuario.tipoUsuario },
        JWT_SECRET,
        { expiresIn: "7d" }
      );

      const baseUrl = `${req.protocol}://${req.get('host')}`;
      const usuarioData = usuario.toJSON();

      if (usuarioData.foto && !usuarioData.foto.startsWith('http')) {
        usuarioData.foto = `${baseUrl}${usuarioData.foto}`;
      }

      const { senha: _, ...usuarioSemSenha } = usuarioData;

      console.log("✅ Login bem-sucedido:", usuarioSemSenha.email);

      return res.status(200).json({
        ...usuarioSemSenha,
        token,
      });

    } catch (error) {
      console.error("ERRO LOGIN:", error);
      return res.status(500).json({ erro: "Erro interno ao realizar login" });
    }
  },

  // ============ CRIAR USUÁRIO (APENAS UMA VEZ) ============
  async criar(req, res) {
    try {
      console.log("📥 Dados recebidos - req.body:", req.body);
      console.log("📸 Arquivo recebido - req.file:", req.file);

      // Verificar se o arquivo foi recebido
      if (!req.file) {
        console.log("❌ ERRO: Nenhum arquivo de foto foi recebido!");
      } else {
        console.log("✅ ARQUIVO RECEBIDO COM SUCESSO:");
        console.log("   - Nome original:", req.file.originalname);
        console.log("   - Nome salvo:", req.file.filename);
        console.log("   - Caminho completo:", req.file.path);
        console.log("   - Tamanho:", req.file.size, "bytes");
        
        // Verificar se o arquivo foi realmente salvo
        if (fs.existsSync(req.file.path)) {
          console.log("✅ ARQUIVO FISICAMENTE PRESENTE NO DISCO!");
        } else {
          console.log("❌ ARQUIVO NÃO FOI SALVO NO DISCO!");
        }
      }

      // Verificar se recebeu dados
      if (!req.body || Object.keys(req.body).length === 0) {
        return res.status(400).json({
          erro: "Dados não recebidos"
        });
      }

      // Campos obrigatórios
      const camposObrigatorios = ['nome', 'email', 'senha', 'idade'];
      for (const campo of camposObrigatorios) {
        if (!req.body[campo] || req.body[campo].trim() === '') {
          return res.status(400).json({
            erro: `Campo obrigatório: ${campo}`
          });
        }
      }

      // Verificar se email já existe
      const emailExiste = await Usuario.findOne({ 
        where: { email: req.body.email } 
      });

      if (emailExiste) {
        if (req.file) {
          fs.unlink(req.file.path, () => {});
        }
        return res.status(409).json({ erro: "Email já cadastrado" });
      }

      // Processar dados
      const dados = { ...req.body };

      // Converter campos numéricos
      const camposNumericos = [
        'idade', 'altura', 'alturaCm', 'pesoKg', 'pesoLb',
        'nivelAtividade', 'coposAguaDia', 'pescocoCm', 'cinturaCm', 'quadrilCm'
      ];

      camposNumericos.forEach(campo => {
        if (dados[campo] && dados[campo] !== 'null') {
          const valor = parseFloat(dados[campo]);
          dados[campo] = isNaN(valor) ? null : valor;
        } else {
          dados[campo] = null;
        }
      });

      // Converter booleanos
      const camposBooleanos = ['treinaAtualmente', 'querLembretesAgua'];
      camposBooleanos.forEach(campo => {
        if (dados[campo] === 'true') dados[campo] = true;
        else if (dados[campo] === 'false') dados[campo] = false;
        else dados[campo] = null;
      });

      // Processar foto
      let fotoPath = null;
      if (req.file) {
        fotoPath = `/uploads/${req.file.filename}`;
        console.log("📸 Foto salva em:", fotoPath);
      }

      // Hash da senha
      const salt = await bcrypt.genSalt(10);
      const senhaHash = await bcrypt.hash(dados.senha, salt);

      // Criar usuário
      const usuario = await Usuario.create({
        nome: dados.nome,
        email: dados.email,
        senha: senhaHash,
        tipoUsuario: dados.tipoUsuario || '0',
        foto: fotoPath,
        objetivo: dados.objetivo,
        sexo: dados.sexo,
        idade: dados.idade,
        faixaIdade: dados.faixaIdade,
        alturaUnidade: dados.alturaUnidade,
        altura: dados.altura,
        alturaCm: dados.alturaCm,
        pesoUnidade: dados.pesoUnidade,
        pesoKg: dados.pesoKg,
        pesoLb: dados.pesoLb,
        frequenciaTreino: dados.frequenciaTreino,
        nivelAtividade: dados.nivelAtividade,
        frequenciaTreinoDescricao: dados.frequenciaTreinoDescricao,
        treinaAtualmente: dados.treinaAtualmente,
        querLembretesAgua: dados.querLembretesAgua,
        coposAguaDia: dados.coposAguaDia,
        pescocoCm: dados.pescocoCm,
        cinturaCm: dados.cinturaCm,
        quadrilCm: dados.quadrilCm
      });

      console.log("✅ Usuário criado! ID:", usuario.id);

      // Construir URL da foto
      const baseUrl = `${req.protocol}://${req.get('host')}`;
      const usuarioJSON = usuario.toJSON();

      if (usuarioJSON.foto) {
        usuarioJSON.foto = `${baseUrl}${usuarioJSON.foto}`;
      }

      delete usuarioJSON.senha;

      return res.status(201).json({
        sucesso: true,
        usuario: usuarioJSON
      });

    } catch (error) {
      console.error("❌ ERRO:", error);
      if (req.file) {
        fs.unlink(req.file.path, () => {});
      }
      return res.status(500).json({ erro: error.message });
    }
  },

  // ============ LISTAR TODOS OS USUÁRIOS ============
  async listar(req, res) {
    try {
      const { page = 1, limit = 10, search } = req.query;
      const offset = (page - 1) * limit;
      let where = {};

      if (search) {
        where = {
          [Op.or]: [
            { nome: { [Op.like]: `%${search}%` } },
            { email: { [Op.like]: `%${search}%` } }
          ]
        };
      }

      const usuarios = await Usuario.findAndCountAll({
        where,
        attributes: { exclude: ["senha"] },
        limit: parseInt(limit),
        offset: parseInt(offset),
        order: [['createdAt', 'DESC']]
      });

      const baseUrl = `${req.protocol}://${req.get('host')}`;
      const usuariosComFoto = usuarios.rows.map(usuario => {
        const usuarioData = usuario.toJSON();
        if (usuarioData.foto && !usuarioData.foto.startsWith('http')) {
          usuarioData.foto = `${baseUrl}${usuarioData.foto}`;
        }
        return usuarioData;
      });

      return res.json({
        usuarios: usuariosComFoto,
        total: usuarios.count,
        page: parseInt(page),
        totalPages: Math.ceil(usuarios.count / limit)
      });

    } catch (error) {
      console.error("ERRO LISTAR:", error);
      return res.status(500).json({ erro: error.message });
    }
  },

  // ============ BUSCAR USUÁRIO POR ID ============
  async buscarPorId(req, res) {
    try {
      const { id } = req.params;
      const usuario = await Usuario.findByPk(id, {
        attributes: { exclude: ["senha"] },
      });

      if (!usuario) {
        return res.status(404).json({ erro: "Usuário não encontrado" });
      }

      const baseUrl = `${req.protocol}://${req.get('host')}`;
      const usuarioData = usuario.toJSON();

      if (usuarioData.foto && !usuarioData.foto.startsWith('http')) {
        usuarioData.foto = `${baseUrl}${usuarioData.foto}`;
      }

      return res.json(usuarioData);

    } catch (error) {
      console.error("ERRO BUSCAR POR ID:", error);
      return res.status(500).json({ erro: error.message });
    }
  },

  // ============ BUSCAR POR EMAIL ============
  async buscarPorEmail(req, res) {
    try {
      const { email } = req.params;
      const usuario = await Usuario.findOne({
        where: { email },
        attributes: { exclude: ["senha"] }
      });

      if (!usuario) {
        return res.status(404).json({ erro: "Usuário não encontrado" });
      }

      const baseUrl = `${req.protocol}://${req.get('host')}`;
      const usuarioData = usuario.toJSON();

      if (usuarioData.foto && !usuarioData.foto.startsWith('http')) {
        usuarioData.foto = `${baseUrl}${usuarioData.foto}`;
      }

      return res.json(usuarioData);

    } catch (error) {
      console.error("ERRO BUSCAR POR EMAIL:", error);
      return res.status(500).json({ erro: error.message });
    }
  },

  // ============ ATUALIZAR USUÁRIO ============
  async atualizar(req, res) {
    try {
      const { id } = req.params;
      const dados = { ...req.body };

      const usuario = await Usuario.findByPk(id);

      if (!usuario) {
        return res.status(404).json({ erro: "Usuário não encontrado" });
      }

      if (dados.senha) {
        const salt = await bcrypt.genSalt(10);
        dados.senha = await bcrypt.hash(dados.senha, salt);
      }

      if (req.file) {
        if (usuario.foto) {
          const oldPhotoPath = path.join(__dirname, '..', '..', usuario.foto);
          if (fs.existsSync(oldPhotoPath)) {
            fs.unlinkSync(oldPhotoPath);
          }
        }
        dados.foto = `/uploads/${req.file.filename}`;
      }

      const camposNumericos = [
        'idade', 'altura', 'alturaCm', 'pesoKg', 'pesoLb',
        'nivelAtividade', 'coposAguaDia', 'pescocoCm', 'cinturaCm', 'quadrilCm'
      ];

      camposNumericos.forEach(campo => {
        if (dados[campo] && dados[campo] !== 'null') {
          const valor = parseFloat(dados[campo]);
          dados[campo] = isNaN(valor) ? null : valor;
        }
      });

      await usuario.update(dados);

      const usuarioAtualizado = await Usuario.findByPk(id, {
        attributes: { exclude: ["senha"] }
      });

      const baseUrl = `${req.protocol}://${req.get('host')}`;
      const usuarioData = usuarioAtualizado.toJSON();

      if (usuarioData.foto && !usuarioData.foto.startsWith('http')) {
        usuarioData.foto = `${baseUrl}${usuarioData.foto}`;
      }

      return res.json({ sucesso: true, usuario: usuarioData });

    } catch (error) {
      console.error("ERRO ATUALIZAR:", error);
      if (req.file) {
        fs.unlink(req.file.path, () => {});
      }
      return res.status(500).json({ erro: error.message });
    }
  },

  // ============ DELETAR USUÁRIO ============
  async deletar(req, res) {
    try {
      const { id } = req.params;
      const usuario = await Usuario.findByPk(id);

      if (!usuario) {
        return res.status(404).json({ erro: "Usuário não encontrado" });
      }

      if (usuario.foto) {
        const photoPath = path.join(__dirname, '..', '..', usuario.foto);
        if (fs.existsSync(photoPath)) {
          fs.unlinkSync(photoPath);
        }
      }

      await usuario.destroy();
      return res.json({ sucesso: true, mensagem: "Usuário removido" });

    } catch (error) {
      console.error("ERRO DELETAR:", error);
      return res.status(500).json({ erro: error.message });
    }
  },

  // ============ ESTATÍSTICAS ============
  async estatisticas(req, res) {
    try {
      const totalUsuarios = await Usuario.count();
      const usuariosAtivos = await Usuario.count({ where: { treinaAtualmente: true } });

      return res.json({
        total: totalUsuarios,
        ativos: usuariosAtivos,
        inativos: totalUsuarios - usuariosAtivos
      });

    } catch (error) {
      console.error("ERRO ESTATÍSTICAS:", error);
      return res.status(500).json({ erro: error.message });
    }
  },

  // ============ VERIFICAR TOKEN ============
  async verificarToken(req, res) {
    try {
      const token = req.headers.authorization?.split(' ')[1];

      if (!token) {
        return res.status(401).json({ valido: false, erro: "Token não fornecido" });
      }

      const JWT_SECRET = process.env.JWT_SECRET || "CHAVE_SUPER_SECRETA_123";
      const decoded = jwt.verify(token, JWT_SECRET);

      const usuario = await Usuario.findByPk(decoded.id, {
        attributes: { exclude: ["senha"] }
      });

      if (!usuario) {
        return res.status(401).json({ valido: false, erro: "Usuário não encontrado" });
      }

      const baseUrl = `${req.protocol}://${req.get('host')}`;
      const usuarioData = usuario.toJSON();

      if (usuarioData.foto && !usuarioData.foto.startsWith('http')) {
        usuarioData.foto = `${baseUrl}${usuarioData.foto}`;
      }

      return res.json({ valido: true, usuario: usuarioData });

    } catch (error) {
      console.error("ERRO VERIFICAR TOKEN:", error);
      return res.status(401).json({ valido: false, erro: "Token inválido" });
    }
  },

  // ============ RECUPERAR SENHA ============
  async recuperarSenha(req, res) {
    try {
      const { email } = req.body;
      const usuario = await Usuario.findOne({ where: { email } });

      if (!usuario) {
        return res.status(404).json({ erro: "Usuário não encontrado" });
      }

      const JWT_SECRET = process.env.JWT_SECRET || "CHAVE_SUPER_SECRETA_123";
      const resetToken = jwt.sign(
        { id: usuario.id, email: usuario.email },
        JWT_SECRET,
        { expiresIn: "1h" }
      );

      return res.json({ sucesso: true, resetToken });

    } catch (error) {
      console.error("ERRO RECUPERAR SENHA:", error);
      return res.status(500).json({ erro: error.message });
    }
  },

  // ============ REDEFINIR SENHA ============
  async redefinirSenha(req, res) {
    try {
      const { token, novaSenha } = req.body;

      if (!token || !novaSenha) {
        return res.status(400).json({ erro: "Token e nova senha são obrigatórios" });
      }

      const JWT_SECRET = process.env.JWT_SECRET || "CHAVE_SUPER_SECRETA_123";
      const decoded = jwt.verify(token, JWT_SECRET);

      const usuario = await Usuario.findByPk(decoded.id);

      if (!usuario) {
        return res.status(404).json({ erro: "Usuário não encontrado" });
      }

      const salt = await bcrypt.genSalt(10);
      const senhaHash = await bcrypt.hash(novaSenha, salt);

      await usuario.update({ senha: senhaHash });

      return res.json({ sucesso: true, mensagem: "Senha redefinida" });

    } catch (error) {
      console.error("ERRO REDEFINIR SENHA:", error);
      return res.status(401).json({ erro: "Token inválido" });
    }
  }
};