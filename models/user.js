const mongoose = require('mongoose');
const basicInfo = require('./basicInfo');

const userSchema = mongoose.Schema({
    email: {
        type: String
    },
    password: {
        type: String
    },
    admin: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'admin'
    },
});

module.exports = mongoose.model("user", userSchema);
