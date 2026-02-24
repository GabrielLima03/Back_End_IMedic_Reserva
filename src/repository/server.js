import { initDatabase } from "./init.js";

async function startServer() {
  try {
    await initDatabase();

    console.log("🚀 Sistema pronto!");
  } catch (error) {
    console.error("❌ Erro ao iniciar sistema:", error);
  }
}

startServer();