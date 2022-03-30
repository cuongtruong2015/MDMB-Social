import axiosClient from 'apis/axiosClient';

const previewLinkApi = {
  getPreviewLinkApi:  (urlParam) => {
    const url = `/chat/link-preview?url=${urlParam}`;
    return axiosClient.get(url);
  },
};

export default previewLinkApi;
