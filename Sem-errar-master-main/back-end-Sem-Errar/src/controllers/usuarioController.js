const Usuario = require("../models/Usuario");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const fs = require('fs');
const path = require('path');
const { Op } = require('sequelize');
const nodemailer = require('nodemailer');
const crypto = require('crypto');

// Garantir que a pasta uploads existe
const uploadDir = path.join(__dirname, '..', '..', 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Store temporário para códigos de verificação (use Redis em produção)
const verificationCodes = new Map();

// Cache do transporter (apenas um, sempre o mesmo - SendGrid)
let transporter = null;

/**
 * Cria e retorna o transporter do SendGrid (configurado via .env)
 * @returns {Object} - Transporter do nodemailer
 */
function getTransporter() {
  if (!transporter) {
    const config = {
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT) || 587,
      secure: process.env.SMTP_SECURE === 'true' || false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
      tls: {
        rejectUnauthorized: process.env.SMTP_REJECT_UNAUTHORIZED === 'true' || false,
      },
      requireTLS: process.env.SMTP_REQUIRE_TLS === 'true' || true,
      connectionTimeout: parseInt(process.env.SMTP_CONNECTION_TIMEOUT) || 10000,
      greetingTimeout: parseInt(process.env.SMTP_GREETING_TIMEOUT) || 10000,
      socketTimeout: parseInt(process.env.SMTP_SOCKET_TIMEOUT) || 10000,
    };

    console.log('📧 Configuração SMTP (SendGrid):', {
      host: config.host,
      port: config.port,
      secure: config.secure,
      auth: { user: config.auth.user ? '***configurado***' : 'não configurado' },
    });

    transporter = nodemailer.createTransport(config);
    
    // Verifica conexão (assíncrono, não bloqueante)
    transporter.verify((error, success) => {
      if (error) {
        console.error('❌ Erro na conexão SMTP com SendGrid:', error.message);
      } else {
        console.log('✅ Transporter SendGrid pronto para enviar emails');
      }
    });
  }
  
  return transporter;
}

/**
 * Detecta o provedor de email baseado no endereço de email (APENAS PARA INFORMAÇÃO)
 * @param {string} email - Email do usuário
 * @returns {string} - Nome do provedor
 */
function detectarProvedorEmail(email) {
  if (!email) return 'desconhecido';
  
  email = email.toLowerCase();
  
  if (email.includes('@gmail.com') || email.includes('@googlemail.com')) {
    return 'gmail';
  } else if (email.includes('@outlook.com') || email.includes('@hotmail.com') || 
             email.includes('@live.com') || email.includes('@msn.com')) {
    return 'outlook';
  } else if (email.includes('@yahoo.com') || email.includes('@yahoo.com.br')) {
    return 'yahoo';
  } else if (email.includes('@uol.com.br') || email.includes('@bol.com.br')) {
    return 'uol';
  } else if (email.includes('@ig.com.br') || email.includes('@ig.com')) {
    return 'ig';
  } else if (email.includes('@terra.com.br')) {
    return 'terra';
  } else if (email.includes('@globo.com') || email.includes('@globomail.com')) {
    return 'globo';
  } else if (email.includes('@icloud.com') || email.includes('@me.com') || 
             email.includes('@mac.com')) {
    return 'icloud';
  } else if (email.includes('@protonmail.com') || email.includes('@proton.me')) {
    return 'proton';
  } else if (email.includes('@aol.com')) {
    return 'aol';
  }
  
  return 'outros';
}

