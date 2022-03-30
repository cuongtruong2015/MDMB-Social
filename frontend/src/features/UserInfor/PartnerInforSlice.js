import { partnerProfileActionTypes } from 'app/actions/types/partnerProfileTypes';

const initialState = {
    isFetching: false,
    error: false,
    success: false,
    message: null,
    partnerInfor: {},
    addFriendStatus:''
};
const partnerProfileReducer = (state = initialState, action) => {
    switch (action.type) {
        case partnerProfileActionTypes.PARTNER_PROFILE_START:
            return {
                ...state,
                isFetching: true,
                error: false,
                success: false,
                message: null,
            };
        case partnerProfileActionTypes.PARTNER_PROFILE_SUCCESS:
            return {
                ...state,
                isFetching: false,
                error: false,
                success: true,
                message: null,
                partnerInfor: action.payload,
            };
        case partnerProfileActionTypes.PARTNER_PROFILE_FAILURE:
            return {
                ...state,
                isFetching: false,
                error: true,
                success: false,
                message: action.payload.message,
            };
            case partnerProfileActionTypes.ADD_FRIEND_START:
                return {
                    ...state,
                    isFetching: true,
                    error: false,
                    success: false,
                    message: null,
                };
            case partnerProfileActionTypes.ADD_FRIEND_SUCCESS:
                return {
                    ...state,
                    isFetching: false,
                    error: false,
                    success: true,
                    message: null,
                    addFriendStatus: action.payload,
                };
            case partnerProfileActionTypes.ADD_FRIEND_FAILURE:
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

export default partnerProfileReducer;
