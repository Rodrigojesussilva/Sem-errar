const express = require('express');
const routes = express.Router();
const usuarioController = require('../controllers/usuarioController'); // 👈 ESTE CAMINHO
const upload = require('../config/multer');

// Rotas públicas
routes.post('/login', usuarioController.logar);
routes.post('/', upload.single('foto'), usuarioController.criar);

// Rotas protegidas
routes.get('/', usuarioController.listar);
routes.get('/:id', usuarioController.buscarPorId);
routes.put('/:id', upload.single('foto'), usuarioController.atualizar);
routes.delete('/:id', usuarioController.deletar);

module.exports = routes;