import { listFriendRecommendedActionTypes } from 'app/actions/types/listFriendRecommended';

const initialState = {
  isFetching: false,
  error: false,
  success: false,
  message: null,
  listFriendRecommended: [],
};
const listFriendRecommendedReducer = (state = initialState, action) => {
  switch (action.type) {
    case listFriendRecommendedActionTypes.GET_LIST_FRIEND_RECOMMENDED_START:
      return {
        ...state,
        isFetching: true,
        error: false,
        success: false,
        message: null,
      };
    case listFriendRecommendedActionTypes.GET_LIST_FRIEND_RECOMMENDED_SUCCESS:
      return {
        ...state,
        isFetching: false,
        error: false,
        success: true,
        message: null,
        listFriendRecommended: action.payload,
      };
    case listFriendRecommendedActionTypes.GET_LIST_FRIEND_RECOMMENDED_FAILURE:
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

export default listFriendRecommendedReducer;
