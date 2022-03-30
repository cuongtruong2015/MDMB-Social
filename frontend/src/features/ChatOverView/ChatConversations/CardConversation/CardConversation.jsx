import { CheckCircle } from '@styled-icons/heroicons-solid';
import { getUsersOnline } from 'app/selectors/socket';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { Col, Row } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { Circle } from '@styled-icons/boxicons-solid';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';

dayjs.extend(relativeTime);

const Wrapper = styled.div`
  padding: 10px 0 10px 0;
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  transition-duration: 0.2s;
  overflow-y: hidden;
  overflow-x: hidden;
  border-bottom: 1px solid #ced4da;
  border-left: ${(props) => (props.checked ? '3px solid #cd556b' : 'none')};
  background: ${(props) =>
    props.checked
      ? 'linear-gradient(90deg, #f1a7ac 0%, #eeb0b4 50%, #fad0d0 60%,#e0e0e6 100%);'
      : 'none'};
  &:hover {
    background-color: #d8d3d3;
  }
`;
const Card = styled.div`
  display: flex;
  cursor: pointer;
`;
const CardContent = styled.div`
  display: flex;
  flex-direction: column;
  width: 48%;
`;

const Avatar = styled.div`
  width: 20%;
  img {
    width: 52px;
    height: 52px;
    border-radius: 50%;
    object-fit: cover;
    margin-left: 15%;
    @media (max-width: 385px) {
      margin-left: 5%;
    }
  }
`;

const MessageInner = styled.div`
  display: flex;
  justify-content: space-between;
  height: 100%;
`;
const Name = styled.h4`
  font-size: 16px;
  font-weight: bold;
  text-overflow: ellipsis;
`;
const Message = styled.p`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: 14px;
`;
const Status = styled.div`
  width: 32%;
`;
const Time = styled.p`
  font-size: 0.8rem;
  text-align: right;
  width: 100%;
  padding-right: 5%;
`;
const StatusInner = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  margin-right: 10%;
`;
const SentStatus = styled(CheckCircle)`
  width: 1rem;
  height: 1rem;
  margin-left: 80%;
  color: #4849a1;
`;
const SeenStatus = styled.img`
  content: url(${(props) => props.Avatar});
  width: 1rem;
  height: 1rem;
  border-radius: 50%;
`;

const WrapperNewMessage = styled.div`
  width: 1.5rem;
  height: 1.5rem;
  border-radius: 50%;
  background-color: #f15959;
  display: flex;
  align-items: center;
  justify-content: center;
`;
const LengthNewMessage = styled.div`
  color: #fff;
  font-size: 0.6rem;
  font-weight: bold;
`;
const Online = styled(Circle)`
  color: #16dc80;
  width: 1rem;
  height: 1rem;
  margin-left: -18px;
  margin-top: 40px;
`;
const Offline = styled(Circle)`
  position: relative;
  color: #aaa;
  width: 1rem;
  height: 1rem;
  margin-left: -18px;
  margin-top: 40px;
`;

function CardConversation({ onSelectRoom, conversation }) {
  const {
    Name: name,
    Avatar: avatar,
    LastMessage: lastMessage,
    SentDate,
    SeenDate,
    FromAccount,
    AccountId,
    UnseenMessage,
  } = conversation;

  const { roomId } = useParams();
  const listAccountOnline = useSelector(getUsersOnline);

  const onRoomChange = () => {
    onSelectRoom(conversation);
  };

  return (
    <Wrapper checked={+roomId === +conversation.AccountId}>
      <Row>
        <Col>
          <Card onClick={onRoomChange}>
            <Avatar>
              <img src={avatar} alt="" />
              {listAccountOnline.includes(AccountId) ? <Online /> : <Offline />}
            </Avatar>
            <CardContent>
              <Name> {name}</Name>
              <MessageInner>
                <Message>
                  {lastMessage
                    ? lastMessage
                    : 'You are now connected on MDMB Social'}
                </Message>
              </MessageInner>
            </CardContent>
            <Status>
              <Time>{lastMessage ? dayjs(SentDate).fromNow() : ''}</Time>
              <StatusInner>
                {UnseenMessage > 0 ? (
                  <WrapperNewMessage>
                    <LengthNewMessage>{UnseenMessage}</LengthNewMessage>
                  </WrapperNewMessage>
                ) : lastMessage ? (
                  SeenDate ? (
                    <SeenStatus Avatar={avatar} />
                  ) : (
                    <SentStatus />
                  )
                ) : FromAccount !== roomId ? (
                  <SeenStatus Avatar={avatar} />
                ) : (
                  <SentStatus />
                )}
              </StatusInner>
            </Status>
          </Card>
        </Col>
      </Row>
    </Wrapper>
  );
}

export default CardConversation;
