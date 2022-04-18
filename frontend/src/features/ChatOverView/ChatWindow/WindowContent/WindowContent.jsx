import { getFetchingMessage, getListMessageLatest } from 'app/selectors/chat';
import MessageEmpty from 'features/ChatOverView/ChatWindow/WindowContent/MessageEmpty/MessageEmpty';
import MessageLoading from 'features/ChatOverView/ChatWindow/WindowContent/MessageLoading/MessageLoading';
import Messages from 'features/ChatOverView/ChatWindow/WindowContent/Messages/Messages';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
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
function WindowContent({ typing, onSeenMessage, showMediaOverlay }) {
  const dispatch = useDispatch();
  const messagesLatest = useSelector(getListMessageLatest);
  const isFetching = useSelector(getFetchingMessage);
  const [getMoreMessage, setGetMoreMessage] = React.useState(false);
  const handleScroll = (e) => {
    if (e.target.scrollTop === 0 && !isFetching) setGetMoreMessage(true);
    else setGetMoreMessage(false);
  };

  return (
    <Wrapper onScroll={handleScroll}>
      {isFetching ? (
        <MessageLoadingWrapper>
          <MessageLoading />
        </MessageLoadingWrapper>
      ) : messagesLatest && messagesLatest.length > 0 ? (
        <Messages
          typing={typing}
          onSeenMessage={onSeenMessage}
          onGetMoreMessage={getMoreMessage}
          listMessages={messagesLatest}
          showMediaOverlay={showMediaOverlay}
        />
      ) : (
        <MessageEmpty />
      )}
    </Wrapper>
  );
}
export default WindowContent;
