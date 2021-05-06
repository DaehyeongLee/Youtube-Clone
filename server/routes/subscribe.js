const express = require('express');
const router = express.Router();

const {Subscriber} = require('../models/Subscriber');

//=================================
//             Subscribe
//=================================


router.post('/subscribeNumber', (req, res) => {
    //데이터베이스에서 얼마나 많은 사람이 비디오 업로드 한 유저를 구독하는지 정보 가져오기
    Subscriber.find({'userTo': req.body.userTo})
    .exec((err, subscribe) => {
        if(err) return res.status(400).send(err);
        return res.status(200).json({success: true, subscribeNumber: subscribe.length})
    })
})

router.post('/subscribed', (req, res) => {
    //내가 이 비디오 업로드 한 유저를 구독하는지 정보 가져오기
    Subscriber.find({'userTo': req.body.userTo, 'userFrom': req.body.userFrom})
    .exec((err, subscribe) => {
        if(err) return res.status(400).send(err);
        let result = false;
        if(subscribe.length !== 0) {
            result = true
        }
        res.status(200).json({success: true, subscribed: result})
    })
})

router.post('/unSubscribe', (req, res) => {
    Subscriber.findOneAndDelete({'userTo': req.body.userTo, 'userFrom': req.body.userFrom})
    .exec((err, doc) => {
        if(err) return res.status(400).json({success: false, err})
        return res.status(200).json({success: true, doc})
    })
})

router.post('/subscribe', (req, res) => {
    
    const subscribe = new Subscriber(req.body)

    subscribe.save((err, doc) => {
        if(err) return res.json({success: false, err})
        res.status(200).json({success: true})
    })
})

module.exports = router;
