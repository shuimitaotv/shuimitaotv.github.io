String.prototype.getParameter = function(key) {
  var re = new RegExp(key + '=([^&]*)(?:&)?')
  return this.match(re) && this.match(re)[1]
}

var apiurl = "/api.php"
var data   = {page:1,uid:'',token:'',fr:''}

var storage = window.localStorage
var pram = location.href
var loading = false
var gid = localStorage.getItem('gid');
if(!gid){
  var d = new Date()
  var gid = d.getTime()+Math.floor(Math.random()*(99999)+10000)
  localStorage.setItem('gid',gid)
}
data.appid = 102;
data.gid = gid
data.uid = storage.getItem("uid")
data.token = storage.getItem("token")

if(data.fr = pram.getParameter('fr')){
  storage.setItem('fr',data.fr)
}else{
  data.fr = storage.getItem('fr');
}

$('.content').css('margin-bottom','50px')

function checkCode(ret){
  if(ret.code==1003){
    $.alert(ret.msg,function() {
      storage.removeItem('uid')
      storage.removeItem('token')
      location.href = login_url()
    })
  }

  if(ret.code == 0){
    $.alert(ret.msg,function() {
    })
    return false
  }
}

function loadComments(itemid=0,page=1){
  if(itemid==0 && page==1){
    loadIndexComments()
    return false
  }
  data.itemid = itemid
  data.page = page;
  $.post(apiurl + '?a=comments',data,function(ret){
    if(ret.code = 1) $("#infoTpl").tmpl(ret).appendTo(".cgi-pl")
  })
}

function loadIndexComments(){
  var d = new Date()
  data.r = d.getTime()+Math.floor(Math.random()*(99999)+10000)
  $.get('/indexComments.json',data,function(ret){
    if(ret.code = 1) $("#infoTpl").tmpl(ret).appendTo(".cgi-pl")
  })
}

function saveTopicReply() {
  data.content = $('#topicReplyContent').val()
  data.tid = $('#commentReplyCommentId').val()
  data.attr = uploadListed.join('|')
  if(!data.content) return $.alert('璇勮鍐呭涓嶈兘灏戜簬5涓瓧')
  data.itemid = jy.id;
  $.post(apiurl + '?a=add_comment',data,function(ret){
    if(ret.code != 1) return checkCode(ret)
    $.alert(ret.msg,function() {
      window.location.reload(true)
    })
  })
}

function zan(type,typeid) {
  data.type = type
  data.typeid = typeid
  $.post(apiurl + '?a=zan',data,function(ret){
    if(ret.code != 1) return checkCode(ret)
    $('#zan'+typeid+' label').html($('#zan'+typeid).data('v')+ret.data)
    $('#zan'+typeid).addClass('hover')
    $.alert(ret.msg)
  })
}
function cai(type,typeid) {
  data.type = type
  data.typeid = typeid
  $.post(apiurl + '?a=cai',data,function(ret){
    if(ret.code != 1) return checkCode(ret)
      $('#cai'+typeid+' label').html($('#cai'+typeid).data('v')+ret.data)
      $('#cai'+typeid).addClass('hover')
      $.alert(ret.msg)
  })
}
function login_url() {
  var url = '/user/login.html'
  return url + "?callback=" +encodeURI(window.location.href) +"&fr=" + data.fr+"&gid="+data.gid
}

function share_url() {
  return encodeURI(window.location.href) +"?fr=" + data.fr
}

function logout() {
  $.post(apiurl + '?a=logout',data,function(ret){
    if(ret.code != 1) return checkCode(ret)
    $.alert(ret.msg,function() {
      storage.removeItem('uid')
      storage.removeItem('token')
      location.href = '/'
    })
  })
}

function checkin() {
  $.post(apiurl + '?a=checkin',data,function(ret){
    if(ret.code != 1) return checkCode(ret)
    $.alert(ret.msg)
  })
}

