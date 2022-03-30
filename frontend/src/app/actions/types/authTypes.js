export const AuthActionTypes = {
  REGISTER_START: 'auth/register/start',
  REGISTER_FAILURE: 'auth/register/failure',
  REGISTER_SUCCESS: 'auth/register/success',
  RESET_REGISTER: 'auth/register/reset',

  LOGIN_START: 'auth/login/start',
  LOGIN_FAILURE: 'auth/login/failure',

  LOGIN_SUCCESS: 'auth/login/success',
  LOGIN_GOOGLE_SUCCESS: 'auth/login/google',
  LOGIN_RESET: 'auth/login/reset',

  LOGOUT_START: 'auth/logout',
  LOGOUT_FAILURE: 'auth/logout/failure',
  LOGOUT_SUCCESS: 'auth/logout/success',

  REFRESH_TOKEN_SUCCESS: 'auth/refreshToken',

  VERIFY_CAPTCHA_SUCCESS: 'auth/verifyCaptcha/success',
  VERIFY_CAPTCHA_FAILURE: 'auth/verifyCaptcha/failure',

  REDIRECT_TO_LOGIN: 'auth/redirect/login',
  FILL_TO_REGISTER: 'auth/fill/register',

  RESET_LOGIN_ERROR: 'auth/login/resetError',
};
