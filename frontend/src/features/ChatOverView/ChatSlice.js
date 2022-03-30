import { ChatActionTypes } from 'app/actions/types/chatTypes';

const initialState = {
  isFetching: false,
  error: false,
  success: false,
  message: null,
  listMessage: [
    {
      Content: null,
      FromAccount: null,
      MessageId: null,
      SeenDate: null,
      SentDate: null,
      ToAccount: null,
      Type: null,
    },
  ],
  partner: {
    Avatar: null,
    Name: null,
    AccountId: null,
    Online: false,
  },
  roomId: null,
};

const chatReducer = (state = initialState, action) => {
  switch (action.type) {
    case ChatActionTypes.SELECT_ROOM_START:
      return {
        ...state,
        isFetching: true,
        error: false,
        success: false,
        message: null,
      };
    case ChatActionTypes.SELECT_ROOM_SUCCESS:
      return {
        ...state,
        isFetching: false,
        error: false,
        success: true,
        message: null,
        partner: {
          Avatar: action.payload.Avatar,
          Name: action.payload.Name,
          AccountId: action.payload.AccountId,
        },
        roomId: action.payload.AccountId,
      };
    case ChatActionTypes.LIST_MESSAGE_LATEST_START:
      return {
        ...state,
        isFetching: true,
        error: false,
        success: false,
        message: null,
        listMessage: [],
      };

    case ChatActionTypes.LIST_MESSAGE_LATEST_SUCCESS:
      return {
        ...state,
        isFetching: false,
        error: false,
        success: true,
        message: null,
        listMessage: action.payload,
      };
    case ChatActionTypes.LIST_MESSAGE_LATEST_FAILURE:
      return {
        ...state,
        isFetching: false,
        error: true,
        success: false,
        message: action.payload,
      };
    case ChatActionTypes.SEND_MESSAGE_START:
      return {
        ...state,
        isFetching: true,
        error: false,
        success: false,
        message: null,
      };

    case ChatActionTypes.SEND_MESSAGE_SUCCESS:
      return {
        ...state,
        isFetching: false,
        error: false,
        success: true,
        message: null,
        listMessage: [
          ...state.listMessage,
          {
            Content: action.payload.Content,
            FromAccount: action.payload.FromAccount,
            MessageId: action.payload.MessageId,
            SeenDate: action.payload.SeenDate,
            SentDate: action.payload.SentDate,
            ToAccount: action.payload.ToAccount,
            Type: action.payload.Type,
          },
        ],
      };

    case ChatActionTypes.SEND_MESSAGE_FAILURE:
      return {
        ...state,
        isFetching: false,
        error: true,
        success: false,
        message: action.payload,
      };

    case ChatActionTypes.RECEIVE_MESSAGE_START:
      return {
        ...state,
        isFetching: true,
        error: false,
        success: false,
        message: null,
      };

    case ChatActionTypes.RECEIVE_MESSAGE_SUCCESS:
      return {
        ...state,
        isFetching: false,
        error: false,
        success: true,
        message: null,
        listMessage: [
          ...state.listMessage,
          {
            Content: action.payload.Content,
            FromAccount: action.payload.FromAccount,
            MessageId: action.payload.MessageId,
            SeenDate: action.payload.SeenDate,
            SentDate: action.payload.SentDate,
            ToAccount: action.payload.ToAccount,
            Type: action.payload.Type,
          },
        ],
      };

    case ChatActionTypes.SEEN_MESSAGE_START:
      return {
        ...state,
        isFetching: true,
        error: false,
        success: false,
        message: null,
      };

    case ChatActionTypes.SEEN_MESSAGE_SUCCESS:
      return {
        ...state,
        isFetching: false,
        error: false,
        success: true,
        message: null,
        listMessage: action.payload,
      };

    case ChatActionTypes.USER_ONLINE_START:
      return {
        ...state,
        isFetching: true,
        error: false,
        success: false,
        message: null,
      };

    case ChatActionTypes.USER_ONLINE_SUCCESS:
      return {
        ...state,
        isFetching: false,
        error: false,
        success: true,
        message: null,
        partner: {
          ...state.partner,
          Online: action.payload,
        },
      };

    case ChatActionTypes.USER_OFFLINE_START:
      return {
        ...state,
        isFetching: true,
        error: false,
        success: false,
        message: null,
      };

    case ChatActionTypes.USER_OFFLINE_SUCCESS:
      return {
        ...state,
        isFetching: false,
        error: false,
        success: true,
        message: null,
        partner: {
          ...state.partner,
          Online: action.payload,
        },
      };

    default:
      return state;
  }
};

export default chatReducer;
