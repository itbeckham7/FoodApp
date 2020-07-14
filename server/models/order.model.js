let mongoose = require('mongoose');
let mongoosePaginate = require('mongoose-paginate-v2');
let Schema = mongoose.Schema;

let OrderSchema = new Schema(
    {
        userId: [{ type: Schema.Types.ObjectId, ref: 'user' }],
        foods: String,
        paymentType: String, // visa, master, knet, cash
        status: String,
        discountCode: String,
        client: [{ type: Schema.Types.ObjectId, ref: 'order_client' }]
    },
    { timestamps: true }
);

OrderSchema.plugin(mongoosePaginate);
module.exports = mongoose.model('order', OrderSchema);
