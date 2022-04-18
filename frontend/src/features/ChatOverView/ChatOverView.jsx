import {
  getMessagesLatest,
  receiveMessage,
  selectRoom,
  sendMessage,
  updateSeenMessage,
} from 'app/actions/chat';
import {
  getListConversation,
  updateCountUnreadConversation,
  updateListConversationWithNewMessage,
  updateListConversationWithSeenMessage,
  updateListConversationWithSentMessage,
} from 'app/actions/conversations';
import {
  addUserOffline,
  addUserOnline,
  getListUsersOnline,
  initSocket,
} from 'app/actions/socket';
import { getConversations } from 'app/selectors/conversations';
import { getAuth } from 'app/selectors/login';
import { notificationCountSelector } from 'app/selectors/notificationCount';
import { getSocket } from 'app/selectors/socket';
import LoadingOverlay from 'components/LoadingOverlay';
import ChatConversations from 'features/ChatOverView/ChatConversations/ChatConversations';
import ChatWindow from 'features/ChatOverView/ChatWindow/ChatWindow';
import WindowEmpty from 'features/ChatOverView/ChatWindow/WindowEmpty/WindowEmpty';
import Sidebar from 'features/ChatOverView/Sidebar/Sidebar';
import React from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';
import { SetNotification } from 'components/Notification/notification';
import { getListRelationshipSelector } from 'app/selectors/listRelationship';
import messageAudio from 'assets/audio/messengerSound.mp3';
import { getListRelationship } from 'app/actions/listRelationship';
import { getNotificationCount } from 'app/actions/notificationCount';
import ChatInformation from './ChatInformation/ChatInformation';
import { getUserProfile } from 'app/actions/userProfile';
import { getUserProfileSelector } from 'app/selectors/userProfile';
import { removeOlderMessage } from 'app/actions/olderMessage';
import { getFetchingMessage } from 'app/selectors/chat';
import MediaOverlay from 'features/ChatOverView/MediaOverlay/MediaOverlay';
const Wrapper = styled(Container)`
  height: 100vh;
  overflow: hidden;
  padding-right: 0;
`;
const RowBS = styled(Row)`
  height: inherit;
`;
const ColBS1 = styled(Col)`
  padding-left: 0;
  padding-right: 0;
  background-color: #efeff3;
  width: 25%;
  @media (max-width: 1250px) {
    width: calc(100% - 90px);
    display: ${(props) => (props.active ? 'none' : 'unset')};
  }
`;
const ColBS2 = styled(Col)`
  padding-left: 0;
  padding-right: 0;
  /* width: calc(75% - 80px); */
  @media (max-width: 1250px) {
    width: calc(100% - 90px);
    display: ${(props) => (props.active ? 'unset' : 'none')};
  }
  width: ${({ showinforright }) =>
    showinforright ? 'calc(50% - 80px)' : 'calc(75% - 80px)'};
  transition: all 0.3s;
`;
const LeftBar = styled(Col)`
  padding-left: 0;
  padding-right: 0;
  width: 80px;
  background-color: #efeff3;
`;
const ColBS3 = styled(Col)`
  padding-left: 0;
  padding-right: 0;
  width: 25%;
  /* width: ${(showInforRight) => (showInforRight ? '25%' : '0px')};
  ${({ showInforRight }) =>
    showInforRight ? 'display:unset' : 'display:none'}; */
  transition: all 0.3s;
  z-index: 2;
  background-color: #fff;
`;
function ChatOverView() {
  const auth = useSelector(getAuth);
  const dispatch = useDispatch();
  const { roomId } = useParams();

  const navigate = useNavigate();
  const socket = useSelector(getSocket);
  const listConversation = useSelector(getConversations);
  const [typing, setTyping] = React.useState(false);

  React.useEffect(() => {
    if (!socket) {
      dispatch(initSocket(auth?.accountId, auth?.accessToken));
    }
    dispatch(getListConversation(auth?.accountId));
  }, [auth?.accessToken, socket, dispatch]);
  React.useEffect(() => {
    const listAccountId = listConversation.map((item) => item.AccountId);
    socket?.emit('get online', listAccountId, (data) => {
      dispatch(getListUsersOnline(data));
    });
  }, [socket, dispatch, listConversation]);

  React.useEffect(() => {
    socket?.on('user-online', function (accountId) {
      dispatch(addUserOnline(accountId));
    });
    socket?.on('user-offline', function (accountId) {
      dispatch(addUserOffline(accountId));
    });
  }, [dispatch, socket]);

  React.useEffect(() => {
    socket?.on('typing', (userId) => {
      if (+userId === +roomId) {
        setTyping(true);
      } else {
        setTyping(false);
      }
    });

    socket?.on('stop typing', (userId) => {
      if (+userId === +roomId) {
        setTyping(false);
      } else {
        setTyping(false);
      }
    });
  }, [roomId, socket]);

  React.useEffect(() => {
    socket?.on('seen message', (messageId) => {
      dispatch(updateSeenMessage(messageId));
      dispatch(updateListConversationWithSeenMessage(roomId));
    });
  }, [socket]);

  React.useEffect(() => {
    socket?.on('chat message', (data) => {
      var noti;
      const user = listRelationship.filter(
        (item) =>
          item.RelatedAccountId == data?.FromAccount ||
          item.RelatingAccountId == data?.FromAccount
      )[0];
      if (
        (+user?.RelatingAccountId === +data?.FromAccount &&
          user?.Notification === 1) ||
        (+user?.RelatedAccountId === +data?.FromAccount &&
          user?.Notification === 2) ||
        notification === 3
      )
        noti = false;
      else noti = true;
      if (noti) audio.play();
      if (roomId) {
        if (
          data.ToAccount === auth?.accountId &&
          data.FromAccount === +roomId
        ) {
          dispatch(receiveMessage(data));
        }
      }
      dispatch(updateListConversationWithNewMessage(data));
    });
    return () => {
      socket?.off('chat message');
    };
  }, [roomId, socket]);

  const handleTyping = ({ isTyping, partnerId }) => {
    if (isTyping) {
      socket?.emit('typing', partnerId);
    } else {
      socket?.emit('stop typing', partnerId);
    }
  };

  const handleSendMessage = (message, type) => {
    socket?.emit('chat message', message, type, roomId, (status, data) => {
      if (status === 'ok' && +data.ToAccount === +roomId) {
        dispatch(sendMessage(data));
        dispatch(updateListConversationWithSentMessage(data, 0));
      }
    });
  };

  const handleSelectRoomClick = (conversation) => {
    if (+conversation.AccountId !== +roomId) {
      dispatch(selectRoom(conversation, navigate));
      dispatch(getMessagesLatest(auth?.accountId, conversation.AccountId));
      dispatch(removeOlderMessage());
    }
  };

  const handleSeenMessage = (latestMessageId, partnerId) => {
    if (latestMessageId) {
      dispatch(updateSeenMessage(latestMessageId));
      dispatch(updateCountUnreadConversation(partnerId));
      socket?.emit('seen message', latestMessageId);
    }
  };
  //notification
  const AccountId = auth?.accountId;
  const listRelationship = useSelector(getListRelationshipSelector);
  const newListRelationship = listRelationship?.filter(
    (item) =>
      (item.Type === 'rsendpending' && item.RelatedAccountId !== AccountId) ||
      (item.Type === 'lsendpending' && item.RelatingAccountId !== AccountId)
  );

  var notificationChat = 0;
  listConversation.forEach((item) => {
    if (item.UnseenMessage != null)
      notificationChat += item.UnseenMessage > 0 ? 1 : 0;
  });
  const notification = useSelector(notificationCountSelector);
  var audio = new Audio(messageAudio);
  React.useEffect(() => {
    dispatch(
      getNotificationCount(notificationChat, newListRelationship.length)
    );
  }, [notificationChat, newListRelationship.length]);
  React.useEffect(() => {
    dispatch(getListConversation(AccountId));
    dispatch(getListRelationship(AccountId));
    dispatch(getUserProfile(AccountId));
  }, []);
  //end notification
  //sendfile
  const handleSendFiles = (files) => {
    files?.map((file) => {
      var Type = file.type.includes('image')
        ? 1
        : file.type.includes('video')
        ? 2
        : 3;
      socket?.emit(
        'chat message',
        file.downloadURL,
        Type,
        roomId,
        (status, data) => {
          if (status === 'ok' && +data.ToAccount === +roomId) {
            dispatch(sendMessage(data));
            dispatch(updateListConversationWithSentMessage(data, Type));
          }
        }
      );
    });
  };
  //end sendfile
  //Click ChatInfor
  // var ShowInforRight = false;
  const [showInforRight, setShowInforRight] = React.useState(false);
  const handleClickChatInfor = () => {
    setShowInforRight(!showInforRight);
  };
  React.useEffect(() => {
    setShowInforRight(false);
  }, [roomId]);
  const userInfo = useSelector(getUserProfileSelector);

  //end Click ChatInfor
  //mediaOverlay
  const [showOverlay, setShowOverlay] = React.useState(false);
  const [mediaCenter, setMediaCenter] = React.useState([]);
  const showMediaOverlay = (item) => {
    setShowOverlay(true);
    setShowInforRight(true);
    setMediaCenter(item);
  };
  const disableMediaOverlay = () => {
    setShowOverlay(false);
  };
  //end MediaOverlay
  return socket ? (
    <Wrapper fluid>
      <RowBS>
        {showOverlay ? (
          <MediaOverlay
            disableMediaOverlay={disableMediaOverlay}
            media={mediaCenter}
          />
        ) : (
          <>
            <LeftBar lg={1} xs={1} md={1}>
              <Sidebar MessageActive={true} />
            </LeftBar>
            <ColBS1 lg={3} xs={3} md={3} active={roomId ? 1 : 0}>
              <ChatConversations onSelectRoom={handleSelectRoomClick} />
            </ColBS1>
            <ColBS2
              lg={8}
              xs={8}
              md={8}
              active={roomId ? 1 : 0}
              showinforright={showInforRight ? 1 : 0}
            >
              {roomId ? (
                <ChatWindow
                  onSendMessage={handleSendMessage}
                  onTyping={handleTyping}
                  myAccountId={auth?.accountId}
                  typing={typing}
                  onSeenMessage={handleSeenMessage}
                  onSendFiles={handleSendFiles}
                  onClickChatInfor={handleClickChatInfor}
                  showMediaOverlay={showMediaOverlay}
                />
              ) : (
                <WindowEmpty />
              )}
            </ColBS2>
          </>
        )}
        {showInforRight && (
          <ColBS3>
            <ChatInformation
              partnerId={roomId}
              userInfo={userInfo}
              showMediaOverlay={showMediaOverlay}
              showOverlay={showOverlay}
            />
          </ColBS3>
        )}
      </RowBS>
    </Wrapper>
  ) : (
    <LoadingOverlay />
  );
}

export default ChatOverView;
