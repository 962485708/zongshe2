//app.js
import {
  api
} from './utils/api'


App({
  globalData:{
    userInfo: {},
    hasUserinfo:false,
    openId: "",
    StudentID:"",
    Grade:"",
    PersonAcademy:"",
    StuName:"",
    Sex:"",
    Number:"",
    CompanyName:"",
    ComAddress:{},
    //公司地址对象
    ComAddressobj:{},
    IntStatus:"",
    StartTime:"",
    EndTime:"",
    AccStatus:"",
    AccAddress:"",
    now_address:"",
    //现在经纬度
    now_addressao:{},
    sign_time:"",
    SignStatus:"",
    Stuinfo:{},
    INTEinfo:{},
    alreadyhasinfo:false,
    appflag:false,
    hassigntoday:false,
  },
  onLaunch: function () {
    
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        // env 参数说明：
        //   env 参数决定接下来小程序发起的云开发调用（wx.cloud.xxx）会默认请求到哪个云环境的资源
        //   此处请填入环境 ID, 环境 ID 可打开云控制台查看
        //   如不填则使用默认环境（第一个创建的环境）
        env: 'kws-8v5m3',
        traceUser: true,
      })
    }

    //调用API从本地缓存中获取数据
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
    wx.cloud.init({
      env: 'kws-cloud',
      traceUser: true,
    })
    this.getUserInfo()

    // wx.cloud.callFunction({
    //   name:'trigger',
    // })

  },


  getUserInfo:function(cb){
    var that = this
    if(this.globalData.userInfo){
      typeof cb == "function" && cb(this.globalData.userInfo)
    }else{
      //调用登录接口（需要权限）
      wx.login({
        success: function () {
          wx.getUserInfo({
            success: function (res) {
              console.log(res)
              that.globalData.userInfo = res.userInfo
              typeof cb == "function" && cb(that.globalData.userInfo)
            }
          })
        }
      })
    }
  },
})

