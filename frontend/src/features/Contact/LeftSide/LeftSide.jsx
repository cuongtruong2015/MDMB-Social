import { Search } from '@styled-icons/heroicons-solid';
import { getMessagesLatest, selectRoom } from 'app/actions/chat';
import { getListRelationship } from 'app/actions/listRelationship';
import { getSearchAccount } from 'app/actions/partnerProfile';
import { getListRelationshipSelector } from 'app/selectors/listRelationship';
import { getAuth } from 'app/selectors/login';
import { getSearchAccountSelector } from 'app/selectors/partnerProfile';
import { useDebounce } from 'hooks';
import React from 'react';
import { Form, InputGroup as BsInputGroup, Spinner } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const LeftSideWrapper = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  width: 100%;
  height: 100%;
  
`;
const Logo = styled.div`
  height: 7%;
  align-self: center;
  padding-top: 2%;
  padding-bottom: 3%;
  justify-content: center;
  @media (max-width: 415px) {
    margin-left: auto;
    padding-top: 8%;
  }
`;
const InputGroup = styled(BsInputGroup)`
  margin-bottom: 10px;
`;

const InputSearch = styled(InputGroup.Text)`
  cursor: pointer;
`;
const IconSearch = styled(Search)`
  width: 1.2rem;
`;

const SearchForm = styled.div`
  position: relative;
  display: flex;
  align-items: stretch;
  width: 100%;
`;

const UserNotFound = styled.div`
  height: 30px;
  margin: 10px 0 0 10px;
`;

const FriendList = styled.div`
  margin-right: auto;
  width: 100%;
  overflow-y: scroll;
  overflow-x: hidden;
  display: flex;
  flex-direction: column;
  height: 100%;
`;
const HeaderCard = styled.div`
  margin: 10px 10px 0px 10px;
  font-size: 1rem;
  color: #848181;
`;

const FriendCard = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  padding: 10px;
  background-color: #efeff3;
  cursor: pointer;
  &:hover {
    filter: brightness(85%);
  }
`;
const Avatar = styled.div`
  width: 20%;
  img {
    width: 52px;
    height: 52px;
    border-radius: 50%;
    object-fit: cover;
    @media (max-width: 1250px) {
      width: 40px;
      height: 40px;
    }
    @media (max-width: 415px) {
      width: 30px;
      height: 30px;
  }
  }
`;
const Name = styled.div`
  height: 50%;
  width: calc(80% - 10px);
  color: #000000;
  justify-content: center;
  align-self: center;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  width: 200px;
  @media (max-width: 1250px) {
    margin-left: 10px;
  }
  @media (max-width: 800px) {
    margin-left: 20px;
  }
  @media (max-width: 415px) {
    margin-left: 15px;
    font-size: 0.8rem;
  }
`;
const WrapSpinner = styled.div`
  display: flex;
  justify-content: center;
`;

export default function LeftSide() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const accountId = useSelector(getAuth)?.accountId;
  const listRelationship = useSelector(getListRelationshipSelector);
  const listFriend = listRelationship?.filter((item) => item.Type === 'friend');

  const ListSearchAccount = useSelector(getSearchAccountSelector);
  const [listUserMatch, setListUserMatch] = React.useState(listFriend);
  const [searchValue, setSearchValue] = React.useState('');
  const [show, setShow] = React.useState(false);
  const loadingRef = React.useRef(false);

  const searchName = useDebounce(searchValue, 800);
  if (searchValue === '' && listUserMatch.length !== listFriend.length)
    setListUserMatch(listFriend);

  loadingRef.current = false;
  React.useEffect(() => {
    if (searchName) {
      dispatch(getSearchAccount(searchName, accountId));
      setShow(true);
    } else {
      setShow(false);
    }
    dispatch(getListRelationship(accountId));
    loadingRef.current = true;
  }, [searchName, accountId]);

  const handleSearchChange = (e) => {
    setSearchValue(e.target.value);
    const listUserMatch = listFriend.filter((user) =>
      user.Name.toLowerCase().includes(e.target.value.toLowerCase())
    );
    setListUserMatch(listUserMatch);
  };

  const handleFriendCardClick = (item) => {
    var partnerAccountId =
      item.RelatingAccountId === accountId
        ? item.RelatedAccountId
        : item.RelatingAccountId;

    var fakeConversation = {
      Avatar: item.Avatar,
      Name: item.Name,
      AccountId: partnerAccountId,
    };

    dispatch(selectRoom(fakeConversation, navigate));
    dispatch(getMessagesLatest(accountId, partnerAccountId));
  };

  const handleUserProfileClick = (AccountId) => {
    navigate(`/userinfor/${AccountId}`);
  };
  return (
    <LeftSideWrapper>
      <Logo>MDMB Social</Logo>
      <SearchForm>
        <Form.Control
          placeholder="Searching"
          onChange={handleSearchChange}
          value={searchValue}
        />
        <InputSearch>
          <IconSearch />
        </InputSearch>
      </SearchForm>
      <FriendList>
        <HeaderCard>Friend({listFriend?.length})</HeaderCard>
        {listUserMatch.length === 0 && (
          <UserNotFound> Friend not found!</UserNotFound>
        )}
        {listUserMatch?.map((item, index) => (
          <FriendCard
            key={index}
            onClick={() => {
              handleFriendCardClick(item);
            }}
          >
            <Avatar>
              <img src={item.Avatar} alt="avatar" />
            </Avatar>
            <Name>{item.Name}</Name>
          </FriendCard>
        ))}
        {searchValue && !show && (
          <HeaderCard>
            <WrapSpinner>
              <Spinner animation="border" role="status" />
            </WrapSpinner>
          </HeaderCard>
        )}
        {show && ListSearchAccount.length > 0 && (
          <HeaderCard>Searching</HeaderCard>
        )}
        {show && !ListSearchAccount.length > 0 && (
          <>
            <HeaderCard>Searching</HeaderCard>
            <UserNotFound>
              Not seeing your friends here? Send them an invite to join MDMB
              Social!
            </UserNotFound>
          </>
        )}
        {show &&
          ListSearchAccount?.map((item, index) => (
            <FriendCard
              key={index}
              onClick={() => {
                handleUserProfileClick(item.AccountId);
              }}
            >
              <Avatar>
                <img src={item.Avatar} alt="avatar" />
              </Avatar>
              <Name>{item.Name}</Name>
            </FriendCard>
          ))}
      </FriendList>
    </LeftSideWrapper>
  );
}
