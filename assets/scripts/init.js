const questionList = [
    {
        question: 'What year level are you in school?',
        answers: ['9 or lower', '10', '11', '12', 'Finished School' , 'Prefer Not To Say'],
    },
    {
        question: 'Were the government\'s restrictions appropriate?',
        answers: ['Very Inappropriate', 'Somewhat Inappropriate', 'Neutral', 'Somewhat Appropriate', 'Very Appropriate', 'Prefer Not To Say'],
    },
    {
        question: 'The restrictions applied were not strict enough.',
        answers: ['Strongly Disagree', 'Somewhat Disagree', 'Neutral', 'Somewhat Agree', 'Strongly Agree', 'Prefer Not To Say'],
    },
    {
        question: 'How often do you wear a mask when not required?',
        answers: ['Never', 'Occasionally', 'Sometimes', 'Usually','Always', 'Prefer Not To Say'],
    },
    {
        question: 'How many times have you been diagnosed with COVID-19?',
        answers: ['Never', 'Once', 'Twice', 'Three Times', 'Four Times or More', 'Unsure', 'Prefer Not To Say'],
    },
    {
        question: 'If you \'ve had COVID-19, how servere were your symptoms?',
        answers: ['Not Applicable', 'Asymptomatic', 'Mild', 'Moderate', 'Servere', 'Life-Threatening', 'Prefer Not To Say'],
    },
    {
        question: 'COVID-19 affected my performance in school/work.',
        answers: ['Strongly Disagree', 'Somewhat Disagree', 'Neutral', 'Somewhat Agree', 'Strongly Agree', 'Prefer Not To Say'],
    },
    {
        question: 'How did COVID-19 affect your mental health?',
        answers: ['Significantly Worse', 'Slightly Worse', 'About The Same', 'Slightly Better', 'Significantly Better', 'Prefer Not To Say'],
    }
]
const answerData = [
    [1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1],
]

function displayNextQuestion() {
    // Checks if there is another question to display, if not, end the survey
    currentQuestion = isComplete(0, "i")
    if (currentQuestion === true) {
        displayConclusion()
        return;
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

    // Sets up answer buttons to store and display results
    for (let i = 0; i < questionList[currentQuestion].answers.length; i++) {
        document.querySelector(`#answer${i}`).addEventListener('click', function() {
            document.cookie = `q${currentQuestion}=${i}`;
            fetchData(`UPDATE ${userUUID.replace(/-/g, "_")} SET q${currentQuestion} = '${i}';`)
            answerData[currentQuestion][i] += 1;
            displayResults();
        });
    }
}
function displayResults() {
    mainElement.innerHTML = `
    <h2 class="question">${questionList[currentQuestion].question}</h2>
    <canvas id="pie" style="width:100%;max-width:700px"></canvas>
    <button id="next">${isComplete() ? 'Finish Survey' : 'Next Question'}</button>
    `

    // Create the pie chart using chart.js
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

    // Create button to continue to next question
    document.querySelector(`#next`).addEventListener('click', function() {
        currentQuestion += 1;
        displayNextQuestion();
    });
}
function displayConclusion() {
    mainElement.innerHTML = `
    <h2>Conclusion</h2>
    <p>Conclusion coming soon!</p>
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
    let place = fetchData(`SELECT * FROM ${userUUID.replace(/-/g, "_")}`)
    console.log(place)
    // Create button to leave
    document.querySelector('#back').addEventListener('click', function() {
        if (isComplete()) {
            displayConclusion()
        } else {
            displayStart()
        }
    });

}
function displayStart() {
    const commonStartElements = `
        <h1>Title</h1>
    `
    if (isComplete()) {
        mainElement.innerHTML = `
    ${commonStartElements}
    <p>You have already completed this survey. To see the conclusion, press the "See Conclusion" button.</p>
    <button id="start">See Conclusion</button>
    `
    } else {
        mainElement.innerHTML = `
    ${commonStartElements}
    <p>By clicking "Start Survey!", you agree to share your answers for this survey <strong>anonymously</strong> for use in this study. Particpant data cannot be traced back to any individual user, and will be deleted after the study concludes.</p>
    <button id="start">Start Survey!</button>
    `
    }

    // Create a button to start the survey
    document.querySelector('#start').addEventListener('click', function() {
        countTick = setInterval(() => {
            countElement.innerHTML = `${window.innerWidth < 450 ? 'Q': 'Question '}${currentQuestion + 1} of ${questionList.length}`;
        }, 30);

        displayNextQuestion();
    });

}
function isComplete(start=0, mode=`boolean`) {
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

// Assign UUID to users without one
let userUUID;
if (document.cookie) {
    userUUID = getCookie('uuid')
} else {
    userUUID = UUIDv4();
    document.cookie = `uuid=${userUUID};`

    let answerDefinitions = ``;
    for (let i = 0; i < questionList.length; i++) {
        answerDefinitions += `q${i} int, `;
    }
    answerDefinitions = answerDefinitions.slice(0,-2);
    fetchData(`CREATE TABLE ${userUUID.replace(/-/g, "_")} (${answerDefinitions});`);
}

// Initiate Common Variables
const mainElement = document.querySelector('main');
const countElement = document.querySelector('#question-count');
let currentQuestion = 0;
let countTick;
countElement.innerHTML = `${questionList.length} Questions`;

// Create button to see your current answers
countElement.addEventListener('click', function() {
    displayAnswers();
});

// Display the welcome screen
displayStart()



// Utility Functions
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



async function fetchData(command) {
    const data = { query: command };

    try {
        let response = await fetch("https://cors-anywhere.herokuapp.com/http://58.109.204.207:8080", {
            method:"POST",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
                "Random-Value-No-Actual-Use": "haha-funny-number",
                "Origin": "http://localhost:63342",
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            console.error(`HTTP error! status: ${response.status}`);
            return;
        }

        const responseData = await response.text();

        try {
            return JSON.parse(responseData);
        } catch (e) {
            console.error('This does not look like valid JSON: ', responseData);
            return null;
        }
    } catch (e) {
        console.error('Fetch failed: ', e);
        return null;
    }
}