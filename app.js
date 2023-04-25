const axios = require('axios');
const { MongoClient } = require('mongodb');
const config = require('./config');
const sgMail = require('@sendgrid/mail');

// Use 'config' object to set the values
const url = config.url;
const interval = config.interval;
//const emailUser = config.email.user;
//const emailPass = config.email.pass;
//const emailTo = config.email.to;
const mongodbUrl = config.mongodb.url;
const mongodbDbName = config.mongodb.dbName;
const mongodbCollectionName = config.mongodb.collectionName;
const apikey = config.sendgridapi;
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

// Check website for changes
async function checkWebsite() {
  try {
    // Fetch website HTML
    const response = await axios.get(url);

    // Check if website content has changed
    const websiteContent = response.data;
    const websiteHash = hashCode(websiteContent);
    const dbHash = await getLatestHash();

    if (websiteHash !== dbHash) {
      // Website content has changed, notify user and store change in database
      sgMail.send(msg)
      await saveChange(websiteHash);
      console.log('Website changed!')
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

// Save a new change in the database
async function saveChange(hash) {
  try {
    await mongoClient.connect();
    const db = mongoClient.db(mongodbDbName);
    const changesCollection = db.collection(mongodbCollectionName);

    const result = await changesCollection.insertOne({
      url: url,
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
    hash = hash & hash; // Convert to 32bit integer
  }

  return hash.toString();
}

// Start checking the website on an interval (in milliseconds)
setInterval(checkWebsite, interval * 1000);












