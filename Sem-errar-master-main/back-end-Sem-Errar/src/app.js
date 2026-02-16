// app.js
const express = require("express");
const cors = require("cors");
const usuarioRoutes = require("./routes/usuarioRoutes");
const usuarioController = require("./controllers/usuarioController"); // Importar controller

const app = express();

app.use(cors());
app.use(express.json());

app.use("/usuarios", usuarioRoutes);

// ADICIONE ESTA LINHA PARA A ROTA DE LOGIN:
app.post("/logar", usuarioController.logar);

module.exports = app;