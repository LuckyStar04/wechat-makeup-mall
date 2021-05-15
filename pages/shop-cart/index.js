// pages/shop-cart/index.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        products: [],
        selectedCount: 0,
        selectedSumPrice: 0,
        selectAll: false,
        checkoutDisabled: false,
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        let shopCart = wx.getStorageSync('shopCart');
        if (shopCart == "") {
            this.setData({
                products: []
            });
        } else {
            this.setData({
                products: shopCart
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
        const shopCart = wx.getStorageSync('shopCart');
        if (shopCart == "") {
            this.setData({
                products: [],
                selectedCount: 0,
                selectedSumPrice: 0,
                selectAll: false,
            });
            return;
        }
        let i = 0;
        for (i in shopCart) {
            shopCart[i].product.name = shopCart[i].product.name.replace(/[\r\n]/g, "");
        }
        this.setData({
            products: shopCart
        });
        this.refreshData();
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

    refreshData() {
        let selectedCount = 0;
        let selectedSumPrice = 0;
        let i = 0;
        const products = this.data.products;
        for (i in products) {
            if (products[i].selected) {
                selectedCount++;
                selectedSumPrice += parseInt(products[i].product.price * products[i].count * 100);
            }
        }
        this.setData({
            selectedCount: selectedCount,
            selectedSumPrice: selectedSumPrice
        });

        if (selectedCount == products.length) {
            this.setData({
                selectAll: true
            });
        } else {
            this.setData({
                selectAll: false
            });
        }
        if (selectedCount == 0) {
            this.setData({
                checkoutDisabled: true
            });
        }else{
            this.setData({
                checkoutDisabled: false
            });
        }
    },

    toIndexPage() {
        wx.switchTab({
            url: '/pages/index/index',
        });
    },

    goCheckout() {
        wx.navigateTo({
          url: '/pages/checkout/checkout',
        });
    },

    radioClick(e) {
        const curId = e.currentTarget.dataset.id;
        const products = this.data.products;
        let i = 0;
        let isFound = false;
        let result = false;
        for (i in products) {
            if (products[i].id == curId) {
                isFound = true;
                result = products[i].selected;
                break;
            }
        }
        if (isFound) {
            this.setData({
                ['products[' + i + '].selected']: !result
            });
            this.refreshData();
            wx.setStorageSync('shopCart', products);
        }
    },

    selectAllClick(e) {
        const products = this.data.products;
        let i = 0;
        let result = !this.data.selectAll;

        this.setData({
            selectAll: result
        });
        for (i in products) {
            this.setData({
                ['products[' + i + '].selected']: result
            });
        }
        this.refreshData();
        wx.setStorageSync('shopCart', products);
    },

    deleteBtnTap(e) {
        const curId = e.currentTarget.dataset.id;
        const products = this.data.products;

        let i = 0;
        let isFound = false;
        let count = 0;
        for (i in products) {
            if (products[i].id == curId) {
                isFound = true;
                count = products[i].count;
                products.splice(i, 1);
                break;
            }
        }

        if (isFound) {
            let oldCount = wx.getStorageSync('shopCartCount');
            this.setData({
                products: products
            });
            this.refreshData();
            wx.setStorageSync('shopCart', products);

            let newCount = oldCount - count;
            wx.setStorageSync('shopCartCount', newCount);
            if (newCount > 0) {
                wx.setTabBarBadge({ index: 3, text: '' + newCount, });
            } else {
                wx.removeTabBarBadge({ index: 3, });
            }
        }
    },

    minusBtnTap(e) {
        const curId = e.currentTarget.dataset.id;
        const products = this.data.products;
        let i = 0;
        let isFound = false;
        let result = false;
        for (i in products) {
            if (products[i].id == curId) {
                isFound = true;
                result = products[i].count;
                break;
            }
        }
        if (isFound && result > 1) {
            let oldCount = wx.getStorageSync('shopCartCount');
            let newCount = oldCount - 1;
            this.setData({
                ['products[' + i + '].count']: result - 1
            });
            this.refreshData();
            wx.setStorageSync('shopCart', products);
            wx.setStorageSync('shopCartCount', newCount);
            wx.setTabBarBadge({ index: 3, text: '' + newCount, });
        }
    },

    plusBtnTap(e) {
        const curId = e.currentTarget.dataset.id;
        const products = this.data.products;
        let i = 0;
        let isFound = false;
        let result = false;
        for (i in products) {
            if (products[i].id == curId) {
                isFound = true;
                result = products[i].count;
                break;
            }
        }
        if (isFound && result < 99) {
            let oldCount = wx.getStorageSync('shopCartCount');
            let newCount = oldCount + 1;
            this.setData({
                ['products[' + i + '].count']: result + 1
            });
            this.refreshData();
            wx.setStorageSync('shopCart', products);
            wx.setStorageSync('shopCartCount', newCount);
            wx.setTabBarBadge({ index: 3, text: '' + newCount, });
        }
    },

    onCountChange(e) {
        const curId = e.currentTarget.dataset.id;
        const products = this.data.products;
        const newCount = parseInt(e.detail.value);
        if (isNaN(newCount) || newCount < 1) {
            this.setData({
                products: products
            });
            return;
        }
        let i = 0;
        let isFound = false;
        for (i in products) {
            if (products[i].id == curId) {
                isFound = true;
                break;
            }
        }
        if (isFound) {
            let oldCount = products[i].count;
            let diff = newCount - oldCount;
            this.setData({
                ['products[' + i + '].count']: newCount
            });
            this.refreshData();
            wx.setStorageSync('shopCart', products);

            let shopCartCount = wx.getStorageSync('shopCartCount');
            wx.setStorageSync('shopCartCount', shopCartCount + diff);
            wx.setTabBarBadge({
              index: 3,
              text: '' + (shopCartCount + diff),
            });
        }
    }
})