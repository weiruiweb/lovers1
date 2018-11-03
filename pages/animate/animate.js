import {Api} from '../../utils/api.js';
var api = new Api();
const app = getApp();
import {Token} from '../../utils/token.js';
const token = new Token();

Page({
  data: {
   is_hidden:true,
   mood:0,
   percent:0,
   rotate:0,
  },
  onLoad(options){
    var self = this
    var num = 0;
    var t = setInterval(function(){
      num++;
      var rotateNum = num * 3.6;
      var style= '-webkit-transform:rotate('+rotateNum+'deg);transform:rotate('+rotateNum+'deg);';
      self.setData({
          percent:num,
          rotate:style,
       })
      
      if(num==92){
          clearInterval(t);
        }      
      },60);
  },


  hide:function(e) {
     this.setData({
      is_hidden:false
     }) 
  },
  show:function(e) {
     this.setData({
      is_hidden:true
     }) 
  }, 
 mood(e){
   this.setData({
      mood:e.currentTarget.dataset.id
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

  