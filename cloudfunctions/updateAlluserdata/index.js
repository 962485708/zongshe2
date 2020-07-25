// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init({
  // API 调用都保持和云函数当前所在环境一致
  env: 'kws-8v5m3',
})
const db = cloud.database()
const _ = db.command
exports.main = async (event) => { //event就是外面的data
  try {
    // console.log(event)
    return await db.collection('user').where({
      _openid: event._openid //根据openid找到该用户的记录
    })
    .update({
      data: { //更新user的所有信息
        userInfo: event.userInfo,
        hasUserinfo: event.hasUserinfo,
        Stuinfo: event.Stuinfo,
        INTEinfo: event.INTEinfo,
        ComAddressobj:event.ComAddressobj
      }
    })
  } catch(e) {
    console.error(e)
  }
  return event
}