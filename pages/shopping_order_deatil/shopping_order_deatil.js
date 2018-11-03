import {Api} from '../../utils/api.js';
var api = new Api();
const app = getApp();
import {Token} from '../../utils/token.js';
const token = new Token();

Page({
  data: {
    // background: ['/images/product.png', '/images/product.png', '/images/product.png', '/images/product.png', '/images/product.png'],
    // indicatorDots: false,
    // vertical: false,
    // autoplay: true,
    // circular: true,
    // interval: 2000,
    // duration: 500,
    // previousMargin: 0,
    // nextMargin: 0,
    // currentId:0,
    // swiperIndex:0,
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
  },
  // swiperChange(e) {
  //   const that = this;
  //   that.setData({
  //     swiperIndex: e.detail.current,
  //   })
  // },
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

  