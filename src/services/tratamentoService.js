import database from '../repository/mysql.js';

//CADASTRAR - POST
async function createTratamento(idUser, idMed, idTarja, dataInicio, dataFim, dosagem) {
    const sql = "INSERT INTO tbl_meus_tratamentos (id_user, id_med, id_tarja, data_inicio, data_fim, dosagem) VALUES (?, ?, ?, ?, ?, ?)";
    
    const infoTratamento = [idUser, idMed, idTarja, dataInicio, dataFim, dosagem];

    
    const conn = await database.connectBD();
    await conn.query(sql, infoTratamento);
    conn.end();
}




//LISTAR - GET
async function listTratamento() {
    const sql = "SELECT * FROM tbl_meus_tratamentos WHERE deletado = 0";
    const conn = await database.connectBD();
    const [rows] = await conn.query(sql);
    await conn.end();
    return rows;    
}


//ATUALIZAR - PUT
async function updateTratamento(idUser, idMed, idTarja, dataInicio, dataFim, dosagem, idTratamento) {
    const sql = "UPDATE tbl_meus_tratamentos SET id_user=?, id_med=?, id_tarja=?, data_inicio=?, data_fim=?, dosagem=? WHERE id_tratamento=?";
    const infoTratamento = [idUser, idMed, idTarja, dataInicio, dataFim, dosagem, idTratamento];
    
    const conn = await database.connectBD();
    await conn.query(sql, infoTratamento);
    conn.end();
}

//DELETE "FALSO"
async function deleteTratamento(idTratamento) {
    const sql = "UPDATE tbl_meus_tratamentos SET deletado = 1 WHERE id_tratamento = ?";
    const conn = await database.connectBD();
    await conn.query(sql, idTratamento);
    conn.end();
}

export default {createTratamento, listTratamento , updateTratamento, deleteTratamento};