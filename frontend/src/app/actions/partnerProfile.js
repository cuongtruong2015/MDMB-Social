import userApi from 'apis/userApi';
import { partnerProfileActionTypes } from 'app/actions/types/partnerProfileTypes';

const getPartnerProfileStart = () => {
  return {
    type: partnerProfileActionTypes.PARTNER_PROFILE_START,
  };
};

const getPartnerProfileSuccess = (UserProfile) => {
  return {
    type: partnerProfileActionTypes.PARTNER_PROFILE_SUCCESS,
    payload: UserProfile,
  };
};

const getPartnerProfileFailure = (message) => {
  return {
    type: partnerProfileActionTypes.PARTNER_PROFILE_FAILURE,
    payload: message,
  };
};

export const getPartnerProfile = (myAccountId) => async (dispatch) => {
  dispatch(getPartnerProfileStart());
  const data = await userApi.getPartnerAccountInfor(myAccountId);
  if (data?.result) {
    dispatch(getPartnerProfileSuccess(data?.result));
  } else {
    dispatch(getPartnerProfileFailure('get user profile failed!'));
  }
};

/*------------------searchAccount----------------------*/
const getSearchAccountStart = () => {
  return {
    type: partnerProfileActionTypes.SEARCH_ACCOUNT_START,
  };
};

const getSearchAccountSuccess = (AccountList) => {
  return {
    type: partnerProfileActionTypes.SEARCH_ACCOUNT_SUCCESS,
    payload: AccountList,
  };
};

const getSearchAccountFailure = (message) => {
  return {
    type: partnerProfileActionTypes.SEARCH_ACCOUNT_FAILURE,
    payload: message,
  };
};

export const getSearchAccount = (searchKey, id) => async (dispatch) => {
  dispatch(getSearchAccountStart());
  const data = await userApi.searchByName(searchKey, id);
  if (data?.result) {
    dispatch(getSearchAccountSuccess(data?.result));
  } else {
    dispatch(getSearchAccountFailure('search friend failed!'));
  }
};

/*------------------AddFriend----------------------*/
const AddFriendStart = () => {
  return {
    type: partnerProfileActionTypes.ADD_FRIEND_START,
  };
};

const AddFriendSuccess = (AccountList) => {
  return {
    type: partnerProfileActionTypes.ADD_FRIEND_SUCCESS,
    payload: AccountList,
  };
};

const AddFriendFailure = (message) => {
  return {
    type: partnerProfileActionTypes.ADD_FRIEND_FAILURE,
    payload: message,
  };
};

export const AddFriend =
  (relatingAccountId, relatedAccountId, type) => async (dispatch) => {
    dispatch(AddFriendStart());
    const data = await userApi.addFriend(
      relatingAccountId,
      relatedAccountId,
      type
    );
    if (data?.result) {
      dispatch(AddFriendSuccess(data?.result));
    } else {
      dispatch(AddFriendFailure('add friend failed'));
    }
  };
