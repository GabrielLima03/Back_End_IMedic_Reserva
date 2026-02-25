import express from "express";
import pool from "../repository/database.js";
import { verifyJWT } from "../middlewares/JWT.js";
import { isAdmin } from "../middlewares/isAdmin.js";

const router = express.Router();

/*
👑 Dashboard
*/
router.get("/dashboard", verifyJWT, isAdmin, async (req, res) => {

  try {

    const totalUsuarios = await pool.query(
      "SELECT COUNT(*) FROM tbl_usuario WHERE deleted_at IS NULL"
    );

    const totalAdmins = await pool.query(
      "SELECT COUNT(*) FROM tbl_usuario WHERE role='admin' AND deleted_at IS NULL"
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

    return res.json({
      sistema: {
        status: "online",
        uptime_segundos: process.uptime()
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
    return res.status(500).json({
      message: "Erro ao carregar dashboard"
    });
  }
});

/*
Busca usuário por email
*/
router.get("/usuarios/buscar", verifyJWT, isAdmin, async (req, res) => {

  const { email } = req.query;

  if (!email) {
    return res.status(400).json({
      message: "Email obrigatório"
    });
  }

  const result = await pool.query(
    `SELECT id_user,nome,email,role,created_at
     FROM tbl_usuario
     WHERE email ILIKE $1
     AND deleted_at IS NULL`,
    [`%${email}%`]
  );

  return res.json(result.rows);
});

/*
Listar usuários
*/
router.get("/usuarios", verifyJWT, isAdmin, async (req, res) => {

  const result = await pool.query(
    `SELECT id_user,nome,email,role,created_at
     FROM tbl_usuario
     WHERE deleted_at IS NULL`
  );

  res.json(result.rows);
});

/*
Promover admin
*/
router.put("/usuarios/:id/promover", verifyJWT, isAdmin, async (req, res) => {

  await pool.query(
    "UPDATE tbl_usuario SET role='admin' WHERE id_user=$1",
    [req.params.id]
  );

  res.json({ message: "Usuário promovido" });
});

/*
Rebaixar admin
*/
router.put("/usuarios/:id/rebaixar", verifyJWT, isAdmin, async (req, res) => {

  await pool.query(
    "UPDATE tbl_usuario SET role='user' WHERE id_user=$1",
    [req.params.id]
  );

  res.json({ message: "Usuário rebaixado" });
});

/*
Soft delete
*/
router.delete("/usuarios/:id", verifyJWT, isAdmin, async (req, res) => {

  await pool.query(
    `UPDATE tbl_usuario
     SET deleted_at=NOW()
     WHERE id_user=$1`,
    [req.params.id]
  );

  res.json({ message: "Usuário desativado" });
});

export default router;