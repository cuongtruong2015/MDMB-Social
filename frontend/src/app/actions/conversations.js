import conversationApi from 'apis/conversationApi';
import { ConversationActionTypes } from 'app/actions/types/conversationTypes';

const getListConversationStart = () => {
  return {
    type: ConversationActionTypes.GET_LIST_CONVERSATION_START,
  };
};

const getListConversationSuccess = (listConversation) => {
  return {
    type: ConversationActionTypes.GET_LIST_CONVERSATION_SUCCESS,
    payload: listConversation,
  };
};

const getListConversationFailure = (message) => {
  return {
    type: ConversationActionTypes.GET_LIST_CONVERSATION_FAILURE,
    payload: message,
  };
};

export const getListConversation = (myAccountId) => async (dispatch) => {
  dispatch(getListConversationStart());
  const data = await conversationApi.getListConversation(myAccountId);
  if (data?.result) {
    dispatch(getListConversationSuccess(data?.result));
  } else {
    dispatch(getListConversationFailure('Cannot get list conversation!'));
  }
};

export const refreshListConversation = () => {
  return {
    type: ConversationActionTypes.REFRESH_LIST_CONVERSATION,
  };
};

const updateMessageUnreadStart = () => {
  return {
    type: ConversationActionTypes.UPDATE_MESSAGE_UNREAD_START,
  };
};

const updateMessageUnreadSuccess = (newListConversation) => {
  return {
    type: ConversationActionTypes.UPDATE_MESSAGE_UNREAD_SUCCESS,
    payload: newListConversation,
  };
};

export const updateCountUnreadConversation =
  (partnerId) => async (dispatch, getState) => {
    dispatch(updateMessageUnreadStart());
    const {
      conversations: { listConversation },
    } = getState();

    const newListConversation = listConversation.filter((e) => {
      if (e.AccountId === +partnerId) {
        e.UnseenMessage = 0;
        e.SeenDate = new Date();
      }
      return e;
    });

    dispatch(updateMessageUnreadSuccess(newListConversation));
  };

const updateListConversationWithNewMessageSuccess = (newListConversation) => {
  return {
    type: ConversationActionTypes.UPDATE_LIST_CONVERSATION_WITH_NEW_MESSAGE_SUCCESS,
    payload: newListConversation,
  };
};

export const updateListConversationWithNewMessage =
  (data) => (dispatch, getState) => {
    const {
      conversations: { listConversation },
    } = getState();

    const newListConversation = listConversation.filter((e) => {
      if (e.AccountId === data.FromAccount) {
        e.UnseenMessage = e.UnseenMessage + 1;
        e.LastMessage = data.Content;
        e.SeenDate = data.SeenDate;
        e.SentDate = data.SentDate;
      }
      return e;
    });
    dispatch(updateListConversationWithNewMessageSuccess(newListConversation));
  };

export const changeFilterConversation = (filterName) => {
  return {
    type: ConversationActionTypes.CHANGE_FILTER_CONVERSATION,
    payload: filterName,
  };
};

const getListConversationByNameStart = () => {
  return {
    type: ConversationActionTypes.GET_LIST_CONVERSATION_BY_NAME_START,
  };
};
const getListConversationByNameSuccess = (listConversation) => {
  return {
    type: ConversationActionTypes.GET_LIST_CONVERSATION_BY_NAME_SUCCESS,
    payload: listConversation,
  };
};

export const getListConversationByName =
  (name, filter) => async (dispatch, getState) => {
    const {
      conversations: { listConversation },
    } = getState();
    dispatch(getListConversationByNameStart());
    let data = [];
    if (name) {
      if (filter === 'unread') {
        data = listConversation.filter((e) => {
          if (
            e.Name.toLowerCase().includes(name.toLowerCase()) &&
            e.UnseenMessage > 0
          ) {
            return e;
          }
          return null;
        });
      } else {
        data = listConversation.filter((e) =>
          e.Name.toLowerCase().includes(name.toLowerCase())
        );
      }
      if (data) {
        dispatch(getListConversationByNameSuccess(data));
      } else {
        dispatch(getListConversationByNameSuccess([]));
      }
    } else {
      dispatch(getListConversationByNameSuccess([]));
    }
  };

const updateListConversationWithSentMessageStart = () => {
  return {
    type: ConversationActionTypes.UPDATE_LIST_CONVERSATION_WITH_SENT_MESSAGE_START,
  };
};

const updateListConversationWithSentMessageSuccess = (newListConversation) => {
  return {
    type: ConversationActionTypes.UPDATE_LIST_CONVERSATION_WITH_SENT_MESSAGE_SUCCESS,
    payload: newListConversation,
  };
};

export const updateListConversationWithSentMessage =
  (data) => (dispatch, getState) => {
    const {
      conversations: { listConversation },
    } = getState();
    dispatch(updateListConversationWithSentMessageStart());
    const newListConversation = listConversation.filter((e) => {
      if (e.AccountId === data.ToAccount) {
        e.LastMessage = data.Content;
        e.SentDate = data.SentDate;
        e.SeenDate = data.SeenDate;
      }
      return e;
    });
    dispatch(updateListConversationWithSentMessageSuccess(newListConversation));
  };

const updateListConversationWithSeenMessageStart = () => {
  return {
    type: ConversationActionTypes.UPDATE_LIST_CONVERSATION_WITH_SEEN_MESSAGE_START,
  };
};

const updateListConversationWithSeenMessageSuccess = (newListConversation) => {
  return {
    type: ConversationActionTypes.UPDATE_LIST_CONVERSATION_WITH_SEEN_MESSAGE_SUCCESS,
    payload: newListConversation,
  };
};

export const updateListConversationWithSeenMessage =
  (roomId) => (dispatch, getState) => {
    const {
      conversations: { listConversation },
    } = getState();
    dispatch(updateListConversationWithSeenMessageStart());
    const newListConversation = listConversation.filter((e) => {
      if (e.AccountId === +roomId) {
        e.SeenDate = new Date();
      }
      return e;
    });
    dispatch(updateListConversationWithSeenMessageSuccess(newListConversation));
  };
