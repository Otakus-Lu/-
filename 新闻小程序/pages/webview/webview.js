//校园官网
Page({
  onLoad: function (options) {
    let url = wx.getStorageSync('url')
    this.setData({
      url: url
    })
  },
})