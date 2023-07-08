const { verifyToken } = require('../utils/jwt');
const UnauthorizedError = require('../errors/unathorized-err');
const ForbiddenError = require('../errors/forbidden-err');

const authorize = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith('Bearer ')) {
    next(new UnauthorizedError('Необходима авторизация'));
  }
  let payload;

  try {
    const token = authorization.replace('Bearer ', '');
    payload = verifyToken(token);
  } catch (err) {
    next(new ForbiddenError('Отказано в доступе'));
  }

  req.user = payload;
  next();
  return false;
};

module.exports = authorize;
