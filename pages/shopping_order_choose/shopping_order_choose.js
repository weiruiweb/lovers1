import {Api} from '../../utils/api.js';
var api = new Api();
const app = getApp();
import {Token} from '../../utils/token.js';
const token = new Token();

Page({
  data: {
    background: ['/images/product.png', '/images/product.png', '/images/product.png', '/images/product.png', '/images/product.png'],
    indicatorDots: false,
    vertical: false,
    autoplay: true,
    circular: true,
    interval: 2000,
    duration: 500,
    previousMargin: 0,
    nextMargin: 0,
    currentId:0,
    swiperIndex:0,
    is_choose:0,
    is_choose1:0,
    choose_size:0,
    choose_size1:0,
    mainData:[],
    chooseId:[],
    tabCurrent:0,
    isShow:false,
    labelData:[],
    complete_api:[],
    keys:[],
    values:[],    skuData:{},
    count:1,
    id:'',
    sku_item:[],
    choose_sku_item:[],
    buttonType:'',
    buttonClicked:true,
  },


  
  onLoad(options){
    const self = this;
    console.log(11,options);
    
    wx.showLoading();

    self.setData({
      web_count:self.data.count,
    });
    if(options.id){
      self.data.id = options.id;
      console.log(12,self.data.id)
    };
    self.getMainData();
    
  },



  getMainData(){
    const self = this;
    const postData = {};
    postData.searchItem = {
      thirdapp_id:getApp().globalData.thirdapp_id,
      id:self.data.id
    };
    console.log(13,self.data.id);
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
        
        for (var i = 0; i < self.data.mainData.sku.length; i++) {
          if(self.data.mainData.sku[i].id==self.data.id){
            self.data.skuData = api.cloneForm(self.data.mainData.sku[i]);
          };
          self.data.choose_sku_item.push.apply(self.data.choose_sku_item,self.data.mainData.sku[i].sku_item);
        };

        self.data.sku_item = self.data.skuData.sku_item;
        self.data.mainData.content = api.wxParseReturn(res.info.data[0].content).nodes;
        self.data.complete_api.push('getMainData');

      }else{
        api.showToast('商品信息有误','none');
      };

      self.setData({
        web_skuData:self.data.skuData,
        web_labelData:self.data.labelData,
        web_mainData:self.data.mainData,
        web_sku_item:self.data.sku_item,
        web_choose_sku_item:self.data.choose_sku_item,
      });
      console.log('self.data.labelData',self.data.web_mainData)
      self.checkLoadComplete();
    };
    api.productGet(postData,callback);
  },



  counter(e){
    const self = this;
    if(self.data.buttonClicked){
      api.showToast('数据有误请稍等','none');
      setTimeout(function(){
        wx.showLoading();
      },800)   
      return;
    };
    if(api.getDataSet(e,'type')=='+'){
      self.data.count++;
    }else if(self.data.skuData.count > '1'){
      self.data.count--;
    }
    self.data.skuData.count = self.data.count
    self.setData({
      web_count:self.data.count,
      web_skuData:self.data.skuData,
    });
    self.countTotalPrice();
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
  },

  goBuy(){
    const self = this;
    const skuDatas = [];
    skuDatas.push({
      id:self.data.id,
      count:self.data.count
    });
    console.log(skuDatas);
    if(self.data.skuData.id !=''&&self.data.skuData.id !=undefined){
      wx.setStorageSync('payPro',skuDatas);
      api.pathTo('/pages/mall/confirmOrder/confirmOrder','nav')
    }else{
      api.showToast('请完善信息','none')
    }

  },
  chooseSku(e){
    const self = this;
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
    
  },

  



  checkLoadComplete(){
    const self = this;
    var complete = api.checkArrayEqual(self.data.complete_api,['getMainData']);
    if(complete){
      wx.hideLoading();
      self.data.buttonClicked = false;
    };
  },

  intoPath(e){
    const self = this;
    api.pathTo(api.getDataSet(e,'path'),'nav');
  },

  close(){
    const self = this;
    self.setData({
      isShow:false
    })
  },
  
  select_this(e){
    const self = this;
    self.setData({
      tabCurrent:e.currentTarget.dataset.current
    })
    console.log(self.data.tabCurrent)
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

  swiperChange(e) {
    const that = this;
    that.setData({
      swiperIndex: e.detail.current,
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

  