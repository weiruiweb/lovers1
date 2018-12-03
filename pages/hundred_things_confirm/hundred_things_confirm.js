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
    const self = this;
    self.data.id = options.id;
    self.getMainData()
  },


  getMainData(){
    const self = this;
    const postData = {};
    postData.searchItem = {
      id:self.data.id
    };
    postData.getAfter = {
      message:{
        tableName:'message',
        middleKey:'id',
        key:'relation_id',
        searchItem:{
          status:1,
          passage3:wx.getStorageSync('info').passage1
        },
        condition:'='
      }
    };
    const callback = (res)=>{
      if(res.info.data.length>0){
        self.data.mainData = res.info.data[0]
        self.data.time = api.timestampToTime(parseInt(self.data.mainData.message[0].passage2)).split('-')
        console.log(self.data.time)
      }else{
        api.showToast("数据错误",'none')
      };
      
      self.setData({
        web_time:self.data.time,
        web_mainData:self.data.mainData
      })
    };
    api.articleGet(postData,callback);
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

  