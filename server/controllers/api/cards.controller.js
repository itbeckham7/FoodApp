const mongoose = require('mongoose');
const createError = require('http-errors');
const Joi = require('@hapi/joi');
const _ = require('lodash');

var CardModel = require('../../models/card.model');
const userModel = require('../../models/user.model');

const addCardSchema = Joi.object({
  cardType: Joi.string().trim(),
  holderName: Joi.string().trim(),
  cardNumber: Joi.string().trim(),
  expireDate: Joi.string().trim(),
  cvv: Joi.string().trim(),
  active: Joi.boolean()
});

const updateCardSchema = Joi.object({
  cardType: Joi.string().trim(),
  holderName: Joi.string().trim(),
  cardNumber: Joi.string().trim(),
  expireDate: Joi.string().trim(),
  cvv: Joi.string().trim(),
  active: Joi.boolean()
});

module.exports = {
  apiGetCards: async function (req, res, next) {
    if (req.user) {
      CardModel.find({ userId: req.params.userId })
        .then((cards) => {
          if (!cards) {
            throw createError(422, 'User have no cards');
          }
          res.status(200).json({ cards: cards });
        })
        .catch(next);
    } else {
      throw createError(401, 'Please Login!');
    }
  },

  apiGetCard: async function (req, res, next) {
    var cardId = req.params.cardId;

    if (req.user) {
      CardModel.findOne({ _id: cardId })
        .then((card) => {
          if (!card) {
            throw createError(422, "Can't get card");
          }
          res.status(200).json({ card: card });
        })
        .catch(next);
    } else {
      throw createError(401, 'Please Login!');
    }
  },

  apiGetActiveCard: async function (req, res, next) {
    if (req.user) {
      CardModel.find({ userId: req.params.userId })
        .then((cards) => {
          if (!cards) {
            throw createError(422, 'User have no cards');
          }

          var card = cards.filter((card) => card.active == true)
          res.status(200).json({ card: card.length>0 ? card[0] : null });
        })
        .catch(next);
    } else {
      throw createError(401, 'Please Login!');
    }
  },

  apiAddCard: (req, res, next) => {
    if (req.user) {
      addCardSchema
        .validateAsync(req.body, { stripUnknown: true })
        .then((payload) => {
          req.body = payload;
console.log('-- apiAddCard req.body : ', req.params.userId, req.body)
          newCard = new CardModel(req.body);
          newCard.userId = req.params.userId;

          return newCard.save();
        })
        .then((card) => {
          return CardModel.find({ userId: req.params.userId })
          .then((cards) => {return cards});
        })
        .then((cards) => {
          console.log('-- apiAddCard cards : ', cards)
          if (!cards) {
            throw createError(422, 'User have no cards');
          }
          return res.status(200).json({ cards: cards });
        })
        .catch(next);
    } else {
      throw createError(401, 'Please Login!');
    }
  },

  apiUpdateCard: (req, res, next) => {    
    var cardId = req.params.cardId;
    console.log('-- apiUpdateCard start : ', cardId )

    if (req.user) {
      if (_.isEmpty(req.body)) {
        return res.status(200).json({ updatedFields: [] });
      }
      
      updateCardSchema
        .validateAsync(req.body, { stripUnknown: true })
        .then((payload) => {
          req.body = payload;
          return CardModel.findOne({_id: cardId})
        })
        .then((card) => {
          console.log('-- apiUpdateCard card : ', card)
          _.merge(card, req.body);
          return card.save();
        })
        .then((updatedCard) => {
          return CardModel.find({ userId: updatedCard.userId })
          .then((cards) => {return cards});
        })
        .then((cards) => {
          console.log('-- apiUpdateCard cards : ', cards)
          if (!cards) {
            throw createError(422, 'User have no cards');
          }
          return res.status(200).json({ cards: cards });
        })
        .catch(next);
    }
  },

  apiUpdateActiveCard: async function (req, res, next) {    
    if (req.user) {
      CardModel.find({ userId: req.params.userId })
        .then((cards) => {
          if (!cards) {
            throw createError(422, 'User have no cards');
          }

          cards.map(async (card) => {
            if( card._id == req.params.cardId ){
              card.active = true;
            } else {
              card.active = false;
            }
            await card.save()
          })
          res.status(200).json({ cards: cards });
        })
        .catch(next);
    } else {
      throw createError(401, 'Please Login!');
    }
  },

  apiDeleteCard: (req, res, next) => {
    let cardId;
    cardId = req.params.cardId;
    userId = req.params.userId;

    if (req.user) {
      CardModel.deleteOne({ _id: cardId })
        .then(() => {
          return CardModel.find({ foodId: req.params.userId });
        })
        .then((cards) => {
          if (!cards) {
            throw createError(422, 'User have no cards');
          }
          return res.status(200).json({ cards: cards });
        })
        .catch(next);
    } else {
      throw createError(401, 'Please Login!');
    }
  },

  preloadTargetCard: (req, res, next, cardId) => {
    if (!mongoose.Types.ObjectId.isValid(cardId)) {
      return next(createError(422, 'Invalid card ID'));
    }

    CardModel.findById(cardId)
      .then((targetCard) => {
        if (!targetCard) {
          throw createError(422, 'card ID does not exist');
        }
        res.locals.targetCard = targetCard;
        next();
      })
      .catch(next);
  },
};
