import {Api} from '../../utils/api.js';
const api = new Api();
const app = getApp();
import {Token} from '../../utils/token.js';
const token = new Token();



Page({
  data: {
    num:0,
    mainData:[],
    searchItem:{
      type:1
    },
  },

  onLoad(options){
    const self = this;
    if(!wx.getStorageSync('token')){
      var token = new Token();
      token.getUserInfo();
    };
    self.data.paginate = api.cloneForm(getApp().globalData.paginate);
    self.getMainData();
  },


  getMainData(isNew){
    const self = this;
    if(isNew){
      api.clearPageIndex(self);  
    };
    const postData = {};
    postData.paginate = api.cloneForm(self.data.paginate);
    postData.token = wx.getStorageSync('token');
    postData.searchItem = api.cloneForm(self.data.searchItem)
    postData.searchItem.thirdapp_id = api.cloneForm(getApp().globalData.thirdapp_id);
    postData.order = {
      create_time:'desc'
    };

    const callback = (res)=>{
      if(res.solely_code==100000){
        if(res.info.data.length>0){
          self.data.mainData.push.apply(self.data.mainData,res.info.data);
        
        }else{
          self.data.isLoadAll = true;
          api.showToast('没有更多了','none');
        };
        wx.hideLoading();
        self.setData({
          web_mainData:self.data.mainData,
        });  
      }else{
        api.showToast('网络故障','none')
      }

    };
    api.orderGet(postData,callback);
  },



  
  onReachBottom() {
    const self = this;
    if(!self.data.isLoadAll){
      self.data.paginate.currentPage++;
      self.getMainData();
    };
  },

  intoPathRedirect(e){
    const self = this;
    api.pathTo(api.getDataSet(e,'path'),'redi');
  }, 

})

  