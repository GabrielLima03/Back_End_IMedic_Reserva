import pool from "../repository/database.js";

/*
|--------------------------------------------------------------------------
| CREATE
|--------------------------------------------------------------------------
*/
async function createMedicamento(
  idUser,
  nome,
  apelido_comum,
  medida,
  ml_do_remedio,
  miligramagem_por_comprimido,
  quantidade_comprimidos,
  categoria,
  tarja
) {
  const sql = `
    INSERT INTO tbl_medicamentos
    (id_user, nome, apelido_comum, medida, ml_do_remedio,
     miligramagem_por_comprimido, quantidade_comprimidos,
     categoria, tarja)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
  `;

  await pool.query(sql, [
    idUser,
    nome,
    apelido_comum,
    medida,
    ml_do_remedio,
    miligramagem_por_comprimido,
    quantidade_comprimidos,
    categoria,
    tarja
  ]);
}

/*
|--------------------------------------------------------------------------
| READ (somente do usuário logado)
|--------------------------------------------------------------------------
*/
async function listMedicamento(idUser) {
  const sql = `
    SELECT *
    FROM tbl_medicamentos
    WHERE id_user = $1
      AND deletado = 0
    ORDER BY nome ASC
  `;

  const result = await pool.query(sql, [idUser]);
  return result.rows;
}

/*
|--------------------------------------------------------------------------
| UPDATE (proteção por usuário)
|--------------------------------------------------------------------------
*/
async function updateMedicamento(
  idMedicamento,
  idUser,
  nome,
  apelido_comum,
  medida,
  ml_do_remedio,
  miligramagem_por_comprimido,
  quantidade_comprimidos,
  categoria,
  tarja
) {
  const sql = `
    UPDATE tbl_medicamentos
    SET nome = $1,
        apelido_comum = $2,
        medida = $3,
        ml_do_remedio = $4,
        miligramagem_por_comprimido = $5,
        quantidade_comprimidos = $6,
        categoria = $7,
        tarja = $8
    WHERE id_med = $9
      AND id_user = $10
  `;

  await pool.query(sql, [
    nome,
    apelido_comum,
    medida,
    ml_do_remedio,
    miligramagem_por_comprimido,
    quantidade_comprimidos,
    categoria,
    tarja,
    idMedicamento,
    idUser
  ]);
}

/*
|--------------------------------------------------------------------------
| DELETE (soft delete protegido)
|--------------------------------------------------------------------------
*/
async function deleteMedicamento(idMedicamento, idUser) {
  const sql = `
    UPDATE tbl_medicamentos
    SET deletado = 1
    WHERE id_med = $1
      AND id_user = $2
  `;

  await pool.query(sql, [idMedicamento, idUser]);
}

export default {
  createMedicamento,
  listMedicamento,
  updateMedicamento,
  deleteMedicamento
};