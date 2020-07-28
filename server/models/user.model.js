const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const _ = require('lodash');
const { v4: uuidv4 } = require('uuid');
const config = require('../config');

// By defaulf, we don't store oauth accessToken and refreshToken
const providerDataSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: [true, 'Provider userId is required'],
  },
  accessToken: {
    type: String,
  },
  refreshToken: {
    type: String,
  },
  picture: {
    type: String,
  },
});

// Define Schema
const userSchema = new mongoose.Schema(
  {
    firstName: { type: String, trim: true },
    lastName: { type: String, trim: true },
    username: {
      type: String,
      unique: true,
      trim: true,
      lowercase: true,
      required: [true, 'Username is required'],
      match: [
        /^[a-zA-Z0-9.\-_]{4,30}$/,
        'Must be between 4 to 30 characters and may contain only alphanumeric chacracters, hyphen, dot or underscore',
      ],
    },
    email: {
      type: String,
      unique: true,
      trim: true,
      lowercase: true,
      required: [true, 'Email is required'],
      match: [
        /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        'Invalid email',
      ],
    },
    // Do NOT set directly, call user.setPasswordAsync(password)
    hashedPassword: {
      type: String,
    },
    // subId is used to validate JWT token.
    // Do NOT set directly, call user.setSubId().
    subId: {
      type: String,
      unique: true,
    },
    contactEmail: {
      type: String,
    },
    phone: {
      type: String,
    },
    country: { type: String, default: '' },
    ipAddress: {
      type: String,
    },
    loginCount: {
      type: Number,
    },

    status: {
      type: String,
      enum: ['active', 'disabled', 'unverified-email'],
      default: 'active',
      index: true,
    },
    role: {
      type: String,
      enum: ['guest', 'user', 'admin', 'root'],
      default: 'user',
      index: true,
    },
    // The permissions field will allow a normal user to perform
    // admin-like actions.
    // By default, root and admin can do any thing (permissions field is ignored).
    // So, call user.hasPermission(permission) to determine the permission.
    // The rules for updating and deleting are implemented in createXAuthorizationMiddleware middleware.
    permissions: {
      userInsert: { type: Boolean, default: config.defaultPermissions.user.Insert }, // Insert only
      userUpdate: { type: Boolean, default: config.defaultPermissions.user.Update }, // Update and Delete
      userDelete: { type: Boolean, default: config.defaultPermissions.user.Delete }, // Update and Delete
      userRead: { type: Boolean, default: config.defaultPermissions.user.Read }, // Read only
      categoryInsert: { type: Boolean, default: config.defaultPermissions.category.Insert },
      categoryUpdate: { type: Boolean, default: config.defaultPermissions.category.Update },
      categoryDelete: { type: Boolean, default: config.defaultPermissions.category.Delete },
      categoryRead: { type: Boolean, default: config.defaultPermissions.category.Read },
      category_transInsert: { type: Boolean, default: config.defaultPermissions.category_trans.Insert },
      category_transUpdate: { type: Boolean, default: config.defaultPermissions.category_trans.Update },
      category_transDelete: { type: Boolean, default: config.defaultPermissions.category_trans.Delete },
      category_transRead: { type: Boolean, default: config.defaultPermissions.category_trans.Read },
      discountInsert: { type: Boolean, default: config.defaultPermissions.discount.Insert },
      discountUpdate: { type: Boolean, default: config.defaultPermissions.discount.Update },
      discountDelete: { type: Boolean, default: config.defaultPermissions.discount.Delete },
      discountRead: { type: Boolean, default: config.defaultPermissions.discount.Read },
      branchInsert: { type: Boolean, default: config.defaultPermissions.branch.Insert },
      branchUpdate: { type: Boolean, default: config.defaultPermissions.branch.Update },
      branchDelete: { type: Boolean, default: config.defaultPermissions.branch.Delete },
      branchRead: { type: Boolean, default: config.defaultPermissions.branch.Read },
      foodInsert: { type: Boolean, default: config.defaultPermissions.food.Insert },
      foodUpdate: { type: Boolean, default: config.defaultPermissions.food.Update },
      foodDelete: { type: Boolean, default: config.defaultPermissions.food.Delete },
      foodRead: { type: Boolean, default: config.defaultPermissions.food.Read },
      food_transInsert: { type: Boolean, default: config.defaultPermissions.food_trans.Insert },
      food_transUpdate: { type: Boolean, default: config.defaultPermissions.food_trans.Update },
      food_transDelete: { type: Boolean, default: config.defaultPermissions.food_trans.Delete },
      food_transRead: { type: Boolean, default: config.defaultPermissions.food_trans.Read },
      historyInsert: { type: Boolean, default: config.defaultPermissions.history.Insert },
      historyUpdate: { type: Boolean, default: config.defaultPermissions.history.Update },
      historyDelete: { type: Boolean, default: config.defaultPermissions.history.Delete },
      historyRead: { type: Boolean, default: config.defaultPermissions.history.Read },
      languageInsert: { type: Boolean, default: config.defaultPermissions.language.Insert },
      languageUpdate: { type: Boolean, default: config.defaultPermissions.language.Update },
      languageDelete: { type: Boolean, default: config.defaultPermissions.language.Delete },
      languageRead: { type: Boolean, default: config.defaultPermissions.language.Read },
      orderInsert: { type: Boolean, default: config.defaultPermissions.order.Insert },
      orderUpdate: { type: Boolean, default: config.defaultPermissions.order.Update },
      orderDelete: { type: Boolean, default: config.defaultPermissions.order.Delete },
      orderRead: { type: Boolean, default: config.defaultPermissions.order.Read },
      order_clientInsert: { type: Boolean, default: config.defaultPermissions.order_client.Insert },
      order_clientUpdate: { type: Boolean, default: config.defaultPermissions.order_client.Update },
      order_clientDelete: { type: Boolean, default: config.defaultPermissions.order_client.Delete },
      order_clientRead: { type: Boolean, default: config.defaultPermissions.order_client.Read },
      subscribeInsert: { type: Boolean, default: config.defaultPermissions.subscribe.Insert },
      subscribeUpdate: { type: Boolean, default: config.defaultPermissions.subscribe.Update },
      subscribeDelete: { type: Boolean, default: config.defaultPermissions.subscribe.Delete },
      subscribeRead: { type: Boolean, default: config.defaultPermissions.subscribe.Read },
      transactionInsert: { type: Boolean, default: config.defaultPermissions.transaction.Insert },
      transactionUpdate: { type: Boolean, default: config.defaultPermissions.transaction.Update },
      transactionDelete: { type: Boolean, default: config.defaultPermissions.transaction.Delete },
      transactionRead: { type: Boolean, default: config.defaultPermissions.transaction.Read },
      commentInsert: { type: Boolean, default: config.defaultPermissions.comment.Insert },
      commentUpdate: { type: Boolean, default: config.defaultPermissions.comment.Update },
      commentDelete: { type: Boolean, default: config.defaultPermissions.comment.Delete },
      commentRead: { type: Boolean, default: config.defaultPermissions.comment.Read },
      addressInsert: { type: Boolean, default: config.defaultPermissions.address.Insert },
      addressUpdate: { type: Boolean, default: config.defaultPermissions.address.Update },
      addressDelete: { type: Boolean, default: config.defaultPermissions.address.Delete },
      addressRead: { type: Boolean, default: config.defaultPermissions.address.Read },
      cardInsert: { type: Boolean, default: config.defaultPermissions.card.Insert },
      cardUpdate: { type: Boolean, default: config.defaultPermissions.card.Update },
      cardDelete: { type: Boolean, default: config.defaultPermissions.card.Delete },
      cardRead: { type: Boolean, default: config.defaultPermissions.card.Read },
      settingInsert: { type: Boolean, default: config.defaultPermissions.setting.Insert },
      settingUpdate: { type: Boolean, default: config.defaultPermissions.setting.Update },
      settingDelete: { type: Boolean, default: config.defaultPermissions.setting.Delete },
      settingRead: { type: Boolean, default: config.defaultPermissions.setting.Read },
      // Example: permissions for ExamplePost model should be defined as below:
      // examplePostInsert: { type: Boolean, default: false }, // Insert only
      // examplePostUpdate: { type: Boolean, default: false }, // Update and Delete
      // examplePostDelete: { type: Boolean, default: false }, // Update and Delete
      // examplePostRead: { type: Boolean, default: true }, // Read only
    },
    // token for veryfication email or reset password purpose, NOT JWT token
    // Do NOT set directly, call user.setToken(tokenPurpose) user.clearToken()
    // to set and clear token and tokenPurpose
    token: { type: String, index: true },
    tokenPurpose: { type: String, enum: ['verify-email', 'reset-password'] },
    provider: {
      local: {
        type: providerDataSchema,
      },
      google: {
        type: providerDataSchema,
      },
      facebook: {
        type: providerDataSchema,
      },
    },
  },
  { timestamps: true }
);

