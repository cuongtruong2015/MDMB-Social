import { SocketActionTypes } from 'app/actions/types/socketTypes';

const initialState = {
  socket: null,
  listUserIdOnline: [],
};

const socketReducer = (state = initialState, action) => {
  switch (action.type) {
    case SocketActionTypes.SOCKET_INIT:
      return {
        ...state,
        socket: action.payload,
      };
    case SocketActionTypes.SOCKET_CONNECT:
      return {
        ...state,
        socket: action.payload,
      };
    case SocketActionTypes.SOCKET_DISCONNECT:
      return {
        ...state,
        socket: null,
      };
    case SocketActionTypes.LIST_USERS_ONLINE:
      return {
        ...state,
        listUserIdOnline: action.payload,
      };
    case SocketActionTypes.USER_ONLINE:
      return {
        ...state,
        listUserIdOnline: [...state.listUserIdOnline, action.payload],
      };
    case SocketActionTypes.USER_OFFLINE:
      return {
        ...state,
        listUserIdOnline: state.listUserIdOnline.filter(
          (userId) => userId !== action.payload
        ),
      };

    default:
      return state;
  }
};

export default socketReducer;
