let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let AddressSchema = new Schema(
    {
        addressName: String,
        countryId: String,
        stateId: String,
        cityId: String,
        address: String,
        userId: [{ type: Schema.Types.ObjectId, ref: 'user' }],
        active: Boolean
    },
    { timestamps: true }
);

module.exports = mongoose.model('address', AddressSchema);
