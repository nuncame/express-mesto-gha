/* eslint-disable no-useless-escape */
const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  getCards, createCard, deleteCard, likeCard, dislikeCard,
} = require('../controllers/cards');

router.get('/cards', getCards);

router.post('/cards', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().pattern(/https?:\/\/(www\.)?[a-zA-Z0-9-\._~:\/\?#[\]@!\$&'()\*\+,;=]{2,256}\.[a-z]{2,4}\b([a-zA-Z0-9-\._~:\/\?#[\]@!\$&'()\*\+,;=]*)/),
  }).unknown(true),
}), createCard);

router.delete('/cards/:cardId', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().length(24),
  }).unknown(true),
}), deleteCard);

router.put('/cards/:cardId/likes', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().length(24),
  }).unknown(true),
}), likeCard);

router.delete('/cards/:cardId/likes', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().length(24),
  }).unknown(true),
}), dislikeCard);

module.exports = router;
