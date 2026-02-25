import express from 'express';
import cors from 'cors';
import routes from './routes.js';
import { initDatabase } from './src/repository/init.js';
import createAdmin from './src/repository/createAdmin.js';
import dotenv from 'dotenv';

dotenv.config();

const server = express();

/*
|--------------------------------------------------------------------------
| Middlewares
|--------------------------------------------------------------------------
*/

server.use(cors());
server.use(express.json());
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

    // 👑 Criação automática do admin (segura e idempotente)
    await createAdmin();

    console.log("✅ Banco inicializado com sucesso!");

    server.listen(PORT, () => {
      console.log(`🚀 O IMEDIC está rodando na porta ${PORT}!`);
    });

  } catch (error) {
    console.error("❌ Erro ao iniciar o servidor:", error);
  }
}

startServer();