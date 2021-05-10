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



module.exports = router;
