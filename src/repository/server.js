import pool from "./database.js";
import { initDatabase } from "./init.js";

async function startServer() {
  try {
    await pool.connect();
    console.log("✅ Banco conectado com sucesso!");

    await initDatabase();

    console.log("🚀 Sistema pronto!");
  } catch (error) {
    console.error("❌ Erro ao iniciar sistema:", error);
  }
}

startServer();