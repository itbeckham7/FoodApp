let mongoose = require('mongoose');
let mongoosePaginate = require('mongoose-paginate-v2');
let Schema = mongoose.Schema;

let OrderSchema = new Schema(
    {
        orderId: String, 
        userId: [{ type: Schema.Types.ObjectId, ref: 'user' }],
        firstName: String, 
        lastName: String, 
        phone: String, 
        email: String, 
        address: String, 
        cardType: String, 
        holderName: String, 
        cardNumber: String, 
        expireDate: String,
        cvv: String,
        deliveryStyle: String,
        bags: String,
        price: Number,
        currency: String,
        branchId: [{ type: Schema.Types.ObjectId, ref: 'user' }],
        deliveryTime: Date,
        track: String,
        status: String,
        
        // discountCode: String,
        // client: [{ type: Schema.Types.ObjectId, ref: 'order_client' }]
    },
    { timestamps: true }
);

OrderSchema.plugin(mongoosePaginate);
module.exports = mongoose.model('order', OrderSchema);
