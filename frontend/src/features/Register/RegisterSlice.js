import { AuthActionTypes } from 'app/actions/types/authTypes';

const initialState = {
  error: false,
  isFetching: false,
  success: false,
  message: null,
  type: {
    local: false,
    google: false,
  },
  fillRegister: {
    email: null,
    name: null,
    password: null,
  },
};

const registerReducer = (state = initialState, action) => {
  switch (action.type) {
    case AuthActionTypes.RESET_REGISTER:
      return {
        ...state,
        fillRegister: {
          email: null,
          name: null,
          password: null,
        },
        error: false,
        isFetching: false,
        success: false,
      };

    case AuthActionTypes.FILL_TO_REGISTER:
      return {
        ...state,
        fillRegister: {
          ...state.fillRegister,
          email: action.payload.email,
          name: action.payload.name,
          password: action.payload.password,
        },
      };
    case AuthActionTypes.REGISTER_START:
      return {
        ...state,
        isFetching: true,
        error: false,
        success: false,
      };

    case AuthActionTypes.REGISTER_SUCCESS:
      return {
        ...state,
        isFetching: false,
        error: false,
        success: true,
        message: action.payload.message,
        type: {
          local: action.payload?.type === 'local',
          google: action.payload?.type === 'google',
        },
      };
    case AuthActionTypes.REGISTER_FAILURE:
      return {
        ...state,
        isFetching: false,
        error: true,
        success: false,
        message: action.payload,
      };
    default: {
      return state;
    }
  }
};

export default registerReducer;
