# website-monitoring-script

A small script written in Node.js to track/monitor changes on a website runs on a predefined time-schedule, notify a user-group via an email and save changes to Mongo db.


## Project Structure

1. app.js - main file 
2. config.js - includes application configuration details
3. package.json - includes information about project such as name, version, author, dependencies and other metadata.

## How it works

The script requests target website url using 'urlToCheck' at predefined interval using 'checkingInterval'. Chnage on a website is detected by website's html content using hash function by generating a unique hash value for given string of texts and then compare the hash values of html content. If any change is detected, notify user by sending an email using 'sgMail.send' and then store the change history using 'saveChange' to Mongo db.

## Installation

1. Unzip the file to get the source code.
2. Go inside website-monitoring-script folder, run `npm install`
3. In config.js, alter the configuration variables.
4. Sendgrid email integration
    - Do free account setup on Sendgrid
    - Create and get an API Key with full access
    - In config.js, add the API key
    - In config.js, set email array in `to`

## Usage

1. `node app.js`

## Overall assumption/findings to develop the script to track changes on a website

Assumption 1:
I came across my very 1st approach to develop the script just by fetching the html contents of the target website and do the comparison of overall HTML content along with it's status code,
`if (html !== previousHtml || statusCode !== previousStatusCode) {`
      `console.log('Website changed!');`
      `sendEmailNotification(html);`
      `previousHtml = html;`
      `previousStatusCode = statusCode;`
    `} else {`
      `console.log('Website not changed');`
Assumption 2:
Secondly, I found an another way doing the tracking based on my past experience where we can capture a screenshot of the target website on each scheduled interval and then do an image comparison to detect the changes. This approach can be a good way when we want to see what exactly has been changed on a website. Because, in this approach we can actually compare the content of specific elements on the web page. In Node.js, we have a library called `puppeteer` to take screenshots and then we can use another library `pixelmatch` to compare the image and identify the exact change.

Assumption 3:
I then came across getting this check done by gnerating hash value of the html's content and compare the hash values. I went ahead with this approach due to following reasons,
- Using a hash function is less resource-intensive compared to image comparison and HTML content or status code comparison. It requires less computation power to generate and compare the hash values of two website versions, making it more efficient and faster.
- Hash functions exhibit a lower susceptibility to false positives as compared to techniques like image comparison or HTML content and status code comparison. Also, if the status code changes due to any external factor which is not related to website changes, such as a temporary network issue then this can again generate false positives.
- Hashes will generate a fixed-size representation of the website content, which makes it easier to store and compare the website content efficiently.

Hence, this technique may provide a consistent and reliable way to monitor the websites.

I have implemented the hashing by converting string of texts to a 32-bit integer as I found it a simple and fast way to generate hashes. Well cryptographic hash functions using `Crypto-js` module is also a better approach in terms of security. It is a one-way hash function which produces a fixed length output. On the other hand, converting strings to a 32-bit integer can be choosed if performance is the priority.






