import pool from "../repository/database.js";
import bcrypt from "bcrypt";

/*
|--------------------------------------------------------------------------
| LOGIN
|--------------------------------------------------------------------------
*/

async function login(email, senha) {

  const sql = `
    SELECT id_user, nome, email, senha, role
    FROM tbl_usuario
    WHERE email = $1
    AND deleted_at IS NULL
  `;

  const result = await pool.query(sql, [email]);

  if (result.rows.length === 0) return null;

  const user = result.rows[0];

  const senhaValida = await bcrypt.compare(senha, user.senha);

  if (!senhaValida) return null;

  return user;
}

export default {
  login
};