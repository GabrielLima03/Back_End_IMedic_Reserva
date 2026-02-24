import pool from "../repository/database.js";

/*
|--------------------------------------------------------------------------
| CREATE
|--------------------------------------------------------------------------
*/
async function createTratamento(
  idUser,
  idMed,
  idTarja,
  dataInicio,
  dataFim,
  dosagem
) {
  const sql = `
    INSERT INTO tbl_meus_tratamentos
    (id_user, id_med, id_tarja, data_inicio, data_fim, dosagem)
    VALUES ($1, $2, $3, $4, $5, $6)
  `;

  await pool.query(sql, [
    idUser,
    idMed,
    idTarja,
    dataInicio,
    dataFim,
    dosagem
  ]);
}

/*
|--------------------------------------------------------------------------
| READ (somente do usuário logado)
|--------------------------------------------------------------------------
*/
async function listTratamento(idUser) {
  const sql = `
    SELECT *
    FROM tbl_meus_tratamentos
    WHERE id_user = $1
      AND deletado = 0
    ORDER BY data_inicio ASC
  `;

  const result = await pool.query(sql, [idUser]);
  return result.rows;
}

/*
|--------------------------------------------------------------------------
| UPDATE (proteção por usuário)
|--------------------------------------------------------------------------
*/
async function updateTratamento(
  idTratamento,
  idUser,
  idMed,
  idTarja,
  dataInicio,
  dataFim,
  dosagem
) {
  const sql = `
    UPDATE tbl_meus_tratamentos
    SET id_med = $1,
        id_tarja = $2,
        data_inicio = $3,
        data_fim = $4,
        dosagem = $5
    WHERE id_tratamento = $6
      AND id_user = $7
  `;

  await pool.query(sql, [
    idMed,
    idTarja,
    dataInicio,
    dataFim,
    dosagem,
    idTratamento,
    idUser
  ]);
}

/*
|--------------------------------------------------------------------------
| DELETE (soft delete protegido)
|--------------------------------------------------------------------------
*/
async function deleteTratamento(idTratamento, idUser) {
  const sql = `
    UPDATE tbl_meus_tratamentos
    SET deletado = 1
    WHERE id_tratamento = $1
      AND id_user = $2
  `;

  await pool.query(sql, [idTratamento, idUser]);
}

export default {
  createTratamento,
  listTratamento,
  updateTratamento,
  deleteTratamento
};