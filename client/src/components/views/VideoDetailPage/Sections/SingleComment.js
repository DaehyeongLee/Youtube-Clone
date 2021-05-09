import React, {useState} from 'react'
import { Comment, Avatar, Button, Input } from 'antd';
import {useSelector} from 'react-redux';
import Axios from 'axios';

const { TextArea } = Input;

function SingleComment(props) {

    const [OpenReply, setOpenReply] = useState(false)
    const [CommentValue, setCommentValue] = useState("")
    const user = useSelector(state => state.user); //redux를 통해 user의 모든 데이터 가져옴

    const onClickReplyOpen = () => {
        setOpenReply(!OpenReply)
    }
    const onHandleChange = (event) => {
        setCommentValue(event.currentTarget.value)
    }
    const onSubmit = (event) => {
        event.preventDefault(); //버튼을 눌러줘도 refresh되지 않는다.

        const variables = {
            content: CommentValue,
            writer: user.userData._id,
            postId: props.postId,
            responseTo: props.comment._id
        }

        Axios.post('/api/comment/saveComment', variables)
        .then(response=> {
            if(response.data.success) {
                console.log(response.data.result)
                props.refreshFunction(response.data.result)
                setCommentValue("")
                setOpenReply(false)
            } else {
                alert('Failed save comment')
            }
        })
    }

    const actions = [
        <span onClick = {onClickReplyOpen} key = "comment-basic-reply-to">Reply to</span>
    ]

    return (
        <div>
            <Comment
                actions={actions}
                author={props.comment.writer.name}
                avatar={<Avatar src = {props.comment.writer.image} alt />}
                content={<p>{props.comment.content}</p>}
            />

            {/*OpenReply가 true일때 입력 form 나타남*/}
            {OpenReply &&
                <form style={{ display: 'flex' }} onSubmit={onSubmit} >

                    <textarea
                        style={{ width: '100%', borderRadius: '5px' }}
                        onChange = {onHandleChange}
                        value = {CommentValue}
                        placeholder="Write comments"

                    />
                    <br />
                    <button style={{ width: '20%', height: '52px' }} onClick={onSubmit} >
                        Submit
                    </button>

                </form>
            }

        </div>
    )
}

export default SingleComment
