const express = require('express')
const session = require('express-session')
const path = require('path')
var app = express()
var port = 3000
const bodyParser = require('body-parser')

//sub server : member,admin
var admin = express()
var member = express()
var guest = express()

//mount the bp
app.use(bodyParser.urlencoded({
    extended: true
}))

//mount ejs
app.set("view engine", "ejs")
member.set("view engine", "ejs")
admin.set("view engine", "ejs")
guest.set("view engine", "ejs")

//mount session
member.use(session({
    secret: "member",
    resave: true,
    saveUninitialized: true
}))

admin.use(session({
    secret: "admin",
    resave: true,
    saveUninitialized: true
}))

//mount the sub server on to main server app
app.use("/member", member)
app.use("/admin", admin)
app.use("/guest", guest)

//mounting default middleware to member sub-server
member.use(function(req, res, next){
    console.log("Inside default middleware ")
    next()
})

//routes mapping
var memberRoutes = require('./services/routes-member')
var adminRoutes = require('./services/routes-admin')
var guestRoutes = require('./services/routes-guest')

memberRoutes(member)
adminRoutes(admin)
guestRoutes(guest)

app.use(express.static('public'))
member.use(express.static('public'))

app.listen(port, function(err){
    console.log("server started at ", port)
})

app.get("/style.css", function (req, res) {
    res.sendFile(__dirname + "/views/style.css")
})