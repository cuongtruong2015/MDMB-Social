import { PlayCircle } from '@styled-icons/boxicons-regular';
import { File } from '@styled-icons/boxicons-solid';
import { CheckCircle } from '@styled-icons/heroicons-solid';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import CardLink from 'features/ChatOverView/ChatWindow/WindowContent/Messages/CardMessage/CardLink';
import React from 'react';
import { Col, Form, Row } from 'react-bootstrap';
import styled from 'styled-components';
import { useNavigate } from '../../../../../../../node_modules/react-router-dom/index';
dayjs.extend(relativeTime);

const Wrapper = styled.div`
  display: flex;
  margin-bottom: 25px;
  justify-content: ${({ owner }) => (owner === 1 ? 'flex-end' : 'flex-start')};
`;
const WrapperCard = styled.div`
  display: flex;
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
  display: flex;
  cursor: pointer;
  img,
  video {
    height: fit-content;
    max-width: 200px;
    max-height: 200px;
    border-radius: 4%;
  }
`;
const ButtonVideo = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;
const IconPlay = styled(PlayCircle)`
  width: 1.5rem;
  height: 1.5rem;
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
const WeatherHeader = styled.div`
  font-size: 1.4rem;
  letter-spacing: 1px;
`;
const WeatherContentWrapper = styled.div`
  margin-left: 10px;
`;
const WeatherDate = styled.div`
  font-size: 1rem;
  font-weight: bold;
`;
const WeatherStatusWrapper = styled.div`
  margin-left: 10px;
`;
const WeatherStatus = styled.div`
  font-size: 0.9rem;
  font-weight: bold;
  margin-left: 5px;
`;
const WeatherDetailWrapper = styled.div`
  margin-left: 10px;
`;
const IconWeather = styled.span`
  img {
    width: 2rem;
    height: 2rem;
  }
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
    showMediaOverlay,
    item,
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
    var url = content.match(regexContainLink)?.[0];
    // isLink = pattern.test(url);
  }
  var weatherData;
  if (type === 8) weatherData = JSON.parse(content);
  return (
    <Wrapper owner={owner ? 1 : 0}>
      {type === 4 ? (
        <NicknameChanged>{content}</NicknameChanged>
      ) : (
        <WrapperCard>
          <Avatar owner={owner ? 1 : 0}>
            <img src={avatar} alt="" />
          </Avatar>
          <Row>
            <Col lg={12}>
              {!owner && <Name>{name}</Name>}
              <WrapperContent owner={owner ? 1 : 0}>
                <WrapperMessage owner={owner ? 1 : 0}>
                  {type === 2 && (
                    <ButtonVideo>
                      <IconPlay />
                    </ButtonVideo>
                  )}
                  <Message>
                    {type === 0 ? (
                      isLink ? (
                        <CardLink url={url} content={content} owner={owner} />
                      ) : (
                        content
                      )
                    ) : type === 1 ? (
                      <ImageMessageWrapper
                        onClick={() => showMediaOverlay(item)}
                      >
                        <img src={content} alt="" />
                      </ImageMessageWrapper>
                    ) : type === 2 ? (
                      <ImageMessageWrapper
                        onClick={() => showMediaOverlay(item)}
                      >
                        <video className="video" src={content} alt=""></video>
                      </ImageMessageWrapper>
                    ) : type === 3 ? (
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
                    ) : type === 5 ? (
                      content
                    ) : (
                      type === 8 && (
                        <>
                          <WeatherHeader>
                            Weather for next few days
                          </WeatherHeader>
                          {weatherData?.map((item, index) => (
                            <WeatherContentWrapper key={index}>
                              <WeatherDate>
                                - {item?.date?.trim()} : {item?.weather}
                              </WeatherDate>
                              {item?.status?.status?.map((i, indx) => (
                                <WeatherStatusWrapper key={indx}>
                                  <WeatherStatus>
                                    {i.time.split(' ')[0]}:
                                  </WeatherStatus>
                                  <WeatherDetailWrapper>
                                    {'Temp/Feels like:  '}
                                    {i.temp}??C/{i.feellike}??C
                                  </WeatherDetailWrapper>
                                  <WeatherDetailWrapper>
                                    {'humidity :  '}
                                    {i.humidity}%
                                  </WeatherDetailWrapper>
                                  <WeatherDetailWrapper>
                                    {'UV concentration :  '}
                                    {i.uv}
                                  </WeatherDetailWrapper>
                                </WeatherStatusWrapper>
                              ))}
                            </WeatherContentWrapper>
                          ))}
                        </>
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
        </WrapperCard>
      )}
    </Wrapper>
  );
}
export default CardMessage;
