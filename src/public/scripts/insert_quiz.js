/************************************************************************
Project: Software Programming Quiz
Author: Li, Feng, Tauiliili
Created: 2024-02-18
Last Updated: 2024-02-18
************************************************************************/
const mariadb = require('./database')
const moment = require('moment')

let modifiedDate = moment().format('YYYY-MM-DD HH:mm:ss')

async function insertQuiz(req) {
  let data = req.body
  let email = req.body.username
  let account_id;
  
  let conn = await mariadb.getConnection()
  let id = await conn.query("SELECT account_id FROM Accounts WHERE user_name = ?", email)
  account_id = id[0]['account_id']
  if (conn) conn.end()

  let query = "INSERT INTO Quizzes(quiz_version_id, account_id, time_limit, modified_date, name, description) VALUES (?, ?, ?, ?, ?, ?)"
  let values = [1, account_id, data.timer, modifiedDate, data.name, data.description]
  
  conn = await mariadb.getConnection()
  let result = await conn.query(query, values)

  if (conn) conn.end()

  return result.insertId
}

async function insertQuestion(req, primaryID) {
    let data = req.body
    let questionAmount = (data.question_number.length > 1) ? data.question_number.length : 1
    let questionQuery = 'INSERT INTO Questions(quiz_id, quiz_version_id, question_number, question_type, answer_quantity, question_text, correct_answer, max_points, modified_date) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)';
    let questionValues = [] 
    let quizPoints = 0
    
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
            let tfvalues = [primaryID, 1, questionNum, questionType, 2, questionText, correct_answers, data[`question${i}-points`],`${modifiedDate}`]
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
            let values = [primaryID, 1, questionNum, questionType, 4, questionText, correct_answers, maxPoints, `${modifiedDate}`]

            questionValues.push(values)
        } else if (questionType === "FR") {
            let frvalues = [primaryID, 1, Number(questionNum), questionType, 0, questionText, '" "', 0, modifiedDate]
            questionValues.push(frvalues)
        }
    }

    let conn;
    let pointsQuery = `UPDATE Quizzes SET total_points = ${quizPoints} WHERE quiz_id = ${primaryID}`
    try {
        conn = await mariadb.getConnection()
        conn.query(pointsQuery)
        conn.batch(questionQuery, questionValues)
    } catch (error) {
        throw error
    } finally {
        if (conn) conn.end()
    }
}

module.exports = {insertQuiz, insertQuestion}