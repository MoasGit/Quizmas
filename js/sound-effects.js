const correctSound = new Audio("./audio/correct.wav");
const incorrectSound = new Audio("./audio/incorrect.wav");
const timeRunningOutSound = new Audio("./audio/time-running-out.wav");
const jingleSound = new Audio("./audio/jingle.wav");

//LJUDUPPSPELNING OCH MUTING
let muted = false;

export function playSound(audioElement) {
  if (!muted) {
    audioElement.currentTime = 0;
    audioElement.play();
  }
}

export function setupMuteButton(button) {
  button.addEventListener("click", function () {
    muted = !muted;

    if (muted) {
      button.textContent = "🔇";
      button.classList.add("muted");
    } else {
      button.textContent = "🔊";
      button.classList.remove("muted");
    }
  });
}

export { correctSound, incorrectSound, timeRunningOutSound, jingleSound };
