import { mediaTypes, FileTypes, LinkTypes, MoreMediaTypes } from 'app/actions/types/mediaAndFileTypes';

const initialState = {
    isFetching: false,
    error: false,
    success: false,
    message: null,
    listMedia: [],
    listFiles: [],
    listLink: [],
    moreMedia: [],
};
const listMediaReducer = (state = initialState, action) => {
    switch (action.type) {
        case mediaTypes.GET_MEDIA_START:
            return {
                ...state,
                isFetching: true,
                error: false,
                success: false,
                message: null,
            };
        case mediaTypes.GET_MEDIA_SUCCESS:
            return {
                ...state,
                isFetching: false,
                error: false,
                success: true,
                message: null,
                listMedia: action.payload,
            };
        case mediaTypes.GET_MEDIA_FAILURE:
            return {
                ...state,
                isFetching: false,
                error: true,
                success: false,
                message: action.payload.message,
            };
        //---files------------------------------//
        case FileTypes.GET_FILES_START:
            return {
                ...state,
                isFetching: true,
                error: false,
                success: false,
                message: null,
            };
        case FileTypes.GET_FILES_SUCCESS:
            return {
                ...state,
                isFetching: false,
                error: false,
                success: true,
                message: null,
                listFiles: action.payload,
            };
        case FileTypes.GET_FILES_FAILURE:
            return {
                ...state,
                isFetching: false,
                error: true,
                success: false,
                message: action.payload.message,
            };
        //----------------links------------------------------//
        case LinkTypes.GET_LINKS_START:
            return {
                ...state,
                isFetching: true,
                error: false,
                success: false,
                message: null,
            };
        case LinkTypes.GET_LINKS_SUCCESS:
            return {
                ...state,
                isFetching: false,
                error: false,
                success: true,
                message: null,
                listLink: action.payload,
            };
        case LinkTypes.GET_LINKS_FAILURE:
            return {
                ...state,
                isFetching: false,
                error: true,
                success: false,
                message: action.payload.message,
            };
        //----------------get more media------------------------------//
        case MoreMediaTypes.GET_MORE_MEDIA_START:
            return {
                ...state,
                isFetching: true,
                error: false,
                success: false,
                message: null,
            };
        case MoreMediaTypes.GET_MORE_MEDIA_SUCCESS:
            var obj = state.moreMedia;
            var check = false;
            for (let i = 0; i < action.payload.length; i++) {
                for (let j = 0; j < obj.length; j++) {
                    if (obj[j].MessageId === action.payload[i].MessageId) {
                        check = true;
                    }
                }
            }
            if (!check) obj = [...obj, ...action.payload]
            if (check) var msg = "no update"
            else var msg = null;
            return {
                ...state,
                isFetching: false,
                error: false,
                success: true,
                message: msg,
                moreMedia: obj,
            };
        case MoreMediaTypes.GET_MORE_MEDIA_FAILURE:
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

export default listMediaReducer;
