import React, { Component } from "react";
import axios from "axios";
import Dialog from '@material-ui/core/Dialog';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import PlayIcon from "@material-ui/icons/PlayCircleFilled";
import AltPlayIcon from "@material-ui/icons/PlayArrow";
import RightIcon from "@material-ui/icons/KeyboardArrowRight";
import LeftIcon from "@material-ui/icons/KeyboardArrowLeft";
import Slider from "react-slick"
import {
  PlainTextEditor,
  Editable
} from 'react-easy-editables';

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const YOUTUBE_API_ENDPOINT = "https://www.googleapis.com/youtube/v3/playlistItems";


const settings = {
  infinite: true,
  speed: 500,
  draggable: true,
  slidesToShow: 5,
  slidesToScroll: 1,
  responsive: [
    {
      breakpoint: 960,
      settings: {
        slidesToShow: 4,
        slidesToScroll: 1,
        swipe: true,
      }
    },
    {
      breakpoint: 768,
      settings: {
        slidesToShow: 3,
        slidesToScroll: 1,
        swipe: true,
      }
    },
  ]
};


const EmbeddedVideo = ({ video, onClickVideo, nowPlaying }) => {
  return (
    <div className="video-slide">
      <div className="pos-relative video-thumbmail">
        <div className="play-button">
          <IconButton onClick={onClickVideo} aria-label="play video"><PlayIcon /></IconButton>
        </div>
        <img className="img-fluid" src={video.snippet.thumbnails.medium.url} alt={`Video thumbnail for "${video.snippet.title}"`} />
      </div>
      <h5 className="">
        {nowPlaying && <AltPlayIcon size="small" />}
        {video.snippet.title}
      </h5>
    </div>
  )
}

class YoutubeVideoPlaylistEditor extends React.Component {
  constructor(props) {
    super(props);
    this.state = { content: this.props.content };
  }

  handleEditorChange = field => item => {
    this.setState({
      content: {
        ...this.state.content,
        [field]: {
          ...item
        }
      }
    });
  }

  render() {
    const { content } = this.state;

    return(
      <div className={`playlist-editor ${this.props.classes}`}>
        <PlainTextEditor
          className="playlist-id"
          content={content["playlistId"]}
          handleEditorChange={this.handleEditorChange("playlistId")}
        />
      </div>
    )
  }
}

class YoutubeVideoPlaylist extends Component {
  constructor(props) {
    super(props);
    this.state = {
      videos: [],
      videoId: ""
    };
  }

  componentDidMount() {
    this.populateVideos()
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.content !== this.props.content) {
      this.populateVideos()
    }
  }

  populateVideos = () => {
    const content = this.props.content || {};
    const playlistId = content["playlistId"] ? content["playlistId"]["text"] : "";
    const url = `${YOUTUBE_API_ENDPOINT}?key=${process.env.GATSBY_YOUTUBE_API_KEY}&part=snippet&playlistId=${playlistId}&maxResults=50`;
    const method = "GET";

    axios({
      url,
      method
    })
    .then(res => {
      this.setState({ videos: res.data.items })
    })
    .catch(err => {
      console.log(err);
    });
  }

  handleSave = newContent => {
    this.props.onSave(newContent)
  }

  render() {
    const { videos, videoId, videoTitle } = this.state;
    const content = this.props.content || {};
    const playlistId = content["playlistId"] ? content["playlistId"]["text"] : "";
    const embedSrc = videoId ? `https://www.youtube.com/embed/${videoId}` : `https://www.youtube.com/embed/videoseries?list=${playlistId}`
    console.log('content', content)
    console.log('this.props', this.props)

    return (
      <Editable
        Editor={YoutubeVideoPlaylistEditor}
        handleSave={this.handleSave}
        content={content}
        {...this.props}
      >
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <div className="embed-container">
              <iframe title={videoTitle} src={embedSrc} frameBorder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
            </div>
          </Grid>
          <Grid item xs={12}>
            <Slider { ...settings }>
              {
                videos.map(video => {
                  return (
                    <EmbeddedVideo
                      video={video}
                      key={video.id}
                      nowPlaying={video.snippet.resourceId.videoId === videoId}
                      onClickVideo={() => this.setState({ videoId: video.snippet.resourceId.videoId, videoTitle: video.snippet.title }) }
                    />
                  )
                })
              }
            </Slider>
          </Grid>
        </Grid>
      </Editable>
    );
  }
}

export default YoutubeVideoPlaylist
