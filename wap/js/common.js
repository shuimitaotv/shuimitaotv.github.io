function gotoUrl(url){
	location.href=url;
}
function selectAllCheckbox(selector){
	$(selector).prop("checked",true);
}
function unselectAllCheckbox(selector){
	$(selector).prop("checked",false);
}
function reselectAllCheckbox(selector){
	$(selector).each(function(){
		if($(this).prop("checked")){
			$(this).prop("checked",false);
		}else{
			$(this).prop("checked",true);
		}
	});
}
var _hasAppendCurrentPageNumber = false;
function gotoPage(page){
	var searchForm = $("#searchForm");
	if(!_hasAppendCurrentPageNumber){
		searchForm.append('<input type="hidden" name="currentPageNumber" id="currentPageNumber"/>');
	}
	_hasAppendCurrentPageNumber = true;
	$("#currentPageNumber").val(page);
	searchForm.submit();
}

function zoom_image(obj) {
    if (obj.hasClass('photoBox')) {
        var load = obj.find('.loadingBox');
        load.show();
        var img = obj.next().find('img');
        if (img.attr('src') == 'about:blank') {
            img.attr('src', obj.find('img').attr('src').replace('m.', 'l.'));
            img.load(function() {
                obj.hide();
                obj.next().show();
            });
        } else {
            obj.hide();
            obj.next().show();
        }
    } else {
        obj.hide();
        obj.prev().show();
        obj.prev().find('.loadingBox').hide();
    }
}

var _showTipDialogContainerInfoIndex = 0;
function showTipDialogContainerInfoForever(info){
	$("#tipDialogContainerInfo").html(info);
	$("#tipDialogContainer").show();
}
function showTipDialogContainerInfo(info){
	window.clearTimeout(_showTipDialogContainerInfoIndex);
	showTipDialogContainerInfoForever(info);
	_showTipDialogContainerInfoIndex = window.setTimeout(function(){
		hideTipDialogContainerInfo();
	}, 2000);
}
function hideTipDialogContainerInfo(){
	$("#tipDialogContainer").hide();
}

var _isLoadMoreTopicList = false;
var _loadMoreTopicPage = 1;
var _doLoadMoreTopicListIndex = 0;
function loadMoreTopicList(){
	if(_isLoadMoreTopicList){
		return false;
	}
	var clientHeight = $(window).height();
	var documentHeight = $(document.body).height();
	var offsetHeight = $(window).scrollTop();
	var canScrollHeight = documentHeight - clientHeight - offsetHeight;
	if(canScrollHeight<500){
		_loadMoreTopicPage++;
		doLoadMoreTopicList();
	}
}
var _hasLoadTopicIds = "";
var _loadTopicPageSize = 20;
var _hasLoadTopicPageSize = _loadTopicPageSize;
function doLoadMoreTopicList(){
	_isLoadMoreTopicList = true;
	if(_hasLoadTopicPageSize<_loadTopicPageSize){
		showTipDialogContainerInfo("没有更多贴子了");
		return false;
	}
	_doLoadMoreTopicListIndex = window.setTimeout(function(){
		doLoadMoreTopicList();
	}, 60000);
	showTipDialogContainerInfoForever("玩命加载中");
	$.getJSON(_loadMoreTopicListBaseUrl+"/"+_loadMoreTopicPage+".html",{"pageSize":_loadTopicPageSize,"r":Math.random()},function(data){
		window.clearTimeout(_doLoadMoreTopicListIndex);
		if(data.errorCode==1){
			showTipDialogContainerInfo("没有更多贴子了");
		}else{
			var list = data.list;
			var html = '';
			_hasLoadTopicPageSize = 0;
			for(var index in list){
				_hasLoadTopicPageSize++;
				var obj = list[index];
				var topicId = "_"+obj.topicId+"_";
				if(_hasLoadTopicIds.indexOf(topicId)==-1){
					_hasLoadTopicIds += topicId;
					html += getLoadMoreTopicHtml(obj);
				}
			}
			if(html!=''){
				$("#topicListContainer").append(html);
				loadMoreTopicListAfter();
			}
			hideTipDialogContainerInfo();
			_isLoadMoreTopicList = false;
		}
	});
}

