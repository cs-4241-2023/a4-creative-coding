// Schema for a food entry

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const saveSchema = new Schema({
    saveID: {
        type: String,
        required: true,
    },
    data: {
        type: String,
        required: true,
    },
});

const Save = mongoose.model('Save', saveSchema);
module.exports = Save;