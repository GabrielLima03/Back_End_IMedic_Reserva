import pool from "../repository/database.js";

/*
|--------------------------------------------------------------------------
| CREATE
|--------------------------------------------------------------------------
*/
async function createAlarme(idUser, titulo, descricao, dataHora) {
  const dateObj = new Date(dataHora);

  if (isNaN(dateObj.getTime())) {
    throw new Error("Data inválida");
  }

  const sql = `
    INSERT INTO alarmes (id_user, titulo, descricao, data_hora)
    VALUES ($1, $2, $3, $4)
  `;

  await pool.query(sql, [
    idUser,
    titulo,
    descricao,
    dateObj
  ]);
}

/*
|--------------------------------------------------------------------------
| READ (somente do usuário logado)
|--------------------------------------------------------------------------
*/
async function listAlarmes(idUser) {
  const sql = `
    SELECT id, titulo, descricao, data_hora, criado_em
    FROM alarmes
    WHERE id_user = $1
      AND deletado = 0
    ORDER BY data_hora ASC
  `;

  const result = await pool.query(sql, [idUser]);
  return result.rows;
}

/*
|--------------------------------------------------------------------------
| UPDATE (protegido por usuário)
|--------------------------------------------------------------------------
*/
async function updateAlarme(
  idAlarme,
  idUser,
  titulo,
  descricao,
  dataHora
) {
  const dateObj = new Date(dataHora);

  if (isNaN(dateObj.getTime())) {
    throw new Error("Data inválida");
  }

  const sql = `
    UPDATE alarmes
    SET titulo = $1,
        descricao = $2,
        data_hora = $3
    WHERE id = $4
      AND id_user = $5
  `;

  await pool.query(sql, [
    titulo,
    descricao,
    dateObj,
    idAlarme,
    idUser
  ]);
}

/*
|--------------------------------------------------------------------------
| DELETE (soft delete protegido)
|--------------------------------------------------------------------------
*/
async function deleteAlarme(idAlarme, idUser) {
  const sql = `
    UPDATE alarmes
    SET deletado = 1
    WHERE id = $1
      AND id_user = $2
  `;

  await pool.query(sql, [idAlarme, idUser]);
}

export default {
  createAlarme,
  listAlarmes,
  updateAlarme,
  deleteAlarme
};