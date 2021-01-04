const mongoose = require('mongoose');

const docSchema = new mongoose.Schema({
    notes:[],
    trash:[] 

})

module.exports = mongoose.model('Doc',docSchema);