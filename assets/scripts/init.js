const questionList = [
    {
        question: 'What is the capital of France?',
        answers: ['Paris', 'London', 'Madrid', 'Rome'],
        correct: 0,
    },
    {
        question: 'What is the capital of Spain?',
        answers: ['Paris', 'London', 'Madrid', 'Rome'],
        correct: 2,
    },
    {
        question: 'What is the capital of Italy?',
        answers: ['Paris', 'London', 'Madrid', 'Rome'],
        correct: 3,
    },
    {
        question: 'What is the capital of England?',
        answers: ['Paris', 'London', 'Madrid', 'Rome'],
        correct: 1,
    }
]

const answerData = [
    [1, 1, 1, 1],
    [1, 1, 1, 1],
    [1, 1, 1, 1],
    [163, 324, 232, 123],
]

function submitAnswer(answerId) {
    answerData[currentQuestion][answerId] += 1;
    displayResults()
}

function displayNextQuestion() {
    mainElement.innerHTML = `
    <h2>${questionList[currentQuestion].question}</h2>
    <div class="question-answers">
        <button id="answer0">${questionList[currentQuestion].answers[0]}</button>
        <button id="answer1">${questionList[currentQuestion].answers[1]}</button>
        <button id="answer2">${questionList[currentQuestion].answers[2]}</button>
        <button id="answer3">${questionList[currentQuestion].answers[3]}</button>
    </div>
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
    <canvas id="pie" style="width:100%;max-width:700px"></canvas>
    <button id="next">Next Question</button>
    
    `
    new Chart("pie", {
        type: "doughnut",
        data: {
            labels: questionList[currentQuestion].answers,
            datasets: [{
                backgroundColor: [
                    "#00aba9",
                    "#2b5797",
                    "#e8c3b9",
                    "#1e7145"
                ],
                data: answerData[currentQuestion],
                borderWidth: 0
            }]
        },
        options: {
            title: {
                display: false,
            },
            legend: {
                display: true,
                position: 'bottom',
                labels: {
                    fontColor: 'white',
                    fontSize: 18,
                    font: 'Arial',
                }
            }
        }
    });

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
    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum</p>
    `
}

const mainElement = document.querySelector('main');
let currentQuestion = 0;
document.getElementById(`start`).addEventListener('click', function() {

    displayNextQuestion();
});
