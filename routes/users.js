const router = require('express').Router();
const { createUser } = require('../controllers/users');

router.get('/users', (req, res) => {
  res.status(200);
  res.send(console.log('получили юзеров'));
});

// router.get('/users/:userId', )
router.post('/users', createUser);

module.exports = router;
