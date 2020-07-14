let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let DiscountSchema = new Schema(
    {
        type: Number,
        title: String,
        code: String,
        amount: Number,
        fromDate: Date,
        toDate: Date,
        status: Boolean
    },
    { timestamps: true }
);

module.exports = mongoose.model('discount', DiscountSchema);
