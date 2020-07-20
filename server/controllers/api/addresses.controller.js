const mongoose = require('mongoose');
const createError = require('http-errors');
const Joi = require('@hapi/joi');
const _ = require('lodash');

var AddressModel = require('../../models/address.model');
const userModel = require('../../models/user.model');

const addAddressSchema = Joi.object({
  addressName: Joi.string().trim(),
  countryId: Joi.string().trim(),
  stateId: Joi.string().trim(),
  cityId: Joi.string().trim(),
  address: Joi.string().trim(),
  active: Joi.boolean()
});

const updateAddressSchema = Joi.object({
  addressName: Joi.string().trim(),
  countryId: Joi.string().trim(),
  stateId: Joi.string().trim(),
  cityId: Joi.string().trim(),
  address: Joi.string().trim(),
  active: Joi.boolean()
});

module.exports = {
  apiGetAddresses: async function (req, res, next) {
    if (req.user) {
      AddressModel.find({ userId: req.params.userId })
        .then((addresses) => {
          if (!addresses) {
            throw createError(422, 'User have no addresses');
          }
          res.status(200).json({ addresses: addresses });
        })
        .catch(next);
    } else {
      throw createError(401, 'Please Login!');
    }
  },

  apiGetAddress: async function (req, res, next) {
    var addressId = req.params.addressId;

    if (req.user) {
      AddressModel.findOne({ _id: addressId })
        .then((address) => {
          if (!address) {
            throw createError(422, "Can't get address");
          }
          res.status(200).json({ address: address });
        })
        .catch(next);
    } else {
      throw createError(401, 'Please Login!');
    }
  },

  apiGetActiveAddress: async function (req, res, next) {
    if (req.user) {
      AddressModel.find({ userId: req.params.userId })
        .then((addresses) => {
          if (!addresses) {
            throw createError(422, 'User have no addresses');
          }

          var address = addresses.filter((address) => address.active == true)
          res.status(200).json({ address: address.length>0 ? address[0] : null });
        })
        .catch(next);
    } else {
      throw createError(401, 'Please Login!');
    }
  },

  apiAddAddress: (req, res, next) => {
    if (req.user) {
      addAddressSchema
        .validateAsync(req.body, { stripUnknown: true })
        .then((payload) => {
          req.body = payload;
console.log('-- apiAddAddress req.body : ', req.params.userId, req.body)
          newAddress = new AddressModel(req.body);
          newAddress.userId = req.params.userId;

          return newAddress.save();
        })
        .then((address) => {
          return AddressModel.find({ userId: req.params.userId })
          .then((addresses) => {return addresses});
        })
        .then((addresses) => {
          console.log('-- apiAddAddress addresses : ', addresses)
          if (!addresses) {
            throw createError(422, 'User have no addresses');
          }
          return res.status(200).json({ addresses: addresses });
        })
        .catch(next);
    } else {
      throw createError(401, 'Please Login!');
    }
  },

  apiUpdateAddress: (req, res, next) => {    
    var addressId = req.params.addressId;
    console.log('-- apiUpdateActiveAddress start : ', addressId )

    if (req.user) {
      if (_.isEmpty(req.body)) {
        return res.status(200).json({ updatedFields: [] });
      }
      
      updateAddressSchema
        .validateAsync(req.body, { stripUnknown: true })
        .then((payload) => {
          req.body = payload;
          return AddressModel.findOne({_id: addressId})
        })
        .then((address) => {
          console.log('-- apiUpdateAddress address : ', address)
          _.merge(address, req.body);
          return address.save();
        })
        .then((updatedAddress) => {
          return AddressModel.find({ userId: updatedAddress.userId })
          .then((addresses) => {return addresses});
        })
        .then((addresses) => {
          console.log('-- apiUpdateAddress addresses : ', addresses)
          if (!addresses) {
            throw createError(422, 'User have no addresses');
          }
          return res.status(200).json({ addresses: addresses });
        })
        .catch(next);
    }
  },

  apiUpdateActiveAddress: async function (req, res, next) {    
    if (req.user) {
      AddressModel.find({ userId: req.params.userId })
        .then((addresses) => {
          if (!addresses) {
            throw createError(422, 'User have no addresses');
          }

          addresses.map(async (address) => {
            if( address._id == req.params.addressId ){
              address.active = true;
            } else {
              address.active = false;
            }
            await address.save()
          })
          res.status(200).json({ addresses: addresses });
        })
        .catch(next);
    } else {
      throw createError(401, 'Please Login!');
    }
  },

  apiDeleteAddress: (req, res, next) => {
    let addressId;
    addressId = req.params.addressId;
    userId = req.params.userId;

    if (req.user) {
      AddressModel.deleteOne({ _id: addressId })
        .then(() => {
          return AddressModel.find({ foodId: req.params.userId });
        })
        .then((addresses) => {
          if (!addresses) {
            throw createError(422, 'User have no addresses');
          }
          return res.status(200).json({ addresses: addresses });
        })
        .catch(next);
    } else {
      throw createError(401, 'Please Login!');
    }
  },

  preloadTargetAddress: (req, res, next, addressId) => {
    if (!mongoose.Types.ObjectId.isValid(addressId)) {
      return next(createError(422, 'Invalid address ID'));
    }

    AddressModel.findById(addressId)
      .then((targetAddress) => {
        if (!targetAddress) {
          throw createError(422, 'address ID does not exist');
        }
        res.locals.targetAddress = targetAddress;
        next();
      })
      .catch(next);
  },
};
