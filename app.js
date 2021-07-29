const fs = require('fs')
const express = require("express")
const bodyParser = require("body-parser")
const cors = require('cors')
const https = require('https')
const http = require('http')
const { Pool, Client } = require('pg')
const WebSocket = require('ws');

const app = express();

const studentRoute = require('./routes/students')
const announcementRoute = require('./routes/announcements')
const configurationRoute = require('./routes/configurations')
app.use(cors())


app.use(bodyParser.json())
app.use('/students', studentRoute)
app.use('/announcements', announcementRoute)
app.use('/configurations', configurationRoute)


// ROUTES
app.get("/", (req, res) => {
    res.send({
        message: "Welcome to UM Rest API"
    })
});

// const server = app.listen(3000, () => {
//     const host = server.address().address
//     const port = server.address().port
//     console.log(`Running at ${host}:${port}`)
// })

const PORT = process.env.PORT || 3000;

let httpServer = http.createServer(app)


httpServer.listen(3000)

// let httpsServer = https.createServer({
//     key: privateKey,
//     cert:certificate
// },app)
// httpsServer.listen(3443)