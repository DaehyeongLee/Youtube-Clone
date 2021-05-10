//rfce 입력후 enter 클릭시 기초 골격 생성
import React, { useEffect, useState} from 'react';
import { Row, Col, List, Avatar } from 'antd';
import Axios from 'axios';
import SideVideo from './Sections/SideVideo';
import Subscribe from './Sections/Subscribe';
import Comment from './Sections/Comment';
import LikeDislikes from './Sections/LikeDislikes';

function VideoDetailPage(props) {

    const videoId = props.match.params.videoId //App.js에서 사용한 링크 주소를 통해 가져온 video ID
    const variable = {videoId : videoId}

    const [VideoDetail, setVideoDetail] = useState([])
    const [Comments, setComments] = useState([])

    useEffect(() => {
        Axios.post('/api/video/getVideoDetail', variable)
        .then(response => {
            if(response.data.success) {
                setVideoDetail(response.data.videoDetail)

            } else {
                alert ('비디오 정보를 가져오는 것에 실패했습니다.')
            }
        })

        Axios.post('/api/comment/getComments', variable)
        .then(response => {
            if(response.data.success) {
                setComments(response.data.comments)
            } else {
                alert ('Failed to get comment information')
            }
        })
    }, [])    

    //하위 컴포넌트에서 새 댓글 등록시 기존댓글리스트에 붙여주고 리프레시
    const refreshFunction =(newComment) => {
        //이를 통해 댓글 등록 시 바로 화면에 업데이트
        setComments(Comments.concat(newComment))
    }

    //writer 정보가 있을때만 디테일 render
    if(VideoDetail.writer) {

        //자신이 자신을 구독할 수 없도록
        const subscribeButton = VideoDetail.writer._id !== localStorage.getItem('userId') && <Subscribe userTo = {VideoDetail.writer._id} userFrom={localStorage.getItem('userId')}/>

        return (
            <Row gutter={[16, 16]}>
                {/*left side */}
                <Col lg={18} xs={24}>
                    <div style={{ width: '100%', padding: '3rem 4rem' }}>
    
                        <video style = {{width: '100%'}} src={`http://localhost:5000/${VideoDetail.filePath}`} controls />
    
                        <List.Item
                            actions= {[
                            <LikeDislikes video userId={localStorage.getItem('userId')} videoId={videoId}/>, 
                            subscribeButton
                        ]}>
                            <List.Item.Meta
                                avatar= {<Avatar src = {VideoDetail.writer.image} />}
                                title= {VideoDetail.writer.name}
                                description= {VideoDetail.description}
                            />
                        
                        </List.Item>
    
                        {/* Comments */}
                        <Comment refreshFunction={refreshFunction} commentLists={Comments} postId={videoId} />
    
                    </div>
                </Col>
                {/*right side */}
                <Col lg={6} xs={24}>
                    <SideVideo />
                </Col>
    
            </Row>
        )
    } else {
        return (
            <div>...loading</div>
        )
    }

}

export default VideoDetailPage
