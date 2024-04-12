/************************************************************************
Project: Software Programming Quiz
Purpose: Verify candidate
Author: Li, Feng, Tauiliili
Created: 2024-02-09
Last Updated: 2024-02-17
************************************************************************/
const db = require('./database');

async function verify_candidate(quiz_key, candidate_email, ctxt) {
    // check the input fields are not empty
    if (quiz_key && candidate_email) {
        let conn, query;
        try {
            query = 'SELECT c.* FROM Candidates c WHERE UPPER(c.candidate_email)=? AND c.quiz_key=?';
            conn = await db.getConnection();

            let candidate = await conn.query(query, [candidate_email.toUpperCase(), quiz_key]);
            console.log(candidate);

            if (candidate.length == 1) {
                ctxt.isverified = true;
                ctxt.candidate = candidate[0];
            } else {
                ctxt.isverified = false;
                ctxt.error = true;
                ctxt.errorMessage = (candidate.length > 1) ? "Multiple results found for this entry. Please contact admin to resolve."
                    : "The email address entered is not associated with this quiz. Please re-enter your email address that was provided to our team for this assessment."
            }
        } catch (err) {
            console.log(conn);
            throw err;
        } 
        finally {
            if (conn) conn.end(err => {
                if(err) {
                   console.log("SQL error in closing connection: ", err);
                }
             });
        }
    }

    return ctxt;
};

module.exports = { 
                    verify_candidate
                };