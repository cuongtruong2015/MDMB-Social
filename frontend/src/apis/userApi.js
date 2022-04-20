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
  updateAccountRelationship: ({ RelatingAccountId, RelatedAccountId, Type, ButtonIcon, RelatingAccountNickname, RelatedAccountNickname, Notification }) => {
    const url = `/account/update-friend-relationship?RelatingAccountId=${RelatingAccountId || ""}&RelatedAccountId=${RelatedAccountId || ""}&Type=${Type || ""}&ButtonIcon=${ButtonIcon || ""}&RelatingAccountNickname=${RelatingAccountNickname || ""}&RelatedAccountNickname=${RelatedAccountNickname || ""}&Notification=${Notification == 0 ? 0 : Notification || ""}`;
    return axiosClient.get(url);
  },
  checkAccountExisted: (email) => {
    const url = `/account/check-account-existed?email=${email}`;
    return axiosClient.get(url);
  },
  sentEmailForgotPassword: (email, token) => {
    const url = `/account/send-email-forgot-password?email=${email}&token=${token}`;
    return axiosClient.get(url);
  },
  checkTempToken: (email, tempToken, tempCode) => {
    const url = `/account/check-token?email=${email}&tempToken=${tempToken}&tempCode=${tempCode}`;
    return axiosClient.get(url);
  },
  changePassword: (email, tempToken, tempCode, password) => {
    const url = `/account/change-password?email=${email}&tempToken=${tempToken}&tempCode=${tempCode}&password=${password}`;
    return axiosClient.get(url);
  },


};

export default userApi;
