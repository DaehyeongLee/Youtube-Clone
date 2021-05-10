const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const likeSchema = mongoose.Schema({

    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    commentId: {
        type: Schema.Types.ObjectId,
        ref: 'Comment'
    },
    videoId: {
        type: Schema.Types.ObjectId,
        ref: 'Video'
    }

    
}, {timestamps: true}) //timestamps 지정해야 만든시간 저장된다.




const Like = mongoose.model('Like', likeSchema);

module.exports = { Like }