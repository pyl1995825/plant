var $ = require('jquery');

var Util = require('../libs/util');

var pageUrlMap = {
	1: 'http://{%domain}/index',
	2: 'http://{%domain}/map',
	3: 'http://{%domain}/list',
	4: 'http://{%domain}/detail'
};

// 标记页面数据是否发生修改
var isDataChange = false;

function removeCookie(keyList) {
	!(keyList instanceof Array) && (keyList = [keyList]);
	var d = new Date();
	d.setTime(0);
	for (var i = 0, len = keyList.length; i < len; i++) {
		document.cookie = encodeURIComponent(keyList[i]) + '=' + encodeURIComponent(getCookie(keyList[i])) + '; path=/; domain=qq.com; expires=' + d.toGMTString();
	}
}

function getCookie(name) {
	var regx = new RegExp('(^|;|\\s+)' + name + '=(.*?)(;|$)'),
		cookieMatch = document.cookie.match(regx),
		r = cookieMatch && cookieMatch.length > 2 ? cookieMatch[2] : '';
	return decodeURIComponent(r);
}

var self = this;
exports.initSideBar = function(){
	$('.jnavbarlist [data-pid]').click(function(evt){
		evt.preventDefault();
		
		var pid = $(evt.currentTarget).attr('data-pid') - 0;
		
		location.href = pageUrlMap[pid];
	});

	$('.jpageheadbar .juser').bind('click', function(evt){
		self.showDialog({
			title: '提示',
			text: '确定要退出登录吗？',
			cancelText: '取消',
			confirmText: '确定',
			onConfirm: function(){
				removeCookie('skey');
				location.href = 'http://{%domain}';
			}
		});
	});

};



/**
 * 登录弹窗相关逻辑
 */

var loginCallback;

exports.showLogin = function(callback){
	var loginContainer = $('.jlogincontainer');

	var ifr = loginContainer.find('iframe');

// http://xui.ptlogin2.qq.com/cgi-bin/xlogin?appid=1600000640&style=32&s_url={%pageMainPathEncode}%2Fopen%2Fyyb%2Fservice_terminal%2Fhtml%2Fproxy.html&target=self
	
	ifr.attr('src', [
		'http://xui.ptlogin2.qq.com/cgi-bin/xlogin?appid=1600000640&style=32&target=self',
		's_url=' + encodeURIComponent('http://{%domain}/bot/proxy')
	].join('&'));

	loginContainer.removeClass('hidden');

	// 设置回调
	loginCallback = callback;
};

// 往全局暴露一个接口用于接收登录回调
window.__loginSuccess = function(){
	// console.log('login success');

	// alert('login callback success');

	$('.jlogincontainer').addClass('hidden');

	if (typeof(loginCallback) == 'function'){
		// console.log('login callback');

		loginCallback();
		loginCallback = null;
	}
};


/**
 * 页面弹窗
 */
exports.showDialog = function(params){
	var container = $('.jdialogcontainer');

	// title
	var titleNode = $('.jtitle', container);
	if (params.title) {
		titleNode.text(params.title);
	} else {
		titleNode.text('');
	}

	// text
	var textNode = $('.jtext', container);
	if (params.text) {
		textNode.text(params.text);
	} else {
		textNode.text('');
	}

	// close btn
	var btnClose = $('.jbtnclose', container);
	btnClose.unbind('click').bind('click', function(evt){
		container.addClass('hidden');
	});

	// cancel btn
	var btnCancel = $('.jbtncancel', container);
	if (params.cancelText) {
		btnCancel.text(params.cancelText).removeClass('hidden');
		btnCancel.unbind('click').bind('click', function(evt){
			container.addClass('hidden');
			params.onCancel && params.onCancel();
		});
	} else {
		btnCancel.addClass('hidden');
	}

	// confirm btn
	var btnConfirm = $('.jbtnconfirm', container);
	if (params.confirmText) {
		btnConfirm.text(params.confirmText).removeClass('hidden');
		btnConfirm.unbind('click').bind('click', function(evt){
			!params.forbidConfirmHide && container.addClass('hidden');
			params.onConfirm && params.onConfirm();
		});
	} else {
		btnConfirm.addClass('hidden');
	}

	container.removeClass('hidden');
};

/**
 * 表格行拖动
 */
exports.initDragRow = function(params){
	var container = params.container;

	var curDragRow;

	$(container).delegate('.jbtndrag', 'mousedown', function(evt){
		$(this).closest('.jdragrow').attr('draggable', true);
	}).delegate('.jbtndrag', 'mouseup', function(evt){
		$(this).closest('.jdragrow').removeAttr('draggable');
	}).delegate('.jdragrow', 'dragstart', function(evt){
		curDragRow = $(this);
	}).delegate('.jdragrow', 'dragend', function(evt){
		curDragRow = null;
	}).delegate('.jdragrow', 'dragenter', function(evt){
		evt.preventDefault();
	}).delegate('.jdragrow', 'dragleave', function(evt){
		evt.preventDefault();
	}).delegate('.jdragrow', 'drop', function(evt){
		if (curDragRow) {
			var curRow = $(this);
			var dragRowIndex = curDragRow.prevAll('.jrow').length;
			var curRowIndex = curRow.prevAll('.jrow').length;
			if (dragRowIndex < curRowIndex) { // 从上往下
				curRow.after(curDragRow);
			} else if (dragRowIndex > curRowIndex) { // 从下往上
				curRow.before(curDragRow);
			}
		}
	});
};

