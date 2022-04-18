import React from 'react';
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import { getPreviewLinkSelector } from 'app/selectors/previewLink';
import { getPreviewLink } from 'app/actions/previewlink';
import { useEffect } from 'react';

const WarpLink = styled.div`
  width: 250px;
  cursor: pointer;
`;

const WarpRawLink = styled.a`
  font-size: 1.125rem;
  margin-left: 5px;
  :hover {
    text-decoration: underline;
    color: #00bcd4;
  }
  color: ${({ owner }) => (owner ? '#0a58ca' : '#fffff')};
`;

const WarpTitle = styled.a`
  font-weight: bold;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  display: block;
  margin-bottom: 5px;
  :hover {
    text-decoration: underline;
    color: unset;
  }
`;
const WarpDescription = styled.div`
  font-weight: lighter;
  max-height: 4rem;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
`;

const Thumbnail = styled.img`
  max-width: 100%;
  max-height: 250px;
  margin-bottom: 10px;
  border-radius: 4%;
`;
function checkUrlInState(url, urlInfor) {
  var temp = false;
  urlInfor.forEach((element) => {
    if (element.url?.includes(url)) temp = true;
  });
  return temp;
}
function getUrlDisplay(url, urlInfor) {
  var temp;
  urlInfor.forEach((element) => {
    if (element.url.includes(url)) temp = element;
  });
  return temp;
}
function CardLink({ url, content, owner }) {
  const dispatch = useDispatch();
  const urlInfor = useSelector(getPreviewLinkSelector);

  if (!url.match('^https?://')) url = 'http://' + url;

  useEffect(() => {
    if (!checkUrlInState(url, urlInfor)) dispatch(getPreviewLink(url));
  }, []);

  function handleClick() {
    window.open(url, '_blank');
  }
  var urlDisplay;
  if (checkUrlInState(url, urlInfor)) urlDisplay = getUrlDisplay(url, urlInfor);
  return (
    <WarpLink onClick={handleClick}>
      <WarpRawLink owner={owner}>{content}</WarpRawLink>
      <br />
      {urlDisplay?.image && <Thumbnail src={urlDisplay.image} alt="" />}
      {<WarpTitle>{urlDisplay?.title}</WarpTitle>}
      {urlDisplay?.description && (
        <WarpDescription>{urlDisplay.description}</WarpDescription>
      )}
    </WarpLink>
  );
}

export default CardLink;
