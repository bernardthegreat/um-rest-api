const express = require('express')
const router = express.Router()
// SQL CONN
const pgConfig = require('../config/database')
const hl7 = require('simple-hl7');
const winston = require('winston');
const { Console } = require('winston/lib/winston/transports');
const appMain = require("../auth/auth");
require('dotenv/config')
const { Router } = require('express');

var Pusher = require("pusher");
var pusher = new Pusher({
  appId: process.env.PUSHER_APP_ID,
  key: process.env.PUSHER_KEY,
  secret: process.env.PUSHER_SECRET,
  cluster: "ap1",
  useTLS: true
});


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
      pgConfig.connect(async function(err, client, done) {
        try {
          const announcements = await pgConfig.query(`
            SELECT 
              id,
              name,
              content,
              pinned,
              active,
              datetime_created,
              type
            FROM 
              um_student_information.announcements`
          )
          res.send(announcements.rows)
          client.release()
          // done()
        } catch (error) {
          console.log(error)
          res.send({ error });
        }
      });
    } catch (error) {
      console.log(error)
    }
  })();
});



router.post("/add-announcement", (req, res) => {
  // if (!appMain.checkAuth(req.query.auth)) {
  //   res.send({ error: appMain.error });
  //   return;
  // }
  void (async function () {
    try {
      pgConfig.connect(async function(err, client, done) {
        try {
          await pgConfig.query(
            `INSERT INTO um_student_information.announcements (
              name,
              content,
              pinned,
              active,
              type
            )
            VALUES (
              '${req.body.name}',
              '${req.body.content}',
              '${req.body.pinned}',
              '${req.body.active}',
              '${req.body.type}'
            )`
          )
          res.send({
            message: 'Success registering announcement',
            error: null
          });
          client.release()
        } catch (error) {
          res.send({
            message: null,
            error: error
          });
        }
      });
    } catch (error) {
      console.log(error)
    }
  })();
});

router.post("/update-announcement", (req, res) => {
  // if (!appMain.checkAuth(req.query.auth)) {
  //   res.send({ error: appMain.error });
  //   return;
  // }
  void (async function () {
    try {
      pgConfig.connect(async function(err, client, done) {
        try {
          await pgConfig.query(`
            UPDATE 
              um_student_information.announcements
            SET
              name = '${req.body.name}',
              pinned = '${req.body.pinned}',
              content = '${req.body.content}',
              active = '${req.body.active}',
              type = '${req.body.type}'
            where id = '${req.body.announcementID}'
          `)
          res.send({
            message: 'Success updating announcement',
            error: null
          });
          client.release()
        } catch (error) {
          res.send({
            message: null,
            error: error
          });
        }
      });
    } catch (error) {
      console.log(error)
    }
  })();
});

router.post("/ask-question", (req, res) => {
  // if (!appMain.checkAuth(req.query.auth)) {
  //   res.send({ error: appMain.error });
  //   return;
  // }
  void (async function () {
    try {
      pgConfig.connect(async function(err, client, done) {
        try {
          await pgConfig.query(`
            UPDATE 
              um_student_information.announcements
            SET
              name = '${req.body.name}',
              content = '${req.body.content}',
              active = '${req.body.active}',
              type = '${req.body.type}'
            where id = '3'
          `)
          res.send({
            message: 'Success adding question',
            error: null
          });
          pusher.trigger("my-channel", "my-event", {
            message: "recitation"
          });
          client.release()
        } catch (error) {
          res.send({
            message: null,
            error: error
          });
        }
      });
    } catch (error) {
      console.log(error)
    }
  })();
});


router.get("/set-recitation", (req, res) => {
  try {
    pusher.trigger("my-channel", "my-event", {
      message: "recitation"
    });
    res.send({
      message: 'Recitation Message Sent',
      error: null
    });
  } catch (error) {
    res.send({
      message: null,
      error: error
    });
  }
});

router.get("/remove-question-dialog", (req, res) => {
  try {
    pusher.trigger("my-channel", "my-event", {
      message: "remove-recitation"
    });
    res.send({
      message: 'Recitation Removal Message Sent',
      error: null
    });
  } catch (error) {
    res.send({
      message: null,
      error: error
    });
  }
});


module.exports = router;