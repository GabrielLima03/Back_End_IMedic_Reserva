import pkg from "pg";
const { Pool } = pkg;

const pool = new Pool({
  connectionString: "postgresql://imedic_user:78wfxveG3fLUCukWoC4PWuI4js1JgJbj@dpg-d6e5dmbh46gs73d9mu50-a.oregon-postgres.render.com/imedic",
  ssl: {
    rejectUnauthorized: false,
  },
});

export default pool;