import React from 'react';
import { Col, Container } from 'react-bootstrap';
import styled from 'styled-components';
import Sidebar from 'features/ChatOverView/Sidebar/Sidebar';
import LeftSide from 'features/Contact/LeftSide/LeftSide';
import RightSide from 'features/Contact/RightSide/RightSide';

const Wrapper = styled(Container)`
  height: 100vh;
  padding: 0;
  flex-direction: row;
  display: flex;
  overflow: hidden;
`;
const LeftBar = styled(Col)`
  padding-left: 0;
  padding-right: 0;
  min-width: 80px;
  width: 80px;
  background-color: #efeff3;
  margin: 0px;
  @media (max-width: 800px) {
    width: 0px;
    min-width: 0px;
  }
`;
const LeftSideWrapper = styled.div`
  width: 36%;
  background-color: #efeff3;
  padding: 5px;
  @media (max-width: 1250px) {
    width: 320px;
    max-width: 300px;
  }
  @media (max-width: 680px) {
    min-width: 280px;
  }
  @media (max-width: 590px) {
    min-width: 230px;
  }
  @media (max-width: 415px) {
    width:155px;
    min-width: 155px;
  }
  
`;
const RightSideWrapper = styled.div`
  width: 100%;
  overflow-y: scroll;
`;

export default function Contact() {
  return (
    <Wrapper fluid>
      <LeftBar>
        <Sidebar ContactActive={true} />
      </LeftBar>

      <LeftSideWrapper>
        <LeftSide />
      </LeftSideWrapper>
      <RightSideWrapper>
        <RightSide />
      </RightSideWrapper>
    </Wrapper>
  );
}
