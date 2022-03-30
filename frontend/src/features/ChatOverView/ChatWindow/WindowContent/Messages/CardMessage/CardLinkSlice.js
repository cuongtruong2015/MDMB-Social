import { previewLinkActionTypes } from 'app/actions/types/previewLinkTypes';

const initialState = {
    isFetching: false,
    error: false,
    success: false,
    message: null,
    urlInfor: []
};
const previewLinkReducer = (state = initialState, action) => {
    switch (action.type) {
        case previewLinkActionTypes.PREVIEW_LINK_START:
            return {
                ...state,
                isFetching: true,
                error: false,
                success: false,
                message: null,
            };
        case previewLinkActionTypes.PREVIEW_LINK_SUCCESS:
            return {
                ...state,
                isFetching: false,
                error: false,
                success: true,
                message: null,
                urlInfor: [...state.urlInfor, action.payload],
            };
        case previewLinkActionTypes.PREVIEW_LINK_FAILURE:
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

export default previewLinkReducer;