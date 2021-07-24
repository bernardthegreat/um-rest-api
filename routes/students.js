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
    pgConfig.connect(async function(err, client, done) {
      try {
        const students = await pgConfig.query(`
          SELECT 
            id,
            first_name,
            middle_name,
            last_name,
            email_address,
            active, contact_number,
            fb_link,
            student_id,
            datetime_created
          FROM um_student_information.students`
        )
        res.send(students.rows)
        done()
      } catch (error) {
        console.log(error)
        res.send({ error });
      }
    });
  })();
});


router.get("/get-ip-address", (req, res) => {
  var http = require('http');

  http.get({'host': 'api.ipify.org', 'port': 80, 'path': '/'}, function(resp) {
    resp.on('data', function(ip) {
      res.send("My public IP address is: " + ip);
    });
  });
});

router.post("/register-student", (req, res) => {
  // if (!appMain.checkAuth(req.query.auth)) {
  //   res.send({ error: appMain.error });
  //   return;
  // }
  void (async function () {
    pgConfig.connect(async function(err, client, done) {
      try {
        const students = await pgConfig.query(
          `CALL um_student_information.sp_InsertStudent (
            '${req.body.studentNo}',
            '${req.body.firstName}',
            '${req.body.middleName}',
            '${req.body.lastName}',
            '${req.body.email}',
            '${req.body.contactNo}',
            '${req.body.fbLink}')
          `
        )
        res.send({
          message: 'Success registering student',
          error: null
        });
        done()
      } catch (error) {
        res.send({
          message: undefined,
          error: error
        });
      }
    });
  })();
});


module.exports = router;