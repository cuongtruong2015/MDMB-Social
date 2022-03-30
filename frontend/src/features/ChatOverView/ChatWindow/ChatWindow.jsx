import ChatInput from 'features/ChatOverView/ChatBox/ChatBox';
import ChatHeader from 'features/ChatOverView/ChatHeader/ChatHeader';
import WindowContent from 'features/ChatOverView/ChatWindow/WindowContent/WindowContent';
import React from 'react';
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
  height: calc(100vh - 170px);
  display: flex;
  flex-direction: column-reverse;
  align-items: flex-start;
  width: 100%;
`;
const RowBS = styled(Row)`
  height: inherit;
  margin: 0;
`;
const ColBS = styled(Col)``;

function ChatWindow({ onSendMessage, onTyping, typing, onSeenMessage }) {
  const { roomId } = useParams();
  return (
    <Wrapper>
      <ChatHeader WindowEmpty={roomId ? false : true} />
      <RowMessageInner>
        <WrapperMessageContent>
          <WindowContent typing={typing} onSeenMessage={onSeenMessage} />
        </WrapperMessageContent>
      </RowMessageInner>
      <RowBS>
        <ColBS>
          <ChatInput
            onSendMessage={onSendMessage}
            onTyping={onTyping}
            WindowEmpty={roomId ? false : true}
          />
        </ColBS>
      </RowBS>
    </Wrapper>
  );
}
export default ChatWindow;
