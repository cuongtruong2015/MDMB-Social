import userApi from 'apis/userApi';
import { listFriendRecommendedActionTypes } from 'app/actions/types/listFriendRecommended';

const getListFriendRecommendedStart = () => {
    return {
      type: listFriendRecommendedActionTypes.GET_LIST_FRIEND_RECOMMENDED_START,
    };
  };
  
  const getListFriendRecommendedSuccess = (urlInfor) => {
    return {
      type: listFriendRecommendedActionTypes.GET_LIST_FRIEND_RECOMMENDED_SUCCESS,
      payload: urlInfor,
    };
  };
  
  const getListFriendRecommendedFailure = (message) => {
    return {
      type: listFriendRecommendedActionTypes.GET_LIST_FRIEND_RECOMMENDED_FAILURE,
      payload: message,
    };
  };
  
  export const getListFriendRecommended = (AccountId) => async (dispatch) => {
    dispatch(getListFriendRecommendedStart());
    const data = await userApi.getListFriendRecommended(AccountId);
    if (data?.result) {
      dispatch(
        getListFriendRecommendedSuccess(
          data?.result
        )
      );
    } else {
      dispatch(getListFriendRecommendedFailure('Cannot get list relationship!'));
    }
  };
  