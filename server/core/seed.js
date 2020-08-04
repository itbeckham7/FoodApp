const mongoose = require('mongoose');
const chalk = require('chalk');
const config = require('../config/index');

const { usersSeed } = require('../seed/users')
const { languageSeed } = require('../seed/languages')
const { discountSeed } = require('../seed/discounts')
const { branchSeed } = require('../seed/branches')
const { categorySeed, categoryTransSeed } = require('../seed/categories')
const { foodSeed, foodTransSeed } = require('../seed/foods')
const { settingSeed } = require('../seed/settings')
var languageIds = [];
var categoryIds = [];
/**
 * @function createUsers
 * Seed the given list of users
 *
 * @param {string} users The array of user info to be created
 * @returns {Promise} Resolve with a list of newly added users
 */
module.exports.createUsers = () => {

  const User = mongoose.model('user');
  let addedUsers = [];

  return usersSeed
    .reduce((sequence, userInfo) => {
      return sequence
        .then(() => {
          return User.findOne({
            $or: [{ username: userInfo.username }, { email: userInfo.email }],
          });
        })
        .then((existingUser) => {
          if (existingUser) {
            throw new Error(
              chalk.yellow(
                `[-] [Warning] Database seeding: Email (${userInfo.email}) or username (${userInfo.username}) already in use.`
              )
            );
          }
          const user = new User(userInfo);
          user.setSubId();
          user.provider.local = {
            userId: user._id,
            picture: userInfo.picture
          };
          return user.setPasswordAsync(userInfo.password).then(() => {
            return user.save();
          });
        })
        .then((user) => {
          if (config.seed.logging) {
            console.log(
              chalk.green(
                `[+] Database Seeding: A new user added (${userInfo.username} - ${userInfo.email} - ${userInfo.password})`
              )
            );
          }
          addedUsers.push(user);
        })
        .catch((err) => {
          if (config.seed.logging) {
            console.log(err.message);
          }
        });
    }, Promise.resolve())
    .then(() => Promise.resolve(addedUsers));
};



module.exports.createLanguages = () => {
  const Language = mongoose.model('language');
  let addedLanguages = [];

  return languageSeed
    .reduce((sequence, languageInfo) => {
      return sequence
        .then(() => {
          return Language.findOne({ abbr: languageInfo.abbr });
        })
        .then((existingLanguage) => {
          if (existingLanguage) {
            throw new Error(
              chalk.yellow(
                `[-] [Warning] Database seeding: Abbr (${languageInfo.abbr}) already in use.`
              )
            );
          }
          const language = new Language(languageInfo);

          return language.save();
        })
        .then((language) => {
          if (config.seed.logging) {
            console.log(
              chalk.green(
                `[+] Database Seeding: A new language added (${languageInfo.abbr})`
              )
            );
          }
          addedLanguages.push(language);
          languageIds[language.abbr] = language._id;
        })
        .catch((err) => {
          if (config.seed.logging) {
            console.log(err.message);
          }
        });
    }, Promise.resolve())
    .then(() => Promise.resolve(addedLanguages));
};



module.exports.createDiscounts = () => {
  const Discount = mongoose.model('discount');
  let addedDiscounts = [];

  return discountSeed
    .reduce((sequence, discountInfo) => {
      return sequence
        .then(() => {
          return Discount.findOne({ code: discountInfo.code });
        })
        .then((existingDiscount) => {
          if (existingDiscount) {
            throw new Error(
              chalk.yellow(
                `[-] [Warning] Database seeding: Code (${discountInfo.code}) already in use.`
              )
            );
          }
          const discount = new Discount(discountInfo);

          return discount.save();
        })
        .then((discount) => {
          if (config.seed.logging) {
            console.log(
              chalk.green(
                `[+] Database Seeding: A new discount added (${discountInfo.code})`
              )
            );
          }
          addedDiscounts.push(discount);
        })
        .catch((err) => {
          if (config.seed.logging) {
            console.log(err.message);
          }
        });
    }, Promise.resolve())
    .then(() => Promise.resolve(addedDiscounts));
};



module.exports.createBranches = () => {
  const Branch = mongoose.model('branch');
  let addedBranches = [];

  return branchSeed
    .reduce((sequence, branchInfo) => {
      return sequence
        .then(() => {
          return Branch.findOne({ code: branchInfo.code });
        })
        .then((existingBranch) => {
          if (existingBranch) {
            throw new Error(
              chalk.yellow(
                `[-] [Warning] Database seeding: Code (${branchInfo.code}) already in use.`
              )
            );
          }
          const branch = new Branch(branchInfo);

          return branch.save();
        })
        .then((branch) => {
          if (config.seed.logging) {
            console.log(
              chalk.green(
                `[+] Database Seeding: A new branch added (${branchInfo.code})`
              )
            );
          }
          addedBranches.push(branch);
        })
        .catch((err) => {
          if (config.seed.logging) {
            console.log(err.message);
          }
        });
    }, Promise.resolve())
    .then(() => Promise.resolve(addedBranches));
};



