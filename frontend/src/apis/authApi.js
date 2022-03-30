import axiosClient from './axiosClient';

const authApi = {
  register: async (data) => {
    const url = 'account/register';
    return axiosClient.post(url, {
      Name: data.name,
      Phone: data.phone,
      Email: data.email.trim().toLowerCase(),
      Password: data.password,
    });
  },

  registerByGoogle: async (data) => {
    const url = '/account/register-by-google';
    return axiosClient.post(url, {
      Name: data.name,
      Email: data.email.trim().toLowerCase(),
      Phone: data.phone,
    });
  },

  login: (data) => {
    const url = 'account/login';
    return axiosClient.post(url, {
      Username: data.emailorphone.trim().toLowerCase(),
      Password: data.password,
    });
  },

  loginWithGoogle: (tokenId) => {
    const url = 'account/login-by-google';
    return axiosClient.post(url, {
      token: tokenId,
    });
  },

  loginWithFacebook: (tokenId) => {
    const url = `account/login-by-facebook/user?=${tokenId}`;
    return axiosClient.get(url);
  },

  refreshToken: (refreshToken) => {
    return axiosClient.post('auth/refresh-token', {
      refreshToken,
    });
  },

  verifyCaptcha: (response) => {
    const url = `auth/captcha?captcha=${response}`;
    return axiosClient.get(url);
  },
};

export default authApi;
