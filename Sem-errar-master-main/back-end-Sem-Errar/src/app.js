const express = require("express");
const cors = require("cors");
const path = require('path');
const routes = require("./routes/usuarioRoutes");
const usuarioController = require("./controllers/usuarioController");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CAMINHO CORRETO - USANDO APENAS 'uploads'
app.use('/uploads', express.static('uploads'));

// Usar as rotas
app.use("/usuarios", routes);
app.post("/logar", usuarioController.logar);

module.exports = app;