import authApi from 'apis/authApi';
import { initSocket } from 'app/actions/socket';
import { AuthActionTypes } from 'app/actions/types/authTypes';

export const resetLogin = () => {
  return {
    type: AuthActionTypes.LOGIN_RESET,
  };
};

export const loginStart = () => {
  return {
    type: AuthActionTypes.LOGIN_START,
  };
};

export const loginFailure = (message) => {
  return {
    type: AuthActionTypes.LOGIN_FAILURE,
    payload: message,
  };
};

export const loginSuccess = (auth) => {
  return {
    type: AuthActionTypes.LOGIN_SUCCESS,
    payload: {
      accessToken: auth.accessToken,
      refreshToken: auth.refreshToken,
      accountId: auth.accountId,
    },
  };
};

export const login = (user, navigate) => async (dispatch) => {
  dispatch(loginStart());
  try {
    const data = await authApi.login(user);
    if (data?.accessToken) {
      const { accessToken, refreshToken, accountId } = data;
      dispatch(
        loginSuccess({
          accessToken,
          refreshToken,
          accountId,
        })
      );
      navigate('/');
    } else if (data?.result === 'login failure') {
      dispatch(loginFailure('Wrong email or password!'));
    }
  } catch (error) {
    if (error?.status === 401) {
      if (error.data.result === 'login failure') {
        dispatch(loginFailure(error.data.message));
      }
    } else if (!error?.status) {
      dispatch(loginFailure('Server not responding'));
    }
  }
};

export const loginByGoogle = (googleData, navigate) => async (dispatch) => {
  dispatch(loginStart());
  try {
    const {
      tokenId,
      profileObj: { email, name },
    } = googleData;
    const data = await authApi.loginWithGoogle(tokenId);
    if (data?.accessToken && data?.refreshToken) {
      const { accessToken, refreshToken, accountId } = data;
      dispatch(
        loginSuccess({
          accessToken,
          refreshToken,
          accountId,
        })
      );
      dispatch(initSocket(accountId, accessToken));
      navigate('/');
    } else if (data?.result === 'login failure') {
      dispatch(
        fillToRegister({
          email,
          name,
          password: 'Abcd123',
        })
      );
      dispatch(resetLogin());
      navigate('/register');
    } else {
      dispatch(loginFailure(`Can't sign in to your Google Account`));
    }
  } catch (error) {
    if (!error?.status) {
      dispatch(loginFailure('Server not responding'));
    }
  }
};

export const refreshToken = (refreshToken) => async (dispatch) => {
  try {
    const data = await authApi.refreshToken(refreshToken);
    if (data?.accessToken) {
      const { accessToken } = data;
      dispatch(refreshTokenSuccess(accessToken));
    }
  } catch (error) {}
};

export const refreshTokenSuccess = (token) => {
  return {
    type: AuthActionTypes.REFRESH_TOKEN_SUCCESS,
    payload: token,
  };
};

export const logoutStart = () => {
  return {
    type: AuthActionTypes.LOGOUT_START,
  };
};

export const logoutSuccess = (message) => {
  return {
    type: AuthActionTypes.LOGOUT_SUCCESS,
    payload: message,
  };
};

export const verifyCaptcha = (response) => async (dispatch) => {
  const data = await authApi.verifyCaptcha(response);
  if (data?.result === 'success') {
    dispatch(verifyCaptchaSuccess(data));
  } else {
    dispatch(verifyCaptchaFailure(data));
  }
};

export const verifyCaptchaSuccess = (data) => {
  return {
    type: AuthActionTypes.VERIFY_CAPTCHA_SUCCESS,
    payload: data,
  };
};

export const verifyCaptchaFailure = (data) => {
  return {
    type: AuthActionTypes.VERIFY_CAPTCHA_FAILURE,
    payload: data,
  };
};

export const logout = (data) => async (dispatch) => {
  dispatch(logoutStart());
  if (data?.type === 'error') {
    dispatch(logoutSuccess(data?.message));
  } else {
    dispatch(logoutSuccess());
  }
};

export const redirectToLogin = () => {
  return {
    type: AuthActionTypes.REDIRECT_TO_LOGIN,
  };
};

export const fillToRegister = (data) => {
  return {
    type: AuthActionTypes.FILL_TO_REGISTER,
    payload: data,
  };
};
