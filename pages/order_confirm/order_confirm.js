 import {Api} from '../../utils/api.js';
const api = new Api();
const app = getApp();
import {Token} from '../../utils/token.js';
const token = new Token();



Page({
  data: {
    mainData:[],
    addressData:[],
    userData:[],
    idData:[],
    orderData:[],
    couponData:[],
    couponId:[],
    searchItem:{
      isdefault:1
    },
    submitData:{
      passage1:''
    },
    searchItemTwo:
    {
      thirdapp_id:getApp().globalData.thirdapp_id,
      user_no:wx.getStorageSync('info').user_no
    },

    buttonClicked:false,
    order_id:'',
    complete_api:[],
    
  },

  onLoad(options) {
    const self = this;
    wx.showLoading();

      var token = new Token();
      token.getUserInfo();
 
    console.log('options',options)
    self.data.paginate = api.cloneForm(getApp().globalData.paginate);

    getApp().globalData.address_id = '';
    
  },

 

  onShow(){
    const self = this;
    self.data.searchItem = {};
    if(getApp().globalData.address_id){
      self.data.searchItem.id = getApp().globalData.address_id;
    }else{
      self.data.searchItem.isdefault = 1;
    };
    self.data.mainData = api.jsonToArray(wx.getStorageSync('payPro'),'unshift');
    console.log(self.data.mainData)
    for (var i = 0; i < self.data.mainData.length; i++) {
      self.data.idData.push(self.data.mainData[i].id)
    }
    self.getMainData()
    
    console.log(self.data.idData)
    self.getAddressData();

   
  },





  getMainData(){
    const self = this;
    const postData = {};
    postData.searchItem = {
      thirdapp_id:getApp().globalData.thirdapp_id,
      id:['in',self.data.idData]
    }
    const callback = (res)=>{
      console.log(res)
      for (var i = 0; i < self.data.mainData.length; i++) {
        for (var j = 0; j < res.info.data.length; j++) {
          if(self.data.mainData[i].id == res.info.data[j].id){  
            self.data.mainData[i].product = res.info.data[j]
          }
        }
      };
      self.data.complete_api.push('getMainData')
      self.setData({
        web_mainData:self.data.mainData,
      });
      console.log(self.data.mainData)
      self.countTotalPrice();
      self.checkLoadComplete()   
    };
    api.skuGet(postData,callback);
  },

  getAddressData(){
    const self = this;
    const postData = {}
    postData.token = wx.getStorageSync('token');
    postData.searchItem = api.cloneForm(self.data.searchItem);
    const callback = (res)=>{
      if(res.info.data.length>0){
        self.data.addressData = res.info.data[0]; 
      };
      console.log('getAddressData',self.data.addressData)
      self.setData({
        web_addressData:self.data.addressData,
      });
    };
    api.addressGet(postData,callback);
  },


 

  addOrder(){
    const self = this;
    console.log(self.data.complete_api)
    if(self.data.buttonClicked){
      api.showToast('数据有误请稍等','none');
      setTimeout(function(){
        wx.showLoading();
      },800)   
      return;
    }else if(!self.data.order_id){
      self.data.buttonClicked = true;
      const postData = {
        token:wx.getStorageSync('token'),
        sku:self.data.mainData,
        pay:{
          wxPay:self.data.totalPrice.toFixed(2),
        },
        data:{
        	passage3:self.data.user_no?self.data.user_no:'',
        	standard:self.data.mainData[0].product.standard
        },	
        passage1:self.data.submitData.passage1,
        type:1
      };
      console.log('addOrder',self.data.addressData)
     
     
      if(self.data.addressData){
        postData.snap_address = self.data.addressData;
      };
      if(self.data.addressData.length==0){
        api.showToast('请选择收货地址','none')
        self.data.buttonClicked = false;
        return;
      };
      const callback = (res)=>{
        if(res&&res.solely_code==100000){
          wx.removeStorageSync('payPro');
          setTimeout(function(){
            self.data.buttonClicked = false;
          }, 1000)     
          self.data.order_id = res.info.id
          self.pay(self.data.order_id);     
        }; 
        
        for (var i = 0; i < self.data.mainData.length; i++) {  
          console.log('self.data.mainData[i].id',self.data.mainData[i].id)        
          api.deleteFootOne(self.data.mainData[i].id ,'cartData')   
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
      token:wx.getStorageSync('token'),
      searchItem:{
        id:order_id,
      }
    };
   
    if(self.data.totalPrice>0){
        postData.wxPay = self.data.totalPrice.toFixed(2);
      	postData.wxPayStatus = 0;
    };
     
  
    const callback = (res)=>{
      wx.hideLoading();
      if(res.solely_code==100000){
    	if(res.info){
	    	const payCallback=(payData)=>{
	          if(payData==1){
	            setTimeout(function(){
	              api.pathTo('/pages/shopping_order/shopping_order','redi');
	            },800)  
	          };   
	        };
	        api.realPay(res.info,payCallback);   		
    	}
      }else{
        api.showToast('支付失败','none')
      }
         
    };
    api.pay(postData,callback);
  },

  checkLoadComplete(){
    const self = this;
    var complete = api.checkArrayEqual(self.data.complete_api,['getMainData']);
    if(complete){
      wx.hideLoading();
      self.data.buttonClicked = false;
    };
  },



/*  chooseScore(e){
    const self = this;

    if (self.data.totalPrice==self.data.paidPrice) {
        if(self.data.userData.info.score/1>self.data.totalPrice){
          self.data.scorePrice = self.data.totalPrice;
          self.data.paidPrice = 0;
        }else if(self.data.userData.info.score/1>0){
          self.data.scorePrice = self.data.userData.info.score/1;
          self.data.paidPrice -= self.data.scorePrice;
        };
    }else{
      self.data.paidPrice = self.data.totalPrice;
      self.data.scorePrice = 0;
    }

     self.setData({
      web_totalPrice:self.data.totalPrice.toFixed(2),
      web_scorePrice:self.data.scorePrice.toFixed(2),
      web_paidPrice:self.data.paidPrice.toFixed(2)
    });
  },*/

  
  countTotalPrice(){
    const self = this;
    var totalPrice = 0;

    var couponPrice = 0;
    var productsArray = self.data.mainData;
    for(var i=0;i<productsArray.length;i++){
      totalPrice += productsArray[i].product.price*productsArray[i].count;
    };



    
    self.data.totalPrice = totalPrice;



    console.log(self.data.totalPrice)
    self.setData({

      web_couponPrice:couponPrice.toFixed(2),
      web_totalPrice:totalPrice.toFixed(2),
      /*web_paidPrice:totalPrice.toFixed(2),*/
    });

  },

  intoPath(e){
    const self = this;
    api.pathTo(api.getDataSet(e,'path'),'nav');
  },

  changeBind(e){
    const self = this;
    api.fillChange(e,self,'submitData');
    console.log(self.data.submitData);
    self.setData({
      web_submitData:self.data.submitData,
    });  
  },
})

  