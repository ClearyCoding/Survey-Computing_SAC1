const questionList = [
    {
        question: 'What is the capital of France?',
        answers: ['Paris', 'London', 'Madrid', 'Rome'],
        correct: 0,
        data: [122, 232, 532, 211]
    },
    {
        question: 'What is the capital of Spain?',
        answers: ['Paris', 'London', 'Madrid', 'Rome'],
        correct: 2,
        data: [122, 211, 232, 532]
    },
    {
        question: 'What is the capital of Italy?',
        answers: ['Paris', 'London', 'Madrid', 'Rome'],
        correct: 3,
        data: [122, 211, 232, 332]
    },
    {
        question: 'What is the capital of England?',
        answers: ['Paris', 'London', 'Madrid', 'Rome'],
        correct: 1,
        data: [211, 232, 532, 122]
    }
]

function submitAnswer(answerId) {
    questionList[currentQuestion].data[answerId] += 1;
    displayResults()
}

function displayNextQuestion() {
    mainElement.innerHTML = `
    <h2>${questionList[currentQuestion].question}</h2>
    <button id="answer0">${questionList[currentQuestion].answers[0]}</button>
    <button id="answer1">${questionList[currentQuestion].answers[1]}</button>
    <button id="answer2">${questionList[currentQuestion].answers[2]}</button>
    <button id="answer3">${questionList[currentQuestion].answers[3]}</button>
    `

    for (let i = 0; i < 4; i++) {
        document.getElementById(`answer${i}`).addEventListener('click', function() {
            submitAnswer(i);
        });
    }
}
function displayResults() {
    mainElement.innerHTML = `
    <h2>${questionList[currentQuestion].question}</h2>
    <h3>Results:</h3>
    <h4>${questionList[currentQuestion].answers[0]} : ${questionList[currentQuestion].data[0]}</h4>
    <h4>${questionList[currentQuestion].answers[1]} : ${questionList[currentQuestion].data[1]}</h4>
    <h4>${questionList[currentQuestion].answers[2]} : ${questionList[currentQuestion].data[2]}</h4>
    <h4>${questionList[currentQuestion].answers[3]} : ${questionList[currentQuestion].data[3]}</h4>
    <button id="next">Next Question</button>
    
    `

    document.getElementById(`next`).addEventListener('click', function() {
        if (currentQuestion < questionList.length - 1) {
            currentQuestion += 1
            displayNextQuestion();
        } else {
            displayConclusion()
        }
    });
}

function displayConclusion() {
    mainElement.innerHTML = `
    <h2>Conclusion</h2>
    `
}

const mainElement = document.querySelector('main');
let currentQuestion = 0;
displayNextQuestion()