function commentReply(id, username) {
  $("#commentReplyCommentId").val(id);
  if (data.uid > 0) {
    $("#topicReplyContent").focus();
    if ($("#replyNameBox").length > 0) {
      $("#replyNameBox .reply-name span").html("@" + username);
      $("#replyNameBox").show();
      var w1 = $("#comment_add .quick-txt").width(), w2 = $(".reply-name").width()
      $("#topicReplyContent").width(w1 - w2 - 22)
    }
  } else {
    $.alert("璇风櫥褰曞悗鎿嶄綔",function() {
      location.href = login_url()
    })
  }
}

function commentReplyClear() {
  $("#commentReplyCommentId").val("0");
  $("#replyNameBox").hide();
  $("#topicReplyContent").width("100%")
}

function getDateTimeStamp(dateStr){
 return Date.parse(dateStr.replace(/-/gi,"/"));
}

function setIframeHeight(iframe) {
  if (iframe) {
    var iframeWin = iframe.contentWindow || iframe.contentDocument.parentWindow;
    if (iframeWin.document.body) {
    iframe.height = iframeWin.document.documentElement.scrollHeight || iframeWin.document.body.scrollHeight;
    }
  }
}

function kai(){
  $('.cgi-pl-quick').css('bottom','60px')
  $('.cgi-foot-links').show()
  $('#bar .kai').hide()
  $('#bar .guan').show()
}

function guan(){
  $('.cgi-pl-quick').css('bottom','-52px')
  $('.cgi-foot-links').hide()
  $('#bar .kai').show()
  $('#bar .guan').hide()
  _czc.push(["_trackEvent","棣栭〉","鍏抽棴"]);
}

var pl = '<div class="cgi-foot-links">'+
    '<ul class="clearfix">'+
    '<li><a id="fixedNavIndex" href="/" class="hover"><span class="cfl1"></span>棣栭〉</a></li>'+
    '<li><a id="fixedNavKjZl" target="_blank" href="https://41146.com/user/year.html"><span class="list"></span>璁板綍</a></li>'+
    '<li class="cfl-more"><a id="fixedNavKjZl" onclick="siteToggle()">鏇村</a></li>'+
    '<li><a id="fixedNavKjZs" target="_blank" href="/html/wx.html"><span class="wechat"></span>寰俊</a></li>'+
    '<li><a id="fixedNavTk" target="_blank" href="https://87904.com/"><span class="bag"></span>鎶㈢孩鍖�</a></li></ul></div>'+
    '<div class="cgi-pl-quick"><div id="bar"><div class="kai" style="display:none" onclick="kai()">灞曞紑 鈬� </div><div class="guan" onclick="guan()">鏀惰捣 鈬� </div></div>'+
    '<div class="quick-box" id="login" style="display: none">'+
    '<input type="hidden" id="commentReplyCommentId" name="commentId" value="0" />'+
    '<span class="quick-txt">鐧诲綍鍚庢墠鑳借繘琛屽揩閫熻瘎璁哄摝锛�</span>'+
    '<a href="/user/login.html?callback=/" class="quick-btn" style="text-align:center;width:65px">鐧婚檰</a>'+
    '</div><div class="quick-box" id="comment_add" >'+
    '<span class="quick-txt" style="margin-right:140px">'+
    '    <span id="replyNameBox" style="display:none"><span class="reply-name"><span></span><a href="javascript:void(0);" onclick="commentReplyClear(\'\', \'\')">x</a></span></span>'+
    '    <input placeholder="璇疯緭鍏ヨ瘎璁哄唴瀹癸紒" id="topicReplyContent" name="content" type="text">'+
    '</span>'+
    '<span class="quick-img" style="float: right;width: 40px;height:30px;position: absolute;top: 0;right: 70px;background: url(https://884695.com/assets/img/img.png) no-repeat;background-size: 35px 30px;">'+
    '    <input id="uploaderInput" class="weui-uploader__input" type="file" accept="image/*" multiple="" style="width: 35px;height: 30px;">'+
    '</span>'+
    '<span id="emotion" style="float: right;width: 30px;height:30px;position: absolute;top: 3px;right: 109px;background: url(https://884695.com/assets/img/face.png) no-repeat;background-size: 26px 26px;">'+
    '</span>'+
    '<input class="quick-btn" type="button" style="width: 60px" value="璇勮" id="saveTopicReplyBtn" onclick="saveTopicReply();">'+
    '<input class="quick-btn" type="button" value="鎻愪氦涓�..." id="savingTopicReplyBtn" style="display: none;"></div></div>';

