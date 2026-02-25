import express from "express";
import pool from "../repository/database.js";
import { verifyJWT } from "../middlewares/JWT.js";
import { isAdmin } from "../middlewares/isAdmin.js";

const router = express.Router();

/*
|--------------------------------------------------------------------------
| 👑 DASHBOARD ADMIN
|--------------------------------------------------------------------------
*/
router.get("/dashboard", verifyJWT, isAdmin, async (req, res) => {
  try {
    const totalUsuarios = await pool.query(
      "SELECT COUNT(*) FROM tbl_usuario WHERE deleted_at IS NULL"
    );

    const totalAdmins = await pool.query(
      "SELECT COUNT(*) FROM tbl_usuario WHERE role = 'admin' AND deleted_at IS NULL"
    );

    const totalTratamentos = await pool.query(
      "SELECT COUNT(*) FROM tbl_meus_tratamentos WHERE deleted_at IS NULL"
    );

    const totalMedicamentos = await pool.query(
      "SELECT COUNT(*) FROM tbl_medicamentos WHERE deleted_at IS NULL"
    );

    const totalAlarmes = await pool.query(
      "SELECT COUNT(*) FROM alarmes WHERE deleted_at IS NULL"
    );

    const dbStatus = await pool.query("SELECT NOW()");

    return res.json({
      sistema: {
        status: "online",
        ambiente: process.env.NODE_ENV || "production",
        uptime_segundos: process.uptime()
      },
      banco: {
        status: "conectado",
        horario_servidor: dbStatus.rows[0].now
      },
      estatisticas: {
        usuarios: Number(totalUsuarios.rows[0].count),
        admins: Number(totalAdmins.rows[0].count),
        tratamentos: Number(totalTratamentos.rows[0].count),
        medicamentos: Number(totalMedicamentos.rows[0].count),
        alarmes: Number(totalAlarmes.rows[0].count)
      }
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Erro ao carregar dashboard." });
  }
});

/*
|--------------------------------------------------------------------------
| 👑 Listar todos os usuários
|--------------------------------------------------------------------------
*/
router.get("/usuarios", verifyJWT, isAdmin, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT id_user, nome, email, role, created_at
       FROM tbl_usuario
       WHERE deleted_at IS NULL`
    );

    return res.json(result.rows);

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Erro ao listar usuários." });
  }
});

/*
|--------------------------------------------------------------------------
| 👑 Buscar usuário por email
|--------------------------------------------------------------------------
*/
router.get("/usuarios/buscar", verifyJWT, isAdmin, async (req, res) => {
  try {
    const { email } = req.query;

    if (!email) {
      return res.status(400).json({
        message: "Informe um email para busca."
      });
    }

    const result = await pool.query(
      `SELECT id_user, nome, email, role, created_at
       FROM tbl_usuario
       WHERE email ILIKE $1
       AND deleted_at IS NULL`,
      [`%${email}%`]
    );

    return res.json(result.rows);

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Erro ao buscar usuário." });
  }
});

/*
|--------------------------------------------------------------------------
| 👑 Promover usuário para admin
|--------------------------------------------------------------------------
*/
router.put("/usuarios/:id/promover", verifyJWT, isAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    await pool.query(
      "UPDATE tbl_usuario SET role = 'admin' WHERE id_user = $1",
      [id]
    );

    return res.json({ message: "Usuário promovido com sucesso." });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Erro ao promover usuário." });
  }
});

/*
|--------------------------------------------------------------------------
| 👑 Rebaixar admin para usuário comum
|--------------------------------------------------------------------------
*/
router.put("/usuarios/:id/rebaixar", verifyJWT, isAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    await pool.query(
      "UPDATE tbl_usuario SET role = 'user' WHERE id_user = $1",
      [id]
    );

    return res.json({ message: "Usuário rebaixado para comum." });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Erro ao rebaixar usuário." });
  }
});

/*
|--------------------------------------------------------------------------
| 👑 Desativar usuário (soft delete)
|--------------------------------------------------------------------------
*/
router.delete("/usuarios/:id", verifyJWT, isAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    await pool.query(
      "UPDATE tbl_usuario SET deleted_at = NOW() WHERE id_user = $1",
      [id]
    );

    return res.json({ message: "Usuário desativado com sucesso." });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Erro ao desativar usuário." });
  }
});

/*
|--------------------------------------------------------------------------
| 👑 Reativar usuário
|--------------------------------------------------------------------------
*/
router.put("/usuarios/:id/reativar", verifyJWT, isAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    await pool.query(
      "UPDATE tbl_usuario SET deleted_at = NULL WHERE id_user = $1",
      [id]
    );

    return res.json({ message: "Usuário reativado com sucesso." });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Erro ao reativar usuário." });
  }
});

export default router;