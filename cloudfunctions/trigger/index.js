// 云函数入口文件
const cloud = require('wx-server-sdk')
// const api=require('../../miniprogram/utils/api.js')


// 初始化 cloud
cloud.init({
  // API 调用都保持和云函数当前所在环境一致
  env: 'kws-8v5m3',
})
const db = cloud.database()
const _ = db.command


// 云函数入口函数
exports.main = async (event, context) => {
    try {
    // console.log(event)
    return await db.collection('user')
    // .where({
    //   hassigntoday: true
    // })

    .where({
      hassigntoday: true
    })
    .update({
      data: { //更新user的所有信息
        hassigntoday:false
      }
    })

  } catch(e) {
    console.error(e)
  }
}