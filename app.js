// TODO QUESTION and DISPLAYSAVED might be better outside of global context as they don't have event listeners attached?

const QUESTION = document.getElementById("question");
const CATEGORIES = document.getElementById("categories");
const GENERATENEW = document.getElementById("generateNew");
const SAVEQUESTION = document.getElementById("saveQuestion");
const DISPLAYSAVED = document.getElementById("displaySaved");
const MENU = document.getElementById('menu');
const CLEARQUESTIONS = document.getElementById('clearHistory');

let activeCategories = [];
let allQuestions = {};
let savedQuestions = JSON.parse(localStorage.getItem("savedQuestions")) || [];
let filterQuestions = false;

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
  categories.forEach((category) => {
    activeCategories.push(category); // All categories active by default, so pops it into the array
  });
  const categoryList = categories.map((category) => {
    firstWord = category.split(" "); // Takes multi-word categories down to just one word for DOM ID/Name
    return `<div class="inputs">
              <input checked type="checkbox" id="${firstWord[0]}" name="${firstWord[0]}" />
              <label for="${firstWord[0]}">
                  ${category}
              </label>
            </div>`;
  });
  CATEGORIES.innerHTML = categoryList.join("");
};

const clearHistory = () => {
  localStorage.clear();
  savedQuestions = [];
  renderSaved();
  pickAQuestion();
}

const handleNav = e => {
  if(!e.target.className.includes('active-item')){
    for(item of MENU.children){                                       // Removes active-item from any existing element that has it
      item.classList.remove('active-item');
    }
    e.target.classList.add('active-item');                            // Adds active-item to the one that was clicked
  }
  e.target.textContent === 'Saved Questions' ? filterQuestions = true : filterQuestions = false; // Flips the saved questions filter on or off
  pickAQuestion();
}

const pickAQuestion = () => {
  let randomCategoryName;
  let randomQuestion;
  if(filterQuestions === false){
    SAVEQUESTION.innerText = "Save Question";
    // Selects random category from selected
    randomCategoryName = activeCategories[Math.floor(Math.random() * activeCategories.length)];
    // Selects random number within selected category array lengths
    const randomNumber = Math.floor(Math.random() * allQuestions[randomCategoryName].length);
    randomQuestion = allQuestions[randomCategoryName][randomNumber].question;
  }
  else{
    if(savedQuestions.length){
      const randomNumber = Math.floor(Math.random() * savedQuestions.length);
      randomQuestion = savedQuestions[randomNumber].question;
      randomCategoryName = savedQuestions[randomNumber].category;
      SAVEQUESTION.innerText = 'Remove Question'
    }
    else{
      randomQuestion = "Save some questions you need to work on, and they'll show up here for your practice!";
      randomCategoryName = null;
    }
  }
  renderQuestion(randomQuestion, randomCategoryName);
};

const questionStorage = () => {
  const currentQuestion = {
    question: QUESTION.innerText,
    category: QUESTION.dataset.category,
  };
  if(QUESTION.dataset.category === 'null'){
    SAVEQUESTION.innerText = "No question to save"
    return;
  }
  filterQuestions ? removeQuestion(currentQuestion) : saveQuestion(currentQuestion);
};

const removeQuestion = (currentQuestion) => {
  const questionIndex = savedQuestions.findIndex(question => question.question === currentQuestion.question);
  savedQuestions.splice(questionIndex, 1);
  localStorage.setItem("savedQuestions", JSON.stringify(savedQuestions));
  renderSaved();
  pickAQuestion();
}

const renderQuestion = (question, category) => {
  QUESTION.innerText = question;
  QUESTION.dataset.category = category;
};

const renderSaved = () => {
  const questions = savedQuestions.map((question) => {
    return `<li>${question.question}</li>`;
  });
  DISPLAYSAVED.innerHTML = `<ul>${questions.join("")}</ul>`;
};

const saveQuestion = (currentQuestion) => {
  if(savedQuestions){                                     // If the array isn't empty
    //Checks to see if the question was already saved
    const alreadyExists = savedQuestions.findIndex(question => question.question === currentQuestion.question);
    //If not, pushes it into the array
    if(alreadyExists === -1){
      savedQuestions.push(currentQuestion);
      SAVEQUESTION.innerText = "Question Saved";
      localStorage.setItem("savedQuestions", JSON.stringify(savedQuestions));
      pickAQuestion();
    }
    // If it does, indicates so on button and picks a new question
    else{
      SAVEQUESTION.innerText = "Question already saved"
      window.setTimeout(pickAQuestion, 700);
    }
  }
  else{
    savedQuestions = [currentQuestion];
    SAVEQUESTION.innerText = "Question Saved";
    localStorage.setItem("savedQuestions", JSON.stringify(savedQuestions));
    pickAQuestion();
  }
  renderSaved();
}

const updateCategories = (e) => {
  const updatedCategoryIndex = activeCategories.indexOf(e.target.name);
  updatedCategoryIndex === -1
    ? activeCategories.push(e.target.name)
    : activeCategories.splice(updatedCategoryIndex, 1);
  pickAQuestion(allQuestions);
};

CATEGORIES.addEventListener("click", updateCategories);
SAVEQUESTION.addEventListener("click", questionStorage);
GENERATENEW.addEventListener("click", pickAQuestion);
MENU.addEventListener('click', handleNav);
CLEARQUESTIONS.addEventListener('click', clearHistory);

getQuestions();
renderSaved();