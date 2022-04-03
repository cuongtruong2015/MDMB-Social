import { AuthActionTypes } from 'app/actions/types/authTypes';
import conversationsReducer from 'features/ChatOverView/ChatConversations/ChatConversationSlice';
import chatReducer from 'features/ChatOverView/ChatSlice';
import socketReducer from 'features/ChatOverView/SocketSlice';
import loginReducer from 'features/Login/LoginSlice';
import registerReducer from 'features/Register/RegisterSlice';
import previewLinkReducer from 'features/ChatOverView/ChatWindow/WindowContent/Messages/CardMessage/CardLinkSlice.js';
import { combineReducers } from 'redux';
import userProfileReducer from 'features/UpdateProfile/GetUserProfileSlice'
import updateProfileReducer from 'features/UpdateProfile/UpdateProfileSlice'
import storage from 'redux-persist/lib/storage';
import partnerProfileReducer from 'features/UserInfor/PartnerInforSlice'
import searchAccountReducer from 'features/Contact/LeftSide/SearchSilce'
import listRelationshipReducer from 'features/UserInfor/listRelationshipSlice';
import listFriendRecommendedReducer from 'features/Contact/RightSide/ListFriendRecommendSlice';
import notificationReducer from 'features/ChatOverView/ChatConversations/notificationCountSlice';

const appReducer = combineReducers({
  login: loginReducer,
  register: registerReducer,
  conversations: conversationsReducer,
  chat: chatReducer,
  userProfile:userProfileReducer,
  updateProfile:updateProfileReducer,
  socket: socketReducer,
  previewLink:previewLinkReducer,
  partnerProfile:partnerProfileReducer,
  searchAccount:searchAccountReducer,
  listRelationship:listRelationshipReducer,
  listFriendRecommended:listFriendRecommendedReducer,
  notificationCount:notificationReducer,
});

const rootReducer = (state, action) => {
  if (action.type === AuthActionTypes.LOGOUT_SUCCESS) {
    storage.removeItem('persist:root');
    return appReducer(undefined, action);
  }

  return appReducer(state, action);
};
export default rootReducer;
