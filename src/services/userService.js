import database from "../repository/mysql.js";
import bcrypt from 'bcrypt';

// LISTAR - GET
async function listUser () {
    const sql = "SELECT * FROM tbl_usuario WHERE deletado = 0";
    const conn = await database.connectBD();
    const [rows] = await conn.query(sql);
    conn.end();
    return rows;
}

// Obter usuário por ID
async function getUser (idUser ) {
    const sql = "SELECT * FROM tbl_usuario WHERE deletado = 0 AND id_user = ?";
    const infoUser  = [idUser ];
    const conn = await database.connectBD();
    const [rows] = await conn.query(sql, infoUser );
    conn.end();

    if (rows.length > 0) return rows[0];
    return 0;
}

// CADASTRAR - POST
async function createUser (nome, email, data_nasc, senha) {
    const sql = "INSERT INTO tbl_usuario (nome, email, data_nasc, senha) VALUES (?, ?, ?, ?)";
    const infoUser  = [nome, email, data_nasc, senha];

    const conn = await database.connectBD();
    await conn.query(sql, infoUser );
    conn.end();
}

// ATUALIZAR - PUT
async function updateUser (nome, email, data_nasc, senha, IdUser ) {
    const sql = "UPDATE tbl_usuario SET nome = ?, email = ?, data_nasc = ?, senha = ? WHERE id_user = ?";
    const infoUser  = [nome, email, data_nasc, senha, IdUser ];
    
    const conn = await database.connectBD();
    await conn.query(sql, infoUser );
    conn.end();
}

// DELETE
async function deleteUser (idUser ) {
    const sql = "UPDATE tbl_usuario SET deletado = 1 WHERE id_user = ?";
    const conn = await database.connectBD();
    await conn.query(sql, idUser );
    conn.end();
}

export default { createUser , updateUser , listUser , deleteUser , getUser , getUser };