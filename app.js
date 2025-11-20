//IMPORTS
import {
  correctSound,
  incorrectSound,
  jingleSound,
  timeIsUpSound,
  setupMuteButton,
  playSound,
} from "./js/sound-effects.js";

import { init, start, stop } from "./js/timer.js";

//SÄTTER VARIABLER FÖR DOM-ELEMENT

const quizTimer = document.getElementById("question-timer");
const themeMusicButton = document.getElementById("theme-music");
const themeMoviesButton = document.getElementById("theme-movies");
const themeGeographyButton = document.getElementById("theme-geography");
const themeChristmasButton = document.getElementById("theme-christmas");

const nameView = document.getElementById("name-container");
const themeSelectView = document.getElementById("theme-select-container");
const quizView = document.getElementById("quiz-container");
const resultsView = document.getElementById("results-container");
const totalScoreDisplay = document.getElementById("player-total-score-display");

const nameInputField = document.getElementById("name-input-field");
const nameInputBtn = document.getElementById("name-input-button");
const playerChoice = document.getElementById("player-choice");
const playerList = document.getElementById("player-list");

const nameDisplay = document.getElementById("name-display");
const answerCheckDisplay = document.getElementById("answer-check-display");

const switchUserBtn = document.getElementById("switch-user-button");

const nextQuestionBtn = document.getElementById("next-question-button");

const playerScore = document.getElementById("player-score");
const totalScore = document.getElementById("total-score");
const highScore = document.getElementById("high-score");

let playerName;

let playersArray = [];

const restartBtn = document.getElementById("restart-button");

///////////////////////

/////SÄTTER DEFAULT VÄRDEN FÖR INDEXEN FÖR FRÅGORNA OCH POÄNG
let questionIndex = -1;
let playerPoints = 0;
let playerTotalScore = 0;

///LÄGGER TILL SPELARVAL FRÅN LOCALSTORAGE//
nameInputField.addEventListener("focus", () => {
  playerList.innerHTML = "";
  let playerNames =
    JSON.parse(localStorage.getItem("playerScoreHistory")) || [];
  if (playerNames.length > 0) {
    playerChoice.style.visibility = "visible";
    playerNames.forEach((name) => {
      let span = document.createElement("span");
      span.textContent = `${name.name}`;
      span.style.marginLeft = "14px";
      span.style.fontSize = "1.2rem";
      span.style.color = "white";
      playerList.appendChild(span);
      span.addEventListener("click", () => {
        nameInputField.value = span.textContent;
      });
    });
  }
});

//Spara namnet och gå vidare till theme select
nameInputBtn.addEventListener("click", function (e) {
  e.preventDefault();
  playerName = nameInputField.value.trim() || "Tomtenisse"; //Tar bort empy spaces (AI)
  nameView.classList.remove("active");
  themeSelectView.classList.add("active");
  creditsBtn.style.display = "none";
  nameDisplay.textContent = `Välkommen ${playerName}!`;
});

///KNAPP FÖR ATT BYTA ANVÄNDARE
switchUserBtn.addEventListener("click", function () {
  themeSelectView.classList.remove("active");
  nameView.classList.add("active");
  nameInputField.value = "";
  creditsBtn.style.display = "flex";
});

///LADDAR IN DATAN FRÅN JSON-FILEN
async function fetchQuiz(themeChoice) {
  try {
    const response = await fetch("./quiz.json");

    if (!response.ok) {
      throw new Error(`HTTP error status ${response.status}`);
    }
    
    const data = await response.json();
    // Use the themeChoice to select the correct theme array
    const selectedTheme = data.themes[themeChoice];
    displayQuiz(selectedTheme);
  } catch (error) {
    console.error("Type of error", error);
  }
}
////Credits modal
 const creditsBtn = document.createElement("button");
 creditsBtn.innerHTML ='©';
 creditsBtn.classList.add("credits-button");
 document.body.appendChild(creditsBtn);


 const creditsModal = document.getElementById("credits-modal");
 const closeCreditsBtn = document.querySelector(".close-cred-btn");

 creditsBtn.addEventListener("click", function () {
   creditsModal.style.display = "flex";
 });

 closeCreditsBtn.addEventListener("click", function () {
   creditsModal.style.display = "none";
 });

 window.addEventListener("click", (event) => {
  if (event.target === creditsModal) {
    creditsModal.style.display = "none";
  }
});

