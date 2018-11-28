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
  onLoad(options){
    const self = this;
    wx.showLoading();
    wx.showShareMenu({
      withShareTicket: true
    });
    self.data.paginate = getApp().globalData.paginate;
    self.getMainData();
    if(options.scene){
      var scene = decodeURIComponent(options.scene)
    };
    console.log(scene)
    if(scene){
      self.data.scene = scene;
      self.dialog1();
      self.getUserData(scene)
    }else{
      self.getBindData()
    };

  },
  

  getUserData(scene){
    const self = this;
    const postData = {
      token:wx.getStorageSync('token'), 
    };
    postData.getAfter = {
      bind:{
        tableName:'user',
        middleKey:'status',
        key:'status',
        searchItem:{
          user_no:scene
        },
        condition:'='
      }
    };
    const callback = (res)=>{
      if(res.info.data.length>0){
        self.data.userData = res.info.data[0]
      };
      self.setData({
        web_userData:self.data.userData
      });
      self.getProductData()
    }
    api.userGet(postData,callback)
  },

  getProductData(){
    const self = this;
    const postData = {
      token:wx.getStorageSync('token'), 
    };
    postData.getBefore = {
      article:{
        tableName:'label',
        searchItem:{
          title:['=',['100件小事']],
        },
        middleKey:'category_id',
        key:'id',
        condition:'in',
      },
    };
    const callback = (res)=>{
      if(res.info.data.length>0){
        self.data.productData = res.info.data[0]
      };
      wx.hideLoading(); 
      self.setData({
        web_productData:self.data.productData
      });

    }
    api.productGet(postData,callback)
  },

  addOrder(){
    const self = this;
    if(!self.data.order_id){
    const postData = {
        token:wx.getStorageSync('token'), 
        product:[
          {id:self.data.productData.id,count:1}
        ],
        pay:{wxPay:self.data.productData.price,wxPayStatus:0},
        type:3,
        data:{
          passage1:wx.getStorageSync('info').passage1
        }
      };
      console.log(postData)
      const callback = (res)=>{
        if(res&&res.solely_code==100000){
          self.data.order_id = res.info.id;

          self.pay(self.data.order_id)
        }; 
      };
      api.addOrder(postData,callback);
    }else{
      self.pay(self.data.order_id)
    }    
  },

  pay(order_id){
    const self = this;
    var order_id = self.data.order_id;
    const postData = {
      searchItem:{
        id:order_id,
      },
      token:wx.getStorageSync('token'),
      wxPay:self.data.productData.price,
      wxPayStatus:0,
    };
    
    const callback = (res)=>{
      wx.hideLoading();
      if(res.solely_code==100000){
        const payCallback=(payData)=>{
            if(payData==1){
               api.showToast('支付成功','none');
            };   
          };
          api.realPay(res.info,payCallback);      
      }else{
        api.showToast('支付失败','none')
      }    
    };
    api.pay(postData,callback);
  },

  getBindData(){
    const self = this;
    const postData = {
      token:wx.getStorageSync('token'), 
    };
    if(JSON.stringify(wx.getStorageSync('info').passage1)!={}){
      postData.getAfter = {
        bind:{
          tableName:'user',
          middleKey:'passage1',
          key:'passage1',
          searchItem:{
            user_type:0,
            id:['NOT IN',[wx.getStorageSync('info').id]],
          },
          condition:'='
        }
      };
    }
    const callback = (res)=>{
      if(res.info.data.length>0){
        self.data.bindData = res.info.data[0]
      };
      self.setData({
        web_bindData:self.data.bindData
      });

      self.getProductData()
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
        web_day:day,
      });

  },



  binding(){
    const self = this;
    const postData = {
      token:wx.getStorageSync('token'),
      user_no:self.data.scene,
    };
    const callback = (res) =>{
      console.log(res)
    };
    api.binding(postData,callback)
  },

  submit(e){
    const self = this;
    const callback = (user,res) =>{ 
      self.binding();
    };
    api.getAuthSetting(callback);
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

  onShareAppMessage(res){
    const self = this;
    if(self.data.buttonClicked){
      api.showToast('数据有误请稍等','none');
      setTimeout(function(){
        wx.showLoading();
      },800)   
      return;
    };
     console.log(res)
      if(res.from == 'button'){
        self.data.shareBtn = true;
      }else{   
        self.data.shareBtn = false;
      }
      return {
        title: '情侣就要装',
        path: 'pages/detail/detail?user_no='+wx.getStorageSync('info').user_no,
        success: function (res){
          console.log(res);
          console.log(parentNo)
          if(res.errMsg == 'shareAppMessage:ok'){
            console.log('分享成功')
            if (self.data.shareBtn){
              if(res.hasOwnProperty('shareTickets')){
              console.log(res.shareTickets[0]);
                self.data.isshare = 1;
              }else{
                self.data.isshare = 0;
              }
            }
          }else{
            wx.showToast({
              title: '分享失败',
            })
            self.data.isshare = 0;
          }
        },
        fail: function(res) {
          console.log(res)
        }
      }
  },



  add(e){
    const self = this;
    var is_show = !this.data.is_show
    this.setData({
      is_show:is_show
    })
    console.log(is_show);
  },

  dialog1(e){
    const self = this;
    var is_show1 = !this.data.is_show1
    this.setData({
      is_show1:is_show1
    })
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



  intoPath(e){
    const self = this;
    api.pathTo(api.getDataSet(e,'path'),'nav');
  },
  
  intoPathRedirect(e){
    const self = this;
    api.pathTo(api.getDataSet(e,'path'),'redi');
  }, 
})

  