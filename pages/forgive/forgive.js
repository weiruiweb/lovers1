import {Api} from '../../utils/api.js';
var api = new Api();
const app = getApp();


Page({
  data: {
    is_show:false,
    is_show2:false,
    is_show3:false,
    percent:0,
    rotate:0,
  },
  onLoad(options) {
    const self = this;
    var num = 0;
    var t = setInterval(function(){
      num++;
      var rotateNum = num * 4.4;
      var style= '-webkit-transform:rotate('+rotateNum+'deg);transform:rotate('+rotateNum+'deg);';
      self.setData({
          percent:num,
          rotate:style,
       })
      
      if(num==75){
          clearInterval(t);
        }      
      },60);
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

  