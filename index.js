import express from 'express';
import cors from 'cors';
import routes from './routes.js';
import { initDatabase } from './src/repository/init.js';

const server = express();

/*
|--------------------------------------------------------------------------
| Middlewares
|--------------------------------------------------------------------------
*/

// Cors (já resolve CORS automaticamente)
server.use(cors());

// Parser JSON
server.use(express.json());

// Rotas
server.use("/", routes);

/*
|--------------------------------------------------------------------------
| Inicialização do Banco + Servidor
|--------------------------------------------------------------------------
*/

const PORT = process.env.PORT || 3333;

async function startServer() {
  try {
    console.log("🔄 Inicializando banco de dados...");

    await initDatabase();

    console.log("✅ Banco inicializado com sucesso!");

    server.listen(PORT, () => {
      console.log(`🚀 O IMEDIC está rodando na porta ${PORT}!`);
    });

  } catch (error) {
    console.error("❌ Erro ao iniciar o servidor:", error);
  }
}

startServer();