let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let FoodTransSchema = new Schema(
    {
        title: String,
        desc: String,
        price: Number,
        oldPrice: Number,
        abbr: String,
        foodId: String,
        languageId: { type: Schema.Types.ObjectId, ref: 'language' }
    },
    { timestamps: true }
);

module.exports = mongoose.model('food_trans', FoodTransSchema);