module.exports.createCategories = () => {
  const Category = mongoose.model('category');
  const CategoryTrans = mongoose.model('category_trans');
  let addedCategories = [];

  return categorySeed
    .reduce((sequence, categoryInfo) => {
      return sequence
        .then(() => {
          return Category.findOne({ slug: categoryInfo.slug });
        })
        .then(async (existingCategory) => {
          if (existingCategory) {
            throw new Error(
              chalk.yellow(
                `[-] [Warning] Database seeding: Slug (${categoryInfo.slug}) already in use.`
              )
            );
          }
          const category = new Category(categoryInfo);

          if (category.slug) {
            for (var i = 0; i < categoryTransSeed.length; i++) {
              if (categoryTransSeed[i].slug == category.slug) {
                let categoryTransInfo = {
                  name: categoryTransSeed[i].name,
                  abbr: categoryTransSeed[i].abbr,
                  categoryId: category._id,
                }

                let categoryTrans = new CategoryTrans(categoryTransInfo);
                categoryTrans.save();

                if (!category.trans) category.trans = [];
                category.trans.push(categoryTrans._id);

                categoryIds[category.slug] = category._id;
                await category.save();
              }
            }
          }

          return category;
        })
        .then((category) => {
          if (config.seed.logging) {
            console.log(
              chalk.green(
                `[+] Database Seeding: A new category added (${categoryInfo.slug})`
              )
            );
          }
          addedCategories.push(category);
        })
        .catch((err) => {
          if (config.seed.logging) {
            console.log(err.message);
          }
        });
    }, Promise.resolve())
    .then(() => Promise.resolve(addedCategories));
};



module.exports.createFoods = () => {
  const Food = mongoose.model('food');
  const FoodTrans = mongoose.model('food_trans');
  let addedFoods = [];

  return foodSeed
    .reduce((sequence, foodInfo) => {
      return sequence
        .then(() => {
          return Food.findOne({ sku: foodInfo.sku });
        })
        .then(async (existingFood) => {
          if (existingFood) {
            throw new Error(
              chalk.yellow(
                `[-] [Warning] Database seeding: SKU (${foodInfo.sku}) already in use.`
              )
            );
          }
          
          foodInfo.categoryId = categoryIds[foodInfo.categoryId]
          const food = new Food(foodInfo);

          if (food.sku) {
            for (var i = 0; i < foodTransSeed.length; i++) {
              if (foodTransSeed[i].sku == food.sku) {
                let foodTransInfo = {
                  title: foodTransSeed[i].title,
                  desc: foodTransSeed[i].desc,
                  basicDesc: foodTransSeed[i].basicDesc,
                  price: foodTransSeed[i].price,
                  oldPrice: foodTransSeed[i].oldPrice,
                  abbr: foodTransSeed[i].abbr,
                  foodId: food._id,
                  languageId: languageIds[foodTransSeed[i].abbr]
                }

                let foodTrans = new FoodTrans(foodTransInfo);
                foodTrans.save();

                if (!food.trans) food.trans = [];
                food.trans.push(foodTrans._id);

                await food.save();
              }
            }
          }

          return food;
        })
        .then((food) => {
          if (config.seed.logging) {
            console.log(
              chalk.green(
                `[+] Database Seeding: A new food added (${foodInfo.sku})`
              )
            );
          }
          addedFoods.push(food);
        })
        .catch((err) => {
          if (config.seed.logging) {
            console.log(err.message);
          }
        });
    }, Promise.resolve())
    .then(() => Promise.resolve(addedFoods));
};



module.exports.createSettings = () => {
  const Setting = mongoose.model('setting');
  let addedSettings = [];

  return settingSeed
    .reduce((sequence, settingInfo) => {
      return sequence
        .then(() => {
          return Setting.find();
        })
        .then((existingSetting) => {
          if (existingSetting && existingSetting.length > 0) {
            throw new Error(
              chalk.yellow(
                `[-] [Warning] Database seeding: settings already in use.`
              )
            );
          }
          const setting = new Setting(settingInfo);

          return setting.save();
        })
        .then((setting) => {
          if (config.seed.logging) {
            console.log(
              chalk.green(
                `[+] Database Seeding: A new setting added (${settingInfo.code})`
              )
            );
          }
          addedSettings.push(setting);
        })
        .catch((err) => {
          if (config.seed.logging) {
            console.log(err.message);
          }
        });
    }, Promise.resolve())
    .then(() => Promise.resolve(addedSettings));
};