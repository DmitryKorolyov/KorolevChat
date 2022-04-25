const {Schema, model, Types} = require('mongoose')

const scheme = Schema({
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true}

})



module.exports = model('User', scheme)