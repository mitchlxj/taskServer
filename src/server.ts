import errorHandler from "errorhandler";
import { myTaskDealSchedule, rulerSetSchedule } from './utils/schedule';
import schedule from 'node-schedule';

import app from "./app";


app.use(errorHandler());

const TaskServer = app.listen(app.get("port"), () => {
  console.log(
    "  App is running at http://localhost:%d in %s mode",
    app.get("port"),
    app.get("env")
  );
  console.log("  Press CTRL-C to stop\n");
});


var rule = new schedule.RecurrenceRule();
rule.second = [0, 10, 20, 30, 40, 50];
rulerSetSchedule(rule, myTaskDealSchedule);
console.log('开启定时任务');

export default TaskServer;