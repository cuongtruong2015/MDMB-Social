import { PlayCircle, X } from '@styled-icons/boxicons-regular';
import LogoImg from 'assets/images/logos/logo.jpg';
import React from 'react';
import styled from 'styled-components';
import { useNavigate } from '../../../../node_modules/react-router-dom/index';
const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 70%;
  height: 100%;
  padding: 0;
  @media (max-width: 420px) {
    width: 100%;
  }
`;
const Top = styled.div`
  display: flex;
  align-items: center;
  padding: 20px 0 0 20px;
  background-color: #fff;
`;
const Close = styled(X)`
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  cursor: pointer;
  background-color: #c0bbbb;
  transition: all 0.3s ease-in-out;
  z-index: 2;
  :hover {
    transform: scale(1.1);
  }
`;
const Logo = styled.img`
  z-index: 2;
  margin-left: 20px;
  cursor: pointer;
  color: #ffffff;
  content: url(${LogoImg});
  width: 3rem;
  height: 3rem;
  border-radius: 50%;
  border: 3px solid #4849a1;
  transition: all 0.3s ease-in-out;
  :hover {
    transform: scale(1.1);
  }
`;
const Bottom = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 90%;
  overflow: hidden;
`;
const BackgroundBlur = styled.div`
  background-image: url(${({ url }) => url});
  filter: blur(35px);
  -webkit-filter: blur(35px);
  position: fixed;
  width: calc(100vw - 300px);
  height: 100%;
  background-position: center;
  background-repeat: no-repeat;
  background-size: fill;
`;
const OverlayEffect = styled.div`
  position: fixed;
  display: block;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 1;
`;
const ImageWrapper = styled.div`
  justify-content: center;
  max-width: 70%;
  max-height: 100%;
  text-align: center;
  z-index: 1;
  img,
  video {
    max-width: 80%;
    max-height: 80%;
    background-color: #fff;
  }
  img {
    border: 3px solid #fff;
    box-shadow: 10px 10px 5px #ccc;
    -moz-box-shadow: 10px 10px 5px #ccc;
    -webkit-box-shadow: 10px 10px 5px #ccc;
    -khtml-box-shadow: 10px 10px 5px #ccc;
  }
  @media (max-width: 420px) {
    max-width: 100%;
  }
`;
const PlayIcon = styled(PlayCircle)`
  width: 2rem;
  height: 2rem;
  position: absolute;
  color: #fff;
`;
export default function MediaOverlay({ disableMediaOverlay, media }) {
  var video = document.getElementsByClassName('video-overlay')[0];
  const navigate = useNavigate();
  return (
    <Wrapper>
      <Top>
        <Close onClick={() => disableMediaOverlay()} />
        <Logo onClick={() => disableMediaOverlay()} />
      </Top>
      <BackgroundBlur url={media.Content} />
      {media?.Type === 2 && <OverlayEffect />}
      <Bottom>
        <ImageWrapper>
          {media?.Type === 1 && <img src={media?.Content} />}
          {media?.Type === 2 && (
            <video
              className="video-overlay"
              src={media?.Content}
              autoPlay
              controls
            />
          )}
        </ImageWrapper>
        {media?.Type === 2 && !video?.paused && <PlayIcon />}
      </Bottom>
    </Wrapper>
  );
}
