var router = require('koa-router')();

// var DataService = require('../rpc/botdataservice');
// var Config = require('../common/config');
// var Log = require('../common/log');

function* renderPage(tplName, context, pageId, needCheckBotStatus){
	var renderData = {
		userName: 'hi,' + context.databox.nickName,
		userIcon: context.databox.userIcon,
		isAuthed: true,
		curPageId: pageId
	};

	// if (needCheckBotStatus) {
	// 	let botId = context.query.bid;
	// 	let canEdit = true;	// 默认为可编辑状态
	// 	if (botId) {
	// 		let result = yield DataService.Bot.get(context.databox.uin, botId);
	// 		if (result.code == 0) {
	// 			canEdit = Config.BotForbidEditStatusList.indexOf(result.data.botInfo.status) == -1;
	// 		} else {
	// 			Log.error(context.databox.uin, 'renderPage DataService.Bot.get error', result.code);
	// 		}
	// 	}
	// 	renderData.forbidEdit = !canEdit;
	// }

	yield context.render(tplName, renderData);
}

router.get('/', function*(next){
	yield this.render('index');
});

router.get('/map', function*(next) {
	yield this.render('map');
});

module.exports = router;