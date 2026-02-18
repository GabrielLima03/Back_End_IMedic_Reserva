import express, { request, response } from 'express';
import { generatePassword } from '../helpers/loginActions.js';
import db from '../services/loginService.js'; // serviço com a lógica de login
import service from '../services/userService.js'; // serviço com reset de senha

const router = express.Router();

// Rota de login
router.post("/", async (request, response) => {
    const { email, senha } = request.body;

    try {
        const users = await db.login(email, senha);

        if (users.length > 0) {
            console.log('✅ Login validado');
            return response.status(200).json({ message: "Login efetuado com sucesso" });
        } else {
            console.log('❌ Erro de validação - login incorreto');
            return response.status(401).json({ message: "Login incorreto" });
        }
    } catch (err) {
        console.error('❌ Erro no banco de dados:', err);
        return response.status(500).json({ message: `Houve um erro no banco de dados. ${err}` });
    }
});

// Rota de reset de senha
router.post('/reset', async (request, response) => {
    const { email } = request.body;

    try {
        const users = await service.checkEmail(email);

        if (users.length > 0) {
            const newPassword = generatePassword();
            await service.changePassword(email, newPassword);
            console.log(`🔄 Senha redefinida para o e-mail: ${email}`);
            return response.status(200).json({ message: `Nova senha: ${newPassword}` });
        } else {
            console.log(`⚠️ Usuário não encontrado para o e-mail: ${email}`);
            return response.status(404).json({ message: 'Usuário não encontrado' });
        }
    } catch (err) {
        console.error('❌ Erro ao redefinir senha:', err);
        return response.status(500).json({ message: `Houve um erro no banco de dados. ${err}` });
    }
});

export default router;
