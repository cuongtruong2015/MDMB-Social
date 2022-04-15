import { CheckCircle } from '@styled-icons/heroicons-solid';
import { PlayCircle } from '@styled-icons/boxicons-regular';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import CardLink from 'features/ChatOverView/ChatWindow/WindowContent/Messages/CardMessage/CardLink';
import React from 'react';
import { Col, Form, Row } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import isValidURL from 'utils/validUrl';
import { File } from '@styled-icons/boxicons-solid';
import {
  Navigate,
  useNavigate,
} from '../../../../../../../node_modules/react-router-dom/index';
import LazyLoad from 'react-lazy-load';
dayjs.extend(relativeTime);

const Wrapper = styled.div`
  display: flex;
  margin-bottom: 25px;
  justify-content: ${({ owner }) => (owner === 1 ? 'flex-end' : 'flex-start')};
`;
const WrapperContent = styled.div`
  transition: 0s;
  border-radius: ${({ owner }) =>
    owner ? ' 10px 10px 0 10px' : ' 0px 10px 10px 10px'};
  border-bottom: 3px solid;
  border-bottom-color: ${({ owner }) => (owner === 1 ? '#f8f8fa' : '#d0bddc')};
  background-color: ${({ owner }) => (owner === 1 ? '#f0f0f6' : '#6049cd')};
  color: ${({ owner }) => (owner === 1 ? '#000000' : '#e7e7f1')};
  max-width: 800px;
  font-size: 14px;
  /* min-width: 200px; */
  position: relative;
`;

const WrapperMessage = styled.div`
  padding: 10px;
  position: ${({ owner }) => (owner === 1 ? 'relative' : 'static')};
  word-break: break-all;
  overflow: hidden;
`;

const Avatar = styled.div`
  padding-right: 10px;
  display: ${({ owner }) => (owner === 1 ? 'none' : 'block')};
  img {
    width: 52px;
    height: 52px;
    padding: 4px;
    border-radius: 50%;
    object-fit: cover;
  }
`;
const Name = styled.h4`
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 8px;
  display: block;
  position: relative;
`;
const Message = styled.div`
  font-size: 14px;
  white-space: pre-wrap;
  a {
    :hover {
      text-decoration: underline;
    }
  }
`;
const Time = styled(Form.Text)`
  font-size: 0.7rem;
  position: absolute;
  right: ${({ owner }) => (owner ? '0' : '')};
  left: ${({ owner }) => (owner ? '' : '0')};
  color: rgb(118, 118, 118);
  white-space: nowrap;
`;

const AvatarSeen = styled.div`
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
  img {
    width: 32px;
    height: 32px;
    padding: 4px;
    border-radius: 50%;
    object-fit: cover;
  }
`;
const AvatarSeenLatest = styled.div`
  position: absolute;
  right: 0;
  transform: translateY(-50%);
  display: flex;
  justify-content: flex-start;
  img {
    width: 32px;
    height: 32px;
    padding: 4px;
    border-radius: 50%;
    object-fit: cover;
  }
`;

const SentStatus = styled(CheckCircle)`
  width: 1rem;
  height: 1rem;
  color: #4849a1;
`;
const ImageMessageWrapper = styled.div`
  max-height: 200px;
  cursor: pointer;

  img,
  video {
    max-width: 200px;
    max-height: 200px;
    margin-bottom: 10px;
    border-radius: 4%;
    &:hover {
    }
  }
`;
const IconPlay = styled(PlayCircle)`
  position: relative;
  width: 4rem;
  margin-top: -200%;
  margin-left: 20%;
  color: #fff;
`;
const FileMessageWrapper = styled.div`
  display: flex;
  flex-direction: flex-row;
  justify-content: flex-start;
  align-items: center;
  &:hover {
    cursor: pointer;
  }
`;
const FileIcon = styled(File)`
  width: 2.5rem;
  height: 2.5rem;
  padding: 0.5rem;
  border-radius: 50%;
  background-color: ${({ owner }) => (owner ? '#e8e8ea;' : '#6956c9;')};
`;
const NameFile = styled.div`
  margin-left: 3px;
`;
const NicknameChanged = styled.div`
  justify-content: center;
  width: 100%;
  text-align: center;
  font-size: 0.8rem;
  filter: opacity(0.5);
`;
function CardMessage(props) {
  const {
    name,
    avatar,
    content,
    sentDate,
    seenDate,
    owner,
    type,
    // onSeenMessage,
    fromAccount,
    messageId,
    seenLatest,
    idLastMessage,
  } = props;
  const navigate = useNavigate();
  const regexContainLink =
    /[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/;
  var pattern = new RegExp(
    '^(https?:\\/\\/)?' + // protocol
      '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
      '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
      '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
      '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
      '(\\#[-a-z\\d_]*)?$',
    'i'
  ); // fragment locator
  let isLink = regexContainLink.test(content);
  if (isLink) {
    var url = content.match(regexContainLink)[0];
    isLink = !!pattern.test(url);
  }
  return (
    <Wrapper owner={owner ? 1 : 0}>
      {type === 4 ? (
        <NicknameChanged>{content}</NicknameChanged>
      ) : (
        <div>
          <Avatar owner={owner ? 1 : 0}>
            <img src={avatar} alt="" />
          </Avatar>
          <Row>
            <Col lg={12}>
              {!owner && <Name>{name}</Name>}
              <WrapperContent owner={owner ? 1 : 0}>
                <WrapperMessage owner={owner ? 1 : 0}>
                  <Message>
                    {type === 0 ? (
                      isLink ? (
                        <CardLink url={url} content={content} owner={owner} />
                      ) : (
                        content
                      )
                    ) : type === 1 ? (
                      <ImageMessageWrapper>
                        <img src={content} alt="" />
                      </ImageMessageWrapper>
                    ) : type === 2 ? (
                      <ImageMessageWrapper>
                        <video src={content} alt="" />
                        <div>
                          <IconPlay />
                        </div>
                      </ImageMessageWrapper>
                    ) : (
                      type === 3 && (
                        <FileMessageWrapper
                          onClick={() => (window.location.href = content)}
                        >
                          <FileIcon owner={owner} />
                          <NameFile>
                            {decodeURIComponent(
                              ''.concat(
                                content?.substring(
                                  content?.indexOf('%2F') + 3,
                                  content?.indexOf('?')
                                )
                              )
                            )}
                          </NameFile>
                        </FileMessageWrapper>
                      )
                    )}
                  </Message>
                </WrapperMessage>

                {!owner && (
                  <Time owner={owner ? 1 : 0}>{dayjs(sentDate).fromNow()}</Time>
                )}
                {owner && (
                  <Time owner={owner ? 1 : 0}>{dayjs(sentDate).fromNow()}</Time>
                )}
              </WrapperContent>

              {seenLatest && !owner && (
                <AvatarSeenLatest>
                  <img src={avatar} alt="" />
                </AvatarSeenLatest>
              )}
              {seenLatest && owner && (
                <AvatarSeen>
                  <img src={avatar} alt="" />
                </AvatarSeen>
              )}
              {idLastMessage === messageId && !seenLatest && owner && (
                <AvatarSeen>
                  <SentStatus />
                </AvatarSeen>
              )}
            </Col>
          </Row>
        </div>
      )}
    </Wrapper>
  );
}
export default CardMessage;
