import express from "express";
import service from "../services/userService.js";

const route = express.Router();

// Função para converter data de DD/MM/AAAA para YYYY-MM-DD
function formatarDataBrasileiraParaMySQL(dataBrasileira) {
    const [dia, mes, ano] = dataBrasileira.split('/');
    return `${ano}-${mes}-${dia}`;
}

// LISTAR - GET
route.get("/", async (request, response) => {
    const users = await service.listUser();

    if (users.length < 1) {
        return response.status(204).end();
    }
    return response.status(200).send({ message: users });
});

// CADASTRAR - POST
route.post("/", async (request, response) => {
    let { nome, email, data_nasc, senha } = request.body;

    data_nasc = formatarDataBrasileiraParaMySQL(data_nasc);

    await service.createUser(nome, email, data_nasc, senha);
    return response.status(201).send({ message: "Usuário cadastrado com sucesso" });
});

// TRECHO COM ALTERAÇÃO
route.get("/teste", async (request, response) => {
    const idUser = request.query.idUser;
    const user = await service.getUser(idUser);

    return response.status(200).send({ message: user });
});

// ATUALIZAR - PUT
route.put('/:idUser', async (request, response) => {
    let { nome, email, data_nasc, senha } = request.body;
    const { idUser } = request.params;

    data_nasc = formatarDataBrasileiraParaMySQL(data_nasc);

    await service.updateUser(nome, email, data_nasc, senha, idUser);
    return response.status(200).send({ message: "Dados atualizados com sucesso!" });
});

// DELETE
route.delete('/:idUser', async (request, response) => {
    const { idUser } = request.params;

    await service.deleteUser(idUser);
    return response.status(200).send({ message: "Usuário excluído com sucesso" });
});

export default route;
