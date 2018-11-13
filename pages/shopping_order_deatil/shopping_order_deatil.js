import {Api} from '../../utils/api.js';
var api = new Api();
const app = getApp();
import {Token} from '../../utils/token.js';
const token = new Token();

Page({
  data: {
    isShow:false,
    slider: [],
    swiperCurrent: 3,
    slider: [
    {
      picUrl: '/images/product.png'
    },
    {
      picUrl: '/images/product.png'
    },
    {
      picUrl: '/images/product.png'
    },
    {
      picUrl: '/images/product.png'
    },
    {
      picUrl: '/images/product.png'
    },
    ],
    indicatorDots: true,
    autoplay: true,
    interval: 2000,
    duration: 1000,
    circular: true,
    beforeColor: "white",//指示点颜色  
    afterColor: "coral",//当前选中的指示点颜色 
    is_choose:0,
    is_choose1:0,
    choose_size:0,
    choose_size1:0,
  },

  onLoad(options){
    const self = this;
    self.data.id = options.id;
    self.getMainData()
  },

  getMainData(){
    const self = this;
    const postData = {};
    postData.searchItem = {
      id:self.data.id
    }
    const callback = (res)=>{
      if(res.info.data.length>0){
        self.data.mainData = res.info.data[0]  
      }
      wx.hideLoading();
      self.setData({
        web_mainData:self.data.mainData,
      });     
    };
    api.productGet(postData,callback);
  },
  
  //轮播图的切换事件 
  swiperChange: function (e) {
    //只要把切换后当前的index传给<swiper>组件的current属性即可 
    this.setData({
      swiperCurrent: e.detail.current
    })
  },

  dotsChange: function (e) {
    //只要把切换后当前的index传给<swiper>组件的current属性即可 
    this.setData({
      dotsCurrent: e.detail.current
    })
  },

  //点击指示点切换 
  chuangEvent: function (e) {
    this.setData({
      swiperCurrent: e.currentTarget.id
    })
  },

  chuangEvents: function (e) {
    this.setData({
      dotsCurrent: e.currentTarget.id
    })
  },
  choose(e){
    this.setData({
      isShow:true
    })
  },
  add_cart(e){
    this.setData({
      isShow:false
    })
  },
  choose_color(e){
    const self = this;
    self.setData({
      is_choose:e.currentTarget.dataset.id
    })
  },

  choose_size(e){
    const self = this;
    self.setData({
      choose_size:e.currentTarget.dataset.id
    })
  },

  choose_size1(e){
    const self = this;
    self.setData({
      choose_size1:e.currentTarget.dataset.id
    })
  },

  choose_color1(e){
    const self = this;
    self.setData({
      is_choose1:e.currentTarget.dataset.id
    })
  },

  intoPath(e){
    const self = this;
    api.pathTo(api.getDataSet(e,'path'),'nav');
  },

  intoPathBack(e){
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

  