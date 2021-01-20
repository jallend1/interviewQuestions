const QUESTION = document.getElementById('question');
const CATEGORIES = document.getElementById('categories')
const GENERATENEW = document.getElementById('generateNew')

const activeCategories = [];
let allQuestions;

async function getQuestions(){
    try{
        const data = await fetch('./data/questions.json');
        const questions = await data.json();
        allQuestions = questions;
        generateCategories(questions);
        pickAQuestion(questions);
    } catch(error){
        console.log('Problemo!', error)
    }
};

const generateCategories = () => {
    const categoryList = 
        Object.keys(allQuestions)
        .map(category => {
            activeCategories.push(category);                                                        // All categories active by default, so pops it into the array
            firstWord = category.split(' ');                                                        // Takes multi-word categories down to just one word for DOM ID/Name
            // TODO: Returning a string instead of an array! Remove the random commas showing up!
            return (
                `<div class="inputs">
                    <input checked type="checkbox" id="${firstWord[0]}" name="${firstWord[0]}" />
                    <label for="${firstWord[0]}">
                        ${category}
                    </label>
                </div>`
            )
        });
        console.log(typeof categoryList)
        console.dir(categoryList)
        CATEGORIES.innerHTML = categoryList.join()
}

const pickAQuestion = () => {
    const categoryList = Object.keys(allQuestions);
    // Selects random category from selected
    const randomCategoryName = categoryList[Math.floor(Math.random() * activeCategories.length)];
    // Selects random number within selected category array lengths
    const randomNumber = Math.floor(Math.random() * allQuestions[randomCategoryName].length);
    const randomQuestion = allQuestions[randomCategoryName][randomNumber].question;
    
    renderQuestion(randomQuestion)
}

const renderQuestion = question => {
    QUESTION.innerText = question;
}

const updateCategories = e => {
    // TODO Switched to starting out with all selected -- Invert this logic to reflect that
    console.log(activeCategories)
    pickAQuestion(allQuestions)
}

CATEGORIES.addEventListener('click', updateCategories);
GENERATENEW.addEventListener('click', pickAQuestion);

getQuestions();