// miniprogram/pages/my/my.js
var app = getApp()
const db = wx.cloud.database()
const _ = db.command
var util = require('../../utils/util.js');
var api = require('../../utils/api.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log("myapp.globalData",app.globalData)
    this.setData({
      userInfo: app.globalData.userInfo,
      openId: app.globalData.openId,
      hasUserinfo:app.globalData.hasUserinfo,
      StudentID:app.globalData.StudentID,
      Stuinfo:app.globalData.Stuinfo,
      INTEinfo:app.globalData.INTEinfo
    })
    this.getdakainfo()
  },




  bindGetUserInfo (e) {
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserinfo:true
    })
    app.globalData.userInfo = this.data.userInfo
    app.globalData.hasUserinfo = true
    // console.log("my app.globalData",app.globalData)
    wx.cloud.callFunction({ //这里开始调用云函数
      name: 'updateAlluserdata',
      data: { // data是传进云函数的参数，内容是user的所有信息（因为打算其他地方也统一用这个函数所以所有信息都放进去了）
        _openid: app.globalData.openId,
        userInfo: app.globalData.userInfo,
        hasUserinfo: app.globalData.hasUserinfo,
        // Stuinfo:app.globalData.Stuinfo,
        // INTEinfo:app.globalData.INTEinfo
      },
      complete: res => {
        console.log('Update success',res)
      }
    })
  },

  //获取打卡记录
  getdakainfo:function(){
    api.getdakainfo(app.globalData.StudentID).then(data => {
      if (data) {
     //返回结果的处理逻辑
           console.log(data)
           this.setData({
             dakajilu:data.signinfos
           })
      }
    })  
  },


  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var app = getApp()
    this.setData({
      userInfo: app.globalData.userInfo,
      openId: app.globalData.openId,
      hasUserinfo:app.globalData.hasUserinfo,
      StudentID:app.globalData.StudentID,
      Stuinfo:app.globalData.Stuinfo,
      INTEinfo:app.globalData.INTEinfo
    })
    // 刷新页面
    this.getdakainfo()
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})