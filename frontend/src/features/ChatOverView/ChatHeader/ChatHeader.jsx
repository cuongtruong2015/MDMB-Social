import { Circle } from '@styled-icons/boxicons-solid';
import { DotsVertical, VideoCamera } from '@styled-icons/heroicons-solid';
import { getPartner } from 'app/selectors/chat';
import { getUsersOnline } from 'app/selectors/socket';
import ToggleTheme from 'components/ToggleTheme';
import { useToggle } from 'hooks';
import React from 'react';
import { Col, Row } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { getListRelationshipSelector } from 'app/selectors/listRelationship';

const Wrapper = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 10px 0;
  box-shadow: rgba(255, 255, 255, 0.1) 0px 1px 1px 0px inset,
    rgba(50, 50, 93, 0.25) 0px 50px 100px -20px,
    rgba(0, 0, 0, 0.3) 0px 30px 60px -30px;
  visibility: ${(props) => (props.WindowEmpty ? 'hidden' : 'none')};
`;
const WrapperInfoPadding = styled.div``;

const WrapperInfo = styled.div`
  display: flex;
`;
const WrapperText = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 100px;
`;
const Avatar = styled.div`
  margin-right: 10px;
  margin-left: 4px;
  img {
    width: 52px;
    height: 52px;
    border: 1px solid rgba(255, 255, 255, 0.75);
    border-radius: 50%;
    object-fit: cover;
  }
  &:hover {
    cursor: pointer;
    filter: brightness(120%);
  }
`;
const Name = styled.h3`
  font-size: 1.2rem;
  font-weight: bold;
  margin-bottom: 5px;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
  &:hover {
    cursor: pointer;
    text-decoration: underline;
  }
  @media (max-width: 600px) {
    font-size: 1rem;
    margin-top: 5px;
  }
`;
const Status = styled.span`
  font-size: 0.8rem;
  color: #aaa;
  padding: 2px 5px;
  border-radius: 5px;
  width: 100%;
  display: flex;
`;
const WrapperFeaturesPadding = styled.div``;
const Features = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
`;
const Feature = styled.div`
  background: #f5f5f5;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  justify-content: center;
  cursor: pointer;
  :hover {
    background: #fff;
    transition: all 0.3s ease-in;
  }
`;

const FeatureVideoWrapper = styled(Feature)`
  margin-left: 10px;
`;
const IconVideo = styled(VideoCamera)`
  width: 1.4rem;
`;
const FeatureOtherWrapper = styled(Feature)`
  margin-left: 10px;
`;
const IconOther = styled(DotsVertical)`
  width: 1.4rem;
`;
const Online = styled(Circle)`
  width: 0.5rem;
  vertical-align: middle;
  margin-right: 5px;
  margin-bottom: 0.2rem;
  color: #16dc80;
`;
const Offline = styled(Circle)`
  width: 0.5rem;
  vertical-align: middle;
  margin-right: 5px;
  margin-bottom: 0.2rem;
  color: #aaa;
`;
const StyledColLeft = styled(Col)`
  width: 70%;
  @media (max-width: 1000px) {
    width: calc(100% - 180px);
  }
`;
const StyledColRight = styled(Col)`
  width: 30%;
  margin-left: auto;
  @media (max-width: 1000px) {
    width: 180px;
  }
`;
const FutureSwitchWrapper = styled(Feature)`
  margin-left: 10px;
  @media (max-width: 500px) {
    visibility: hidden;
  }
`;

const StatusText = styled.span``;
function ChatHeader({ WindowEmpty, onClickChatInfor }) {
  const [isDark, setIsDark] = useToggle(false);
  const listAccountOnline = useSelector(getUsersOnline);
  const partner = useSelector(getPartner);
  const toggleTheme = () => {
    setIsDark(!isDark);
  };

  const navigate = useNavigate();
  const { roomId } = useParams();
  const handleAvatarClick = () => {
    navigate(`userinfor/${roomId}`);
  };
  const handleIconOtherClick = () => {
    onClickChatInfor();
  };
  var Nickname = null;
  const listRelationship = useSelector(getListRelationshipSelector);
  const user = listRelationship.filter(
    (item) =>
      +item?.RelatedAccountId === +roomId ||
      +item?.RelatingAccountId === +roomId
  )[0];
  if(+user?.RelatingAccountId===+roomId) Nickname=user?.RelatingAccountNickname;
  else Nickname=user?.RelatedAccountNickname;
  return (
    <Wrapper WindowEmpty={WindowEmpty}>
      <Row className="w-100">
        <StyledColLeft lg={8}>
          <WrapperInfoPadding>
            <WrapperInfo>
              <Avatar onClick={handleAvatarClick}>
                <img src={user.Avatar} alt="avatar" />
              </Avatar>
              <WrapperText>
                <Name onClick={handleAvatarClick}>{Nickname?Nickname:user.Name}</Name>
                <Status>
                  {listAccountOnline?.includes(partner?.AccountId) ? (
                    <>
                      <Online />
                      <StatusText>Online</StatusText>
                    </>
                  ) : (
                    <>
                      <Offline />
                      <StatusText>Offline</StatusText>
                    </>
                  )}
                </Status>
              </WrapperText>
            </WrapperInfo>
          </WrapperInfoPadding>
        </StyledColLeft>
        <StyledColRight lg={4}>
          <WrapperFeaturesPadding className="h-100">
            <Features className="h-100">
              <FutureSwitchWrapper onClick={toggleTheme}>
                <ToggleTheme />
              </FutureSwitchWrapper>
              <FeatureVideoWrapper>
                <IconVideo />
              </FeatureVideoWrapper>
              <FeatureOtherWrapper onClick={handleIconOtherClick}>
                <IconOther />
              </FeatureOtherWrapper>
            </Features>
          </WrapperFeaturesPadding>
        </StyledColRight>
      </Row>
    </Wrapper>
  );
}

export default ChatHeader;
