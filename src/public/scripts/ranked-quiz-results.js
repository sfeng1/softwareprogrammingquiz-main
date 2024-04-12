/************************************************************************
* Project: Software Programming Quiz
* Author: Li, Feng, Tauiliili
* Created: 2024-02-17
* Last Updated: 2024-03-09
* Purpose: Generate the the quiz results table
************************************************************************/

'use strict';

let data = candidateattempts;

function generateRankedQuizResults() {
    const tableContainer = document.getElementById('sortable-table-container');  
    let table = '<table id="ranked-results" class="sortable">';
    let thead = `<thead><tr><th class="no-sort">Candidate Email</th> \
            <th class="no-sort">Candidate Nickname</th> \
            <th class="num"><button>Score</button><span aria-hidden="true"></span></th>  \
            <th class="no-sort">Expiration Date</th>\
            <th class="no-sort">Completed Date</th> \
            <th class="no-sort">View Results</th></tr></thead>`;
    let tbody = '<tbody id="ranked-results-body">';
    data.forEach(item => {
        let expiration_date = moment(item.quiz_expiration_date).format('YYYY-MM-DD HH:mm');
        let submit_time = (item.submit_time === '-') ? item.submit_time : moment(item.submit_time).format('YYYY-MM-DD HH:mm');
        table += `<tr><td>${item.candidate_email}</td><td>${item.nickname}</td> \
                <td>${item.total_score}</td><td>${expiration_date}</td><td>${submit_time}</td>`;
        
        if (item.submit_time != '-'){
            table += `<td><button onclick="window.location.href='/display-quiz/${item.quiz_key}'" 
            class="btn btn-primary view-quiz-btn">View</button></td></tr>`;
            
        } else {
            table += `<td>N/A</td></tr>`;
        }
                
    });
    tbody += '</tbody>';

    table = table + thead + tbody + `</table>`;
    tableContainer.innerHTML = table;  
}

/************************************************************************
** Add event listeners.
************************************************************************/
if (document.getElementById("sortable-table-container")) {
    window.addEventListener('load', generateRankedQuizResults);
}