import styled, { css } from 'styled-components';
import {
  ArrowBack,
  File,
  Images,
  Link,
  PlayCircle,
} from '@styled-icons/boxicons-regular';
import { useDispatch, useSelector } from 'react-redux';
import {
  isUpdateMediaAndFileSelector,
  mediaAndFilesFetchingSelector,
  moreMediaSelector,
} from 'app/selectors/mediaAndFiles';
import { getMoreMedia } from 'app/actions/mediaAndFiles';

const MediaFiles = styled.div`
  font-size: 1.3rem;
  display: flex;
  justify-content: flex-start;
  width: 100%;
`;
const WrapperMediaContent = styled.div`
  padding-right: 10px;
  overflow-y: auto;
  margin-top: 20px;
  height: 100vh;
`;
const ImagePlace = styled.div`
  display: grid;
  //grid 3x3 space 2%
  grid-template-columns: repeat(3, 1fr);
  grid-gap: 5px;
`;
const ImageWrapper = styled.div`
  width: 100px;
  height: 100px;
  cursor: pointer;
  img,
  video {
    width: 100px;
    height: 100px;
    object-fit: cover;
  }
`;
const PlayVideoIcon = styled(PlayCircle)`
  position: relative;
  width: 30px;
  width: 30px;
  color: #fff;
  margin-left: calc((100px - 30px) / 2);
`;
const IconVideoWrapper = styled.div`
  margin-top: -70px;
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
const NoMedia = styled.div`
  margin-top: 20px;
  width: 100%;
  text-align: center;
`;
export default function MediaList({ listMedia, onMediaClick, user }) {
  const isFetching = useSelector(mediaAndFilesFetchingSelector);
  const dispatch = useDispatch();
  const partnerId = user?.AccountId;
  const YourAccountId =
    user?.AccountId === user?.RelatingAccountId
      ? user?.RelatedAccountId
      : user?.RelatingAccountId;
  const minMessageId = listMedia?.reduce(
    (a, b) => (a.MessageId < b.MessageId ? a.MessageId : b.MessageId),
    0
  );
  const MoreMedia = useSelector(moreMediaSelector) || [];
  const isUpdateMessage = useSelector(isUpdateMediaAndFileSelector);
  const minMoreMediaMessageId = MoreMedia?.reduce(
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
          getMoreMedia(
            YourAccountId,
            partnerId,
            !minMoreMediaMessageId ? minMessageId : minMoreMediaMessageId
          )
        );
        e.target.scrollTop = scrollElement.scrollHeight / 2;
      }
    }
  };

  return (
    <WrapperMediaContent onScroll={handleScroll}>
      {!isFetching && listMedia?.length === 0 && (
        <NoMedia>No Media to display</NoMedia>
      )}
      <ImagePlace>
        {!isFetching &&
          listMedia?.map((item, index) => (
            <ImageWrapper key={index} onClick={() => onMediaClick(item)}>
              {item.Type === 1 ? (
                <img src={item.Content} />
              ) : (
                item.Type === 2 && (
                  <>
                    <video src={item.Content} />
                    <IconVideoWrapper>
                      <PlayVideoIcon />
                    </IconVideoWrapper>
                  </>
                )
              )}
            </ImageWrapper>
          ))}
        {MoreMedia[0] &&
          MoreMedia?.map((item, index) => (
            <ImageWrapper key={index} onClick={() => onMediaClick(item)}>
              {item.Type === 1 ? (
                <img src={item.Content} />
              ) : (
                item.Type === 2 && (
                  <>
                    <video src={item.Content} />
                    <IconVideoWrapper>
                      <PlayVideoIcon />
                    </IconVideoWrapper>
                  </>
                )
              )}
            </ImageWrapper>
          ))}
      </ImagePlace>
      {isFetching && (
        <LoadingWrapper>
          <Loading />
        </LoadingWrapper>
      )}
    </WrapperMediaContent>
  );
}
