import {Api} from '../../utils/api.js';
var api = new Api();
const app = getApp();
import {Token} from '../../utils/token.js';
const token = new Token();



  Page({
    data: {
      todayData:[],
      artData:[],
      mainImg:[],
      submitData:{


        passage1:'',
        passage2:'',
        type:2,

        mainImg:[]
      },
    

      is_hidden:true,

  },



  
  onLoad(options){
    const self = this;
    self.data.id = options.id;
    self.data.paginate = api.cloneForm(getApp().globalData.paginate);
    self.setData({
      web_submitData:self.data.submitData,
      web_imgData:self.data.submitData.mainImg
    });
    self.getNowFormatDate();
    self.articleGet()
  },


  getNowFormatDate() {
    const self = this;
    var date = new Date();
    var seperator1 = "-";
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var strDate = date.getDate();
    if (month >= 1 && month <= 9) {
        month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
    }
    var currentdate = year + seperator1 + month + seperator1 + strDate;
    self.data.submitData.passage2 =  currentdate.split('-')
    self.setData({
      web_submitData:self.data.submitData
    })
  },

  bindDateChange: function(e) {
    const self = this;
    console.log('picker发送选择改变，携带值为', e.detail.value);
    self.data.submitData.passage2 = e.detail.value.split("-");
    console.log(self.data.submitData.passage2)
    self.setData({
      web_submitData:self.data.submitData
    })
    new Date(self.data.submitData.passage2.join("-")).getTime();
  },

   articleGet(){
    const self = this;
    const postData = {};
    postData.searchItem = {
    	id:self.data.id
    };
    const callback = (res)=>{
      if(res.info.data.length>0){
        self.data.artData = res.info.data[0]
      }else{
      	api.showToast("数据错误",'none')
      };
      self.setData({
      	web_artData:self.data.artData
      })
    };
    api.articleGet(postData,callback);
  },

 



  messageAdd(){
    const self = this;
    wx.showLoading();
    const postData = {};
    postData.token = wx.getStorageSync('token');
    postData.data = {


        passage1:self.data.submitData.passage1,
        passage2:new Date(self.data.submitData.passage2.join("-")).getTime(),
        passage3:wx.getStorageSync('info').passage1,  
        type:2,
        user_no:wx.getStorageSync('info').user_no,
        mainImg:self.data.submitData.mainImg,
        relation_id:self.data.id 
    };
    console.log(postData)
    const callback = (data)=>{  
      if(data.solely_code == 100000){
        api.showToast('认证成功','fail');
        setTimeout(function(){
			wx.navigateBack({
				delta:1
			})
	    }, 1000)
      }else{
        api.showToast('认证失败','fail');
      };
    };
    api.messageAdd(postData,callback);  
  },


  submit(){
    const self = this;
    const pass = api.checkComplete(self.data.submitData);
    if(pass){
        wx.showLoading();
        self.messageAdd(); 
    }else{
      api.showToast('请补全信息','fail');
    };
  },




  changeBind(e){
    const self = this;
    if(api.getDataSet(e,'value')){
      self.data.submitData[api.getDataSet(e,'key')] = api.getDataSet(e,'value');
    }else{
      api.fillChange(e,self,'submitData');
    };
    self.setData({
      web_submitData:self.data.submitData,
    }); 
    console.log(self.data.submitData)
  },





  upLoadImg: function (){
    var self = this;
    if(self.data.submitData.mainImg.length>2){
      api.showToast('仅限3张','fail');
      return;
    };
    wx.showLoading({
      mask: true,
      title: '图片上传中',
    });

    wx.chooseImage({
      count:1,
      success: function(res) {
        console.log(res);
        var tempFilePaths = res.tempFilePaths
        
        wx.uploadFile({
          url: 'https://ssl.qljyz.com/api/public/index.php/api/v1/Base/FtpImage/upload ',
          filePath:tempFilePaths[0],
          name: 'file',
          formData: {
            token:wx.getStorageSync('token')
          },
          success: function(res){
            res = JSON.parse(res.data);
            self.data.submitData.mainImg.push({url:res.info.url})
            self.setData({
              web_submitData:self.data.submitData
            });
            wx.hideLoading()

          },
          fail: function(err){
            wx.hideLoading();
            api.showToast('上传失败','fail')
          }
        })
      },
      fail: function(err){
        wx.hideLoading();
      }
    })
  },

  hide:function(e) {
     this.setData({
      is_hidden:false
     }) 
  },
  show:function(e) {
     this.setData({
      is_hidden:true
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

  