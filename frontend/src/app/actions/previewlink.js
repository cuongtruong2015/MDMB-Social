import previewLinkApi from 'apis/previewLinkApi';
import { previewLinkActionTypes } from 'app/actions/types/previewLinkTypes';

const getPreviewLinkStart = () => {
  return {
    type: previewLinkActionTypes.PREVIEW_LINK_START,
  };
};

const getPreviewLinkSuccess = (urlInfor) => {
  return {
    type: previewLinkActionTypes.PREVIEW_LINK_SUCCESS,
    payload: urlInfor,
  };
};

const getPreviewLinkFailure = (message) => {
  return {
    type: previewLinkActionTypes.PREVIEW_LINK_FAILURE,
    payload: message,
  };
};

export const getPreviewLink = (url) => async (dispatch) => {
  dispatch(getPreviewLinkStart());
  const data = await previewLinkApi.getPreviewLinkApi(url);
  if (data) {
    dispatch(
      getPreviewLinkSuccess(
        {...data,url}
      )
    );
  } else {
    dispatch(getPreviewLinkFailure('Cannot get url Infor!'));
  }
};
