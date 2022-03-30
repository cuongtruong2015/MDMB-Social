import axiosClient from 'apis/axiosClient';

const chatApi = {
  getListFriend: async (user) => {
    const url = `/account/list-friend?accountId=${user.accountId}`;
    return axiosClient.get(url);
  },

  getListMessage: async (myAccountId, yourAccountId) => {
    const url = `/chat/old-message?accountId=${myAccountId}&friendId=${yourAccountId}`;
    return axiosClient.get(url);
  },
};
export default chatApi;
