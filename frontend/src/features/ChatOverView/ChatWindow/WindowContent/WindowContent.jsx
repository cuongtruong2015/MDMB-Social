import { getFetchingMessage, getListMessageLatest } from 'app/selectors/chat';
import MessageEmpty from 'features/ChatOverView/ChatWindow/WindowContent/MessageEmpty/MessageEmpty';
import MessageLoading from 'features/ChatOverView/ChatWindow/WindowContent/MessageLoading/MessageLoading';
import Messages from 'features/ChatOverView/ChatWindow/WindowContent/Messages/Messages';
import React from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';

const Wrapper = styled.div`
  padding: 0px 5px;
  width: 100%;
  overflow-x: hidden;
  /* height: 100%; */
`;
const MessageLoadingWrapper = styled.div`
  position: relative;
  margin-bottom: 180px;
  padding: 30px;
`;
function WindowContent({ typing, onSeenMessage }) {
  const messagesLatest = useSelector(getListMessageLatest);
  const isFetching = useSelector(getFetchingMessage);

  return (
    <Wrapper>
      {isFetching ? (
        <MessageLoadingWrapper>
          <MessageLoading />
        </MessageLoadingWrapper>
      ) : messagesLatest && messagesLatest.length > 0 ? (
        <Messages typing={typing} onSeenMessage={onSeenMessage} />
      ) : (
        <MessageEmpty />
      )}
    </Wrapper>
  );
}
export default WindowContent;
