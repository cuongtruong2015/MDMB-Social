import React, { useEffect } from 'react';
import YouTube from 'react-youtube';
import { getSocket } from 'app/selectors/socket';
import { initSocket } from 'app/actions/socket';
import { useDispatch, useSelector } from 'react-redux';
import { getAuth } from 'app/selectors/login';
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
  const socket = useSelector(getSocket);
  const auth = useSelector(getAuth);
  const dispatch = useDispatch();
  useEffect(() => {
    if (!socket) {
      dispatch(initSocket(auth?.accountId, auth?.accessToken));
    }
  }, []);
  const FetchApi = async () => {
    // const data = await fetch(
    //   // 'https://www.googleapis.com/youtube/v3/search?key=AIzaSyD42QBJSa1Uxp_0LA3lrvS7GG0ZA8aSr2A&q=beliver'
    // );
    // console.log(await data.json());

    navigator.geolocation.getCurrentPosition(async (position) => {
      // console.log('Latitude is :', );
      // console.log('Longitude is :', position.coords.longitude);
      const lat = position.coords.latitude;
      const lon = position.coords.longitude;
      // const rs = await fetch(
      //   `https://api.openweathermap.org/data/2.5/onecall/timemachine?lat=${lat}&lon=${lon}&dt=${
      //     Date.parse(new Date()) / 100
      //   }&appid=3a732a3691d14d659946b17b0b1939688`
      // );
      const rs = await fetch(
        `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=daily&appid=3a732a3691d14d659946b17bb1939688`
      );
      const data = await rs.json();
      console.log(data);
      var object = [];
      const hourly = data.hourly;
      var listDate = [];
      for (let i = 0; i < hourly.length; i++) {
        const date = new Date(data?.hourly[i]?.dt * 1000)
          .toLocaleString('vi-VN', {
            timeZone: 'Asia/Ho_Chi_Minh',
          })
          .split(',')[1];
        let contain = false;
        for (let j in listDate) {
          if (listDate[j]?.includes(date)) contain = true;
        }
        if (!contain) listDate.push(date);
        contain = false;
      }
      const listHour = ['07', '10', '13', '17', '20'];
      var message = 'Weather for next few days: \n';
      for (let index in listDate) {
        message += `- Date:${listDate[index]}\n`;
        object.push();
        var DateData = {};
        DateData.date = listDate[index];
        var status = [];
        for (let i = 0; i < hourly.length; i++) {
          // console.log(data?.hourly[i]?.dt);
          const date = new Date(data?.hourly[i]?.dt * 1000).toLocaleString(
            'vi-VN',
            {
              timeZone: 'Asia/Ho_Chi_Minh',
            }
          );
          // console.log(date);
          let hour = date.split(',')[0].substring(0, 2);
          if (
            listDate[index] === date.split(',')[1] &&
            listHour.includes(hour)
          ) {
            let description = data?.hourly[i]?.weather[0]?.description;
            let dayTimedisplay =
              date.split(',')[0].substring(0, 5) + date.split(',')[1];
            let temp = (hourly[i].temp / 10).toFixed(0);
            let feellike = (hourly[i].feels_like / 10).toFixed(0);
            let humidity = hourly[i].humidity / 100;
            const UV = hourly[i].uvi;
            DateData.weather = description;
            let statusTemp = { time: dayTimedisplay, temp, feellike, humidity };
            status.push(statusTemp);
            message += `  • ${dayTimedisplay}:\n\tWeather:${description} \n\t ◦ Current Temperature/Feels like:  ${temp}°C/${feellike}°C \n\t ◦ Humidity: ${humidity}%\n\t ◦ UV: ${UV}\n`;
          }
        }
        DateData.status = { status };
        object.push(DateData);
      }
      // console.log(message);
      // console.log(JSON.stringify(object));
      // socket?.emit(
      //   'chat message',
      //   JSON.stringify(object),
      //   0,
      //   4,
      //   null,
      //   (status, data) => {
      //     console.log(data);
      //   }
      // );
    });
  };
  // useEffect(() => {

  // }, []);
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
