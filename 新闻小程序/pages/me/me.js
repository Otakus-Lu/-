// pages/me/me.js
const app = getApp();
Page({
  // 页面的初始数据
  data: {
    userInfo: null,
  },
  onShow(options) {
    var user = app.globalData.userInfo;
    if (user && user.nickName) {
      this.setData({
        userInfo: user,
      })
    } else {
      this.setData({
        userInfo: wx.getStorageSync('user')
      })
    }
  },
  // button获取用户信息
  onGotUserInfo: function (e) {
    if (e.detail.userInfo) {
      var user = e.detail.userInfo;
      this.setData({
        userInfo: e.detail.userInfo,
      })
      app.globalData.userInfo.nickName = user.nickName;
      app.globalData.userInfo.avatarUrl = user.avatarUrl;
      app._saveUserInfo(app.globalData.userInfo);
    } else {
      app._showSettingToast('登陆需要允许授权');
    }
  },
  //退出登录
  tuichu() {
    wx.setStorageSync('user', null)
    this.setData({
      userInfo: null,
    })
  },
  //去我的收藏页
  goShouchang: function () {
    wx.navigateTo({
      url: '/pages/shoucang/shoucang',
    })
  },

})