let mongoose = require('mongoose');
let mongoosePaginate = require('mongoose-paginate-v2');
let Schema = mongoose.Schema;

let FoodSchema = new Schema(
    {
        sku: String,
        image: String,
        folder: String,
        qty: Number,
        categoryId: [{ type: Schema.Types.ObjectId, ref: 'category' }],
        vendorId: String,
        inSlider: Boolean,
        isFeature: Boolean,
        status: Boolean,
        viewCount: Number,
        sellCount: Number,
        rating: Number,
        trans: [{ type: Schema.Types.ObjectId, ref: 'food_trans' }]
    },
    { timestamps: true }
);

FoodSchema.plugin(mongoosePaginate);
module.exports = mongoose.model('food', FoodSchema);
