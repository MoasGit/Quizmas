//SÄTTER VARIABLER FÖR DOM-ELEMENT

const themeMusicButton = document.getElementById("theme-music");
const themeMoviesButton = document.getElementById("theme-movies");
const themeGeographyButton = document.getElementById("theme-geography");
const themeChristmasButton = document.getElementById("theme-christmas");

const nameView = document.getElementById("name-container");
const themeSelectView = document.getElementById("theme-select-container");
const quizView = document.getElementById("quiz-container");
const resultsView = document.getElementById("results-container");

const nameInputField = document.getElementById("name-input-field");
const nameInputBtn = document.getElementById("name-input-button");

const nameDisplay = document.getElementById("name-display");
const answerCheckDisplay = document.getElementById("answer-check-display");

const nextQuestionBtn = document.getElementById("next-question-button");

const playerScore = document.getElementById("player-score");
const totalScore = document.getElementById("total-score");
console.log(totalScore.value);

const restartBtn = document.getElementById("restart-button");


///////////////////////

/////SÄTTER DEFAULT VÄRDEN FÖR INDEXEN FÖR FRÅGORNA OCH POÄNG
let questionIndex = -1;
let playerPoints = 0;
let playerTotalScore = 0;

///STYR VAD KNAPPEN SKA GÖRA I NAMN CONTAINERN
nameInputBtn.addEventListener("click", function (e) {
  e.preventDefault();
  const playerName = nameInputField.value.trim() || "Player"; //Tar bort empy spaces (AI)
  nameView.classList.remove("active");
  themeSelectView.classList.add("active");
  nameDisplay.textContent = `Welcome ${playerName}!`;
});

///LADDAR IN DATAN FRÅN JSON-FILEN
async function fetchQuiz(themeChoice) {
  try {
    const response = await fetch("/data/quiz.json");

    if (!response.ok) {
      throw new Error(`HTTP error status ${response.status}`);
    }

    const data = await response.json();
    // Use the themeChoice to select the correct theme array
    const selectedTheme = data.themes[themeChoice];
    console.log(`Loading ${themeChoice} theme:`, selectedTheme);
    displayQuiz(selectedTheme);
  } catch (error) {
    console.error("Type of error", error);
  }
}

///DET HÄR GJORDE AI - EVENTLYSSNARE FÖR TEMAVAL-KNAPPARNA (VARFÖR WRAPPA FUNKTION I FUNKTION???)
// Add click handlers - pass the theme name as a string and wrap fetchQuiz in a function
themeMusicButton.addEventListener("click", () => fetchQuiz("music"));
themeGeographyButton.addEventListener("click", () => fetchQuiz("geography"));
themeMoviesButton.addEventListener("click", () => fetchQuiz("movies"));
themeChristmasButton.addEventListener("click", () => fetchQuiz("christmas"));

///VISA VALT TEMA I QUIZ CONTAINERN (SKAPAR ELEMENT FÖR FRÅGOR OCH SVARSKNAPPAR)
function displayQuiz(themes) {
  console.log("themes received:", themes);

  let savedScore = localStorage.getItem("playerScoreHistory");
  savedScore = Number(savedScore);
  console.log(savedScore);

  const arrLength = themes.length;
  console.log(arrLength);

  themeSelectView.classList.remove("active");
  quizView.classList.add("active");
  questionIndex++;
  quizView.innerHTML = "";
  console.log("nu visas fråga nummer:" + questionIndex);

  //// SKAPAR BILDCONTAINER OCH SÄTTER BAKGRUNDSBILD FRÅN JSON

  const questionImage = document.createElement("div");
  questionImage.classList.add("question-image-container");
  questionImage.style.backgroundImage = `url('${themes[questionIndex].image}')`;
  questionImage.style.backgroundSize = "cover"; // or "contain" depending on what you want
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
  nextBtn.innerHTML = `Next question`;
  nextBtn.classList.add("next-question-button");
  quizView.appendChild(nextBtn);

  ////NÄSTA-KNAPP EFTER VARJE FRÅGA
  ////IFALL MAN NÅTT GRÄNSEN PÅ ANTAL FRÅGOR SÅ STOPPAR DEN OCH VISAR RESULTS
  nextBtn.addEventListener("click", function () {
    if (questionIndex < arrLength - 1) {
      displayQuiz(themes);
    } else {
      quizView.classList.remove("active");
      resultsView.classList.add("active");
      playerScore.innerHTML = `Total score ${playerPoints}`;
      playerTotalScore += playerPoints;
      questionIndex = -1;
      console.log(playerTotalScore);
      localStorage.setItem("playerScoreHistory", playerTotalScore);
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

  ///FUNKTIONEN SOM CHECKAR OM SVARET ÄR RÄTT
  function checkAnswer(selectedIdx) {
    ///DISABLEA KNAPPARNA EFTER MAN SVARAT
    const answerButtons = quizView.querySelectorAll(".answer-button");
    for (let i = 0; i < answerButtons.length; i++) {
      answerButtons[i].disabled = true;
    }

    ///SÄTTER EN KLASS PÅ KNAPPARNA FÖR SYNS SKULL
    if (selectedIdx === correctIndex) {
      answerCheck.innerHTML = `<span class="correct">Du hade rätt!</span>`;

      //DESSA ÄR BARA HÄR FÖR ATT RE-TRIGGA ANIMATIONEN
      answerCheck.style.animation = "none";
      answerCheck.offsetHeight;
      answerCheck.style.animation = "";

      ///LÄGGER TILL POÄNG OM SVARET ÄR RÄTT
      playerPoints++;
    } else {
      answerCheck.innerHTML = `<span class="incorrect">Du hade fel!</span>`;
      //DESSA ÄR BARA HÄR FÖR ATT RE-TRIGGA ANIMATIONEN
      answerCheck.style.animation = "none";
      answerCheck.offsetHeight;
      answerCheck.style.animation = "";
    }
  }
  //TAR DIG TILLBAKA TILL TEMAVAL-CONTAINERN
  let backToMainBtn = document.createElement("button");
  backToMainBtn.innerHTML = `&#8617`;
  backToMainBtn.classList.add("back-to-main-button");
  quizView.appendChild(backToMainBtn);
  
    backToMainBtn.addEventListener("click", function () {
    quizView.classList.remove('active');
    themeSelectView.classList.add('active');
    playerPoints = 0;
    questionIndex = -1;
  });
}
///NOLLSTÄLLER QUIZZET OCH GÅR TILLBAKS TILL TEMAVAL-CONTAINERN
restartBtn.addEventListener("click", function () {
  resultsView.classList.remove("active");
  themeSelectView.classList.add("active");
  playerPoints = 0;
});

    
