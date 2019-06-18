import { taskList } from './models/taskList';
import express from "express";
import bodyParser from "body-parser";
import favicon from "serve-favicon";
import cookieParser from "cookie-parser";
import path from "path";
import createError from "http-errors";
import connectRedis from 'connect-redis';
import session from 'express-session';
import redisUtil from "./utils/redisUtil";

const RedisStore = connectRedis(session);
const redis_util = new redisUtil();

const app = express();

app.set("port", process.env.PORT || 3000);
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(session({
  name: 'taskServer',
  store: new RedisStore({
    client: redis_util.myCreateClient('sessionStore')
  }),
  secret: 'taskServer',
  resave: false,
  //rolling: false,
  saveUninitialized: false,
  // cookie: {maxAge: 3600000}
  cookie: { maxAge: 365 * 24 * 60 * 60 * 1000},
}))

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '../public')));
app.use(function (req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "*");
  res.setHeader('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Credentials','true');
  req.originalUrl = decodeURIComponent(req.originalUrl);
  next();
});

import routers from './routers';


app.use('/init', routers.init);
app.use('/taskUser', routers.taskUser);
app.use('/taskList', routers.taskList);


app.use((req, res, next) => {
  next(createError(404));
});

// error handler
app.use((err: any, req: any, res: any, next: any) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});



export default app;