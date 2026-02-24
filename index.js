import express from 'express';
import cors from 'cors'; // 👈 importe o cors
import routes from './routes.js';

const server = express();

server.use(cors()); // 👈 use o middleware do cors
server.use(express.json());
server.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  
  // Preflight request (OPTIONS)
  if (req.method === "OPTIONS") {
    return res.sendStatus(204); // No Content
  }

  next();
});

server.use("/", routes);

const PORT = process.env.PORT || 3333;

server.listen(PORT, () => {
  console.log(`O IMEDIC está rodando na porta ${PORT}!`);
});
