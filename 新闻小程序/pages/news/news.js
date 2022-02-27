let type = ''
Page({
  data: {
    news: []
  },
  onLoad(opt) {
    type = opt.type

  },
  onShow() {
    this.getNews()
  },
  //获取新闻列表数据
  getNews() {
    wx.cloud.database().collection('news')
      .where({
        type: type
      })
      .get()
      .then(res => {
        console.log('请求新闻列表成功', res)
        this.setData({
          news: res.data
        })
      })
      .catch(res => {

      })
  },
  //去新闻详情页
  goDetail(event) {
    let item = event.currentTarget.dataset.item
    wx.navigateTo({
      url: '/pages/detail/detail?id=' + item._id,
    })
  }
})