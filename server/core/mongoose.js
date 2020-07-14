const mongoose = require('mongoose');
const config = require('../config/index');
const seed = require('./seed');

require('../models');

mongoose.Promise = global.Promise;

mongoose.set('useCreateIndex', true); // FIXME: fix deprecation warnings
mongoose.set('useNewUrlParser', true); // FIXME: fix deprecation warnings
mongoose.set('useUnifiedTopology', true); // FIXME: fix deprecation warnings

if (config.env !== 'test') {
  mongoose.connect(config.mongo.uri);
  mongoose.connection.once('open', async () => {
    await seed.createUsers(config.seed.users);
    await seed.createLanguages();
    await seed.createDiscounts();
    await seed.createCategories();
    await seed.createFoods();
  });
} else {
  mongoose.connect(config.mongo.testUri);
}

mongoose.connection.on('error', () => {
  console.log('[-] Unable to connect to Mongo instance');
});
