let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let CategorySchema = new Schema(
    {
        slug: String,
        parentId: [{ type: Schema.Types.ObjectId, ref: 'category' }],
        position: Number,
        image: String,
        trans: [{ type: Schema.Types.ObjectId, ref: 'category_trans' }]
    },
    { timestamps: true }
);

module.exports = mongoose.model('category', CategorySchema);
