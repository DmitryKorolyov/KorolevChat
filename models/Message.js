const {Schema, model, Types} = require('mongoose')

const scheme = Schema({
    roomId: {type: Types.ObjectId, ref: 'Dialog'},
    userId: {type: Types.ObjectId, ref: 'User'},
    text: {type: String, required: true},
    date: {type: String, required: true}
})

module.exports = model('Message', scheme)