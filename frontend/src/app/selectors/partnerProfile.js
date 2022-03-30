export const getPartnerProfileSelector = (state) =>
  state?.partnerProfile?.partnerInfor;
  
export const isFetchingPartnerProfile = (state) =>
  state?.partnerProfile?.isFetching;


export const getSearchAccountSelector = (state) =>
  state?.searchAccount?.searchListAccount;

export const getFetchingSearchAccount = (state) => state?.searchAccount?.isFetching;

export const getAddFriendStatus = (state) =>
  state?.partnerProfile?.addFriendStatus;