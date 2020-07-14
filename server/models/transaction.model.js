let mongoose = require('mongoose');
let mongoosePaginate = require('mongoose-paginate-v2');
let Schema = mongoose.Schema;

let TransactionSchema = new Schema(
    {
        orderId: [{ type: Schema.Types.ObjectId, ref: 'order' }],
        foods: String,
        paymentMethod: String,
        deliveryStatus: Number,
        amount: Number
    },
    { timestamps: true }
);

TransactionSchema.plugin(mongoosePaginate);
module.exports = mongoose.model('transaction', TransactionSchema);
