import pool from "./database.js";

export async function initDatabase() {
  try {
    console.log("🔄 Resetando banco...");

    await pool.query(`
      DROP TABLE IF EXISTS tbl_meus_tratamentos CASCADE;
      DROP TABLE IF EXISTS tbl_medicamentos CASCADE;
      DROP TABLE IF EXISTS alarmes CASCADE;
      DROP TABLE IF EXISTS tarjas CASCADE;
      DROP TABLE IF EXISTS tbl_usuario CASCADE;
    `);

    console.log("🗑 Tabelas antigas removidas.");

    console.log("🔄 Criando tabelas...");

    // aqui continua seus CREATE TABLE normalmente...

  } catch (error) {
    console.error("Erro ao recriar banco:", error);
  }
  try {
    console.log("🔄 Criando tabelas...");

    await pool.query(`
    CREATE TABLE IF NOT EXISTS tbl_usuario (
      id_user SERIAL PRIMARY KEY,
      nome VARCHAR(150) NOT NULL,
      email VARCHAR(150) UNIQUE NOT NULL,
      data_nasc DATE NOT NULL,
      senha TEXT NOT NULL,
      role VARCHAR(20) DEFAULT 'user',
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
        nome VARCHAR(100) NOT NULL UNIQUE
      );
    `);

    // =============================
    // TRATAMENTOS
    // =============================
    await pool.query(`
      CREATE TABLE IF NOT EXISTS tbl_meus_tratamentos (
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
        REFERENCES tbl_usuario(id_user)
        ON DELETE CASCADE,

      CONSTRAINT fk_med
        FOREIGN KEY (id_med)
        REFERENCES tbl_medicamentos(id_med)
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
      CREATE TABLE IF NOT EXISTS tbl_medicamentos (
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
        id_tratamento INTEGER,
        titulo VARCHAR(150) NOT NULL,
        descricao TEXT,
        data_hora TIMESTAMP NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        deleted_at TIMESTAMP,

        CONSTRAINT fk_user_alarme
          FOREIGN KEY (id_user)
          REFERENCES tbl_usuario(id_user)
          ON DELETE CASCADE,

        CONSTRAINT fk_tratamento_alarme
          FOREIGN KEY (id_tratamento)
          REFERENCES tbl_meus_tratamentos(id_tratamento)
          ON DELETE CASCADE
        );
      `);

    console.log("✅ Todas as tabelas criadas com sucesso!");
  } catch (error) {
    console.error("❌ Erro ao criar tabelas:", error);
  }
}