function doSearch(){
	if($("#searchKeyword").val()==""){
		showTipDialogContainerInfo("请输入关键字");
		return false;
	}
	$("#searchForm").submit();
}

function doLogin(){
	$("#doLoginBtn").hide();
	$("#doLoginingBtn").show();
	$.post(_userContextPath+"/doLogin.html",{"account":$("#loginAccount").val(),"newPwd":$("#loginNewPwd").val(),"securityCode":$("#loginSecurityCode").val(),"r":Math.random()},function(data){
		$("#doLoginBtn").show();
		$("#doLoginingBtn").hide();
		data = $.parseJSON(data);
		$("#loginSecurityCodeImg").trigger("click");
		$("#loginSecurityCode").val("");
		if(data.errorCode==1){
			showTipDialogContainerInfo(data.msg);
			return ;
		}else{
			showTipDialogContainerInfo("登录成功");
			window.setTimeout(function(){gotoUrl(_userContextPath+"/User_index.htm");}, 1000);
		}
	});
}
function doRegister(){
	$("#doRegisterBtn").hide();
	$("#doRegisteringBtn").show();
	$.post(_userContextPath+"/doRegister.html",{"account":$("#registerAccount").val(),"newPwd":$("#registerNewPwd").val(),"confirmPwd":$("#registerConfirmPwd").val(),"securityCode":$("#registerSecurityCode").val(),"r":Math.random()},function(data){
		$("#doRegisterBtn").show();
		$("#doRegisteringBtn").hide();
		data = $.parseJSON(data);
		$("#registerSecurityCodeImg").trigger("click");
		$("#registerSecurityCode").val("");
		if(data.errorCode==1){
			showTipDialogContainerInfo(data.msg);
			return ;
		}else{
			showTipDialogContainerInfo("注册成功");
			window.setTimeout(function(){gotoUrl(_userContextPath+"/User_index.htm");}, 1000);
		}
	});
}

var _selectYearDialogYear = 0;
var _selectYearDialogYearDefault = 0;
function showSelectYearDialog(){
	_selectYearDialogYear = parseInt($("#selectYearDialogYear").data("year"));
	if(_selectYearDialogYearDefault==0){
		_selectYearDialogYearDefault = _selectYearDialogYear;
	}
	$(".selectYearDialog").show();
}
function selectYearDialogYearUp(){
	var currentYear = parseInt(new Date().getFullYear());
	if(_selectYearDialogYear<currentYear){
		_selectYearDialogYear++;
	}
	$("#selectYearDialogYear").data("year",_selectYearDialogYear);
	$("#selectYearDialogYear").val(_selectYearDialogYear+"年");
}
function selectYearDialogYearDown(){
	var minYear = 1976;
	if(_selectYearDialogYear>minYear){
		_selectYearDialogYear--;
	}
	$("#selectYearDialogYear").data("year",_selectYearDialogYear);
	$("#selectYearDialogYear").val(_selectYearDialogYear+"年");
}
function selectYearDiaologConfirm(){
	if(_selectYearDialogYear!=_selectYearDialogYearDefault){
		location.href = _kjContextPath+"/"+_selectYearDialogYear+".html";
	}else{
		$(".selectYearDialog").hide();
	}
}

jQuery.fn.highlight = function(pat) {
	if(!pat)return;
	function innerHighlight(node, pat)
	{
		var skip = 0;
		if (node.nodeType == 3)
		{
			var pos = node.data.toUpperCase().indexOf(pat);
			if (pos >= 0)
			{
				var spannode = document.createElement('span');
				spannode.className = 'highlight';
				var middlebit = node.splitText(pos);
				var endbit = middlebit.splitText(pat.length);
				var middleclone = middlebit.cloneNode(true);
				spannode.appendChild(middleclone);
				middlebit.parentNode.replaceChild(spannode, middlebit);
				skip = 1;
			}
		}
		else if (node.nodeType == 1 && node.childNodes && !/(script|style)/i.test(node.tagName))
		{
			for (var i = 0; i < node.childNodes.length; ++i)
			{
				i += innerHighlight(node.childNodes[i], pat);
			}
		}
		return skip;
	}

	return this.each(function() {
		innerHighlight(this, pat.toUpperCase());
	});
};
