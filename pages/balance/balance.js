import {Api} from '../../utils/api.js';
var api = new Api();
const app = getApp();
import {Token} from '../../utils/token.js';
const token = new Token();

Page({
  data: {
   is_show:false,
   mood:0,
  },
  onLoad(options){
    
  },
  banlance_create:function(e) {
    const self = this;
     self.setData({
      is_show:true
     })
     setTimeout(function(){
      wx.switchTab({
        url:'/pages/balance_create_end/balance_create_end'
      },5000)
    })
  },
  intoPath(e){
    const self = this;
    api.pathTo(api.getDataSet(e,'path'),'nav');
  },

  intoPathRedi(e){
    const self = this;
    wx.navigateBack({
      delta:1
    })
  },
  intoPathRedirect(e){
    const self = this;
    api.pathTo(api.getDataSet(e,'path'),'redi');
  }, 
  
})

  