//用来做随机颜色用的
const colorArr = ["#EE2C2C", "#ff7070", "#EEC900", "#4876FF", "#ff6100",
  "#7DC67D", "#E17572", "#7898AA", "#C35CFF", "#33BCBA", "#C28F5C",
  "#FF8533", "#6E6E6E", "#428BCA", "#5cb85c", "#FF674F", "#E9967A",
  "#66CDAA", "#00CED1", "#9F79EE", "#CD3333", "#FFC125", "#32CD32",
  "#00BFFF", "#68A2D5", "#FF69B4", "#DB7093", "#CD3278", "#607B8B"
]

Page({
  data: {
    // 顶部轮播图
    topImgs: [{
        url: "https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=3784765665,2345487170&fm=26&gp=0.jpg"
      },
      {
        url: "https://ss3.bdstatic.com/70cFv8Sh_Q1YnxGkpoWK1HF6hhy/it/u=1907927687,2995211948&fm=26&gp=0.jpg"
      }, {
        url: "https://ss3.bdstatic.com/70cFv8Sh_Q1YnxGkpoWK1HF6hhy/it/u=1306649852,1696095523&fm=26&gp=0.jpg"
      }
    ],
  },
  //获取热门
  onLoad() {
    wx.cloud.database().collection('news').orderBy('liulan', 'desc')
      .limit(3)
      .get()
      .then(res => {
        console.log('浏览量靠前的资讯', res)
        this.setData({
          banners: res.data
        })
      })
  },
  onShow() {
    this.getNews()
  },
  //去新闻详情页
  goDetail(event) {
    let id = event.currentTarget.dataset.id
    wx.navigateTo({
      url: '/pages/detail/detail?id=' + id,
    })
  },
  //去相关资讯列表页
  goToList(e) {
    let type = e.currentTarget.dataset.type
    wx.navigateTo({
      url: '/pages/news/news?type=' + type,
    })
  },
  //获取新闻列表数据
  getNews() {
    wx.cloud.database().collection('news').orderBy('_createTime', 'desc')
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
  goDetail2(event) {
    let item = event.currentTarget.dataset.item
    wx.navigateTo({
      url: '/pages/detail/detail?id=' + item._id,
    })
  },
  chuangzuo(){
    wx.reLaunch({
      url: '../editor/editor'
    })
  }
})