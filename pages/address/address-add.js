import {
  areaList
} from '@vant/area-data';

const auth = require('../../utils/auth.js');
const utils = require('../../utils/util.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    areaList,

    fullArea: '',
    showArea: false,
    address: {
      provinceID: '',
      cityID: '',
      countyID: '',

      province: '',
      city: '',
      county: '',

      address: '',
      receiverName: '',
      phoneNumber: '',
      postCode: '',
      isDefault: true,
      orderById: 0,
    },

    nameErrmsg: '',
    phoneErrmsg: '',
    areaErrmsg: '',
    detailErrmsg: '',
    postErrmsg: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.orderById) {
      this.setData({
        ['address.orderById']: options.orderById,
        ['address.isDefault']: false,
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

  onNameChange: function (e) {
    this.setData({
      ['address.receiverName']: e.detail.trim(),
    });
    this.validateName(e.detail);
  },

  validateName(e) {
    if (e.trim().length == 0) {
      this.setData({
        nameErrmsg: "姓名不能为空",
      });
      return false;
    } else {
      this.setData({
        nameErrmsg: "",
      });
      return true;
    }
  },

  onPhoneChange: function (e) {
    this.setData({
      ['address.phoneNumber']: e.detail.trim(),
    });
    this.validatePhone(e.detail);
  },

  validatePhone(e) {
    if (e.trim().length == 0) {
      this.setData({
        phoneErrmsg: "电话号码不能为空",
      });
      return false;
    } else if (!this.checkNumber(e)) {
      this.setData({
        phoneErrmsg: "电话号码必须为数字",
      });
      return false;
    } else {
      this.setData({
        phoneErrmsg: "",
      });
      return true;
    }
  },

  onDetailChange: function (e) {
    this.setData({
      ['address.address']: e.detail.trim(),
    });
    this.validateDetail(e.detail);
  },

  validateDetail(e) {
    if (e.trim().length == 0) {
      this.setData({
        detailErrmsg: "详细地址不能为空",
      });
      return false;
    } else {
      this.setData({
        detailErrmsg: "",
      });
      return true;
    }
  },

  onPostChange: function (e) {
    this.setData({
      ['address.postCode']: e.detail.trim(),
    });
    this.validatePost(e.detail);
  },

  validatePost(e) {
    if (e.trim().length == 0) {
      this.setData({
        postErrmsg: "邮政编码不能为空",
      });
      return false;
    } else if (!this.checkNumber(e)) {
      this.setData({
        postErrmsg: "邮政编码必须为数字",
      });
      return false;
    } else {
      this.setData({
        postErrmsg: "",
      });
      return true;
    }
  },

  onDefaultChange: function (e) {
    this.setData({
      ['address.isDefault']: e.detail
    });
  },

  toggleArea: function (e) {
    this.setData({
      showArea: !this.data.showArea
    });
    this.validateArea();
  },

  validateArea() {
    if (!this.data.address.countyID) {
      this.setData({
        areaErrmsg: "请选择所在地区",
      });
      return false;
    } else {
      this.setData({
        areaErrmsg: "",
      });
      return true;
    }
  },

  confirmArea: function (e) {
    this.setData({
      ['address.provinceID']: e.detail.values[0].code,
      ['address.cityID']: e.detail.values[1].code,
      ['address.countyID']: e.detail.values[2].code,
      ['address.province']: e.detail.values[0].name,
      ['address.city']: e.detail.values[1].name,
      ['address.county']: e.detail.values[2].name,

      fullArea: e.detail.values[0].name + ' ' + e.detail.values[1].name + ' ' + e.detail.values[2].name,
    });
    this.toggleArea();
  },

  saveAddress: async function (e) {
    if (this.validateName(this.data.address.receiverName) &&
      this.validatePhone(this.data.address.phoneNumber) &&
      this.validateArea() &&
      this.validateDetail(this.data.address.address) &&
      this.validatePost(this.data.address.postCode)) {

      const result = await utils.postWithToken({
        url: '/users/addrs',
        data: this.data.address
      });

      if (result.statusCode == 201) {
        var pages = getCurrentPages();
        if (pages.length > 1) {
          var prevPage = pages[pages.length - 2];
          await prevPage.loadAddress();
          wx.navigateBack({
            delta: 1
          });
        }
      }
    }
  },

  checkNumber: function (theObj) {
    var reg = /^[0-9]+.?[0-9]*$/;
    if (reg.test(theObj)) {
      return true;
    }
    return false;
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