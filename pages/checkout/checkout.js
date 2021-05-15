import Dialog from '../../miniprogram_npm/@vant/weapp/dialog/dialog';

const auth = require('../../utils/auth.js');
const utils = require('../../utils/util.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    products: [],
    address: {},
    addressId: 0,
    selectedSumCount: 0,
    selectedSumPrice: 0.0,
    isInstant: false,

    showProduct: false,
    showCoupon: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    try {
      wx.showLoading();
      if (options.productID) {
        const result = await utils.request({
          url: '/products/' + options.productID
        });
        let products = [{
          product: {
            id: result.data.id,
            image: result.data.image[0],
            name: result.data.name,
            price: result.data.price,
            fareId: result.data.fareId,
          },
          id: result.data.id,
          selected: true,
          count: 1
        }];
        this.setData({
          products: products,
          isInstant: true,
          selectedSumPrice: result.data.price,
        });
      } else {
        const cart = wx.getStorageSync('shopCart');
        if (cart == "" || cart.length == 0) {
          Dialog.alert({
            title: '错误',
            message: '购物车是空的哦~'
          }).then(() => {
            wx.navigateBack();
          });
        }

        let selected = [];
        let sumCount = 0;
        let sumPrice = 0.0;
        let i = 0;
        for (i in cart) {
          if (cart[i].selected == true) {
            selected.push(cart[i]);
            sumCount += cart[i].count;
            sumPrice += cart[i].product.price * cart[i].count;
          }
        }
        if (selected.length == 0) {
          Dialog.alert({
            title: '错误',
            message: '购物车没有勾选任何商品哦~'
          }).then(() => {
            wx.navigateBack();
          });
        }
        this.setData({
          isInstant: false,
          products: selected,
          selectedSumCount: sumCount,
          selectedSumPrice: sumPrice,
        });
      }
      await this.calcShippingFare();
      await this.loadData();
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

  loadData: async function () {
    await this.loadAddress();
    await this.calcShippingFare();
  },

  loadAddress: async function () {
    if (this.data.addressId == 0) {
      const addr = await utils.requestWithToken({
        url: '/users/addrs?isDefault=true',
      });
      if (addr.data.length > 0 && addr.data[0] != null && !addr.data[0].isDeleted) {
        this.setData({
          address: addr.data[0],
        });
      } else {
        this.setData({
          address: {}
        });
      }
    } else {
      const addr = await utils.requestWithToken({
        url: '/users/addrs/' + this.data.addressId,
      });
      this.setData({
        address: addr.data,
      });
    }
  },

  calcShippingFare: async function () {
    const products = this.data.products;
    let i = 0;
    for (i in products) {

    }
  },

  chooseAddress(e) {
    if (!this.data.address.address) {
      wx.navigateTo({
        url: '/pages/address/address-add',
      });
    } else {
      wx.navigateTo({
        url: '/pages/address/address?needReturn=1',
      });
    }
  },

  showProducts(e) {
    this.setData({
      showProduct: true
    });
  },

  showCoupons(e) {
    this.setData({
      showCoupon: true
    });
  },

  onCloseProduct(e) {
    this.setData({
      showProduct: false
    });
  },

  onCloseCoupon(e) {
    this.setData({
      showCoupon: false
    });
  },

})