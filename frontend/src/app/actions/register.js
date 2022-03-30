import authApi from 'apis/authApi';
import { AuthActionTypes } from 'app/actions/types/authTypes';

export const resetRegister = () => {
  return {
    type: AuthActionTypes.RESET_REGISTER,
  };
};

export const registerStart = () => {
  return {
    type: AuthActionTypes.REGISTER_START,
  };
};

export const registerFailure = (message) => {
  return {
    type: AuthActionTypes.REGISTER_FAILURE,
    payload: message,
  };
};

export const registerSuccess = (data) => {
  return {
    type: AuthActionTypes.REGISTER_SUCCESS,
    payload: data,
  };
};

export const registerUser = (user) => async (dispatch) => {
  dispatch(registerStart());
  try {
    let data = null;
    if (user?.google) {
      data = await authApi.registerByGoogle(user);
    } else {
      data = await authApi.register(user);
    }
    if (data?.result === 'register successful') {
      dispatch(
        registerSuccess({
          message: 'Register successful. Please login!',
          type: user?.google ? 'google' : 'local',
        })
      );
    } else if (data?.result === 'email sent successful') {
      dispatch(
        registerSuccess({
          message: `We just sent an email to ${user.email} to activate your account.`,
          type: user?.google ? 'google' : 'local',
        })
      );
    } else {
      dispatch(registerFailure('Email is already in use'));
    }
  } catch (error) {
    if (!error?.status) {
      dispatch(registerFailure('Server not responding'));
    }
  }
};
