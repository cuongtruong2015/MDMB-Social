import { AuthActionTypes } from 'app/actions/types/authTypes';

const initialState = {
  error: false,
  isFetching: false,
  success: false,
  message: null,
  redirect: false,
  auth: {
    accessToken: null,
    refreshToken: null,
    accountId: null,
  },
  captcha: {
    errorCount: 0,
    isFetching: false,
    error: false,
    success: false,
    message: null,
  },
  logout: {
    error: false,
    isFetching: false,
    success: false,
  },
};

const loginReducer = (state = initialState, action) => {
  switch (action.type) {
    case AuthActionTypes.LOGIN_RESET:
      return {
        ...state,
        error: false,
        isFetching: false,
        success: false,
        message: null,
        logout: {
          ...state.logout,
          error: false,
          isFetching: false,
          success: false,
        },
      };

    case AuthActionTypes.LOGIN_START:
      return {
        ...state,
        isFetching: true,
        error: false,
        success: false,
        message: null,
        captcha: {
          ...state.captcha,
          errorCount: state?.captcha?.errorCount || 0,
        },
        token: {
          ...state.token,
          accessToken: null,
          refreshToken: null,
        },
        logout: {
          ...state.logout,
          error: false,
          isFetching: false,
        },
      };
    case AuthActionTypes.LOGIN_SUCCESS:
      return {
        ...state,
        isFetching: false,
        error: false,
        success: true,
        message: null,
        auth: {
          ...state.auth,
          accessToken: action.payload.accessToken,
          refreshToken: action.payload.refreshToken,
          accountId: action.payload.accountId,
        },
        captcha: {
          errorCount: 0,
        },
      };
    case AuthActionTypes.LOGIN_FAILURE:
      return {
        ...state,
        isFetching: false,
        error: true,
        success: false,
        message: action.payload,
        auth: {
          accessToken: null,
          refreshToken: null,
          accountId: null,
        },
        captcha: {
          errorCount: state.captcha.errorCount + 1,
        },
      };

    case AuthActionTypes.LOGIN_GOOGLE_SUCCESS:
      return {
        ...state,
        isFetching: false,
        error: false,
        success: true,
        auth: {
          ...state.auth,
          accessToken: action.payload.accessToken,
          refreshToken: action.payload.refreshToken,
          accountId: action.payload.accountId,
        },
      };

    case AuthActionTypes.LOGOUT_START:
      return {
        ...state,
        logout: {
          ...state.logout,
          isFetching: true,
        },
      };
    case AuthActionTypes.LOGOUT_SUCCESS:
      return {
        ...state,
        auth: {
          ...state.auth,
          accessToken: null,
          refreshToken: null,
          accountId: null,
        },
        captcha: {
          ...state.captcha,
          errorCount: 0,
        },
        logout: {
          ...state.logout,
          isFetching: false,
          error: false,
          success: true,
          message: action.payload,
        },
      };

    case AuthActionTypes.LOGOUT_FAILURE: {
      return {
        ...state,
        logout: {
          ...state.logout,
          isFetching: false,
          error: true,
          success: false,
        },
      };
    }

    case AuthActionTypes.REFRESH_TOKEN_SUCCESS:
      return {
        ...state,
        auth: {
          ...state.auth,
          accessToken: action.payload,
        },
      };

    case AuthActionTypes.VERIFY_CAPTCHA_SUCCESS:
      return {
        ...state,
        captcha: {
          isFetching: false,
          success: true,
          message: null,
        },
      };

    case AuthActionTypes.VERIFY_CAPTCHA_FAILURE:
      return {
        ...state,
        captcha: {
          isFetching: false,
          success: false,
          message: action.payload,
        },
      };
    default: {
      return state;
    }
  }
};

export default loginReducer;
