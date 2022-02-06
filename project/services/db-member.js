const mongodb = require('mongodb')
const path = require('path')
const mongoClient = require('mongodb').MongoClient
var url = "mongodb://localhost:27017"
var fs = require('fs')
var db;

function loginUser(email, password) {
    var collection = db.collection("member")
    var filter = {
        "email": email,
        "password": password
    }
    var userData = collection.findOne(filter)
    return userData;
}

function getUserByEmail(email) {
    var collection = db.collection("member")
    var filter = {
        "email": email
    }
    var userData = collection.findOne(filter)
    return userData;
}

function insertAd(req, form, currloginUser) {
    //getting collection
    dbController.connection()
    var collection = db.collection("ads")

    form.parse(req, function (err, fields, files) {
        //collecting information about the file upload
        var oldPath = files.filetoupload.filepath; //temp location 
        var extension = files.filetoupload.originalFilename.split('.').pop()

        //adding text to db
        var title = fields.title
        var description = fields.description
        var price = fields.price
        var createdDateTime = Date.now();

        //insert to db
        var adData = {
            'userid': currloginUser._id.toString(),
            'title': title,
            'description': description,
            'image': extension,
            'createdDateTime': createdDateTime,
            'price': price
        }
        collection.insertOne(adData)
        var adId = adData._id
        var newFileNameName = "./public/media/" + adId + "." + extension;

        //read
        fs.readFile(oldPath, function (err, data) {
            if (err) {
                console.log("Error in upload : ", err)
                return
            }
            //write
            fs.writeFile(newFileNameName, data, function (err) {
                if (err) {
                    console.log("Error in upload2 : ", err)
                    return
                }
            })
        })
    })

}

function reuploadImgAd(req, form, currloginUser) {
    //getting collection
    dbController.connection()    
    form.parse(req, function (err, fields, files) {
        //collecting information about the file upload
        var collection = db.collection("ads")
        var selectedId = fields.id
        var filter = {
            "_id": mongodb.ObjectId(selectedId)
        }
        console.log("id to filter "+selectedId)
        var oldPath = files.filetoupload.filepath; //temp location 
        var extension = files.filetoupload.originalFilename.split('.').pop()
        console.log(extension)
        var adData = {
            $set: {
                'image': extension
            }
        }
        collection.updateMany(filter, adData, function (err, result) {
            if (err) {
                console.log("err in update")
                return
            }
        })
        var adId = fields.id
        var newFileNameName = "./public/media/" + adId + "." + extension;
        fs.readFile(oldPath, function (err, data) {
            if (err) {
                console.log("Error in upload : ", err)
                return
            }
            //write
            fs.writeFile(newFileNameName, data, function (err) {
                if (err) {
                    console.log("Error in upload : ", err)
                    return
                }
            })
        })

    })
}


