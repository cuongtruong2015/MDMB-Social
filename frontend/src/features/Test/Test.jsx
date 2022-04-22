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
    setControl(e.target);
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
  const handlePauseClick = () => {
    control.pauseVideo();
  };
  const handleStartClick = () => {
    console.log(control.setLoop('repeat'));
    // control.setLoop(true);
  };
  const handleResumeClick = () => {
    control.pauseVideo();
  };
  const handleStopClick = () => {
    control.stopVideo();
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
        style={{ display: 'none' }}
      />
      <button onClick={handleStartClick}>start</button>
      <button onClick={handlePauseClick}>pause</button>
      <button onClick={handleResumeClick}>resume</button>
      <button onClick={handleStopClick}>stop</button>
      <button onClick={FetchApi}>fetch</button>
    </div>
  );
}
