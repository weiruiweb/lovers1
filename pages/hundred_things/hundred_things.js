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
    },
    getBefore:{},
    buttonClick:false
  },

  onShow(options){
    const self = this;
    self.data.paginate = getApp().globalData.paginate;
    self.data.getBefore = {
		article:{
			tableName:'label',
			searchItem:{
			  title:['=',['一起完成100件小事']],
			},
			middleKey:'menu_id',
			key:'id',
			condition:'in',
		}
	};
    
    self.setData({
      web_num:self.data.num
    });
    self.getMainData(true)
  },

  getMainData(isNew){
    const self = this;
    if(isNew){
      api.clearPageIndex(self);  
    };
    const postData = {};

    postData.paginate = api.cloneForm(self.data.paginate);
    postData.searchItem = api.cloneForm(self.data.searchItem);
    if(self.data.getBefore&&JSON.stringify(self.data.getBefore)!='{}'){
    	postData.getBefore = api.cloneForm(self.data.getBefore);
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
        self.data.mainData.push.apply(self.data.mainData,res.info.data);
      }else{
        self.data.isLoadAll = true;
        api.showToast('没有更多了','none');
      };
      wx.hideLoading();
      self.setData({
      	buttonClicked: false,
        web_mainData:self.data.mainData,
      });  
    };
    api.articleGet(postData,callback);
  },

  menuClick(e) {
    const self = this;
     self.setData({
      	buttonClicked: true,
        web_mainData:self.data.mainData,
     });  
    const num = e.currentTarget.dataset.id;
    self.changeSearch(num);
  },


  changeSearch(num){
    const self = this;
    this.setData({
      web_num: num
    });
    if(num=='0'){
    	delete self.data.getBefore.message;
    }else if(num=='1'){

		self.data.getBefore.message = {
			tableName:'message',
			searchItem:{
			  user_no:['in',[wx.getStorageSync('info').user_no]],
			  type:['in',[1]]
			},
			middleKey:'id',
			key:'relation_id',
			condition:'NOT IN',
		};
	

    }else if(num=='2'){
 
      self.data.getBefore.message = {
        tableName:'message',
        searchItem:{
          user_no:['in',[wx.getStorageSync('info').user_no]],
          type:['in',[1]]
        },
        middleKey:'id',
        key:'relation_id',
        condition:'IN',
      };
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
    var id = api.getDataSet(e,'id');
    wx.navigateTo({
        url:'/pages/hundred_things_infor/hundred_things_infor?id='+id
    });
  },

   intoPathCom(e){
    const self = this;
    var id = api.getDataSet(e,'id');
    wx.navigateTo({
        url:'/pages/hundred_things_confirm/hundred_things_confirm?id='+id
    });
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

  