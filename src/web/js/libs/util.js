var $ = require('jquery');

var Common = require('../common/common');

var observeQueue = {};

module.exports = {
	http: function(params){
		if (!params) throw new Error('util http params not found.');
		if (!params.url) throw new Error('util http params url not found.');

		var ajaxParams = {
			type: params.type || 'get',
			url: params.url,
			dataType: params.dataType || 'json',
			timeout: params.timeout || 10000,
			data: params.data,
			success: function(ret){
				if (ret && ret.code == -1001){ // 未登录
					Common.showLogin(function(){
						// location.reload(true); // 刷新不科学，只弹出弹窗吧
					});
				} else if (ret && ret.code == -1002){ // 未注册开发者（这里属于异常逻辑，直接跳出登录框）
					Common.showLogin(function(){
						location.reload(true);
					});
				} else {
					params.callback && params.callback(ret); // 透传返回参数
				}
			},
			error: function(ret){
				params.callback && params.callback({
					code: -9999,
					msg: 'ajax error',
					raw: ret
				});
			}
		};

		params.contentType && (ajaxParams.contentType = params.contentType);

		$.ajax(ajaxParams);
	},
	imgPing: (function(){
		var pingId = 0;
		return function(url, params, options) {
			var id = 'pingImg_' + (pingId++),
				tQueryString = [];
			window[id] = new Image();
			window[id].onload = function() {
				window[id] = window[id].onload = null;
				options && options.callback && options.callback({ret: 0});
			};
			window[id].onerror = function() {
				window[id] = window[id].onerror = null;
				options && options.callback && options.callback({ret: -1});
			};
			if (params) {
				try {
					for (var key in params) {
						tQueryString.push(encodeURIComponent(key) + '=' + encodeURIComponent(params[key]));
					}
				} catch (_) {}
				if (tQueryString.length) {
					url = url + (url.indexOf('?') > 0 ? '&' : '?') + tQueryString.join('&');
				}
			}
			window[id].src = url;
		};
	})(),
	getUrlParam: function(name) {
		var re = new RegExp('(?:\\?|#|&)' + name + '=([^&#?]*)(?:\\?|$|&|#)', 'i');
		var m = re.exec(window.location.href);
		try {
			m = m ? decodeURIComponent(m[1]) : '';
		} catch(_){
			m = '';
		}
		return m;
	},
	getSymbol: (function(){
		var id = 0;
		return function(){
			return ++id;
		};
	})(),
	observe: function(message, callback) {
		if (!observeQueue[message]) observeQueue[message] = [];
		observeQueue[message].push(callback);
	},
	triger: function(message){
		var callbackList = observeQueue[message] || [];

		for (var i = 0, callback; callback = callbackList[i]; i++) {
			callback && callback();
		}
	},
	htmlEncode: function(text){
		return $('<div>').text(text).html();
	},
	throttle: function(fn, threshold){
		threshold = threshold || 200;
		var last, timer;
		return function(){
			var context = this,
				args = arguments;
			var now = +new Date();
			if(last && now < last + threshold){
				clearTimeout(timer);
				timer = setTimeout(function(){
					last = now;
					fn && fn.apply(context, args);
				}, threshold);
			}else{
				last = now;
				fn && fn.apply(context, args);
			}
		}
	},
	asyncExec: function(callList, callback){
		var total = callList.length;
		var results = [];
		if (total == 0) callback(results);
		else {
			for (var i = 0, fun; fun = callList[i]; i++) {
				fun(function(resultList){
					results = results.concat(resultList);
					--total;
					if (total == 0) {
						callback(results);
					}
				});
			}
		}
	},
	getToken: function(str){

    	var hash = 5381;

    	for(var i = 0, len = str.length; i < len; ++i){

            hash += (hash << 5) + str.charCodeAt(i);

     	}

    	return hash & 0x7fffffff;

    }
};