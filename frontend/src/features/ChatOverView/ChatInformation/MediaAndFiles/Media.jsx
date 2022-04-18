import styled, { css } from 'styled-components';
import {
  ArrowBack,
  File,
  Images,
  Link,
  PlayCircle,
} from '@styled-icons/boxicons-regular';

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
export default function MediaList({ listMedia }) {
  return (
    <WrapperMediaContent>
      <ImagePlace>
        {listMedia?.map((item, index) => (
          <ImageWrapper key={index}>
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
    </WrapperMediaContent>
  );
}
