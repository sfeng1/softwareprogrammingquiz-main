/************************************************************************
Project: Software Programming Quiz
Author: Li, Feng, Tauiliili
Created: 2024-01-22
Last Updated: 2024-03-09
************************************************************************/
const express = require('express');

const bodyParser = require('body-parser');
const insert_quiz = require('./public/scripts/insert_quiz.js')
const updateQuiz = require('./public/scripts/edit-quiz.js')
const mariadb = require('./public/scripts/database.js')
const jsonParser = bodyParser.json();
const ejs = require('ejs')
const app = express();

const moment = require('moment');
const path = require('path');
const cookieParser = require('cookie-parser');

const port = process.argv[2] ? process.argv[2] : 65122;

app.set('view engine', 'ejs');
app.set('port', port);
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

const qz = require('../src/public/scripts/quiz_db_support');

// Routers
const quiz_router = require('./routes/quiz.js');
const quiz_completed_router = require('./routes/quiz-completed.js');
const quiz_results_router = require('./routes/quiz-results-display.js');
const candidate_creation_router = require('./routes/candidate-creation.js');

// Login and auth specific
const ver_login = require('./public/scripts/login_auth').verify_login;
const make_acct = require('./public/scripts/make_account').make_acct;
const prof_query = require('./public/scripts/profile_query').profile_query;
const prof_update = require('./public/scripts/profile_update').profile_update;
const del_acct = require('./public/scripts/delete_account').profile_delete;
const reset_pass = require('./public/scripts/reset_pass').reset_pass;
const session = require('express-session');
const { access } = require('fs');
const { require_login } = require('./public/scripts/login-middleware.js');
app.use(session({
	secret: 'secret',
	resave: false,
	saveUninitialized: true
}));

/************************************************************************
Render to the pages
************************************************************************/
app.get('/', (req, res, next) => {
    let loggedin = req?.session?.loggedin ? req?.session?.loggedin : false;
    let context = { loggedin: loggedin}; // context for home page menu
    console.log(`context: ` + JSON.stringify(context));
    res.render('home', context);
});

app.get('/create-quiz', require_login, (req, res) => {
    const username = req.session.username
    res.render('create-quiz', { username });
});

app.get('/login', (req, res) => {
  res.render('login');
});

app.get('/logout', (req, res) => {
    req.session.destroy(res.redirect('/'));
});

app.post('/auth', (request, response) => {
    var return_msg = ver_login(request, response);
    return_msg.then();
});

app.get('/profile', function(req, res) {
    if (req.session.loggedin != true) {res.render('login')}
        else {
            var return_msg_profile = prof_query(req, res);
            return_msg_profile.then((value) => {
                res.render('profile', {profile_data: value});
            });
        };
});

app.get('/profile_edit', function(req, res) {
    if (req.session.loggedin != true) {res.render('login')}
        else {
            var return_msg = prof_query(req, res);
            return_msg.then((value) => {
                res.render('profile_edit', {profile_data: value});
            });
        };
});

app.post('/prof_edit', (req, res) =>{
    var return_msg = prof_update(req, res);
    return_msg.then();
});

app.post('/create-quiz', require_login, jsonParser, async(req, res) => {
  let primaryID = await insert_quiz.insertQuiz(req)

  await insert_quiz.insertQuestion(req, primaryID)

  res.render('status-message')
 });
  
app.get('/quiz', (req, res) => {
  res.render('quiz');
});
        
app.get('/create_account', (req, res) => {
  res.render('create-account');
});

app.post('/create_acct', (request, response) => {
  var return_msg = make_acct(request, response);
  return_msg.then();
});

app.post('/delete_acct', (request, response) => {
    var return_msg = del_acct(request, response);
    return_msg.then();
});

app.get('/forgot_password_login', (req, res) => {
    res.render('forgot-password-login');
});

app.post('/reset_login', function(req, res) {
    var return_msg = prof_query(req, res);
    return_msg.then((value) => {
        res.render('forgot-password-question', {profile_data: value});
    });
});

app.post('/reset_ques', (req, res) => {
    var return_msg = reset_pass(req, res);
    return_msg.then();
});

app.get('/edit-quiz', require_login, async (req, res) => {
    let username = req.session.username
    let result = await updateQuiz.retrieveAllQuizzes(username)
    let versions = {};
    let attempts = result[1]
    if (result) for (quizzes of result[0]) versions[quizzes['quiz_id'].toString()] = quizzes['quiz_version_id']
    res.render('edit-quiz', { data: result[0], username, versions, attempts })
})

app.post('/edit-quiz/', require_login, jsonParser, async(req, res) => {
    const primaryID = req.body.quiz_id
    let result = await updateQuiz.updateQuiz(req, primaryID)
    res.render('status-message')
})

app.get('/quiz-editor/:quiz_id/:quiz_version_id', require_login, async (req, res) => {
    const quiz_id = req.params.quiz_id
    let query = await updateQuiz.retrieveAQuiz(quiz_id, req.params.quiz_version_id)
    let result = query[0]
    let answers  = query[1]
    res.render('quiz-editor', { data: result, answers, quiz_id})
})

app.get('/view-quiz/:quiz_id/:quiz_version_id', require_login, async (req, res) => {
  const quiz_id = req.params.quiz_id
  let query = await updateQuiz.retrieveAQuiz(req.params.quiz_id, req.params.quiz_version_id)
  let result = query[0]
  let answers  = query[1]
  res.render('view-quiz', { data: result, answers, quiz_id })
})

app.get('/quiz-expired', (req, res) => {
    res.render('quiz-expired');
});

/************************************************************************
* Data Retrieval
************************************************************************/

// Get Questions 
app.get("/quiz-questions", async (req, res) => {
    let context = {};
    context = await qz.get_quiz_questions(req.query.quiz_key, context);
    res.send(context);
});

/************************************************************************
* Add our routers
************************************************************************/
app.use(quiz_router);
app.use(quiz_completed_router);
app.use(quiz_results_router); 
app.use(candidate_creation_router);

/************************************************************************
Error Fall through
************************************************************************/
app.use(function (req, res) {
    let loggedin = req?.session?.loggedin ? req?.session?.loggedin : false;
    let context = { loggedin: loggedin}; // context for error page menu
    console.log(`context: ` + JSON.stringify(context));

    res.status(404);
    res.render('errorhandler', context);
});

app.use(function (err, req, res, next) {
    let loggedin = req?.session?.loggedin ? req?.session?.loggedin : false;
    let context = { loggedin: loggedin}; // context for error page menu
    context.error = true;
    context.errorMessage = err.stack;
    console.error(err.stack);
    res.type('plain/text');
    res.status(500);
    res.render('errorhandler', context);
});

app.use(bodyParser.json())

/************************************************************************
SERVER DETAILS
************************************************************************/
app.listen(app.get('port'), () => {
    console.log(
        `Express started on http://localhost:${port}; press Ctrl-C to terminate.`
    );
});
