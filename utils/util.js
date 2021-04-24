const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return `${[year, month, day].map(formatNumber).join('/')} ${[hour, minute, second].map(formatNumber).join(':')}`
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : `0${n}`
}


const pubUrl = "http://192.168.2.216:5000/api" //这是我要请求的数据接口的公共部分
const request = (options) => {
  return new Promise((resolve, reject) => {
    wx.request({
      url: options.url.startsWith('http') ? options.url : pubUrl + options.url,
      method: options.method || 'get',
      data: options.data || {},
      header: options.header || {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: resolve,
      fail: reject
    })
  })
}

const requestPost = (options) => {
  return new Promise((resolve, reject) => {
    wx.request({
      url: options.url.startsWith('http') ? options.url : pubUrl + options.url,
      method: options.method || 'POST',
      data: options.data || {},
      header: options.header || {
        'content-type': 'application/json'
      },
      success: resolve,
      fail: reject
    })
  })
}

const requestWithToken = (options) => {
  return new Promise((resolve, reject) => {
    const token = wx.getStorageSync('accessToken');
    wx.request({
      url: options.url.startsWith('http') ? options.url : pubUrl + options.url,
      method: options.method || 'get',
      data: options.data || {},
      header: options.header || {
        'content-type': 'application/x-www-form-urlencoded',
        'authorization': token,
      },
      success: resolve,
      fail: reject
    })
  })
}

const postWithToken = (options) => {
  return new Promise((resolve, reject) => {
    const token = wx.getStorageSync('accessToken');
    wx.request({
      url: options.url.startsWith('http') ? options.url : pubUrl + options.url,
      method: options.method || 'POST',
      data: options.data || {},
      header: options.header || {
        'content-type': 'application/json',
        'authorization': token,
      },
      success: resolve,
      fail: reject
    })
  })
}

module.exports = {
  formatTime,
  request,
  requestPost,
  requestWithToken,
  postWithToken
}