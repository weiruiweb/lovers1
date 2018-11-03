import {Api} from '../../utils/api.js';
var api = new Api();
const app = getApp();
import {Token} from '../../utils/token.js';
const token = new Token();

Page({
  data: {
   currentId:0,
   currentId1:0,
   files: [],
   percent:0,
   rotate:0,
  },
  onLoad(options){
    const self = this;
    var num = 0;
    var t = setInterval(function(){
      num++;
      var rotateNum = num * 3.6;
      var style= '-webkit-transform:rotate('+rotateNum+'deg);transform:rotate('+rotateNum+'deg);';
      self.setData({
          percent:num,
          rotate:style,
       })
      if(num==100){
        clearInterval(t);
        }      
      },60);
  },
  chooseImage: function (e) {
      var that = this;
      wx.chooseImage({
          sizeType: ['original', 'compressed'],
          sourceType: ['album', 'camera'],
          success: function (res) {
              that.setData({
                  files: that.data.files.concat(res.tempFilePaths)
              });
          }
      })
    },
    previewImage: function(e){
        wx.previewImage({
            current: e.currentTarget.id,
            urls: this.data.files
        })
    },
  tab(e){
   this.setData({
      currentId:e.currentTarget.dataset.id
    })
  },
  tabs(e){
   this.setData({
      currentId1:e.currentTarget.dataset.id
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

  