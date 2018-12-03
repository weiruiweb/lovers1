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
   web_scrollTop:0,
  },
  onLoad(options){
    const self = this;
    self.getBindData();
  },

  getBindData(){
    const self = this;
    const postData = {
      token:wx.getStorageSync('token'), 
      searchItem:{
      user_no:wx.getStorageSync('info').user_no
      }
    };
    postData.getAfter = {
      bind:{
        tableName:'user',
        middleKey:'passage1',
        key:'passage1',
        searchItem:{
          user_type:0,
          user_no:['NOT IN',[wx.getStorageSync('info').user_no]],
        },
        condition:'='
      }
    };      
    console.log('postData',postData)
    const callback = (res)=>{
      if(res.info.data.length>0){
        self.data.bindData = res.info.data[0]
      };
      self.setData({
        web_bindData:self.data.bindData
      });
      self.countDays()
    }
    api.userGet(postData,callback)
  },



  countDays(){
    const self = this;
    console.log(parseInt(Date.parse(new Date()))/1000);

    console.log(parseInt(self.data.bindData.bind_time));
    var totalSecond = parseInt(Date.parse(new Date())/1000)- parseInt(self.data.bindData.bind_time);
      console.log(totalSecond)
      var day = Math.floor(totalSecond/(24*3600));
      day=parseInt(day)
      console.log(day)
      self.setData({
        web_date:parseInt(self.data.bindData.bind_time),
        web_day:day,
      });

  },

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
      record3:true,
      record1:false,
    })
  },

  scroll(e){
    const self = this;
    self.setData({
      web_scrollTop:e.detail.scrollTop
    });
    /*if(!self.data.settimeClock){
      console.log('scroll')
      self.data.settimeClock = setTimeout(function(){
        self.setData({
          web_scrollTop:e.detail.scrollTop
        });
        self.data.settimeClock='';
      },1000);
    };*/
     console.log(e.detail.scrollTop);
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

  