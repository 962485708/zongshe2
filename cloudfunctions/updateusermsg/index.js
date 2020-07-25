// 云函数入口文件
const cloud = require('wx-server-sdk')

// 初始化 cloud
cloud.init({
  // API 调用都保持和云函数当前所在环境一致
  env: 'kws-8v5m3',
})
// 云函数入口函数
const db = cloud.database()
const _ = db.command


// 云函数入口函数
exports.main = async (event, context) => {
    try {
    // console.log(event)
    return await db.collection('user')
    .where({
      _openid: event._openid //根据openid找到该用户的记录
    })
    .update({
      data: { //更新user的所有信息
        Stuinfo: event.Stuinfo,
        INTEinfo: event.INTEinfo,
        ComAddressobj:event.ComAddressobj
      }
    })
  } catch(e) {
    console.error(e)
  }
}