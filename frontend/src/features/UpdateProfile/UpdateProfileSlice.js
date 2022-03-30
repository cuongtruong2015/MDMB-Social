import { updateProfileActionTypes } from 'app/actions/types/updateProfileTypes';

const initialState = {
    isFetching: false,
    error: false,
    success: false,
    message: null,
    result: ''
};
const updateProfileReducer = (state = initialState, action) => {
    switch (action.type) {
        case updateProfileActionTypes.UPDATE_PROFILE_START:
            return {
                ...state,
                isFetching: true,
                error: false,
                success: false,
                message: null,
            };
        case updateProfileActionTypes.UPDATE_PROFILE_SUCCESS:
            return {
                ...state,
                isFetching: false,
                error: false,
                success: true,
                message: null,
                result: action.payload,
            };
        case updateProfileActionTypes.UPDATE_PROFILE_FAILURE:
            return {
                ...state,
                isFetching: false,
                error: true,
                success: false,
                result: action.payload.message,
            };
        default:
            return state;
    }
};

export default updateProfileReducer;
