import express, {request, response} from "express";
import service from "../services/medicamentoService.js"


const route = express.Router();

//CADASTRAR - POST
route.post("/", async (request, response) => {
    try {
        const { nome, apelido_comum, medida, ml_do_remedio, miligramagem_por_comprimido, quantidade_comprimidos, categoria, tarja } = request.body;
        await service.createMedicamento(nome, apelido_comum, medida, ml_do_remedio, miligramagem_por_comprimido, quantidade_comprimidos, categoria, tarja);
        return response.status(201).send({ "message": "Medicamento cadastrado com sucesso!" });
    } catch (error) {
        console.error("Erro ao cadastrar medicamento:", error);
        return response.status(500).send({ "message": "Erro ao cadastrar medicamento." });
    }
});


//LISTAR - GET
route.get("/", async (request,response) => {
    const medicamento = await service.listMedicamento();

    return response.status(200).send({"message": medicamento});
});


//ATUALIZAR - PUT
route.put("/:id", async (request, response) => {
    try {
        const {nome, apelido_comum, medida, ml_do_remedio, miligramagem_por_comprimido, quantidade_comprimidos, categoria, tarja} = request.body;
        const { id } = request.params; 
        await service.updateMedicamento(id, nome, apelido_comum, medida, ml_do_remedio, miligramagem_por_comprimido, quantidade_comprimidos, categoria, tarja);

        return response.status(200).send({ "message": "Medicamento atualizado com sucesso!" });
    } catch (error) {
        console.error("Erro ao atualizar medicamento:", error);
        return response.status(500).send({ "message": "Erro ao atualizar medicamento." });
    }
});

//DELETE "FALSO"

route.delete("/:idMedicamento", async (request, response) => {
    const {idMedicamento} = request.params;

    await service.deleteMedicamento(idMedicamento);
    return response.status(200).send({"message": "Medicamento excluído com sucesso"})
});


export default route;

/*http://localhost:3306/medicamento*/