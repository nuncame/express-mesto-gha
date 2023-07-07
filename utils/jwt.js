const jwt = require('jsonwebtoken');

const JWT_SECRET = 'super-secret-key';

const createToken = (id) => {
  return jwt.sign({ id }, JWT_SECRET, { expiresIn: '7d' });
};

const verifyToken = (token) => {
  const payload = jwt.verify(token, JWT_SECRET);
  return payload;
};

module.exports = {
  createToken,
  verifyToken,
};
