import express, {request, response} from "express";

import service from "../services/tratamentoService.js";

const route = express.Router();

//CADASTRAR - POST
route.post("/", async (request, response) => {
    try {
        const { id_user, id_med, id_tarja, data_inicio, data_fim, dosagem } = request.body;
        await service.createTratamento(id_user, id_med, id_tarja, data_inicio, data_fim, dosagem);
        return response.status(201).send({ "message": "Tratamento cadastrado com sucesso!" });
    } catch (error) {
        console.error("Erro ao cadastrar tratamento:", error);
        return response.status(500).send({ "message": "Erro ao cadastrar tratamento." });
    }
});


//LISTAR - GET
route.get("/", async (request,response) => {
    const tratamento = await service.listTratamento();

    return response.status(200).send({"message": tratamento});
});


//ATUALIZAR - PUT

route.put("/:id", async (request, response) => {
    try {
        const { id_user, id_med, id_tarja, data_inicio, data_fim, dosagem } = request.body;
        const { id } = request.params;

        await service.updateTratamento(id_user, id_med, id_tarja, data_inicio, data_fim, dosagem, id);

        return response.status(200).send({ "message": "Tratamento atualizado com sucesso!" });
    } catch (error) {
        console.error("Erro ao atualizar tratamento:", error);
        return response.status(500).send({ "message": "Erro ao atualizar tratamento." });
    }
});

//DELETE "FALSO"

route.delete("/:idTratamento", async (request, response) => {
    const {idTratamento} = request.params;

    await service.deleteTratamento(idTratamento);
    return response.status(200).send({"message": "Tratamento excluído com sucesso"})
});


export default route;

/*http://localhost:3306/tratamento*/