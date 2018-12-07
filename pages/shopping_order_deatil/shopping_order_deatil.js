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
    swiperCurrent: 1,
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
    count:1
  },

  onLoad(options){
    const self = this;
    self.data.id = options.id;
    self.setData({
      web_count:self.data.count,
      web_dotWidth:'0px'
    });
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
        self.data.labelData = self.data.mainData.label;
        console.log('getMainData',self.data.labelData)
        for (var i in self.data.labelData) {
          if(self.data.labelData[i].title=='男颜色'){
            self.data.menColor = self.data.labelData[i]
          };
          if(self.data.labelData[i].title=='男尺码'){
            self.data.menSize = self.data.labelData[i]
          };
          if(self.data.labelData[i].title=='女颜色'){
            self.data.womenColor = self.data.labelData[i]
          };
          if(self.data.labelData[i].title=='女尺码'){
            self.data.womenSize = self.data.labelData[i]
          };
        };

        for (var i = 0; i < self.data.mainData.sku.length; i++) {
          if(self.data.mainData.sku[i].id==self.data.id){
            self.data.choosed_skuData = api.cloneForm(self.data.mainData.sku[i]);
            self.data.choosed_sku_item = api.cloneForm(self.data.mainData.sku[i].sku_item);
            var skuRes = api.skuChoose(self.data.mainData.sku,self.data.choosed_sku_item);
            self.data.can_choose_sku_item = skuRes.can_choose_sku_item;
            console.log('self.data.can_choose_sku_item',self.data.can_choose_sku_item)
          };
        };
        if(self.data.mainData.bannerImg.length>0){
          var testDotsWidth = wx.getSystemInfoSync().windowWidth/self.data.mainData.bannerImg.length;
          console.log('testDotsWidth',testDotsWidth)
          if(testDotsWidth>103.5){
            self.setData({
              web_dotWidth:103.5*self.data.mainData.bannerImg.length+'px'
            });
          }else{
            self.setData({
              web_dotWidth:'100%'
            });
          };
        };


        self.setData({
          web_menColor:self.data.menColor,
          web_menSize:self.data.menSize,
          web_womenColor:self.data.womenColor,
          web_womenSize:self.data.womenSize,
          web_choosed_sku_item:self.data.choosed_sku_item,
          web_can_choose_sku_item:self.data.can_choose_sku_item,
          web_choosed_skuData:self.data.choosed_skuData,
        }); 
        console.log(self.data.menColor)
        console.log(self.data.womenSize)
        for (var i = 0; i < self.data.mainData.sku.length; i++) {
          self.data.choose_sku_item.push.apply(self.data.choose_sku_item,self.data.mainData.sku[i].sku_item);
        };
        self.data.skuData = self.data.mainData.sku[0]
        self.data.sku_item = self.data.skuData.sku_item;
      }
      wx.hideLoading();
      //self.data.mainData.bannerImg.push({},{},{});
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
      web_totalPrice:self.data.totalPrice.toFixed(2),
      web_count:self.data.count

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
       
        api.pathTo('/pages/order_confirm/order_confirm','nav')
      }else{
        api.showToast('请完善信息','none')
      }
    };
    api.getAuthSetting(callback);


  },


    //计算数量
  counter(e){

    const self = this;
    if(JSON.stringify(self.data.choosed_skuData)!='{}'){
      if(api.getDataSet(e,'type')=='+'){
        self.data.count++;
      }else if(self.data.choosed_skuData.count > '1'){
        self.data.count--;
      }
      self.data.choosed_skuData.count = self.data.count;
    }else{
      self.data.count = 1;
    };
    console.log('self.data.count',self.data.count)
    self.countTotalPrice();

  },



  chooseSku(e){
    const self = this;
    console.log('chooseSku',e)
    if(self.data.buttonClicked){
      api.showToast('数据有误请稍等','none');
      setTimeout(function(){
        wx.showLoading();
      },800)   
      return;
    };
    
    var id = api.getDataSet(e,'id');
    if(self.data.can_choose_sku_item.indexOf(id)==-1){
      return;
    };

    var index = self.data.choosed_sku_item.indexOf(id);
    if(index==-1){
      self.data.choosed_sku_item.push(id);
    }else{
      self.data.choosed_sku_item.splice(index,1);
    };
    var skuRes = api.skuChoose(self.data.mainData.sku,self.data.choosed_sku_item);
    self.data.choosed_skuData = skuRes.choosed_skuData;
    self.data.can_choose_sku_item = skuRes.can_choose_sku_item;

    self.data.count = 1;
    self.countTotalPrice();

    console.log('self.data.mainData.sku',self.data.mainData.sku)
    console.log('self.data.choosed_sku_item',self.data.choosed_sku_item)
    console.log('self.data.can_choose_sku_item',self.data.can_choose_sku_item)
    console.log('self.data.choosed_skuData',self.data.choosed_skuData)
    self.setData({
      web_choosed_sku_item:self.data.choosed_sku_item,
      web_choosed_skuData:self.data.choosed_skuData,
      web_can_choose_sku_item:self.data.can_choose_sku_item,
    });
    
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

  