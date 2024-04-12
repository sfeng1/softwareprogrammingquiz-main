/************************************************************************
Project: Software Programming Quiz
Author: Li, Feng, Tauiliili
Created: 2024-02-07
Last Updated: 2024-02-07
************************************************************************/
let five_minute_warning = false;
let two_minute_warning = false;

//store timer in local storage on browser
let currenttime = parseInt(localStorage.getItem("timer"));

if (currenttime != null) {
    let timerInterval = setInterval(currenttime, 100);
}

function timer() {
    currenttime = parseInt(localStorage.getItem("timer"));
    let now = new Date();
    let countDownTime = new Date(currenttime);
    timerInMs = countDownTime.getTime() - now.getTime();
    if ( document.getElementById("timer")) {
        let mytime = msToTime(timerInMs);
    
        if (timerInMs <= 0) {
            document.getElementById("timer").innerHTML = "00 hours: 00 minutes: 00 seconds";
            document.getElementById("timer").setAttribute("class", "timer error");
            let modal = document.getElementById("timeout-modal");
            modal.style.display = "block";
        } else {
            document.getElementById("timer").innerHTML = mytime;
            if (timerInMs <= 120000) {
                // warning style when hitting the 2 minute mark
                document.getElementById("timer").setAttribute("class", "timer error");
                if(!two_minute_warning){
                    let modal = document.getElementById("warning-modal");
                    modal.style.display = "block";
                    modal.innerHTML = `<div class="modal-content error" id="warning-modal"><div> \
                        <div class="close" id="close-modal" onclick="closemodal()">&times;</div><p>Please be mindful you have 2 minutes left.</div></div>`;
                    two_minute_warning = true;
                }
            } else if(timerInMs <= 300000) {
                // if less than 5 minutes
                document.getElementById("timer").setAttribute("class", "timer warning");
                if(!five_minute_warning){
                    let modal = document.getElementById("warning-modal");
                    modal.style.display = "block";
                    modal.innerHTML = `<div class="modal-content warning" id="warning-modal"><div> \
                        <div class="close" id="close-modal" onclick="closemodal()">&times;</div><p>Please be mindful you have 5 minutes left.</div></div>`;
                    five_minute_warning = true;
                }
            }
        }
    }
}

function msToTime(duration) {
    // console.log(duration);
    let seconds = Math.floor((duration / 1000) % 60),
        minutes = Math.floor((duration / (1000 * 60)) % 60),
        hours = Math.floor((duration / (1000 * 60 * 60)) % 24);

    hours = hours < 10 ? "0" + hours : hours;
    minutes = minutes < 10 ? "0" + minutes : minutes;
    seconds = seconds < 10 ? "0" + seconds : seconds;

    return (
        hours + " hours: " + minutes + " minutes: " + seconds + " seconds"
    );
}

function startTimer() {
    let timelimit = time.time_limit;
    let starttime = time.attempt_start_time;
    let timeInMs = timelimit * 60 * 1000; // time to count down to in ms
    const now = new Date(starttime);
    const countDownTime = new Date(now.getTime() + timeInMs);
    localStorage.setItem("timer", countDownTime.getTime()); // Store in local storage
    let timerInterval = setInterval(timer, 500);
}

// Submit form from modal
function submitform() {
    document.getElementById('quiz').submit();
}

// Close modal 
function closemodal() {
    let modal = document.getElementById("warning-modal");
    modal.style.display = "none";
}

  
/************************************************************************
** Add event listeners.
************************************************************************/
if (document.getElementById("timer")){
    window.addEventListener('load', startTimer);
}

document.getElementById('modalbtn-submit-quiz').addEventListener('click', submitform);