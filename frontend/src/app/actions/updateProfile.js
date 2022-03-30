import userApi from 'apis/userApi';
import { updateProfileActionTypes } from 'app/actions/types/updateProfileTypes';

const updateUserProfileStart = () => {
  return {
    type: updateProfileActionTypes.UPDATE_PROFILE_START,
  };
};

const updateUserProfileSuccess = (UserProfile) => {

  return {
    type: updateProfileActionTypes.UPDATE_PROFILE_SUCCESS,
    payload: UserProfile,
  };
};

const updateUserProfileFailure = (message) => {
  return {
    type: updateProfileActionTypes.UPDATE_PROFILE_FAILURE,
    payload: message,
  };
};

export const updateUserProfile = (userInfor) => async (dispatch) => {
  dispatch(updateUserProfileStart());
  const data = await userApi.updateProfile(userInfor);
  if (data?.result) {
    dispatch(
        updateUserProfileSuccess(
         data?.result
      )
    );
  } else {
    dispatch(updateUserProfileFailure('Cannot get User Profile!'));
  }
};