userSchema.virtual('fullName').get(function () {
  return `${this.firstName} ${this.lastName}`;
});

/**
 * @returns {object} The user profile object without sensitive info such as hashed password
 */
userSchema.methods.toJsonFor = function (user) {
  const userObj = this.toObject();
  if (user && (user.hasPermission('userRead') || user.id === this.id)) {
    const provider = _.mapValues(userObj.provider, (p) => {
      return _.pick(p, ['userId', 'picture']);
    });
    return {
      id: userObj._id,
      firstName: userObj.firstName,
      lastName: userObj.lastName,
      username: userObj.username,
      phone: userObj.phone,
      email: userObj.email,
      status: userObj.status,
      role: userObj.role,
      permissions: userObj.permissions,
      provider,
      country: userObj.country,
      state: userObj.state,
      city: userObj.city,
      address: userObj.address,
      createdAt: userObj.createdAt,
      updatedAt: userObj.updatedAt,
    };
  } else {
    // public profile
    return {
      id: userObj._id,
      username: userObj.username,
      firstName: userObj.firstName,
      lastName: userObj.lastName,
      phone: userObj.phone,
      country: userObj.country,
      state: userObj.state,
      city: userObj.city,
      address: userObj.address,
      createdAt: userObj.createdAt,
    };
  }
};

