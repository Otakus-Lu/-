const app = getApp()
const DB = wx.cloud.database()
let id = ''
let NickName=''
let replier='作者'
let OPT
Page({
  data: {
    shouCangNum: 0, //收藏人数
    isShouCang: false, //是否收藏
    replyUrl:"../../images/reply.png",
    replier
  },
  onLoad(opt) {
    OPT=opt
    console.log("传进来的id：" + opt.id)
    id = opt.id
    DB.collection('news').doc(opt.id).get()
      .then(res => {
        console.log('详情页请求成功', res)
        let bean = res.data
        console.log('是否收藏', this.checkShouCang(bean._id))
        this.setData({
          detail: res.data,
          time: app._getCurrentTime(bean._createTime),
          shouCangNum: bean.shoucang,
          liulanNum: bean.liulan,
          isShouCang: this.checkShouCang(bean._id)
        })
        this.addViews()
      })
      .catch(res => {
        console.log('详情页请求失败', res)
      })
      DB.collection('comment').where({
        id: opt.id
      }).get()
      .then(res => {
        console.log('评论请求成功', res)
        this.setData({
          comment: res.data,
        })
      })
      .catch(res => {
        console.log('评论请求失败', res)
      })
      wx.getUserInfo({
        success: (res)=> {
          console.log("用户信息",res.userInfo)
          NickName=res.userInfo.nickName
          // console.log("昵称",NickName)
          this.setData({
            nickname: res.userInfo.nickName,
            avatarUrl: res.userInfo.avatarUrl,
          })
        }
      })
  },
  //增加浏览量
  addViews() {
    //修改数据库里的收藏人数
    wx.cloud.callFunction({
      name: 'news',
      data: {
        _id: id,
        action: "liulan",
        num: 1
      }
    }).then(res => console.log('增加浏览量结果', res))
  },
  //点击了收藏按钮
  shoucang(event) {
    let detail = event.currentTarget.dataset.detail
    let list = wx.getStorageSync('shoucang')
    if (!list) {
      list = []
    }
    let isShouCang = this.checkShouCang(detail._id)
    if (isShouCang) { //如果已经收藏，就取消收藏
      let index = list.findIndex(item => {
        return item._id == detail._id
      })
      list.splice(index, 1)
      isShouCang = false
    } else { //没有收藏，就保存收藏
      delete detail._createTime //删除无用字段
      delete detail._updateTime //删除无用字段
      delete detail.content //删除无用字段
      list.push(detail)
      isShouCang = true
    }
    wx.setStorageSync('shoucang', list)
    let num = this.data.shouCangNum
    this.setData({
      shouCangNum: isShouCang ? ++num : --num,
      isShouCang: isShouCang
    })
    //修改数据库里的收藏人数
    wx.cloud.callFunction({
      name: 'news',
      data: {
        _id: detail._id,
        action: "shoucang",
        num: isShouCang ? 1 : -1
      }
    }).then(res => console.log('收藏结果', res))
  },

  //检查是否收藏了本篇文章
  checkShouCang(id) {
    let list = wx.getStorageSync('shoucang')
    if (list && list.length > 0) {
      let res = list.findIndex(item => {
        return item._id == id
      })
      return res != -1
    }
    return false
  },
  //获取用户输入的评论内容
  getContent(event) {
    this.setData({
      content: event.detail.value
    })
  },
  reply(event){
    replier=event.currentTarget.dataset.item.zuozhe;
    this.setData({
      replier
    })
    console.log("回复",event.currentTarget.dataset.item.zuozhe)
  },
  cancel(event){
    replier='作者';
    this.setData({
      replier
    })
  },
  //发表评论
   fabiao() {
    let content = this.data.content
    if (content.length < 2) {
      wx.showToast({
        icon: "none",
        title: '评论太短了',
      })
      return
    }
    wx.showLoading({
      title: '发表中。。。',
    })
    wx.cloud.callFunction({
      name: "news",
      data: {
        action: "fabiao",
        id: id,
        content:content,
        reply:replier,
        zuozhe:NickName
      }
    }).then(res => {
      console.log("发表成功", res)
      this.setData({
        content:''
      })
      wx.hideLoading()    
      if (getCurrentPages().length != 0) {
      //刷新当前页面的数据
      getCurrentPages()[getCurrentPages().length - 1].onLoad(OPT)
    }
    })
    .catch(res => {
      console.log("发表失败", res)
      wx.hideLoading()
    })
  }
})