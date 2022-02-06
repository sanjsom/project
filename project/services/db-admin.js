const mongodb = require('mongodb')
const mongoClient = require('mongodb').MongoClient
var url = "mongodb://localhost:27017"
var db;

function loginUser(email, password) {
    var collection = db.collection("admin")
    var filter = {
        "email": email,
        "password": password
    }
    var userData = collection.findOne(filter)
    return userData;
}

function getUserByEmail(email) {
    var collection = db.collection("admin")
    var filter = {
        "email": email
    }
    var userData = collection.findOne(filter)
    console.log(userData)
    return userData;
}

var dbController = {
    connection: function () {
        mongoClient.connect(url, function (err, database) {
            if (err) {
                console.log("Err in database server connection")
                return
            }
            db = database.db("classified-app")
            console.log("Mongo db connected")
        })
    },

    viewallmembers: function (res) {
        var memberCollection = db.collection("member")
        memberCollection.find().toArray(function (err, result) {
            if (err) {
                console.log("Error")
                return
            }
            res.render("listmembers", { title: "List Of Members", memberData: result })
        })
    },

    viewfulldetails: function (res, id) {
        var memberCollection = db.collection("member")
        var adCollection = db.collection("ads")
        var filter = {
            _id: mongodb.ObjectId(id)
        }
        var filter2 = {
            userid: id
        }
        memberCollection.find(filter).toArray(function (err, result1) {
            if (err) {
                console.log("Error")
                return
            }
            adCollection.find(filter2).toArray(function (err, result2) {
                if (err) {
                    console.log("Error")
                    return
                }
                res.render("fulldetails", { title: "Full Member Details", memberData: result1, adData: result2 })
            })
        })
    },

    viewallads: function (res) {
        var collection = db.collection("ads")

        collection.find().sort({ createdDateTime: -1 }).toArray(function (err, result) {
            if (err) {
                console.log("Error")
                return
            }
            res.render("listsads", { title: "List Of Ads", taskData: result, isMember: false })
        })
    },

    requestDetailsView: function (id, res) {
        var collection = db.collection("ads")
        var membercollection = db.collection("member")
        var newId = mongodb.ObjectId(id)
        var filter = {
            "_id": newId
        }
        var adData = null;
        collection.find(filter).toArray(function (err, result) {
            if (err) {
                console.log("err")
                return
            }
            result.forEach(element => {
                adData = element
            })
            var memberid = adData.userid
            var filter2 = {
                "_id": mongodb.ObjectId(memberid)
            }
            membercollection.find(filter2).toArray(function (err, result) {
                if (err) {
                    console.log("err")
                    return
                }
                result.forEach(element => {
                    memberData = element
                })
                res.render("request-details", { title: "view", adData: adData, memberData: memberData })
            })
        })
    }
}
module.exports = { loginUser, dbController, getUserByEmail }