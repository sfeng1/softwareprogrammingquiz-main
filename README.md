# CS467 - Software Programming Quiz

## Introduction
The software programming quiz project is a website that allows employers to assess potential
candidates. 

Employers can create custom timed quizzes and send them to each candidate
automatically through email. 

Once the candidate has completed the quiz, the results can be
reviewed by the employer individually and collectively online.

## My Role
This team project was done for the capstone course of the Oregon State University Computer Science Degree Program. 

I was personally responsible for the following features:
* database setup and management
* account creation and deletion
* account profile creation and editing
* login and authentication
* email functionality 

Video demo of my features: https://youtu.be/fzo2-XmXq5A

Video demo of the entire website: https://youtu.be/GwEfNiuUQUg?t=876

## Functionality 
Employers can sign up for an account and create a profile. With that account, they are able to
create and edit timed quizzes with true and false, multiple choice, select all that apply, and free
response type questions. Quizzes are sent to candidates via email to assess their knowledge
and skills. Notifications are sent to the employer whenever a quiz is successfully sent or
completed. Employers can view quiz results as individual attempts or collective rankings. Finally,
employers can edit their profiles, delete their accounts, and reset their passwords via a preset
security question.

When a candidate receives a quiz invite email, they are able to navigate to the quiz via the
provided link and authenticate with his or her email address. Once the quiz is started, the
candidate can see the countdown timer and answer each question before they submit.
Installation Instructions

## Code Installation

This software requires the server that it will be running on to install node. 

The following instructions are set up using the Oregon State University flip servers but should be applicable to
any server.

1. ssh to any one of the flip servers:
    * flip1.engr.oregonstate.edu
    * flip2.engr.oregonstate.edu
    * flip3.engr.oregonstate.edu
2. Clone the project repository to a directory on the server
    * git clone https://github.com/latauiliili/softwareprogrammingquiz.git
3. Navigate to softwareprogrammingquiz/src
4. Run the command npm install
5. Confirm there are no installation or package dependency errors

Now that the code is ready, we need to update a few of our authentication scripts and generate
the appropriate database tables.

### Database Setup

The instructions are based on the assumption that the database is on the same network as the
servers hosting the site and therefore not affected by firewall issues. Otherwise, you will need to
ensure that VPN is properly set up. 

The following instructions are based on the setup for a MySQL database hosted on classmysql.engr.oregonstate.edu.

Database Credentials Update:
1. Navigate to `softwareprogrammingquiz/src/public/scripts`
2. Edit `database.js` and update the details to include your database information:
      * host: 'classmysql.engr.oregonstate.edu',
      * user:'<**username**>',
      * password: '<**password**>',
      * database: '<**database**>',
      * connectionLimit: 5
3. Save the file.

**Create the Database Tables:**

Once the database is created, you will want to run the .sql script to create the necessary
database tables.

1. Navigate to `softwareprogrammingquiz/src/sql`
2. Take the script `database_init.sql` and run it against your database
a. NOTE: The script includes stubbed test data. If these records are not needed,
comment out the INSERT statements to avoid adding this information.

### Email Setup:

This setup assumes that a Gmail account is used to send emails.

1. Sign up for a Google Cloud Platform account and create a new project
2. Go to API & Services section to set up the OAuth consent screen
   * Set user type to External and click Create
   * Fill out the application information on the next screen
   * Add your own Google account as a test user
3. Navigate to the credentials screen and create a new OAuth client ID and Secret:
   * Select web application
   * Add OAuth2 playground (https://developers.google.com/oauthplayground) as an
   authorized redirect URI
4. Navigate over to OAuth playground to authorize Gmail and get the OAuth Token:
   * Click the gear icon on the top right and check the use your own credentials box
   * Input the client ID and secret you obtained from credentials
   * Close the gear sub menu and select Gmail API V1 to open the drop-down menu
   * Select https://mail.google.com/ and click Authorize APIs
   * Grant all necessary permissions to retrieve the refresh token
5. Navigate to softwareprogrammingquiz/src/public/scripts
6. Edit mail_auth.js and update the following fields:
   * user: username for the Gmail account you want to use to send emails
   * pass: password for the Gmail account you want to use to send emails
   * clientID: from your credentials on Google Cloud
   * clientSecret: from your credentials on Google Cloud
   * refreshToken: paste the refresh token obtained from Oauth playground
7. Save the file.

### Run the App:

Once all the appropriate credentials are set up and the database is ready:
1. Navigate back to `softwareprogrammingquiz/src`
2. Run `node_modules/.bin/forever start app.js <port>`
   * Add the port that you would like to have your site running on.
   * Default port is `65122`

## Technology
* JavaScript, NodeJS
* Embedded JS (ejs) - templating language to generate HTML markup with JavaScript for
rendering pages
* HTML, CSS - used to create the client-side of the project along with ejs
* Bootstrap - provided tools to create a more responsive experience on different devices
* jQuery - used to modify elements in document object model for forms
* Nodemailer - middleware used to authenticate to email account and send emails
* Gmail - used by Nodemailer to send emails
* MariaDB - used to provide backend database for the website
* MariaDB connector - allows the website to interface with the database and run queries
* Express-sessions - provides session and authentication services for the website
* Cookie-parser - enables cookies for quiz authentication and refresh management
