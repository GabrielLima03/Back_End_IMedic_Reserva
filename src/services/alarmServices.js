import database from "../repository/mysql.js";

// Função para formatar a data para o formato MySQL
function formatDateToMySQL(date) {
    const d = new Date(date);
    const pad = (n) => n.toString().padStart(2, '0');

    // Formatar para o formato: "YYYY-MM-DD HH:MM:SS"
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
}

// Criar alarme no banco (sem Id_user)
export async function criarAlarme(titulo, descricao, dataHora) {
    try {
        // Verificar se a data fornecida é válida
        const dateObj = new Date(dataHora);
        if (isNaN(dateObj.getTime())) {
            throw new Error("Data inválida");
        }

        // Formatando a data no formato MySQL
        const dataFormatada = formatDateToMySQL(dataHora);

        const sql = `
            INSERT INTO alarmes (titulo, descricao, data_hora)
            VALUES (?, ?, ?)
        `;
        const values = [titulo, descricao, dataFormatada];

        const conn = await database.connectBD();
        await conn.query(sql, values);
        conn.end();
    } catch (error) {
        console.error("Erro ao criar alarme:", error);
        throw error;  // Propaga o erro para o controller ou camada superior
    }
}

// Listar todos os alarmes
export async function listarAlarmes() {
    const sql = `
        SELECT id, titulo, descricao, data_hora, criado_em
        FROM alarmes
        ORDER BY data_hora ASC
    `;

    const conn = await database.connectBD();
    const [rows] = await conn.query(sql);
    conn.end();

    return rows;
}
