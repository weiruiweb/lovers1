//app.js
import { Token } from 'utils/token.js';
import { Api } from 'utils/api.js';
var api = new Api();

App({
  onLaunch: function () {
      // 展示本地存储能力
  var token = new Token();
  token.verify();

},

 globalData: {
    // 是否保持常亮，离开小程序失效
    keepscreenon:false,
    systeminfo: {},
    isIPhoneX: false,
    ak: 'your baidu map application ak',
  },


})
