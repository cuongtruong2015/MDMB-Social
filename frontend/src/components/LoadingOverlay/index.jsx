import React from 'react';
import styled, { keyframes } from 'styled-components';

const SkChase = keyframes`
 100% {
   transform: rotate(360deg);
}
 `;
const SkChaseDot = keyframes`
  80%, 100% {
    transform: rotate(360deg);
  }
`;
const SkChaseDotBefore = keyframes`
  50% {
    transform: scale(0.4);
  } 100%, 0% {
    transform: scale(1.0);
  }
`;
const Wrapper = styled.div`
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  position: fixed;
  background-color: rgba(0, 0, 0, 0.4);
`;
const LoadingInner = styled.div`
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  position: absolute;
`;
const LoadingContent = styled.div`
  left: 50%;
  position: absolute;
  top: 50%;
  transform: translate(-50%, -50%);
`;
const Spinner = styled.div`
  width: 70px;
  height: 70px;
  position: relative;
  animation: ${SkChase} 2.5s infinite linear both;
`;
const Dot = styled.div`
  width: 100%;
  height: 100%;
  position: absolute;
  left: 0;
  top: 0;
  animation: ${SkChaseDot} 2s infinite ease-in-out both;
  &:before {
    content: '';
    display: block;
    width: 25%;
    height: 25%;
    background: linear-gradient(90deg, #89f7fe 0%, #66a6ff 100%);
    border-radius: 100%;
    animation: ${SkChaseDotBefore} 2s infinite ease-in-out both;
  }

  &:nth-child(1) {
    animation-delay: -1.1s;
  }
  &:nth-child(2) {
    animation-delay: -1s;
  }
  &:nth-child(3) {
    animation-delay: -0.9s;
  }
  &:nth-child(4) {
    animation-delay: -0.8s;
  }
  &:nth-child(5) {
    animation-delay: -0.7s;
  }
  &:nth-child(6) {
    animation-delay: -0.6s;
  }
  &:nth-child(1):before {
    animation-delay: -1.1s;
  }
  &:nth-child(2):before {
    animation-delay: -1s;
  }
  &:nth-child(3):before {
    animation-delay: -0.9s;
  }
  &:nth-child(4):before {
    animation-delay: -0.8s;
  }
  &:nth-child(5):before {
    animation-delay: -0.7s;
  }
  &:nth-child(6):before {
    animation-delay: -0.6s;
  }
`;

function LoadingOverlay() {
  return (
    <Wrapper>
      <LoadingInner>
        <LoadingContent>
          <Spinner>
            {[...Array(6)].map((_, i) => (
              <Dot key={i}/>
            ))}
          </Spinner>
        </LoadingContent>
      </LoadingInner>
    </Wrapper>
  );
}
export default LoadingOverlay;
