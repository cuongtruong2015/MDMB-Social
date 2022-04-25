import { Send, File, ImageAdd } from '@styled-icons/boxicons-solid';
import { EmojiHappy } from '@styled-icons/heroicons-outline';
import { PaperClip, Photograph } from '@styled-icons/heroicons-solid';
import { getPartner } from 'app/selectors/chat';
import { ReactComponent as StickerTest } from 'assets/images/icons/sticker.svg';
import { NimblePicker } from 'emoji-mart';
import data from 'emoji-mart/data/google.json';
import React, { useEffect } from 'react';
import { Col, Row } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import styled, { css } from 'styled-components';
import { HoverMixin } from 'styles/mixinStyles';
import {
  X,
  PlayCircle,
  Play,
  Pause,
  VolumeMute,
  Stop,
  VolumeFull,
  Infinite,
} from '@styled-icons/boxicons-regular';
import { checkFileSize, uploadFile } from 'components/FileStore/FileStore';
import { getListRelationshipSelector } from 'app/selectors/listRelationship';
import {
  playLastVideoListSearched,
  searchYoutubeData,
} from './playYoutubeMusic';
import { getSocket } from 'app/selectors/socket';
import YouTube from 'react-youtube';
import { getWeatherNextFewDay } from './weatherApp';

const Wrapper = styled.div`
  height: 100%;
  width: 100%;
  visibility: ${(props) => (props.WindowEmpty ? 'hidden' : 'none')};
  //
  display: flex;
  flex-direction: column-reverse;
  margin-top: -10px;
`;
const FileWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  overflow-x: auto;
  overflow-y: hidden;

  height: inherit;
  padding: 10px;
`;
const FileInput = styled.div`
  img {
    width: 60px;
    height: 60px;
    border-radius: 10px;
    object-fit: cover;
  }
  margin-left: 10px;
  display: flex;
`;
const VideoWrapper = styled.div`
  display: flex;
  video {
    width: 60px;
    height: 60px;
    border-radius: 10px;
  }
`;
const IconPlayVideo = styled(PlayCircle)`
  position: relative;
  width: 1.5rem;
  height: 1.5rem;
  margin-left: -50%;
  margin-right: 50%;
  margin-top: 20%;
  color: #fff;
`;
const FileDisplayWrapper = styled.div`
  display: flex;
  flex-direction: row;
  width: 250px;
  height: 60px;
`;
const FileName = styled.div`
  margin: auto;
  width: 80%;
  overflow: hidden;
  white-space: nowrap;
  display: inline-block;
  text-overflow: ellipsis;
`;

const FileIcon = styled(File)`
  margin: auto;
  width: 2.5rem;
  height: 2.5rem;
  padding: 0.5rem;
  border-radius: 50%;
  background-color: #f5f5f5;
`;
const CloseFile = styled(X)`
  position: relative;
  width: 25px;
  height: 25px;
  background-color: #bbbbbb;
  cursor: pointer;
  border-radius: 50%;
  margin-left: -20px;
  margin-top: -10px;
  &:hover {
    filter: brightness(0.8);
  }
`;
const MoreFile = styled(ImageAdd)`
  width: 55px;
  height: 55px;
  padding: 5px;
  margin: auto;
  cursor: pointer;
  background-color: #d7d7d7;
  border-radius: 10px;
  &:hover {
    color: #696868;
  }
`;
const WrapperInput = styled.div`
  display: flex;
  height: 100%;
  width: 100%;
`;
const FeaturesTop = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
  padding: 5px;
  ${({ hasfile }) => (hasfile ? 'display:none' : '')};
`;

const IConUploadImage = styled(Photograph)`
  width: 2rem;
  height: 2rem;
  padding: 5px;
  ${HoverMixin.default};
  border-radius: 50%;
  margin-left: 15px;
`;
const IconUploadFile = styled(PaperClip)`
  width: 2rem;
  height: 2rem;
  padding: 5px;
  ${HoverMixin.default};
  border-radius: 50%;
  margin-left: 15px;
`;

