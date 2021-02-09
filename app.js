const CATEGORIES = document.getElementById("categories");
const GENERATENEW = document.getElementById("generateNew");
const SAVEQUESTION = document.getElementById("saveQuestion");
const CLEARQUESTIONS = document.getElementById("clearHistory");
const POOL = document.getElementById("pool");
const REVEALQUESTIONS = document.getElementById("revealQuestions");

let activeCategories = [];
let allQuestions = {};
let savedQuestions = JSON.parse(localStorage.getItem("savedQuestions")) || [];
let isSaved = false;

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
};

const handleNav = (e) => {
  if (e.target.value) {
    const SIDEBAR = document.getElementById("sidebar");
    const SAVEDCOUNT = document.getElementById("savedCount");
    isSaved = e.target.value === "true";
    if (isSaved) {
      SIDEBAR.classList.add("hidden");
      SAVEDCOUNT.classList.remove("hidden");
      SAVEDCOUNT.innerText = `Drawing from a pool of ${savedQuestions.length} questions`;
    } else {
      SIDEBAR.classList.remove("hidden");
      SAVEDCOUNT.classList.add("hidden");
    }
    pickAQuestion();
  }
};

const handleReveal = (e) => {
  const DISPLAYQS = document.getElementById("displayQs");
  const VIEWSAVED = document.getElementById("viewSaved");
  const VIEWALL = document.getElementById("viewAll");
  const showAll = "Show All Questions";
  const showSaved = "Show Saved Questions";
  if (e.target.id === "viewSaved") {
    //If view saved is clicked on
    if (VIEWSAVED.innerText === showSaved) {
      //And it says Show Saved Questions
      DISPLAYQS.classList.remove("hidden"); //Show the hidden div
      VIEWALL.innerText = showAll; //Resets other question toggle
    } else {
      DISPLAYQS.classList.add("hidden");
    }
    DISPLAYQS.classList.contains("hidden")
      ? (VIEWSAVED.innerText = showSaved)
      : (VIEWSAVED.innerText = "Hide Saved Questions");
    renderSaved();
  }
  if (e.target.id === "viewAll") {
    if (VIEWALL.innerText === showAll) {
      DISPLAYQS.classList.remove("hidden");
      VIEWSAVED.innerText = showSaved;
    } else {
      DISPLAYQS.classList.add("hidden");
    }
    DISPLAYQS.classList.contains("hidden")
      ? (VIEWALL.innerText = showAll)
      : (VIEWALL.innerText = "Hide All Questions");
    renderAll();
  }
};

const pickAQuestion = () => {
  let randomCategoryName;
  let randomQuestion;
  if (isSaved === false) {
    // Handles selection from all pool
    [randomQuestion, randomCategoryName] = pickFromAll();
  } else {
    [randomQuestion, randomCategoryName] = pickFromSaved();
  }
  renderQuestion(randomQuestion, randomCategoryName);
};

const pickFromAll = () => {
  let randomCategoryName;
  let randomQuestion;
  if (!activeCategories.length) {
    // Error catching to make sure at least one category is checked
    randomQuestion =
      "We can't display a question until you pick at least one category.";
    randomCategoryName = null;
  } else {
    SAVEQUESTION.innerText = "Save Question"; // Selects random category from selected
    const randomCatNum = Math.floor(Math.random() * activeCategories.length); // Selects random number from list of active categories
    randomCategoryName = activeCategories[randomCatNum];
    const randomNumber = Math.floor(
      Math.random() * allQuestions[randomCategoryName].length
    ); // Selects random number for question from list of selected categories question length
    randomQuestion = allQuestions[randomCategoryName][randomNumber].question;
  }
  return [randomQuestion, randomCategoryName];
};

