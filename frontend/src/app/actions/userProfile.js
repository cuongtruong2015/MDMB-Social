import userApi from 'apis/userApi';
import { userProfileActionTypes } from 'app/actions/types/userProfileTypes';

const getUserProfileStart = () => {
  return {
    type: userProfileActionTypes.USER_PROFILE_START,
  };
};

const getUserProfileSuccess = (UserProfile) => {

  return {
    type: userProfileActionTypes.USER_PROFILE_SUCCESS,
    payload: UserProfile,
  };
};

const getUserProfileFailure = (message) => {
  return {
    type: userProfileActionTypes.USER_PROFILE_FAILURE,
    payload: message,
  };
};

export const getUserProfile = (myAccountId) => async (dispatch) => {
  dispatch(getUserProfileStart());
  const data = await userApi.getAccountInfor(myAccountId);
  if (data?.result) {
    dispatch(
      getUserProfileSuccess(
         data?.result
      )
    );
  } else {
    dispatch(getUserProfileFailure('Cannot get User Profile!'));
  }
};
