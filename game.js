const question = document.getElementById("question");
const choices = Array.from(document.getElementsByClassName("choice-text"));
const progressText = document.getElementById("progressText");
const progressBarFull = document.getElementById("progressBarFull");
const scoerText = document.getElementById("score");
const loader = document.getElementById("loader");
const game = document.getElementById("game");
// console.log(choices);

let currentQuestion = {};
let acceptingAnswer = false;
let score = 0;
let questionCounter = 0;
let availableQuetions = [];

let questions = [];

// below method is for local questions.

// fetch("Questions.json")
//   .then((res) => {
//     return res.json();
//   })
//   .then((loadedQuestions) => {
//     console.log(loadedQuestions);
//     questions = loadedQuestions;
//     startGame();
//   })
//   .catch((err) => {
//     console.log(err);
//   });

//This for getting questions from API

fetch(
  "https://opentdb.com/api.php?amount=10&category=18&difficulty=easy&type=multiple"
)
  .then((res) => {
    return res.json();
  })
  .then((loadedQuestions) => {
    console.log(loadedQuestions.results);
    //Conversion of questions get from API to according to our local questions
    questions = loadedQuestions.results.map((loadedQuestion) => {
      const formattedQuestion = {
        question: loadedQuestion.question,
      };

      const answerChoices = [...loadedQuestion.incorrect_answers];
      formattedQuestion.answer = Math.floor(Math.random() * 3) + 1;
      answerChoices.splice(
        formattedQuestion.answer - 1,
        0,
        loadedQuestion.correct_answer
      );

      answerChoices.forEach((choice, index) => {
        formattedQuestion["choice" + (index + 1)] = choice;
      });

      return formattedQuestion;
    });

    startGame();
  })
  .catch((err) => {
    console.log(err);
  });

//CONSTANTS

const CORRECT_BONUS = 10;
const MAX_QUESTIONS = 10;

startGame = () => {
  questionCounter = 0;
  score = 0;
  availableQuetions = [...questions];
  // we are not doing `availableQuestions = questions` becoz then it will point same array(question) and if we done any modification on availableQuestions array then it will reflect on original questions array also.
  // console.log(availableQuetions);

  game.classList.remove("hidden");
  loader.classList.add("hidden");
  getNewQuestion();
};

getNewQuestion = () => {
  if (availableQuetions.length === 0 || questionCounter >= MAX_QUESTIONS) {
    localStorage.setItem("mostRecentScore", score);
    // go to the end page
    return window.location.assign("/end.html");
  }

  questionCounter++;
  progressText.innerText = `Question : ${questionCounter} / ${MAX_QUESTIONS}`;

  //Update the progress bar
  progressBarFull.style.width = `${(questionCounter / MAX_QUESTIONS) * 100}%`;

  const questionIndex = Math.floor(Math.random() * availableQuetions.length);
  //   console.log(questionIndex);
  currentQuestion = availableQuetions[questionIndex];
  question.innerHTML = currentQuestion.question;

  choices.forEach((choice) => {
    const number = choice.dataset.number;
    choice.innerText = currentQuestion["choice" + number];
  });

  availableQuetions.splice(questionIndex, 1);

  acceptingAnswer = true;
};

choices.forEach((choice) => {
  choice.addEventListener("click", (e) => {
    // console.log(e.target);
    if (!acceptingAnswer) return;

    acceptingAnswer = false;
    const selectedChoice = e.target;
    const selectedAnswer = selectedChoice.dataset["number"];
    const classToApply =
      selectedAnswer == currentQuestion.answer ? "correct" : "incorrect";
    console.log(classToApply);

    selectedChoice.parentElement.classList.add(classToApply);

    setTimeout(() => {
      if (selectedAnswer == currentQuestion.answer)
        incrementScore(CORRECT_BONUS);
      selectedChoice.parentElement.classList.remove(classToApply);
      getNewQuestion();
    }, 1000);
  });
});

incrementScore = (num) => {
  score += num;
  scoerText.innerText = score;
};
