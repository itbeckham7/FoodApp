let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let CategoryTransSchema = new Schema(
    {
        name: String,
        abbr: String,
        categoryId: String
    },
    { timestamps: true }
);

module.exports = mongoose.model('category_trans', CategoryTransSchema);
