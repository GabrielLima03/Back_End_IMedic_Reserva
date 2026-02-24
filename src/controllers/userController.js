import express from "express";
import service from "../services/userService.js";
import { verifyJWT } from "../middlewares/JWT.js";

const router = express.Router();

// Converter DD/MM/AAAA → YYYY-MM-DD
function formatarData(dataBrasileira) {
  const [dia, mes, ano] = dataBrasileira.split("/");
  return `${ano}-${mes}-${dia}`;
}

/*
|--------------------------------------------------------------------------
| CRIAR USUÁRIO (registro)
|--------------------------------------------------------------------------
*/
router.post("/", async (req, res) => {
  try {
    let { nome, email, data_nasc, senha } = req.body;

    if (!nome || !email || !data_nasc || !senha) {
      return res.status(400).json({
        message: "Todos os campos são obrigatórios."
      });
    }

    data_nasc = formatarData(data_nasc);

    await service.createUser(nome, email, data_nasc, senha);

    return res.status(201).json({
      message: "Usuário cadastrado com sucesso"
    });

  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
});

/*
|--------------------------------------------------------------------------
| BUSCAR PERFIL DO USUÁRIO LOGADO
|--------------------------------------------------------------------------
*/
router.get("/me", verifyJWT, async (req, res) => {
  try {
    const id_user = req.user.id_user;

    const user = await service.getUser(id_user);

    if (!user) {
      return res.status(404).json({
        message: "Usuário não encontrado"
      });
    }

    return res.status(200).json(user);

  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

/*
|--------------------------------------------------------------------------
| ATUALIZAR PERFIL
|--------------------------------------------------------------------------
*/
router.put("/me", verifyJWT, async (req, res) => {
  try {
    const id_user = req.user.id_user;
    let { nome, email, data_nasc, senha } = req.body;

    if (data_nasc) {
      data_nasc = formatarData(data_nasc);
    }

    await service.updateUser(id_user, nome, email, data_nasc, senha);

    return res.status(200).json({
      message: "Dados atualizados com sucesso"
    });

  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
});

/*
|--------------------------------------------------------------------------
| DELETE (soft delete)
|--------------------------------------------------------------------------
*/
router.delete("/me", verifyJWT, async (req, res) => {
  try {
    const id_user = req.user.id_user;

    await service.deleteUser(id_user);

    return res.status(200).json({
      message: "Usuário excluído com sucesso"
    });

  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
});

export default router;