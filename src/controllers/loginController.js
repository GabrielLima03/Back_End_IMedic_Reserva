import express from "express";
import jwt from "jsonwebtoken";
import loginService from "../services/loginService.js";
import { JWT_SECRET } from "../config/auth.js";

const router = express.Router();

/*
|--------------------------------------------------------------------------
| LOGIN
|--------------------------------------------------------------------------
*/
router.post("/", async (req, res) => {
  const { email, senha } = req.body;

  if (!email || !senha) {
    return res.status(400).json({
      message: "Email e senha são obrigatórios."
    });
  }

  try {
    const user = await loginService.login(email, senha);

    if (!user) {
      return res.status(401).json({
        message: "Email ou senha incorretos."
      });
    }

    const token = jwt.sign(
      {
        id_user: user.id_user,
        email: user.email
      },
      JWT_SECRET,
      { expiresIn: "1d" }
    );

    return res.status(200).json({
      message: "Login realizado com sucesso!",
      user: {
        id_user: user.id_user,
        nome: user.nome,
        email: user.email
      },
      token
    });

  } catch (error) {
    console.error("Erro no login:", error);
    return res.status(500).json({
      message: "Erro interno no servidor."
    });
  }
});

export default router;