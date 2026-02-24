import pool from "./database.js";

export async function initDatabase() {
    try {
        console.log("🔄 Criando tabelas...");

        await pool.query(`
  CREATE TABLE IF NOT EXISTS usuarios (
    id_user SERIAL PRIMARY KEY,
    nome VARCHAR(150) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    data_nasc DATE NOT NULL,
    senha TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP,
    deleted_at TIMESTAMP
  );
`);

        // =============================
        // TARJAS
        // =============================
        await pool.query(`
      CREATE TABLE IF NOT EXISTS tarjas (
        id_tarja SERIAL PRIMARY KEY,
        nome VARCHAR(100) NOT NULL
      );
    `);

        // =============================
        // MEDICAMENTOS
        // =============================
        await pool.query(`
      CREATE TABLE IF NOT EXISTS medicamentos (
        id_med SERIAL PRIMARY KEY,
        nome VARCHAR(150) NOT NULL
      );
    `);

        // =============================
        // TRATAMENTOS
        // =============================
        await pool.query(`
      CREATE TABLE IF NOT EXISTS tratamentos (
        id_tratamento SERIAL PRIMARY KEY,
        id_user INTEGER NOT NULL,
        id_med INTEGER NOT NULL,
        id_tarja INTEGER NOT NULL,
        data_inicio DATE NOT NULL,
        data_fim DATE,
        dosagem VARCHAR(50),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        deleted_at TIMESTAMP,

        CONSTRAINT fk_user
          FOREIGN KEY (id_user)
          REFERENCES usuarios(id_user)
          ON DELETE CASCADE,

        CONSTRAINT fk_med
          FOREIGN KEY (id_med)
          REFERENCES medicamentos(id_med)
          ON DELETE CASCADE,

        CONSTRAINT fk_tarja
          FOREIGN KEY (id_tarja)
          REFERENCES tarjas(id_tarja)
          ON DELETE CASCADE
      );
    `);
        // =============================
        // MEDICAMENTOS
        // =============================
        await pool.query(`
      CREATE TABLE IF NOT EXISTS medicamentos (
        id_med SERIAL PRIMARY KEY,
        id_user INTEGER NOT NULL,
        nome VARCHAR(150) NOT NULL,
        apelido_comum VARCHAR(150),
        medida VARCHAR(50),
        ml_do_remedio NUMERIC,
        miligramagem_por_comprimido NUMERIC,
        quantidade_comprimidos INTEGER,
        categoria VARCHAR(100),
        tarja VARCHAR(100),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        deleted_at TIMESTAMP,

        CONSTRAINT fk_user_medicamento
          FOREIGN KEY (id_user)
          REFERENCES usuarios(id_user)
          ON DELETE CASCADE
      );
    `);
        await pool.query(`
      CREATE TABLE IF NOT EXISTS alarmes (
        id_alarme SERIAL PRIMARY KEY,
        id_user INTEGER NOT NULL,
        titulo VARCHAR(150) NOT NULL,
        descricao TEXT,
        data_hora TIMESTAMP NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        deleted_at TIMESTAMP,

        CONSTRAINT fk_user_alarme
          FOREIGN KEY (id_user)
          REFERENCES usuarios(id_user)
          ON DELETE CASCADE
      );
    `);

        console.log("✅ Todas as tabelas criadas com sucesso!");
    } catch (error) {
        console.error("❌ Erro ao criar tabelas:", error);
    }
}