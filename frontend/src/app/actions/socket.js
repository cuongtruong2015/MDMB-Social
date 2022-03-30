import { SocketActionTypes } from 'app/actions/types/socketTypes';
import io from 'socket.io-client';

export const initSocket = (accountId, accessToken) => (dispatch) => {
  const socket = io(process.env.REACT_APP_API_URL, {
    transports: ['websocket'],
    auth: { token: accessToken },
    query: { accountId },
  });
  if (socket) {
    dispatch({
      type: SocketActionTypes.SOCKET_INIT,
      payload: socket,
    });
  }
};

export const connectSocket = () => {
  return {
    type: SocketActionTypes.SOCKET_CONNECT,
  };
};

export const disconnectSocket = () => {
  return {
    type: SocketActionTypes.SOCKET_DISCONNECT,
  };
};

export const getListUsersOnline = (listUsersOnline) => {
  return {
    type: SocketActionTypes.LIST_USERS_ONLINE,
    payload: listUsersOnline,
  };
};

export const addUserOnline = (userId) => {
  return {
    type: SocketActionTypes.USER_ONLINE,
    payload: userId,
  };
};

export const addUserOffline = (userId) => {
  return {
    type: SocketActionTypes.USER_OFFLINE,
    payload: userId,
  };
};

export const userTyping = (userId) => {
  return {
    type: SocketActionTypes.USER_TYPING,
    payload: userId,
  };
};

export const userStopTyping = (user) => {
  return {
    type: SocketActionTypes.USER_STOP_TYPING,
    payload: user,
  };
};
