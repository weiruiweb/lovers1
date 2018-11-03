import {Api} from '../../utils/api.js';
var api = new Api();
const app = getApp();
import {Token} from '../../utils/token.js';
const token = new Token();

Page({
  data: {
   is_hidden:true,
   mood:0,
   is_scroll:false,
   record:false,
   record1:false,
   record2:false,
  },
  onLoad(options){
    
  },
  // onPageScroll(e){
  //   const self = this
  //       self.setData({
  //           scrollTop: e.scrollTop
  //       })
  //     let query = wx.createSelectorQuery()
  //     query.select('#record1').boundingClientRect( (rect) => {
  //         let top = rect.top
  //         if (top >= 60) { 
  //             self.setData({
  //                 is_scroll:true,
  //             })
  //         } else {
  //             self.setData({
  //                 is_scroll:false,
  //             })
  //         }
  //     }).exec()
  // },
  upper(e){
    const self = this;
    self.setData({
      record:false,
      record1:false,
      record2:false,
    })
  },
  lower(e){
    const self = this;
    self.setData({
      record:true,
      record1:false,
      record2:false,
    })
  },

  scroll(e){
    const self = this;
    if(e.detail.scrollTop>70){
       self.setData({
        record1:true,
        record:false,
       })
     }else if(e.detail.scrollTop>90){
        self.setData({
          record1:false,
          record:true,
         })
     }
     console.log(e.detail.scrollTop)
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

  