const app = getApp();
const utils = require('../../utils/util.js');
const auth = require('../../utils/auth.js');

Page({
  data: {
    banners: [],
    categories: [],
    recommendProducts: [],
    topSalesProducts: [],
    notice: {},

    scrolltop: 0,
  },
  async onLoad() {
    wx.showShareMenu({
      withShareTicket: true
    });
    await this.loadIndexData();
  },
  async onShow() {
    let shopCartCount = wx.getStorageSync('shopCartCount');
    if (shopCartCount > 0) {
      wx.setTabBarBadge({
        index: 3,
        text: '' + shopCartCount,
      });
    } else {
      wx.removeTabBarBadge({
        index: 3,
      });
    }
  },
  async loadIndexData() {
    try {
      wx.showLoading();
      let result = await utils.request({
        url: '/configs/banner'
      });
      this.setData({
        banners: result.data
      });

      result = await utils.request({
        url: '/configs/notice'
      });
      this.setData({
        notice: result.data
      });

      result = await utils.request({
        url: '/categories?limit=10'
      });
      this.setData({
        categories: result.data
      });

      result = await utils.request({
        url: '/products?orderBy=1&pageNumber=1&pageSize=10'
      });
      this.setData({
        recommendProducts: result.data
      });

      result = await utils.request({
        url: '/products?orderBy=2&pageNumber=1&pageSize=10'
      });
      this.setData({
        topSalesProducts: result.data
      });
      wx.hideLoading();
    } catch (e) {
      wx.hideLoading();
      wx.showToast({
        title: '网络连接失败',
        icon: 'error'
      });
    }
  },
  onPullDownRefresh: async function () {
    await this.loadIndexData();
  },
  tapBanner(e) {
    const url = e.currentTarget.dataset.url;
    if (url) {
      wx.navigateTo({
        url: url,
      })
    }
  },
  onCategoryTap(e) {
    wx.setStorageSync('_categoryId', e.currentTarget.dataset.id);
    wx.switchTab({
      url: '/pages/category/category',
    });
  },
  onDetailsTap(e) {
    wx.navigateTo({
      url: '/pages/product-details/index?id=' + e.currentTarget.dataset.id
    });
  },
  goCoupons() {
    wx.switchTab({
      url: '/pages/coupons/index',
    });
  }
})