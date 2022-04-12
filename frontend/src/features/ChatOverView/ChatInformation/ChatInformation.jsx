import styled, { css } from 'styled-components';
import userApi from 'apis/userApi';
import React from 'react';
import LogoImg from 'assets/images/logos/logo.jpg';
import { getUsersOnline } from 'app/selectors/socket';
import { useDispatch, useSelector } from 'react-redux';
import {
  BellOff,
  BellRing,
  ChevronDown,
  ChevronUp,
  EditAlt,
} from '@styled-icons/boxicons-solid';
import { getListRelationshipSelector } from 'app/selectors/listRelationship';
import { useNavigate } from '../../../../node_modules/react-router-dom/index';
import Swal from 'sweetalert2';
import { getListRelationship } from 'app/actions/listRelationship';

const Wrapper = styled.div`
  padding: 10% 0px 10% 0px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-right: 20px;
`;
const Avatar = styled.div`
  img {
    width: 100px;
    height: 100px;
    border-radius: 50%;
    object-fit: cover;
  }
`;
const Name = styled.div`
  font-size: 1.2rem;
  font-weight: bold;
  &:hover {
    cursor: pointer;
    text-decoration: underline;
  }
`;
const Featuter = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
`;
const FeatuterWrapper = styled.div`
  margin: 10% 5% 5% 5%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;
const FeatureIconCss = css`
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 50%;
  padding: 5px;
  background-color: #d7d7d7;
  cursor: pointer;
  &:hover {
    filter: brightness(80%);
  }
`;
const Logo = styled.img`
  content: url(${LogoImg});
  ${FeatureIconCss};
`;
const FeatureName = styled.div`
  white-space: nowrap;
  font-size: 0.8rem;
`;
const Online = styled.div`
  font-size: 0.8rem;
`;
const IconNotificationOff = styled(BellOff)`
  ${FeatureIconCss};
`;
const IconNotificationOn = styled(BellRing)`
  ${FeatureIconCss};
`;
const CustomFeatureWrapper = styled.div`
  width: 100%;
  margin-top: 2%;
  padding: 2%;
  border-radius: 10px;
  background-color: #e6e3e3;
  &:hover {
    filter: ${({ show }) => (show ? 'unset' : 'brightness(80%)')};
  }
`;
const CustomFeature = styled.div`
  display: flex;
  padding: 5px;
  cursor: pointer;
  border-radius: 10px;
  &:hover {
    background-color: #cbc9c9;
  }
`;
const NameCustom = styled.div``;
const IconHolder = styled.div`
  margin-right: 5px;
`;
const HeaderCustom = styled.div`
  cursor: pointer;
  display: flex;
  justify-content: last baseline;
`;

