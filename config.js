module.exports = {
    url: 'https://leetcode.com/', // Website URL to monitor
    interval: 20, // Check interval in seconds
    sendgridapi: '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',
    email: {
      from: 'rai.ragini@outlook.com',
      subject: 'Website change detected!',
      text: 'A change has been detected on the website.',
      to: ['kriragini92@gmail.com', 'tiwarirags1992@gmail.com']
    },
    mongodb: {
      url: 'mongodb://localhost:27017',
      dbName: 'mydb',
      collectionName: 'changes'
    }
  };