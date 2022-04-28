import { UserCheck, UserPlus, UserX } from '@styled-icons/boxicons-solid';
import { getListConversation } from 'app/actions/conversations';
import { getListFriendRecommended } from 'app/actions/listFriendRecommended';
import { getListRelationship } from 'app/actions/listRelationship';
import { getNotificationCount } from 'app/actions/notificationCount';
import { AddFriend } from 'app/actions/partnerProfile';
import { getConversations } from 'app/selectors/conversations';
import { getListFriendRecommendedSelector } from 'app/selectors/listFriendRecommended';
import { getListRelationshipSelector } from 'app/selectors/listRelationship';
import { getAuth } from 'app/selectors/login';
import { getSocket } from 'app/selectors/socket';
import React from 'react';
import { Button, Row } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import styled, { css } from 'styled-components';
import { useNavigate } from '../../../../node_modules/react-router-dom/index';
import messageAudio from 'assets/audio/messengerSound.mp3';

const RightSideWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  flex-direction: column;
  width: 100%;
  border-left: 1px solid black;
  overflow-x: hidden;
  height: 100vh;
  justify-content: flex-start;
`;
const Header = styled.div`
  padding: 10px;
  width: 100%;
  background-color: #efeff3;
  border-bottom: 1px solid #d6dbe0;
`;
const RowBS = styled(Row)`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  margin-left: 10px;

  @media (max-width: 680px) {
    margin-left: 2px;
  }
`;
const CardFriend = css`
  border-radius: 10px;
  justify-items: center;
  display: flex;
  flex-direction: column;
  padding: 1rem;
  border: 1px solid #d6dbe0;
  margin: 10px;
  width: 235px;
  @media (max-width: 1250px) {
    width: 10.5rem;
  }
  @media (max-width: 680px) {
    width: 6rem;
    margin-top: 5px;
    margin: 2px;
  }
`;

const CardFriendRequest = styled.div`
  ${CardFriend}
`;

const CardFriendRecommend = styled.div`
  ${CardFriend}
  @media (max-width: 1250px) {
    width: 10.5rem;
    height: 14.5rem;
  }
  @media (max-width: 680px) {
    width: 6rem;
    height: 7rem;
    margin-top: 5px;
    margin: 2px;
  }
`;

const Title = styled.div`
  margin: 4px 0 5px 10px;
  color: #3a4bcb;
`;

const Avatar = styled.div`
  text-align: center;
  cursor: pointer;
  img {
    width: 100px;
    height: 100px;
    border-radius: 50%;
    object-fit: cover;
    @media (max-width: 1250px) {
      width: 80px;
      height: 80px;
    }
    @media (max-width: 680px) {
      width: 40px;
      height: 40px;
    }
  }
`;

const Name = styled.div`
  font-size: 1.4rem;
  font-weight: bold;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  text-align: center;
  @media (max-width: 1250px) {
    font-size: 1.2rem;
  }
  @media (max-width: 680px) {
    font-size: 0.7rem;
  }
`;
const Description = styled.div`
  font-size: 0.9rem;
  width: 100%;
  margin-top: 10px;
  @media (max-width: 1250px) {
    font-size: 0.8rem;
  }
  @media (max-width: 680px) {
    display: none;
  }
`;

const ButtonBS = styled(Button)`
  display: flex;
  justify-content: center;
  width: 100%;
  margin: 0px auto;
  margin-top: auto;
  background-color: #ffffff;
  color: #000000;
  margin-top: 10px;
  @media (max-width: 680px) {
    margin-top: 5px;
    padding: 0px;
  }
`;
const AddFriendButton = styled(ButtonBS)`
  @media (max-width: 1250px) {
    font-size: 0.8rem;
    padding: 0.3rem;
  }
  @media (max-width: 680px) {
    font-size: 0.5em;
    padding: 0.05rem 0.05rem 0.05rem 0.05rem;
  }
`;
const Icon = css`
  width: 1.3rem;
  height: 1.3rem;
  margin-right: 5px;
  @media (max-width: 680px) {
    display: none;
  }
`;
const AddFriendIcon = styled(UserPlus)`
  ${Icon}
`;
const RemoveIcon = styled(UserX)`
  ${Icon}
`;
const AcceptIcon = styled(UserCheck)`
  ${Icon}
`;

const AcceptButton = styled(ButtonBS)`
  @media (max-width: 1250px) {
    font-size: 0.8rem;
    padding: 0.3rem;
  }
  @media (max-width: 680px) {
    font-size: 0.6em;
    padding: 0.1rem 0.05rem 0.1rem 0.05rem;
  }
`;
const RemoveButton = styled(ButtonBS)`
  @media (max-width: 1250px) {
    font-size: 0.8rem;
    padding: 0.3rem;
  }
  @media (max-width: 680px) {
    font-size: 0.6em;
    padding: 0.1rem 0.05rem 0.1rem 0.05rem;
  }
