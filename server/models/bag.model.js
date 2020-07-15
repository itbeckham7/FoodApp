let mongoose = require('mongoose');
let mongoosePaginate = require('mongoose-paginate-v2');
let Schema = mongoose.Schema;

let BagSchema = new Schema(
    {
        foodId: [{ type: Schema.Types.ObjectId, ref: 'food' }],
        qty: Number,
        userId: [{ type: Schema.Types.ObjectId, ref: 'user' }],
    },
    { timestamps: true }
);

BagSchema.plugin(mongoosePaginate);
module.exports = mongoose.model('bag', BagSchema);
