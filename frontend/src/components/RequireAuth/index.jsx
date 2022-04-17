import { Navigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import React from 'react';
import PropTypes from 'prop-types';
import { getAuth } from 'app/selectors/login';
import { getSocket } from 'app/selectors/socket';
import Swal from 'sweetalert2';
import { initSocket } from 'app/actions/socket';
function RequireAuth({ children }) {
  const dispatch = useDispatch();
  const auth = useSelector(getAuth);
  const isAuthenticated = auth?.accessToken;
  const socket = useSelector(getSocket);
  React.useEffect(() => {
    if (!socket) {
      dispatch(initSocket(auth?.accountId, auth?.accessToken));
    }
    const timer = setTimeout(() => {
      if (!socket?.connected === true)
        Swal.fire({
          title: 'Server is not response, please reload or try again later',
          confirmButtonText: 'Reload',
          showCancelButton: true,
          preConfirm: (rs) => {
            if (rs) window.location.reload();
          },
        });
    }, 5000);
    return () => clearTimeout(timer);
  }, [socket, dispatch]);
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
