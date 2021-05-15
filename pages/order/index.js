const auth = require('../../utils/auth.js');
const utils = require('../../utils/util.js');

Page({
  data: {
    ordersAll: [],
    ordersToPay: [],
    ordersToSend: [],
    ordersToWait: [],
    ordersToComment: [],
    title: 0,
  },

  loadOrders: async function() {
    const all = await utils.requestWithToken({
      url: '/orders'
    });
    const topay = await utils.requestWithToken({
      url: '/orders?status=0'
    });
    const tosend = await utils.requestWithToken({
      url: '/orders?status=1'
    });
    const towait = await utils.requestWithToken({
      url: '/orders?status=2'
    });
    const tocomment = await utils.requestWithToken({
      url: '/orders?status=3'
    });
    this.setData({
      ordersAll: all.data,
      ordersToPay: topay.data,
      ordersToSend: tosend.data,
      ordersToWait: towait.data,
      ordersToComment: tocomment.data,
    });
  },
})