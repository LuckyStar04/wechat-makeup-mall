const utils = require('../../utils/util.js');

Page({

    /**
     * 页面的初始数据
     */
    data: {
        categories: [],
        activeCategory: 0,

        products: [],
    
        scrolltop: 0,

        pageNumber: 1,
        pageSize: 10,
        nextPageUrl: '',
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: async function (options) {
        wx.showShareMenu({
          withShareTicket: true
        })
        await this.loadPageData();
    },
    async loadPageData() {
        console.log('loadData..');
        try {
            wx.showLoading();
            let result = await utils.request({url:'/categories'});
        
            if (result.data.length == 0) {
                this.setData({categories:[],products:[]});
                return;
            }
            this.setData({
                categories: result.data
            });

            result = await utils.request({url:`/products?categoryID=${result.data[0].id}&pageNumber=${this.data.pageNumber}&pageSize=${this.data.pageSize}`});
            let pg = JSON.parse(result.header['X-Pagination']);
            this.setData({
                products: result.data,
                nextPageUrl: pg.nextPageLink
            });
            wx.hideLoading();
        }
        catch(e) {
            wx.hideLoading();wx.showToast({title: '网络连接失败',icon: 'error'});
        }
    },
    async onCategoryClick(e){
        const idx = e.target.dataset.idx;
        if (idx == this.data.activeCategory) {
            this.setData({ scrolltop: 0 });
            return;
        }
        try {
            wx.showLoading({title: ""});
            this.setData({
                pageNumber: 1,
                activeCategory: idx,
                scrolltop: 0
            });
            let result = await utils.request({url:`/products?categoryID=${e.target.id.substring(8)}&pageNumber=${this.data.pageNumber}&pageSize=${this.data.pageSize}`});
            let pg = JSON.parse(result.header['X-Pagination']);
            this.setData({
                products: result.data,
                nextPageUrl: pg.nextPageLink
            });
            wx.hideLoading();
        }
        catch(e) {
          wx.hideLoading();wx.showToast({title: '网络连接失败',icon: 'error'});
        }
    },
    async scrollToBottom(e) {
        if (this.data.nextPageUrl) {
            try {
                wx.showLoading();
                this.data.pageNumber++;
                let result = await utils.request({url:this.data.nextPageUrl});
                let pg = JSON.parse(result.header['X-Pagination']);
                this.setData({
                    products: this.data.products.concat(result.data),
                    nextPageUrl: pg.nextPageLink
                });
                wx.hideLoading();
            }
            catch(e) {
              wx.hideLoading();wx.showToast({title: '网络连接失败',icon: 'error'});
            }
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
    onShow: async function () {
        //显示购物车Badge
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

        if (this.data.categories.length == 0) {
            await this.loadPageData();
        }
        const _categoryId = wx.getStorageSync('_categoryId');
        let activeCategory = 0;
        wx.removeStorageSync('_categoryId');
        if (_categoryId) {
            activeCategory = this.data.categories.findIndex(ele => {
                return ele.id == _categoryId
            });
            this.setData({
                activeCategory
            });
            let result = await utils.request({url:`/products?categoryID=${this.data.categories[activeCategory].id}&pageNumber=${this.data.pageNumber}&pageSize=${this.data.pageSize}`})
            .catch(function(reason,data){wx.showToast({title: '网络连接失败',icon: 'error'});});
            let pg = JSON.parse(result.header['X-Pagination']);
            this.setData({
                products: result.data,
                nextPageUrl: pg.nextPageLink
            });
        }
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
    addShopCart: function (e) {
        const productID = e.currentTarget.dataset.id;
        let isFound = false;
        let i = 0;
        let productToAdd = {};
        //先判断库存是否够用
        for (i in this.data.products) {
            if (this.data.products[i].id == productID) {
                isFound = true;
                if (this.data.products[i].stockCount <= 0) {
                    wx.showToast({
                      title: '商品已售罄',
                      icon: 'error'
                    });
                    return;
                }
                productToAdd = this.data.products[i];
            }
        }
        if (!isFound) return;

        const shopCart = wx.getStorageSync('shopCart');
        let shopCartCount = wx.getStorageSync('shopCartCount');
        if (shopCartCount == "") shopCartCount = 0;
        if (shopCart == "") {
            wx.setStorageSync(
                'shopCart',
                [{"product": {
                    id: productToAdd.id,
                    image: productToAdd.image,
                    name: productToAdd.name,
                    price:productToAdd.price,
                    selected: true,
                }, "count": 1}]);
        } else {
            isFound = false;
            for (i in shopCart) {
                if (shopCart[i].product.id == productID) {
                    isFound = true;
                    shopCart[i].count++;
                    break;
                }
            }
            if (!isFound) {
                shopCart.push({"product": {
                    id: productToAdd.id,
                    image: productToAdd.image,
                    name: productToAdd.name,
                    price:productToAdd.price,
                    selected: true,
                }, "count": 1});
            }
            wx.setStorageSync('shopCart', shopCart);
        }
        shopCartCount++;
        wx.setStorageSync('shopCartCount', shopCartCount);
        wx.setTabBarBadge({
          index: 3,
          text: ''+shopCartCount,
        });
    }
})