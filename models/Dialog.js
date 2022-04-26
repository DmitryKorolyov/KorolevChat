const {Schema, model, Types} = require('mongoose')

const scheme = Schema({
    interlocutors: {type: Array, required: true},
    lastMessage: {type: Types.ObjectId, ref: 'Message'},
    createTime: {type: String},
    creator: {type: Types.ObjectId, ref: 'User'}
})

module.exports = model('Dialog', scheme)