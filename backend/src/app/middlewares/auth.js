const jwt = require('jsonwebtoken');
const authConfig = require('../../../config/auth.json')

module.exports = (req, res, netx) => {
const authHeader = req.headers.authorization;

if (!authHeader) // Se não tiver TOKEN
    return res.status(401).send( { error: 'O token não foi informado.'} );

const parts = authHeader.split(' '); //divide o token em duas partes

if (!parts.lenght === 2)  // se o token não tiver duas partes
    return res.status(401).send({ error: 'Erro no Token'} );

const [scheme, token] = parts;

if(!/^Bearer$/i.test(scheme)) //verificando se token não tem a palavra Bearer
    return res.status(401).send({ error: 'Token mal formado' });

jwt.verify(token, authConfig.secret, (err, decoded) => {
    if(err) 
    return res.status(401).send( {error: 'Token inválido'});

    req.userId = decoded.id;
    return netx();
});


}; 