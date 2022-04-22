import ChatInput from 'features/ChatOverView/ChatBox/ChatBox';
import ChatHeader from 'features/ChatOverView/ChatHeader/ChatHeader';
import WindowContent from 'features/ChatOverView/ChatWindow/WindowContent/WindowContent';
import React, { useEffect } from 'react';
import { Col, Row } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  height: 100%;
`;
const RowMessageInner = styled(Row)`
  margin: 0;
`;
const WrapperMessageContent = styled.div`
  padding: 10px;
  overflow: auto;
  /* height: calc(100vh - 250px); */
  display: flex;
  flex-direction: column-reverse;
  align-items: flex-start;
  width: 100%;
  height: ${({ hasFileInput }) =>
    hasFileInput ? 'calc(100vh - 220px)' : 'calc(100vh - 170px)'};
`;
const RowBS = styled(Row)`
  height: inherit;
  margin: 0;
`;

const ColBS = styled(Col)``;

function ChatWindow({
  onSendMessage,
  onTyping,
  typing,
  onSeenMessage,
  onSendFiles,
  onClickChatInfor,
  showMediaOverlay,
  messageReceived,
}) {
  const { roomId } = useParams();
  const [hasFileInput, setHasFileInput] = React.useState(false);
  const listFile = (files) => {
    if (files[0]) setHasFileInput(true);
    else setHasFileInput(false);
  };
  return (
    <Wrapper>
      <ChatHeader
        WindowEmpty={roomId ? false : true}
        onClickChatInfor={onClickChatInfor}
      />
      <RowMessageInner>
        <WrapperMessageContent hasFileInput={hasFileInput}>
          <WindowContent
            typing={typing}
            onSeenMessage={onSeenMessage}
            showMediaOverlay={showMediaOverlay}
          />
        </WrapperMessageContent>
      </RowMessageInner>
      <RowBS>
        <ColBS>
          <ChatInput
            onSendMessage={onSendMessage}
            onTyping={onTyping}
            WindowEmpty={roomId ? false : true}
            listFile={listFile}
            onSendFiles={onSendFiles}
            messageReceived={messageReceived}
          />
        </ColBS>
      </RowBS>
    </Wrapper>
  );
}
export default ChatWindow;
