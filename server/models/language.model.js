let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let LanguageSchema = new Schema(
    {
        abbr: String,
        name: String,
        currency: String,
        currencyKey: String,
        flag: String
    },
    { timestamps: false }
);

module.exports = mongoose.model('language', LanguageSchema);
