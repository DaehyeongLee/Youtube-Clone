import React, {useEffect, useState} from 'react'
import {Card, Avatar, Col, Typography, Row} from 'antd';
import Axios from 'axios';
import moment from 'moment';

const {Title} = Typography;
const {Meta} = Card;

function LandingPage() {
        
    const [Video, setVideo] = useState([])

    useEffect(() => {
        //Dom이 업데이트될때 초기에 자동 실행

        Axios.get('/api/video/getVideos') //비디오 목록 가져오는 api
        .then(response => {
            if (response.data.success) {
                setVideo(response.data.videos)
            } else {
                alert("랜딩 페이지 비디오 가져오는 것에 실패했습니다.")
            }
        })
    }, [])

    //Width는 24로 하여 화면 최대 크기일때는 6 (4#), 중간 8 (3#), 최소 24 (1#) 로 col 사이즈 조정
    const renderCards = Video.map((video, index) => {

        var minutes = Math.floor(video.duration / 60);
        var seconds = Math.floor((video.duration - minutes * 60));
        
        return <Col lg={6} md={8} xs={24}>
            <a href={`/video/${video._id}`} >
                <div style={{ position: 'relative' }}>
                    <img style={{width: '100%'}} src={`http://localhost:5000/${video.thumbnail}`} /> 
                    <div className='duration'>
                        <span>{minutes} : {seconds}</span>
                    </div>
                </div>
            </a>
            <br />
            <Meta
                avatar={ 
                    /*아바타는 유저 아이콘*/
                    <Avatar src={video.writer.image} />
                }
                /*비디오 타이틀*/
                title={video.title}
                description=""
            />
            <span>{video.writer.name} </span><br />
            <span style={{ marginLeft: '3rem' }}>
                {video.views} views
            </span>
            &nbsp;-&nbsp; 
            <span>
                {moment(video.createdAt).format("MMM Do YY")}
            </span>
        </Col>

    })
    
    return (
        <div style = {{width: '85%', margin: '3rem auto'}}>
            <Title level = {2} > Recommended </Title>
            <hr />
            <Row gutter = {[32, 16]}>

                {renderCards}
                
            </Row>

        </div>
    )
}

export default LandingPage
