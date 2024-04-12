/************************************************************************
Project: Software Programming Quiz
Author: Li, Feng, Tauiliili
Created: 2024-02-23
Last Updated: 2024-02-25
************************************************************************/

const mariadb = require('./database')
const moment = require('moment')

let modifiedDate = moment().format('YYYY-MM-DD HH:mm:ss')

async function updateQuiz(req, primary_key) {
    let data = req.body
    let questionAmount = (data.question_number.length > 1) ? data.question_number.length : 1
    const versionQuery = `SELECT MAX(quiz_version_id), account_id, time_limit, name, description FROM Quizzes WHERE quiz_id = ${primary_key}`
    let newVersion, checkVersion, con;
    let attemptedFlag = 0;
    let values = []
    
    try {
        con = await mariadb.getConnection()
        let res = await con.query(versionQuery)
        const quizRes = res[0]
        newVersion = checkVersion = quizRes["MAX(quiz_version_id)"]
        newVersion++
        values = [primary_key, newVersion, quizRes['account_id'], quizRes['time_limit'], modifiedDate, quizRes['name'], quizRes['description'], 0]
        
        res = await con.query(`SELECT * FROM Attempts WHERE quiz_id = ${primary_key} AND quiz_version_id = ${checkVersion}`)
        if (res[0]) attemptedFlag = 1
        
    } catch (error) {
        throw error
    } finally {
        if (con) con.end()
    }

    const newQuiz = "INSERT INTO Quizzes(quiz_id, quiz_version_id, account_id, time_limit, modified_date, name, description, total_points) VALUES (?, ?, ?, ?, ?, ?, ?, ?)"
    const emptyQuiz = `DELETE FROM Questions WHERE quiz_id = ${primary_key} AND quiz_version_id = ${checkVersion}`
    const insertQuery = 'INSERT INTO Questions(quiz_id, quiz_version_id, question_number, question_type, answer_quantity, question_text, correct_answer, max_points, modified_date) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)'
    let questionValues = [] 
    let quizPoints = 0

    const version = (attemptedFlag) ? newVersion : checkVersion
    
    for (i = 1; i < questionAmount + 1; i++) {
        let questionType = (questionAmount === 1) ? data.question_type : data.question_type[i - 1]
        let questionNum = data.question_number[i - 1]
        let questionText = data[`question${i}-question`]

        if (questionType === "TF") {
            let truePoints = 0
            let falsePoints = 0
            let questionPoints = data[`question${i}-points`]
            
            quizPoints += Number(questionPoints)

            if (data[`question${i}-answer`] === "False") {
                falsePoints = questionPoints
            } else {
                truePoints = questionPoints
            } 
            let correct_answers = JSON.stringify([{"Choice": "True", "Points": Number(truePoints)}, {"Choice": "False", "Points": Number(falsePoints)}])
            let tfvalues = [primary_key, version, questionNum, questionType, 2, questionText, correct_answers, data[`question${i}-points`],`${modifiedDate}`]
            questionValues.push(tfvalues)
        } else if (questionType === "MC" || questionType === "CB") {
            let maxPoints = (questionType === "MC") ? Math.max(data[`question${questionNum}-choice1-value`], data[`question${questionNum}-choice2-value`],
                                data[`question${questionNum}-choice3-value`], data[`question${questionNum}-choice4-value`]) : 
                                Number(data[`question${questionNum}-choice1-value`]) + Number(data[`question${questionNum}-choice2-value`]) +
                                Number(data[`question${questionNum}-choice3-value`]) + Number(data[`question${questionNum}-choice4-value`])


            let correct_answers = JSON.stringify([{"Choice": data[`question${questionNum}-option1`], "Points": Number(data[`question${questionNum}-choice1-value`])},
            {"Choice": data[`question${questionNum}-option2`], "Points": Number(data[`question${questionNum}-choice2-value`])},
            {"Choice": data[`question${questionNum}-option3`], "Points": Number(data[`question${questionNum}-choice3-value`])},
            {"Choice": data[`question${questionNum}-option4`], "Points": Number(data[`question${questionNum}-choice4-value`])}])

            quizPoints += Number(maxPoints)
            let values = [primary_key, version, questionNum, questionType, 4, questionText, correct_answers, maxPoints, `${modifiedDate}`]

            questionValues.push(values)
        } else if (questionType === "FR") {
            let frvalues = [primary_key, version, questionNum , questionType, 0, questionText, '" "', 0, modifiedDate]
            questionValues.push(frvalues)
        }
    }
    
    let conn;
    let pointsQuery = `UPDATE Quizzes SET total_points = ${quizPoints} WHERE quiz_id = ${primary_key}`
    try {
        conn = await mariadb.getConnection()
        if (attemptedFlag) {
            conn.query(newQuiz, values)
            conn.query(pointsQuery)
            conn.batch(insertQuery, questionValues)
        } else {
            conn.query(emptyQuiz)
            conn.query(pointsQuery)
            conn.batch(insertQuery, questionValues)
        }
    } catch (error) {
        throw error
    } finally {
        if (conn) conn.end()
    }
}

async function retrieveAllQuizzes(username) {
    // retrieve account_id from and retrieve only quizzes from that account
    let conn = await mariadb.getConnection()
    let id = await conn.query("SELECT account_id FROM Accounts WHERE user_name = ?", username)
    let account_id = id[0]['account_id']
    let retArray = []
    let attempts = {}

    conn = await mariadb.getConnection()
    let result = await conn.query("SELECT Quizzes.quiz_id, Quizzes.quiz_version_id, Quizzes.time_limit, Quizzes.name, Quizzes.description \
    FROM Quizzes INNER JOIN Accounts ON Quizzes.account_id = Accounts.account_id WHERE Accounts.account_id = ?", account_id)
    retArray.push(result)

    let retrieveAttempts = await conn.query("SELECT quiz_id, quiz_version_id FROM Attempts")
    for (entry of retrieveAttempts) {
        if (!(entry['quiz_id'] in attempts)) {
            attempts[entry['quiz_id']] = new Set()
            attempts[entry['quiz_id']].add(entry['quiz_version_id'])
        } else attempts[entry['quiz_id']].add(entry['quiz_version_id'])
    }

    retArray.push(attempts)
    if (conn) conn.close()
    return retArray
}

async function retrieveAQuiz(quiz_id, quiz_version_id) {
    const conn = await mariadb.getConnection()
    let result = await conn.query(`SELECT * FROM Questions WHERE quiz_id = ${quiz_id} AND quiz_version_id = ${quiz_version_id}`)
    let answers = [[""]]
    for (items of result) answers.push(JSON.parse(items["correct_answer"]))
    console.log(result)
    if (conn) conn.close()
    return [result, answers]
}

module.exports = {updateQuiz, retrieveAllQuizzes, retrieveAQuiz}
