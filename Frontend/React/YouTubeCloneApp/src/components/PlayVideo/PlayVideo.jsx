import React, { useEffect, useState } from 'react'
import './PlayVideo.css'
import like from '../../assets/like.png'
import dislike from '../../assets/dislike.png'
import share from '../../assets/share.png'
import save from '../../assets/save.png'
import { value_converter } from '../../data'
import moment from 'moment'
import { useParams } from 'react-router-dom'

const PlayVideo = () => {
    const {videoId} = useParams();
    const [apiData, setApiData] = useState(null);
    const [channelData, setChannelData] = useState(null);
    const [commentsData, setCommentsData] = useState([]);

    const fetchVideoData = async () => {
        // Fetching video's data
        const videoDetails_url = `https://youtube.googleapis.com/youtube/v3/videos?part=snippet%2CcontentDetails%2Cstatistics&id=${videoId}&key=${import.meta.env.VITE_APP_API_KEY}`;
        await fetch(videoDetails_url).then(res => res.json()).then(data => setApiData(data.items[0]));
    }

    const fetchChannelData = async () => {
        // Fetching channel's data
        const channelDetails_url = `https://youtube.googleapis.com/youtube/v3/channels?part=snippet%2CcontentDetails%2Cstatistics&id=${apiData.snippet.channelId}&key=${import.meta.env.VITE_APP_API_KEY}`;
        await fetch(channelDetails_url).then(res => res.json()).then(data => setChannelData(data.items[0]));

        // Fetch comments data
        const commentsDetails_url = `https://youtube.googleapis.com/youtube/v3/commentThreads?part=snippet%2Creplies&maxResults=50&videoId=${videoId}&key=${import.meta.env.VITE_APP_API_KEY}`;
        await fetch(commentsDetails_url).then(res => res.json()).then(data => setCommentsData(data.items));
    }

    useEffect(() => {
        fetchVideoData();
    },[videoId]);

    useEffect(() => {
        if (apiData) {
            fetchChannelData();
        }
    },[apiData]); 

  return (
    <div className='play-video'>
        <iframe src={`https://www.youtube.com/embed/${videoId}?autoplay=1`} frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
        <h3>{apiData ? apiData.snippet.title : "Video Title"}</h3>
        <div className='play-video-info'>
            <p>{apiData ? value_converter(apiData.statistics.viewCount) : "Total"} Views &bull; {apiData ? moment(apiData.snippet.publishedAt).fromNow() : ""}</p>
            <div>
                <span><img src={like}/> {apiData ? value_converter(apiData.statistics.likeCount) : "Likes"}</span>
                <span><img src={share}/> Share</span>
                <span><img src={save}/> Save</span>
            </div>
        </div>
        <hr/>
        <div className="publisher">
            <img src={channelData ? channelData.snippet.thumbnails.default.url : ""}/>
            <div>
                <p>{apiData ? apiData.snippet.channelTitle : ""}</p>
                <span>{channelData ? value_converter(channelData.statistics.subscriberCount) : ""} Subscribers</span>
            </div>
            <button>Subscribe</button>
        </div>
        <div className="vid-description">
            <p>{apiData ? apiData.snippet.description.slice(0,250) : "Channel Description"}</p>
            <hr/>
            <h4>{apiData ? value_converter(apiData.statistics.commentCount) : ""} Comments</h4>
            {commentsData.map((item, index) => {
                return (
                    <div key={index} className="comment">
                        <img src={item.snippet.topLevelComment.snippet.authorProfileImageUrl}/>
                        <div>
                            <h3>{item.snippet.topLevelComment.snippet.authorDisplayName} <span>{moment(item.snippet.topLevelComment.snippet.publishedAt).fromNow()}</span></h3>
                            <p>{item.snippet.topLevelComment.snippet.textDisplay}</p>
                            <div className="comment-action">
                                <img src={like}/>
                                <span>{value_converter(item.snippet.topLevelComment.snippet.likeCount)}</span>
                                <img src={dislike}/>
                            </div>
                        </div>
                    </div>
                )
            })}
        </div>
    </div>
  )
}

export default PlayVideo