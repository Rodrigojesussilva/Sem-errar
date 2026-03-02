const express = require('express');
const routes = express.Router();
const usuarioController = require('../controllers/usuarioController');
const upload = require('../config/multer');

// ============ ROTAS PÚBLICAS ============
// Login (público) - CORRIGIDO: /logar
routes.post('/logar', usuarioController.logar);

// Criar usuário (público - cadastro)
routes.post('/', upload.single('foto'), usuarioController.criar);

// ============ ROTAS PROTEGIDAS ============
// Listar todos os usuários
routes.get('/', usuarioController.listar);

// Buscar usuário por ID
routes.get('/:id', usuarioController.buscarPorId);

// Buscar usuário por email
routes.get('/email/:email', usuarioController.buscarPorEmail);

// Atualizar usuário
routes.put('/:id', upload.single('foto'), usuarioController.atualizar);

// Deletar usuário
routes.delete('/:id', usuarioController.deletar);

// Estatísticas
routes.get('/estatisticas/geral', usuarioController.estatisticas);

// Verificar token
routes.post('/verificar-token', usuarioController.verificarToken);

// Recuperar senha
routes.post('/recuperar-senha', usuarioController.recuperarSenha);

// Redefinir senha
routes.post('/redefinir-senha', usuarioController.redefinirSenha);

routes.post('/enviar-codigo-verificacao', UsuarioController.enviarCodigoVerificacao);

routes.post('/verificar-email', UsuarioController.verificarCodigo);

routes.post('/reenviar-codigo', UsuarioController.reenviarCodigo);

module.exports = routes;