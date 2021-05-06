const express = require('express');
const router = express.Router();

const {Subscriber} = require("../models/Subscriber");
const {Video} = require('../models/Video')
//const { auth } = require("../middleware/auth");
const multer = require('multer');
//ffmpeg사용 위해 ffmpeg를 다운로드하여 환경변수를 설정해줘야 한다
const ffmpeg = require("fluent-ffmpeg");

//=================================
//             Video
//=================================

let storage = multer.diskStorage({
    //파일 저장 경로
    destination: (req, file, cb) => {
        cb(null, "uploads/");
    },
    //파일 저장 시 지정될 파일 이름 (날짜 + 파일이름)
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}_${file.originalname}`);
    },
    //mp4만 가능하도록 확장자 제한
    fileFilter: (req, file, cb) => {
        const ext = path.extname(file.originalname)
        if (ext !== '.mp4') {
            return cb(res.status(400).end('only mp4 is allowed'), false);
        }
        cb (null, true)
    }
})

const upload = multer({storage: storage}).single("file"); //single은 파일 하나만

router.post('/uploadfiles', (req, res) => {
    //Client에서 받은 비디오를 서버에 저장한다
    //multer를 사용한다: npm install multer --save
    upload(req, res, err => {
        if(err) {
            return res.json({success: false, err})
        }
        //url: 파일 저장이 된 경로(uploads/), filename: 파일이름
        return res.json({success: true, url: res.req.file.path, fileName: res.req.file.filename})
    })
})
router.post('/thumbnail', (req, res) => {
    //썸네일 생성하고 비디오 러닝타임도 가져오기

    let filePath = "";
    let fileDuration = "";

    //비디오 정보 가져오기
    ffmpeg.ffprobe(req.body.url, function (err, metadata) {
        console.dir(metadata); //all metadata
        console.log(metadata.format.duration);
        fileDuration = metadata.format.duration
    });

    //썸네일 생성
    ffmpeg(req.body.url) //client에서 온 비디오 저장된 경로 (Currnet: uploads/)
    .on('filenames', function (filenames) {
        console.log('Will generate' + filenames.join(', '))
        console.log(filenames)

        filePath = "uploads/thumbnails/" + filenames[0]
    })
    //thumbnail 생성후 하게될 동작
    .on('end', function () {
        console.log('Screenshots taken');
        return res.json({success: true, url: filePath, fileDuration: fileDuration})
    })
    //error가 발생했을때 동작
    .on('error', function (err) {
        console.errer(err);
        return res.json({success: false, err});
    })
    //스크린샷 옵션: count- 가능한 썸네일 사진 개수, folder- 썸네일 스크린샷 저장될 경로
    .screenshots({
        //Will take screenshots at 20%, 40%, 60% and 80% of the video
        count: 3,
        folder: 'uploads/thumbnails',
        size: '320x240',
        filename: 'thumbnail-%b.png'
    })
})

router.post('/uploadVideo', (req, res) => {
    //비디오 정보를 DB에 저장한다.
    const video = new Video(req.body) //client에서 보낸 모든 파라미터가 req.body에 담긴다.

    //몽고DB의 save를 이용하여 디비에 저장
    video.save((err, doc) => {
        if(err) {
            return res.json({success: false, err})
        } else {
            return res.status(200).json({success: true})
        }
    })
})

router.get('/getVideos', (req, res) => {
    //비디오 list를 DB에서 가져와서 클라이언트에 보낸다.
    Video.find() //Video collection 안에 있는 모든 video를 가져온다.
    .populate('writer') //유저의 모든 정보를 가져오기 위해 populate해줘야한다.
    .exec((err, videos) => {
        if (err) return res.status(400).send(err)
        return res.status(200).json({success: true, videos})
    })
})

router.post('/getVideoDetail', (req, res) => {
    //비디오 디테일을 DB에서 가져와서 클라이언트에 보낸다.
    Video.findOne({"_id" : req.body.videoId}) //Video 정보들을 가져온다.
    .populate('writer') //유저의 모든 정보를 가져오기 위해 populate해줘야한다.
    .exec((err, videoDetail) => {
        if (err) return res.status(400).send(err)
        return res.status(200).json({success: true, videoDetail})
    })
})
router.post('/getSubscriptionVideos', (req, res) => {
    //자신의 아이디를 가지고 구독하는 사람들을 찾는다.
    Subscriber.find({ userFrom: req.body.userFrom })
        .exec((err, subscriberInfo) => {
            if (err) return res.status(400).send(err);

            let subscribedUser = []; //자신이 구독한 사람들 목록

            subscriberInfo.map((subscriber, i) => {
                subscribedUser.push(subscriber.userTo);
            })

            //찾은 사람들의 비디오를 가지고 온다.
            Video.find({ writer: { $in: subscribedUser } }) //특정 한명이 아닌 전체 사람을 찾는다.
                .populate('writer')
                .exec((err, videos) => {
                    if (err) return res.status(400).send(err);
                    res.status(200).json({ success: true, videos })
                })
        })


})


module.exports = router;
