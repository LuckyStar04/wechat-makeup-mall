const auth = require('../../utils/auth.js');
const utils = require('../../utils/util.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    productID: '',
    productDetail: {},
    showLoginPopup: false,
    canIUseGetProfile: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    this.data.productID = options.id;
    try {
      let result = await utils.request({
        url: '/products/' + options.id
      });
      this.setData({
        productID: options.id,
        productDetail: result.data
      });
    } catch (e) {
      wx.hideLoading();
      wx.showToast({
        title: '网络连接失败',
        icon: 'error'
      });
    }
    if (wx.canIUse('getUserProfile')) {
      this.setData({
        canIUseGetProfile: true
      });
    } else {
      this.setData({
        canIUseGetProfile: false
      });
    }

    let loginResult = await auth.tryLogin();
    console.log(loginResult);
    if (loginResult == 'success') {
      this.setData({
        showLoginPopup: false
      });
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
    }
  },

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
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  addShopCart: function () {
    if (this.data.productDetail.stockCount <= 0) {
      wx.showToast({
        title: '商品已售罄',
        icon: 'error'
      });
      return;
    }

    const productToAdd = this.data.productDetail;
    const shopCart = wx.getStorageSync('shopCart');
    let shopCartCount = wx.getStorageSync('shopCartCount');
    if (shopCartCount == "") shopCartCount = 0;
    if (shopCart == "") {
      wx.setStorageSync(
        'shopCart',
        [{
          "product": {
            id: productToAdd.id,
            image: productToAdd.image[0],
            name: productToAdd.name,
            price: productToAdd.price,
            selected: true,
          },
          "count": 1
        }]);
    } else {
      let isFound = false;
      let i = 0;
      for (i in shopCart) {
        if (shopCart[i].product.id == productToAdd.id) {
          isFound = true;
          shopCart[i].count++;
          break;
        }
      }
      if (!isFound) {
        shopCart.push({
          "product": {
            id: productToAdd.id,
            image: productToAdd.image[0],
            name: productToAdd.name,
            price: productToAdd.price,
            selected: true,
          },
          "count": 1
        });
      }
      wx.setStorageSync('shopCart', shopCart);
    }
    shopCartCount++;
    wx.setStorageSync('shopCartCount', shopCartCount);
  }
})