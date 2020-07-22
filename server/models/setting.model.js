let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let SettingSchema = new Schema(
    {
        homeType: String,
        startTime: String,
        endTime: String,
    },
    { timestamps: true }
);

module.exports = mongoose.model('setting', SettingSchema);
