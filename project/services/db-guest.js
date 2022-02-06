const mongodb = require('mongodb')
const mongoClient = require('mongodb').MongoClient
var url = "mongodb://localhost:27017"
var db;


var dbController = {
    connection: function () {
        mongoClient.connect(url, function (err, database) {
            if (err) {
                console.log("Err in database server connection")
                return
            }
            db = database.db("project")
            console.log("Mongo db connected.")
        })
    },

    viewallads: function (res) {
        var collection = db.collection("ads")

        collection.find().sort({ createdDateTime: -1 }).toArray(function (err, result) {
            if (err) {
                console.log("Error")
                return
            }
            res.render("guestview", { title: "List Of Ads", taskData: result, isMember: false })
        })
    },

    viewFullDetails: function (id, res) {
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
                res.render("guestviewcontact", { title: "view", 'adData': adData, 'memberData': memberData })
            })
        })
    },

    contactMember: function (id, res) {

        var membercollection = db.collection("member")
        var newId = mongodb.ObjectId(id)
        var filter = {
            "_id": newId
        }

        membercollection.find(filter).toArray(function (err, result) {
            if (err) {
                console.log("err")
                return
            }
            result.forEach(element => {
                memberData = element
            })
            res.render("request", { title: "view", 'memberData': memberData })
        })

    },

}


module.exports = { dbController }