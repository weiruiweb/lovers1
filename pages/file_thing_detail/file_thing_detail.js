import {Api} from '../../utils/api.js';
var api = new Api();
const app = getApp();
import {Token} from '../../utils/token.js';
const token = new Token();

Page({
  
  data: {
   is_hidden:true,
   mood:0,
   is_show:false,
   indicatorDots: false,
    vertical: false,
    autoplay: false,
    circular: true,
    interval: 2000,
    duration: 500,
    previousMargin: 0,
    nextMargin: 0,
    currentId:0,
    swiperIndex:0,
  },

  onLoad(options){
    const self = this;
    self.data.id = options.id;
    self.getMainData()
  },
  getMainData(){
    const self = this;
    const postData = {};

    postData.token = wx.getStorageSync('token');
    postData.searchItem = {
      thirdapp_id:getApp().globalData.thirdapp_id,
      id:self.data.id
    };
    
    const callback = (res)=>{
      if(res.info.data.length>0){
        self.data.mainData = res.info.data[0]
      }else{
        api.showToast('数据错误','fail');
      };
      wx.hideLoading();
      self.setData({
        web_mainData:self.data.mainData,
      });  
    };
    api.messageGet(postData,callback);
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
   scale(){
    const self = this;
    self.setData({
      is_show:true
    })
  },
  close(){
    const self = this;
    self.setData({
      is_show:false
    })
  },
 mood(e){
   this.setData({
      mood:e.currentTarget.dataset.id
    })
  },
  swiperChange(e) {
    const self = this;
    self.setData({
      swiperIndex: e.detail.current,
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

  