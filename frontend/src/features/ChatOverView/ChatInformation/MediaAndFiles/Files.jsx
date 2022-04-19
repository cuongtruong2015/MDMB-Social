import { File } from '@styled-icons/boxicons-regular';
import { getMoreFile } from 'app/actions/mediaAndFiles';
import {
  isUpdateMediaAndFileSelector,
  mediaAndFilesFetchingSelector,
  moreFileSelector,
} from 'app/selectors/mediaAndFiles';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';

const Wrapper = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
  background-color: #fff;
`;
const FileIcon = styled(File)`
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
const NoFile = styled.div`
  margin-top: 20px;
  width: 100%;
  text-align: center;
`;
export default function Files({ listFiles, user }) {
  const isFetching = useSelector(mediaAndFilesFetchingSelector);
  const dispatch = useDispatch();
  const partnerId = user?.AccountId;
  const YourAccountId =
    user?.AccountId === user?.RelatingAccountId
      ? user?.RelatedAccountId
      : user?.RelatingAccountId;
  const minMessageId = listFiles?.reduce(
    (a, b) => (a.MessageId < b.MessageId ? a.MessageId : b.MessageId),
    0
  );
  const MoreFile = useSelector(moreFileSelector) || [];
  const isUpdateMessage = useSelector(isUpdateMediaAndFileSelector);
  const minMoreFileMessageId = MoreFile?.reduce(
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
          getMoreFile(
            YourAccountId,
            partnerId,
            !minMoreFileMessageId ? minMessageId : minMoreFileMessageId
          )
        );
        e.target.scrollTop = scrollElement.scrollHeight / 2;
      }
    }
  };

  console.log(MoreFile);
  return (
    <Wrapper>
      {!isFetching && listFiles?.length === 0 && (
        <NoFile>No File to display</NoFile>
      )}
      <FileList onScroll={handleScroll}>
        {!isFetching &&
          listFiles?.map((item, index) => (
            <Fileitem
              key={index}
              onClick={() => (window.location.href = item.Content)}
            >
              <FileIcon />
              <FileName>
                {decodeURIComponent(
                  ''.concat(
                    item.Content?.substring(
                      item.Content?.indexOf('%2F') + 3,
                      item.Content?.indexOf('?')
                    )
                  )
                )}
              </FileName>
            </Fileitem>
          ))}
        {!isFetching &&
          MoreFile?.map((item, index) => (
            <Fileitem
              key={index}
              onClick={() => (window.location.href = item.Content)}
            >
              <FileIcon />
              <FileName>
                {decodeURIComponent(
                  ''.concat(
                    item.Content?.substring(
                      item.Content?.indexOf('%2F') + 3,
                      item.Content?.indexOf('?')
                    )
                  )
                )}
              </FileName>
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