/**
 * Set subId to this user.
 * Invalidate all existing JWT tokens
 *
 */
userSchema.methods.setSubId = function () {
  this.subId = new mongoose.Types.ObjectId().toHexString();
};

/**
 * Set password to this user
 * The password will be hashed and assigned to hashedPassword field
 *
 * Call this function when updating the user password
 *
 * @param {Promise} password Resolve with null value
 */
userSchema.methods.setPasswordAsync = function (password) {
  const saltRounds = 10;
  return bcrypt.hash(password, saltRounds).then((hash) => {
    this.hashedPassword = hash;
  });
};

/**
 * Compare candidate password with the stored one
 *
 * @returns {Promise} Resolve with a boolean value
 */
userSchema.methods.comparePasswordAsync = function (candidatePassword) {
  if (!this.hashedPassword) {
    return Promise.resolve(false);
  }
  return bcrypt.compare(candidatePassword, this.hashedPassword);
};

/**
 * Generate JWT token for authentication
 *
 * @returns {object} An object contains JWT token and expiresAt (seconds) property
 */
userSchema.methods.generateJwtToken = function () {
  const iat = Math.floor(Date.now() / 1000);
  const expiresAt = iat + config.jwt.expiresIn;
  const token = jwt.sign(
    { sub: this.subId, userId: this._id, iat },
    config.jwt.secret,
    {
      algorithm: config.jwt.algorithm,
      expiresIn: config.jwt.expiresIn, // seconds
    }
  );
  return { token, expiresAt };
};

/**
 * Set token and token purpose field based on given token purpose
 *
 * @param {string} purpose The purpose of the token.
 */
userSchema.methods.setToken = function (purpose) {
  this.token = uuidv4();
  this.tokenPurpose = purpose;
};

/**
 * Clear token and token purpose field
 */
userSchema.methods.clearToken = function () {
  this.token = undefined;
  this.tokenPurpose = undefined;
};

/**
 * Determine whether this user has a permission
 * based on user role and user's permissions properties
 *
 * @param {string} permission A permission
 * @returns {boolean} true if this user has the given permission.
 * Otherwise, false
 */
userSchema.methods.hasPermission = function (permission) {
  if (this.role === 'admin' || this.role === 'root') {
    return true;
  }
  return !!this.permissions[permission];
};

module.exports = mongoose.model('user', userSchema);
