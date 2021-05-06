const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const subscriberSchema = mongoose.Schema({
    //동영상을 올린 유저
    userTo: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    //로그인한 유저
    userFrom: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
    
}, {timestamps: true}) //timestamps 지정해야 만든시간 저장된다.




const Subscriber = mongoose.model('Subscriber', subscriberSchema);

module.exports = { Subscriber }