const questionList = [
    {
        question: 'What is the capital of France?',
        answers: ['Paris', 'London', 'Madrid', 'Rome'],
    },
    {
        question: 'What is the capital of Spain?',
        answers: ['Paris', 'London', 'Madrid', 'Rome'],
    },
    {
        question: 'What is the capital of Italy?',
        answers: ['Paris', 'London', 'Madrid', 'Rome'],
    },
    {
        question: 'What is the capital of England?',
        answers: ['Paris', 'London', 'Madrid', 'Rome'],
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
    <h2 class="question">${questionList[currentQuestion].question}</h2>
    <div class="question-answers">
        <button id="answer0">${questionList[currentQuestion].answers[0]}</button>
        <button id="answer1">${questionList[currentQuestion].answers[1]}</button>
        <button id="answer2">${questionList[currentQuestion].answers[2]}</button>
        <button id="answer3">${questionList[currentQuestion].answers[3]}</button>
    </div>
    `

    for (let i = 0; i < 4; i++) {
        document.querySelector(`#answer${i}`).addEventListener('click', function() {
            submitAnswer(i);
        });
    }
}
function displayResults() {
    mainElement.innerHTML = `
    <h2>${questionList[currentQuestion].question}</h2>
    <canvas id="pie" style="width:100%;max-width:700px"></canvas>
    <button id="next">${currentQuestion < questionList.length - 1 ? 'Next Question' : 'Finish Survey'}</button>
    
    `
    new Chart("pie", {
        type: "doughnut",
        data: {
            labels: questionList[currentQuestion].answers,
            datasets: [{
                backgroundColor: [
                    "#432e63",
                    "#bda0d3",
                    "#663399",
                    "#c57dff"
                ],
                data: answerData[currentQuestion],
                borderColor: '#222526',
                borderWidth: 8,
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
                    font: 'Roboto',
                }
            }
        }
    });

    document.querySelector(`#next`).addEventListener('click', function() {
        if (currentQuestion < questionList.length - 1) {
            currentQuestion += 1;
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
    clearInterval(countTick)
    countElement.innerHTML = `${questionList.length} Questions`;
}

const mainElement = document.querySelector('main');
const countElement = document.querySelector('#question-count');
let currentQuestion = 0;
let countTick;
countElement.innerHTML = `${questionList.length} Questions`;

document.querySelector(`#start`).addEventListener('click', function() {
    displayNextQuestion();
    countTick = setInterval(() => {
        countElement.innerHTML = `${window.innerWidth < 450 ? 'Q': 'Question '}${currentQuestion + 1} of ${questionList.length}`;
    }, 30);
});
