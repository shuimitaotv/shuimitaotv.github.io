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