const HeaderName = styled.div`
  font-size: 1.1rem;
`;
const DropdownIcon = styled(ChevronDown)`
  width: 1.5rem;
  height: 1.5rem;
  margin-left: auto;
  align-self: center;
`;
const DropdownAlreadyIcon = styled(ChevronUp)`
  width: 1.5rem;
  height: 1.5rem;
  margin-left: auto;
  align-self: center;
`;
const EditIcon = styled(EditAlt)`
  width: 1.5rem;
  height: 1.5rem;
`;
export default function ChatInformation({ partnerId }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const listAccountOnline = useSelector(getUsersOnline);
  const listRelationship = useSelector(getListRelationshipSelector);
  const user = listRelationship.filter(
    (item) =>
      item.RelatedAccountId == partnerId || item.RelatingAccountId == partnerId
  )[0];

  var Nickname = null;
  var notification = user?.Notification;
  if (+user?.RelatingAccountId === +partnerId)
    Nickname = user?.RelatingAccountNickname;
  else Nickname = user?.RelatedAccountNickname;
  if (
    (+user?.RelatingAccountId === +partnerId && notification === 1) ||
    (+user?.RelatedAccountId === +partnerId && notification === 2) ||
    notification === 3
  )
    notification = false;
  else notification = true;

  var LastOnline =
    (Date.parse(new Date()) - Date.parse(user?.LastOnline)) / 1000 / 3600;
  const [showCustomizeChat, setShowCustomizeChat] = React.useState(false);
  const [showMediaFile, setShowMediaFile] = React.useState(false);

  const handleChatCustomizeClick = () => {
    setShowCustomizeChat(!showCustomizeChat);
  };
  const handleMediaFileClick = () => {
    setShowMediaFile(!showMediaFile);
  };
  const redirecteUserInfor = () => {
    navigate(`userinfor/${partnerId}`);
  };
  const handleNotificationClick = () => {
    Swal.fire({
      title: `Do you want to turn ${notification ? 'off' : 'on'} notification?`,
      showDenyButton: notification ? true : false,
      showConfirmButton: notification ? false : true,
      showCancelButton: true,
      confirmButtonText: 'Turn on',
      denyButtonText: `Turn off`,
    }).then(async (result) => {
      if (result.isConfirmed) {
        /* Turn on notificafion*/
        var noti = 0;
        const userNoti = user.Notification;
        if (+user.RelatingAccountId === +partnerId && userNoti == 1) noti = 0;
        if (+user.RelatingAccountId === +partnerId && userNoti == 2) noti = 2;
        if (+user.RelatedAccountId === +partnerId && userNoti == 2) noti = 0;
        if (+user.RelatedAccountId === +partnerId && userNoti == 1) noti = 1;
        if (+user.RelatingAccountId === +partnerId && userNoti == 3) noti = 2;
        if (+user.RelatedAccountId === +partnerId && userNoti == 3) noti = 1;
        const rs = await userApi
          .updateAccountRelationship({
            RelatingAccountId: user.RelatingAccountId,
            RelatedAccountId: user.RelatedAccountId,
            Notification: noti,
          })
          .then((rs) => {
            dispatch(
              getListRelationship(
                +user?.RelatingAccountId === +partnerId
                  ? user.RelatedAccountId
                  : user.RelatingAccountId
              )
            );
            if (rs?.result) Swal.fire('Notification is on', '', 'success');
          });
      } else if (result.isDenied) {
        /* Turn off notificafion*/
        var noti = 3;
        const userNoti = user.Notification;
        if (+user.RelatingAccountId === +partnerId && userNoti == 0) noti = 1;
        if (+user.RelatedAccountId === +partnerId && userNoti == 0) noti = 2;
        if (+user.RelatingAccountId === +partnerId && userNoti == 2) noti = 3;
        if (+user.RelatedAccountId === +partnerId && userNoti == 1) noti = 3;
        const rs = await userApi
          .updateAccountRelationship({
            RelatingAccountId: user.RelatingAccountId,
            RelatedAccountId: user.RelatedAccountId,
            Notification: noti,
          })
          .then((rs) => {
            dispatch(
              getListRelationship(
                +user?.RelatingAccountId === +partnerId
                  ? user.RelatedAccountId
                  : user.RelatingAccountId
              )
            );
            if (rs?.result) Swal.fire('Notification is off', '', 'success');
          });
      }
    });
  };

  return (
    <Wrapper>
      <Avatar>
        <img src={user?.Avatar} alt="avatar" />
      </Avatar>
      <Name onClick={redirecteUserInfor}>
        {Nickname ? Nickname : user?.Name}
      </Name>
      <Online>
        {LastOnline < 5 || listAccountOnline?.includes(partnerId)
          ? Online
          : LastOnline < 60
          ? LastOnline.toFixed(0) + ' minutes ago'
          : LastOnline / 60 < 24
          ? (LastOnline / 60).toFixed(0) + ' hours ago'
          : (LastOnline / 60 / 24).toFixed(0) + ' days ago'}
      </Online>
      <Featuter>
        <FeatuterWrapper>
          <Logo onClick={redirecteUserInfor} />
          <FeatureName>Personal page</FeatureName>
        </FeatuterWrapper>
        <FeatuterWrapper>
          <div onClick={handleNotificationClick}>
            {!notification ? <IconNotificationOn /> : <IconNotificationOff />}
          </div>
          <FeatureName>{notification ? 'Turn off' : 'Turn on'}</FeatureName>
        </FeatuterWrapper>
      </Featuter>
      <CustomFeatureWrapper show={showCustomizeChat}>
        <HeaderCustom onClick={handleChatCustomizeClick}>
          <HeaderName>Customize chat</HeaderName>
          {showCustomizeChat ? <DropdownAlreadyIcon /> : <DropdownIcon />}
        </HeaderCustom>
        {showCustomizeChat && (
          <>
            <CustomFeature>
              <IconHolder>😆</IconHolder>
              <NameCustom>Change send emotion</NameCustom>
            </CustomFeature>
            <CustomFeature>
              <IconHolder>
                <EditIcon />
              </IconHolder>
              <NameCustom>Edit nickname</NameCustom>
            </CustomFeature>
          </>
        )}
      </CustomFeatureWrapper>

      <CustomFeatureWrapper show={showMediaFile}>
        <HeaderCustom onClick={handleMediaFileClick}>
          <HeaderName>Medias, Files</HeaderName>
          {showMediaFile ? <DropdownAlreadyIcon /> : <DropdownIcon />}
        </HeaderCustom>
        {showMediaFile && (
          <CustomFeature>
            <NameCustom>Change Icon</NameCustom>
          </CustomFeature>
        )}
      </CustomFeatureWrapper>
    </Wrapper>
  );
}
