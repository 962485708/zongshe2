// miniprogram/pages/msg/msg.js
var api = require('../../utils/api.js');
var util = require('../../utils/util.js');
//腾讯地图API
const key = 'IEFBZ-STK33-PCG3P-YMMBJ-2BA4K-3MFOP'; //使用在腾讯位置服务申请的key
const referer = 'wxc783f13a7c2ffb7b'; //调用插件的app的名称
const category = '生活服务,娱乐休闲';
const chooseLocation = requirePlugin('chooseLocation');
var app = getApp()
const db = wx.cloud.database()
const _ = db.command
Page({

  /**
   * 页面的初始数据
   */
  data: {
    picker: ['男', '女'],
    StartTime: '2020-01-01',
    EndTime: '2022-12-25',
    index: null,
    imgList: [
      'cloud://kws-8v5m3.6b77-kws-8v5m3-1301944770/住宿协议/QQ图片20200701202025.png'
    ],
    location: JSON.stringify({
      latitude: 39.89631551,
      longitude: 116.323459711
    }),
    ComAddressobj:{}
  },

   //选择性别
   PickerChange(e) {
    console.log(e);
    this.setData({
      index: e.detail.value,
    })
    this.setData({
      Sex:this.data.picker[this.data.index]
    })
  },
  
  //选择开始时间
  StartDateChange(e) {
    this.setData({
      StartTime: e.detail.value
    })
  },

  //选择结束时间
  EndDateChange(e) {
    this.setData({
      EndTime: e.detail.value
    })
  },

  getLocation(){
    wx.getLocation({      
      type: 'wgs84',      
      success:  (res) =>{        
        // console.log(res);   
        var location1= JSON.stringify({
          latitude: res.latitude,
          longitude: res.longitude   
        })
        // console.log(location1)  
        this.setData({
          location: location1
        })
      }    
    })
  },

  //跳转到地图页面
  toGetLocationPg(){
    var location1= JSON.stringify({
      latitude: app.globalData.ComAddressobj.latitude,
      longitude: app.globalData.ComAddressobj.longitude  
    }
    )
    wx.navigateTo({
      url: 'plugin://chooseLocation/index?key=' + key + '&referer=' + referer + '&location=' + location1 + '&category=' + category
    })
  },

  //上传住宿图片
  ViewImage(e) {
    wx.previewImage({
      urls: this.data.imgList,
      current: e.currentTarget.dataset.url
    });
  },

  ChooseImage() {
    wx.chooseImage({
      count: 4, //默认9
      sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album'], //从相册选择
      success: (res) => {
        if (this.data.imgList.length != 0) {
          this.setData({
            imgList: this.data.imgList.concat(res.tempFilePaths)
          })
        } else {
          this.setData({
            imgList: res.tempFilePaths
          })
        }
      }
    });
  },

  ViewImage(e) {
    wx.previewImage({
      urls: this.data.imgList,
      current: e.currentTarget.dataset.url
    });
  },
  DelImg(e) {
    wx.showModal({
      title: '删除',
      content: '确定删除这张照片吗？',
      cancelText: '取消',
      confirmText: '确定删除',
      success: res => {
        if (res.confirm) {
          this.data.imgList.splice(e.currentTarget.dataset.index, 1);
          this.setData({
            imgList: this.data.imgList
          })
        }
      }
    })
  },

  formSubmit(e){
    console.log('form发生了submit事件，携带数据为：', e.detail.value)
    this.setData({
      allValue: e.detail.value
    })
    var getdata = e.detail.value
    var INTEinfo={
      "accAddress":getdata.AccAddress,
      "accStatus":getdata.AccStatus,
      "comAddress":app.globalData.ComAddress,
      "companyName":getdata.CompanyName,
      "endTime":util.formatDate(new Date(getdata.EndTime)),
      "interStatus":getdata.IntStatus,
      "name":getdata.StuName,
      "phoneNumber":getdata.Number,
      "regStatus":"已登记",
      "startTime":util.formatDate(new Date(getdata.StartTime)),
      "studentID":getdata.StudentID
    }
    var Stuinfo={
      "academy":getdata.PersonAcademy,
      "grade":getdata.Grade,
      "name":getdata.StuName,
      "number":getdata.Number,
      "password":"123456",
      "phoneNumber":getdata.Number,
      "sex":getdata.Sex,
      "studentID":getdata.StudentID
    }
    app.globalData.INTEinfo=INTEinfo
    app.globalData.Stuinfo=Stuinfo
    app.globalData.getdata=getdata
    this.savechange()
    this.changeStuinfo()
    this.changeINTEinfo()
    console.log("ComAddress",this.data.ComAddress)
  },

  savechange:function(){
    wx.cloud.callFunction({ //这里开始调用云函数
      name: 'updateusermsg',
      data: { // data是传进云函数的参数，内容是user的所有信息（因为打算其他地方也统一用这个函数所以所有信息都放进去了）
        _openid: app.globalData.openId,
        Stuinfo:app.globalData.Stuinfo,
        INTEinfo:app.globalData.INTEinfo,
        ComAddressobj:app.globalData.ComAddressobj
      },
      complete: res => {
       console.log('Update success',res)
     }
    })
    
  },



  getlastmsg(){
    console.log(app.globalData)
    var StartTime=util.formatDate(new Date(app.globalData.StartTime))
    var EndTime=util.formatDate(new Date(app.globalData.EndTime))

    this.setData({
      userInfo: app.globalData.userInfo,
      StudentID:app.globalData.StudentID,
      Stuinfo:app.globalData.Stuinfo,
      INTEinfo:app.globalData.INTEinfo,
      studentID:app.globalData.StudentID,
      Grade:app.globalData.Grade,
      PersonAcademy:app.globalData.PersonAcademy,
      StuName:app.globalData.StuName,
      Sex:app.globalData.Sex,
      Number:app.globalData.Number,
      CompanyName:app.globalData.CompanyName,
      ComAddress:app.globalData.ComAddress,
      IntStatus:app.globalData.IntStatus,
      StartTime:StartTime,
      EndTime:EndTime,
      AccStatus:app.globalData.AccStatus,
      AccAddress :app.globalData.AccAddress,   
      ComAddressobj: app.globalData.ComAddressobj
    })
  },



  //提交修改学生信息
  changeStuinfo:function(){
    
    var param={
      "academy":app.globalData.getdata.PersonAcademy,
      "grade":app.globalData.getdata.Grade,
      "name":app.globalData.getdata.StuName,
      "number":app.globalData.getdata.Number,
      "password":"123456",
      "phoneNumber":app.globalData.getdata.Number,
      "sex":app.globalData.getdata.Sex,
      "studentID":app.globalData.getdata.StudentID
    }
    console.log(param)
    api.changeStuinfo(app.globalData.StudentID,param).then(data => {
      if (data) {
     //返回结果的处理逻辑
           console.log(data)
      }
    })  

    // setTimeout(function(){
    //   wx.showToast({
    //     title: '提交成功',
    //     icon: 'success',
    //     duration: 2000
    //   })
    // },1000)
  },

  //提交修改实习信息
  changeINTEinfo:function(){
    var param={
      "accAddress":app.globalData.getdata.AccAddress,
      "accStatus":app.globalData.getdata.AccStatus,
      "comAddress":app.globalData.getdata.ComAddress,
      "companyName":app.globalData.getdata.CompanyName,
      "endTime":new Date(app.globalData.getdata.EndTime),
      "interStatus":app.globalData.getdata.IntStatus,
      "name":app.globalData.getdata.StuName,
      "regStatus":"已登记",
      "startTime":new Date(app.globalData.getdata.StartTime),
      "studentID":app.globalData.getdata.StudentID,   
      "phoneNumber":app.globalData.Number         
    }
    console.log(param)
    api.changeINTEinfo(app.globalData.StudentID,param).then(data => {
      if (data) {
       //返回结果的处理逻辑
             console.log(data)
      }
    })
    
    api.postComadsress(app.globalData.StudentID,app.globalData.ComAddressobj).then(data=>{
      if (data) {
        //返回结果的处理逻辑
              console.log(data)
       }
    })
  
  
    setTimeout(function(){
      wx.showToast({
        title: '提交成功',
        icon: 'success',
        duration: 2000
      })
    },200)
  },


  //地图选点
  chooselocation(){
    const location = chooseLocation.getLocation(); // 如果点击确认选点按钮，则返回选点结果对象，否则返回null
    console.log("location",location)

    if(location!=null){
        var location1= JSON.stringify({
        latitude: location.latitude,
        longitude: location.longitude   
        })
        var location2= {
          latitude: location.latitude,
          longitude: location.longitude   
        }
      this.setData({
        ComAddressobj:location,
        location:location1,
        ComAddress:location.name
      })
      console.log("ComAddressobj",this.data.ComAddressobj)
      //保存经纬度
      app.globalData.ComAddressobj=location
      app.globalData.ComAddress=location.name
      console.log("app.globalData.ComAddressobj",app.globalData.ComAddressobj)
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // this.getopenId()
    this.getlastmsg()
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
    this.chooselocation()
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
