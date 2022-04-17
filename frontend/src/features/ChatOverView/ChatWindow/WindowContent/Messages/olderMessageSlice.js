import { olderMessageTypes } from 'app/actions/types/olderMessageTypes';

const initialState = {
    isFetching: false,
    error: false,
    success: false,
    message: null,
    olderMessage: []
};
const odlerMessageReducer = (state = initialState, action) => {
    switch (action.type) {
        case olderMessageTypes.GET_OLDER_MESSAGE_START:
            return {
                ...state,
                isFetching: true,
                error: false,
                success: false,
                message: null,
            };
        case olderMessageTypes.GET_OLDER_MESSAGE_SUCCESS:
            if (action.payload === 'remove')
                return {
                    ...state,
                    isFetching: false,
                    error: false,
                    success: true,
                    message: null,
                    olderMessage: [],
                };
            var obj = state.olderMessage;
            var check = false;
            for (let i = 0; i < action.payload.length; i++) {
                for (let j = 0; j < obj.length; j++) {
                    if (obj[j].MessageId === action.payload[i].MessageId) {
                        check = true;
                    }
                }
            }
            if (!check) obj = [...obj, ...action.payload]
            return {
                ...state,
                isFetching: false,
                error: false,
                success: true,
                message: null,
                olderMessage: obj,
            };
        case olderMessageTypes.GET_OLDER_MESSAGE_FAILURE:
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

export default odlerMessageReducer;
