import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import React from 'react';
import PropTypes from 'prop-types';
import { getAuth } from 'app/selectors/login';

function RequireAuth({ children }) {
  const isAuthenticated = useSelector(getAuth)?.accessToken;
  let location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}

export default RequireAuth;
RequireAuth.propTypes = {
  children: PropTypes.element.isRequired,
};
