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
import {
  changeIcon,
  ChangeNickname,
  handleNotification,
  removeButtonIcon,
} from 'utils/ChatInfor';
import { getSocket } from 'app/selectors/socket';
import { NimblePicker } from 'emoji-mart';
import data from 'emoji-mart/data/google.json';
import { X } from '@styled-icons/heroicons-outline';
import { Modal, Button } from 'react-bootstrap';
import { FastForwardCircle } from '../../../../node_modules/@styled-icons/boxicons-regular/index';

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
const EmojiModal = styled(Modal)`
  width: fit-content;
  height: fit-content;
  margin-left: 40%;
  margin-top: 5%;
  justify-content: center;
  background-color: transparent;
  .modal-content {
    background-color: transparent;
  }
`;

const HeaderEmojiDialog = styled.div`
  text-align: center;
  font-weight: bold;
  font-size: 1.2rem;
`;
const CurrentEmojiWrapper = styled.div`
  margin-top: 10px;
  display: flex;
  flex-direction: row;
  align-items: center;
`;
const Text = styled.div``;
const EmojiHolder = styled.div`
  border: none;
  margin-left: 10px;
`;
const RemoveEmojiIcon = styled(X)`
  width: 1.2rem;
  height: 1.2rem;
  text-align: center;
`;
const ButtonRemoveEmoji = styled.button`
  white-space: nowrap;
  display: flex;
  border: 1px solid #e6e3e3;
  padding: 4px;
  border-radius: 6px;
  background-color: #e6e3e3;
  margin-left: auto;
  margin-right: 20px;
  align-items: center;
  cursor: pointer;
  &:hover {
    filter: brightness(70%);
  }
`;
const BodyModal = styled.div`
  padding: 20px;
  background-color: #fff;
  border: 1px solid #e6e3e3;
  border-radius: 10px;
`;
export default function ChatInformation({ partnerId, userInfo }) {
  const socket = useSelector(getSocket);
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
    handleNotification(Swal, dispatch, user, userApi, notification, partnerId);
  };
  const OnlineStatus =
    LastOnline < 5 || listAccountOnline?.includes(partnerId)
      ? 'Online'
      : LastOnline < 60
      ? LastOnline.toFixed(0) + ' minutes ago'
      : LastOnline / 60 < 24
      ? (LastOnline / 60).toFixed(0) + ' hours ago'
      : (LastOnline / 60 / 24).toFixed(0) + ' days ago';

  //change Nickname
  const HandleChangeNickname = () => {
    ChangeNickname(dispatch, socket, Swal, user, Nickname, userInfo, userApi);
  };
  const [showEmojiDialog, setShowEmojiDialog] = React.useState(false);
  const handleEmojiCustomClick = () => {
    setShowEmojiDialog(true);
  };
  const [currentEmoji, setCurrentEmoji] = React.useState(user.ButtonIcon);
  const onEmojiClick = (data) => {
    setCurrentEmoji(data.native);
    setShowEmojiDialog(false);
    changeIcon(data.native, user, userApi, dispatch, socket);
  };
  const handleRemoveButtonIcon = () => {
    removeButtonIcon(data.native, user, userApi, dispatch, socket);
    setShowEmojiDialog(false);
  };
  return (
    <Wrapper>
      <EmojiModal
        show={showEmojiDialog}
        onHide={() => {
          setShowEmojiDialog(false);
        }}
      >
        <BodyModal>
          <HeaderEmojiDialog>Pick Your Button Emoji</HeaderEmojiDialog>
          {currentEmoji && (
            <CurrentEmojiWrapper>
              <Text>Current Icon:</Text>
              <EmojiHolder>{currentEmoji}</EmojiHolder>
              <ButtonRemoveEmoji onClick={handleRemoveButtonIcon}>
                <RemoveEmojiIcon />
                Remove
              </ButtonRemoveEmoji>
            </CurrentEmojiWrapper>
          )}
          <NimblePicker
            style={{
              border: '0px',
              borderRadius: '0px',
            }}
            onSelect={onEmojiClick}
            native={true}
            data={data}
            set={'google'}
            emojiSize={32}
            perLine={6}
            sheetSize={32}
            showSkinTones={false}
            skinTone={1}
            showPreview={false}
            showSearch={false}
          />
        </BodyModal>
      </EmojiModal>

      <Avatar>
        <img src={user?.Avatar} alt="avatar" />
      </Avatar>
      <Name onClick={redirecteUserInfor}>{user?.Name}</Name>
      <Online>{OnlineStatus}</Online>
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
            <CustomFeature onClick={handleEmojiCustomClick}>
              <IconHolder>😆</IconHolder>
              <NameCustom>Change send emotion</NameCustom>
            </CustomFeature>
            <CustomFeature onClick={HandleChangeNickname}>
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
          <HeaderName>Media, Files</HeaderName>
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
