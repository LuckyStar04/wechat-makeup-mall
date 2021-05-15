const auth = require('../../utils/auth.js');
const utils = require('../../utils/util.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    productID: '',
    productDetail: {},
    shopCartCount: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    this.data.productID = options.id;
    try {
      wx.showLoading();
      let result = await utils.request({
        url: '/products/' + options.id
      });
      this.setData({
        productID: options.id,
        productDetail: result.data
      });
      result = wx.getStorageSync('shopCartCount');
      if (result == '') {
        this.setData({shopCartCount: 0});
      } else {
        this.setData({shopCartCount: result});
      }

      wx.hideLoading();
    } catch (e) {
      wx.hideLoading();
      wx.showToast({
        title: '网络连接失败',
        icon: 'error'
      });
    }
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
          product: {
            id: productToAdd.id,
            image: productToAdd.image[0],
            name: productToAdd.name,
            price: productToAdd.price,
            fareId: productToAdd.shippingFareID,
          },
          id: productToAdd.id,
          selected: true,
          count: 1
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
          product: {
            id: productToAdd.id,
            image: productToAdd.image[0],
            name: productToAdd.name,
            price: productToAdd.price,
            fareId: productToAdd.shippingFareID,
          },
          id: productToAdd.id,
          selected: true,
          count: 1
        });
      }
      wx.setStorageSync('shopCart', shopCart);
    }
    shopCartCount++;
    wx.setStorageSync('shopCartCount', shopCartCount);
    this.setData({
      shopCartCount: shopCartCount
    });
  },

  goShopCart(e) {
    wx.switchTab({
      url: '/pages/shop-cart/index',
    })
  },

  buyNow(e) {
    wx.navigateTo({
      url: '/pages/checkout/checkout?productID=' + this.data.productID,
    });
  }
})