import {Api} from '../../utils/api.js';
var api = new Api();
const app = getApp();


Page({
  data: {
    mainData:[],
    is_show:false,
    is_show:false,
    is_show2:false,
    is_show3:false,
  },
  //事件处理函数
  onLoad(){
    const self = this;
    self.data.paginate = getApp().globalData.paginate;
    self.getMainData();
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
    postData.searchItem = {
      thirdapp_id:getApp().globalData.thirdapp_id,
      type:3,
      user_type:2
    };
    postData.order = {
      create_time:'desc'
    };
    postData.getAfter = {
      praiseCount:{
        tableName:'log',
        middleKey:'id',
        key:'result',
        searchItem:{
          status:1,
        },
        condition:'=',
        compute:{
          pCount:[
            'count',
            'any',
            {
              status:1,
            }
          ]
        },
      },
      isPraise:{
        tableName:'log',
        middleKey:'id',
        key:'result',
        searchItem:{
          status:1,
          user_no:wx.getStorageSync('info').user_no
        },
        condition:'=',
        info:['id']
      },
      comCount:{
        tableName:'message',
        middleKey:'id',
        key:'relation_id',
        searchItem:{
          status:1
        },
        condition:'=',
          compute:{
          pCount:[
            'count',
            'any',
            {
              status:1,
            }
          ]
        },
      }
    }
    const callback = (res)=>{
      if(res.info.data.length>0){
        self.data.mainData.push.apply(self.data.mainData,res.info.data);
      }else{
        self.data.isLoadAll = true;
        api.showToast('没有更多了','fail');
      };
      wx.hideLoading();
      self.setData({
        web_mainData:self.data.mainData,
      });  
    };
    api.messageGet(postData,callback);
  },

  addLog(message_id,index){
    const self = this;
    const postData ={};
    postData.data= {
      type:4,
      title:'点赞成功',
      result:message_id,
    };
    postData.token = wx.getStorageSync('token');
    const callback = (res)=>{
      if(res.solely_code==100000){
        self.data.mainData[index].isPraise = {};
        self.data.mainData[index].isPraise.id = res.info.id;
        self.data.mainData[index].praiseCount.totalCount++;
        wx.hideLoading();
        self.setData({
          web_mainData:self.data.mainData
        }); 
      }else{
        api.showToast('点赞失败','fail');
      };
    };
    api.logAdd(postData,callback);
  },


  updateLog(log_id,index,type){
    const self = this;
    const postData ={
      searchItem:{
        id:log_id
      },
      data:{
        status:type
      }
    };
    postData.token = wx.getStorageSync('token');
    const callback = (res)=>{
      if(res.solely_code==100000){
        if(type==1){
          self.data.mainData[index].isPraise['id'] = log_id;
          self.data.mainData[index].praiseCount.totalCount++;
        }else{
          self.data.mainData[index].isPraise = {};
          self.data.mainData[index].praiseCount.totalCount--;
        };
        self.setData({
          web_mainData:self.data.mainData
        });
      }else{
        api.showToast('点赞失败','fail');
      };

    };
    api.logUpdate(postData,callback);
  },


  getLogData(message_id,index){
    const self = this;
    const postData = {};
    postData.token = wx.getStorageSync('token');
    postData.searchItem = {
      result:message_id,
      type:4,
      status:['in',[1,-1]]
    };
    const callback = (res)=>{
      if(res.info.data.length>0&&res.info.data[0].status==1){
        self.updateLog(res.info.data[0].id,index,-1);
      }else if(res.info.data.length>0&&res.info.data[0].status==-1){
        self.updateLog(res.info.data[0].id,index,1);
      }else{
        self.addLog(message_id,index);
      };
      self.setData({
        web_mainData:self.data.mainData
      });
    };
    api.logGet(postData,callback);

  },
  

  submitSupport(e){
    const self = this;
    var praiseId = api.getDataSet(e,'log_id');
    var index = api.getDataSet(e,'index');
    
    if(praiseId){
      self.updateLog(praiseId,index,-1)
    }else{
      var message_id = api.getDataSet(e,'id');
      const callback = (user,res) =>{
        
        self.getLogData(message_id,index);
      };
      api.getAuthSetting(callback);
    }
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

  