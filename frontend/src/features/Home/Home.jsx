import { getAuth } from 'app/selectors/login';
import ChatOverView from 'features/ChatOverView/ChatOverView';
import Login from 'features/Login/Login';
import React from 'react';
import { Container } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import './home.scss';

function Home() {
  const auth = useSelector(getAuth);

  return (
    <Container fluid>
      {auth?.accessToken ? (
        <ChatOverView />
      ) : (
        <section className="home">
          <Login />
        </section>
      )}
    </Container>
  );
}
export default Home;
