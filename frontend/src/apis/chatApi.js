import axiosClient from 'apis/axiosClient';

const chatApi = {
  getListFriend: (user) => {
    const url = `/account/list-friend?accountId=${user.accountId}`;
    return axiosClient.get(url);
  },

  getListMessage: (myAccountId, yourAccountId) => {
    const url = `/chat/old-message?accountId=${myAccountId}&friendId=${yourAccountId}`;
    return axiosClient.get(url);
  },
  getListImageAndVideo: (myAccountId, yourAccountId) => {
    const url = `/chat/image-and-video?accountId=${myAccountId}&friendId=${yourAccountId}`;
    return axiosClient.get(url);
  },
  getFiles: (myAccountId, yourAccountId) => {
    const url = `/chat/files?accountId=${myAccountId}&friendId=${yourAccountId}`;
    return axiosClient.get(url);
  },
  getLinks: (myAccountId, yourAccountId) => {
    const url = `/chat/links?accountId=${myAccountId}&friendId=${yourAccountId}`;
    return axiosClient.get(url);
  },
  getMoreListImageAndVideo: (myAccountId, yourAccountId, messageId) => {
    const url = `/chat/more-image-and-video?accountId=${myAccountId}&friendId=${yourAccountId}&messageId=${messageId}`;
    return axiosClient.get(url);
  },
  getMoreFiles: (myAccountId, yourAccountId, messageId) => {
    const url = `/chat/more-files?accountId=${myAccountId}&friendId=${yourAccountId}&messageId=${messageId}`;
    return axiosClient.get(url);
  },
  getMoreLinks: (myAccountId, yourAccountId, messageId) => {
    const url = `/chat/more-links?accountId=${myAccountId}&friendId=${yourAccountId}&messageId=${messageId}`;
    return axiosClient.get(url);
  }
};
export default chatApi;
