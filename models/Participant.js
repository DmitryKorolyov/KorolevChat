const {Schema, model, Types} = require('mongoose')

const scheme = Schema({
    user: {type: Types.ObjectId, ref: 'User'},
    room: {type: Types.ObjectId, ref: 'Dialog'},
    lastReadMessage: {type: Types.ObjectId, ref: 'Message'}
})



module.exports = model('Participant', scheme)
