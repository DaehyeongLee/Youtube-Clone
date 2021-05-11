const express = require('express');
const router = express.Router();

const {Like} = require('../models/Like');
const { response } = require('express');
const {Dislike} = require("../models/Dislike")

//================================
//             Like
//================================

router.post('/getLikes', (req, res) => {

    let variable = {}
    //비디오의 좋아요기능일경우
    if(req.body.videoId) {
        variable = {videoId: req.body.videoId}
    } //comment의 좋아요기능일경우 
    else {
        variable = {commentId: req.body.commentId}
    }

    Like.find(variable)
    .exec((err, likes) => {
        if (err) return res.status(400).send(err)
        res.status(200).json({success: true, likes})
    })
})

router.post('/getDislikes', (req, res) => {

    let variable = {}
    //비디오의 싫어요기능일경우
    if(req.body.videoId) {
        variable = {videoId: req.body.videoId}
    } //comment의 싫어요기능일경우 
    else {
        variable = {commentId: req.body.commentId}
    }

    Dislike.find(variable)
    .exec((err, dislikes) => {
        if (err) return res.status(400).send(err)
        res.status(200).json({success: true, dislikes})
    })
})

router.post('/upLike', (req, res) => {

    let variable = {}
    //비디오의 좋아요기능일경우
    if(req.body.videoId) {
        variable = {videoId: req.body.videoId, userId: req.body.userId}
    } //comment의 좋아요기능일경우 
    else {
        variable = {commentId: req.body.commentId, userId: req.body.userId}
    }

    //Like collection에 클릭 정보를 넣어준다.
    const like = new Like(variable)
    like.save((err, likeResult)=> {
        if(err) return res.status(400).json({success: false, err})
        
        //만약 Dislike이 이미 클릭이 되어 있으면 Dislike 개수를 1 줄여준다
        Dislike.findOneAndDelete(variable)
        .exec((err, result)=> {
            if(err) return res.status(400).json({success: false, err})
            res.status(200).json({success: true})
        })
    })
})
router.post('/unLike', (req, res) => {

    let variable = {}
    //비디오의 좋아요기능일경우
    if(req.body.videoId) {
        variable = {videoId: req.body.videoId, userId: req.body.userId}
    } //comment의 좋아요기능일경우 
    else {
        variable = {commentId: req.body.commentId, userId: req.body.userId}
    }

    Like.findOneAndDelete(variable)
    .exec((err, result)=> {
        if(err) return res.status(400).json({success: false, err})
        res.status(200).json({success: true})
    })
})

router.post('/upDislike', (req, res) => {

    let variable = {}
    //비디오의 싫어요기능일경우
    if(req.body.videoId) {
        variable = {videoId: req.body.videoId, userId: req.body.userId}
    } //comment의 싫어요기능일경우 
    else {
        variable = {commentId: req.body.commentId, userId: req.body.userId}
    }

    //Dislike collection에 클릭 정보를 넣어준다.
    const dislike = new Dislike(variable)
    dislike.save((err, dislikeResult)=> {
        if(err) return res.status(400).json({success: false, err})
        
        //만약 like이 이미 클릭이 되어 있으면 like 개수를 1 줄여준다
        Like.findOneAndDelete(variable)
        .exec((err, result)=> {
            if(err) return res.status(400).json({success: false, err})
            res.status(200).json({success: true})
        })
    })
})
router.post('/unDislike', (req, res) => {

    let variable = {}
    //비디오의 싫어요기능일경우
    if(req.body.videoId) {
        variable = {videoId: req.body.videoId, userId: req.body.userId}
    } //comment의 싫어요기능일경우 
    else {
        variable = {commentId: req.body.commentId, userId: req.body.userId}
    }

    Dislike.findOneAndDelete(variable)
    .exec((err, result)=> {
        if(err) return res.status(400).json({success: false, err})
        res.status(200).json({success: true})
    })
})


module.exports = router;
