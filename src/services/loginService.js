import pool from "../repository/database.js";
import bcrypt from "bcrypt";

/*
|--------------------------------------------------------------------------
| LOGIN
|--------------------------------------------------------------------------
*/
async function login(email, senha) {
  const sql = `
    SELECT id_user, nome, email, senha
    FROM tbl_usuario
    WHERE email = $1
      AND deletado = 0
  `;

  const result = await pool.query(sql, [email]);

  if (result.rows.length === 0) {
    return null;
  }

  const user = result.rows[0];

  const senhaValida = await bcrypt.compare(senha, user.senha);

  if (!senhaValida) {
    return null;
  }

  return user;
}

/*
|--------------------------------------------------------------------------
| CHECK EMAIL
|--------------------------------------------------------------------------
*/
async function checkEmail(email) {
  const sql = `
    SELECT id_user
    FROM tbl_usuario
    WHERE email = $1
      AND deletado = 0
  `;

  const result = await pool.query(sql, [email]);
  return result.rows;
}

/*
|--------------------------------------------------------------------------
| CHANGE PASSWORD
|--------------------------------------------------------------------------
*/
async function changePassword(email, newPassword) {
  const senhaHash = await bcrypt.hash(newPassword, 10);

  const sql = `
    UPDATE tbl_usuario
    SET senha = $1
    WHERE email = $2
      AND deletado = 0
  `;

  await pool.query(sql, [senhaHash, email]);
}

export default {
  login,
  checkEmail,
  changePassword
};