const FeaturesRight = styled.div`
  display: flex;
  justify-content: center;
  position: relative;
`;
const SendMessenger = styled(Send)`
  width: 2.5rem;
  height: 2.5rem;
  padding: 5px;
  margin-top: 10%;
  transition: all 0.3s ease-in-out;
  &:hover {
    transform: rotate(-90deg);
    cursor: pointer;
  }
`;
const SendIconHolder = styled.div`
  font-size: 20px;
  width: 2.5rem;
  height: 2.5rem;
  padding: 5px;
  margin-top: 10%;
  transition: all 0.3s ease-in-out;
  text-align: center;
  cursor: pointer;
  border-radius: 50%;
  &:hover {
    filter: brightness(0.8);
  }
`;
const EmojiIcon = styled(EmojiHappy)`
  width: 1.5rem;
  height: 1.5rem;
  padding: 1px;
  position: absolute;
  right: 100%;
  ${HoverMixin.default};
  border-radius: 50%;
  margin: 12px 8px;
  background-color: #fff;
`;

const Input = styled.textarea`
  white-space: pre-wrap;
  margin-bottom: 0;
  padding: 10px;
  resize: none;
  border: 1px solid #ccc;
  display: block;
  width: 100%;
  font-size: 1.1rem;
  font-weight: 400;
  line-height: 1.5;
  color: #495057;
  border-radius: 5px;
  transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
  &:focus {
    outline: 0;
    border-color: #80bdff;
  }
`;
const IconSticker = styled(StickerTest)`
  width: 2rem;
  height: 2rem;
  padding: 5px;
  border-radius: 50%;
  ${HoverMixin.default};
`;

const WrapperDialog = styled.div`
  position: absolute;
  transform: translateY(-100%);
  right: 0;
`;

const InputHolder = styled.input`
  display: none;
`;
const YoutubeWrapper = styled.div`
  position: fixed;
  left: 50%;
  top: -200px;
  z-index: 10;
  width: 300px;
  padding: 5px;
  &:hover {
    opacity: 1;
  }

  img {
    width: 50px;
    height: 50px;
    margin-left: 125px;
    border-radius: 50%;
    animation: rotating 7s linear;
    animation-iteration-count: infinite;
    animation-delay: 0ms;
    @keyframes rotating {
      0% {
        transform: rotate(0deg);
      }
      100% {
        transform: rotate(360deg);
      }
    }
  }
  transition: 1s all;
  ${({ showVideoPlayer }) => (showVideoPlayer ? 'top: 0px;' : '')}
`;
const YoutubeRow = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
`;
const YoutubePlayer = styled(YouTube)`
  display: none;
`;
const IconYoutube = css`
  width: 2rem;
  height: 2rem;
  cursor: pointer;
`;
const PlayIcon = styled(Play)`
  ${IconYoutube}
`;
const PauseIcon = styled(Pause)`
  ${IconYoutube}
`;
const MuteIcon = styled(VolumeMute)`
  ${IconYoutube}
  width: 1.5rem;
  height: 1.5rem;
`;
const StopIcon = styled(Stop)`
  ${IconYoutube}
`;
const UnmuteIcon = styled(VolumeFull)`
  ${IconYoutube}
  width: 1.5rem;
  height: 1.5rem;
`;
const InfiniteIcon = styled(Infinite)`
  ${IconYoutube}
  ${({ isLoop }) => (isLoop ? 'color: #a51085' : '')}
`;
const MusicAvatar = styled.div`
  position: fixed;
  z-index: 10;
  top: 10px;
  left: calc(50% + 125px);
  img {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    animation: rotating 7s linear;
    animation-iteration-count: infinite;
    animation-delay: 0ms;
    @keyframes rotating {
      0% {
        transform: rotate(0deg);
      }
      100% {
        transform: rotate(360deg);
      }
    }
  }
  transition: 0.5s opacity;
  /* transition-duration: 2s; */

  ${({ showVideoPlayer }) => (showVideoPlayer ? 'opacity: 0;' : 'opacity: 1;')}
`;
const TitleVideo = styled.div`
  padding-top: 20px;
  text-align: center;
