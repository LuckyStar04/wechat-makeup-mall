const auth = require('../../utils/auth.js');
const utils = require('../../utils/util.js');


Component({
  properties: {
    message: {
      type: String,
      value: ''
    }
  },
  data: {
    canIUseGetProfile: true,
    showLoginPopup: false,
  },
  lifetimes: {
    created: function () {
      if (wx.canIUse('getUserProfile')) {
        this.setData({
          canIUseGetProfile: true
        });
      } else {
        this.setData({
          canIUseGetProfile: false
        });
      }
    }
  },
  pageLifetimes: {
    show: async function () {
      let loginResult = await auth.tryLogin();
      console.log(loginResult);
      if (loginResult == 'success') {
        this.setData({
          showLoginPopup: false
        });
        this.triggerEvent('loginSuccess', {}, {});
      } else if (loginResult == 'unauthorized') {
        this.setData({
          showLoginPopup: true
        });
      } else {
        this.setData({
          showLoginPopup: false
        });
        wx.showToast({
          title: '用户登录失败',
          icon: 'error'
        });
        this.triggerEvent('loginFailed', {}, {});
      }
    },
  },
  methods: {
    getUserProfile: function () {
      wx.getUserProfile({
        desc: '用于获取用户头像昵称',
        lang: 'zh_CN',
        success: async (res) => {
          wx.setStorageSync('userInfo', res.userInfo);
          const openid = wx.getStorageSync('openid');
          const token = await utils.requestPost({
            url: '/users',
            data: {
              openID: openid,
              userInfo: res.userInfo,
              encryptedData: res.encryptedData,
              iv: res.iv
            }
          });
          wx.setStorageSync('accessToken', 'Bearer ' + token.data.accessToken);
          wx.setStorageSync('userid', token.data.userid);
          this.setData({
            showLoginPopup: false
          });
          wx.showToast({
            title: '登录成功',
          });
          this.triggerEvent('loginSuccess', {}, {});
        },
        fail: (res) => {
          this.triggerEvent('loginFailed', res, {});
        }
      });
    },

    getUserInfo: function () {
      wx.getUserInfo({
        lang: 'zh_CN',
        success: async (res) => {
          wx.setStorageSync('userInfo', res.userInfo);
          const openid = wx.getStorageSync('openid');
          const token = await utils.requestPost({
            url: '/users',
            data: {
              openID: openid,
              userInfo: res.userInfo,
              encryptedData: res.encryptedData,
              iv: res.iv
            }
          });
          wx.setStorageSync('accessToken', 'Bearer ' + token.data.accessToken);
          wx.setStorageSync('userid', token.data.userid);
          this.setData({
            showLoginPopup: false
          });
          wx.showToast({
            title: '登录成功',
          });
          this.triggerEvent('loginSuccess', {}, {});
        },
        fail: (res) => {
          this.triggerEvent('loginFailed', res, {});
        }
      })
    },
  }
})