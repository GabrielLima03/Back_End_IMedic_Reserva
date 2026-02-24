import express from "express";
import tratamentoService from "../services/tratamentoService.js";
import { verifyJWT } from "../middlewares/JWT.js";

const router = express.Router();

router.use(verifyJWT);

/*
|--------------------------------------------------------------------------
| CREATE
|--------------------------------------------------------------------------
*/
router.post("/", async (req, res) => {
  const id_user = req.user.id_user;

  const {
    id_med,
    id_tarja,
    data_inicio,
    data_fim,
    dosagem
  } = req.body;

  try {
    await tratamentoService.createTratamento(
      id_user,
      id_med,
      id_tarja,
      data_inicio,
      data_fim,
      dosagem
    );

    return res.status(201).json({
      message: "Tratamento criado com sucesso!"
    });

  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

/*
|--------------------------------------------------------------------------
| READ
|--------------------------------------------------------------------------
*/
router.get("/", async (req, res) => {
  const id_user = req.user.id_user;

  try {
    const tratamentos = await tratamentoService.listTratamento(id_user);
    return res.status(200).json(tratamentos);

  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

/*
|--------------------------------------------------------------------------
| UPDATE
|--------------------------------------------------------------------------
*/
router.put("/:id", async (req, res) => {
  const id_user = req.user.id_user;
  const idTratamento = req.params.id;

  const {
    id_med,
    id_tarja,
    data_inicio,
    data_fim,
    dosagem
  } = req.body;

  try {
    await tratamentoService.updateTratamento(
      idTratamento,
      id_user,
      id_med,
      id_tarja,
      data_inicio,
      data_fim,
      dosagem
    );

    return res.status(200).json({
      message: "Tratamento atualizado com sucesso!"
    });

  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

/*
|--------------------------------------------------------------------------
| DELETE
|--------------------------------------------------------------------------
*/
router.delete("/:id", async (req, res) => {
  const id_user = req.user.id_user;
  const idTratamento = req.params.id;

  try {
    await tratamentoService.deleteTratamento(
      idTratamento,
      id_user
    );

    return res.status(200).json({
      message: "Tratamento removido com sucesso!"
    });

  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

export default router;