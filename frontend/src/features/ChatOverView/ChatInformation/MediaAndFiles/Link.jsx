import { Link } from '@styled-icons/boxicons-regular';
import React from 'react';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';
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
  height: 50px;
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
function checkUrlInState(url, urlInfor) {
  var temp = false;
  urlInfor?.forEach((element) => {
    if (element.url.includes(url)) temp = true;
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
export default function Links({ listLink }) {
  const regexContainLink =
    /[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/;
  var newListLink = [];
  listLink.map((item, index) => {
    item.Content = item.Content.match(regexContainLink)?.[0];
    newListLink.push(item);
  });

  return (
    <Wrapper>
      <FileList>
        {newListLink?.map((item, index) => (
          <Fileitem
            key={index}
            onClick={() => (window.location.href = item.Content)}
          >
            <LinkIcon />
            <FileName>{item.Content}</FileName>
          </Fileitem>
        ))}
      </FileList>
    </Wrapper>
  );
}
