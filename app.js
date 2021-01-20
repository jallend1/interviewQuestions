const QUESTION = document.getElementById('question');
const CATEGORIES = document.getElementById('categories')

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
            return (
                `<input checked type="checkbox" id="${firstWord[0]}" name="${firstWord[0]}" />
                <label for="${firstWord[0]}">
                    ${category}
                </label>
                `
            )
        });
    CATEGORIES.innerHTML = categoryList;
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
    console.log(e.target.name);
    if(e.target.name){
        activeCategories.push(e.target.name);
    }
    console.log(activeCategories)
    pickaQuestion(allQuestions)
}

CATEGORIES.addEventListener('click', updateCategories);

getQuestions();