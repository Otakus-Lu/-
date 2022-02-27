App({
  globalData: {
    userInfo: {},
    openid: null,
  },
  onLaunch: function () {
    //云开发初始化
    wx.cloud.init({
      env: 'cloudayi-1gmd7l9jcf7c8e76', //自己的云开发环境id
      traceUser: true,
    })
    this.getOpenid();
  },
  // 获取用户openid
  getOpenid: function () {
    var app = this;
    var openidStor = wx.getStorageSync('openid');
    if (openidStor) {
      console.log('本地获取openid:' + openidStor);
      app.globalData.openid = openidStor;
      app._getMyUserInfo();
    } else {
      wx.cloud.callFunction({
        name: 'getOpenid',
        success(res) {
          console.log('云函数获取openid成功', res.result.openid)
          var openid = res.result.openid;
          wx.setStorageSync('openid', openid)
          app.globalData.openid = openid;
          app._getMyUserInfo();
        },
        fail(res) {
          console.log('云函数获取失败', res)
        }
      })
    }
  },
  //获取自己后台的user信息
  _getMyUserInfo() {
    let app = this
    //优先拿线上的用户数据，线上没有再拿线上
    wx.cloud.database().collection('students')
      .doc(app.globalData.openid)
      .get()
      .then(res => {
        if (res && res.data) {
          app.globalData.userInfo = res.data;
          console.log('qcl线上获取user', app.globalData.userInfo)
        } else {
          let userStor = wx.getStorageSync('user');
          console.log('qcl本地获取user', userStor)
          if (userStor) {
            app.globalData.userInfo = userStor
          }
        }
      })
      .catch(res => {
        let userStor = wx.getStorageSync('user');
        console.log('本地获取user', userStor)
        if (userStor) {
          app.globalData.userInfo = userStor
        }

      })

  },
  // 保存userinfo
  _saveUserInfo: function (user) {
    console.log("保存的userinfo", user)
    this.globalData.userInfo = user;
    wx.setStorageSync('user', user)
  },
  // 获取当前时间
  _getCurrentTime(date) {
    var d = new Date();
    if (date) {
      var d = new Date(date);
    }
    var month = d.getMonth() + 1;
    var date = d.getDate();
    var day = d.getDay();
    var hours = d.getHours();
    var minutes = d.getMinutes();

    var curDateTime = d.getFullYear() + '年';
    if (month > 9)
      curDateTime += month + '月';
    else
      curDateTime += month + '月';

    if (date > 9)
      curDateTime = curDateTime + date + "日";
    else
      curDateTime = curDateTime + date + "日";
    if (hours > 9)
      curDateTime = curDateTime + hours + "时";
    else
      curDateTime = curDateTime + hours + "时";
    if (minutes > 9)
      curDateTime = curDateTime + minutes + "分";
    else
      curDateTime = curDateTime + minutes + "分";
    return curDateTime;
  },
  // 管理收获地址
  _changeAdress: function (success) {
    var app = this;
    wx.chooseAddress({
      success: function (res) {
        app._saveAddress(res);
        if (success != null) {
          success(res);
        }
      },
      fail: function (res) {
        // errMsg: "chooseAddress:fail cancel"
        // errMsg: "chooseAddress:fail auth deny"
        console.log('修改地址失败');
        console.log(res);
        var errorStr = res.errMsg;
        if (errorStr.search("cancel") != -1) { //用户主动取消
          app.showErrorToastUtils('您取消了操作!');
        } else {
          app._showSettingToast('请开启通讯录权限');
        }
      }
    })
  },
  // 保存收获地址:地址里包含用户姓名，电话，地址信息
  _saveAddress: function (address) {
    //缓存到sd卡里
    wx.setStorageSync('address', address);
    console.log(address);
    console.log('地址里的电话：' + address.telNumber);
  },
  // 拼接地址信息
  _getAddress: function (address) {
    var desc = null;
    if (address) {
      desc = address.provinceName + address.cityName + address.countyName + address.detailInfo;
    }
    return desc;
  },
  // 获取用户所在城市，只能同一个城市的跑腿员才能抢单
  _getCity: function (address) {
    var city = null;
    if (address) {
      city = address.cityName;
    }
    return city;
  },
  // 错误提示
  showErrorToastUtils: function (e) {
    wx.showModal({
      title: '提示！',
      confirmText: '朕知道了',
      showCancel: false,
      content: e,
      success: function (res) {
        if (res.confirm) {
          console.log('用户点击确定')
        }
      }
    })
  },

  // 打开权限设置页提示框
  _showSettingToast: function (e) {
    wx.showModal({
      title: '提示！',
      confirmText: '去设置',
      showCancel: false,
      content: e,
      success: function (res) {
        if (res.confirm) {
          wx.navigateTo({
            url: '../setting/setting',
          })
        }
      }
    })
  },
})