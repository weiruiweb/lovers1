import {Api} from '../../utils/api.js';
var api = new Api();
const app = getApp();
import {Token} from '../../utils/token.js';
const token = new Token();

Page({
  data: {
    isShow:false,
    slider: [],
    labelData:[],
    choose_sku_item:[],
    swiperCurrent: 3,
    slider: [
    {
      picUrl: '/images/product.png'
    },
    {
      picUrl: '/images/product.png'
    },
    {
      picUrl: '/images/product.png'
    },
    {
      picUrl: '/images/product.png'
    },
   
    ],
    indicatorDots: true,
    autoplay: true,
    interval: 2000,
    duration: 1000,
    circular: true,
    beforeColor: "white",//指示点颜色  
    afterColor: "coral",//当前选中的指示点颜色 
    is_choose:0,
    is_choose1:0,
    choose_size:0,
    choose_size1:0,
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
    postData.getAfter={
      sku:{
        tableName:'sku',
        middleKey:'product_no',
        key:'product_no',
        condition:'=',
        searchItem:{
          
          status:['in',[1]]
        },
      } 
    };
    const callback = (res)=>{
      if(res.info.data.length>0){
        self.data.mainData = res.info.data[0];
        for(var key in self.data.mainData.label){
          if(self.data.mainData.sku_array.indexOf(parseInt(key))!=-1){
            self.data.labelData.push(self.data.mainData.label[key])
          };    
        };  
        console.log(self.data.labelData)
        for (var i = 0; i < self.data.mainData.sku.length; i++) {
          self.data.choose_sku_item.push.apply(self.data.choose_sku_item,self.data.mainData.sku[i].sku_item);
        };
        self.data.skuData = self.data.mainData.sku[0]
        self.data.sku_item = self.data.skuData.sku_item;
      }
      wx.hideLoading();
      
      self.setData({
        web_skuData:self.data.skuData,
        web_labelData:self.data.labelData,
        web_mainData:self.data.mainData,
        web_sku_item:self.data.sku_item,
        web_choose_sku_item:self.data.choose_sku_item,
      });   
    };
    api.productGet(postData,callback);
  },

  bindManual(e) {
    const self = this;
    var count = e.detail.value;
    self.setData({
      web_count:count
    });
  },



  countTotalPrice(){  
    const self = this;
    var totalPrice = 0;
    totalPrice += self.data.count*parseFloat(self.data.skuData.price);
    self.data.totalPrice = totalPrice;
    self.setData({
      web_totalPrice:self.data.totalPrice.toFixed(2)
    });
  },

  

  selectModel(e){
    const self = this;
    if(self.data.buttonClicked){
      api.showToast('数据有误请稍等','none');
      setTimeout(function(){
        wx.showLoading();
      },800)   
      return;
    };
    self.data.buttonType = api.getDataSet(e,'type');
    console.log( self.data.buttonType)
    var isShow = !self.data.isShow;
    self.setData({
      web_buttonType:self.data.buttonType,
      isShow:isShow
    })
  },

  addCart(){
    const self = this;
    self.data.skuData.count = self.data.count;
    self.data.skuData.isSelect = true;
    console.log(self.data.skuData);
    if(self.data.skuData.id !=''&&self.data.skuData.id !=undefined){
      api.footOne(self.data.skuData,'id',100,'cartData'); 
      api.showToast('已加入购物车啦','none')
    }else{
      api.showToast('请完善信息','none')
    }
    this.setData({
      isShow:false,
    })
  },

  goBuy(){
    const self = this;
    const callback = (user,res) =>{ 
      const skuDatas = [];
      skuDatas.push({
        id:self.data.id,
        count:self.data.count
      });
      console.log(skuDatas);
      if(self.data.skuData.id !=''&&self.data.skuData.id !=undefined){
        wx.setStorageSync('payPro',skuDatas);
       
        api.pathTo('/pages/order_confirm/order_confirm?group_no='+self.data.scene+'&&user_no='+self.data.user_no,'nav')
      }else{
        api.showToast('请完善信息','none')
      }
    };
    api.getAuthSetting(callback);


  },



  chooseSku(e){
    const self = this;
    const callback = (user,res) =>{ 
        if(self.data.buttonClicked){
        api.showToast('数据有误请稍等','none');
        setTimeout(function(){
          wx.showLoading();
        },800)   
        return;
      };
      self.data.skuData = {};
      self.data.id = '';
      
      self.data.count = 1;
      delete self.data.totalPrice;
      var id = api.getDataSet(e,'id');
      
      if(self.data.choose_sku_item.indexOf(id)==-1){
        return;
      };
      self.data.choose_sku_item = [];
      var parentid = api.getDataSet(e,'parentid');
      var sku = self.data.mainData.label[parentid];

      for(var i=0;i<sku.child.length;i++){
        if(self.data.sku_item.indexOf(sku.child[i].id)!=-1){
          self.data.sku_item.splice(self.data.sku_item.indexOf(sku.child[i].id), 1);
        };
        self.data.choose_sku_item.push(sku.child[i].id);
      };

      
      for (var i = 0; i < self.data.mainData.sku.length; i++) {
        if(self.data.mainData.sku[i].sku_item.indexOf(parseInt(id))!=-1){
          self.data.choose_sku_item.push.apply(self.data.choose_sku_item,self.data.mainData.sku[i].sku_item);  
        };
      };

      for(var i=0;i<self.data.sku_item.length;i++){
        if(self.data.choose_sku_item.indexOf(parseInt(self.data.sku_item[i]))==-1){
          self.data.sku_item.splice(i, 1); 
        };
      };
      self.data.sku_item.push(id);

      for(var i=0;i<self.data.mainData.sku.length;i++){ 
        if(JSON.stringify(self.data.mainData.sku[i].sku_item.sort())==JSON.stringify(self.data.sku_item.sort())){
          self.data.id = self.data.mainData.sku[i].id;
          self.data.skuData = api.cloneForm(self.data.mainData.sku[i]);
        };   
      };
      self.setData({
        web_totalPrice:'',
        web_count:self.data.count,
        web_sku_item:self.data.sku_item,
        web_skuData:self.data.skuData,
        web_choose_sku_item:self.data.choose_sku_item,
      });
    };
    api.getAuthSetting(callback);
    
    
  },

  swiperChange(e) {
    const that = this;
    that.setData({
      swiperIndex: e.detail.current,
    })
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
        path: 'pages/detail/detail?id='+self.data.id+'&&user_no='+wx.getStorageSync('info').user_no,
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
  













  swiperChange: function (e) {
    //只要把切换后当前的index传给<swiper>组件的current属性即可 
    this.setData({
      swiperCurrent: e.detail.current
    })
  },

  dotsChange: function (e) {
    //只要把切换后当前的index传给<swiper>组件的current属性即可 
    this.setData({
      dotsCurrent: e.detail.current
    })
  },

  //点击指示点切换 
  chuangEvent: function (e) {
    this.setData({
      swiperCurrent: e.currentTarget.id
    })
  },

  chuangEvents: function (e) {
    this.setData({
      dotsCurrent: e.currentTarget.id
    })
  },
  choose(e){
    this.setData({
      isShow:true
    })
  },
  add_cart(e){
    this.setData({
      isShow:false
    })
  },
  choose_color(e){
    const self = this;
    self.setData({
      is_choose:e.currentTarget.dataset.id
    })
  },

  choose_size(e){
    const self = this;
    self.setData({
      choose_size:e.currentTarget.dataset.id
    })
  },

  choose_size1(e){
    const self = this;
    self.setData({
      choose_size1:e.currentTarget.dataset.id
    })
  },

  choose_color1(e){
    const self = this;
    self.setData({
      is_choose1:e.currentTarget.dataset.id
    })
  },

  intoPath(e){
    const self = this;
    api.pathTo(api.getDataSet(e,'path'),'nav');
  },

  intoPathBack(e){
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

  