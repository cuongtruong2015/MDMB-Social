export const getRoomId = (state) => state?.chat?.roomId;
export const getListMessageLatest = (state) => state?.chat?.listMessage;

export const getPartner = (state) => state?.chat?.partner;

export const getFetchingMessage = (state) => state?.chat?.isFetching;
export const getMessageSeenLatest = (state) => {
  const listMessage = getListMessageLatest(state);

  if (listMessage.length > 0) {
    const listMessageSeen = listMessage?.filter((item) => {
      return item.SeenDate;
    });
    return listMessageSeen[listMessageSeen.length - 1];
  }
  return null;
};
