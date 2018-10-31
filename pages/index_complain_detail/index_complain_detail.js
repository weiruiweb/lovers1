import {Api} from '../../utils/api.js';
var api = new Api();
const app = getApp();


Page({
  data: {
    is_show:false,
    is_show2:false,
  },
  //事件处理函数
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
  onLoad(options) {
    const self = this;

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

  