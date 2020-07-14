let mongoose = require('mongoose');
let mongoosePaginate = require('mongoose-paginate-v2');
let Schema = mongoose.Schema;

let HistorySchema = new Schema(
    {
        activity: String,
        username: String,
    },
    { timestamps: true }
);

HistorySchema.plugin(mongoosePaginate);
module.exports = mongoose.model('history', HistorySchema);
