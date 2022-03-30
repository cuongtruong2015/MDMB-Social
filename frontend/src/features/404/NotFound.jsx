import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const Wrapper = styled.section`
  height: 100vh;
  background: #57d6ee;
  color: #1d767f;
  display: flex;
  justify-content: center;
  align-items: center;
`;
const Contain = styled.div`
  text-align: center;
`;
const Title = styled.h1`
  font-size: 3rem;
`;
const Subtitle = styled.p`
  font-size: 1.5rem;
  font-weight: 400;
`;
const GoHome = styled(Link)`
  color: #111b3b;
  text-decoration: none;
  transition: color 0.2s ease-in-out;
  &:hover {
    border-bottom: 2px solid #111b3b;
    color: #111b3b;
    text-decoration: none;
  }
`;

function NotFound() {
  return (
    <Wrapper className="uh-oh">
      <Contain className="uh-oh__contain">
        <Title className="uh-oh__title">Page not found.</Title>
        <Subtitle className="uh-oh__subtitle">
          There's nothing here.
          <br />
          <br />
          Head back<GoHome to="/"> home</GoHome>!
        </Subtitle>
      </Contain>
    </Wrapper>
  );
}
export default NotFound;
