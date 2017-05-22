require('../../UI/css/detail.css');

var $ = require('jquery');

var Util = require('../libs/util');
var QuickTypeModal = require('../modals/map');
var EntityModal = require('../modals/map');
// var listContainer = $('.jlistcontainer');
// var editContainer = $('.jeditcontainer');
// var emptyContainer = $('.jemptyquick');
var Common = require('../common/common');

var XTemplate = require('xtemplate/lib/runtime');
var xTemplate = require('xtemplate');
// var qtListTpl = require('../../tpl/main/map.xtpl');

function init() {

	// 导航栏初始化
	Common.initSideBar();

	BaiduMap();
}

function BaiduMap() {
    var map = new BMap.Map("detail-map"); // 创建地图实例 
    var point = new BMap.Point(126.646749,45.729233); // 创建点坐标 
    map.centerAndZoom(point, 17); // 初始化地图，设置中心点坐标和地图级别 

    map.addControl(new BMap.MapTypeControl());//添加地形控制器
    map.enableScrollWheelZoom();//设置鼠标滚轮缩放为启用
    var p = new BMap.Point(126.64633,45.729885);var mkr=new BMap.Marker(p);
    map.addOverlay(mkr);
}

init();
