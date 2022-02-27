const DB = wx.cloud.database()
let NickName=''
let newstype=''
let tittle1=''
let zuozhe=''
let newscontent=''
let imageID=''
let readycontent=''
let OPT=''
Page({

  data: {
    articleContent: '', //文章正文
    formats: {},
    readOnly: false,
    placeholder: '开始输入...',
    editorHeight: 300,
    keyboardHeight: 0,
    isIOS: false,
    selectArray: [{
      "id": "1",
      "text": "Protoss"
  }, {
      "id": "2",
      "text": "Terran"
  }, {
      "id": "3",
      "text": "Zerg"
  }, {
      "id": "4",
      "text": "学习方法"
  }]  ,
  imagePath:'../../images/upload.png',
  },
    onLoad(opt) {
      OPT=opt
      console.log("传进来的数据",opt)
      DB.collection('news').doc(opt.id).get()
      .then(res => {
        console.log('详情请求成功', res)
        let bean = res.data
        readycontent=bean.content
        newstype=bean.type
        tittle1=bean.title
        imageID=bean.img
        newscontent=bean.content
        this.setData({
          detail: res.data,
          imagePath:bean.img,
          title:bean.title,
          newstype:bean.type
        })
        console.log("新闻正文",readycontent)
        this.onEditorReady()
      })
      .catch(res => {
        console.log('详情请求失败', res)
      })
      //富文本编辑器
      const platform = wx.getSystemInfoSync().platform
      const isIOS = platform === 'ios'
      this.setData({ isIOS})
      const that = this
      this.updatePosition(0)
      let keyboardHeight = 0
      wx.onKeyboardHeightChange(res => {
        if (res.height === keyboardHeight) return
        const duration = res.height > 0 ? res.duration * 1000 : 0
        keyboardHeight = res.height
        setTimeout(() => {
          wx.pageScrollTo({
            scrollTop: 0,
            success() {
              that.updatePosition(keyboardHeight)
              that.editorCtx.scrollIntoView()
            }
          })
        }, duration)
  
      })
      wx.getUserInfo({
        success: (res)=> {
          console.log("用户信息",res.userInfo)
          zuozhe=res.userInfo.nickName
          // console.log("昵称",NickName)
          this.setData({
            zuozhe: res.userInfo.nickName,
          })
        }
      })
    },
    // -----------富文本编辑器 start ------------------
    readOnlyChange() {
      this.setData({
        readOnly: !this.data.readOnly
      })
    },
    updatePosition(keyboardHeight) {
      const toolbarHeight = 50
      const { windowHeight, platform } = wx.getSystemInfoSync()
      let editorHeight = keyboardHeight > 0 ? (windowHeight - keyboardHeight - toolbarHeight) : windowHeight
      this.setData({ editorHeight, keyboardHeight })
    },
    calNavigationBarAndStatusBar() {
      const systemInfo = wx.getSystemInfoSync()
      const { statusBarHeight, platform } = systemInfo
      const isIOS = platform === 'ios'
      const navigationBarHeight = isIOS ? 44 : 48
      return statusBarHeight + navigationBarHeight
    },
    onEditorReady() {
      const that = this
      wx.createSelectorQuery().select('#editor').context(function (res) {
        that.editorCtx = res.context
        that.editorCtx.setContents({
          html:readycontent    //这里就是设置默认值的地方（html 后面给什么就显示什么）
        });
      }).exec()
    },
    blur() {
      this.editorCtx.blur()
    },
    format(e) {
      let { name, value } = e.target.dataset
      if (!name) return
      console.log('format', name, value)
      this.editorCtx.format(name, value)
  
    },
    onStatusChange(e) {
      const formats = e.detail
      this.setData({ formats })
    },
    insertDivider() {
      this.editorCtx.insertDivider({
        success: function () {
          console.log('insert divider success')
        }
      })
    },
    clear() {
      this.editorCtx.clear({
        success: function (res) {
          console.log("clear success")
        }
      })
    },
    removeFormat() {
      this.editorCtx.removeFormat()
    },
    insertDate() {
      const date = new Date()
      const formatDate = `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`
      this.editorCtx.insertText({
        text: formatDate
      })
    },
    insertImage() {
      const that = this
      wx.chooseImage({
        count: 1,
        success: function (res) {
          that.editorCtx.insertImage({
            src: res.tempFilePaths[0],
            data: {
              id: 'abcd',
              role: 'god'
            },
            width: '80%',
            success: function () {
              console.log('insert image success')
            }
          })
        }
      })
    },
    getEditorValue(e) {
      this.setData({
        articleContent: e.detail.html
      })
      console.log(e.detail.html)
      newscontent=e.detail.html
    },
    // -----------富文本编辑器 end ------------------
    //返回按钮
    fanhui(){
      wx.reLaunch({
        url: '../home/home'
      })
    },
    //发布按钮
    fabu(){
      let that=this
      console.log("新闻类型",newstype)
      console.log("新闻标题",tittle1)
      console.log("新闻作者",zuozhe)
      console.log("新闻正文",newscontent)
      console.log("新闻封面",imageID)
      wx.cloud.callFunction({
        name: "news",
        data: {
          action: "bianji",
          id:OPT.id,
          type: newstype,
          tittle:tittle1,
          author:zuozhe,
          img:imageID,
          content:newscontent
        }
      }).then(res => {
        console.log("发布成功", res)
        that.onLoad()
        wx.redirectTo({
          url: '/pages/mynews/mynews'
        })
      })
      .catch(res => {
        console.log("发布失败", res)
        wx.hideLoading()
      })
    },
    handleItemChange(e){
      console.log(e.detail.nowText)
      newstype=e.detail.nowText
    },
    //获取用户输入的标题内容
  getContent(event) {
    tittle1=event.detail.value
    this.setData({
      tittle:event.detail.value
    })
  },
  imageupload(){
    let that = this;
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: function (res) {
        wx.showLoading({
          title: '上传中',
        })
        const filePath = res.tempFilePaths[0]
        const cloudPath = 'cloudbase-cms/upload/my-image/' +Math.random() * 1000000+filePath.match(/\.[^.]+?$/)[0]
        wx.cloud.uploadFile({
          cloudPath: cloudPath,
          filePath:filePath, // 文件路径
          success: res => {
            imageID=res.fileID
            console.log(res.fileID)
            that.setData({
              imagePath:res.fileID
            })
            console.log("图片路径2",imagePath)  
          },
          fail: err => {
            // handle error
          }
        })
        wx.hideLoading() 
      }
    })
  }
})
