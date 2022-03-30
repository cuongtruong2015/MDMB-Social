import axiosClient from 'apis/axiosClient';

const userApi = {
  updateProfile: (data) => {
    const url = 'account/update';
    return axiosClient.post(url, {
      Email: data.Email,
      Avatar: data.Avatar,
      Gender: data.Gender,
      Birthday: data.Birthday,
      Name: data.Name,
    });
  },
  getAccountInfor: (accountId) => {
    const url = `/account/account-information?accountId=${accountId}`;
    return axiosClient.get(url);
  },
  getPartnerAccountInfor: (accountId) => {
    const url = `/account/account-information?accountId=${accountId}`;
    return axiosClient.get(url);
  },
  searchByName: (searchKey, accountId) => {
    const url = `/account/account-list-searching?SearchKey=${searchKey}&AccountId=${accountId}`;
    return axiosClient.get(url);
  },
  addFriend: (relatingAccountId, relatedAccountId, type) => {
    const url = `/account/insert-relationship?RelatingAccountId=${relatingAccountId}&RelatedAccountId=${relatedAccountId}&Type=${type}`;
    return axiosClient.get(url);
  },
  getListRelationship: (AccountId) => {
    const url = `/account/list-have-relationship?AccountId=${AccountId}`;
    return axiosClient.get(url);
  },
  getListFriendRecommended: (AccountId) => {
    const url = `/account/list-friend-recommended?AccountId=${AccountId}`;
    return axiosClient.get(url);
  },
  
  
};

export default userApi;
