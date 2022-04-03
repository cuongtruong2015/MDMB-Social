import {
  getListMessageLatest,
  getPartner,
  getMessageSeenLatest,
} from 'app/selectors/chat';
import { getAuth } from 'app/selectors/login';
import CardMessage from 'features/ChatOverView/ChatWindow/WindowContent/Messages/CardMessage/CardMessage';
import React from 'react';
import { useSelector } from 'react-redux';
import styled, { keyframes } from 'styled-components';
import { useParams } from 'react-router-dom';

const dotTyping = keyframes`
  0% {
    box-shadow: 9984px 0 0 0 #9880ff, 9999px 0 0 0 #9880ff, 10014px 0 0 0 #9880ff;
  }
  16.667% {
    box-shadow: 9984px -10px 0 0 #9880ff, 9999px 0 0 0 #9880ff, 10014px 0 0 0 #9880ff;
  }
  33.333% {
    box-shadow: 9984px 0 0 0 #9880ff, 9999px 0 0 0 #9880ff, 10014px 0 0 0 #9880ff;
  }
  50% {
    box-shadow: 9984px 0 0 0 #9880ff, 9999px -10px 0 0 #9880ff, 10014px 0 0 0 #9880ff;
  }
  66.667% {
    box-shadow: 9984px 0 0 0 #9880ff, 9999px 0 0 0 #9880ff, 10014px 0 0 0 #9880ff;
  }
  83.333% {
    box-shadow: 9984px 0 0 0 #9880ff, 9999px 0 0 0 #9880ff, 10014px -10px 0 0 #9880ff;
  }
  100% {
    box-shadow: 9984px 0 0 0 #9880ff, 9999px 0 0 0 #9880ff, 10014px 0 0 0 #9880ff;
  }
`;
const Wrapper = styled.div`
  display: flex;
  margin-bottom: 25px;
  padding: 0 62px;
`;
const WrapperContent = styled.div`
  transition: 0s;
  border-radius: 0px 25px 25px 25px;
  border-bottom: 3px solid #81d4f9;
  background: linear-gradient(90deg, #cfd9df 0%, #e2ebf0 100%);
  color: #434354;
  width: 80px;
  position: relative;
`;
const WrapperMessage = styled.div`
  padding: 10px;
`;

const CardTyping = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;
const DotFalling = styled.div`
  position: relative;
  left: -9999px;
  width: 8px;
  height: 8px;
  border-radius: 5px;
  background-color: #9880ff;
  color: #9880ff;
  box-shadow: 9984px 0 0 0 #9880ff, 9999px 0 0 0 #9880ff, 10014px 0 0 0 #9880ff;
  animation: ${dotTyping} 1.5s infinite linear;
`;

const WrapperScroll = styled.div`
  position: relative;
`;

function Messages({ typing, onSeenMessage }) {
  const messagesLatest = useSelector(getListMessageLatest);
  const myAccountId = useSelector(getAuth)?.accountId;
  const messageSeenDateLatest = useSelector(getMessageSeenLatest);
  const messagesEndRef = React.useRef(null);
  const partner = useSelector(getPartner);

  React.useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      // behavior: 'smooth',
      block: 'end',
      inline: 'nearest',
    });
  }, [messagesLatest]);
  const { roomId } = useParams();

  const maxMessage = messagesLatest.reduce(function (prev, current) {
    return prev.MessageId > current.MessageId ? prev : current;
  });
  React.useEffect(() => {
    const timer = setTimeout(() => {
      if (!maxMessage?.SeenDate && +roomId === +maxMessage?.FromAccount) {
        onSeenMessage(maxMessage.MessageId, roomId);
        console.log('asdasd');
      }
    }, 100);
    return () => {
      clearTimeout(timer);
    };
  }, [roomId]);
  return (
    <>
      {messagesLatest.map((item) => (
        <WrapperScroll key={item.MessageId}>
          <CardMessage
            messageId={item.MessageId}
            seenDate={item.SeenDate}
            sentDate={item.SentDate}
            name={partner.Name}
            avatar={partner.Avatar}
            fromAccount={item.FromAccount}
            content={item.Content}
            type={item.Type === 0 ? 'text' : 'image'}
            owner={item.FromAccount === myAccountId}
            // onSeenMessage={onSeenMessage}
            seenLatest={messageSeenDateLatest?.MessageId === item.MessageId}
            idLastMessage={messagesLatest[messagesLatest.length - 1].MessageId}
          />
        </WrapperScroll>
      ))}
      {typing && (
        <Wrapper>
          <WrapperContent>
            <WrapperMessage>
              <CardTyping>
                <DotFalling />
              </CardTyping>
            </WrapperMessage>
          </WrapperContent>
        </Wrapper>
      )}
      <div ref={messagesEndRef} />
    </>
  );
}
export default Messages;
