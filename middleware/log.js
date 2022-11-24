function log(req, res, next) {
  console.log("Alguém está acessando a API!");
  return next();
}

module.exports = log;