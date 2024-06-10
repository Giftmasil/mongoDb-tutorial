const { MongoClient } = require("mongodb")

let dbConnection;
let uri = "mongodb+srv://gift:testing123@cluster0.mxiqmiz.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"

const connectToDb = (cb) => {
    MongoClient.connect(uri)
        .then(client => {
            dbConnection = client.db();
            return cb();
        })
        .catch(err => {
            console.log(err)
            return cb(err)
        })
}


const getDb = () => dbConnection;



module.exports = {
    connectToDb,
    getDb
}