var sites = '<div id="allsite"><ul class="clearfix">'+
  '<li><a target="_blank" href="https://615322.com/#鐩堝僵缃�">閾佺畻鐩樼綉</a></li>'+
  '<li><a target="_blank" href="https://617322.com/#鐩堝僵缃�">鐜嬩腑鐜嬬綉</a></li>'+
  '<li><a target="_blank" href="https://025125.com/#鐩堝僵缃�">璇歌憶浜綉</a></li>'+
  '<li><a target="_blank" href="https://613522.com/#鐩堝僵缃�">绠″濠嗙綉</a></li>'+
  '<li><a target="_blank" href="https://351922.com/#鐩堝僵缃�">澶╀笅褰╃綉</a></li>'+
  '<li><a target="_blank" href="https://619733.com/#鐩堝僵缃�">澶т赴鏀剁綉</a></li>'+
  '<li><a target="_blank" href="https://621922.com/#鐩堝僵缃�">瀹嬪皬瀹濈綉</a></li>'+
  '<li><a target="_blank" href="https://627522.com/#鐩堝僵缃�">闈掕嫻鏋滅綉</a></li>'+
  '<li><a target="_blank" href="https://619722.com/#鐩堝僵缃�">澶ц耽瀹剁綉</a></li>'+
  '<li><a target="_blank" href="https://619322.com/#鐩堝僵缃�">鍏悎涔嬪</a></li>'+
  '<li><a target="_blank" href="https://616311.com/#鐩堝僵缃�">鐧藉皬濮愮綉</a></li>'+
  '<li><a target="_blank" href="https://615733.com/#鐩堝僵缃�">鍏悎绀惧尯</a></li>'+
  '<li><a target="_blank" href="https://328611.com/#鐩堝僵缃�">灏忛奔鍎跨綉</a></li>'+
  '<li><a target="_blank" href="https://685322.com/#鐩堝僵缃�">鍑ゅ嚢璁哄潧</a></li>'+
  '<li><a target="_blank" href="https://329622.com/#鐩堝僵缃�">閲戞槑涓栧</a></li>'+
  '<li><a target="_blank" href="https://687133.com/#鐩堝僵缃�">澶уご瀹剁綉</a></li>'+
  '<li><a target="_blank" href="https://329711.com/#鐩堝僵缃�">绠″濠嗙綉</a></li>'+
  '<li><a target="_blank" href="https://687922.com/#鐩堝僵缃�">閲戝厜浣涚綉</a></li>'+
  '<li><a target="_blank" href="https://329722.com/#鐩堝僵缃�">棣欐腐鎸傜墝</a></li>'+
  '<li><a target="_blank" href="https://884742.com/#鐩堝僵缃�">椹笁鐐綉</a></li>'+
  '<li><a target="_blank" href="https://351622.com/#鐩堝僵缃�">鑰佸浜虹綉</a></li>'+
  '<li><a target="_blank" href="https://689522.com/#鐩堝僵缃�">鍒涘瘜璁哄潧</a></li>'+
  '<li><a target="_blank" href="https://351744.com/#鐩堝僵缃�">蹇呯櫦蹇冩按</a></li>'+
  '<li><a target="_blank" href="https://695633.com/#鐩堝僵缃�">鍏悎瀹濆吀</a></li>'+
  '<li><a target="_blank" href="https://315322.com/#鐩堝僵缃�">褰╅湼鐜嬬綉</a></li>'+
  '<li><a target="_blank" href="https://313711.com/#鐩堝僵缃�">鍏夊ご寮虹綉</a></li>'+
  '<li><a target="_blank" href="https://351722.com/#鐩堝僵缃�">鎸傜墝璁哄潧</a></li>'+
  '<li><a target="_blank" href="https://315922.com/#鐩堝僵缃�">璧涢┈浼氱綉</a></li>'+
  '<li><a target="_blank" href="https://327922.com/#鐩堝僵缃�">澶╅┈蹇冩按</a></li>'+
  '<li><a target="_blank" href="https://316522.com/#鐩堝僵缃�">濂囬棬閬佺敳</a></li>'+
  '<li><a target="_blank" href="https://884695.com/#鐩堝僵缃�">鍏悎璐㈢</a></li>'+
  '<li><a target="_blank" href="https://317211.com/#鐩堝僵缃�">鍏悎澶存潯</a></li>'+
  '<li><a target="_blank" href="https://336986.com/#鐩堝僵缃�">涓€鐐圭孩缃�</a></li>'+
  '<li><a target="_blank" href="https://317522.com/#鐩堝僵缃�">椤跺皷楂樻墜</a></li>'+
  '<li><a target="_blank" href="https://326122.com/#鐩堝僵缃�">鐘跺厓绾㈢綉</a></li>'+
  '<li><a target="_blank" href="https://317822.com/#鐩堝僵缃�">鍏悎鎱堝杽</a></li>'+
  '<li><a target="_blank" href="https://409901.com/#鐩堝僵缃�">閲戝瀹濈綉</a> </li>'+
  '<li><a target="_blank" href="https://319711.com/#鐩堝僵缃�">涓滄柟璁哄潧</a></li>'+
  '<li><a target="_blank" href="https://325822.com/#鐩堝僵缃�">鐧藉璁哄潧</a></li>'+
  '<li><a target="_blank" href="https://336356.com/#鐩堝僵缃�">楝艰胺瀛愮綉</a></li>'+
  '<li><a target="_blank" href="https://325711.com/#鐩堝僵缃�">椹粡璁哄潧</a></li>'+
  '<li><a target="_blank" href="https://325122.com/#鐩堝僵缃�">褰╃エ璁哄潧</a></li>'+
  '<li><a target="_blank" href="https://676522.com/#鐩堝僵缃�">椹粡鍗︾綉</a></li>'+
  '<li><a target="_blank" href="https://628611.com/#鐩堝僵缃�">澶槼绁炵綉</a></li>'+
  '<li><a target="_blank" href="https://682311.com/#鐩堝僵缃�">涔濅簲鑷冲皧</a></li>'+
  '<li><a target="_blank" href="https://681911.com/#鐩堝僵缃�">鎵嬫満寮€濂�</a></li>'+
  '<li><a target="_blank" href="https://627822.com/#鐩堝僵缃�">闄堟暀鎺堢綉</a></li>'+
  '<li><a target="_blank" href="https://683722.com/#鐩堝僵缃�">鍏悎瀹濆吀</a></li>'+
  '<li><a target="_blank" href="https://638622.com/#鐩堝僵缃�">鐏灏戝コ</a></li>'+
  '<li><a target="_blank" href="https://675122.com/#鐩堝僵缃�">鍏悎绁炶瘽</a></li>'+
  '<li><a target="_blank" href="https://629511.com/#鐩堝僵缃�">澶ц瘽瑗挎父</a></li>'+
  '<li><a target="_blank" href="https://657322.com/#鐩堝僵缃�">鏅哄鏄熺綉</a></li>'+
  '<li><a target="_blank" href="https://675322.com/#鐩堝僵缃�">璧涢┈浼氱綉</a></li>'+
  '<li><a target="_blank" href="https://681922.com/#鐩堝僵缃�">鏇惧か浜虹綉</a></li>'+
  '<li><a target="_blank" href="https://884735.com/#鐩堝僵缃�">榛勫ぇ浠欑綉</a></li>'+
  '<li><a target="_blank" href="https://652633.com/#鐩堝僵缃�">寤ｆ澅鏈冪綉</a></li>'+
  '<li><a target="_blank" href="https://927719.com/#鐩堝僵缃�">鐧藉宸ヤ綔</a></li>'+
  '<li><a target="_blank" href="https://351822.com/#鐩堝僵缃�">鏈€蹇紑濂�</a></li>'+
  '<li><a target="_blank" href="https://352611.com/#鐩堝僵缃�">鐮佺帇鍥惧簱</a></li>'+
  '<li><a target="_blank" href="https://7811309.com/#鐩堝僵缃�">鐩堝僵缃戞姇</a></li>'+
  '</ul></div>'+
  '<a class="tzBtn" style="display:block" href="javascript:;" onclick="ycGoto()">鐩堝僵<br />鎶曟敞</a>'+
  '<span class="tzHide" style="display:block" onclick="tzHide()">x</span>'+
  '<a class="redbag" style="display:none" href="https://7811308.com/" target="_blank"><img src="https://884695.com/assets/img/redbag.gif" width="130px" /></a>'+
  '</div>';

