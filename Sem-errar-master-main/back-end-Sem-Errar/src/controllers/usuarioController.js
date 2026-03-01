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

      return res.json({
        usuarios: usuarios.rows,
        total: usuarios.count,
        page: parseInt(page),
        totalPages: Math.ceil(usuarios.count / limit)
      });

    } catch (error) {
      console.error("ERRO LISTAR:", error);
      return res.status(500).json({ 
        erro: "Erro interno ao listar usuários",
        detalhes: error.message 
      });
    }
  },

  // ============ CRIAR USUÁRIO (COM FOTO) ============
  async criar(req, res) {
    try {
      console.log("📥 Dados recebidos - req.body:", req.body);
      console.log("📸 Arquivo recebido - req.file:", req.file);

      // Verificar se recebeu dados
      if (!req.body || Object.keys(req.body).length === 0) {
        return res.status(400).json({
          erro: "Dados não recebidos",
          detalhes: "O servidor não recebeu nenhum dado do formulário"
        });
      }

      // Campos obrigatórios
      const camposObrigatorios = ['nome', 'email', 'senha', 'idade'];
      for (const campo of camposObrigatorios) {
        if (!req.body[campo] || req.body[campo].trim() === '') {
          return res.status(400).json({
            erro: `Campo obrigatório: ${campo}`,
            detalhes: `O campo ${campo} é obrigatório`
          });
        }
      }

      // Verificar se email já existe
      const emailExiste = await Usuario.findOne({ 
        where: { email: req.body.email } 
      });
      
      if (emailExiste) {
        // Se fez upload de arquivo, deletar
        if (req.file) {
          fs.unlink(req.file.path, (err) => {
            if (err) console.error("Erro ao deletar arquivo:", err);
          });
        }
        
        return res.status(409).json({
          erro: "Email já cadastrado",
          detalhes: "Este email já está em uso por outro usuário"
        });
      }

      // Processar dados do FormData
      const dados = { ...req.body };

      // Converter campos que devem ser números
      const camposNumericos = [
        'idade', 'altura', 'alturaFt', 'alturaIn', 'alturaCm',
        'pesoKg', 'pesoLb', 'pesoEmKg', 'nivelAtividade', 'coposAguaDia',
        'pescocoCm', 'cinturaCm', 'quadrilCm'
      ];
      
      camposNumericos.forEach(campo => {
        if (dados[campo] && dados[campo] !== 'null' && dados[campo] !== 'undefined') {
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

      // Processar objetivoCompleto (JSON)
      if (dados.objetivoCompleto) {
        try {
          if (typeof dados.objetivoCompleto === 'string') {
            dados.objetivoCompleto = JSON.parse(dados.objetivoCompleto);
          }
        } catch (e) {
          console.log('⚠️ Erro ao parsear objetivoCompleto:', e);
          dados.objetivoCompleto = null;
        }
      }

      // Processar foto
      let fotoPath = null;
      if (req.file) {
        fotoPath = `/uploads/${req.file.filename}`;
        console.log("📸 Foto salva em:", fotoPath);
      }

      // Hash da senha
      const salt = await bcrypt.genSalt(10);
      const senhaHash = await bcrypt.hash(dados.senha, salt);

      // Criar usuário com TODOS os campos
      const usuario = await Usuario.create({
        // Campos básicos
        nome: dados.nome,
        email: dados.email,
        senha: senhaHash,
        tipoUsuario: dados.tipoUsuario || '0',
        foto: fotoPath || dados.foto || null,
        
        // Objetivo
        objetivo: dados.objetivo || null,
        objetivoCompleto: dados.objetivoCompleto ? JSON.stringify(dados.objetivoCompleto) : null,
        
        // Dados pessoais
        sexo: dados.sexo || null,
        idade: dados.idade,
        faixaIdade: dados.faixaIdade || null,
        
        // Altura
        alturaUnidade: dados.alturaUnidade || null,
        altura: dados.altura || null,
        alturaFt: dados.alturaFt || null,
        alturaIn: dados.alturaIn || null,
        alturaCm: dados.alturaCm || null,
        
        // Peso
        pesoUnidade: dados.pesoUnidade || null,
        pesoKg: dados.pesoKg || null,
        pesoLb: dados.pesoLb || null,
        pesoEmKg: dados.pesoEmKg || null,
        
        // Frequência de treino
        frequenciaTreino: dados.frequenciaTreino || null,
        nivelAtividade: dados.nivelAtividade || null,
        frequenciaTreinoDescricao: dados.frequenciaTreinoDescricao || null,
        treinaAtualmente: dados.treinaAtualmente || null,
        
        // Água
        querLembretesAgua: dados.querLembretesAgua || null,
        coposAguaDia: dados.coposAguaDia || null,
        
        // Cardio
        frequenciaCardio: dados.frequenciaCardio || null,
        frequenciaCardioDescricao: dados.frequenciaCardioDescricao || null,
        
        // Medidas
        pescocoCm: dados.pescocoCm || null,
        cinturaCm: dados.cinturaCm || null,
        quadrilCm: dados.quadrilCm || null
      });

      console.log("✅ Usuário criado com sucesso! ID:", usuario.id);
      
      // Remover senha do retorno
      const usuarioJSON = usuario.toJSON();
      delete usuarioJSON.senha;
      
      return res.status(201).json({
        sucesso: true,
        mensagem: "Usuário cadastrado com sucesso",
        usuario: usuarioJSON
      });

    } catch (error) {
      console.error("❌ Erro ao criar usuário:", error);
      
      // Se houve upload de arquivo e deu erro, deletar o arquivo
      if (req.file) {
        fs.unlink(req.file.path, (err) => {
          if (err) console.error("Erro ao deletar arquivo:", err);
        });
      }
      
      return res.status(500).json({ 
        erro: "Erro interno ao criar usuário",
        detalhes: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      });
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
        return res.status(404).json({ 
          erro: "Usuário não encontrado",
          detalhes: `Nenhum usuário com ID ${id}`
        });
      }

      return res.json(usuario);

    } catch (error) {
      console.error("ERRO BUSCAR POR ID:", error);
      return res.status(500).json({ 
        erro: "Erro interno ao buscar usuário",
        detalhes: error.message 
      });
    }
  },

  // ============ ATUALIZAR USUÁRIO ============
  async atualizar(req, res) {
    try {
      const { id } = req.params;
      const dados = { ...req.body };

      console.log("📝 Atualizando usuário ID:", id);
      console.log("📦 Dados para atualização:", dados);

      // Buscar usuário
      const usuario = await Usuario.findByPk(id);

      if (!usuario) {
        return res.status(404).json({ 
          erro: "Usuário não encontrado",
          detalhes: `Nenhum usuário com ID ${id}`
        });
      }

      // Se tiver nova senha, fazer hash
      if (dados.senha) {
        const salt = await bcrypt.genSalt(10);
        dados.senha = await bcrypt.hash(dados.senha, salt);
      }

      // Se tiver nova foto
      if (req.file) {
        // Deletar foto antiga se existir
        if (usuario.foto) {
          const oldPhotoPath = path.join(__dirname, '..', '..', usuario.foto);
          if (fs.existsSync(oldPhotoPath)) {
            fs.unlinkSync(oldPhotoPath);
          }
        }
        dados.foto = `/uploads/${req.file.filename}`;
      }

      // Converter campos numéricos
      const camposNumericos = [
        'idade', 'altura', 'alturaFt', 'alturaIn', 'alturaCm',
        'pesoKg', 'pesoLb', 'pesoEmKg', 'nivelAtividade', 'coposAguaDia',
        'pescocoCm', 'cinturaCm', 'quadrilCm'
      ];
      
      camposNumericos.forEach(campo => {
        if (dados[campo] && dados[campo] !== 'null' && dados[campo] !== 'undefined') {
          const valor = parseFloat(dados[campo]);
          dados[campo] = isNaN(valor) ? null : valor;
        }
      });

      // Atualizar usuário
      await usuario.update(dados);

      console.log("✅ Usuário atualizado com sucesso!");

      // Buscar usuário atualizado sem senha
      const usuarioAtualizado = await Usuario.findByPk(id, {
        attributes: { exclude: ["senha"] }
      });

      return res.json({
        sucesso: true,
        mensagem: "Usuário atualizado com sucesso",
        usuario: usuarioAtualizado
      });

    } catch (error) {
      console.error("ERRO ATUALIZAR:", error);
      
      if (req.file) {
        fs.unlink(req.file.path, (err) => {
          if (err) console.error("Erro ao deletar arquivo:", err);
        });
      }
      
      return res.status(500).json({ 
        erro: "Erro interno ao atualizar usuário",
        detalhes: error.message 
      });
    }
  },

  // ============ DELETAR USUÁRIO ============
  async deletar(req, res) {
    try {
      const { id } = req.params;

      const usuario = await Usuario.findByPk(id);

      if (!usuario) {
        return res.status(404).json({ 
          erro: "Usuário não encontrado",
          detalhes: `Nenhum usuário com ID ${id}`
        });
      }

      // Deletar foto se existir
      if (usuario.foto) {
        const photoPath = path.join(__dirname, '..', '..', usuario.foto);
        if (fs.existsSync(photoPath)) {
          fs.unlinkSync(photoPath);
          console.log("📸 Foto deletada:", photoPath);
        }
      }

      await usuario.destroy();

      console.log("✅ Usuário deletado com sucesso! ID:", id);

      return res.json({ 
        sucesso: true,
        mensagem: "Usuário removido com sucesso" 
      });

    } catch (error) {
      console.error("ERRO DELETAR:", error);
      return res.status(500).json({ 
        erro: "Erro interno ao deletar usuário",
        detalhes: error.message 
      });
    }
  },

  // ============ ESTATÍSTICAS ============
  async estatisticas(req, res) {
    try {
      const totalUsuarios = await Usuario.count();
      
      const usuariosPorSexo = await Usuario.findAll({
        attributes: ['sexo', [sequelize.fn('COUNT', sequelize.col('sexo')), 'count']],
        group: ['sexo'],
        where: { sexo: { [Op.ne]: null } }
      });

      const mediaIdade = await Usuario.findOne({
        attributes: [[sequelize.fn('AVG', sequelize.col('idade')), 'mediaIdade']],
        where: { idade: { [Op.ne]: null } }
      });

      const usuariosAtivos = await Usuario.count({
        where: { treinaAtualmente: true }
      });

      return res.json({
        total: totalUsuarios,
        porSexo: usuariosPorSexo,
        mediaIdade: Math.round(mediaIdade?.dataValues?.mediaIdade || 0),
        ativos: usuariosAtivos,
        inativos: totalUsuarios - usuariosAtivos
      });

    } catch (error) {
      console.error("ERRO ESTATÍSTICAS:", error);
      return res.status(500).json({ 
        erro: "Erro interno ao buscar estatísticas",
        detalhes: error.message 
      });
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
        return res.status(404).json({ 
          erro: "Usuário não encontrado",
          detalhes: `Nenhum usuário com email ${email}`
        });
      }

      return res.json(usuario);

    } catch (error) {
      console.error("ERRO BUSCAR POR EMAIL:", error);
      return res.status(500).json({ 
        erro: "Erro interno ao buscar usuário",
        detalhes: error.message 
      });
    }
  },

  // ============ VERIFICAR TOKEN ============
  async verificarToken(req, res) {
    try {
      const token = req.headers.authorization?.split(' ')[1];

      if (!token) {
        return res.status(401).json({ 
          valido: false,
          erro: "Token não fornecido" 
        });
      }

      const JWT_SECRET = process.env.JWT_SECRET || "CHAVE_SUPER_SECRETA_123";

      const decoded = jwt.verify(token, JWT_SECRET);

      const usuario = await Usuario.findByPk(decoded.id, {
        attributes: { exclude: ["senha"] }
      });

      if (!usuario) {
        return res.status(401).json({ 
          valido: false,
          erro: "Usuário não encontrado" 
        });
      }

      return res.json({
        valido: true,
        usuario
      });

    } catch (error) {
      console.error("ERRO VERIFICAR TOKEN:", error);
      return res.status(401).json({ 
        valido: false,
        erro: "Token inválido ou expirado" 
      });
    }
  },

  // ============ RECUPERAR SENHA ============
  async recuperarSenha(req, res) {
    try {
      const { email } = req.body;

      const usuario = await Usuario.findOne({ where: { email } });

      if (!usuario) {
        return res.status(404).json({ 
          erro: "Usuário não encontrado",
          detalhes: `Nenhum usuário com email ${email}`
        });
      }

      // Gerar token de recuperação (válido por 1 hora)
      const JWT_SECRET = process.env.JWT_SECRET || "CHAVE_SUPER_SECRETA_123";
      const resetToken = jwt.sign(
        { id: usuario.id, email: usuario.email },
        JWT_SECRET,
        { expiresIn: "1h" }
      );

      // Aqui você enviaria o email com o token
      // Por enquanto, só retornamos o token para teste
      
      return res.json({
        sucesso: true,
        mensagem: "Token de recuperação gerado",
        resetToken: process.env.NODE_ENV === 'development' ? resetToken : undefined
      });

    } catch (error) {
      console.error("ERRO RECUPERAR SENHA:", error);
      return res.status(500).json({ 
        erro: "Erro interno ao recuperar senha",
        detalhes: error.message 
      });
    }
  },

  // ============ REDEFINIR SENHA ============
  async redefinirSenha(req, res) {
    try {
      const { token, novaSenha } = req.body;

      if (!token || !novaSenha) {
        return res.status(400).json({ 
          erro: "Token e nova senha são obrigatórios" 
        });
      }

      const JWT_SECRET = process.env.JWT_SECRET || "CHAVE_SUPER_SECRETA_123";

      const decoded = jwt.verify(token, JWT_SECRET);

      const usuario = await Usuario.findByPk(decoded.id);

      if (!usuario) {
        return res.status(404).json({ 
          erro: "Usuário não encontrado" 
        });
      }

      // Hash da nova senha
      const salt = await bcrypt.genSalt(10);
      const senhaHash = await bcrypt.hash(novaSenha, salt);

      await usuario.update({ senha: senhaHash });

      return res.json({
        sucesso: true,
        mensagem: "Senha redefinida com sucesso"
      });

    } catch (error) {
      console.error("ERRO REDEFINIR SENHA:", error);
      return res.status(401).json({ 
        erro: "Token inválido ou expirado",
        detalhes: error.message 
      });
    }
  }
};