let quizTimer = null;
let timeLeft = 10;
let intervalId = null;
let timesUp = null;

//Uppdaterar det som visas i DOMen
function updateTimerText() {
    if (quizTimer) {
        quizTimer.textContent = timeLeft;
    }
}

//Körs vid varje sekund av nedräkningen
function tickTock() {
    timeLeft--;
    updateTimerText();

//Kollar om tiden är ute
if (timeLeft <= -1) {
    stop();
    if (timesUp) {
        timesUp();
    }
    }
}

//Initierar timern 
export function init(element, callback) {
    quizTimer = element;
    timesUp = callback;
}

//startar nedräkningen
export function start() {
    timeLeft = 10;
    updateTimerText();

    intervalId = setInterval(tickTock, 1000);
}


//stoppar timern
export function stop() {
    if (intervalId) {
        clearInterval(intervalId);
        intervalId = null;
    }
}