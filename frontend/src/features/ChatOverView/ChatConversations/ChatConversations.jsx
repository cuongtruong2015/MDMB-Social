import { X } from '@styled-icons/boxicons-regular';
import { Search } from '@styled-icons/heroicons-solid';
import {
  changeFilterConversation,
  getListConversation,
  getListConversationByName,
} from 'app/actions/conversations';
import {
  getConversationsByFilter,
  getConversationsBySearch,
  getFilterName,
} from 'app/selectors/conversations';
import { getListRelationshipSelector } from 'app/selectors/listRelationship';
import { getAuth } from 'app/selectors/login';
import CardConversation from 'features/ChatOverView/ChatConversations/CardConversation/CardConversation';
import { useDebounce } from 'hooks';
import React from 'react';
import { Form, InputGroup as BsInputGroup } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';

const SideBar = styled.div`
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  transition-duration: 0.2s;

  padding: 0 5px;
  border-right: 1px solid rgba(24, 23, 23, 0.75);
`;
const Logo = styled.div`
  height: 7%;
  align-self: center;
  padding-top: 3%;
  @media (max-width: 1250px) {
    padding-bottom: 3%;
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
const Wrapper = styled.div`
  margin-top: 10px;
  display: flex;
  flex-direction: column;
  overflow-y: scroll;
  overflow-x: hidden;

  ::-webkit-scrollbar {
    display: none;
  }
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; //Firefox
`;
const Tabs = styled.div`
  display: flex;
`;
const Tab = styled.div`
  font-size: 0.8rem;
  font-weight: bold;
  padding: 5px;
  border-radius: 5px;
  cursor: pointer;
  position: relative;

  ${(props) => (props.selected ? 'color:#7a7abb' : '')};
  ::after {
    content: '';
    display: block;
    width: 2rem;
    height: 2px;
    background: #7a7abb;
    position: absolute;
    bottom: 0;
    left: 0;
    opacity: ${(props) => (props.selected ? '1' : '0')};
  }
  &:hover {
    background: #f5f5f5;
    ::after {
      opacity: 1;
    }
  }
`;

const SearchForm = styled.div`
  position: relative;
  display: flex;
  align-items: stretch;
  width: 100%;
`;
const Notification = styled.div`
  color: #848181;
  margin-left: 10px;
  margin-top: 15px;
`;
const NotificationContent = styled.div`
  margin-left: 10px;
  margin-top: 5px;
`;
const RemoveSearchIcon = styled(X)`
  position: absolute;
  height: 2rem;
  width: 2rem;
  right: 50px;
  margin-top: 2px;
  cursor: pointer;
`;
function ChatConversations({ onSelectRoom }) {
  const dispatch = useDispatch();
  const accountId = useSelector(getAuth)?.accountId;
  const filter = useSelector(getFilterName);
  const listConversationFilter = useSelector(getConversationsByFilter);
  const listConversationByName = useSelector(getConversationsBySearch);
  const listConversationSorted = listConversationFilter?.sort(
    (a, b) => Date.parse(b.SentDate) - Date.parse(a.SentDate)
  );

  const [searchTerm, setSearchTerm] = React.useState('');
  const searchValue = useDebounce(searchTerm, 500);
  const listFriend =
    searchValue !== '' ? listConversationByName : listConversationSorted;

  React.useLayoutEffect(() => {
    if (searchValue) {
      dispatch(getListConversationByName(searchValue, filter));
    } else {
      dispatch(getListConversation(accountId));
    }
  }, [searchValue]);

  const handleAllMessageClick = () => {
    dispatch(changeFilterConversation('all'));
    dispatch(getListConversation(accountId));
  };
  const handleMessageUnreadClick = () => {
    dispatch(changeFilterConversation('unread'));
    dispatch(getListConversation(accountId));
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };
  const handleRemoveSearchClick = () => {
    setSearchTerm('');
  };

  const listRelationship = useSelector(getListRelationshipSelector);
  const getNickName = (i) => {
    var Nickname = null;
    const user = listRelationship.filter(
      (item) =>
        +item?.RelatedAccountId === +i?.AccountId ||
        +item?.RelatingAccountId === +i?.AccountId
    )[0];
    if (+user?.RelatingAccountId === +i?.AccountId)
      Nickname = user?.RelatingAccountNickname;
    else Nickname = user?.RelatedAccountNickname;
    return Nickname;
  };
  const getNotification = (i) => {
    var notification = 0;
    const user = listRelationship.filter(
      (item) =>
        +item?.RelatedAccountId === +i?.AccountId ||
        +item?.RelatingAccountId === +i?.AccountId
    )[0];
    notification = user?.Notification;
    if (
      (i.AccountId < accountId && notification === 1) ||
      (i.AccountId > accountId && notification === 2) ||
      notification === 3
    )
      return false;
    return true;
  };
  return (
    <SideBar>
      <Logo>MDMB Social</Logo>
      <SearchForm>
        <Form.Control
          placeholder="Searching"
          onChange={handleSearchChange}
          value={searchTerm}
        />
        <RemoveSearchIcon onClick={handleRemoveSearchClick} />
        <InputSearch>
          <IconSearch />
        </InputSearch>
      </SearchForm>
      <Tabs>
        <Tab
          onClick={handleAllMessageClick}
          selected={filter === 'all' ? 1 : 0}
        >
          All Message
        </Tab>
        <Tab
          onClick={handleMessageUnreadClick}
          selected={filter === 'unread' ? 1 : 0}
        >
          Message unread
        </Tab>
      </Tabs>
      {listFriend?.length === 0 && (
        <>
          <Notification>Not Found</Notification>
          <NotificationContent>Conversation not found!</NotificationContent>
        </>
      )}
      <Wrapper>
        {listFriend?.map((item, index) => (
          <CardConversation
            key={index}
            onSelectRoom={onSelectRoom}
            conversation={item}
            nickname={getNickName(item)}
            notification={getNotification(item)}
          />
        ))}
      </Wrapper>
    </SideBar>
  );
}
export default ChatConversations;
