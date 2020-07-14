let mongoose = require('mongoose');
let mongoosePaginate = require('mongoose-paginate-v2');
let Schema = mongoose.Schema;

let OrderClientSchema = new Schema(
    {
        firstName: String,
        lastName: String,
        email: String,
        phone: String,
        address: String,
        city: String,
        postcode: String,
        notes: String,
        orderId: String
    },
    { timestamps: true }
);

OrderClientSchema.plugin(mongoosePaginate);
module.exports = mongoose.model('order_client', OrderClientSchema);
