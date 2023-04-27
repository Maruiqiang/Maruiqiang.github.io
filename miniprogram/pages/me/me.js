const db = wx.cloud.database();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    hasUserInfo: false,
    canIUseGetUserProfile: false,
    admin: false,
    openid:''
  },
  //联系客服
  getWXCustomer() {
    wx.setClipboardData({
        data: '15008656247',
        success: () => {
            wx.showToast({
                title: '复制微信成功',
            })
        }
    })
},

//跳转平台须知
goThings(){
  wx.navigateTo({
    url: '../xuzhi/xuzhi',
  })
},
  // 跳转到后台管理
  admin(){
    wx.navigateTo({
      url: '../admin/admin',
    })
  },
  // 跳转订单管理页
  toOrder(res){
    var name = res.currentTarget.dataset.name;
    wx.navigateTo({
      url: '../myOrder/myOrder?name='+name,
    })
  },

  // 跳转我的收藏
  goToCollection(res){
    wx.redirectTo({
      url: '../myCollection/myCollection',
    })
  },

 
  getUserProfile(res) {
    // 推荐使用wx.getUserProfile获取用户信息，开发者每次通过该接口获取用户个人信息均需用户确认
    // 开发者妥善保管用户快速填写的头像昵称，避免重复弹窗
    wx.getUserProfile({
      desc: '用于完善会员资料', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
      success: (res) => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
        wx.setStorageSync('userInfo', res.userInfo);//缓存本地userinfo
      }
    })
  },
  getUserInfo(e) {
    // 不推荐使用getUserInfo获取用户信息，预计自2021年4月13日起，getUserInfo将不再弹出弹窗，并直接返回匿名的用户个人信息
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
    wx.setStorageSync('openid', e.detail.openid);//缓存本地userinfo
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    if (wx.getUserProfile) {
      this.setData({
          canIUseGetUserProfile: true
      })
  }
    const userInfo = wx.getStorageSync('userInfo');
    this.setData({
        hasUserInfo: !!userInfo,//将类型转换为bool值
        userInfo: userInfo,
    })
    wx.cloud.callFunction({
      name: 'OpenId',
      success(res) {
        console.log(res.result.openid);
        that.setData({
          openid: res.result.openid
        })
        // 查询admin集合，判断是否为管理员
        db.collection('admin').where({
          adminID: that.data.openid
        }).get({
          success(res) {
            that.setData({
              admin: !!res.data.length//双重取反将类型转换为bool值
            })
          }
        })
      }
    })
   
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