/**
 *  输入框通用输入限制逻辑
 */
exports.inputLimit = function(params){
	var container = params.container;

	container.delegate('input[data-limit="variable"]', 'keypress', function(evt){
		var text = $(this).val();
		var c = String.fromCharCode(evt.charCode);
		if (text == '') {
			if (c.match(/[a-zA-Z]/) == null) return false; // 字母开头
		} else {
			if (text.length >= 50) return false;			// 不能超过50字符
			if (c.match(/[a-zA-Z0-9_]/) == null) return false;	// 允许字母、数字、下划线
		}
	}).delegate('input[data-limit="variable"]', 'keydown', function(evt){
		if (evt.keyCode == 32 /*|| evt.keyCode == 229*/) return false;
	}).delegate('input[data-limit="variable"]', 'keyup', function(evt){
		// console.log('keyup', evt.keyCode);
		if ([37, 38, 39, 40].indexOf(evt.keyCode) == -1) { // 方向键忽略
			var text = $(this).val().replace(/[^0-9a-zA-z_]/g, '').replace(/^[0-9_]+/, '').slice(0, 50);
			$(this).val(text);
		}
	});
};

exports.inputLimitOnlyNumber = function(params) {
	var container = params.container;

	container.delegate('input[data-limit="number"]', 'keypress', function(evt){
		var text = $(this).val();
		var c = String.fromCharCode(evt.charCode);
		if (text == '') {
			if (c.match(/[0-9]/) == null) return false; // 数字开头
		} else {
			if (text.length >= 50) return false;			// 不能超过50字符
			if (c.match(/^[0-9]*[0-9][0-9]*$/) == null) return false;	// 允许正整数数字
		}
	}).delegate('input[data-limit="number"]', 'keydown', function(evt){
		if (evt.keyCode == 32 /*|| evt.keyCode == 229*/) return false;
	}).delegate('input[data-limit="number"]', 'keyup', function(evt){
		var text = $(this).val().replace(/[^0-9]/g, '').replace(/^[a-zA-z_]+/, '');
		$(this).val(text);
	});
}

/**
 * 禁止编辑状态
 */
exports.forbidEditStateList = [1/*审核中*/];


/**
 * 错误校验器
 */
exports.Validator = function(fieldConfig){
	
	/*
		fieldConfig = {
			fieldKey: {
				container: ..
				getValue: ..
				getErrType: ...
				error: ...
			}
		}
	*/

	return {
		check: function(field, callback){
			var conf = fieldConfig[field];
			if (conf) {
				// 获取输入
				var value = conf.getValue(conf);
				var valueList = conf.isMultiple ? value : [value];
				var container = conf.container;
				var inputerList = conf.inputer || $(container).find('.jinputer');

				var errTypeList = [];
				var leftCallback = inputerList.length;
				function setErrTypes(types){
					errTypeList = errTypeList.concat(types);
					--leftCallback;
					if (leftCallback == 0) {
						callback && callback(field, errTypeList);
					}
				}

				if (inputerList.length == 0) {
					callback && callback(field, []);
				}

				inputerList.each(function(index, inputer){
					value = valueList[index];
					inputer = $(inputer);

					// 检测错误类型
					conf.getErrType(value, function(errTypes){
						if (!errTypes) errTypes = [];
						if (typeof(errTypes) == 'string') errTypes = [errTypes];

						var tipsContainer = conf.getTipsContainer ? conf.getTipsContainer(inputer) : $(container).find('.jerrtips');
						// 清除错误提示
						inputer.removeClass('error');
						tipsContainer.addClass('hidden');

						// 展示错误输入标识
						errTypes.length > 0 && inputer.addClass('error');

						// 展示错误输入提示语
						var err = conf.error || {};
						var errTipsList = [];
						var noPrefix = false;
						for (var i = 0, tItem, tlen = errTypes.length; i < tlen; i++) {
							tItem = errTypes[i];

							if (err[tItem] && err[tItem].tips) {
								errTipsList.push(err[tItem].tips);
								err[tItem].noPrefix && (noPrefix = true);
							}
						}
						if (errTipsList.length > 0) {
							tipsContainer.text((!noPrefix && err.prefix || '') + errTipsList.join('、') + (err.postfix || ''));
							tipsContainer.removeClass('hidden');
						}

						// errTypeList = errTypeList.concat(errTypes);
						setErrTypes(errTypes);
					});
				});
				
				// callback && callback(field, errTypeList);
			}
		},
		checkAll: function(callback){
			var keys = Object.keys(fieldConfig);
			var result = {validate: true, errFields: [], errTypeMap: {}};
			var readyCount = 0;
			for (var i = 0, field; field = keys[i]; i++) {
				this.check(field, function(field, errTypeList){
					++readyCount;
					result.errTypeMap[field] = errTypeList;

					var isErr = false;
					for (var j = 0, jlen = errTypeList.length; j < jlen; j++) {
						if (errTypeList[j] != '') {
							isErr = true;
							break;
						}
					}

					if(isErr) {
						result.errFields.push(field);
						result.validate = false;
					}
					if (readyCount == keys.length) {
						callback && callback(result);
					}
				});
			}
		}
	};
};