`;
const PlayMusic = styled.div`
  @media (max-width: 420px) {
    display: none;
  }
`;
function ChatBox({
  onSendMessage,
  onTyping,
  WindowEmpty,
  listFile,
  onSendFiles,
  messageReceived,
}) {
  const dispatch = useDispatch();
  const socket = useSelector(getSocket);
  const [message, setMessage] = React.useState('');
  const typingTimeoutRef = React.useRef(null);
  const [showPicker, setShowPicker] = React.useState(false);
  const { roomId } = useParams();
  const chatBoxRef = React.useRef(null);
  const partner = useSelector(getPartner);
  React.useEffect(() => {
    if (!showPicker) chatBoxRef.current.focus();
  }, [showPicker]);

  const handleKeyPress = (e) => {
    clearTimeout(typingTimeoutRef.current);
    if (+partner.AccountId === +roomId) {
      onTyping({
        isTyping: true,
        partnerId: roomId,
      });
    }
  };

  const handleKeyUp = (e) => {
    clearTimeout(typingTimeoutRef.current);
    const value = e.currentTarget.value;
    setMessage(value);
    if (!onTyping) return;
    typingTimeoutRef.current = setTimeout(() => {
      if (+partner.AccountId === +roomId) {
        onTyping({
          isTyping: false,
          partnerId: roomId,
        });
      }
    }, 1000);
  };
  useEffect(async () => {
    let message = messageReceived.Content;
    if (/^!!play [1-5]/.test(message)) {
      const videoId = await playLastVideoListSearched(
        YourAccountId,
        message,
        roomId,
        socket,
        dispatch,
        1
      );
      setIsPlaying(true);
      setIdVideoYoutube(videoId);
      return;
    }
    if (/^!!pause/.test(message)) handlePauseClick(1);
    else if (/^!!play/.test(message)) handlePlayClick(1);
    else if (/^!!mute/.test(message)) handleUnmuteIconClick(1);
    else if (/^!!unmute/.test(message)) handleMuteIconClick(1);
    else if (/^!!stop/.test(message)) StopClick(1);
  }, [messageReceived]);
  const onSendClick = async (e) => {
    e.preventDefault();

    if (/^!!play [1-5]/.test(message)) {
      const videoId = await playLastVideoListSearched(
        YourAccountId,
        message,
        roomId,
        socket,
        dispatch
      );
      const rs = await fetch(
        `https://www.googleapis.com/youtube/v3/videos?key=AIzaSyD42QBJSa1Uxp_0LA3lrvS7GG0ZA8aSr2A&id=${videoId}&part=snippet`
      );
      const data = await rs.json();
      setvideoAvatar(data.items[0]?.snippet?.thumbnails?.default?.url);
      setIsPlaying(true);
      setIdVideoYoutube(videoId);
      setMessage('');
      return;
    } else if (/^!!weather/.test(message))
      getWeatherNextFewDay(navigator, dispatch, socket, roomId);
    else if (/^!!play /.test(message)) {
      await searchYoutubeData(message, roomId, socket, dispatch);
      setMessage('');
      return;
    }
    if (isPlaying) {
      if (/^!!pause/.test(message)) handlePauseClick(1);
      else if (/^!!play/.test(message)) handlePlayClick(1);
      else if (/^!!mute/.test(message)) handleUnmuteIconClick(1);
      else if (/^!!unmute/.test(message)) handleMuteIconClick(1);
      else if (/^!!stop/.test(message)) StopClick(1);
    }
    if ((!message || message.trim().length === 0) && !files[0]) return;
    if (message.length > 1000) onSendMessage(message.slice(0, 1000), 0);
    else onSendMessage(message, 0);
    //type 0 : text
    setMessage('');
    const fileTempUpload = files;
    setFiles([]);
    const fileTemp = await uploadFile(fileTempUpload);
    if (fileTemp) onSendFiles(fileTemp);
    setShowPicker(false);
  };
  const onPreviewEmoji = () => {
    setShowPicker((prev) => !prev);
    chatBoxRef.current.blur();
  };

  const onEmojiClick = (emoji) => {
    setMessage(message + emoji.native);
  };
  //file upload
  const fileImageRef = React.useRef(null);
  const fileAddRef = React.useRef(null);
  const onUploadFile = (e) => {
    fileImageRef.current.click();
  };
  const [files, setFiles] = React.useState([]);
  const onFileChange = async (e) => {
    const check = await checkFileSize(Object.values(e.target.files), 5, 5);
    if (check) setFiles(Object.values(e.target.files));
    e.target.value = null;
  };
  const handleCloseFileClick = (index) => {
    setFiles((files) => {
      const temp = files.filter((item, i) => {
        return i !== index;
      });
      return temp;
    });
  };
  React.useEffect(() => {
    listFile(files);
  }, [files]);

  const onAddFileChange = async (e) => {
    const check = await checkFileSize(Object.values(e.target.files), 5);
    if (check) setFiles([...files, ...e.target.files]);
    e.target.value = null;
  };
  const handleAddMoreFileClick = () => {
    fileAddRef.current.click();
  };
  //Send Icon button
  const listRelationship = useSelector(getListRelationshipSelector);
  const user = listRelationship.filter(
    (item) =>
      item.RelatedAccountId == roomId || item.RelatingAccountId == roomId
  )[0];
  const YourAccountId =
    user?.AccountId === user?.RelatedAccountId
      ? user?.RelatingAccountId
      : user?.RelatedAccountId;
  var buttonIcon;
  if (files.length > 0) buttonIcon = false;
  else buttonIcon = user?.ButtonIcon;
  const handleOnIconSendButton = () => {
    onSendMessage(user?.ButtonIcon, 0);
  };
  // Playing youtube music
  const [isPlaying, setIsPlaying] = React.useState(false);
  const [isPause, setIsPause] = React.useState(false);
  const [idVideoYoutube, setIdVideoYoutube] = React.useState('');
  const [control, setControl] = React.useState(false);
  const [isMute, setIsMute] = React.useState(false);
  const [isLoop, setIsLoop] = React.useState(false);
  const [videoAvatar, setvideoAvatar] = React.useState('');
  const [titleMusic, setTitleMusic] = React.useState('');
  const checkElapsedTime = (e) => {
    setControl(e.target);
    document.getElementById('volumeVideoYoutube').value = e.target.getVolume();
    setTitleMusic(e.target.getVideoData()?.title);
    // console.log(e.target.getDuration());
    console.log(e.target.getCurrentTime());
  };
  const StopClick = (value) => {
    setIsPlaying(false);
    setIdVideoYoutube('');
    control.stopVideo();
    setIsMute(false);
    if (!(value === 1)) onSendMessage('!!stop', 0);
  };
  const handlePauseClick = (value) => {
    control.pauseVideo();
    setIsPause(true);
    if (!(value === 1)) onSendMessage('!!pause', 0);
  };
  const handlePlayClick = (value) => {
    control.playVideo();
    setIsPause(false);
    if (!(value === 1)) onSendMessage('!!play', 0);
  };
  const handleUnmuteIconClick = (value) => {
    control.mute();
    setIsMute(true);
    if (!(value === 1)) onSendMessage('!!mute', 0);
  };
  const handleMuteIconClick = (value) => {
    control.unMute();
    setIsMute(false);
    if (!(value === 1)) onSendMessage('!!unmute', 0);
  };
  const handleLoopIconClick = () => {
    setIsLoop(!isLoop);
  };
  //end playing music
  const [showVideoPlayer, setShowVideoPlayer] = React.useState(false);
  document.onmousemove = handleMouseMove;
  function handleMouseMove(event) {
    if (event.y < 180) setShowVideoPlayer(true);
    else setShowVideoPlayer(false);
  }
  return (
    <Wrapper WindowEmpty={WindowEmpty}>
      {isPlaying && idVideoYoutube && (
        <PlayMusic>
          <MusicAvatar showVideoPlayer={showVideoPlayer}>
            <img src={videoAvatar} />
          </MusicAvatar>
          <YoutubeWrapper showVideoPlayer={showVideoPlayer}>
            <img src={videoAvatar} />
            <TitleVideo>{titleMusic}</TitleVideo>
            <YoutubePlayer
              id="video1"
              videoId={idVideoYoutube}
              containerClassName="embed embed-youtube"
              onStateChange={(e) => checkElapsedTime(e)}
              opts={{ playerVars: { autoplay: 1 } }}
            />

            <YoutubeRow>
              <input
                id="volumeVideoYoutube"
                type="range"
                min="0"
                max="100"
                onChange={(e) => {
                  control.setVolume(e.target.value);
                }}
              />
              {!isMute ? (
                <UnmuteIcon onClick={handleUnmuteIconClick} />
              ) : (
                <MuteIcon onClick={handleMuteIconClick} />
              )}
            </YoutubeRow>
            <YoutubeRow>
              {isPause ? (
                <PlayIcon onClick={handlePlayClick} />
              ) : (
                <PauseIcon onClick={handlePauseClick} />
              )}
              <StopIcon onClick={StopClick} />
              <InfiniteIcon isLoop={isLoop} onClick={handleLoopIconClick} />
            </YoutubeRow>
          </YoutubeWrapper>
        </PlayMusic>
      )}
      <div>
        {files[0] && (
          <FileWrapper>
            {files.map((file, index) => (
              <FileInput key={index}>
                {file.type.includes('image') ? (
                  <img src={URL.createObjectURL(file)} alt="image" />
                ) : file.type.includes('video') ? (
                  <VideoWrapper>
                    <video src={URL.createObjectURL(file)} alt="video" />
                    <IconPlayVideo />
                  </VideoWrapper>
                ) : (
                  <FileDisplayWrapper>
                    <FileIcon />
                    <FileName>{file.name}</FileName>
                  </FileDisplayWrapper>
                )}
                <CloseFile
                  onClick={() => {
                    handleCloseFileClick(index);
                  }}
                />
              </FileInput>
            ))}
            <FileInput>
              <MoreFile onClick={handleAddMoreFileClick} />
            </FileInput>
          </FileWrapper>
        )}
        <Row>
          <Col lg={12}>
            <FeaturesTop hasfile={files[0] ? true : false}>
              <IconSticker />
              <IConUploadImage onClick={onUploadFile} />
              <IconUploadFile onClick={onUploadFile} />
            </FeaturesTop>
          </Col>
        </Row>

        <Row>
          <Col lg={12}>
            <WrapperInput>
              <InputHolder
                ref={fileImageRef}
                type="file"
                onChange={onFileChange}
                multiple="multiple"
              />
              <InputHolder
                ref={fileAddRef}
                type="file"
                onChange={onAddFileChange}
                multiple="multiple"
              />
              <Input
                ref={chatBoxRef}
                onKeyUp={handleKeyUp}
                onKeyPress={handleKeyPress}
                onChange={(e) => setMessage(e.target.value)}
                value={message}
                onKeyDown={(e) =>
                  e.key === 'Enter' && !e.shiftKey && onSendClick(e)
                }
                onFocus={() => setShowPicker(false)}
                rows={1}
                placeholder="Aa"
                autoFocus
              />
              <FeaturesRight>
                <WrapperDialog>
                  {showPicker && (
                    <NimblePicker
                      onSelect={onEmojiClick}
                      native={true}
                      data={data}
                      set={'google'}
                      emojiSize={32}
                      perLine={6}
                      sheetSize={32}
                      showSkinTones={false}
                      showPreview={false}
                    />
                  )}
                </WrapperDialog>
                <EmojiIcon onClick={onPreviewEmoji} />
                {buttonIcon ? (
                  <SendIconHolder onClick={handleOnIconSendButton}>
                    {buttonIcon}
                  </SendIconHolder>
                ) : (
                  <SendMessenger onClick={onSendClick} />
                )}
              </FeaturesRight>
            </WrapperInput>
          </Col>
        </Row>
      </div>
    </Wrapper>
  );
}
export default ChatBox;
