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
    pgConfig.connect(async function(err, client, done) {
      try {
        const configurations = await pgConfig.query(`
          SELECT 
            *
          FROM 
            um_student_information.configurations`
        )
        res.send(configurations.rows)
        client.release()
      } catch (error) {
        console.log(error)
        res.send({ error });
      }
    });
  })();
});


module.exports = router;