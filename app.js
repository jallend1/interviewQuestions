const QUESTION = document.getElementById("question");
const CATEGORIES = document.getElementById("categories");
const GENERATENEW = document.getElementById("generateNew");
const SAVEQUESTION = document.getElementById("saveQuestion");

let activeCategories = [];
let allQuestions = {};

async function getQuestions() {
  try {
    const data = await fetch("./data/questions.json");
    const questions = await data.json();
    allQuestions = questions;
    generateCategories(questions);
    pickAQuestion(questions);
  } catch (error) {
    console.log("Problemo!", error);
  }
}

const generateCategories = () => {
  const categories = Object.keys(allQuestions);
  categories.forEach(category => {
    activeCategories.push(category); // All categories active by default, so pops it into the array
  })
  const categoryList = categories.map((category) => {
    firstWord = category.split(" "); // Takes multi-word categories down to just one word for DOM ID/Name
    return `<div class="inputs">
              <input checked type="checkbox" id="${firstWord[0]}" name="${firstWord[0]}" />
              <label for="${firstWord[0]}">
                  ${category}
              </label>
            </div>`;
  });
  CATEGORIES.innerHTML = categoryList.join('');
};

const pickAQuestion = () => {
  const categoryList = Object.keys(allQuestions);
  // Selects random category from selected
  const randomCategoryName =
    activeCategories[Math.floor(Math.random() * activeCategories.length)];
  // Selects random number within selected category array lengths
  const randomNumber = Math.floor(
    Math.random() * allQuestions[randomCategoryName].length
  );
  const randomQuestion =
    allQuestions[randomCategoryName][randomNumber].question;
  renderQuestion(randomQuestion, randomCategoryName);
};

const renderQuestion = (question, category) => {
  QUESTION.innerText = question;
  QUESTION.dataset.category = category;
};

const saveQuestion = () => {
  const currentQuestion = {question: QUESTION.innerText, category: QUESTION.dataset.category}
  localStorage.setItem('storedQuestions', JSON.stringify(currentQuestion));
}

const updateCategories = (e) => {
  const updatedCategoryIndex = activeCategories.indexOf(e.target.name);
  updatedCategoryIndex === -1 
    ? activeCategories.push(e.target.name)
    : activeCategories.splice(updatedCategoryIndex, 1);
  pickAQuestion(allQuestions);
};

CATEGORIES.addEventListener('click', updateCategories);
SAVEQUESTION.addEventListener('click', saveQuestion);
GENERATENEW.addEventListener('click', pickAQuestion);

getQuestions();