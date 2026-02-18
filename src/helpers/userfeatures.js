import jwt from 'jsonwebtoken';


function generateToken(id_login, user_name) { //a informação que vou esconder, parte azul
    return jwt.sign({infoUser: {id_login, userName: user_name}}, secret, {expiresIn: 60 * 60 * 5});
}

export {sendEmail, generatePassword, generateToken};