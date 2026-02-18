import jwt from 'jsonwebtoken';

function generatePassword() {
    const key = (Math.random() + 1).toString(36).substring(2).substring(0, 10);
    const newPassword = key.replace('n', '@').replace('w', '!').replace('i', '#').replace('t', '$').
    replace('a','*').replace('r','%');

    return newPassword;
}

function generatedToken (id_login, user_name){
    const secret = "Senh@123456";
    return jwt.sign({infoUser: {id_login, userName: user_name}}, secret, {expiresIn: 60 * 60* 5}

    );
}


function generateToken(id_login, user_name) { //a informação que vou esconder, parte azul
    return jwt.sign({infoUser: {id_login, userName: user_name}}, secret, {expiresIn: 60 * 60 * 5});
}

export {generatePassword, generateToken};


//Exclui o userfeatures pois o Luis durante a aula de PW falou que não tem a necessidade de ter o arquivo, 
// pode colocar tudo em um unico arquivo