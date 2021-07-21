const fs = require('fs')
const express = require("express")
const bodyParser = require("body-parser")
const cors = require('cors')
const https = require('https')
const http = require('http')
const { Pool, Client } = require('pg')

const privateKey = fs.readFileSync('keys/84452908_uermwebapi.key')
const certificate = fs.readFileSync('keys/84452908_uermwebapi.cert')

const app = express();

const studentRoute = require('./routes/students')
app.use(cors())


app.use(bodyParser.json())
app.use('/students', studentRoute)



// ROUTES
app.get("/", (req, res) => {
    res.send({
        message: "Welcome UM Rest API"
    })
});

// const server = app.listen(3000, () => {
//     const host = server.address().address
//     const port = server.address().port
//     console.log(`Running at ${host}:${port}`)
// })

let httpServer = http.createServer(app)
httpServer.listen(3000)

let httpsServer = https.createServer({
    key: privateKey,
    cert:certificate
},app)
httpsServer.listen(3443)