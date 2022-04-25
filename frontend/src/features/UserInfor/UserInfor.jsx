import {
  FemaleSign,
  Male as MaleFemale,
  MaleSign,
} from '@styled-icons/boxicons-regular';
import { User, UserCheck, UserPlus, UserX } from '@styled-icons/boxicons-solid';
import { Cake, Chat, Rss } from '@styled-icons/heroicons-solid';
import { getListRelationship } from 'app/actions/listRelationship';
import { AddFriend, getPartnerProfile } from 'app/actions/partnerProfile';
import { getUserProfile } from 'app/actions/userProfile';
import { getListRelationshipSelector } from 'app/selectors/listRelationship';
import { getAuth } from 'app/selectors/login';
import {
  getPartnerProfileSelector,
  isFetchingPartnerProfile,
} from 'app/selectors/partnerProfile';
import { getUserProfileSelector } from 'app/selectors/userProfile';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import MainLayout from 'layouts/MainLayout';
import React, { useEffect } from 'react';
import {
  Button,
  Container as BootstrapContainer,
  Dropdown,
} from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';
dayjs.extend(relativeTime);

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;
const CardProfile = styled.div`
  border: 2px solid #e3e3e3;
  border-radius: 1rem;
  width: 450px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  padding: 20px 0 20px 0;
`;

const AvatarWrapper = styled.div`
  margin: 0 auto;
  width: 8rem;
  height: 8rem;
  border-radius: 50%;
  position: relative;

  img {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    object-fit: cover;
  }
`;
const LineWrapper = styled.div`
  padding: 0px 30px 10px 30px;
  justify-content: space-between;
  width: 100%;
  display: flex;
  align-content: center;
  justify-content: center;
`;
const NameCard = styled.div`
  font-size: 1.5rem;
  font-weight: bold;
`;

const ButtonDefault = styled(Button)`
  background-color: #e8e4e4;
  color: #000000;
  margin: 0 10px 0 10px;
  &:hover {
    background-color: #eeeeee;
    color: #000000;
  }
`;

const IntroduceHeader = styled.div`
  font-weight: bold;
  text-align: left;
  width: 100%;
  font-size: 1.25rem;
`;
const Introduce = styled.div`
  padding-top: 5px;
  padding-bottom: 5px;
  text-align: center;
  width: 80%;
  margin: auto;
`;
const IntroduceWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  margin-top: 20px;
`;

const IntroduceIcon = styled(Rss)`
  width: 1.25rem;
  height: 1.25rem;
  margin: 0 3px 3px 0;
  align-content: center;
`;
const ChatIcon = styled(Chat)`
  width: 1.25rem;
  height: 1.25rem;
`;
const AddFriendIcon = styled(UserPlus)`
  width: 1.25rem;
  height: 1.25rem;
`;
const AlreadyFriendIcon = styled(UserCheck)`
  width: 1.25rem;
  height: 1.25rem;
`;

const CancelRequest = styled(UserX)`
  width: 1.25rem;
  height: 1.25rem;
`;
const InformationHeader = styled.div`
  text-align: left;
  width: 50%;
  font-size: 1.25rem;
`;
const Information = styled.div`
  text-align: left;
  width: 100%;
  font-size: 1.1rem;
`;
const GenderIcon = styled(MaleFemale)`
  width: 1.5rem;
  height: 1.5rem;
  margin-bottom: 2px;
`;
const CakeIcon = styled(Cake)`
  width: 1.25rem;
  height: 1.25rem;
  margin-bottom: 2px;
`;
const UserIcon = styled(User)`
  width: 1.25rem;
  height: 1.25rem;
  margin-bottom: 2px;
`;
const MaleIcon = styled(MaleSign)`
  width: 1.25rem;
  height: 1.25rem;
  margin-bottom: 2px;
