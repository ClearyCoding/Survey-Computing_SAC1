const questionList = [
    {
        question: 'What is the capital of France?',
        answers: ['Paris', 'London', 'Madrid', 'Rome'],
    },
    {
        question: 'What is the capital of Spain?',
        answers: ['Paris', 'London', 'Madrid', 'Rome', 'Narnia', 'N.B.E.T.S.I'],
    },
    {
        question: 'What is the capital of Italy?',
        answers: ['London', 'Madrid', 'Rome'],
    },
    {
        question: 'What is the capital of England?',
        answers: ['Paris', 'London', 'Madrid', 'Rome'],
    }
]
const answerData = [
    [1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1],
    [1, 1, 1],
    [163, 324, 232, 123],
]

function displayNextQuestion() {
    if (complete()) {
        displayConclusion()
        return;
    } else {
        currentQuestion = complete(0, "i")
    }

    let questionAnswers = ``;
    let questionAnswersOdd = ``;
    for (let i = 0; i < questionList[currentQuestion].answers.length; i++) {
        if (questionList[currentQuestion].answers.length % 2 !== 0 && i === questionList[currentQuestion].answers.length - 1){
            questionAnswersOdd = `
            <button id="answer${i}">${questionList[currentQuestion].answers[i]}</button>
        `
        } else {
            questionAnswers += `
            <button id="answer${i}">${questionList[currentQuestion].answers[i]}</button>
        `
        }
    }
    mainElement.innerHTML = `
    <h2 class="question">${questionList[currentQuestion].question}</h2>
    <div class="question-answers">
        ${questionAnswers}
    </div>
    ${questionAnswersOdd}
    `

    for (let i = 0; i < questionList[currentQuestion].answers.length; i++) {
        document.querySelector(`#answer${i}`).addEventListener('click', function() {
            document.cookie = `q${currentQuestion}=${i}`;
            answerData[currentQuestion][i] += 1;
            displayResults();
        });
    }
}
function displayResults() {

    mainElement.innerHTML = `
    <h2 class="question">${questionList[currentQuestion].question}</h2>
    <canvas id="pie" style="width:100%;max-width:700px"></canvas>
    <button id="next">${complete() ? 'Finish Survey' : 'Next Question'}</button>
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
                    "#c57dff",
                    "#3c0f6b",
                    "#6b38c0",
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
                    fontSize: window.innerWidth < 400 ? 14 : 18,
                    font: 'Roboto',
                }
            }
        }
    });

    document.querySelector(`#next`).addEventListener('click', function() {
        currentQuestion += 1;
        displayNextQuestion();
    });
}
function displayConclusion() {
    mainElement.innerHTML = `
    <h2>Conclusion</h2>
    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum</p>
    `
    clearInterval(countTick);
    countElement.innerHTML = `Your Answers`;
}
function displayAnswers() {
    let answersHTML = ``;
    for (let i = 0; i < questionList.length; i++) {
        answersHTML += `
            <div>
                <h3>Q${i + 1}: ${questionList[i].question}</h3>
                <h4>${getCookie(`q${i}`) ? ` ${questionList[i].answers[getCookie(`q${i}`)]}` : 'Not Answered'}</h4>
            </div>
        `
    }

    mainElement.innerHTML = `
    <h2>Your Answers:</h2>
    <div>
        ${answersHTML}
    </div>
    <button id="back">Back</button>
    `
    document.querySelector('#back').addEventListener('click', function() {
        if (complete()) {
            displayConclusion()
        } else {
            displayStart()
        }
    });

}
function displayStart() {
    if (complete()) {
        mainElement.innerHTML = `
    <h1>Title</h1>
    <p>You have already completed this survey. To see the conclusion, press the "See Conclusion" button.</p>
    <button id="start">See Conclusion</button>
    `
    } else {
        mainElement.innerHTML = `
    <h1>Title</h1>
    <p>By clicking "Start Survey!", you agree to share your answers for this survey <strong>anonymously</strong> for use in this social study.</p>
    <button id="start">Start Survey!</button>
    `
    }

    document.querySelector('#start').addEventListener('click', function() {
        countTick = setInterval(() => {
            countElement.innerHTML = `${window.innerWidth < 450 ? 'Q': 'Question '}${currentQuestion + 1} of ${questionList.length}`;
        }, 30);

        displayNextQuestion();
    });

}
function complete(start=0, mode=`boolean`) {
    for (let i = start; i <= questionList.length; i++) {
        if (i >= questionList.length ) {
            return true;
        } else if (getCookie(`q${i}`) === undefined) {
            if (mode === `boolean`) {
                return false;
            } else if (mode === 'i') {
                return i;
            }
        }
    }
}

function UUIDv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'
        .replace(/[xy]/g, function (c) {
            const r = Math.random() * 16 | 0,
                v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
}
function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
}


let userUUID;
if (document.cookie) {
    userUUID = getCookie('uuid')
} else {
    userUUID = UUIDv4();
    document.cookie = `uuid=${userUUID};`
}

const mainElement = document.querySelector('main');
const countElement = document.querySelector('#question-count');
let currentQuestion = 0;
let countTick;
countElement.innerHTML = `${questionList.length} Questions`;

countElement.addEventListener('click', function() {
    displayAnswers();
});

displayStart()