exports.ValidatorRule = {
	Url: /^http(s)*:\/\/[\w-]+(\.[\w-]+)+(:\d+)?([\/?#][-\w%.!~*'()\/?&=#]*)?$/i
};

/**
 * 监控页面修改行为
 */
exports.monitorDataChange = function(){
	$(document.body).delegate('input,select,textarea', 'change', function(){
		// console.log('change');
		isDataChange = true;
	});

	window.onbeforeunload = function(){
		if (isDataChange) return '为了防止内容丢失，建议保存数据后再离开当前页面';
	};
};

exports.trigerDataChange = function(isChange){
	if (isChange === undefined) isDataChange = true;
	else {
		isDataChange = !!isChange;	
	}
	// console.log('isDataChange', isDataChange);
};

exports.Prefix = {
	Entity: '@',
	Card: '%',
	Quick: '#'
};

//
//	////// IE 下的一些fix逻辑统一放在这里
//

/**
 * IE下placeholder兼容处理
 */
exports.placeHolderInit = function(container){
	if (!('placeholder' in document.createElement('input'))) {
		$('input[placeholder], textarea[placeholder]', container).each(function(index, input){
			input = $(input);

			/*if (isReset) {
				var cloneInput = $(input).next('[data-clone]');
				if (cloneInput && cloneInput.length) {
					if ($(input).val().trim() !== '') {
						$(input).removeClass('hidden');
						$(cloneInput).addClass('hidden');
					}
				}
			} else {*/
				

			if (!input.attr('data-placeholder')) {
				input.attr('data-placeholder', 1);

				var holderText = input.attr('placeholder');
				
				var cloneInput = input.clone();
				cloneInput.attr('data-placeholder', 1).attr('data-clone', 1);
				cloneInput.removeAttr('placeholder');
				cloneInput.val('');

				var cloneInputClass = cloneInput.attr('class');
				if (cloneInputClass) {
					cloneInput.attr('class', cloneInputClass.replace(/\bj[\w]+\b/g, ''));
				}
					

				cloneInput.css('color', '#808080').val(holderText).addClass('hidden').attr('readonly', 'readonly');

				input.after(cloneInput);

				if (input.val() == '') {
					input.addClass('hidden');
					cloneInput.removeClass('hidden');
				}

				cloneInput.bind('focus', function(){
					cloneInput.addClass('hidden');
					input.removeClass('hidden');
					input.focus();
					// 手动触发下相关事件
					input.trigger('mousedown');
				});

				input.bind('change blur', function(){
					if ($(this).val().trim() == '') {
						$(this).addClass('hidden');
						cloneInput.removeClass('hidden');
					} else {
						$(this).removeClass('hidden');
						cloneInput.addClass('hidden');
					}
				});

			}
				
		});
	}
};

/**
 * IE下maxlength属性fix
 */
exports.maxLengthInit = function(container){
	if (!('maxLength' in document.createElement('textarea'))) {
		$(container).delegate('textarea[maxlength]', 'keydown', function(evt){
			var maxLength = $(this).attr('maxlength');

			if ($(this).val().length == maxLength && [8, 37, 38, 39, 40, 46].indexOf(evt.keyCode) == -1) {
				return false;
			}
		}).delegate('textarea[maxlength]', 'keyup', function(evt){
			var maxLength = $(this).attr('maxlength');

			if ($(this).val().length > maxLength) {
				$(this).val($(this).val().slice(0, maxLength));
			}
		});
	}
};

/**
 * IE下对部分监听输入框做下change触发fix
 */
if (document.all) {
	$(document.body).delegate('input', 'keydown', function(){
		if ($(this).attr('data-limit') && !$(this).attr('data-focus-init')) {
			$(this).attr('data-focus-init', 1);
			$(this).attr('data-focus-text', $(this).val());
			$(this).bind('focus', function(evt){
				$(this).attr('data-focus-text', $(this).val());
			});
			$(this).bind('blur', function(evt){
				var focusText = $(this).attr('data-focus-text');
				$(this).removeAttr('data-focus-text');
				if (focusText != $(this).val()){
					$(this).trigger('change');
				}
			});
		}
	});
}