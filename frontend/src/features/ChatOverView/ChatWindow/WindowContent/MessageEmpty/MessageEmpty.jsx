import React from 'react';
import styled from 'styled-components';
import { ReactComponent as MessengerPic } from 'assets/images/icons/messenger.svg';

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 10%;
  align-self: center;
`;
const WrapperText = styled.div`
  background-color: #ffffff;
  border-radius: 10px;
  padding: -10%;
  box-shadow: -4px 4px 4px 4px #d8d5d8;
  @media (max-width: 1000px) {
    padding: 20px;
  }
  @media (max-width: 500px) {
    padding-bottom: 50px;
  }
`;
const Title = styled.div`
  text-align: center;
  padding-bottom: 10px;
  transition: all 0.3s ease-in-out;

  animation-iteration-count: infinite;
  animation-name: floatTitle;
  animation-duration: 2s;
  @keyframes floatTitle {
    0% {
      transform: rotate(00deg);
    }
    25% {
      transform: rotate(10deg);
      color: #c985c6;
    }
    50% {
      transform: rotate(0deg);
    }
    75% {
      transform: rotate(-10deg);
      color: #9a58d8;
    }
    100% {
      transform: rotate(0deg);
    }
  }
`;
const Description = styled.div`
  text-align: center;
  text-overflow: ellipsis;
`;
const MiddlePicture = styled(MessengerPic)`
  display: flex;
  margin: auto;
  height: 70%;
  width: 40%;
`;

function MessageEmpty() {
  return (
    <Wrapper>
      <WrapperText>
        <MiddlePicture />
        <Title>No messages yet! </Title>
        <Description>
          It seem. No message in your inbox. "Let's start messing now."
        </Description>
      </WrapperText>
    </Wrapper>
  );
}
export default MessageEmpty;
