import React, { useEffect, useState } from 'react'
import SingleComment from './SingleComment';

function ReplyComment(props) {

    const [OpenReplyComments, setOpenReplyComments] = useState(false)
    const [ChildCommentNumber, setChildCommentNumber] = useState(0)
    useEffect(() => {
        let commentNumber = 0;

        //Child Comment의 개수 구하기
        props.commentLists.map((comment) => {
            if(comment.responseTo === props.parentCommentId) {
                commentNumber++
            }            
        })

        setChildCommentNumber(commentNumber)
    }, [props.commentLists]) //답글이 달리면 useEffect를 다시 호출

    const renderReplyComment = (parentCommentId) => (
        props.commentLists.map((comment, index) => (
            <React.Fragment>
                {/*답글comment의 responseTo가 부모comment의 Id와 같을 경우 답글 출력*/}
                {comment.responseTo === parentCommentId &&
                    <div style = {{width : '80%', marginLeft : '40px'}}>
                        <SingleComment refreshFunction={props.refreshFunction} comment={comment} postId={props.postId} />
                        <ReplyComment refreshFunction={props.refreshFunction} commentLists={props.commentLists} postId={props.postId} parentCommentId = {comment._id}/>
                    </div>
                }

            </React.Fragment>
        ))
    )

    const onHandleChange = () => {
        setOpenReplyComments(!OpenReplyComments)
    }

    return (
        <div>
            {/*Reply comment 있을 때만 render */}
            {ChildCommentNumber > 0 &&
                <p style={{ fontSize: '14px', margin: 0, color: 'gray' }} onClick = {onHandleChange}>
                    View {ChildCommentNumber} more comment(s)
                </p>
            }

            {/*View more event 클릭 시에만 reply comment 보이도록 */}
            {OpenReplyComments && 
                renderReplyComment(props.parentCommentId)
            }         

        </div>
    )
}

export default ReplyComment
