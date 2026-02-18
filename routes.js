import express from "express";
import userController from "./src/controllers/userController.js";
import loginController from "./src/controllers/loginController.js";
import alarmController from "./src/controllers/alarmController.js";
import tratamentoController from "./src/controllers/tratamentoController.js";
import medicamentoController from "./src/controllers/medicamentoController.js";
import { verifyJWT } from "./src/middlewares/JWT.js";
import tarjaController from "./src/controllers/tarjaController.js";

const routes = express();

routes.use('/user', userController);
routes.use('/login', loginController);
routes.use('/alarmes', alarmController);
routes.use('/tratamento', tratamentoController);
routes.use('/medicamento', medicamentoController);
routes.use('/tarja', tarjaController);

export default routes;

//Adicionei: Chamei a função verifyJWT no caminho do routes