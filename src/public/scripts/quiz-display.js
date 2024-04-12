/************************************************************************
Project: Software Programming Quiz
Author: Li, Feng, Tauiliili
Created: 2024-02-10
Last Updated: 2024-02-11
Purpose: Client-side for dynamically building a quiz that
         has already been taken
************************************************************************/

function goBack() {
    window.history.back();
}

/************************************************************************
** Build Quiz Form HTML
************************************************************************/

function displayQuiz() {
    let qr = qstnresponse;
    if (qr.length > 0) {
        generateQuizForm(qr);
    } else {
        console.log("No Question Questions found")
    }

}

function generateQuizForm(qr) {
    let quizEl = document.createElement("div");

    for (let i = 0; i < qr.length; i++) {
        let qNode = document.createElement("li");
        let qTextNode = document.createElement("p");
        let ansText = JSON.parse(qr[i].answer_text);
        let aNode;

        let qText = document.createTextNode(`${qr[i].question_text} [${qr[i].points_earned} / ${qr[i].max_points} pts]`);

        qTextNode.appendChild(qText);
        qNode.appendChild(qTextNode);

        switch (qr[i].question_type) {
            case 'TF':
            case 'MC':
                // T/F or Multiple Choice Radio Buttons
                aNode = generateRadioButtons(qr[i].correct_answer, ansText, qr[i].question_number);
                break;
            case 'CB':
                // select all that apply
                aNode = generateSelectAll(qr[i].correct_answer, ansText, qr[i].question_number);
                break;
            case 'FR':
                // Freeform text
                aNode = generateFreeFormField(qr[i].question_number, ansText[0].AnswerText);
                break;
        }

        qNode.appendChild(aNode);
        document.getElementById("quiz-questions-answers").appendChild(qNode);
    }
}

function generateRadioButtons(qops, ans, qnum) {
    let qopsarr = JSON.parse(qops);
    let outDiv = document.createElement("div");
    for (let i = 0; i < qopsarr.length; i++) {
        let divNode = document.createElement("div");

        let newRadio = document.createElement('input');
        newRadio.type = 'radio';
        newRadio.id = `q${qnum}a${i}`;
        newRadio.name = `q${qnum}`;
        newRadio.value = `${qopsarr[i].Choice}`;

        for(let k = 0; k < ans.length; k++){
            if(ans[k].Selected === qopsarr[i].Choice) {
                newRadio.checked = "checked";
                continue;
            }
        }

        let labelNode = document.createElement('label');
        let t = document.createTextNode(`${qopsarr[i].Choice}`);
        labelNode.setAttribute("for", `q${qnum}a${i}`);

        labelNode.appendChild(newRadio);
        labelNode.appendChild(t);
        labelNode.className = "quiz-input";
        divNode.appendChild(labelNode);

        if(qopsarr[i].Points > 0) {
            divNode.className = "answer";
        }

        outDiv.appendChild(divNode);
    }

    return outDiv;
}

function generateSelectAll(qops, ans, qnum) {
    let qopsarr = JSON.parse(qops);
    let outDiv = document.createElement("div");
    for (let i = 0; i < qopsarr.length; i++) {
        let divNode = document.createElement("div");

        let newCheckBox = document.createElement('input');
        newCheckBox.type = 'checkbox';
        newCheckBox.id = `q${qnum}a${i}`;
        newCheckBox.name = `q${qnum}`;
        newCheckBox.value = `${qopsarr[i].Choice}`;

        for(let k = 0; k < ans.length; k++){
            if(ans[k].Selected === qopsarr[i].Choice) {
                newCheckBox.checked = "checked";
                continue;
            }
        }

        let labelNode = document.createElement('label');
        let t = document.createTextNode(`${qopsarr[i].Choice}`);
        labelNode.setAttribute("for", `q${qnum}a${i}`);

        labelNode.appendChild(newCheckBox);
        labelNode.appendChild(t);
        labelNode.className = "quiz-input";
        divNode.appendChild(labelNode);

        if(qopsarr[i].Points > 0) {
            divNode.className = "answer";
        }

        outDiv.appendChild(divNode);
    }

    return outDiv;
}

function generateFreeFormField(qnum, atext) {
    let freeform = document.createElement('textarea');

    // Set freeform attributes
    freeform.id = `q${qnum}`;
    freeform.name = `q${qnum}`;
    freeform.rows = "3";
    freeform.cols = "50";
    freeform.maxlength = "20000";
    freeform.value = atext;

    return freeform;
}

/*Add event listeners. */
if (document.getElementById("quiz")) {
    window.addEventListener('load', displayQuiz);
}