`;
const TopFriendRequest = styled.div`
  border-bottom: 1px solid #d6dbe0;
`;
function updateRelationship(AccountId, id, type, dispatch) {
  if (AccountId < id)
    dispatch(AddFriend(AccountId, id, type)).then(() =>
      dispatch(getListRelationship(AccountId))
    );
  else
    dispatch(AddFriend(id, AccountId, type)).then(() =>
      dispatch(getListRelationship(AccountId))
    );
}

export default function RightSide() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const AccountId = useSelector(getAuth)?.accountId;
  const listRelationship = useSelector(getListRelationshipSelector);
  const listFriendRecommended = useSelector(getListFriendRecommendedSelector);
  React.useEffect(() => {
    dispatch(getListRelationship(AccountId));
    dispatch(getListFriendRecommended(AccountId));
  }, []);

  const newListRelationship = listRelationship?.filter(
    (item) =>
      (item.Type === 'rsendpending' && item.RelatedAccountId !== AccountId) ||
      (item.Type === 'lsendpending' && item.RelatingAccountId !== AccountId)
  );
  const handleAcceptClick = (id) => {
    updateRelationship(AccountId, id, 'friend', dispatch);
    dispatch(getListRelationship(AccountId));
  };
  const HandleRemoveClick = (id) => {
    updateRelationship(AccountId, id, 'delete', dispatch);
    dispatch(getListRelationship(AccountId));
  };
  const handleAvatarClick = (AccountId) => {
    navigate(`/userinfor/${AccountId}`);
  };
  const handleAddfriendClick = (id) => {
    if (AccountId < id)
      dispatch(AddFriend(AccountId, id, 'lsendpending')).then(() => {
        dispatch(getListFriendRecommended(AccountId));
      });
    else
      dispatch(AddFriend(id, AccountId, 'rsendpending')).then(() => {
        dispatch(getListFriendRecommended(AccountId));
      });
  };
  //notification
  React.useEffect(() => {
    dispatch(
      getNotificationCount(notificationChat, newListRelationship.length)
    );
  }, [newListRelationship]);
  const listConversation = useSelector(getConversations);
  const socket = useSelector(getSocket);
  var notificationChat = 0;
  listConversation.forEach((item) => {
    if (item.UnseenMessage != null && item.LastMessage !== null)
      notificationChat += item.UnseenMessage > 0 ? 1 : 0;
  });
  var audio = new Audio(messageAudio);
  React.useEffect(() => {
    socket?.on('chat message', (data) => {
      dispatch(getListConversation(AccountId));
      audio.play();
    });
    return () => {
      socket?.off('chat message');
    };
  }, [socket]);
  React.useEffect(() => {
    dispatch(
      getNotificationCount(notificationChat, newListRelationship.length)
    );
  }, [notificationChat]);
  return (
    <RightSideWrapper>
      <Header>Friend you may know...</Header>
      {newListRelationship?.length > 0 && (
        <Title>Friend Requests({newListRelationship.length})</Title>
      )}
      <TopFriendRequest>
        <RowBS>
          {newListRelationship.map((item, index) => (
            <CardFriendRequest key={index}>
              <Avatar
                onClick={() => {
                  handleAvatarClick(
                    item.RelatedAccountId === AccountId
                      ? item.RelatingAccountId
                      : item.RelatedAccountId
                  );
                }}
              >
                <img src={item.Avatar} alt="avatar" />
              </Avatar>
              <Name>{item.Name} asdasd</Name>
              <AcceptButton
                onClick={(e) => {
                  handleAcceptClick(
                    item.RelatedAccountId === AccountId
                      ? item.RelatingAccountId
                      : item.RelatedAccountId
                  );
                }}
              >
                <AcceptIcon /> Accept
              </AcceptButton>
              <RemoveButton
                onClick={() => {
                  HandleRemoveClick(
                    item.RelatedAccountId === AccountId
                      ? item.RelatingAccountId
                      : item.RelatedAccountId
                  );
                }}
              >
                <RemoveIcon />
                Remove
              </RemoveButton>
            </CardFriendRequest>
          ))}
        </RowBS>
      </TopFriendRequest>
      {listFriendRecommended.length > 0 && (
        <Title>
          Recommend ({listFriendRecommended?.length} <AddFriendIcon />)
        </Title>
      )}
      <RowBS>
        {listFriendRecommended.map((item, index) => (
          <CardFriendRecommend key={index}>
            <Avatar
              onClick={() => {
                handleAvatarClick(item.AccountId);
              }}
            >
              <img src={item.Avatar} alt="avatar" />
            </Avatar>
            <Name>{item.Name}</Name>
            <Description>From friend recommended</Description>
            <AddFriendButton
              onClick={() => {
                handleAddfriendClick(item.AccountId);
              }}
            >
              <AddFriendIcon />
              Add Friend
            </AddFriendButton>
          </CardFriendRecommend>
        ))}
      </RowBS>
    </RightSideWrapper>
  );
}
