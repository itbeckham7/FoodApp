const fspath = require('path');

/**
 * Default configuration
 */
let defaultConfig = {
  allowCreatorModify: {
    user: false, // Model name in camel case
    // examplePost: true
  },
  app: {
    name: 'foodapp', // TODO: Lowercase, URL compatible name
    title: 'Food App', // TODO: Human friendly name
  },
  auth: {
    verifyEmail: false, // If true, require email verification when signing up
    resetPassword: false, // If true, be able to reset password via email
  },
  compression: {
    enabled: false,
    options: null, // See https://www.npmjs.com/package/compression
  },
  cors: {
    enabled: true,
    options: null, // See https://www.npmjs.com/package/cors
  },
  email: {
    from: 'itbeckham7@hotmail.com', // TODO
    to: '',
    signature: 'itbeckham7', // TODO
  },
  node_mail: {
    mail_account: "itbeckham7@gmail.com", //Gmail
    password: ""
  },
  jwt: {
    secret: 'This will be overriden by environment variable JWT_SECRET',
    algorithm: 'HS512',
    expiresIn: 60 * 24 * 60 * 60, // seconds
  },
  helmet: {
    enabled: true,
    options: {}, // See https://www.npmjs.com/package/helmet
  },
  morgan: {
    enabled: true,
    format: 'dev', // TODO: possible values: combined, common, dev, short, tiny
    options: null, // See https://www.npmjs.com/package/morgan
  },
  mongo: {
    uri: 'This will be overriden by environment variable MONGO_URI',
    testUri: 'mongodb://localhost:27017/mern_test',
  },
  sendgrid: {
    apiKey: 'This will be overriden by environment variable SENDGRID_API_KEY',
  },
  server: {
    host: 'This will be overriden by environment variable SERVER_HOST',
    port: 'This will be overriden by environment variable SERVER_PORT',
    publicUrl:
      'This will be overriden by environment variable SERVER_PUBLIC_URL',
  },
  paths: {
    root: fspath.normalize(`${__dirname}/..`),
  },
  oauth: {
    storeTokens: false, // If true, the OAuth accessToken and refreshToken will be stored in database
    google: {
      clientId:
        'This will be overriden by environment variable GOOGLE_CLIENT_ID',
      clientSecret:
        'This will be overriden by environment variable GOOGLE_CLIENT_SECRET',
    },
    facebook: {
      clientId:
        'This will be overriden by environment variable FACEBOOK_APP_ID',
      clientSecret:
        'This will be overriden by environment variable FACEBOOK_APP_SECRET',
    },
  },
  seed: {
    logging: true,
    users: [],
  },
  default_password: 'password',
  permissions: [
    {
      model: 'food',
      title: 'Food Permission',
      actions: [
        {action: 'Insert', title: 'Add Food'},
        {action: 'Update', title: 'Edit Food'},
        {action: 'Delete', title: 'Delete Food'},
        {action: 'Read', title: 'Read Food'},
      ]
    },
    {
      model: 'category',
      title: 'Category Permission',
      actions: [
        {action: 'Insert', title: 'Add Category'},
        {action: 'Update', title: 'Edit Category'},
        {action: 'Delete', title: 'Delete Category'},
        {action: 'Read', title: 'Read Category'},
      ]
    },
    {
      model: 'order',
      title: 'Order Permission',
      actions: [
        {action: 'Update', title: 'Edit Order'},
        {action: 'Delete', title: 'Delete Order'},
        {action: 'Read', title: 'Read Order'},
      ]
    },
    {
      model: 'discount',
      title: 'Discount Permission',
      actions: [
        {action: 'Insert', title: 'Add Discount'},
        {action: 'Update', title: 'Edit Discount'},
        {action: 'Delete', title: 'Delete Discount'},
        {action: 'Read', title: 'Read Discount'},
      ]
    },
    {
      model: 'branch',
      title: 'Branch Permission',
      actions: [
        {action: 'Insert', title: 'Add Branch'},
        {action: 'Update', title: 'Edit Branch'},
        {action: 'Delete', title: 'Delete Branch'},
        {action: 'Read', title: 'Read Branch'},
      ]
    },
    {
      model: 'user',
      title: 'User Permission',
      actions: [
        {action: 'Insert', title: 'Add User'},
        {action: 'Update', title: 'Edit User'},
        {action: 'Delete', title: 'Delete User'},
        {action: 'Read', title: 'Read User'},
      ]
    },
  ],
  defaultPermissions: {
    user:           { Insert: false, Update: false, Delete: false, Read: false },
    category:       { Insert: false, Update: false, Delete: false, Read: true },
    category_trans: { Insert: false, Update: false, Delete: false, Read: true },
    discount:       { Insert: false, Update: false, Delete: false, Read: true },
    branch:         { Insert: false, Update: false, Delete: false, Read: true },
    food:           { Insert: false, Update: false, Delete: false, Read: true },
    food_trans:     { Insert: false, Update: false, Delete: false, Read: true },
    history:        { Insert: false, Update: false, Delete: false, Read: true },
    language:       { Insert: false, Update: false, Delete: false, Read: true },
    order:          { Insert: true, Update: false, Delete: false, Read: true },
    order_client:   { Insert: false, Update: false, Delete: false, Read: true },
    subscribe:      { Insert: false, Update: false, Delete: false, Read: true },
    transaction:    { Insert: false, Update: false, Delete: false, Read: true },
    comment:        { Insert: true, Update: true, Delete: true, Read: true },
    address:        { Insert: true, Update: true, Delete: true, Read: true },
    card:           { Insert: true, Update: true, Delete: true, Read: true },
    setting:        { Insert: false, Update: false, Delete: false, Read: true },
  },
  defaultAdminPermissions: {
    user:           { Insert: false, Update: false, Delete: false, Read: false },
    category:       { Insert: false, Update: false, Delete: false, Read: true },
    category_trans: { Insert: true, Update: true, Delete: true, Read: true },
    discount:       { Insert: false, Update: false, Delete: false, Read: true },
    branch:         { Insert: false, Update: false, Delete: false, Read: true },
    food:           { Insert: false, Update: false, Delete: false, Read: true },
    food_trans:     { Insert: true, Update: true, Delete: true, Read: true },
    history:        { Insert: false, Update: false, Delete: false, Read: true },
    language:       { Insert: false, Update: false, Delete: false, Read: true },
    order:          { Insert: true, Update: false, Delete: false, Read: true },
    order_client:   { Insert: false, Update: false, Delete: false, Read: true },
    subscribe:      { Insert: false, Update: false, Delete: false, Read: true },
    transaction:    { Insert: false, Update: false, Delete: false, Read: true },
    comment:        { Insert: true, Update: true, Delete: true, Read: true },
    address:        { Insert: true, Update: true, Delete: true, Read: true },
    card:           { Insert: true, Update: true, Delete: true, Read: true },
    setting:        { Insert: false, Update: false, Delete: false, Read: true },
  }
};

module.exports = defaultConfig;
