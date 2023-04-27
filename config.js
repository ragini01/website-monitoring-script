module.exports = {
  urlToCheck: 'https://example.com/', // Website URL to monitor
  checkingInterval: 20, // Check interval in seconds
  sendgridApiKey: 'yoursendgridapikey',
  email: {
    from: 'fromemail',
    subject: 'Website change detected!', 
    text: 'A change has been detected on the website.', // sample text
    to: ['email1', 'email2']
  },
  mongodb: {
    url: 'mongodb://localhost:27017',
    dbName: 'websitechangehistory',
    collectionName: 'changes'
  }
};