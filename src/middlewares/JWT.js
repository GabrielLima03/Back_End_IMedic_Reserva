import jwt from 'jsonwebtoken';

function verifyJWT(req, res, next) {
    const secret = 'Senh@123456'; // Use variável de ambiente em produção!

    const authHeader = req.headers.authorization;

    // Verifica se o token foi enviado
    if (!authHeader) {
        return res.status(401).json({ message: 'Token não informado.' });
    }

    // authHeader deve ser no formato: "Bearer <token>"
    const parts = authHeader.split(' '); // ⚠️ ERRO AQUI NO SEU: você usou '' (string vazia)

    if (parts.length !== 2) {
        return res.status(401).json({ message: 'Token malformado.' });
    }

    const [scheme, token] = parts;

    if (!/^Bearer$/i.test(scheme)) {
        return res.status(401).json({ message: 'Token com esquema inválido.' });
    }

    // Verifica se o token é válido
    jwt.verify(token, secret, (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: 'Token inválido ou expirado.' });
        }

        // Armazena os dados decodificados no request (útil para saber quem é o usuário)
        req.infoUser = decoded.infoUser;

        return next(); // ✅ só chega aqui se tudo deu certo
    });
}

export { verifyJWT };
