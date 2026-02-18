import express from "express";
import { criarAlarme, listarAlarmes } from "../services/alarmServices.js";

const router = express.Router();

// POST /alarmes - Criar novo alarme
router.post("/", async (req, res) => {
    try {
        // Obter os dados diretamente do corpo da requisição
        const { titulo, descricao, data_hora } = req.body;

        // Verificar se os campos obrigatórios estão presentes
        if (!titulo || !data_hora) {
            return res.status(400).json({ error: "Título e data/hora são obrigatórios." });
        }

        // Tentar criar o alarme
        await criarAlarme(titulo, descricao, data_hora);

        // Resposta de sucesso
        res.status(201).json({ message: "✅ Alarme criado com sucesso!" });
    } catch (error) {
        // Se ocorrer um erro durante o processo
        console.error("Erro no controller:", error);
        if (error.message === "Data inválida") {
            return res.status(400).json({ error: "Data fornecida é inválida." });
        }
        res.status(500).json({ error: "Erro ao salvar alarme." });
    }
});

// GET /alarmes - Listar todos os alarmes
router.get("/", async (req, res) => {
    try {
        const alarmes = await listarAlarmes();
        res.json(alarmes);
    } catch (error) {
        console.error("Erro ao buscar alarmes:", error);
        res.status(500).json({ error: "Erro ao buscar alarmes." });
    }
});

export default router;