const pickFromSaved = () => {
  // Picks a random question from pool of saved questions
  let randomCategoryName;
  let randomQuestion;
  if (savedQuestions.length) {
    const randomNumber = Math.floor(Math.random() * savedQuestions.length);
    randomQuestion = savedQuestions[randomNumber].question;
    randomCategoryName = savedQuestions[randomNumber].category;
    SAVEQUESTION.innerText = "Remove Question";
  } else {
    randomQuestion =
      "Save some questions you need to work on, and they'll show up here for your practice!";
    randomCategoryName = null;
  }
  return [randomQuestion, randomCategoryName];
};

const questionStorage = () => {
  const QUESTION = document.getElementById("question");
  const currentQuestion = {
    question: QUESTION.innerText,
    category: QUESTION.dataset.category,
  };
  if (QUESTION.dataset.category === "null") {
    SAVEQUESTION.innerText = "No question to save";
    return;
  }
  isSaved ? removeQuestion(currentQuestion) : saveQuestion(currentQuestion);
};

const removeQuestion = (currentQuestion) => {
  const questionIndex = savedQuestions.findIndex(
    (question) => question.question === currentQuestion.question
  );
  savedQuestions.splice(questionIndex, 1);
  localStorage.setItem("savedQuestions", JSON.stringify(savedQuestions));
  renderSaved();
  pickAQuestion();
};

const renderAll = () => {
  const DISPLAYQS = document.getElementById("displayQs");
  let questions = [];
  for (const category in allQuestions) {
    allQuestions[category].forEach((questionItem) =>
      questions.push(questionItem.question)
    );
  }
  let questionHTML = questions.map((question) => `<li>${question}</li>`);
  DISPLAYQS.innerHTML =
    `<h3>All Questions</h3><ul>` + questionHTML.join("") + `<ul>`;
};

const renderQuestion = (question, category) => {
  const QUESTION = document.getElementById("question");
  QUESTION.innerText = question;
  QUESTION.dataset.category = category;
};

const renderSaved = () => {
  const DISPLAYQS = document.getElementById("displayQs");
  const questions = savedQuestions.map((question) => {
    return `<li>${question.question}</li>`;
  });
  DISPLAYQS.innerHTML = `<h3>Saved Questions</h3><ul>${questions.join(
    ""
  )}</ul>`;
};

const saveQuestion = (currentQuestion) => {
  // If the array isn't empty
  if (savedQuestions) {
    //Checks to see if the question was already saved
    const alreadyExists = savedQuestions.findIndex(
      (question) => question.question === currentQuestion.question
    );
    //If not, pushes it into the array
    if (alreadyExists === -1) {
      savedQuestions.push(currentQuestion);
      SAVEQUESTION.innerText = "Question Saved";
      localStorage.setItem("savedQuestions", JSON.stringify(savedQuestions));
      pickAQuestion();
    }
    // If it does, indicates so on button and picks a new question
    else {
      SAVEQUESTION.innerText = "Question already saved";
      window.setTimeout(pickAQuestion, 700);
    }
  } else {
    savedQuestions = [currentQuestion];
    SAVEQUESTION.innerText = "Question Saved";
    localStorage.setItem("savedQuestions", JSON.stringify(savedQuestions));
    pickAQuestion();
  }
  renderSaved();
};

const updateCategories = (e) => {
  const updatedCategoryIndex = activeCategories.indexOf(e.target.name);
  updatedCategoryIndex === -1
    ? activeCategories.push(e.target.name)
    : activeCategories.splice(updatedCategoryIndex, 1);
  // CLears out array elements listed as undefined after removal
  activeCategories = activeCategories.filter(
    (categories) => categories !== undefined
  );
  pickAQuestion();
};

CATEGORIES.addEventListener("click", updateCategories);
SAVEQUESTION.addEventListener("click", questionStorage);
GENERATENEW.addEventListener("click", pickAQuestion);
CLEARQUESTIONS.addEventListener("click", clearHistory);
POOL.addEventListener("click", handleNav);
REVEALQUESTIONS.addEventListener("click", handleReveal);

getQuestions();
renderSaved();
