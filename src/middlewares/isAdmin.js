import pool from "../repository/database.js";

async function isAdmin(req, res, next) {
  try {

    if (!req.user || !req.user.id_user) {
      return res.status(401).json({
        message: "Usuário não autenticado."
      });
    }

    const result = await pool.query(
      `SELECT role 
       FROM tbl_usuario 
       WHERE id_user = $1 
       AND deleted_at IS NULL`,
      [req.user.id_user]
    );

    if (!result.rows.length || result.rows[0].role !== "admin") {
      return res.status(403).json({
        message: "Acesso permitido apenas para administradores."
      });
    }

    next();

  } catch (error) {
    return res.status(500).json({
      message: "Erro interno de permissão."
    });
  }
}

export { isAdmin };