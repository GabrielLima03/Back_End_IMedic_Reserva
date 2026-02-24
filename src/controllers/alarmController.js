import express from "express";
import alarmService from "../services/alarmServices.js";
import { verifyJWT } from "../middlewares/JWT.js";

const router = express.Router();

router.use(verifyJWT);

/*
|--------------------------------------------------------------------------
| CREATE
|--------------------------------------------------------------------------
*/
router.post("/", async (req, res) => {
  const { titulo, descricao, data_hora } = req.body;
  const id_user = req.user.id_user;

  try {
    await alarmService.createAlarme(
      id_user,
      titulo,
      descricao,
      data_hora
    );

    return res.status(201).json({
      message: "Alarme criado com sucesso!"
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
    const alarmes = await alarmService.listAlarmes(id_user);
    return res.status(200).json(alarmes);

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
  const idAlarme = req.params.id;

  const { titulo, descricao, data_hora } = req.body;

  try {
    await alarmService.updateAlarme(
      idAlarme,
      id_user,
      titulo,
      descricao,
      data_hora
    );

    return res.status(200).json({
      message: "Alarme atualizado com sucesso!"
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
  const idAlarme = req.params.id;

  try {
    await alarmService.deleteAlarme(idAlarme, id_user);

    return res.status(200).json({
      message: "Alarme removido com sucesso!"
    });

  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

export default router;