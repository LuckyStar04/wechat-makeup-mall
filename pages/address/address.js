const auth = require('../../utils/auth.js');
const utils = require('../../utils/util.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    address: [],
    needReturn: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.needReturn) {
      this.setData({
        needReturn: 1,
      });
    }
  },

  loadAddress: async function (e) {
    try {
      wx.showLoading();
      const result = await utils.requestWithToken({
        url: '/users/addrs'
      });
      this.setData({
        address: result.data
      });
      wx.hideLoading();
    } catch (e) {
      wx.hideLoading();
      wx.showToast({
        title: '网络连接错误',
      });
    }
  },

  addAddress: function (e) {
    let maxid = 0;
    let i = 0;
    const address = this.data.address;
    if (address.length > 0) {
      for (i in address) {
        if (address[i].orderById > maxid) maxid = address[i].orderById;
      }
      maxid += 100;
      wx.navigateTo({
        url: '/pages/address/address-add?orderById=' + maxid,
      });
    } else {
      wx.navigateTo({
        url: '/pages/address/address-add',
      });
    }
  },

  addressSelected: function (e) {
    if (this.data.needReturn == 0) return;
    var pages = getCurrentPages();
    if (pages.length > 1) {
      var prevPage = pages[pages.length - 2];
      const id = e.currentTarget.dataset.id;
      prevPage.setData({
        addressId: id
      });
      wx.navigateBack({
        delta: 1
      });
    }
  },

  modifyAddress: function (e) {
    const id = e.currentTarget.dataset.id;
    console.log(id);
    wx.navigateTo({
      url: '/pages/address/address-edit?id=' + id,
    });
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

  }
})