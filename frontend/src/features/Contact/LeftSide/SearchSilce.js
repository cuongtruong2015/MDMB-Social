import { partnerProfileActionTypes } from 'app/actions/types/partnerProfileTypes';

const initialState = {
  isFetching: false,
  error: false,
  success: false,
  message: null,
  searchListAccount: [],
};
const searchAccountReducer = (state = initialState, action) => {
  switch (action.type) {
    case partnerProfileActionTypes.SEARCH_ACCOUNT_START:
      return {
        ...state,
        isFetching: true,
        error: false,
        success: false,
        message: null,
      };
    case partnerProfileActionTypes.SEARCH_ACCOUNT_SUCCESS:
      return {
        ...state,
        isFetching: false,
        error: false,
        success: true,
        message: null,
        searchListAccount: action.payload,
      };
    case partnerProfileActionTypes.SEARCH_ACCOUNT_FAILURE:
      return {
        ...state,
        isFetching: false,
        error: true,
        success: false,
        message: action.payload.message,
      };
    default:
      return state;
  }
};

export default searchAccountReducer;
