import axiosClient from 'apis/axiosClient';

const conversationApi = {
  getListConversation: (accountId) => {
    const url = `/account/list-friend-with-last-message-count-unseen?accountId=${accountId}`;
    return axiosClient.get(url);
  },
  getOdlerMessage: (accountId, friendId, messageId) => {
    const url = `/chat/older-message?accountId=${accountId}&friendId=${friendId}&messageId=${messageId}`;
    return axiosClient.get(url);

  }
};

export default conversationApi;
