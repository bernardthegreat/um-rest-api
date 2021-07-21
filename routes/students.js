const express = require('express')
const router = express.Router()
// SQL CONN
const pgConfig = require('../config/database')
const hl7 = require('simple-hl7');
const winston = require('winston');
const { Console } = require('winston/lib/winston/transports');
const appMain = require("../auth/auth");

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  defaultMeta: { service: 'user-service' },
  transports: [
    //
    // - Write all logs with level `error` and below to `error.log`
    // - Write all logs with level `info` and below to `combined.log`
    //
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'info.log', level: 'info' }),
    new winston.transports.File({ filename: 'combined.log' }),
  ],
});

router.get("/", (req, res) => {
  // if (!appMain.checkAuth(req.query.auth)) {
  //   res.send({ error: appMain.error });
  //   return;
  // }
  void (async function () {
    try {
      await pgConfig.connect();
      const students = await pgConfig.query('SELECT * FROM um_student_information.students')
      pgConfig.end();
      res.send(students.rows)
    } catch (error) {
      res.send({ error });
    }
  })();
});



module.exports = router;