import conversationApi from 'apis/conversationApi';
import { olderMessageTypes } from 'app/actions/types/olderMessageTypes';

const getOlderMessageStart = () => {
    return {
        type: olderMessageTypes.GET_OLDER_MESSAGE_START,
    };
};

const getOlderMessageSuccess = (data) => {
    return {
        type: olderMessageTypes.GET_OLDER_MESSAGE_SUCCESS,
        payload: data
    };
};

const getOlderMessageFailure = (message) => {
    return {
        type: olderMessageTypes.GET_OLDER_MESSAGE_FAILURE,
        payload: message,
    };
};

export const getOlderMessage = (myAccountId, friendAccountId, messageId) => async (dispatch) => {
    dispatch(getOlderMessageStart());
    const data = await conversationApi.getOdlerMessage(myAccountId, friendAccountId, messageId);
    if (data[0]) {
        dispatch(getOlderMessageSuccess(data));
    } else {
        dispatch(getOlderMessageFailure('get older message failed!'));
    }
};
export const removeOlderMessage = () => async (dispatch) => {
    dispatch(getOlderMessageStart());
    dispatch(getOlderMessageSuccess('remove'));
};