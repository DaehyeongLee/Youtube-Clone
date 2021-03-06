import React, {useState} from 'react'
import Axios from 'axios'
import {useSelector} from 'react-redux';
import SingleComment from './SingleComment';
import ReplyComment from './ReplyComment';

function Comment(props) {

    const videoId = props.postId;
    const user = useSelector(state => state.user); //redux를 통해 user의 모든 데이터 가져옴
    const [commentValue, setcommentValue] = useState("")

    const handleClick = (event) => {
        setcommentValue(event.currentTarget.value)
    }
    const onSubmit = (event) => {
        event.preventDefault(); //버튼을 눌러줘도 refresh되지 않는다.

        const variables = {
            content: commentValue,
            writer: user.userData._id,
            postId: videoId
        }

        Axios.post('/api/comment/saveComment', variables)
        .then(response=> {
            if(response.data.success) {
                props.refreshFunction(response.data.result)
                setcommentValue("")

            } else {
                alert('Failed save comment')
            }
        })
    }

    return (
        <div>
            <br />
            <p> Replies</p>
            <hr />

            {/* Comment Lists */}
            {props.commentLists && props.commentLists.map((comment, index) => (
                //Root comment만 보여준다 (대댓글은 보여주지 않는다)
                (!comment.responseTo &&
                    <React.Fragment>
                        <SingleComment refreshFunction={props.refreshFunction} comment={comment} postId={props.postId} />
                        <ReplyComment refreshFunction={props.refreshFunction} parentCommentId = {comment._id} postId={props.postId} commentLists = {props.commentLists}/>
                    </React.Fragment>

                )
            ))}            

            {/* Root Comment Form */}

            <form style = {{display: 'flex'}} onSubmit= {onSubmit} >

                <textarea
                    style = {{width: '100%', borderRadius: '5px'}}
                    onChange = {handleClick}
                    value = {commentValue}
                    placeholder = "Write comments"
                
                />
                <br />
                <button style = {{width : '20%', height : '52px'}} onClick= {onSubmit} >
                    Submit
                </button>

            </form>
        </div>
    )
}

export default Comment
