import {Api} from '../../utils/api.js';
var api = new Api();
const app = getApp();


Page({
  data: {
    is_show:false,
    is_show2:false,
    is_show3:false,
    percent:0,
    rotate:0,
    mainData:[]
  },
  
  onLoad(options) {
    const self = this;
    self.data.paginate = api.cloneForm(getApp().globalData.paginate);
    self.getBindData();
    var num = 0;
    var t = setInterval(function(){
    num++;
    var rotateNum = num * 4.4;
    var style= '-webkit-transform:rotate('+rotateNum+'deg);transform:rotate('+rotateNum+'deg);';
    self.setData({
        percent:num,
        rotate:style,
     })
    
    if(num==77){
        clearInterval(t);
      }      
    },60);
  },

  onShow(){
    const self = this;
    self.getMainData(true);
  },

  getMainData(isNew){
    const self = this;
    if(isNew){
      api.clearPageIndex(self)
    };
    
    const postData = {};
    postData.paginate = api.cloneForm(self.data.paginate);
    postData.token = wx.getStorageSync('token');
    postData.searchItem = {
      type:1,
      thirdapp_id:getApp().globalData.thirdapp_id,
      class:6,
      user_no:wx.getStorageSync('info').user_no
    };
   
    const callback = (res)=>{
      if(res.info.data.length>0){
        self.data.mainData.push.apply(self.data.mainData,res.info.data);
      }
      wx.hideLoading();
      console.log(77-self.data.mainData.length)
      self.setData({
        web_countData:77-self.data.mainData.length,
      });  
    };
    api.messageGet(postData,callback);
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
 
    const callback = (res)=>{
      if(res.info.data.length>0){
        self.data.bindData = res.info.data[0]
      };
      self.setData({
        web_bindData:self.data.bindData
      });
    }
    api.userGet(postData,callback)
  },


  add(e){
    const self = this;
    var is_show = !this.data.is_show
    this.setData({
      is_show:is_show
    })
    console.log(is_show);
  },
  dialog2(e){
    const self = this;
    var is_show2 = !this.data.is_show2
    this.setData({
      is_show2:is_show2
    })
  },
  dialog3(e){
    const self = this;
    var is_show3 = !this.data.is_show3
    this.setData({
      is_show3:is_show3
    })
  },
  close(e){
     const self = this;
    var is_show = !this.data.is_show
    this.setData({
      is_show:false,
      is_show2:false,
      is_show3:false,
    })
  },
  showToast(){
    const self = this;
    api.showToast('已经没有原谅机会了','none')
  },
  intoPath(e){
    const self = this;
    api.pathTo(api.getDataSet(e,'path'),'nav');
  },
  intoPathRedirect(e){
    const self = this;
    api.pathTo(api.getDataSet(e,'path'),'redi');
  }, 
})

  