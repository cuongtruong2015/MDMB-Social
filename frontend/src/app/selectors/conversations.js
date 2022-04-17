export const getConversations = (state) =>
  state?.conversations?.listConversation;

export const getFilterName = (state) => state?.conversations?.filterBy;

export const getConversationsBySearch = (state) =>
  state?.conversations?.listFilterConversation;

export const getConversationsByFilter = (state) => {
  const filterBy = getFilterName(state);
  const conversations = state?.conversations?.listConversation;
  if (filterBy === 'all') {
    return conversations;
  }
  return conversations.filter((conversation) => conversation.UnseenMessage > 0);
};

export const getLengthMessageUnread = (accountId) => (state) => {
  const listConversation = getConversations(state);
  let length = 0;
  listConversation.forEach((item) => {
    if (item.AccountId !== accountId && item.IsRead === false) {
      length += 1;
    }
  });
  return length;
};
