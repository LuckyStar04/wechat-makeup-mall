const auth = require('../../utils/auth.js');
const utils = require('../../utils/util.js');

// pages/my/index.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        userInfo: {},
        orderCounts: [],
        couponCounts: [],
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {},

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

    loadInfo: async function (e) {
        try {
            wx.showLoading();
            const userid = wx.getStorageSync('userid');
            const user = await utils.requestWithToken({
                url: '/users/' + userid
            });
            this.setData({
                userInfo: user.data
            });
            const orderCounts = await utils.requestWithToken({
                url: '/orders/counts'
            });
            this.setData({
                orderCounts: orderCounts.data.orderCounts
            });
            const couponCounts = await utils.requestWithToken({
                url: '/coupons/counts'
            });
            this.setData({
                couponCounts: couponCounts.data.couponCounts
            });
            wx.hideLoading();
        } catch (e) {
            wx.hideLoading();
            wx.showToast({
              title: '网络连接失败',
            });
        }
    },
})