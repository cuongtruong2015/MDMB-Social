import { mediaTypes, FileTypes, LinkTypes, MoreMediaTypes, MoreFileTypes, MoreLinkTypes } from 'app/actions/types/mediaAndFileTypes';

const initialState = {
    isFetching: false,
    error: false,
    success: false,
    message: null,
    listMedia: [],
    listFiles: [],
    listLink: [],
    moreMedia: [],
    moreFile: [],
    moreLink: [],
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
            var obj = state.moreMedia || [];
            var check = false;
            for (let i = 0; i < action.payload.length; i++) {
                for (let j = 0; j < obj.length; j++) {
                    if (obj[j].MessageId === action.payload[i].MessageId) {
                        check = true;
                    }
                }
            }
            if (!check) obj = [...obj, ...action.payload]
            if (check || !action.payload[0]) var msg = "no update";
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
        case MoreMediaTypes.REMOVE_MORE_MEDIA_START:
            return {
                ...state,
                isFetching: false,
                error: false,
                success: false,
                message: null,
            };
        case MoreMediaTypes.REMOVE_MORE_MEDIA_SUCCESS:
            return {
                ...state,
                isFetching: false,
                error: false,
                success: true,
                message: null,
                moreMedia: []
            };
        //----------------get more file------------------------------//
        case MoreFileTypes.GET_MORE_File_START:
            return {
                ...state,
                isFetching: true,
                error: false,
                success: false,
                message: null,
            };
        case MoreFileTypes.GET_MORE_File_SUCCESS:
            var obj = state.moreFile || [];
            var check = false;
            for (let i = 0; i < action.payload.length; i++) {
                for (let j = 0; j < obj.length; j++) {
                    if (obj[j].MessageId === action.payload[i].MessageId) {
                        check = true;
                    }
                }
            }
            if (!check) obj = [...obj, ...action.payload]
            if (check || !action.payload[0]) var msg = "no update";
            else var msg = null;
            return {
                ...state,
                isFetching: false,
                error: false,
                success: true,
                message: msg,
                moreFile: obj,
            };
        case MoreFileTypes.GET_MORE_File_FAILURE:
            return {
                ...state,
                isFetching: false,
                error: true,
                success: false,
                message: action.payload.message,
            };
        case MoreFileTypes.REMOVE_MORE_File_SUCCESS:
            return {
                ...state,
                isFetching: false,
                error: false,
                success: true,
                message: null,
                moreFile: []
            };
        //----------------get more link------------------------------//
        case MoreLinkTypes.GET_MORE_LINK_START:
            return {
                ...state,
                isFetching: true,
                error: false,
                success: false,
                message: null,
            };
        case MoreLinkTypes.GET_MORE_LINK_SUCCESS:
            var obj = state.moreLink || [];
            var check = false;
            for (let i = 0; i < action.payload.length; i++) {
                for (let j = 0; j < obj.length; j++) {
                    if (obj[j].MessageId === action.payload[i].MessageId) {
                        check = true;
                    }
                }
            }
            if (!check) obj = [...obj, ...action.payload]
            if (check || !action.payload[0]) var msg = "no update";
            else var msg = null;
            return {
                ...state,
                isFetching: false,
                error: false,
                success: true,
                message: msg,
                moreLink: obj,
            };
        case MoreLinkTypes.GET_MORE_LINK_FAILURE:
            return {
                ...state,
                isFetching: false,
                error: true,
                success: false,
                message: action.payload.message,
            };
        case MoreLinkTypes.REMOVE_MORE_Link_SUCCESS:
            return {
                ...state,
                isFetching: false,
                error: false,
                success: true,
                message: null,
                moreLink: []
            };
        default:
            return state;
    }
};

export default listMediaReducer;
