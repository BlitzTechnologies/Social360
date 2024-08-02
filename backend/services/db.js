const { MongoClient } = require("mongodb");
const constants = require("../modules/constants");
require("dotenv").config();

const uri = process.env.MONGO_DB_LOCAL_CONNECTION_STRING;

console.log("Connecting to local database init", uri);
let client;

async function connectToDb() {
    if (!client) {
        client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    }
    
    try {
        await client.connect();
        const db = client.db(constants.MONGO_DB_NAME);
        console.log("Connected to the database");
        return db;
    } catch (error) {
        console.error("Error initiating connection to the database: ", error);
        throw error;
    }
}

async function closeDbConnection() {
    if (client) {
        await client.close();
        client = null; 
    }
}

async function findAllDocuments(collectionName) {
    let documents = [];
    try {
        const db = await connectToDb();
        const collection = db.collection(collectionName);
        documents = await collection.find({}).toArray(); 
    } catch (error) {
        console.error("Error retrieving documents from the database: ", error);
    } finally {
        await closeDbConnection();
    }
    return documents;
}

async function insertDocument(data, collectionName) {
    const db = await connectToDb();
    const collection = db.collection(collectionName);
    const result = await collection.insertOne(data);
    await closeDbConnection();
    
    if (!result.insertedId) {
        data["status"] = "fail";
        data["message"] = "Unable to insert data into database.";
    } else {
        data["status"] = "success";
        data["message"] = "inserted data into database";
    }
    return data;
}

module.exports = {
    connectToDb,
    closeDbConnection,
    insertDocument,
    findAllDocuments
};