`;
const FemaleIcon = styled(FemaleSign)`
  width: 1.25rem;
  height: 1.25rem;
  margin-bottom: 2px;
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
function UserInfor() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  var AccountId = useSelector(getAuth)?.accountId;

  const isFetching = useSelector(isFetchingPartnerProfile);

  useEffect(() => {
    if (id == AccountId) navigate('/update-profile');

    dispatch(getPartnerProfile(id));
    dispatch(getUserProfile(AccountId));
    dispatch(getListRelationship(AccountId));
  }, []);

  const accountInfor = useSelector(getUserProfileSelector);
  const partnerInfor = useSelector(getPartnerProfileSelector);
  const listRelationship = useSelector(getListRelationshipSelector);
  const RelationshipInfor = listRelationship.filter(
    (item) => item.RelatedAccountId == id || item.RelatingAccountId == id
  )[0];

  const Type = RelationshipInfor?.Type;
  var Case = null;
  /*
    0 : friend
    1 : not friend
    2 : you are sender
    3 : you are revceiver
  */
  if (Type === 'friend') Case = 0;
  if (!Type) Case = 1;
  if (
    (Type === 'rsendpending' &&
      RelationshipInfor.RelatedAccountId === AccountId) ||
    (Type === 'lsendpending' &&
      RelationshipInfor.RelatingAccountId === AccountId)
  )
    Case = 2;
  if (
    (Type === 'rsendpending' &&
      RelationshipInfor.RelatedAccountId !== AccountId) ||
    (Type === 'lsendpending' &&
      RelationshipInfor.RelatingAccountId !== AccountId)
  )
    Case = 3;
  const handleDirectMessageClick = () => {
    navigate(`/chat/${id}`);
  };
  const handleAddFriendClick = () => {
    if (AccountId < id)
      dispatch(AddFriend(AccountId, id, 'lsendpending')).then(() =>
        dispatch(getListRelationship(AccountId))
      );
    else
      dispatch(AddFriend(id, AccountId, 'rsendpending')).then(() =>
        dispatch(getListRelationship(AccountId))
      );
  };
  const AcceptFriendBtnClick = () => {
    updateRelationship(AccountId, id, 'friend', dispatch);
  };
  const handleDeleteRelationship = () => {
    updateRelationship(AccountId, id, 'delete', dispatch);
  };
  const HandleUnfriendClick = () => {
    updateRelationship(AccountId, id, 'delete', dispatch);
  };
  return (
    <BootstrapContainer fluid>
      <MainLayout Name={accountInfor?.Name} Avatar={accountInfor?.Avatar}>
        <Wrapper>
          {isFetching ? (
            'Loading...'
          ) : (
            <CardProfile>
              <AvatarWrapper>
                <img src={partnerInfor?.Avatar} alt="Avatar"></img>
              </AvatarWrapper>
              <LineWrapper>
                <NameCard>{partnerInfor?.Name}</NameCard>
              </LineWrapper>
              <LineWrapper>
                {Case === 0 && (
                  <>
                    <Dropdown>
                      <Dropdown.Toggle
                        className="btn"
                        variant="default"
                        id="dropdown-basic"
                        style={{
                          border: '1px solid black',
                          marginRight: '5px',
                        }}
                      >
                        <AlreadyFriendIcon />
                        Your Friend
                      </Dropdown.Toggle>
                      <Dropdown.Menu>
                        <Dropdown.Item onClick={HandleUnfriendClick}>
                          <CancelRequest />
                          Unfriend
                        </Dropdown.Item>
                      </Dropdown.Menu>
                    </Dropdown>
                    <Button onClick={handleDirectMessageClick}>
                      <ChatIcon /> Message
                    </Button>
                  </>
                )}
                {Case === 1 && (
                  <ButtonDefault className="btn" onClick={handleAddFriendClick}>
                    <AddFriendIcon />
                    Add Friend
                  </ButtonDefault>
                )}
                {Case === 2 && (
                  <ButtonDefault
                    className="btn"
                    onClick={handleDeleteRelationship}
                  >
                    <CancelRequest />
                    Cancel Request
                  </ButtonDefault>
                )}
                {Case === 3 && (
                  <>
                    <Button onClick={AcceptFriendBtnClick}>
                      <AddFriendIcon /> Accept
                    </Button>
                    <ButtonDefault
                      className="btn"
                      onClick={handleDeleteRelationship}
                    >
                      Delete
                    </ButtonDefault>
                  </>
                )}
              </LineWrapper>
              <LineWrapper>
                <IntroduceWrapper>
                  <IntroduceHeader>
                    <IntroduceIcon />
                    Introduce
                  </IntroduceHeader>
                  <Introduce>There still nothing to see yet</Introduce>
                </IntroduceWrapper>
              </LineWrapper>
              <LineWrapper>
                <InformationHeader>
                  <CakeIcon /> Birthday
                </InformationHeader>
                <Information>
                  {partnerInfor?.Birthday?.split('T')[0] || 'Unknow'}
                </Information>
              </LineWrapper>
              <LineWrapper>
                <InformationHeader>
                  {partnerInfor?.Gender === 0 ? (
                    <FemaleIcon />
                  ) : partnerInfor?.Gender === 1 ? (
                    <MaleIcon />
                  ) : (
                    <GenderIcon />
                  )}
                  Gender
                </InformationHeader>
                <Information>
                  {partnerInfor?.Gender === 0
                    ? 'Male'
                    : partnerInfor?.Gender === 1
                    ? 'Female'
                    : 'Unset'}
                </Information>
              </LineWrapper>
              <LineWrapper>
                <InformationHeader>
                  <UserIcon /> Join
                </InformationHeader>
                <Information>
                  {dayjs(partnerInfor?.CreatedDate).fromNow() || 'Unknow'}
                </Information>
              </LineWrapper>
            </CardProfile>
          )}
        </Wrapper>
      </MainLayout>
    </BootstrapContainer>
  );
}

export default UserInfor;
