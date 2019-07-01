"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var morgan_1 = __importDefault(require("morgan"));
var body_parser_1 = __importDefault(require("body-parser"));
var cookie_parser_1 = __importDefault(require("cookie-parser"));
var path_1 = __importDefault(require("path"));
var http_errors_1 = __importDefault(require("http-errors"));
var connect_redis_1 = __importDefault(require("connect-redis"));
var express_session_1 = __importDefault(require("express-session"));
var redisUtil_1 = __importDefault(require("./utils/redisUtil"));
var permission_1 = require("./utils/permission");
var RedisStore = connect_redis_1.default(express_session_1.default);
var redis_util = new redisUtil_1.default();
var app = express_1.default();
app.set("port", process.env.PORT || 3000);
app.set("views", path_1.default.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(morgan_1.default('short')); // combined common dev short tiny
app.use(body_parser_1.default.json());
app.use(body_parser_1.default.urlencoded({ extended: true }));
app.use(express_session_1.default({
    name: 'taskServer',
    store: new RedisStore({
        client: redis_util.myCreateClient('sessionStore')
    }),
    secret: 'taskServer',
    resave: false,
    rolling: true,
    saveUninitialized: false,
    // cookie: {maxAge: 3600000}
    cookie: { maxAge: 365 * 24 * 60 * 60 * 1000 },
}));
app.use(permission_1.IPCheck);
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: false }));
app.use(cookie_parser_1.default());
app.use(express_1.default.static(path_1.default.join(__dirname, 'public')));
app.use(function (req, res, next) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Headers", "*");
    res.setHeader('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    req.originalUrl = decodeURIComponent(req.originalUrl);
    next();
});
var routers_1 = __importDefault(require("./routers"));
app.use('/init', routers_1.default.init);
app.use('/taskUser', routers_1.default.taskUser);
app.use('/taskList', routers_1.default.taskList);
app.use(function (req, res, next) {
    next(http_errors_1.default(404));
});
// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
    // render the error page
    res.status(err.status || 500);
    res.render('error');
});
exports.default = app;
//# sourceMappingURL=app.js.map