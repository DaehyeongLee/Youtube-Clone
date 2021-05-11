import React, { useEffect, useState } from 'react';
import {Tooltip, Icon} from 'antd';
import Axios from 'axios';

function LikeDislikes(props) {

    const [Likes, setLikes] = useState(0)
    const [Dislikes, setDislikes] = useState(0)
    const [LikeAction, setLikeAction] = useState(null)
    const [DislikeAction, setDislikeAction] = useState(null)

    let variable = {}

    if(props.video) {
        variable = {videoId: props.videoId, userId: props.userId}
    } else {
        variable = {commentId: props.commentId, userId: props.userId}
    }
    useEffect(() => {
        Axios.post('/api/like/getLikes', variable)
        .then(response => {
            if (response.data.success) {
                // 얼마나 많은 좋아요를 받았는지 정보 가져오기
                setLikes(response.data.likes.length)

                // 내가 이미 그 좋아요를 눌렀는지 정보 가져오기
                response.data.likes.map(like => {
                    //현재 로그인한 Id와 likeId가 일치할 경우, 내가 누른 좋아요이다
                    if(like.userId === props.userId) {
                        setLikeAction('liked')
                    }
                })
            } else {
                alert('Failed to get Likes info')
            }
        })

        Axios.post('/api/like/getDislikes', variable)
        .then(response => {
            if (response.data.success) {
                // 얼마나 많은 싫어요를 받았는지 정보 가져오기
                setDislikes(response.data.dislikes.length)

                // 내가 이미 그 싫어요를 눌렀는지 정보 가져오기
                response.data.dislikes.map(dislike => {
                    //현재 로그인한 Id와 dislikeId가 일치할 경우, 내가 누른 싫어요이다
                    if(dislike.userId === props.userId) {
                        setDislikeAction('disliked')
                    }
                })
            } else {
                alert('Failed to get dislikes info')
            }
        })
    }, [])

    const onLike = () => {
        //아직 좋아요 클릭이 안되어 있을때
        if(LikeAction === null) {
            Axios.post('/api/like/upLike', variable)
            .then(response => {
                if(response.data.success) {
                    setLikes(Likes + 1)
                    setLikeAction('liked')

                    if (DislikeAction !== null) {
                        setDislikeAction(null)
                        setDislikes(Dislikes - 1)
                    }
                } else {
                    alert("Failed to up like")
                }
            })
        } //이미 클릭이 되어 있었을 때
        else {
            Axios.post('/api/like/unLike', variable)
            .then(response => {
                if(response.data.success) {
                    setLikes(Likes - 1)
                    setLikeAction(null)
                } else {
                    alert("Failed to down like")
                }
            })
        }
    }

    const onDislike = () => {
        //이미 싫어요가 클릭이 되어 있을때
        if (DislikeAction !== null) {
            Axios.post('/api/like/unDislike', variable)
            .then(response => {
                if(response.data.success) {
                    setDislikes(Dislikes - 1)
                    setDislikeAction(null)
                } else {
                    alert('Failed to down dislike')
                }
            })
        } else {
            Axios.post('/api/like/upDislike', variable)
            .then(response => {
                if(response.data.success) {
                    setDislikes(Dislikes + 1)
                    setDislikeAction('disliked')

                    if(LikeAction !== null) {
                        setLikeAction(null)
                        setLikes(Likes - 1)
                    }
                } else {
                    alert('Failed to up dislike')
                }
            })
        }
    }

    return (
        <div>
            <span key= "comment-basic-like" style = {{marginRight: '5px'}}>
                <Tooltip title="Like">
                    <Icon type="like"
                        theme={LikeAction === 'liked'? 'filled' : 'outlined'}
                        onClick={onLike}
                    />
                </Tooltip>
                <span style ={{paddingLeft: '8px', cursor:'auto'}}>{Likes}</span>
            </span>
            <span key= "comment-basic-dislike" style = {{marginRight: '5px'}}>
                <Tooltip title="Dislike">
                    <Icon type="dislike"
                        theme={DislikeAction === 'disliked'? 'filled' : 'outlined'}
                        onClick={onDislike}
                    />
                </Tooltip>
                <span style ={{paddingLeft: '8px', cursor:'auto'}}>{Dislikes}</span>
            </span>

        </div>
    )
}

export default LikeDislikes