function siteToggle() {
  _czc.push(["_trackEvent","棣栭〉","鏇村"]);
  $('#allsite').toggle();
}

function tzHide(){
	$('.tzHide').hide();$('.tzBtn').hide();$('.redbag').show()
}

function ycGoto(){
	var txtstr = ['7811309.com','7811308.com','7811307.com'];
	// var txtstr = ['83914.com','54617.com','54907.com','56874.com']
	var num=Math.floor(Math.random()*txtstr.length)
	var wxtxt=txtstr[num]
	window.open('https://'+wxtxt, '_blank')
}

var uploadCount = 0, uploadList = [],uploadListed = [];

$(document).ready(function() {
  $('.cgi-body').append(pl);
  if(data.uid){
    $('#comment_add').show()
    $('#login').hide()
    $('#emotion').qqFace({
      id : 'facebox', 
      assign:'topicReplyContent', 
      path:'https://884695.com/assets/wechat/'
    })
  }else{
    $('#login').show()
    $('#comment_add').hide()
  }
  $('.cgi-body').append(sites);
  
weui.uploader('#comment_add', {
  url: '/api.php?a=upload',
  auto: true,
  type: 'file',
  fileVal: 'img',
  compress: {
    width: 1600,
    height: 1600,
    quality: .8
  },
  onBeforeQueued: function(files) {
    if(["image/jpg", "image/jpeg", "image/png", "image/gif"].indexOf(this.type) < 0){
      alert('璇蜂笂浼犲浘鐗�');
      return false;
    }
    if(this.size > 10 * 1024 * 1024){
      alert('璇蜂笂浼犱笉瓒呰繃10M鐨勫浘鐗�');
      return false;
    }
    if (files.length > 5) { // 闃叉涓€涓嬪瓙閫変腑杩囧鏂囦欢
      alert('鏈€澶氬彧鑳戒笂浼�5寮犲浘鐗囷紝璇烽噸鏂伴€夋嫨');
      return false;
    }
    if (uploadCount + 1 > 3) {
      alert('鏈€澶氬彧鑳戒笂浼�3寮犲浘鐗�');
      return false;
    }
    ++uploadCount;
  },
  onQueued: function(){
    uploadList.push(this);
  },
  onBeforeSend: function(data, headers){
  },
  onProgress: function(procent){
  },
  onSuccess: function (ret) {
    $('.quick-img').css('background-image',"url('"+ret.data+"')")
    uploadListed[0] = ret.data
  },
  onError: function(err){
  }
})
  $('p').on('click','img.thumb',function(){$(this).css('width','100%').css('max-height','auto').removeClass('thumb').addClass('prew')})
  $('p').on('click','img.prew',function(){$(this).css('width','auto').css('max-height','130px').removeClass('prew').addClass('thumb')})
})