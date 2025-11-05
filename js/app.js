const themeMusicButton = document.getElementById("theme-music");
const themeMoviesButton = document.getElementById("theme-movies");
const themeGeographyButton = document.getElementById("theme-geography");
const themeChristmasButton = document.getElementById("theme-christmas");

const nameView = document.getElementById("name-container");
const themeSelectView = document.getElementById("theme-select-container");
const quizView = document.getElementById("quiz-container");

const nameInputField = document.getElementById("name-input-field");
const nameInputBtn = document.getElementById("name-input-button");

const nameDisplay = document.getElementById("name-display");
const answerCheckDisplay = document.getElementById("answer-check-display");

const nextQuestionBtn = document.getElementById("next-question-button");

nameInputBtn.addEventListener("click", function (e) {
  e.preventDefault();
  const playerName = nameInputField.value.trim() || "Player"; //Tar bort empy spaces (AI)
  nameView.classList.remove("active");
  themeSelectView.classList.add("active");
  nameDisplay.textContent = `Welcome ${playerName}!`;
});

themeMusicButton.addEventListener("click", startQuiz);

async function startQuiz() {
  try {
    const response = await fetch("/data/quiz.json");

    if (!response.ok) {
      throw new Error(`HTTP error status ${response.status}`);
    }

    const data = await response.json();

    displayQuiz(data.themes);

    console.log("Inne i asynkrona funktion getTodos()");
  } catch (error) {
    console.error("Type of error", error);
  }
}

function displayQuiz(themes) {
  const p = document.createElement("p");
  p.innerHTML = `${themes.music[0].question}`;
  quizView.appendChild(p);

  let options = themes.music[0].options;
  let correctIndex = themes.music[0].answer;

  options.forEach((option, idx) => {
    let btn = document.createElement("button");
    btn.innerHTML = `${option}`;
    quizView.appendChild(btn);
    btn.addEventListener("click", function () {
      checkAnswer(idx);
    });
  });

  function checkAnswer(selectedIdx) {
    const buttons = quizView.getElementsByTagName("button");
    for (let i = 0; i < buttons.length; i++) {
      buttons[i].disabled = true;
    }

    if (selectedIdx === correctIndex) {
      answerCheckDisplay.innerHTML = `<span class="correct">Du hade rätt!</span>`;
    } else {
      answerCheckDisplay.innerHTML = `<span class="incorrect">Du hade fel!</span>`;
    }
    nextQuestionBtn.classList.remove("hidden");
  }
}

nextQuestionBtn.addEventListener("click", function () {
  console.log("next question");
});
