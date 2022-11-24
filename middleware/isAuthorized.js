const jwt = require('jsonwebtoken');

function isAuthorized(req, res, next) {
  const { authorization } = req.headers;

  if (!authorization) //Devolve a msg Unauthorized (401)
    return res.status(401).json({ message: 'Sem token' });

  jwt.verify(authorization, process.env.SECRETKEY, (err, decoded) => {
    console.log(decoded);
    if (err) return res.status(401).json({ message: 'Token inválido' });

    req.userId = decoded.userId; // Seta um atributo na requisição
    return next(); // Chama o próximo processo da fila
  })
}

module.exports = isAuthorized;