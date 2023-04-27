// Import required modules
const axios = require('axios');
const { MongoClient } = require('mongodb');
const config = require('./config');
const sgMail = require('@sendgrid/mail');

// Use 'config' object to set the values
const urlToCheck = config.urlToCheck;
const checkingInterval = config.checkingInterval;
const mongodbUrl = config.mongodb.url;
const mongodbDbName = config.mongodb.dbName;
const mongodbCollectionName = config.mongodb.collectionName;
const apikey = config.sendgridApiKey;
const msg = {
  to: config.email.to,
  from: config.email.from,
  subject: config.email.subject,
  text: config.email.text,
};

// Set API key for SendGrid email service
sgMail.setApiKey(apikey);

// Initialize MongoDB client
const mongoClient = new MongoClient(mongodbUrl);

// Check target website for changes
async function checkWebsite() {
  try {
    // Fetch website HTML contents
    const response = await axios.get(urlToCheck);

    // Check if website content has changed
    const websiteContents = response.data;
    const websiteHash = hashCode(websiteContents);
    const dbHash = await getLatestHash();

    if (websiteHash !== dbHash) {
      // Website content has changed, notify user and store change in database
      console.log('Website content has changed!');
      sgMail.send(msg)
      await saveChange(websiteHash);
    } else{
      console.log('Website content has not changed');
    }
  } catch (error) {
    console.error(error);
  }
}

// Get the latest hash from the database
async function getLatestHash() {
  try {
    await mongoClient.connect();
    const db = mongoClient.db(mongodbDbName);
    const changesCollection = db.collection(mongodbCollectionName);

    const latestChange = await changesCollection.findOne({}, { sort: { $natural: -1 } });
    return latestChange ? latestChange.hash : '';
  } catch (error) {
    console.error(error);
  } finally {
    await mongoClient.close();
  }
}

// Save a new change in the Mongo database
async function saveChange(hash) {
  try {
    await mongoClient.connect();
    const db = mongoClient.db(mongodbDbName);
    const changesCollection = db.collection(mongodbCollectionName);

    const result = await changesCollection.insertOne({
      url: urlToCheck,
      hash: hash,
      timestamp: new Date()
    });
    console.log(`Inserted documents into the changes collection`);
  } catch (error) {
    console.error(error);
  } finally {
    await mongoClient.close();
  }
}


// Hash function for website content
function hashCode(str) {
  let hash = 0;

  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32 bit integer
  }

  return hash.toString();
}

// Start checking the website on an interval (in milliseconds)
setInterval(checkWebsite, checkingInterval * 1000);












