const username = document.getElementById("username");
const saveScoreBtn = document.getElementById("saveScoreBtn");
const finalScore = document.getElementById("finalScore");

const mostRecentScore = localStorage.getItem("mostRecentScore");
finalScore.innerText = `Your Score : ${mostRecentScore}`;
//Local store always stores the value in the form of key - value pair and value must be a string, so if you want to store array or another thing then you have to convert those data structure into string using JSON.stringify(..), then by using JSON.parse(..) you can get original data structure easily.
const highScores = JSON.parse(localStorage.getItem("highscores")) || [];
// console.log(highScores);

username.addEventListener("keyup", () => {
  saveScoreBtn.disabled = !username.value;
});

saveHighScore = (e) => {
  console.log("clicked the save btn");
  e.preventDefault();
  const score = {
    score: mostRecentScore,
    name: username.value,
  };

  highScores.push(score);
  highScores.sort((a, b) => {
    return b.score - a.score;
  });
  highScores.splice(5);

  localStorage.setItem("highscores", JSON.stringify(highScores));
  window.location.assign("/");

  // console.log(highScores);
};
