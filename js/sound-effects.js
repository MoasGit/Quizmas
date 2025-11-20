const correctSound = new Audio("./audio/correct.wav");
const incorrectSound = new Audio("./audio/incorrect.wav");
const timeRunningOutSound = new Audio("./audio/time-running-out.wav");
const jingleSound = new Audio("./audio/jingle.wav");
const timeIsUpSound = new Audio("./audio/time-is-up.mp3");

//LJUDUPPSPELNING OCH MUTING
let muted = false;

export function playSound(audioElement) {
  if (!muted) {
    audioElement.currentTime = 0;
    audioElement.play();
  }
}

//MUTE KNAPP
export function setupMuteButton(button) {
  button.addEventListener("click", function () {
    muted = !muted;

    if (muted) {
      button.innerHTML = `<i data-lucide="volume-off"></i>`;
      button.classList.add("muted");
    } else {
      // make sure the HTML is well-formed and re-create lucide icons
      button.innerHTML = `<i data-lucide="volume-2"></i>`;
      button.classList.remove("muted");
    }
    if (
      typeof lucide !== "undefined" &&
      typeof lucide.createIcons === "function"
    ) {
      lucide.createIcons();
    }
  });
}

export {
  correctSound,
  incorrectSound,
  timeRunningOutSound,
  jingleSound,
  timeIsUpSound,
};
