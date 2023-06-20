const router = require('express').Router();

const userRoutes = require('./users');
const cardRoutes = require('./cards');

router.get('*', function(req, res){
  return res
          .status(404)
          .send({ message: "Указанная страница не существует." });
});
router.use(userRoutes);
router.use(cardRoutes);

module.exports = router;
