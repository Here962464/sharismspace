var app = getApp();
var resourceUrl = app.globalData.globalResourceUrl;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    scrollY: "",
    pageSize: 15,
    total: 0,
    baseline: false,
    fileList:[],
    folderList:[],
    userInfo:{}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var _this = this;
    var tempSize = this.data.pageSize;
    this.readyToLoad(tempSize);
    var tempUserInfo = {};
    wx.getUserInfo({
      success: function(res){
        console.log(res);
        tempUserInfo.avatarUrl = res.userInfo.avatarUrl;
        tempUserInfo.nickName = res.userInfo.nickName;
        _this.setData({
          userInfo: tempUserInfo
        })
      }
    })
  },
  // 默认加载
  readyToLoad: function (pageSize) {
    var _this = this;
    var map = {};
    //当前页号
    map['pageNum'] = 1;
    //每页显示的数据条数
    map['pageSize'] = 30;
    //父级目录id  如果是没有父级目录，而是刚进入文件模块的列表，就空着。
    //如果是进入某个文件夹，则填写该文件夹的id
    // map['parentId'] = "abcdefg";
    //是否是文件夹    1:新建文件夹  2：上传的文件
    //一般是文件和文件都查询，则空着，如果只查询文件或者只查询文件夹，就设置1或2
    // map['folder'] = 1;
    //文件类型  如果全查，则空着
    // map['fileTypet'] = "zip";
    //文件分类   (之前商量的方案 不要分类)不写分类则全查
    //map['fileSort']="我的小程序";	
    //文件夹/文件权限（公开/隐藏） 不写则全查
    // map['privacySet'] = 1;
    //是否被删除 0 未删除  1删除  1用于回收站查询  不写默认全查
    // map['del'] = 0;
    //是否需要输入密码访问   1需要 0不需要  不写则全查
    // map['needPassword'] = 0;
    //列排序  按照时间降序 DESC  升序 ASC  不加默认按时间降序
    map['arrange'] = "DESC";
    var mapString = JSON.stringify(map).slice(1);
    var value = mapString.substr(0, mapString.length - 1);
    wx.request({
      url: resourceUrl + 'wx_resource/ResourceList?value=' + value,
      success: function (res) {
        console.log(res.data.value.list);
        var tempFolderList = [];
        var temFileFolder = [];
        var tempResArray = res.data.value.list;
        for (var i = 0; i < tempResArray.length; i++){
          if (tempResArray[i].folder == 1){
            tempResArray[i]["imgUrl"] = "../../../../icon/folder.png";
            tempFolderList.push(tempResArray[i]);
          } else{
            var filter = tempResArray[i].fileName;
            // 正则匹配
            var pattTxt = /^.*txt$/;
            var pattDocx = /^.*docx$/;
            var pattHtml = /^.*html$/;
            var pattPdf = /^.*pdf$/;
            var pattJs = /^.*js$/;
            var pattZip = /^.*zip$/;
            // console.log(filter.match(patt1));
            if (filter.match(pattTxt)){
              tempResArray[i]["imgUrl"] = "../../../../icon/txt.png";
              tempFolderList.push(tempResArray[i]);
            } else if (filter.match(pattDocx)){
              tempResArray[i]["imgUrl"] = "../../../../icon/wordFile.png";
              tempFolderList.push(tempResArray[i]);
            } else if (filter.match(pattHtml)) {
              tempResArray[i]["imgUrl"] = "../../../../icon/html.png";
              tempFolderList.push(tempResArray[i]);
            } else if (filter.match(pattPdf)) {
              tempResArray[i]["imgUrl"] = "../../../../icon/PDF.png";
              tempFolderList.push(tempResArray[i]);
            } else if (filter.match(pattJs)) {
              tempResArray[i]["imgUrl"] = "../../../../icon/js.png";
              tempFolderList.push(tempResArray[i]);
            } else if (filter.match(pattZip)) {
              tempResArray[i]["imgUrl"] = "../../../../icon/zip.png";
              tempFolderList.push(tempResArray[i]);
            }
          }
        }
        console.log(tempFolderList);
        _this.setData({
          folderList: tempResArray
        })
      }
    })
  },
  // 判断边界值开始加载下一页
  startLoading: function (e) {
    console.log(e)
    var _this = this;
    var num = this.data.pageSize += 15;
    var upperLimit = this.data.total + 15;
    if (num < upperLimit) {
      this.readyToLoad(_this.data.pageSize);
    } else {
      _this.setData({
        baseline: true
      })
    }
  }
})