const {Schema, model, Types} = require('mongoose')

const scheme = Schema({
    name: {type: String, required: true},
    secondName: {type: String, required: true}
})

module.exports = model('Room', scheme)