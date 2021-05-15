const utils = require('./util.js');

const login = () => {
  return new Promise((resolve, reject) => {
    wx.login({
      timeout: 5000,
      success: resolve,
      fail: reject
    });
  });
};

const checkSession = () => {
  return new Promise((resolve, reject) => {
    wx.checkSession({
      success: resolve,
      fail: reject
    })
  });
};

const tryLogin = async () => {
  const accessToken = wx.getStorageSync('accessToken');
  if (accessToken == "") {
    return await doLogin();
  } else {
    try {
      this.checkSession();
      return 'success';
    } catch (e) {
      return await doLogin();
    }
  }
};

const doLogin = async () => {
  try {
    const code = await login();
    const result = await utils.requestPost({
      url: '/account/users/login',
      data: {
        code: code.code
      }
    });
    if (result.statusCode == 401) {
      wx.setStorageSync('openid', result.data);
      return 'unauthorized';
    } else {
      wx.setStorageSync('accessToken', 'Bearer ' + result.data.accessToken);
      wx.setStorageSync('userid', result.data.userid);
      return 'success';
    }
  } catch {
    return 'fail';
  }
}

module.exports = {
  login,
  checkSession,
  tryLogin
}