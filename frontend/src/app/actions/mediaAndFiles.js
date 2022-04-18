import chatApi from 'apis/chatApi';
import { mediaTypes, FileTypes, LinkTypes, MoreMediaTypes } from 'app/actions/types/mediaAndFileTypes';

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
