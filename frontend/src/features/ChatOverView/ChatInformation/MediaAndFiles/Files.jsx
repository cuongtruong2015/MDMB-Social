import { File } from '@styled-icons/boxicons-regular';
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
export default function Files({ listFiles }) {
  return (
    <Wrapper>
      <FileList>
        {listFiles?.map((item, index) => (
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
    </Wrapper>
  );
}
