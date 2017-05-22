require('../../UI/css/list.css');

var $ = require('jquery');
require('../libs/select.js');
require('../libs/jqPaginator.js');
var Util = require('../libs/util');
var ListModal = require('../modals/list');
// var listContainer = $('.jlistcontainer');
// var editContainer = $('.jeditcontainer');
// var emptyContainer = $('.jemptyquick');
var Common = require('../common/common');

var XTemplate = require('xtemplate/lib/runtime');
var xTemplate = require('xtemplate');
// var qtListTpl = require('../../tpl/main/map.xtpl');

function init() {

	// 初始化导航

	var SelectedConfig = function() {
		return {
			init: function(params) {  // 初始化样式
				$(params).selectMatch({prefix: 'ui-'});
			},
			bindClick: function(params) { // 绑定li事件
				if($(params).attr('disabled') || $(params).hasClass('disabled')) {
					return false;
				}
				var text = $(params).text();
				$(params).addClass('selected').siblings().removeClass('selected');
				$(params).closest('div.ui-select').removeClass('active').find('a .ui-select-text').text(text);
			}
		}
	}();

	Common.initSideBar();
	SelectedConfig.init($(".select"));

	$('.select .ui-select-datalist-li').on('click', function() {
		SelectedConfig.bindClick($(this));
	});

	$.jqPaginator('#jpagination',{
        totalPages: 10,
        visiblePages: 10,
        currentPage: 1,
        prev: '<li class="prev"><a href="javascript:;">上一页</a></li>',
        next: '<li class="next"><a href="javascript:;">下一页</a></li>',
        page: '<li class="page"><a href="javascript:;">{{page}}</a></li>',
        onPageChange: function (num, type) {
           	
        }
    });

    
}

init();
