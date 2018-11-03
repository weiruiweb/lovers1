import {Api} from '../../utils/api.js';
var api = new Api();
const app = getApp();
import {Token} from '../../utils/token.js';
const token = new Token();

Page({
  data: {
    background: ['/images/product.png', '/images/product.png', '/images/product.png', '/images/product.png', '/images/product.png'],
    indicatorDots: false,
    vertical: false,
    autoplay: true,
    circular: true,
    interval: 2000,
    duration: 500,
    previousMargin: 0,
    nextMargin: 0,
    currentId:0,
    swiperIndex:0,
    is_choose:0,
    is_choose1:0,
  },
  choose_color(e){
    const self = this;
    self.setData({
      is_choose:e.currentTarget.dataset.id
    })
  },
  choose_color1(e){
    const self = this;
    self.setData({
      is_choose1:e.currentTarget.dataset.id
    })
  },
  swiperChange(e) {
    const that = this;
    that.setData({
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

  