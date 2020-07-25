import {
  http
} from './http'

var util = require('./util.js');

var url = {
  stuLogin: "/loginStu",
  getusers:"/user",
  getuserINTE:"/userINTE",
  getdakainfo:"/usersSigninfo",
  postdakainfo:"/addSIGN",
  changeStuinfo:"/userUpdate",
  changeINTEinfo:"/inteUpdate",
  getComadsress:"/comaddress",
  postComadsress:"/upcomaddress"
}

module.exports = {
  
  //学生登录
  stuLogin: function(param) {
    return http({
      url: url.stuLogin,
      data: 
        util.json2Form(param) ,
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method:"POST"
    })
  },
  
  //获取学生信息
  getusers:function (id) {
    return http({
      url: url.getusers+'/'+id,
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method:"GET"
    })
   },

   //获取实习信息
   getuserINTE:function (id) {
    return http({
      url: url.getuserINTE+'/'+id,
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method:"GET"
    })
   },




  //  //临时获取打卡记录
  //  getdakainfo:function(){
  //   return http({
  //     url: url.getdakainfo,
  //     header: {
  //       "Content-Type": "application/x-www-form-urlencoded"
  //     },
  //     method:"GET"
  //   })
  //  },

   //获取打卡记录
   getdakainfo:function(id){
    return http({
      url: url.getdakainfo+'/'+id,
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method:"GET"
    })
   },

   //获取公司地址信息
   getComadsress:function (id) {
        return http({
          url: url.getComadsress+'/'+id,
          header: {
            "Content-Type": "application/x-www-form-urlencoded"
          },
          method:"GET"
        })
       },

  //修改公司地址信息
  postComadsress(id,param){
    return http({
      url: url.postComadsress+'/'+id,
      data: param ,
      header: {
        "Content-Type": "application/json"
      },
      method:"PUT"
    })
   },

   //打卡
   postdakainfo:function(param){
    return http({
      url: url.postdakainfo,
      data: param,
      header: {
        "Content-Type": "application/json"
      },
      method:"POST"
    })
   },

   //修改学生信息
   changeStuinfo(id,param){
    return http({
      url: url.changeStuinfo+'/'+id,
      data: param ,
      header: {
        "Content-Type": "application/json"
      },
      method:"PUT"
    })
   },

   //修改实习信息
   changeINTEinfo(id,param){
    return http({
      url: url.changeINTEinfo+'/'+id,
      data: param ,
      header: {
        "Content-Type": "application/json"
      },
      method:"PUT"
    })
   }


}


// 1.签到功能
// 2.获取学生信息
// 3.填报/修改信息
// 4.获取学生打卡记录