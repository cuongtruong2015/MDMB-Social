export const ConversationActionTypes = {
  GET_LIST_CONVERSATION_START: 'get/listConversation/start',
  GET_LIST_CONVERSATION_SUCCESS: 'get/listConversation/success',
  GET_LIST_CONVERSATION_FAILURE: 'get/listConversation/failure',

  UPDATE_MESSAGE_UNREAD_START: 'update/message/unread/start',
  UPDATE_MESSAGE_UNREAD_SUCCESS: 'update/message/unread/success',

  UPDATE_LIST_CONVERSATION_WITH_NEW_MESSAGE:
    'update/listConversation/with/new/message',
  UPDATE_LIST_CONVERSATION_WITH_NEW_MESSAGE_SUCCESS:
    'update/listConversation/with/new/message/success',

  CHANGE_FILTER_CONVERSATION: 'change/filter/conversation',

  GET_LIST_CONVERSATION_BY_NAME_START: 'get/listConversation/by/name/start',
  GET_LIST_CONVERSATION_BY_NAME_SUCCESS: 'get/listConversation/by/name/success',
  GET_LIST_CONVERSATION_BY_NAME_FAILURE: 'get/listConversation/by/name/failure',

  UPDATE_LIST_CONVERSATION_WITH_SENT_MESSAGE_START:
    'update/listConversation/with/sent/message/start',
  UPDATE_LIST_CONVERSATION_WITH_SENT_MESSAGE_SUCCESS:
    'update/listConversation/with/sent/message/success',

  UPDATE_LIST_CONVERSATION_WITH_SEEN_MESSAGE_START:
    'update/listConversation/with/seen/message/start',

  UPDATE_LIST_CONVERSATION_WITH_SEEN_MESSAGE_SUCCESS:
    'update/listConversation/with/seen/message/success',
};
