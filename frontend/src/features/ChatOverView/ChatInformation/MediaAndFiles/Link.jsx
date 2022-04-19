import { Link } from '@styled-icons/boxicons-regular';
import { getMoreLink } from 'app/actions/mediaAndFiles';
import {
  isUpdateMediaAndFileSelector,
  mediaAndFilesFetchingSelector,
  moreLinkSelector,
} from 'app/selectors/mediaAndFiles';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { useNavigate } from '../../../../../node_modules/react-router-dom/index';
const Wrapper = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
  background-color: #fff;
`;
const LinkIcon = styled(Link)`
  width: 40px;
  height: 40px;
  padding: 7px;
  border-radius: 50%;
`;
const FileList = styled.div`
  overflow-y: auto;
`;
const Fileitem = styled.div`
  margin-top: 10px;
  height: 40px;
  display: flex;
  align-items: center;
  font-size: 1.2rem;
  cursor: pointer;
  &:hover {
    filter: brightness(0.8);
  }
  background-color: #fff;
`;
const FileName = styled.span`
  margin-left: 5px;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow-x: hidden;
  width: 300px;
`;
const LoadingWrapper = styled.div`
  width: 100%;
  justify-content: center;
  display: flex;
  margin-top: 50px;
`;
const Loading = styled.div`
  border: 5px solid #f3f3f3;
  border-radius: 50%;
  border-top: 5px solid #3498db;
  width: 40px;
  height: 40px;
  -webkit-animation: spin 2s linear infinite; /* Safari */
  animation: spin 2s linear infinite;
  @-webkit-keyframes spin {
    0% {
      -webkit-transform: rotate(0deg);
    }
    100% {
      -webkit-transform: rotate(360deg);
    }
  }

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;
const NoLink = styled.div`
  margin-top: 20px;
  width: 100%;
  text-align: center;
`;
export default function Links({ listLink, user }) {
  const regexContainLink =
    /[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/;
  var newListLink = [];
  listLink.map((item, index) => {
    item.Content = item.Content.match(regexContainLink)?.[0];
    newListLink.push(item);
  });
  const handleLinkClick = (url) => {
    if (!url.match('^https?://') || !url.match('^http?://'))
      url = 'https://' + url;
    window.open(url, '_blank').focus();
  };
  const isFetching = useSelector(mediaAndFilesFetchingSelector);
  //more link scroll
  const dispatch = useDispatch();
  const partnerId = user?.AccountId;
  const YourAccountId =
    user?.AccountId === user?.RelatingAccountId
      ? user?.RelatedAccountId
      : user?.RelatingAccountId;
  const minMessageId = listLink?.reduce(
    (a, b) => (a.MessageId < b.MessageId ? a.MessageId : b.MessageId),
    0
  );
  const MoreLink = useSelector(moreLinkSelector) || [];
  const isUpdateMessage = useSelector(isUpdateMediaAndFileSelector);
  const minMoreLinkMessageId = MoreLink?.reduce(
    (a, b) => (a?.MessageId < b?.MessageId ? a?.MessageId : b?.MessageId),
    0
  );
  const handleScroll = (e) => {
    const scrollElement = e.target;
    if (
      scrollElement.offsetHeight + scrollElement.scrollTop >=
      scrollElement.scrollHeight - 2
    ) {
      if (!(isUpdateMessage === 'no update')) {
        dispatch(
          getMoreLink(
            YourAccountId,
            partnerId,
            !minMoreLinkMessageId ? minMessageId : minMoreLinkMessageId
          )
        );
        e.target.scrollTop = scrollElement.scrollHeight / 2;
      }
    }
  };
  return (
    <Wrapper>
      {!isFetching && newListLink?.length === 0 && (
        <NoLink>No Link to display</NoLink>
      )}
      <FileList>
        {!isFetching &&
          newListLink?.map((item, index) => (
            <Fileitem key={index} onClick={() => handleLinkClick(item.Content)}>
              <LinkIcon />
              <FileName>{item.Content}</FileName>
            </Fileitem>
          ))}
      </FileList>
      {isFetching && (
        <LoadingWrapper>
          <Loading />
        </LoadingWrapper>
      )}
    </Wrapper>
  );
}