/////HIGHSCORE MODAL SOM VISAR TOPP 5 SPELARE
const highscoreBtn = document.createElement("button");
highscoreBtn.innerHTML =
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M144.3 0l224 0c26.5 0 48.1 21.8 47.1 48.2-.2 5.3-.4 10.6-.7 15.8l49.6 0c26.1 0 49.1 21.6 47.1 49.8-7.5 103.7-60.5 160.7-118 190.5-15.8 8.2-31.9 14.3-47.2 18.8-20.2 28.6-41.2 43.7-57.9 51.8l0 73.1 64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-192 0c-17.7 0-32-14.3-32-32s14.3-32 32-32l64 0 0-73.1c-16-7.7-35.9-22-55.3-48.3-18.4-4.8-38.4-12.1-57.9-23.1-54.1-30.3-102.9-87.4-109.9-189.9-1.9-28.1 21-49.7 47.1-49.7l49.6 0c-.3-5.2-.5-10.4-.7-15.8-1-26.5 20.6-48.2 47.1-48.2zM101.5 112l-52.4 0c6.2 84.7 45.1 127.1 85.2 149.6-14.4-37.3-26.3-86-32.8-149.6zM380 256.8c40.5-23.8 77.1-66.1 83.3-144.8L411 112c-6.2 60.9-17.4 108.2-31 144.8z"/></svg>';
highscoreBtn.classList.add("highscore-button");
document.body.appendChild(highscoreBtn);

const modal = document.getElementById("highscore-modal");
const closeBtn = document.querySelector(".close-btn");
const highscoreList = document.getElementById("high-score");

function showHighscores() {
  let playersArray =
    JSON.parse(localStorage.getItem("playerScoreHistory")) || [];

  let highScoreArray = playersArray
    .slice()
    .sort((a, b) => Number(b.score) - Number(a.score));
  highscoreList.innerHTML = "";

  highScoreArray.slice(0, 5).forEach((a) => {
    let li = document.createElement("li");
    li.innerHTML = `Spelare: ${a.name}, Score: ${a.score}`;
    highScore.appendChild(li);
  });
}

highscoreBtn.addEventListener("click", function () {
  showHighscores();
  modal.style.display = "flex";
});

closeBtn.addEventListener("click", function () {
  modal.style.display = "none";
});

window.addEventListener("click", (event) => {
  if (event.target === modal) {
    modal.style.display = "none";
  }
});

//FÅR DET ATT SNÖA!
let snowButton = document.createElement("button");
let snowing = false;
snowButton.innerHTML = "❄";
snowButton.classList.add("snowflake-button");
document.body.appendChild(snowButton);
snowButton.addEventListener("click", function () {
  if (!snowing) {
    createSnowflakes();
    snowing = true;
    playSound(jingleSound);
  } else {
    snowing = false;
    const snowflakes = document.querySelectorAll(".snowflake");
    snowflakes.forEach((snowflake) => snowflake.remove());
  }
});

function createSnowflakes() {
  for (let i = 0; i < 100; i++) {
    const snowflake = document.createElement("div");
    snowflake.className = "snowflake";
    snowflake.innerHTML = "❄";
    snowflake.style.left = Math.random() * 100 + "%";
    snowflake.style.animationDuration = Math.random() * 3 + 2 + "s";
    snowflake.style.animationDelay = Math.random() * 5 + "s";
    snowflake.style.fontSize = Math.random() * 10 + 10 + "px";
    document.body.appendChild(snowflake);
  }
}

///EVENTLYSSNARE FÖR TEMAVAL-KNAPPARNA
themeMusicButton.addEventListener("click", () => fetchQuiz("music"));
themeGeographyButton.addEventListener("click", () => fetchQuiz("geography"));
themeMoviesButton.addEventListener("click", () => fetchQuiz("movies"));
themeChristmasButton.addEventListener("click", () => fetchQuiz("christmas"));

//SKAPAR MUTE-KNAPP FÖR LJUDEFFEKTER
const mainContainer = document.querySelector(".main-container");
const muteBtn = document.createElement("button");
muteBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512"><path d="M533.6 32.5c-10.3-8.4-25.4-6.8-33.8 3.5s-6.8 25.4 3.5 33.8C557.5 113.8 592 180.8 592 256s-34.5 142.2-88.7 186.3c-10.3 8.4-11.8 23.5-3.5 33.8s23.5 11.8 33.8 3.5C598.5 426.7 640 346.2 640 256S598.5 85.2 533.6 32.5zM473.1 107c-10.3-8.4-25.4-6.8-33.8 3.5s-6.8 25.4 3.5 33.8C475.3 170.7 496 210.9 496 256s-20.7 85.3-53.2 111.8c-10.3 8.4-11.8 23.5-3.5 33.8s23.5 11.8 33.8 3.5c43.2-35.2 70.9-88.9 70.9-149s-27.7-113.8-70.9-149zm-60.5 74.5c-10.3-8.4-25.4-6.8-33.8 3.5s-6.8 25.4 3.5 33.8C393.1 227.6 400 241 400 256s-6.9 28.4-17.7 37.3c-10.3 8.4-11.8 23.5-3.5 33.8s23.5 11.8 33.8 3.5C434.1 312.9 448 286.1 448 256s-13.9-56.9-35.4-74.5zM80 352l48 0 134.1 119.2c6.4 5.7 14.6 8.8 23.1 8.8 19.2 0 34.8-15.6 34.8-34.8l0-378.4c0-19.2-15.6-34.8-34.8-34.8-8.5 0-16.7 3.1-23.1 8.8L128 160 80 160c-26.5 0-48 21.5-48 48l0 96c0 26.5 21.5 48 48 48z"/></svg>`;
muteBtn.classList.add("mute-button");
mainContainer.appendChild(muteBtn);
//DENNA FUNKTION IMPORTERAS OCH KÖRS I sound-effects.js
setupMuteButton(muteBtn);

