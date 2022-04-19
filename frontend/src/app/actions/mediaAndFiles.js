import chatApi from 'apis/chatApi';
import { mediaTypes, FileTypes, LinkTypes, MoreMediaTypes, MoreFileTypes, MoreLinkTypes } from 'app/actions/types/mediaAndFileTypes';

const getMediaStart = () => {
    return {
        type: mediaTypes.GET_MEDIA_START,
    };
};

const getMediaSuccess = (data) => {
    return {
        type: mediaTypes.GET_MEDIA_SUCCESS,
        payload: data
    };
};

const getMediaFailure = (message) => {
    return {
        type: mediaTypes.GET_MEDIA_FAILURE,
        payload: message,
    };
};

export const getMedia = (myAccountId, friendAccountId) => async (dispatch) => {
    dispatch(getMediaStart());
    const data = await chatApi.getListImageAndVideo(myAccountId, friendAccountId);
    dispatch(getMediaSuccess(data));
};
//------------Files------------------------------//
const getFilesStart = () => {
    return {
        type: FileTypes.GET_FILES_START,
    };
};

const getFilesSuccess = (data) => {
    return {
        type: FileTypes.GET_FILES_SUCCESS,
        payload: data
    };
};

const getFilesFailure = (message) => {
    return {
        type: FileTypes.GET_FILES_FAILURE,
        payload: message,
    };
};

export const getFiles = (myAccountId, friendAccountId) => async (dispatch) => {
    dispatch(getFilesStart());
    const data = await chatApi.getFiles(myAccountId, friendAccountId);
    dispatch(getFilesSuccess(data));
};
//------------Links------------------------------//
const getLinksStart = () => {
    return {
        type: LinkTypes.GET_LINKS_START,
    };
};

const getLinksSuccess = (data) => {
    return {
        type: LinkTypes.GET_LINKS_SUCCESS,
        payload: data
    };
};

const getLinksFailure = (message) => {
    return {
        type: LinkTypes.GET_LINKS_FAILURE,
        payload: message,
    };
};

export const getLinks = (myAccountId, friendAccountId) => async (dispatch) => {
    dispatch(getLinksStart());
    const data = await chatApi.getLinks(myAccountId, friendAccountId);
    dispatch(getLinksSuccess(data));
};

//------------MoreMedia------------------------------//
const getMoreMediaStart = () => {
    return {
        type: MoreMediaTypes.GET_MORE_MEDIA_START,
    };
};

const getMoreMediaSuccess = (data) => {
    return {
        type: MoreMediaTypes.GET_MORE_MEDIA_SUCCESS,
        payload: data
    };
};

const getMoreMediaFailure = (message) => {
    return {
        type: MoreMediaTypes.GET_MORE_MEDIA_FAILURE,
        payload: message,
    };
};

export const getMoreMedia = (myAccountId, friendAccountId, messageId) => async (dispatch) => {
    dispatch(getMoreMediaStart());
    const data = await chatApi.getMoreListImageAndVideo(myAccountId, friendAccountId, messageId);
    dispatch(getMoreMediaSuccess(data));
};
const removeMoreMediaSuccess = () => {
    return {
        type: MoreMediaTypes.REMOVE_MORE_MEDIA_START,
    };
};
export const removeMoreMedia = () => async (dispatch) => {
    dispatch(removeMoreMediaSuccess());
};

//------------MoreFile------------------------------//
const getMoreFileStart = () => {
    return {
        type: MoreFileTypes.GET_MORE_File_START,
    };
};

const getMoreFileSuccess = (data) => {
    return {
        type: MoreFileTypes.GET_MORE_File_SUCCESS,
        payload: data
    };
};

const getMoreFileFailure = (message) => {
    return {
        type: MoreFileTypes.GET_MORE_File_FAILURE,
        payload: message,
    };
};

export const getMoreFile = (myAccountId, friendAccountId, messageId) => async (dispatch) => {
    dispatch(getMoreFileStart());
    const data = await chatApi.getFiles(myAccountId, friendAccountId, messageId);
    dispatch(getMoreFileSuccess(data));
};

const removeMoreFileSuccess = () => {
    return {
        type: MoreFileTypes.REMOVE_MORE_File_SUCCESS,
    };
};
export const removeMoreFile = () => async (dispatch) => {
    dispatch(removeMoreFileSuccess());
};


//------------MoreLink------------------------------//
const getMoreLinkStart = () => {
    return {
        type: MoreLinkTypes.GET_MORE_LINK_START
    };
};

const getMoreLinkSuccess = (data) => {
    return {
        type: MoreLinkTypes.GET_MORE_LINK_SUCCESS,
        payload: data
    };
};

const getMoreLinkFailure = (message) => {
    return {
        type: MoreLinkTypes.GET_MORE_LINK_FAILURE,
        payload: message,
    };
};

export const getMoreLink = (myAccountId, friendAccountId, messageId) => async (dispatch) => {
    dispatch(getMoreLinkStart());
    const data = await chatApi.getLinks(myAccountId, friendAccountId, messageId);
    dispatch(getMoreLinkSuccess(data));
};

const removeMoreLinkSuccess = () => {
    return {
        type: MoreLinkTypes.REMOVE_MORE_Link_SUCCESS,
    };
};
export const removeMoreLink = () => async (dispatch) => {
    dispatch(removeMoreLinkSuccess());
};