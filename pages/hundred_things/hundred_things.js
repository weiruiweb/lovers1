import {Api} from '../../utils/api.js';
var api = new Api();
const app = getApp();
import {Token} from '../../utils/token.js';
const token = new Token();

Page({
  data: {
   currentId:0,
   currentId1:0,
  },
  onLoad(options){
    
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

  