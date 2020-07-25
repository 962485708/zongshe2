// miniprogram/pages/daka/daka.js
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
    StuName:'',
    StudentID:'',
    address:'',
    cansign:false,
    hassigntoday:false
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
            // 如果数据库里有该用户的话，拉取信息到本地
              // console.log('User exist')
              that.setData({ //拉取信息到本页面
                StuName:res.data[0].Stuinfo.name,
                userInfo: res.data[0].userInfo,
                hasUserinfo: res.data[0].hasUserinfo,
                StudentID:res.data[0].Stuinfo.studentID,
                Stuinfo:res.data[0].Stuinfo,
                INTEinfo:res.data[0].INTEinfo,
              })
              // 拉取信息到globalData方便其它页面使用
              app.globalData.userInfo = res.data[0].userInfo
              app.globalData.hasUserinfo = res.data[0].hasUserinfo
              app.globalData.StudentID=res.data[0].StudentID
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
                       
            // console.log(app.globalData)
          },
          fail: console.error
        })
      }
    })
  },
  
  getlastmsg(){
    // console.log(app.globalData)
    this.setData({
      StudentID:app.globalData.StudentID,
      StuName:app.globalData.StuName, 
      ComAddressobj:app.globalData.ComAddressobj
    })

    // var str = app.globalData.INTEinfo.comAddress;
    // str = str.replace(/\ufeff/g,"");

    // var arrJosn = JSON.stringify(app.globalData.INTEinfo.comAddress);
    // var arrJosn1=JSON.parse(str)
    // console.log("对象",arrJosn1)
    // console.log("对象address",arrJosn1['address'])
  },


  //计算两点距离
  getdistance(){
    // console.log('距离之前',app.globalData.now_addressao)
    wx.request({
      url: 'https://apis.map.qq.com/ws/distance/v1/?parameters',
      data: {
        "key": "IEFBZ-STK33-PCG3P-YMMBJ-2BA4K-3MFOP",
        "from": app.globalData.ComAddressobj.latitude+','+app.globalData.ComAddressobj.longitude,
        "to":app.globalData.now_addressao.latitude+','+app.globalData.now_addressao.longitude,
      },
      method: 'GET',
      success:  (r)=> {
        //输出一下位置信息
        console.log('距离信息',r,r.data.result.elements[0].distance);
        if(r.data.result.elements[0].distance<5000)
        this.setData({
          cansign:false
        })
        else{
          this.setData({
            cansign:true
          })
        }
      }
    });
  },

  getLocation(){
  wx.getLocation({ //没有特别说明的都是固定写法
    type: 'wgs84',
    success:  (res)=> {
      // console.log('location', res);
      var locationString = res.latitude + "," + res.longitude;
      var location1= {
        latitude: res.latitude,
        longitude: res.longitude   
      }
      app.globalData.now_addressao=location1
      // console.log('app.globalData.ComAddressobj',app.globalData.ComAddressobj)
      // console.log('app.globalData.now_addressao',app.globalData.now_addressao)
      wx.request({
        url: 'http://apis.map.qq.com/ws/geocoder/v1/',
        data: {
          "key": "IEFBZ-STK33-PCG3P-YMMBJ-2BA4K-3MFOP",
          "location": locationString
        },
        method: 'GET',
        success:  (r)=> {
          //输出一下位置信息
          // console.log('用户位置信息',r.data.result.address);
          this.setData({
            address:r.data.result.address
          })
          //r.data.result.address获得的就是用户的位置信息，将它保存到一个全局变量上
          getApp().globalData.now_address = r.data.result.address;
          this.getdistance()
          //这步是将位置信息保存到本地缓存中，key = value的形式
          try {
            wx.setStorageSync('now_address', r.data.result.address)
          } catch (e) {
            console.log(e)
          }
        }
      });
    }
  });
  
  },


  getdate:function(){
    var DATE=util.formatTime(new Date());
    this.setData({
      Date:DATE
    });
  },

  //打卡函数  //点击签到按钮
  formSubmit(e){
    console.log(e.detail.value)
    var param={
      "date":new Date(e.detail.value.Date),
      "signStatus":true,
      "studentID":e.detail.value.StudentID,
      
      // "date": "2020-06-29T14:38:49.787Z",
      // "signStatus": true,
      // "studentID": "string"
    }
    // console.log(param)

    api.postdakainfo(param).then(data => {
      if (data) {
     //返回结果的处理逻辑
           var that=this
          //  console.log(data)
           setTimeout(function(){
            wx.showToast({
              title: '签到成功',
              icon: 'success',
              duration: 1500
            })
            that.setData({
              hassigntoday:true
            })
            app.globalData.hassigntoday=true

            wx.cloud.callFunction({
              name:'getsigncondition',
              data:{
                _openid:app.globalData.openId,
                hassigntoday:true
              },
              complete: res => {
                // console.log('hassigntoday Update success',res)
              }
            })

          },500)
      }
    })  



    // console.log(new Date())
    // var param={
    //   "date": new Date(),
    //   "signStatus": false,
    //   "studentID": app.globalData.StudentID
    // }


  },
 
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log("赋值前golbaldata",app.globalData)
      this.getlastmsg()
      //  获取当前时间
      // console.log("dakabefore",app.globalData)
      this.getdate()
      this.getLocation()
      // this.getopenId()
      // this.getdistance()
      this.setData({
        hassigntoday:app.globalData.hassigntoday
      })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    // this.getLocation()
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.getlastmsg()
    this.getdate()
    // this.getopenId()
    this.getLocation()
    this.setData({
      hassigntoday:app.globalData.hassigntoday
    })
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