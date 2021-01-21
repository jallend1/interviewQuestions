const QUESTION = document.getElementById("question");
const CATEGORIES = document.getElementById("categories");
const GENERATENEW = document.getElementById("generateNew");

let activeCategories = [];
let allQuestions;

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
    categoryList[Math.floor(Math.random() * activeCategories.length)];
  // Selects random number within selected category array lengths
  const randomNumber = Math.floor(
    Math.random() * allQuestions[randomCategoryName].length
  );
  const randomQuestion =
    allQuestions[randomCategoryName][randomNumber].question;

  renderQuestion(randomQuestion);
};

const renderQuestion = (question) => {
  QUESTION.innerText = question;
};

const updateCategories = (e) => {
  // TODO Switched to starting out with all selected -- Invert this logic to reflect that
  console.log(activeCategories);
  for(let i = 0; i < CATEGORIES.length; i++){
    if(CATEGORIES[i].checked === false){
      
    }
  }
  console.log(activeCategories)
  pickAQuestion(allQuestions);

};

CATEGORIES.addEventListener("click", updateCategories);
GENERATENEW.addEventListener("click", pickAQuestion);

getQuestions();
