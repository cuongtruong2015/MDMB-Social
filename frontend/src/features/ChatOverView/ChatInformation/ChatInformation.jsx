import {
  ArrowBack,
  File,
  Images,
  Link,
  PlayCircle,
  Search,
} from '@styled-icons/boxicons-regular';
import {
  BellOff,
  BellRing,
  ChevronDown,
  ChevronUp,
  EditAlt,
} from '@styled-icons/boxicons-solid';
import { X } from '@styled-icons/heroicons-outline';
import userApi from 'apis/userApi';
import {
  getFiles,
  getMedia,
  getLinks,
  removeMoreMedia,
  removeMoreFile,
  removeMoreLink,
} from 'app/actions/mediaAndFiles';
import { getListRelationshipSelector } from 'app/selectors/listRelationship';
import {
  filesSelector,
  mediaSelector,
  linksSelector,
} from 'app/selectors/mediaAndFiles';
import { getSocket, getUsersOnline } from 'app/selectors/socket';
import LogoImg from 'assets/images/logos/logo.jpg';
import { NimblePicker } from 'emoji-mart';
import data from 'emoji-mart/data/google.json';
import React, { useEffect } from 'react';
import { Modal } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import styled, { css } from 'styled-components';
import Swal from 'sweetalert2';
import {
  changeIcon,
  ChangeNickname,
  handleNotification,
  removeButtonIcon,
} from 'utils/ChatInfor';
import { useNavigate } from '../../../../node_modules/react-router-dom/index';
import Files from './MediaAndFiles/Files';
import Links from './MediaAndFiles/Link';
import MediaList from './MediaAndFiles/Media';
const Wrapper = styled.div`
  padding: 10% 0px 10% 0px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  margin-right: 20px;
  transition: 3s all;
  height: 100vh;
  z-index: 2;
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
  min-width: 40%;
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
const SearchIcon = styled(Search)`
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
  width: 1.5rem;
  height: 1.5rem;
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
const EditIcon = styled(EditAlt)``;

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
const MediaFileHeader = styled.div`
  margin-left: 10px;
`;
const SwapFeature = styled.div`
  display: flex;
  font-size: 1.3rem;
  flex-direction: row;
  justify-content: space-evenly;
`;
const AFeature = styled.div`
  width: 100px;
  text-align: center;
  cursor: pointer;
  background-color: #fff;
  border-radius: 10px 10px 0 0;
  &:hover {
    filter: brightness(0.8);
  }
  border-bottom: ${({ show }) => (show ? '3px solid #4849a1;' : 'unset')};
  color: ${({ show }) => (show ? '#5859b6' : 'unset')};
`;
const MediaFiles = styled.div`
  font-size: 1.3rem;
  display: flex;
  justify-content: flex-start;
  width: 100%;
  padding-left: 20px;
`;
const BackArowIcon = styled(ArrowBack)`
  cursor: pointer;
  border-radius: 50%;
  background-color: #fff;
  width: 2rem;
  height: 2rem;
  padding: 5px;
  align-items: center;

  &:hover {
    filter: brightness(0.8);
  }
`;
export default function ChatInformation({
  partnerId,
  userInfo,
  showMediaOverlay,
  showOverlay,
}) {
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
  const [currentEmoji, setCurrentEmoji] = React.useState(user?.ButtonIcon);
  const onEmojiClick = (data) => {
    setCurrentEmoji(data.native);
    setShowEmojiDialog(false);
    changeIcon(data.native, user, userApi, dispatch, socket);
  };
  const handleRemoveButtonIcon = () => {
    removeButtonIcon(data.native, user, userApi, dispatch, socket);
    setShowEmojiDialog(false);
  };
  // Media, Files, Link
  const [showMedia, setShowMedia] = React.useState(false);
  const [showFiles, setShowFiles] = React.useState(false);
  const [showLink, setShowLink] = React.useState(false);
  const handleMediaClick = () => {
    removeState();
    setShowMedia(true);
  };
  const handleFilesClick = () => {
    removeState();
    setShowFiles(true);
  };
  const handleLinkClick = () => {
    removeState();
    setShowLink(true);
  };
  const handleBackClick = () => {
    removeState();
  };
  const removeState = () => {
    setShowLink(false);
    setShowFiles(false);
    setShowMedia(false);
  };
  const listMedia = useSelector(mediaSelector);
  const listFiles = useSelector(filesSelector);
  const listLink = useSelector(linksSelector);
  useEffect(() => {
    if (showMedia) dispatch(getMedia(userInfo.AccountId, partnerId));
    if (showFiles) dispatch(getFiles(userInfo.AccountId, partnerId));
    if (showLink) dispatch(getLinks(userInfo.AccountId, partnerId));
  }, [showLink, showFiles, showMedia]);
  useEffect(() => {
    if (showOverlay) setShowMedia(true);
  }, [showOverlay]);
  const onMediaClick = (item) => {
    setShowMedia(true);
    showMediaOverlay(item);
  };
  useEffect(() => {
    dispatch(removeMoreMedia());
    dispatch(removeMoreFile());
    dispatch(removeMoreLink());
  }, [partnerId]);
  // Media, Files, Link end
  const handleSearchClick = () => {
    Swal.fire({
      title: 'Search',
      input: 'text',
      showConfirmButton: true,
      preConfirm: (value) => {
        console.log(value);
      },
    });
  };
  return (
    <>
      {showMedia || showFiles || showLink ? (
        <Wrapper>
          <MediaFiles>
            <BackArowIcon onClick={handleBackClick} />
            <MediaFileHeader>
              {showMedia ? 'Media' : showFiles ? 'Files' : showLink && 'Link'}
            </MediaFileHeader>
          </MediaFiles>
          <SwapFeature>
            <AFeature show={showMedia} onClick={handleMediaClick}>
              Media
            </AFeature>
            <AFeature show={showFiles} onClick={handleFilesClick}>
              Files
            </AFeature>
            <AFeature show={showLink} onClick={handleLinkClick}>
              Link
            </AFeature>
          </SwapFeature>
          {showMedia && (
            <MediaList
              listMedia={listMedia}
              onMediaClick={onMediaClick}
              user={user}
            />
          )}
          {showFiles && <Files listFiles={listFiles} user={user} />}
          {showLink && <Links listLink={listLink} user={user} />}
        </Wrapper>
      ) : (
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
                {!notification ? (
                  <IconNotificationOn />
                ) : (
                  <IconNotificationOff />
                )}
              </div>
              <FeatureName>{notification ? 'Turn off' : 'Turn on'}</FeatureName>
            </FeatuterWrapper>
            <FeatuterWrapper>
              <SearchIcon onClick={handleSearchClick} />
              <FeatureName>Search</FeatureName>
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
              <>
                <CustomFeature onClick={handleMediaClick}>
                  <IconHolder>
                    <Images />
                  </IconHolder>
                  <NameCustom>Media</NameCustom>
                </CustomFeature>
                <CustomFeature onClick={handleFilesClick}>
                  <IconHolder>
                    <File />
                  </IconHolder>
                  <NameCustom>Files</NameCustom>
                </CustomFeature>
                <CustomFeature onClick={handleLinkClick}>
                  <IconHolder>
                    <Link />
                  </IconHolder>
                  <NameCustom>Links</NameCustom>
                </CustomFeature>
              </>
            )}
          </CustomFeatureWrapper>
        </Wrapper>
      )}
    </>
  );
}
