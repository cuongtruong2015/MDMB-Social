import React from 'react';
import { Button } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout, refreshToken } from 'app/actions/login';
import { getAuth } from 'app/selectors/login';

function Dashboard() {
  const auth = useSelector(getAuth);

  const navigate = useNavigate();

  const dispatch = useDispatch();

  const onHandleRefreshToken = () => {
    dispatch(refreshToken(auth.refreshToken));
  };
  const handleLogout = () => {
    dispatch(logout(auth?.accessToken));
    navigate('/');
  };

  return (
    <div>
      Dashboard (private)
      <h5>Access token: {auth?.accessToken}</h5>
      <h5>Refresh Token: {auth?.refreshToken}</h5>
      <Button onClick={onHandleRefreshToken} className="btn">
        Refresh Token
      </Button>
      {auth?.accessToken && <Button onClick={handleLogout}>Logout</Button>}
    </div>
  );
}

export default Dashboard;
