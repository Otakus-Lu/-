//新闻相关操作
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

// 云函数入口函数
exports.main = async (event, context) => {
  if (event.action == "shoucang") { //收藏
    const DB = cloud.database()
    const _ = DB.command
    return await DB.collection('news').doc(event._id).update({
      data: {
        shoucang: _.inc(event.num)
      }
    }).then(res => {
      return res
    }).catch(res => {
      return res
    })
  } else if (event.action == "liulan") { //浏览量
    const DB = cloud.database()
    const _ = DB.command
    return await DB.collection('news').doc(event._id).update({
      data: {
        liulan: _.inc(event.num)
      }
    }).then(res => {
      return res
    }).catch(res => {
      return res
    })
  }
  else if (event.action == 'fabiao') {
    return await cloud.database().collection("comment")
      .add({
        data: {
          id: event.id,
          content:event.content,
          zuozhe:event.zuozhe,
          reply:event.reply
        }
      })
      .then(res => {
        console.log("评论成功", res)
        return res
      })
      .catch(res => {
        console.log("评论失败", res)
        return res
      })
  }
  else if (event.action == 'fabu') {
    return await cloud.database().collection("news")
      .add({
        data: {
          _createTime:Date.parse(new Date()),
          _updateTime:Date.parse(new Date()),
          content:event.content,
          img:event.img,
          liulan:0,
          shoucang:0,
          title:event.tittle,
          type:event.type,
          zuozhe:event.author,
        }
      })
      .then(res => {
        console.log("发布成功", res)
        return res
      })
      .catch(res => {
        console.log("发布失败", res)
        return res
      })
  }
  else if (event.action == 'bianji') {
    return await cloud.database().collection("news").doc(event.id)
      .update({
        data: {
          _updateTime:Date.parse(new Date()),
          content:event.content,
          img:event.img,
          title:event.tittle,
          type:event.type,
          zuozhe:event.author,
        }
      })
      .then(res => {
        console.log("发布成功", res)
        return res
      })
      .catch(res => {
        console.log("发布失败", res)
        return res
      })
  }

}