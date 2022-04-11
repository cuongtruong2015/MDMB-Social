import { Send, File, ImageAdd } from '@styled-icons/boxicons-solid';
import { EmojiHappy } from '@styled-icons/heroicons-outline';
import { PaperClip, Photograph } from '@styled-icons/heroicons-solid';
import { getPartner } from 'app/selectors/chat';
import { ReactComponent as StickerTest } from 'assets/images/icons/sticker.svg';
import { NimblePicker } from 'emoji-mart';
import data from 'emoji-mart/data/google.json';
import React from 'react';
import { Col, Row } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import { HoverMixin } from 'styles/mixinStyles';
import { X, PlayCircle } from '@styled-icons/boxicons-regular';
import { checkFileSize, uploadFile } from 'components/FileStore/FileStore';

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

function ChatBox({
  onSendMessage,
  onTyping,
  WindowEmpty,
  listFile,
  onSendFiles,
}) {
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
  const onSendClick = async (e) => {
    e.preventDefault();
    if ((!message  || message.trim().length === 0)&& !files[0]) return;
    if (message.length > 1000) onSendMessage(message.slice(0, 1000), 0);
    else onSendMessage(message, 0);
    //type 0 : text
    setMessage('');
    const fileTempUpload = files;
    setFiles([]);
    const fileTemp = await uploadFile(fileTempUpload);
    setTimeout(() => {
      if (fileTemp) onSendFiles(fileTemp);
    }, 1000);
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
    const check = await checkFileSize(Object.values(e.target.files), 5);
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
  // console.log((files[0]?.size / 1024 / 1024).toFixed(2));
  return (
    <Wrapper WindowEmpty={WindowEmpty}>
      <div>
        {files[0] && (
          <FileWrapper>
            {files.map((file, index) => (
              <FileInput key={index}>
                {file.type.includes('image') ? (
                  <img src={URL.createObjectURL(file)} alt="avatar" />
                ) : file.type.includes('video') ? (
                  <VideoWrapper>
                    <video src={URL.createObjectURL(file)} alt="avatar" />
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
              <IconUploadFile />
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
                <SendMessenger onClick={onSendClick} />
              </FeaturesRight>
            </WrapperInput>
          </Col>
        </Row>
      </div>
    </Wrapper>
  );
}
export default ChatBox;
