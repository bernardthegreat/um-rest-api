const express = require("express");
const router = express.Router();
const appMain = require("../auth/auth");
const sanitize = require("../helpers/sanitize");
const sqlConfig = require("../config/database");

// SQL CONN
const sql = require("mssql");
router.use(sanitize);

router.get("/access", (req, res) => {
  if (!appMain.checkAuth(req.query.auth)) {
    res.send({ error: appMain.error });
    return;
  }
  if (!req.query.systemName) {
    res.send({ error: "System Name required." });
    return;
  }
  if (!req.query.moduleName) {
    res.send({ error: "Module Name required." });
    return;
  }
  if (!req.query.code) {
    res.send({ error: "Employee Code required." });
    return;
  }

  void (async function () {
    try {
      // res.send({
      //   access: true
      // })
      await sql.connect(sqlConfig);
      const result = await sql.query(`select [ITMgt].dbo.[fn_isAccess](
        '${req.query.code}',
        '${req.query.systemName}',
        '${req.query.moduleName}'
      ) isAccess`);
      // sql.close()
      res.send({
        access: result.recordset[0].isAccess
      });
    } catch (error) {
      res.send({ error });
    }
  })();
});

router.post("/ue/student-portal", (req, res) => {
  if (!appMain.checkAuth(req.query.apiKey)) {
    res.send({ error: appMain.error });
    return;
  }
  if (!req.body.sn) {
    res.send({ error: "SN required!" });
    return;
  }
  if (!req.body.timeout) {
    res.send({ error: "Timeout required!" });
    return;
  }

  const token = appMain.generateToken(req.body.sn);
  res.send({ token });
});

router.post("/login", (req, res) => {
  // if (!appMain.checkAuth(req.query.auth)) {
  //   res.send({ error: appMain.error })
  //   return
  // }
  if (!req.body.username) {
    res.send({ error: "Could not find username." });
    return;
  }

  const type = req.body.type == null ? "employee" : req.body.type.toLowerCase();

  void (async function () {
    try {
      await sql.connect(sqlConfig);
      const result = await sql.query(`select
                code username,
                pass md5,
                e.dept_code deptCode,
                e.dept_desc department
            from [ue database]..vw_Employees e
            where e.code = '${req.body.username}'`);
      sql.close();
      if (result.recordset.length != 1) {
        res.send({ error: "Could not find user." });
        return;
      }
      const token = appMain.generateToken(result.recordset[0].username);
      res.send({
        user: result.recordset[0],
        token: token
      });
    } catch (error) {
      res.send({ error });
    }
  })();
});

router.get("/help", (req, res) => {
  res.send({
    get: [
      {
        "/access": [
          "required: query.systemName",
          "required: query.moduleName",
          "required: query.code"
        ]
      }
    ],
    post: [
      {
        "/login": ["required: body.username"]
      }
    ]
  });
});

router.get("*", (req, res) => {
  res.send({ error: "API Key not found" });
});

module.exports = router;
