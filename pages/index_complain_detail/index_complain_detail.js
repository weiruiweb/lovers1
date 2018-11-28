import {Api} from '../../utils/api.js';
var api = new Api();
const app = getApp();


Page({
  data: {

    comData:[],
    isLoadAll:false,
    is_show:false,
    is_show2:false,
    sForm:{
      content:'',
      type:4,
    }
  },
  onLoad(options) {
    const self = this;
    self.data.paginate = getApp().globalData.paginate;
    self.data.id = options.id;
    self.getMainData()
  },

  getMainData(){
    const self = this;

    const postData = {};
    postData.token = wx.getStorageSync('token');
    postData.searchItem = {
      thirdapp_id:getApp().globalData.thirdapp_id,
      type:3,
      user_type:2,
      id:self.data.id
    };
    
  
    const callback = (res)=>{
      if(res.info.data.length>0){
        self.data.mainData = res.info.data[0]
      }else{
        api.showToast('数据错误','fail');
      };
      wx.hideLoading();
      self.data.sForm.relation_id = self.data.id;
      self.setData({
        web_mainData:self.data.mainData,
      });
      self.getComData()  
    };
    api.messageGet(postData,callback);
  },

  getComData(isNew){
    const self = this;
    if(isNew){
      api.clearPageIndex(self);
    }
    const postData = {};
    postData.paginate = self.data.paginate;
    postData.token = wx.getStorageSync('token');
    postData.searchItem = {
      thirdapp_id:getApp().globalData.thirdapp_id,
      type:4,
      relation_id:self.data.id,
      user_type:0
    };
    postData.getAfter = {
      user:{
        tableName:'user',
        middleKey:'user_no',
        key:'user_no',
        searchItem:{
          status:1
        },
        condition:'='
      },
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
    };
  
    const callback = (res)=>{
      if(res.info.data.length>0){
        self.data.comData.push.apply(self.data.comData,res.info.data)
      }else{
        self.data.isLoadAll = true;
      };
      wx.hideLoading();
      self.data.sForm.relation_id = self.data.id;
      self.setData({
        web_comData:self.data.comData,
      });  
    };
    api.messageGet(postData,callback);
  },

  changeBind(e){
    const self = this;
    api.fillChange(e,self,'sForm');
    self.setData({
      web_sForm:self.data.sForm,
    });  
  },

  messageAdd(){
    const self = this;
    const postData = {};
    postData.token = wx.getStorageSync('token');
    postData.data = {};
    postData.data = api.cloneForm(self.data.sForm);
    const callback = (data)=>{  
      if(data.solely_code == 100000){
        api.showToast('评论成功','none');

      }else{
        api.showToast('评论失败','none');
      };
      self.data.sForm.content='';
      self.data.comData = []
      self.setData({
        web_sForm:self.data.sForm
      });

      self.getComData()
      wx.hideLoading(); 
    };
    api.messageAdd(postData,callback);  
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
        self.data.comData[index].isPraise = {};
        self.data.comData[index].isPraise.id = res.info.id;
        self.data.comData[index].praiseCount.totalCount++;
        wx.hideLoading();
        self.setData({
          web_comData:self.data.comData
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
          self.data.comData[index].isPraise['id'] = log_id;
          self.data.comData[index].praiseCount.totalCount++;
        }else{
          self.data.comData[index].isPraise = {};
          self.data.comData[index].praiseCount.totalCount--;
        };
        self.setData({
          web_comData:self.data.comData
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
        web_comData:self.data.comData
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


  submit(){
    const self = this;
    const pass = api.checkComplete(self.data.sForm);
    if(pass){
        wx.showLoading();
        self.messageAdd(); 
    }else{
      api.showToast('不能发出空评论','none');
    };
  },

  onReachBottom() {
    const self = this;
    if(!self.data.isLoadAll){
      self.data.paginate.currentPage++;
      self.getComData();
    };
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
  intoPathRedirect(e){
    const self = this;
    api.pathTo(api.getDataSet(e,'path'),'redi');
  }, 
})

  