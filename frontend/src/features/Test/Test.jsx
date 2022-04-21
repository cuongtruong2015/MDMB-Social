import React from 'react';
import YouTube from 'react-youtube';

export default function Test() {
  const [modalIsOpen, setModalIsOpen] = React.useState(false);
  const [videoUrl, setVideoUrl] = React.useState(
    'https://www.youtube.com/watch?v=rsT8b3mqNwA'
  );
  let videoCode;
  if (videoUrl) {
    videoCode = videoUrl.split('v=')[1].split('&')[0];
  }
  const [control, setControl] = React.useState(false);
  const checkElapsedTime = (e) => {
    // console.log(e.target);
    setControl(e.target);
    // console.log(e.target.playerInfo.playerState);
    const duration = e.target.getDuration();
    const currentTime = e.target.getCurrentTime();
    if (currentTime / duration > 0.95) {
      setModalIsOpen(true);
    }
  };
  console.log(document.querySelector('video'));
  const opts = {
    playerVars: {
      // https://developers.google.com/youtube/player_parameters
      autoplay: 1,
    },
  };
  const handleClick = () => {
    control.pauseVideo();
  };
  const FetchApi = async () => {
    const data = await fetch(
      'https://www.googleapis.com/youtube/v3/search?key=AIzaSyD42QBJSa1Uxp_0LA3lrvS7GG0ZA8aSr2A&q=beliver'
    );
    console.log(await data.json());
  };
  return (
    <div>
      <YouTube
        id="video1"
        videoId={'rsT8b3mqNwA'}
        containerClassName="embed embed-youtube"
        onStateChange={(e) => checkElapsedTime(e)}
        opts={opts}
      />
      <button onClick={handleClick}>aaaaaaaaa</button>
      <button onClick={FetchApi}>fetch</button>
    </div>
  );
}
