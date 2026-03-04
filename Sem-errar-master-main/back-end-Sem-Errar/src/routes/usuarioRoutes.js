const express = require('express');
const routes = express.Router();
const usuarioController = require('../controllers/usuarioController');
const upload = require('../config/multer');

// ============ ROTAS PÚBLICAS ============
routes.post('/logar', usuarioController.logar);
routes.post('/', upload.single('foto'), usuarioController.criar);

// ============ ROTAS DE VERIFICAÇÃO DE EMAIL ============
routes.post('/enviar-codigo-verificacao', usuarioController.enviarCodigoVerificacao);
routes.post('/verificar-email', usuarioController.verificarCodigo);
routes.post('/reenviar-codigo', usuarioController.reenviarCodigo);
routes.get('/verificar-status/:email', usuarioController.verificarStatusCodigo);

// ============ ROTA DE TESTE (OPCIONAL) ============
routes.post('/testar-email', usuarioController.testarConfiguracaoEmail);

// ============ ROTAS PROTEGIDAS ============
routes.get('/', usuarioController.listar);
routes.get('/:id', usuarioController.buscarPorId);
routes.get('/email/:email', usuarioController.buscarPorEmail);
routes.put('/:id', upload.single('foto'), usuarioController.atualizar);
routes.delete('/:id', usuarioController.deletar);
routes.get('/estatisticas/geral', usuarioController.estatisticas);
routes.post('/verificar-token', usuarioController.verificarToken);
routes.post('/recuperar-senha', usuarioController.recuperarSenha);
routes.post('/redefinir-senha', usuarioController.redefinirSenha);

module.exports = routes;