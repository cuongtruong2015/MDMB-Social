import { userProfileActionTypes } from 'app/actions/types/userProfileTypes';

const initialState = {
    isFetching: false,
    error: false,
    success: false,
    message: null,
    userInfor: {}
};
const userProfileReducer = (state = initialState, action) => {
    switch (action.type) {
        case userProfileActionTypes.USER_PROFILE_START:
            return {
                ...state,
                isFetching: true,
                error: false,
                success: false,
                message: null,
            };
        case userProfileActionTypes.USER_PROFILE_SUCCESS:
            return {
                ...state,
                isFetching: false,
                error: false,
                success: true,
                message: null,
                userInfor: action.payload,
            };
        case userProfileActionTypes.USER_PROFILE_FAILURE:
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

export default userProfileReducer;
