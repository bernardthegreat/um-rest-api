const express = require('express')
const router = express.Router()

// SQL CONN
const pgConfig = require('../config/database')
const hl7 = require('simple-hl7');
const winston = require('winston');
const { Console } = require('winston/lib/winston/transports');
const appMain = require("../auth/auth");
var fs = require('fs');

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
  if (!appMain.checkAuth(req.query.auth)) {
    res.send({ error: appMain.error });
    return;
  }

  var sqlWhere = ''
  if (req.query.studentNo) {
    sqlWhere = `where student_id = '${req.query.studentNo}'`
  }

  void (async function () {
    pgConfig.connect(async function(err, client, done) {
      try {
        const studentsQuery = await pgConfig.query(`
          SELECT 
            id,
            first_name,
            middle_name,
            last_name,
            email_address,
            active, contact_number,
            fb_link,
            student_id,
            datetime_created,
            attendance,
            answer,
            hash_key,
            birthdate
          FROM um_student_information.students
            ${sqlWhere}
          `
        )
        res.send(studentsQuery.rows)
        done()
      } catch (error) {
        console.log(error)
        res.send({ error });
      }
    });
  })();
});

router.get("/set-student-files", (req, res) => {
  void (async function () {
    pgConfig.connect(async function(err, client, done) {
      try {
        const studentsQuery = await pgConfig.query(`
          SELECT 
            id,
            first_name,
            middle_name,
            last_name,
            email_address,
            active, contact_number,
            fb_link,
            student_id,
            datetime_created,
            attendance,
            answer
          FROM um_student_information.students`
        )
        res.send(studentsQuery.rows)

        for (var result of studentsQuery.rows) {
          const firstName = result.first_name.toUpperCase()
          
          const middleName = result.middle_name === 'null' ? '' : result.middle_name
          const middleNameFinal = middleName === null ? '' : middleName.toUpperCase()
          const lastName = result.last_name.toUpperCase()
          const fullName = `${lastName}, ${firstName} ${middleNameFinal}`
          var dir = `./student_files/${fullName.trim()}`;
          if (!fs.existsSync(dir)){
              fs.mkdirSync(dir);
          }
        }

        done()
      } catch (error) {
        console.log(error)
        res.send({ error });
      }
    });
  })();
});


router.post("/register-student", (req, res) => {
  // if (!appMain.checkAuth(req.query.auth)) {
  //   res.send({ error: appMain.error });
  //   return;
  // }
  void (async function () {
    pgConfig.connect(async function(err, client, done) {
      try {
        await pgConfig.query(
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
          message: null,
          error: error
        });
      }
    });
  })();
});


router.post("/approve-student", (req, res) => {
  void (async function () {
    pgConfig.connect(async function(err, client, done) {
      try {
        await pgConfig.query(`
          UPDATE 
            um_student_information.students
          SET active = '1'
          where student_id = '${req.body.studentNo}'`
        )
        res.send({
          message: 'Success registering student',
          error: null
        });
        done()
      } catch (error) {
        res.send({
          message: null,
          error: error
        });
      }
    });
  })();
});


router.post("/update-student", (req, res) => {
  void (async function () {
    pgConfig.connect(async function(err, client, done) {
      try {
        await pgConfig.query(`
          UPDATE 
            um_student_information.students
          SET 
            first_name = '${req.body.firstName}',
            middle_name = '${req.body.middleName}',
            last_name = '${req.body.lastName}',
            email_address = '${req.body.email}',
            contact_number = '${req.body.contactNo}',
            fb_link = '${req.body.fbLink}'),
            birthdate = '${req.body.birthdate}'
          where student_id = '${req.body.studentNo}'`
        )
        res.send({
          message: 'Success registering student',
          error: null
        });
        done()
      } catch (error) {
        res.send({
          message: null,
          error: error
        });
      }
    });
  })();
});

router.post("/attendance", (req, res) => {
  void (async function () {
    pgConfig.connect(async function(err, client, done) {
      try {
        await pgConfig.query(`
          UPDATE 
            um_student_information.students
          SET 
            attendance = NOW()
          where student_id = '${req.body.studentNo}'`
        )
        res.send({
          message: 'Success saving attendance of student',
          error: null
        });
        done()
      } catch (error) {
        res.send({
          message: null,
          error: error
        });
      }
    });
  })();
});


router.post("/secure-attendance", (req, res) => {
  void (async function () {
    pgConfig.connect(async function(err, client, done) {
      try {
        const firstRand = randomString(8, '#a');
        const secondRand = randomString(4, '#a');
        const thirdRand = randomString(4, '#a');
        const fourthRand = randomString(12, '#a');
        const randomHashKey = `${firstRand}-${secondRand}-${thirdRand}-${fourthRand}`

        await pgConfig.query(`
          UPDATE 
            um_student_information.students
          SET 
            hash_key = '${randomHashKey}'
          where student_id = '${req.body.studentNo}'`
        )
        res.send({
          hashKey: `${randomHashKey}`,
          message: 'Success securing attendance of student',
          error: null
        });
        done()
      } catch (error) {
        res.send({
          hashKey: null,
          message: null,
          error: error
        });
      }
    });
  })();
});




router.post("/answer-question", (req, res) => {
  void (async function () {
    pgConfig.connect(async function(err, client, done) {
      try {
        await pgConfig.query(`
          UPDATE 
            um_student_information.students
          SET 
            answer = '${req.body.answer}'
          where student_id = '${req.body.studentNo}'`
        )
        res.send({
          message: 'Success saving answer of student',
          error: null
        });
        done()
      } catch (error) {
        res.send({
          message: null,
          error: error
        });
      }
    });
  })();
});




function randomString(length, chars) {
  var mask = '';
  if (chars.indexOf('a') > -1) mask += 'abcdefghijklmnopqrstuvwxyz';
  if (chars.indexOf('A') > -1) mask += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  if (chars.indexOf('#') > -1) mask += '0123456789';
  if (chars.indexOf('!') > -1) mask += '~`!@#$%^&*()_+-={}[]:";\'<>?,./|\\';
  var result = '';
  for (var i = length; i > 0; --i) result += mask[Math.round(Math.random() * (mask.length - 1))];
  return result;
}

module.exports = router;