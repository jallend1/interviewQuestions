const getQuestions = () => {
    fetch('./data/questions.json')
        .then(data => data.json())
        .then(results => console.log(results))
}

getQuestions();