const mongoose = require('mongoose');

const basicInfoSchema = mongoose.Schema({
        name: {
            type: String
        },
        infos: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'info'
            }
        ],
        plant: {
            type: String
        },
        project: {
            type: String
        },
        model: {
            type: String
        },
        section: {
            type: String
        }
});

module.exports = mongoose.model("basicInfo", basicInfoSchema);
