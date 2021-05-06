const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const videoSchema = mongoose.Schema({
    
    //writer에 쓰는 사람의 id를 넣는 이유: user의 모든 정보를 쉽게 가져오게 하기 위함
    writer: {
        type : Schema.Types.ObjectId,
        ref: 'User'
    },
    title: {
        type: String,
        maxlength: 50
    },
    description: {
        type: String
    },
    privacy: {
        type: Number
    },
    filePath: {
        type: String
    },
    category: {
        type: String
    },
    views: {
        type: Number,
        default: 0
    },
    duration: {
        type: String
    },
    thumbnail: {
        type: String
    }

}, {timestamps: true}) //timestamps 지정해야 만든시간 저장된다.




const Video = mongoose.model('Video', videoSchema);

module.exports = { Video }