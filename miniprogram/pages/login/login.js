// miniprogram/pages/login/login.js
var util = require('../../utils/util.js');
var api = require('../../utils/api.js');
var app = getApp()
const db = wx.cloud.database()
const _ = db.command

Page({

  /**
   * 页面的初始数据
   */
  data: {
    errortext:''
  },

  changepagemy: function(){
    console.log("跳转前globaldata",app.globalData)
    wx.switchTab({
      url: "../my/my"
    })
  },

  changepagedaka: function(){
    console.log("跳转前globaldata",app.globalData)
    wx.switchTab({
      url: "../daka/daka"
    })
  },



  formSubmit(e){
    // console.log(e)
    var code={
      StudentID:e.detail.value.username,
      password:e.detail.value.password,
    }
    // console.log(code)
    api.stuLogin(code).then(data => {
      if (data) {
     //返回结果的处理逻辑
          //  console.log(data)
           if(data=='ERROR'){
             console.log('账号或密码错误')
             this.setData({
               errortext:'账号或密码错误'
             })
           }

           else{
            //  console.log('登录成功')
             app.globalData.StudentID=code.StudentID
             this.getnormalmsg()
           }
      }
    })  
  
    // this.changepage()
  },

  //获取信息函数
  getnormalmsg(){
    var id=app.globalData.StudentID
    api.getusers(id).then(data => {
      if (data) {
     //返回结果的处理逻辑
           console.log("获得学生信息",data)
           if(data=='ERROR'){
             console.log('无信息')
           }

           else{
            //  console.log('返回成功')

             app.globalData.Stuinfo=data
            //  console.log(app.globalData.Stuinfo)
             app.globalData.StudentID=data.studentID
             app.globalData.Grade=data.grade
             app.globalData.PersonAcademy=data.academy
             app.globalData.StuName=data.name
             app.globalData.Sex=data.sex
             app.globalData.Number=data.phoneNumber
           }
      }
      api.getuserINTE(id).then(data => {
        if (data) {
       //返回结果的处理逻辑
             console.log("实习信息",data)
             if(data=='ERROR'){
               console.log('无信息')
             }
             else{
              //  console.log('返回成功')
               app.globalData.INTEinfo=data
              //  console.log(app.globalData.INTEinfo)
               app.globalData.CompanyName=data.companyName
               app.globalData.ComAddress=data.comAddress
               app.globalData.IntStatus=data.interStatus
               app.globalData.StartTime=data.startTime
               app.globalData.EndTime=data.endTime
               app.globalData.AccStatus=data.accStatus
               app.globalData.AccAddress=data.accAddress
             }
        }

        api.getComadsress(id).then(data => {
          if (data) {
         //返回结果的处理逻辑
               if(data=='ERROR'){
                 console.log('无信息')
               }
               else{
                //  console.log('返回成功')
                console.log("公司地址",data)
                 app.globalData.ComAddressobj=data
                 console.log("app.globalData取得所有信息",app.globalData)
               }
          }
          this.getopenId2()
      })
    })  





    })
    // this.getopenId()  
  },



  changeinput:function () {
    this.setData({
      errortext:''
    })
  },




  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getopenId()
  },


  getopenId2:function(){
    wx.cloud.callFunction({ //这里开始调用云函数
      name: 'updateAlluserdata',
      data: { // data是传进云函数的参数，内容是user的所有信息（因为打算其他地方也统一用这个函数所以所有信息都放进去了）
        _openid: app.globalData.openId,
        userInfo: app.globalData.userInfo,
        hasUserinfo: app.globalData.hasUserinfo,
        Stuinfo:app.globalData.Stuinfo,
        INTEinfo:app.globalData.INTEinfo,
        ComAddressobj:app.globalData.ComAddressobj
      },
      complete: res => {
      //  console.log('Update success',res)
      this.changepagemy()
     }
    }) 
          // console.log('User exist')                      
        // console.log(app.globalData)  
  },

  getopenId:function(){
    var that = this
    wx.cloud.callFunction({
      name: 'login',
      complete: res => {
        // console.log('callFunction login result: ', res)
        app.globalData.openId = res.result.openId
        // console.log(app.globalData)
        db.collection('user').where({
          _openid: app.globalData.openId // 当前用户 openId
        }).get({
          success: function(res) {
            // console.log('Get user result:', res.data[0])
            if (res.data.length == 0){ // 如果数据库中没有该用户，则添加该用户
              // that.getnormalmsg()
              console.log('user not exist, register now.')              
                db.collection('user').add({ 
                  data: { //将globalData中的初始化数据传上去（openid会自动加上去）
                    userInfo: app.globalData.userInfo,
                    hasUserinfo: app.globalData.hasUserinfo,
                    Stuinfo:app.globalData.Stuinfo,
                    INTEinfo:app.globalData.INTEinfo,
                    hassigntoday:app.globalData.hasUserinfo,
                    ComAddressobj:app.globalData.ComAddressobj
                  },
                  success: function(res) {
                    // console.log('add result: ', res)
                  },
                  fail: console.error,
                })              
            }
            // 如果数据库里有该用户的话，拉取信息到本地
            else{
              console.log('User exist')
              that.setData({ //拉取信息到本页面
                userInfo: res.data[0].userInfo,
                hasUserinfo: res.data[0].hasUserinfo,
                StudentID:res.data[0].StudentID,
                Stuinfo:res.data[0].Stuinfo,
                INTEinfo:res.data[0].INTEinfo,
                ComAddressobj:res.data[0].ComAddressobj,
                alreadyhasinfo:true
              })
              // 拉取信息到globalData方便其它页面使用
              app.globalData.hassigntoday=res.data[0].hassigntoday
              app.globalData.userInfo = res.data[0].userInfo
              app.globalData.hasUserinfo = res.data[0].hasUserinfo
              app.globalData.Stuinfo=res.data[0].Stuinfo
              app.globalData.INTEinfo=res.data[0].INTEinfo  
              app.globalData.ComAddressobj=res.data[0].ComAddressobj

              app.globalData.StudentID=res.data[0].Stuinfo.studentID
              app.globalData.Grade=res.data[0].Stuinfo.grade
              app.globalData.PersonAcademy=res.data[0].Stuinfo.academy
              app.globalData.StuName=res.data[0].Stuinfo.name
              app.globalData.Sex=res.data[0].Stuinfo.sex
              app.globalData.Number=res.data[0].Stuinfo.phoneNumber
  
              app.globalData.CompanyName=res.data[0].INTEinfo.companyName
              app.globalData.ComAddress=res.data[0].INTEinfo.comAddress
              app.globalData.IntStatus=res.data[0].INTEinfo.interStatus
              app.globalData.StartTime=res.data[0].INTEinfo.startTime
              app.globalData.EndTime=res.data[0].INTEinfo.endTime
              app.globalData.AccStatus=res.data[0].INTEinfo.accStatus
              app.globalData.AccAddress=res.data[0].INTEinfo.accAddress
              
              if(that.data.alreadyhasinfo){
                that.changepagedaka()
              }          
            }
            // console.log(app.globalData)
          },
          fail: console.error
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

  },


})