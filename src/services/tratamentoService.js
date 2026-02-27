import pool from "../repository/database.js";

/* ============================
   CREATE
============================ */
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

/* ============================
   LIST
============================ */
async function listTratamentos(idUser) {
  const sql = `
    SELECT 
      t.id_tratamento,
      t.id_med,
      t.id_tarja,
      t.data_inicio,
      t.data_fim,
      t.dosagem,
      m.nome AS nome_remedio,
      tj.nome AS nome_tarja
    FROM tbl_meus_tratamentos t
    JOIN tbl_medicamentos m ON m.id_med = t.id_med
    JOIN tarjas tj ON tj.id_tarja = t.id_tarja
    WHERE t.id_user = $1
      AND t.deleted_at IS NULL
    ORDER BY t.data_inicio ASC
  `;

  const result = await pool.query(sql, [idUser]);
  return result.rows;
}

/* ============================
   UPDATE
============================ */
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
        dosagem = $5,
        updated_at = CURRENT_TIMESTAMP
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

/* ============================
   DELETE (SOFT)
============================ */
async function deleteTratamento(idTratamento, idUser) {
  const sql = `
    UPDATE tbl_meus_tratamentos
    SET deleted_at = CURRENT_TIMESTAMP
    WHERE id_tratamento = $1
      AND id_user = $2
  `;

  await pool.query(sql, [idTratamento, idUser]);
}

export default {
  createTratamento,
  listTratamentos,
  updateTratamento,
  deleteTratamento
};