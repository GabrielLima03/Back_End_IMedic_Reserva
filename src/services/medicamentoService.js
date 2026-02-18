import database from '../repository/mysql.js';

//CADASTRAR - POST
async function createMedicamento(nome, apelido_comum, medida, ml_do_remedio, miligramagem_por_comprimido, quantidade_comprimidos, categoria, tarja) {
    const sql = "INSERT INTO tbl_medicamentos (nome, apelido_comum, medida, ml_do_remedio, miligramagem_por_comprimido, quantidade_comprimidos, categoria, tarja) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
    
    const infoMedicamento = [nome, apelido_comum, medida, ml_do_remedio, miligramagem_por_comprimido, quantidade_comprimidos, categoria, tarja];

    const conn = await database.connectBD();
    await conn.query(sql, infoMedicamento);
    conn.end();
}

//LISTAR - GET
async function listMedicamento() {
    const sql = "SELECT * FROM tbl_medicamentos WHERE deletado = 0";
    const conn = await database.connectBD();
    const [rows] = await conn.query(sql);
    await conn.end();
    return rows;    
}


//ATUALIZAR - PUT
async function updateMedicamento(id, nome, apelido_comum, medida, ml_do_remedio, miligramagem_por_comprimido, quantidade_comprimidos, categoria, tarja) {
    const sql = "UPDATE tbl_medicamentos SET nome=?, apelido_comum=?, medida=?, ml_do_remedio=?, miligramagem_por_comprimido=?, quantidade_comprimidos=?, categoria=?, tarja=? WHERE id_med=?";
    const infoMedicamento = [nome, apelido_comum, medida, ml_do_remedio, miligramagem_por_comprimido, quantidade_comprimidos, categoria, tarja, id];

    const conn = await database.connectBD();
    await conn.query(sql, infoMedicamento);
    conn.end();
}

//DELETE "FALSO"
async function deleteMedicamento(idMedicamento) {
    const sql = "UPDATE tbl_medicamentos SET deletado = 1 WHERE id_med = ?";
    const conn = await database.connectBD();
    await conn.query(sql, idMedicamento);
    conn.end();
}

export default {createMedicamento, listMedicamento , updateMedicamento, deleteMedicamento};