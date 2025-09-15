// Show message
function showMessage() {
  alert("Good Luck Cooking! 🍝");
}

// Mark recipe steps as done when clicked
const steps = document.querySelectorAll("#steps li");
steps.forEach(step => {
  step.addEventListener("click", function() {
    this.classList.toggle("done");
  });
});

// Add style for done steps
const style = document.createElement("style");
style.innerHTML = `
  .done {
    text-decoration: line-through;
    color: gray;
  }
`;
document.head.appendChild(style);

/* ----------------------------
   Cooking Quiz
----------------------------- */
const quizData = [
  {
    question: "Which ingredient makes pasta sauce creamy?",
    options: ["Milk", "Cream", "Water", "Butter"],
    answer: "Cream"
  },
  {
    question: "Which is the main ingredient in pasta?",
    options: ["Rice", "Wheat", "Corn", "Oats"],
    answer: "Wheat"
  },
  {
    question: "What oil is most commonly used in Italian cooking?",
    options: ["Coconut Oil", "Olive Oil", "Sunflower Oil", "Mustard Oil"],
    answer: "Olive Oil"
  }
];

const quizContainer = document.getElementById("quiz-container");

quizData.forEach((q, index) => {
  const div = document.createElement("div");
  div.classList.add("quiz-question");
  div.innerHTML = `
    <p>${index + 1}. ${q.question}</p>
    ${q.options.map(opt => `
      <label>
        <input type="radio" name="q${index}" value="${opt}"> ${opt}
      </label><br>`).join("")}
  `;
  quizContainer.appendChild(div);
});

function submitQuiz() {
  let score = 0;
  quizData.forEach((q, index) => {
    const selected = document.querySelector(`input[name="q${index}"]:checked`);
    if (selected && selected.value === q.answer) {
      score++;
    }
  });
  document.getElementById("quiz-result").innerText =
    `You scored ${score} out of ${quizData.length}!`;
}

/* ----------------------------
   Fetch Food Joke API
----------------------------- */
async function getFoodJoke() {
  try {
    const response = await fetch("https://official-joke-api.appspot.com/random_joke");
    const data = await response.json();
    document.getElementById("joke").innerText = `${data.setup} - ${data.punchline}`;
  } catch (error) {
    document.getElementById("joke").innerText = "Oops! Couldn’t fetch a joke.";
  }
}
