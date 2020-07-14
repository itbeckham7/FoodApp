let mongoose = require('mongoose');
let mongoosePaginate = require('mongoose-paginate-v2');
let Schema = mongoose.Schema;

let SubscribeSchema = new Schema(
    {
        email: String,
        browser: String,
        ip: String
    },
    { timestamps: true }
);

SubscribeSchema.plugin(mongoosePaginate);
module.exports = mongoose.model('subscribe', SubscribeSchema);
