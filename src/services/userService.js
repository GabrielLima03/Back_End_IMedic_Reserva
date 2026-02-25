import pool from "../repository/database.js";
import bcrypt from "bcrypt";

async function createUser(nome, email, data_nasc, senha) {

  const emailCheck = await pool.query(
    "SELECT 1 FROM tbl_usuario WHERE email = $1 AND deleted_at IS NULL",
    [email]
  );

  if (emailCheck.rows.length > 0) {
    throw new Error("Email já cadastrado.");
  }

  const senhaHash = await bcrypt.hash(senha, 10);

  await pool.query(
    `INSERT INTO tbl_usuario (nome, email, data_nasc, senha)
     VALUES ($1,$2,$3,$4)`,
    [nome, email, data_nasc, senhaHash]
  );
}

async function getUser(idUser) {

  const result = await pool.query(
    `SELECT id_user,nome,email,data_nasc,role
     FROM tbl_usuario
     WHERE id_user=$1
     AND deleted_at IS NULL`,
    [idUser]
  );

  return result.rows[0] || null;
}

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
    const hash = await bcrypt.hash(senha, 10);
    campos.push(`senha = $${index++}`);
    valores.push(hash);
  }

  if (!campos.length) throw new Error("Nenhum campo para atualizar.");

  const sql = `
    UPDATE tbl_usuario
    SET ${campos.join(", ")}
    WHERE id_user = $${index}
  `;

  valores.push(idUser);

  await pool.query(sql, valores);
}

async function deleteUser(idUser) {

  await pool.query(
    `UPDATE tbl_usuario
     SET deleted_at = NOW()
     WHERE id_user=$1`,
    [idUser]
  );
}

export default {
  createUser,
  updateUser,
  getUser,
  deleteUser
};