// Template do e-mail de verificação
const emailVerificationTemplate = (codigo, nome) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
    body {
      margin: 0;
      padding: 0;
      font-family: 'Inter', Arial, sans-serif;
      background-color: #f4f4f4;
    }
    .container {
      max-width: 600px;
      margin: 20px auto;
      background-color: #ffffff;
      border-radius: 16px;
      overflow: hidden;
      box-shadow: 0 10px 25px rgba(0,0,0,0.1);
    }
    .header {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      padding: 40px 30px;
      text-align: center;
    }
    .header h1 {
      color: #ffffff;
      margin: 0;
      font-size: 32px;
      font-weight: 700;
    }
    .header p {
      color: #ffffff;
      margin: 10px 0 0;
      opacity: 0.9;
      font-size: 16px;
    }
    .content {
      padding: 40px 30px;
    }
    .content h2 {
      color: #333333;
      margin-top: 0;
      font-size: 24px;
    }
    .content p {
      color: #666666;
      line-height: 1.6;
      margin-bottom: 25px;
      font-size: 16px;
    }
    .code-container {
      background: linear-gradient(135deg, #f5f7fa 0%, #e4e8f0 100%);
      border-radius: 12px;
      padding: 30px;
      text-align: center;
      margin: 30px 0;
    }
    .code {
      font-size: 48px;
      font-weight: 700;
      letter-spacing: 10px;
      color: #667eea;
      font-family: monospace;
      background-color: white;
      padding: 20px;
      border-radius: 10px;
      display: inline-block;
      box-shadow: 0 5px 15px rgba(102,126,234,0.2);
    }
    .info-box {
      background-color: #f8f9fa;
      border-radius: 10px;
      padding: 20px;
      margin: 25px 0;
    }
    .info-item {
      display: flex;
      align-items: center;
      margin-bottom: 15px;
    }
    .info-icon {
      width: 30px;
      height: 30px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-right: 10px;
      font-weight: 700;
    }
    .footer {
      background-color: #f8f9fa;
      padding: 30px;
      text-align: center;
      border-top: 1px solid #e9ecef;
    }
    .footer p {
      color: #999999;
      margin: 0 0 10px;
      font-size: 13px;
    }
    .footer a {
      color: #999;
      text-decoration: none;
      margin: 0 10px;
      font-size: 12px;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>FitApp</h1>
      <p>Verificação de e-mail</p>
    </div>
    
    <div class="content">
      <h2>Olá, ${nome}! 👋</h2>
      
      <p>
        Recebemos uma solicitação para criar uma conta no FitApp. 
        Para confirmar seu e-mail e ativar sua conta, utilize o código abaixo:
      </p>
      
      <div class="code-container">
        <div class="code">${codigo}</div>
      </div>
      
      <div class="info-box">
        <div class="info-item">
          <div class="info-icon" style="background-color: #e3f2fd; color: #2196f3;">✓</div>
          <p style="margin:0; color:#666;">Código válido por <strong>10 minutos</strong></p>
        </div>
        <div class="info-item">
          <div class="info-icon" style="background-color: #fff3cd; color: #ff9800;">⚠️</div>
          <p style="margin:0; color:#666;">Nunca compartilhe este código com ninguém</p>
        </div>
        <div class="info-item">
          <div class="info-icon" style="background-color: #ffebee; color: #f44336;">🔒</div>
          <p style="margin:0; color:#666;">O FitApp nunca pedirá sua senha por e-mail</p>
        </div>
      </div>
    </div>
    
    <div class="footer">
      <p>© ${new Date().getFullYear()} FitApp. Todos os direitos reservados.</p>
      <p>Este é um e-mail automático, por favor não responda.</p>
      <div>
        <a href="#">Termos de uso</a>
        <span style="color:#ddd;">|</span>
        <a href="#">Política de privacidade</a>
      </div>
    </div>
  </div>
</body>
</html>
`;

// Template de e-mail de boas-vindas
const welcomeEmailTemplate = (nome) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body {
      margin: 0;
      padding: 0;
      font-family: Arial, sans-serif;
      background-color: #f4f4f4;
    }
    .container {
      max-width: 600px;
      margin: 20px auto;
      background-color: #ffffff;
      border-radius: 16px;
      overflow: hidden;
      box-shadow: 0 10px 25px rgba(0,0,0,0.1);
    }
    .header {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      padding: 40px 30px;
      text-align: center;
    }
    .header h1 {
      color: #ffffff;
      margin: 0;
      font-size: 32px;
    }
    .content {
      padding: 40px 30px;
      text-align: center;
    }
    .content h2 {
      color: #333333;
      margin-top: 0;
    }
    .content p {
      color: #666666;
      line-height: 1.6;
      margin-bottom: 25px;
    }
    .button {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 15px 40px;
      text-decoration: none;
      border-radius: 8px;
      font-weight: 600;
      display: inline-block;
      margin-top: 20px;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Bem-vindo ao FitApp! 🎉</h1>
    </div>
    <div class="content">
      <h2>Olá, ${nome}!</h2>
      <p>
        Sua conta foi criada com sucesso! Estamos muito felizes em ter você conosco.
      </p>
      <p>
        Agora você pode fazer login e começar sua jornada fitness!
      </p>
      <a href="http://localhost:3000/login" class="button">
        Fazer login
      </a>
    </div>
  </div>
</body>
</html>
`;

module.exports = {

  // ============ FUNÇÃO PARA TESTAR CONFIGURAÇÕES (OPCIONAL) ============
  async testarConfiguracaoEmail(req, res) {
    try {
      const transporter = getTransporter();
      await transporter.verify();
      
      return res.json({
        sucesso: true,
        mensagem: 'Configuração do SendGrid está funcionando!'
      });
    } catch (error) {
      return res.status(500).json({
        sucesso: false,
        erro: error.message
      });
    }
  },

  // ============ FUNÇÕES DE VERIFICAÇÃO DE E-MAIL ============
  
  async enviarCodigoVerificacao(req, res) {
    try {
      const { email, nome } = req.body;

      if (!email) {
        return res.status(400).json({ erro: "E-mail é obrigatório" });
      }

      // Verificar se email já está cadastrado
      const usuarioExistente = await Usuario.findOne({ 
        where: { email } 
      });

      if (usuarioExistente) {
        return res.status(409).json({ 
          erro: "Este e-mail já está cadastrado" 
        });
      }

      // Apenas para informação, não usado no envio
      const provedor = detectarProvedorEmail(email);
      console.log(`📧 Enviando código para: ${email} (${provedor})`);

      // Gerar código de 6 dígitos
      const codigo = crypto.randomInt(100000, 999999).toString();

      // Salvar código com timestamp e tentativas
      verificationCodes.set(email, {
        codigo,
        nome: nome || 'Usuário',
        timestamp: Date.now(),
        tentativas: 0,
        provedor
      });

      console.log(`📧 Código gerado: ${codigo}`);

      // Obter transporter do SendGrid
      const mailTransporter = getTransporter();

      // Configurar e-mail
      const mailOptions = {
        from: process.env.SMTP_FROM || `"Sem Errar" <${process.env.SMTP_USER}>`,
        to: email,
        subject: 'Código de verificação - Sem Errar',
        html: emailVerificationTemplate(codigo, nome || 'Usuário'),
        text: `Seu código de verificação é: ${codigo}\n\nEste código expira em 10 minutos.`
      };

      // Enviar e-mail
      await mailTransporter.sendMail(mailOptions);

      // Auto-limpeza após 10 minutos
      setTimeout(() => {
        if (verificationCodes.has(email)) {
          console.log(`🧹 Código expirado para ${email}`);
          verificationCodes.delete(email);
        }
      }, 10 * 60 * 1000);

      return res.json({ 
        sucesso: true,
        mensagem: 'Código enviado com sucesso',
        expira: 600 // segundos
      });

    } catch (error) {
      console.error("❌ Erro ao enviar código:", error);
      
      let mensagemErro = "Erro ao enviar código de verificação";
      
      if (error.code === 'EAUTH') {
        mensagemErro = "Erro de autenticação no SendGrid. Verifique sua API Key.";
      } else if (error.code === 'ESOCKET') {
        mensagemErro = "Erro de conexão com o SendGrid. Verifique host e porta.";
      } else if (error.message) {
        mensagemErro = error.message;
      }
      
      return res.status(500).json({ 
        erro: mensagemErro
      });
    }
  },

  async verificarCodigo(req, res) {
    try {
      const { email, codigo } = req.body;

      if (!email || !codigo) {
        return res.status(400).json({ 
          erro: "E-mail e código são obrigatórios" 
        });
      }

      const dados = verificationCodes.get(email);

      if (!dados) {
        return res.status(400).json({ 
          erro: "Código expirado ou não encontrado. Solicite um novo código." 
        });
      }

      // Verificar se expirou (10 minutos)
      if (Date.now() - dados.timestamp > 10 * 60 * 1000) {
        verificationCodes.delete(email);
        return res.status(400).json({ 
          erro: "Código expirado. Solicite um novo código." 
        });
      }

      // Verificar tentativas (máximo 5)
      if (dados.tentativas >= 5) {
        verificationCodes.delete(email);
        return res.status(400).json({ 
          erro: "Muitas tentativas. Solicite um novo código." 
        });
      }

      // Verificar código
      if (dados.codigo !== codigo) {
        dados.tentativas++;
        verificationCodes.set(email, dados);
        
        console.log(`❌ Código inválido para ${email}. Tentativa ${dados.tentativas}/5`);
        
        return res.status(400).json({ 
          erro: "Código inválido",
          tentativasRestantes: 5 - dados.tentativas
        });
      }

      // Código válido! Gerar token temporário
      const tokenTemp = jwt.sign(
        { 
          email, 
          verificado: true,
          nome: dados.nome
        },
        process.env.JWT_SECRET || "CHAVE_TEMPORARIA_123",
        { expiresIn: "15m" }
      );

      // Remover código após verificação bem-sucedida
      verificationCodes.delete(email);

      console.log(`✅ E-mail verificado com sucesso: ${email}`);

      return res.json({ 
        sucesso: true,
        mensagem: 'E-mail verificado com sucesso',
        token: tokenTemp
      });

    } catch (error) {
      console.error("❌ Erro ao verificar código:", error);
      return res.status(500).json({ 
        erro: "Erro ao verificar código" 
      });
    }
  },

  async reenviarCodigo(req, res) {
    try {
      const { email } = req.body;

      if (!email) {
        return res.status(400).json({ erro: "E-mail é obrigatório" });
      }

      // Verificar se existe código anterior
      const dadosExistentes = verificationCodes.get(email);
      
      if (!dadosExistentes) {
        return res.status(400).json({ 
          erro: "Nenhum código ativo encontrado. Solicite um novo código." 
        });
      }

      // Gerar novo código
      const codigo = crypto.randomInt(100000, 999999).toString();

      // Atualizar código
      verificationCodes.set(email, {
        ...dadosExistentes,
        codigo,
        timestamp: Date.now(),
        tentativas: 0
      });

      console.log(`📧 Código reenviado para ${email}: ${codigo}`);

      // Obter transporter do SendGrid
      const mailTransporter = getTransporter();

      // Configurar e-mail
      const mailOptions = {
        from: process.env.SMTP_FROM || `"Sem Errar" <${process.env.SMTP_USER}>`,
        to: email,
        subject: 'Novo código de verificação - Sem Errar',
        html: emailVerificationTemplate(codigo, dadosExistentes.nome),
        text: `Seu novo código de verificação é: ${codigo}\n\nEste código expira em 10 minutos.`
      };

      // Enviar e-mail
      await mailTransporter.sendMail(mailOptions);

      return res.json({ 
        sucesso: true,
        mensagem: 'Código reenviado com sucesso'
      });

    } catch (error) {
      console.error("❌ Erro ao reenviar código:", error);
      return res.status(500).json({ 
        erro: "Erro ao reenviar código" 
      });
    }
  },

  async verificarStatusCodigo(req, res) {
    try {
      const { email } = req.params;

      const dados = verificationCodes.get(email);

      if (!dados) {
        return res.json({ 
          ativo: false,
          mensagem: "Nenhum código ativo para este e-mail"
        });
      }

      const tempoRestante = Math.max(0, Math.floor((10 * 60 * 1000 - (Date.now() - dados.timestamp)) / 1000));

      return res.json({
        ativo: true,
        tempoRestante,
        tentativas: dados.tentativas
      });

    } catch (error) {
      console.error("❌ Erro ao verificar status:", error);
      return res.status(500).json({ erro: "Erro ao verificar status" });
    }
  },

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

  // ============ CRIAR USUÁRIO (MODIFICADO PARA INCLUIR VERIFICAÇÃO) ============
  async criar(req, res) {
    try {
      console.log("📥 Dados recebidos - req.body:", req.body);
      console.log("📸 Arquivo recebido - req.file:", req.file);

      // Verificar token de verificação
      const tokenVerificacao = req.headers['x-verification-token'];
      
      if (tokenVerificacao) {
        try {
          const decoded = jwt.verify(
            tokenVerificacao, 
            process.env.JWT_SECRET || "CHAVE_TEMPORARIA_123"
          );
          
          if (!decoded.verificado || decoded.email !== req.body.email) {
            return res.status(401).json({ 
              erro: "E-mail não verificado" 
            });
          }
          
          console.log(`✅ Token de verificação válido`);
        } catch (error) {
          return res.status(401).json({ 
            erro: "Token de verificação inválido" 
          });
        }
      } else {
        return res.status(401).json({ 
          erro: "Token de verificação não fornecido" 
        });
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

      // Enviar e-mail de boas-vindas (não bloqueante)
      try {
        const mailTransporter = getTransporter();
        const mailOptions = {
          from: process.env.SMTP_FROM || `"Sem Errar" <${process.env.SMTP_USER}>`,
          to: usuario.email,
          subject: 'Bem-vindo ao Sem Errar! 🎉',
          html: welcomeEmailTemplate(usuario.nome),
        };
        await mailTransporter.sendMail(mailOptions);
        console.log("📧 E-mail de boas-vindas enviado para", usuario.email);
      } catch (emailError) {
        console.error("Erro ao enviar e-mail de boas-vindas:", emailError);
        // Não interrompe o fluxo
      }

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