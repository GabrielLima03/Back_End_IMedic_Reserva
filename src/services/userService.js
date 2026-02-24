import pool from "../repository/database.js";
import bcrypt from "bcrypt";

/*
|--------------------------------------------------------------------------
| LISTAR (ADMIN FUTURO)
|--------------------------------------------------------------------------
*/
async function listUser() {
  const sql = `
    SELECT id_user, nome, email, data_nasc
    FROM tbl_usuario
    WHERE deletado = 0
  `;
  const result = await pool.query(sql);
  return result.rows;
}

/*
|--------------------------------------------------------------------------
| BUSCAR POR ID
|--------------------------------------------------------------------------
*/
async function getUser(idUser) {
  const sql = `
    SELECT id_user, nome, email, data_nasc
    FROM tbl_usuario
    WHERE deletado = 0 AND id_user = $1
  `;

  const result = await pool.query(sql, [idUser]);

  return result.rows[0] || null;
}

/*
|--------------------------------------------------------------------------
| CRIAR
|--------------------------------------------------------------------------
*/
async function createUser(nome, email, data_nasc, senha) {
  // Verificar se email já existe
  const emailCheck = await pool.query(
    "SELECT 1 FROM tbl_usuario WHERE email = $1",
    [email]
  );

  if (emailCheck.rows.length > 0) {
    throw new Error("Email já cadastrado.");
  }

  const senhaHash = await bcrypt.hash(senha, 10);

  const sql = `
    INSERT INTO tbl_usuario (nome, email, data_nasc, senha)
    VALUES ($1, $2, $3, $4)
  `;

  await pool.query(sql, [nome, email, data_nasc, senhaHash]);
}

/*
|--------------------------------------------------------------------------
| ATUALIZAR
|--------------------------------------------------------------------------
*/
async function updateUser(idUser, nome, email, data_nasc, senha) {

  const campos = [];
  const valores = [];
  let index = 1;

  if (nome) {
    campos.push(`nome = $${index++}`);
    valores.push(nome);
  }

  if (email) {
    campos.push(`email = $${index++}`);
    valores.push(email);
  }

  if (data_nasc) {
    campos.push(`data_nasc = $${index++}`);
    valores.push(data_nasc);
  }

  if (senha) {
    const senhaHash = await bcrypt.hash(senha, 10);
    campos.push(`senha = $${index++}`);
    valores.push(senhaHash);
  }

  if (campos.length === 0) {
    throw new Error("Nenhum campo para atualizar.");
  }

  const sql = `
    UPDATE tbl_usuario
    SET ${campos.join(", ")}
    WHERE id_user = $${index}
  `;

  valores.push(idUser);

  await pool.query(sql, valores);
}

/*
|--------------------------------------------------------------------------
| DELETE (soft delete)
|--------------------------------------------------------------------------
*/
async function deleteUser(idUser) {
  const sql = `
    UPDATE tbl_usuario
    SET deletado = 1
    WHERE id_user = $1
  `;

  await pool.query(sql, [idUser]);
}

export default {
  createUser,
  updateUser,
  listUser,
  deleteUser,
  getUser
};