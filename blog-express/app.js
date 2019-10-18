var createError = require('http-errors');
var express = require('express');
var path = require('path');
const fs =require('fs')
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const session = require('express-session')
const redisStore = require('connect-redis')(session)

//自定义路由
const blogRouter = require('./routes/blog')
const userRouter = require('./routes/user')

var app = express();

// // view engine setup, 这部分是前端的内容，本次开发忽略这部分
// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'jade');

//日志操作
const ENV = process.env.NODE_ENV
if (ENV !== 'production') {
  // 开发环境/测试环境
  app.use(logger('dev'));
} else {
  // 线上环境
  const logFileName = path.join(__dirname, 'logs/access.log')
  const writeStream = fs.createWriteStream(logFileName, {
    flags: 'a'
  })
  app.use(logger('combined', {
    stream: writeStream
  }));
}

//这两行代码是解析前端传入的数据的:json格式和x-www-form-urlencoded格式
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//处理cookie
app.use(cookieParser());

//处理session
const redisClient = require('./db/redis')
const sessionStore = new redisStore({
  client: redisClient
})
app.use(session({
  secret: 'WJiol_8776#', //密匙
  cookie: {
    // path: '/', //默认配置
    // httpOnly: true, //默认配置
    maxAge: 24 * 60 * 1000
  },
  store: sessionStore
}))

// //用来处理public静态文件的，相当于前端的内容，所以注释
// app.use(express.static(path.join(__dirname, 'public')));

// 注册路由
// //环境自带路由
// app.use('/', indexRouter);
// app.use('/users', usersRouter);

//自定义路由
app.use('/api/blog', blogRouter)
app.use('/api/user', userRouter)

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'dev' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
