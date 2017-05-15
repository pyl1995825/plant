var koa = require('koa');
var koaBody = require('koa-body');
var xtpl = require('xtpl/lib/koa');
// var auth = require('./auth/auth');
// var multer = require('./form_multipart/multer')
var router = require('./routers/index');
var dataRouter = require('./routers/data');
var favicon = require('koa-favicon');

var app = koa();

app.use(favicon(__dirname + '/public/favicon.ico'));

// app.use(auth);
// app.use(multer);
app.use(koaBody({urlencoded: true, patchKoa: true}));

xtpl(app, {views: __dirname + '/public/tpl'});

app.use(router.routes());
app.use(dataRouter.routes());



app.listen(process.env.PORT || 80, process.env.IP || '127.0.0.1');