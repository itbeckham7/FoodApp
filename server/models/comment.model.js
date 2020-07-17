let mongoose = require('mongoose');
let mongoosePaginate = require('mongoose-paginate-v2');
let Schema = mongoose.Schema;

let CommentSchema = new Schema(
    {
        userId: [{ type: Schema.Types.ObjectId, ref: 'user' }],
        foodId: [{ type: Schema.Types.ObjectId, ref: 'food' }],
        subject: String,
        description: String,
        rating: Number
    },
    { timestamps: true }
);

CommentSchema.plugin(mongoosePaginate);
module.exports = mongoose.model('comment', CommentSchema);
