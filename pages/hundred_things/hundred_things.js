import {Api} from '../../utils/api.js';
var api = new Api();
const app = getApp();
import {Token} from '../../utils/token.js';
const token = new Token();

Page({

  data: {
    num:0,
    mainData:[],
    currentId:0,
    currentId1:0,
    searchItem:{
      thirdapp_id:getApp().globalData.thirdapp_id
    }
  },

  onLoad(options){
    const self = this;
    self.data.paginate = getApp().globalData.paginate;
    self.setData({
      web_num:self.data.num
    });
    self.getMainData()
  },

  getMainData(isNew){
    const self = this;
    if(isNew){
      api.clearPageIndex(self);  
    };
    const postData = {};
    postData.paginate = api.cloneForm(self.data.paginate);
    postData.searchItem = api.cloneForm(self.data.searchItem);
    postData.getBefore = {
      article:{
        tableName:'label',
        searchItem:{
          title:['=',['一起完成100件小事']],
        },
        middleKey:'menu_id',
        key:'id',
        condition:'in',
      },
    };
    postData.getAfter = {
      message:{
        tableName:'message',
        middleKey:'id',
        key:'relation_id',
        searchItem:{
          status:1
        },
        condition:'='
      }
    };
    const callback = (res)=>{

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
    };
    api.articleGet(postData,callback);
  },

  menuClick(e) {
    const self = this;
    const num = e.currentTarget.dataset.id;
    self.changeSearch(num);
  },


  changeSearch(num){
    const self = this;
    this.setData({
      web_num: num
    });
    if(num=='0'){

    }else if(num=='1'){
      self.data.searchItem.message=[];
    }else if(num=='2'){
      self.data.searchItem.message!=[];
    }
    self.getMainData(true);
  },

  onReachBottom() {
    const self = this;
    if(!self.data.isLoadAll){
      self.data.paginate.currentPage++;
      self.getMainData();
    };
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

  