var router = require('koa-router')();

function* renderPage(tplName, context, pageId, needCheckBotStatus){
	var renderData = {
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
	yield renderPage('index',this, 1, true);
});

router.get('/index', function*(next){
	yield renderPage('index',this, 1, true);
});

router.get('/map', function*(next) {
	yield renderPage('map',this, 2, true);
});

router.get('/list', function*(next) {
	yield renderPage('list',this, 3, true);
});

router.get('/detail', function*(next) {
	yield renderPage('detail',this, 8, true);
});

module.exports = router;