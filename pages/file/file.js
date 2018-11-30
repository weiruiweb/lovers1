import {Api} from '../../utils/api.js';
var api = new Api();
const app = getApp();
import {Token} from '../../utils/token.js';
const token = new Token();

Page({
  data: {
    countData:[],
    mainData:[],
    currentId1:0,
    mood:0,
    is_show:false,
    scrollTop:'',
    searchItem:{
    
      class:0,
      user_no:wx.getStorageSync('info').user_no
    },
    tab:0
  },
  //事件处理函数
  onLoad(){
    const self = this;
    self.data.paginate = getApp().globalData.paginate;
    self.setData({
      web_tab:self.data.tab,
      web_num:self.data.searchItem.class
    })
  },


  onShow(){
    const self = this;
    self.data.mainData=[];
    self.getMainData();
    self.getCountData();


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
    postData.searchItem = api.cloneForm(self.data.searchItem);
    postData.searchItem.passage3=wx.getStorageSync('info').passage1;
    postData.searchItem.type=1;
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

  getCountData(){
    const self = this;
    const postData = {};
    postData.token = wx.getStorageSync('token');
    postData.searchItem= {};
    postData.searchItem.passage3 = wx.getStorageSync('info').passage1;
    postData.searchItem.type=1;
    const callback = (res)=>{
      if(res.solely_code==10000){
        self.data.countData.push.apply(self.data.countData,res.info.data)
      };
    };
    api.messageGet(postData,callback);
  },

  countDays(){
    const self = this;
    console.log(parseInt(Date.parse(new Date()))/1000);
    console.log(parseInt(wx.getStorageSync('info').bind_time));
    var totalSecond = parseInt(Date.parse(new Date())/1000)- parseInt(wx.getStorageSync('info').bind_time);
      console.log(totalSecond)
      var day = Math.floor(totalSecond/(24*3600));
      day=parseInt(day)
      console.log(day)
      if(day<100&&self.data.countData.length<100){
        self.statistics()
      }else{
        api.pathTo("/pages/file_statistics/file_statistics",'nav')
      }
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
      delete self.data.searchItem.user_type,
      self.data.searchItem.user_no = wx.getStorageSync('info').user_no
    }else if(tab==1){
      delete self.data.searchItem.user_type,
      self.data.searchItem.user_no = ['NOT IN',[wx.getStorageSync('info').user_no]]
    }else if(tab==2){
 /*     self.data.searchItem.user_type = 0,*/
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

  