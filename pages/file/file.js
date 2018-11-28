import {Api} from '../../utils/api.js';
var api = new Api();
const app = getApp();
import {Token} from '../../utils/token.js';
const token = new Token();

Page({
  data: {
    mainData:[],
    currentId1:0,
    mood:0,
    is_show:false,
    scrollTop:'',
    searchItem:{

      class:0,
      type:1,
      passage3:wx.getStorageSync('info').passage1,
    },
    tab:0
  },
  //事件处理函数
  onLoad(){
    const self = this;
    self.data.paginate = getApp().globalData.paginate;
    self.getMainData();
    self.setData({
      web_tab:self.data.tab,
      web_num:self.data.searchItem.class
    })
  },

  getMainData(isNew){
    const self = this;
    if(isNew){
      api.clearPageIndex(self); 
      self.setData({
        web_mainData:self.data.mainData,
      });  
    };
    const postData = {};
    postData.paginate = api.cloneForm(self.data.paginate);
    postData.token = wx.getStorageSync('token');
    postData.searchItem = api.cloneForm(self.data.searchItem)
    postData.order = {
      create_time:'desc'
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
    api.messageGet(postData,callback);
  },

  menuClickTwo(e) {
    const self = this;
    const tab = e.currentTarget.dataset.id;
    self.changeSearchTwo(tab);
  },

  changeSearchTwo(tab){
    const self = this;
    this.setData({
      web_tab: tab
    });

    if(tab==0){
      self.data.searchItem.user_no = wx.getStorageSync('info').user_no
    }else if(tab==1){
      self.data.searchItem.user_no = ['NOT IN',[wx.getStorageSync('info').user_no]]
    }else if(tab==2){
      self.data.searchItem.user_type = 0,
      delete self.data.searchItem.user_no
    };

    self.getMainData(true);

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
    self.data.searchItem.class = num;
    self.getMainData(true);
  },

  onReachBottom() {
    const self = this;
    if(!self.data.isLoadAll){
      self.data.paginate.currentPage++;
      self.getMainData();
    };
  },


  scroll(e){
    const self = this;
    var top=e.detail.scrollTop/2;
    var style = 'top:'+top+'px';
    console.log(style);
    self.setData({
      scrollTop:style
    });
  },

  statistics(e){
    const self = this;
    var is_show = !this.data.is_show
    this.setData({
      is_show:is_show
    })
    console.log(is_show);
  },

  close(e){
     const self = this;
    var is_show = !this.data.is_show
    this.setData({
      is_show:false,
      is_show2:false,
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

  