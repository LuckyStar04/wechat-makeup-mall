const auth = require('../../utils/auth.js');
const utils = require('../../utils/util.js');

Page({
  data: {
    availableCoupons: [],
    ownedCoupons: [],
    expiredCoupons: [],
    userid: '',
    show: true
  },

  async onLoad(e) {},

  async onShow(e) {},

  async loadCoupons(e) {
    const userid = wx.getStorageSync('userid');
    this.setData({
      userid: userid
    });
    try {
      wx.showLoading();
      let result = await utils.requestWithToken({
        url: '/users/coupons?type=1' //可领优惠券
      });
      let i = 0;
      for (i in result.data) {
        const date1 = new Date(result.data[i].coupon.startTime);
        const date2 = new Date(result.data[i].coupon.endTime);
        result.data[i].coupon.startDate = date1;
        result.data[i].coupon.endDate = date2;
        result.data[i].coupon.sDate = utils.formatDate(date1);
        result.data[i].coupon.eDate = utils.formatDate(date2);
      }
      this.setData({
        availableCoupons: result.data
      });

      result = await utils.requestWithToken({
        url: '/users/coupons?type=0' //失效优惠券
      });
      i = 0;
      for (i in result.data) {
        const date1 = new Date(result.data[i].coupon.startTime);
        const date2 = new Date(result.data[i].coupon.endTime);
        result.data[i].coupon.startDate = date1;
        result.data[i].coupon.endDate = date2;
        result.data[i].coupon.sDate = utils.formatDate(date1);
        result.data[i].coupon.eDate = utils.formatDate(date2);
      }
      this.setData({
        expiredCoupons: result.data
      });

      result = await utils.requestWithToken({
        url: '/users/coupons?type=2' //已领优惠券
      });
      i = 0;
      for (i in result.data) {
        const date1 = new Date(result.data[i].coupon.startTime);
        const date2 = new Date(result.data[i].coupon.endTime);
        result.data[i].coupon.startDate = date1;
        result.data[i].coupon.endDate = date2;
        result.data[i].coupon.sDate = utils.formatDate(date1);
        result.data[i].coupon.eDate = utils.formatDate(date2);
      }
      this.setData({
        ownedCoupons: result.data
      });

      wx.hideLoading();
    } catch (e) {
      console.log(e);
      wx.hideLoading();
      wx.showToast({
        title: '网络连接失败',
        icon: 'error'
      });
    }
  },

  async getCoupon(e) {
    const coupon = e.currentTarget.dataset.item;
    if (coupon.coupon.couponCount <= 0) {
      wx.showToast({
        title: '已被一抢而光',
        icon: 'error'
      });
      return;
    }
    if (coupon.recievedCount >= coupon.coupon.allowLimit) {
      wx.showToast({
        title: '已达领取上限',
        icon: 'error'
      });
      return;
    }
    const now = new Date();
    if (now > coupon.coupon.endDate) {
      wx.showToast({
        title: '已过有效期',
        icon: 'error'
      });
      return;
    }
    const userid = this.data.userid;
    let result = await utils.postWithToken({
      url: '/users/coupons/' + coupon.couponID
    });
    if (result.statusCode == 201) {
      wx.showToast({
        title: '领取成功',
      });
      const available = this.data.availableCoupons;
      let i = 0;
      for (i in available) {
        if (available[i].couponID == result.data.couponID) {
          available[i] = result.data;
          const date1 = new Date(result.data.coupon.startTime);
          const date2 = new Date(result.data.coupon.endTime);
          result.data.coupon.startDate = date1;
          result.data.coupon.endDate = date2;
          result.data.coupon.sDate = utils.formatDate(date1);
          result.data.coupon.eDate = utils.formatDate(date2);
          this.setData({
            availableCoupons: available
          });
        }
      }
      result = await utils.requestWithToken({
        url: '/users/coupons?type=2' //已领优惠券
      });
      i = 0;
      for (i in result.data) {
        const date1 = new Date(result.data[i].coupon.startTime);
        const date2 = new Date(result.data[i].coupon.endTime);
        result.data[i].coupon.startDate = date1;
        result.data[i].coupon.endDate = date2;
        result.data[i].coupon.sDate = utils.formatDate(date1);
        result.data[i].coupon.eDate = utils.formatDate(date2);
      }
      this.setData({
        ownedCoupons: result.data
      });
    } else {
      wx.showToast({
        title: '领取优惠券失败',
        icon: 'error'
      });
    }
  }
});