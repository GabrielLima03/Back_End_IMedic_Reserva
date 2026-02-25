import express from "express";

// Controllers
import userController from "./src/controllers/userController.js";
import loginController from "./src/controllers/loginController.js";
import alarmController from "./src/controllers/alarmController.js";
import tratamentoController from "./src/controllers/tratamentoController.js";
import medicamentoController from "./src/controllers/medicamentoController.js";
import adminController from "./src/controllers/adminController.js";

const routes = express.Router();

/*
|--------------------------------------------------------------------------
| 🌍 Rotas Públicas
|--------------------------------------------------------------------------
*/

routes.use("/login", loginController);
routes.use("/user", userController); // cadastro normalmente é público

/*
|--------------------------------------------------------------------------
| 🔐 Rotas Protegidas (JWT dentro dos controllers)
|--------------------------------------------------------------------------
*/

routes.use("/alarmes", alarmController);
routes.use("/tratamento", tratamentoController);
routes.use("/medicamento", medicamentoController);

/*
|--------------------------------------------------------------------------
| 👑 Rotas Administrativas
|--------------------------------------------------------------------------
*/

routes.use("/admin", adminController);

export default routes;