export const getAuth = (state) => state?.login?.auth;

export const getCaptcha = (state) => state?.login?.captcha;
export const getErrorCount = (state) => state?.login?.captcha?.errorCount;

export const getErrorLogin = (state) => state?.login?.error;
export const getErrorMessageLogin = (state) => state?.login?.message;

export const getFetchingLogin = (state) => state?.login?.isFetching;

export const getLogoutSuccess = (state) => state?.login?.logout?.success;
export const getLogoutMessage = (state) => state?.login?.logout?.message;