var dbController = {
    connection: function () {
        mongoClient.connect(url, function (err, database) {
            if (err) {
                console.log("Err in database server connection")
                return
            }
            db = database.db("project")
            console.log("Mongo db connected")
        })
    },

    addingMember: function (data) {
        //adding logic
        var collection = db.collection("member")
        collection.insertOne(data, function (err, result) {
            if (err) {
                console.log("err in adding member")
                return
            }
            console.log("member registered successfully")
        })
    },

    creatingAd: function (data) {
        //adding logic
        var collection = db.collection("ads")
        collection.insertOne(data, function (err, result) {
            if (err) {
                console.log("err in creating ad")
                return
            }
            console.log("ad created successfully")
        })
    },

    viewallads: function (res, id) {
        var collection = db.collection("ads")
        var filter = {
            "userid": id
        }
        collection.find(filter).sort({ createdDateTime: -1 }).toArray(function (err, result) {
            if (err) {
                console.log("Error")
                return
            }
            res.render("listsads", { title: "List Of Ads", taskData: result, isMember: true })
        })
    },

    deleteallads: function (res, id) {
        var collection = db.collection("ads")
        var filter = {
            "userid": id
        }

        collection.deleteMany(filter, function (err, result) {
            if (err) {
                console.log("Err in delete ", err)
                return
            }
            console.log("ads deleted with member id : ", id)

        })
        res.redirect("/member/viewallads/" + id)

    },

    updateProfileView: function (id, res) {
        var collection = db.collection("member")
        var newId = mongodb.ObjectId(id)
        var filter = {
            "_id": newId
        }
        var memberData = null;
        collection.find(filter).toArray(function (err, result) {
            if (err) {
                console.log("err")
                return
            }
            result.forEach(element => {
                memberData = element
            })
            res.render("update", { title: "view", data: memberData })
        })
    },

    updateMember: function (data, res) {

        var selectedId = data.id
        var collection = db.collection("member")
        var filter = {
            "_id": mongodb.ObjectId(selectedId)
        }
        var jsonData = {
            $set: {
                name: data.name,
                email: data.email,
                age: data.age,
                dob: data.dob,
                mobile: data.mobile
            }
        }
        collection.updateMany(filter, jsonData, function (err, result) {
            if (err) {
                console.log("err in update")
                return
            }
            console.log(jsonData)
            console.log("member details updated successfully")
        })
    },

    updatePasswordView: function (id, res) {
        var collection = db.collection("member")
        var newId = mongodb.ObjectId(id)
        var filter = {
            "_id": newId
        }
        var memberData = null;
        collection.find(filter).toArray(function (err, result) {
            if (err) {
                console.log("err")
                return
            }
            result.forEach(element => {
                memberData = element
            })
            res.render("update-password", { title: "view", data: memberData })
        })
    },

    updatePassword: function (data, res) {
        var selectedId = data.id
        var collection = db.collection("member")
        var filter = {
            "_id": mongodb.ObjectId(selectedId)
        }
        var jsonData = {
            $set: {
                password: data.password
            }
        }
        collection.updateMany(filter, jsonData, function (err, result) {
            if (err) {
                console.log("err in update")
                return
            }
            console.log(jsonData)
            console.log("member password updated successfully")
        })
    },

    deletemyaccount: function (res, id) {
        var newId = mongodb.ObjectId(id)
        var collection = db.collection("member")
        var adcollection = db.collection("ads")
        var filter = {
            "_id": newId
        }
        var filter2 = {
            userid: id
        }
        collection.deleteOne(filter, function (err, result) {
            if (err) {
                console.log("Err in delete ", err)
                return
            }
            console.log("member deleted")
            adcollection.deleteMany(filter2, function (err, result) {
                if (err) {
                    console.log("Err in delete ", err)
                    return
                }
                console.log("all ads of member also deleted")
            })
        })
        res.redirect("/member/login")

    },

    deleteAd: function (res, id) {
        var newId = mongodb.ObjectId(id)
        var adcollection = db.collection("ads")
        var filter = {
            "_id": newId
        }
        adcollection.deleteOne(filter, function (err, result) {
            if (err) {
                console.log("Err in delete ", err)
                return
            }
            console.log("ad deleted")
        })      
    },

    updateView: function (id, res) {
        var collection = db.collection("ads")
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
            res.render("updatead", { title: "view", data: adData })
        })
    },

    updateAd: function (data, res) {

        var selectedId = data.id
        var collection = db.collection("ads")
        var filter = {
            "_id": mongodb.ObjectId(selectedId)
        }
        var jsonData = {
            $set: {
                title: data.title,
                description: data.description,
                price: data.price,
                createdDateTime: Date.now()
            }
        }
        collection.updateMany(filter, jsonData, function (err, result) {
            if (err) {
                console.log("err in update")
                return
            }
            console.log("ad details updated successfully")
        })
    },
    
    reuploadImgView: function (id, res) {
        var collection = db.collection("ads")
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
            res.render("reuploadImg", { title: "view", data: adData })
        })
    }

}

module.exports = { dbController, loginUser, getUserByEmail, insertAd, reuploadImgAd }
