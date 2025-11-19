//IMPORTS
import { timeRunningOutSound, playSound } from "./sound-effects.js";

let quizTimer = null;
let timeLeft = 10;
let intervalId = null;
let timesUp = null;

//Uppdaterar det som visas i DOMen
function updateTimerText() {
  if (quizTimer) {
    const textElement = quizTimer.querySelector(".timer-text");
    if (textElement) {
      textElement.textContent = timeLeft;
    }

    const barFill = quizTimer.querySelector(".timer-bar-fill");
    if (barFill) {
      const percentage = (timeLeft / 10) * 100;
      barFill.style.width = percentage + "%";
    }

    if (timeLeft <= 3) {
      quizTimer.classList.add("warning");
      playSound(timeRunningOutSound);
    } else {
      quizTimer.classList.remove("warning");
    }
  }
}

//Körs vid varje sekund av nedräkningen
function tickTock() {
  timeLeft--;
  updateTimerText();

  //Kollar om tiden är ute
  if (timeLeft <= 0) {
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
  start();
}

//startar nedräkningen
export function start() {
  stop();
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
