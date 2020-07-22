let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let CardSchema = new Schema(
    {
        cardType: String,
        holderName: String,
        cardNumber: String,
        expireDate: String,
        cvv: String,
        userId: [{ type: Schema.Types.ObjectId, ref: 'user' }],
        active: Boolean
    },
    { timestamps: true }
);

module.exports = mongoose.model('card', CardSchema);