///VISA VALT TEMA I QUIZ CONTAINERN (SKAPAR ELEMENT FÖR FRÅGOR OCH SVARSKNAPPAR)
function displayQuiz(themes) {
  let recentScores = JSON.parse(localStorage.getItem("playerScoreHistory"));
  highscoreBtn.style.display = "none";
  creditsBtn.style.display = "none";

  playersArray = Array.isArray(recentScores) ? recentScores : [];

  const arrLength = themes.length;

  themeSelectView.classList.remove("active");
  quizView.classList.add("active");
  questionIndex++;
  quizView.innerHTML = "";
  console.log("nu visas fråga nummer:" + questionIndex);

  //// SKAPAR BILDCONTAINER OCH SÄTTER BAKGRUNDSBILD FRÅN JSON

  const questionImage = document.createElement("div");
  questionImage.classList.add("question-image-container");
  questionImage.style.backgroundImage = `url('${themes[questionIndex].image}')`;
  questionImage.style.backgroundSize = "cover";
  questionImage.style.backgroundPosition = "center";
  questionImage.style.backgroundRepeat = "no-repeat";
  quizView.appendChild(questionImage);

  //////

  const questionText = document.createElement("p");
  questionText.innerHTML = `${themes[questionIndex].question}`;
  questionText.classList.add("question-text");
  quizView.appendChild(questionText);

  let answerCheck = document.createElement("p");
  answerCheck.innerHTML = ``;
  answerCheck.classList.add("answer-check-text");
  quizView.appendChild(answerCheck);

  let nextBtn = document.createElement("button");
  nextBtn.innerHTML = `Nästa fråga &#8594;`;
  nextBtn.classList.add("next-question-button");
  nextBtn.style.display = "none";
  quizView.appendChild(nextBtn);

  ////NÄSTA-KNAPP EFTER VARJE FRÅGA
  ////IFALL MAN NÅTT GRÄNSEN PÅ ANTAL FRÅGOR SÅ STOPPAR DEN OCH VISAR RESULTS
  nextBtn.addEventListener("click", function () {
    if (questionIndex < arrLength - 1) {
      stop();
      timeUpMessage.style.display = "none";
      displayQuiz(themes);
    } else {
      stop();
      timeUpMessage.style.display = "none";
      quizView.classList.remove("active");
      resultsView.classList.add("active");
      playerScore.innerHTML = `Total score ${playerPoints}`;
      playerTotalScore = playerPoints;

      let thisPlayer = {
        name: playerName,
        score: Number(playerTotalScore),
      };
      for (let i = 0; i < playersArray.length; i++) {
        if (playersArray[i].name == playerName) {
          playersArray[i].score += playerTotalScore;
        }
      }

      let found = false;
      for (let i = 0; i < playersArray.length; i++) {
        if (playersArray[i].name == playerName) {
          totalScoreDisplay.innerHTML = `Spelare: ${playerName}, Totala quizpoäng: ${playersArray[i].score}`;
          found = true;
          break;
        }
      }
      if (found == false) {
        totalScoreDisplay.innerHTML = `Ny spelare: ${playerName}, Totala quizpoäng: ${playerTotalScore}`;
      }

      questionIndex = -1;
      console.log(playerTotalScore);

      if (found == false) {
        playersArray.push(thisPlayer);
      }

      localStorage.setItem("playerScoreHistory", JSON.stringify(playersArray));

      let highScoreArray = playersArray
        .slice()
        .sort((a, b) => Number(b.score) - Number(a.score));

      highScoreArray.slice(0, 5).forEach((a) => {
        let li = document.createElement("li");
        li.innerHTML = `Spelare: ${a.name}, Score: ${a.score}`;
        highScore.appendChild(li);
      });
    }
  });

  let options = themes[questionIndex].options;
  let correctIndex = themes[questionIndex].answer;

  ////LOOP SOM SKAPAR EN KNAPP FÖR VARJE SVARSALTERNATIV
  options.forEach((option, idx) => {
    let btn = document.createElement("button");
    btn.innerHTML = `${option}`;
    btn.classList.add("answer-button");
    quizView.appendChild(btn);

    ///STARTAR CHECKFUNKTIONEN OCH SKICKAR MED SVARET MAN KLICKADE PÅ
    btn.addEventListener("click", function () {
      checkAnswer(idx);

      console.log(questionIndex);
    });
  });

  const answerButtons = quizView.querySelectorAll(".answer-button");

  ///FUNKTIONEN SOM CHECKAR OM SVARET ÄR RÄTT
  function checkAnswer(selectedIdx) {
    ///DISABLEA KNAPPARNA EFTER MAN SVARAT
    for (let i = 0; i < answerButtons.length; i++) {
      answerButtons[i].disabled = true;
    }

    ///SÄTTER EN KLASS PÅ KNAPPARNA FÖR SYNS SKULL
    if (selectedIdx === correctIndex) {
      playSound(correctSound);
      answerCheck.innerHTML = `<span class="correct">Du hade rätt!</span>`;

      //DESSA ÄR BARA HÄR FÖR ATT RE-TRIGGA ANIMATIONEN
      answerCheck.style.animation = "none";
      answerCheck.offsetHeight;
      answerCheck.style.animation = "";

      ///LÄGGER TILL POÄNG OM SVARET ÄR RÄTT
      playerPoints++;
    } else if (selectedIdx != correctIndex || timeLeft < -1) {
      playSound(incorrectSound);
      answerCheck.innerHTML = `<span class="incorrect">Du hade fel!</span>`;
      //DESSA ÄR BARA HÄR FÖR ATT RE-TRIGGA ANIMATIONEN
      answerCheck.style.animation = "none";
      answerCheck.offsetHeight;
      answerCheck.style.animation = "";
    }

    nextBtn.style.display = "block";
    stop();
  }
  //TAR DIG TILLBAKA TILL TEMAVAL-CONTAINERN
  let backToMainBtn = document.createElement("button");
  backToMainBtn.innerHTML = `&#8617`;
  backToMainBtn.classList.add("back-to-main-button");
  quizView.appendChild(backToMainBtn);

  backToMainBtn.addEventListener("click", function () {
    stop();
    quizView.classList.remove("active");
    themeSelectView.classList.add("active");
    playerPoints = 0;
    questionIndex = -1;
    highscoreBtn.style.display = "flex";
  });

  //Skapa timesup message i HTML
  let timeUpMessage = document.createElement("p");
  timeUpMessage.id = "time-up-message";
  timeUpMessage.classList.add("time-up-message");
  timeUpMessage.style.display = "none";
  quizView.appendChild(timeUpMessage);

  //Skapa timern i HTML
  let quizTimer = document.createElement("div");
  quizTimer.id = "question-timer";
  quizTimer.classList.add("quizTimer");

  let timerText = document.createElement("span");
  timerText.classList.add("timer-text");
  timerText.textContent = "10";

  let timerBar = document.createElement("div");
  timerBar.classList.add("timer-bar");

  let timerBarFill = document.createElement("div");
  timerBarFill.classList.add("timer-bar-fill");

  timerBar.appendChild(timerBarFill);
  quizTimer.appendChild(timerText);
  quizTimer.appendChild(timerBar);

  quizView.appendChild(quizTimer);

  //Initierar timern och sätter villkor för när tiden tar slut
  init(quizTimer, function () {
    timeUpMessage.style.display = "block";
    nextBtn.style.display = "block";
    playSound(timeIsUpSound);
    const timeUpMsg = document.querySelector(".time-up-message");
    const nextButton = document.querySelector(".next-question-button");
    const answerCheckText = document.querySelector(".answer-check-text");

    if (timeUpMsg) {
      timeUpMsg.style.display = "block";
    }

    if (nextButton) {
      nextButton.style.display = "block";
    }

    const answerButtons = quizView.querySelectorAll(".answer-button");
    answerButtons.forEach((btn) => {
      btn.disabled = true;
    });

    if (answerCheckText) {
      answerCheckText.innerHTML = `<span class="incorrect">Tiden är slut!</span>`;
      answerCheckText.style.animation = "none";
      answerCheckText.offsetHeight;
      answerCheckText.style.animation = "";
    }
  });
}

start();

///NOLLSTÄLLER QUIZZET OCH GÅR TILLBAKS TILL TEMAVAL-CONTAINERN
restartBtn.addEventListener("click", function () {
  resultsView.classList.remove("active");
  themeSelectView.classList.add("active");
  highscoreBtn.style.display = "flex";
  playerPoints = 0;
});
