import express from "express";
import service from "../services/medicamentoService.js";
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
    nome,
    apelido_comum,
    medida,
    ml_do_remedio,
    miligramagem_por_comprimido,
    quantidade_comprimidos,
    categoria,
    tarja
  } = req.body;

  try {
    await service.createMedicamento(
      id_user,
      nome,
      apelido_comum,
      medida,
      ml_do_remedio,
      miligramagem_por_comprimido,
      quantidade_comprimidos,
      categoria,
      tarja
    );

    return res.status(201).json({
      message: "Medicamento cadastrado com sucesso!"
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
    const medicamentos = await service.listMedicamento(id_user);
    return res.status(200).json(medicamentos);

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
  const idMedicamento = req.params.id;

  const {
    nome,
    apelido_comum,
    medida,
    ml_do_remedio,
    miligramagem_por_comprimido,
    quantidade_comprimidos,
    categoria,
    tarja
  } = req.body;

  try {
    await service.updateMedicamento(
      idMedicamento,
      id_user,
      nome,
      apelido_comum,
      medida,
      ml_do_remedio,
      miligramagem_por_comprimido,
      quantidade_comprimidos,
      categoria,
      tarja
    );

    return res.status(200).json({
      message: "Medicamento atualizado com sucesso!"
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
  const idMedicamento = req.params.id;

  try {
    await service.deleteMedicamento(idMedicamento, id_user);

    return res.status(200).json({
      message: "Medicamento removido com sucesso!"
    });

  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

export default router;