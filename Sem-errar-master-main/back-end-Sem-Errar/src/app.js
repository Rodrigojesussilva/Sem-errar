const express = require("express");
const cors = require("cors");
const path = require('path');
const routes = require("./routes/usuarioRoutes"); // 👈 CAMINHO COMPLETO
const usuarioController = require("./controllers/usuarioController");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir arquivos estáticos
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Usar as rotas
app.use("/usuarios", routes);

// Rota de login separada
app.post("/logar", usuarioController.logar);

module.exports = app;