let type = ''
let zuozhe=''
Page({
  data: {
    news: []
  },
  onLoad(opt) {
    wx.getUserInfo({
      success: (res)=> {
        console.log("用户信息",res.userInfo)
        zuozhe=res.userInfo.nickName
        // console.log("昵称",NickName)
      }
    })
  },
  onShow() {
    this.getNews()
  },
  //获取新闻列表数据
  getNews() {
    wx.getUserInfo({
      success: (res)=> {
        console.log("用户信息",res.userInfo)
        zuozhe=res.userInfo.nickName
        wx.cloud.database().collection('news')
        .where({
          zuozhe:zuozhe
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
        // console.log("昵称",NickName)
      }
    })
    // wx.cloud.database().collection('news')
    //   .where({
    //     zuozhe:zuozhe
    //   })
    //   .get()
    //   .then(res => {
    //     console.log('请求新闻列表成功', res)
    //     this.setData({
    //       news: res.data
    //     })
    //   })
    //   .catch(res => {

    //   })
  },
  //去新闻详情页
  goDetail(event) {
    let item = event.currentTarget.dataset.item
    wx.navigateTo({
      url: '/pages/detail/detail?id=' + item._id,
    })
  },
  goBianji(event) {
    let item = event.currentTarget.dataset.item
    console.log("item",item._id)
     wx.navigateTo({
        url: '/pages/bianji/bianji?id=' + item._id,
     })
  }
})