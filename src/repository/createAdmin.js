import pool from "./database.js";
import bcrypt from "bcrypt";

export default async function createAdmin() {
  try {
    const adminEmail = "adminGabriel@imedic.com";
    const adminSenha = "895233Fu@";

    const adminExiste = await pool.query(
      "SELECT * FROM tbl_usuario WHERE email = $1",
      [adminEmail]
    );

    if (adminExiste.rows.length > 0) {
      console.log("⚠️ Admin já existe.");
      return;
    }

    const senhaCriptografada = await bcrypt.hash(adminSenha, 10);

    await pool.query(
      `
      INSERT INTO tbl_usuario
      (nome, email, data_nasc, senha, role)
      VALUES ($1, $2, $3, $4, $5)
      `,
      [
        "Administrador",
        adminEmail,
        "2007-09-03",
        senhaCriptografada,
        "admin"
      ]
    );

    console.log("👑 Admin criado com sucesso!");

  } catch (error) {
    console.error("❌ Erro ao criar admin:", error);
  }
}