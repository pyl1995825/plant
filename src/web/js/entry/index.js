require('../../UI/css/index.css');
require('../../UI/css/common/slider.css');

var $ = require('jquery');

require('../libs/slider.js');
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
	$('.hiSlider').hiSlider();

    var map = new qq.maps.Map(document.querySelector('.map-wrap'), {
        // 地图的中心地理坐标。
        center: new qq.maps.LatLng(39.916527,116.397128)
    });
}

init();
