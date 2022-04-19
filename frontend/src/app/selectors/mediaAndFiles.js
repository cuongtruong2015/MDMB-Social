export const mediaSelector = (state) =>
    state?.listMedia?.listMedia;


export const filesSelector = (state) =>
    state?.listMedia?.listFiles;
export const linksSelector = (state) =>
    state?.listMedia?.listLink;
export const mediaAndFilesFetchingSelector = (state) =>
    state?.listMedia?.isFetching;
export const moreMediaSelector = (state) =>
    state?.listMedia?.moreMedia;
export const isUpdateMediaAndFileSelector = (state) =>
    state?.listMedia?.message;
export const moreFileSelector = (state) =>
    state?.listMedia?.moreFile;
export const moreLinkSelector = (state) =>
    state?.listMedia?.moreLink;



