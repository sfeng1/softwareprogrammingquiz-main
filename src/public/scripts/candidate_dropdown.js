/************************************************************************
Project: Software Programming Quiz
Purpose: Client-side script for send-candidate-quiz page
Author: Li, Feng, Tauiliili
Created: 2024-02-24
Last Updated: 2024-02-24
************************************************************************/

'use strict';

let quizobj = quizzes;

/************************************************************************
** Build Dropdown option for the Quizzes available
************************************************************************/

function generateQuizOptionList() {
    let selectlist = document.getElementById('quiz');  
    let options;

    quizobj.forEach(q => {
        options += `<option value='{"quiz_id":${q.quiz_id},"quiz_version_id":${q.quiz_version_id}}'>${q.name} - v.${q.quiz_version_id}</option>`;
    });

    selectlist.innerHTML = options;  
}

/************************************************************************
** Add event listeners.
************************************************************************/
if (document.getElementById("quiz")) {
    window.addEventListener('load', generateQuizOptionList);
}