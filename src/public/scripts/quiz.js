/************************************************************************
Project: Software Programming Quiz
Author: Li, Feng, Tauiliili
Created: 2024-01-24
Last Updated: 2024-02-24
Purpose: For dynamically building the quiz
************************************************************************/

/************************************************************************
** Build Quiz Form HTML
************************************************************************/

function createQuiz() {
    let urlpathnamearr = window.location.pathname.split('/');
    var xmlhttp = new XMLHttpRequest(),
        getUrl = window.location.origin + '/quiz-questions?quiz_key=' + urlpathnamearr[2];

    xmlhttp.open('GET', getUrl, true);
    xmlhttp.send();

    xmlhttp.onreadystatechange = () => {
        if (xmlhttp.readyState === XMLHttpRequest.DONE || xmlhttp.readyState === 4) {
            if (xmlhttp.status >= 200 && xmlhttp.status < 400) {
                console.log(xmlhttp.responseText);
                let qq = JSON.parse(xmlhttp.responseText).quiz_questions;
                if (qq.length > 0) {
                    generateQuizForm(qq);
                } else {
                    console.log("No Question Questions found")
                }
            } else {
                console.log("Error in network request: " + req.statusText);
            }
        }
    };
}

function generateQuizForm(qq) {
    let quizEl = document.createElement("div");

    for (let i = 0; i < qq.length; i++) {
        let qNode = document.createElement("li");
        let qTextNode = document.createElement("p");
        let qText = document.createTextNode(qq[i].question_text);
        let aNode;

        qTextNode.appendChild(qText);
        qNode.appendChild(qTextNode);

        switch (qq[i].question_type) {
            case 'TF':
            case 'MC':
                // T/F or Multiple Choice Radio Buttons
                aNode = generateRadioButtons(qq[i].correct_answer, qq[i].question_number);
                break;
            case 'CB':
                // select all that apply
                aNode = generateSelectAll(qq[i].correct_answer, qq[i].question_number);
                break;
            case 'FR':
                // Freeform text
                aNode = generateFreeFormField(qq[i].question_number);
                break;
        }

        qNode.appendChild(aNode);
        document.getElementById("quiz-questions-answers").appendChild(qNode);
    }
}

function generateRadioButtons(qops, qnum) {
    let qopsarr = JSON.parse(qops);
    let outDiv = document.createElement("div");
    for (let i = 0; i < qopsarr.length; i++) {
        let divNode = document.createElement("div");

        let newRadio = document.createElement('input');
        newRadio.type = 'radio';
        newRadio.id = `q${qnum}a${i}`;
        newRadio.name = `q${qnum}`;
        newRadio.value = `${qopsarr[i].Choice}`;

        let labelNode = document.createElement('label');
        let t = document.createTextNode(`${qopsarr[i].Choice}`);
        labelNode.setAttribute("for", `q${qnum}a${i}`);

        labelNode.appendChild(newRadio);
        labelNode.appendChild(t);
        labelNode.className = "quiz-input";
        divNode.appendChild(labelNode);

        outDiv.appendChild(divNode);
    }

    return outDiv;
}

function generateSelectAll(qops, qnum) {
    let qopsarr = JSON.parse(qops);
    let outDiv = document.createElement("div");
    for (let i = 0; i < qopsarr.length; i++) {
        let divNode = document.createElement("div");

        let newCheckBox = document.createElement('input');
        newCheckBox.type = 'checkbox';
        newCheckBox.id = `q${qnum}a${i}`;
        newCheckBox.name = `q${qnum}`;
        newCheckBox.value = `${qopsarr[i].Choice}`;

        let labelNode = document.createElement('label');
        let t = document.createTextNode(`${qopsarr[i].Choice}`);
        labelNode.setAttribute("for", `q${qnum}a${i}`);

        labelNode.appendChild(newCheckBox);
        labelNode.appendChild(t);
        labelNode.className = "quiz-input";
        divNode.appendChild(labelNode);

        outDiv.appendChild(divNode);
    }

    return outDiv;
}

function generateFreeFormField(qnum) {
    let freeform = document.createElement('textarea');

    // Set freeform attributes
    freeform.id = `q${qnum}`;
    freeform.name = `q${qnum}`;
    freeform.rows = "3";
    freeform.cols = "50";
    freeform.maxlength = "20000";

    return freeform;
}

/************************************************************************
** Add event listeners.
************************************************************************/
if (document.getElementById("quiz")) {
    window.addEventListener('load', createQuiz);
}

