/**
 * 机器人数据增删改查模块
 */
var UTIL = require('../libs/util');
var config = require('../common/config');
var prefix = config.modalPrefix;

module.exports = {
	getBotList: function(params){
		var data = params.data || {};

		UTIL.http({
			url: prefix + '/botlist',
			callback: function(ret){
				params.callback && params.callback(ret);
			}
		});
	},
	getBot: function(params){
		var data = params.data || {};

		UTIL.http({
			url: prefix + '/bot',
			data: {botId: data.botId},
			callback: params.callback
		});
	},
	addBot: function(params){
		var data = params.data || {};
		UTIL.http({
			type: 'post',
			url: prefix + '/addbot',
			contentType: 'application/json;charset=UTF-8',
			data: JSON.stringify(data),
			callback: params.callback
		});
	},
	delBot: function(params){
		var data = params.data || {};
		UTIL.http({
			type: 'post',
			url: prefix + '/delbot',
			data: data,
			callback: params.callback
		});
	},
	getBotCategory: function(params){
		var data = params.data || {};

		function formateList(list, item){
			var flist = item &&[item] || [];
			for (var i = 0, it; it = list[i]; i++) {
				flist.push({
					text: it.name,
					value: it.id
				});
			}
			return flist;
		}

		UTIL.http({
			url: prefix + '/botcategory',
			data: data,
			callback: function(ret){
				if (ret && ret.code == 0) {
					var dataList = ret.data && ret.data.list;
					var categoryList = formateList(dataList, {text: '请选择分类...', value: -1});
					var subCategoryMap = {'-1': {text: '请选择子分类...', value: -1}};

					for (var i = 0, item; item = dataList[i]; i++){
						subCategoryMap[item.id] = formateList(item.subCategories, {text: '请选择子分类...', value: -1});
					}

					params && params.callback({
						code: 0,
						data: {
							categoryList: categoryList,
							subCategoryMap: subCategoryMap
						}
					});
				}
			}
		});
	},
	updateBot: function(params){
		var data = params.data || {};
		UTIL.http({
			type: 'post',
			contentType: 'application/json;charset=UTF-8',
			url: prefix + '/updatebot',
			data: JSON.stringify(data),
			callback: params.callback
		});
	},
	submitBot: function(params){
		UTIL.http({
			url: prefix + '/verifybot',
			data: params.data,
			callback: params.callback
		});
	},
	checkName: function(params){
		UTIL.http({
			url: prefix + '/checkbotname',
			data: params.data,
			callback: params.callback
		});
	}
};