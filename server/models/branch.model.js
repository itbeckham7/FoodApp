let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let BranchSchema = new Schema(
    {
        name: String,
        code: String,
        address: String,
        startTime: String,
        endTime: String,
        status: Boolean
    },
    { timestamps: true }
);

module.exports = mongoose.model('branch', BranchSchema);
