/************************************************************************
Project: Software Programming Quiz
Purpose: Support for quiz db actions
Author: Li, Feng, Tauiliili
Created: 2024-02-24
Last Updated: 2024-02-24
************************************************************************/
const db = require('./database');
const moment = require('moment');
const { v4: uuidv4} = require('uuid');

async function set_candidate_details(candidate, ctxt) {
    // check the input fields are not empty
    if (candidate) {
        let conn, query;
        try {
            ctxt.quiz_key = uuidv4();
            query = 'INSERT INTO Candidates (candidate_email, nickname, quiz_id, quiz_version_id, \
                    quiz_key, quiz_expiration_date) VALUES (?, ?, ?, ?, ?, ?)';
            let expiration_date = moment(candidate.quiz_expiration_date).format('YYYY-MM-DD HH:mm:ss');
            let quiz = JSON.parse(candidate.quiz);
            conn = await db.getConnection();

            await conn.beginTransaction();
            await conn.query(query, [candidate.candidate_email, candidate.nickname, 
                                    quiz.quiz_id, quiz.quiz_version_id, ctxt.quiz_key, expiration_date]);
            await conn.commit();

        } catch (err) {
            console.log(`Error adding candidate: ${err}`);
            ctxt.error = true;
            ctxt.errorMessage = `Error adding candidate: ${err}`;
            throw err;
        }
        finally {
            if (conn) conn.end(err => {
                if (err) {
                    console.log("SQL error in closing connection: ", err);
                }
            });
        }
    }

    return ctxt;
};

module.exports = { set_candidate_details };