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
        answers: ['Never', 'Once', 'Twice', 'Thrice', 'Four Times or More', 'Unsure', 'Prefer Not To Say'],
    },
    {
        question: 'If you\'ve had COVID-19, how severe were your symptoms?',
        answers: ['Not Applicable', 'Asymptomatic', 'Mild', 'Moderate', 'Severe', 'Life-Threatening', 'Prefer Not To Say'],
    },
    {
        question: 'Lockdowns negatively impacted my performance in school/work.',
        answers: ['Strongly Disagree', 'Somewhat Disagree', 'Neutral', 'Somewhat Agree', 'Strongly Agree', 'Prefer Not To Say'],
    },
    {
        question: 'COVID-19 negatively affected my mental health?',
        answers: ['Strongly Disagree', 'Somewhat Disagree', 'Neutral', 'Somewhat Agree', 'Strongly Agree', 'Prefer Not To Say'],
    },
    {
        question: 'How many shots of the COVID-19 vaccination have you had?',
        answers: ['None', 'One', 'Two', 'Three', 'Four Or More', 'Prefer Not To Say'],
    },
    {
        question: 'How has your access to healthcare services been impacted by the COVID-19 pandemic?',
        answers: ['Major Impact', 'Decent Impact', 'Limited Impact', 'Minimal Impact','No Impact', 'Prefer Not To Say'],
    },
]
let answerData = []
let myAnswers = []

function displayNextQuestion(question = null) {
    conclusionClasses(false)
    // Checks if there is another question to display, if not, end the survey
    if (question === null) {
        currentQuestion = isComplete(0, "i");
        if (currentQuestion === true) {
            displayConclusion();
            return;
        }
    } else {
        currentQuestion = question;
    }

    clearInterval(countTick);
    countTick = setInterval(() => {
        countElement.innerHTML = `${window.innerWidth < 450 ? 'Q': 'Question '}${currentQuestion + 1} of ${questionList.length}`;
    }, 30);

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
            sendCommand(`SHOVE:${userDataUUID}:${currentQuestion}:${i}`).then(() => {})
            if (myAnswers[currentQuestion] !== null) {
                answerData[currentQuestion][myAnswers[currentQuestion]] -= 1;
            }
            answerData[currentQuestion][i] += 1;
            myAnswers[currentQuestion] = i

            if (question === null) {
                displayResults();
            } else {
                displayAnswers(currentQuestion);
            }
        });
    }
}
function displayResults(question=null) {
    conclusionClasses(false)
    if (question !== null) {
        currentQuestion = question;
    }

    clearInterval(countTick);
    countTick = setInterval(() => {
        countElement.innerHTML = `${window.innerWidth < 450 ? 'Q': 'Question '}${currentQuestion + 1} of ${questionList.length}`;
    }, 30);

    let totalResponses = 0
    for (let i = 0; i < questionList[currentQuestion].answers.length - 1 ; i++) {
        totalResponses +=  answerData[currentQuestion][i]
    }

    mainElement.innerHTML = `
    <h2 class="question">${questionList[currentQuestion].question}</h2>
    <h3 class="total">${totalResponses} Responses</h3>
    <canvas id="pie" style="width:100%;max-width:700px"></canvas>
    <button id="next">${question !== null ? 'Back' : isComplete() ? 'Finish Survey' : 'Next Question'}</button>
    `
    console.log(questionList[currentQuestion].answers.length)
    // Create the pie chart using chart.js
    new Chart("pie", {
        type: "doughnut",
        data: {
            labels: questionList[currentQuestion].answers.slice(0, -1),
            datasets: [{
                backgroundColor: [
                    "#3e41ff",
                    "#33a9f1",
                    "#035bbb",
                    "#6fc1f1",
                    "#5970ff",
                    "#6caee5",
                    "#7676ff",
                ],
                data: answerData[currentQuestion].slice(0, questionList[currentQuestion].answers.length - 1),
                borderColor: 'white',
                borderWidth: 2,
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
        if (question !== null) {
            displayAnswers(question);
        } else {
            currentQuestion += 1;
            displayNextQuestion()
        }
    });
}
function displayConclusion() {
    let totals = []
    for (let i = 0; i < questionList.length; i++) {
        let rowTotal = 0
        for (let j = 0; j < questionList[i].answers.length - 1; j++) {
            rowTotal += answerData[i][j]
        }
        totals.push(rowTotal)
    }

    conclusionClasses(true)
    mainElement.innerHTML = `
    <section class="void void-title">
        <h1>${documentTitle}</h1>
        <p>This investigation was conducted on attitudes toward COVID-19, This topic was chosen as protective practices are slowly slipping out of public habit, resulting in an easier spread of COVID-19. Public sentiment leans towards the opinion that COVID-19 is behind us, but the unfortunate reality is that there are many lives still being claimed by SARS-CoV-2 as seen in the weekly/fortnightly surveillance reports from the Victorian government. In this project, we have conducted a survey and an analysis of the survey results to see whether this is truly the case and to gain insight into people's attitudes towards the COVID-19 pandemic. This survey aims to ensure year 10-12 students are informed on the public conceptions towards this topic.</p>
    </section>
    <section class="section section-infections section-first">
        <h2>Infections</h2>
        <div class="graphic">
            <h3>In a room with 10 people:</h3>
            <div id="human-grid"></div>
            <div>
                <p>${Math.round(10 / (totals[4]) * answerData[4][0])} ${Math.round(10 / (totals[4]) * answerData[4][0]) === 1 ? 'person has' : 'people have'} never had COVID</p>
                <p>${Math.round(10 / (totals[4]) * answerData[4][1])} ${Math.round(10 / (totals[4]) * answerData[4][1]) === 1 ? 'person has' : 'people have'} had COVID once</p>
                <p>${Math.round(10 / (totals[4]) * answerData[4][2])} ${Math.round(10 / (totals[4]) * answerData[4][2]) === 1 ? 'person has' : 'people have'} had COVID twice</p>
                <p>${(Math.round((10 / (totals[4]) * answerData[4][3]))) + (Math.round(10 / (totals[4]) * answerData[4][4]))} ${(Math.round((10 / (totals[4]) * answerData[4][3]))) + (Math.round(10 / (totals[4]) * answerData[4][4])) === 1 ? 'person has' : 'people have'} had COVID 3+ times</p>
            </div>
        </div>
    </section>
    <section class="section section-vaccination section-transparent">
        <h2>Vaccination</h2>
    </section>
    <section class="section section-impacts">
        <h2>Impacts</h2>
    </section>
    <section class="section section-attitudes">
        <h2>Attitudes</h2>
    </section>
    <section class="void void-buttons">
        <button id="reflections">Reflections</button>
    </section>
    <section class="section section-references section-transparent">
        <h3>References:</h3>
        <p>\t Melbourne University. (2020). Taking The Pulse Of The Nation. \n<a target="_blank" href="https://melbourneinstitute.unimelb.edu.au/__data/assets/pdf_file/0004/3468172/Taking-the-Pulse-of-the-Nation-3-8-August.pdf">https://melbourneinstitute.unimelb.edu.au/__data/assets/pdf_file/0004/3468172/Taking-the-Pulse-of-the-Nation-3-8-August.pdf</a></p>
        <p>\t Department of Health. (2024). Victorian COVID-19 Surveilence Report. \n<a target="_blank" href="https://www.health.vic.gov.au/infectious-diseases/victorian-covid-19-surveillance-report">https://www.health.vic.gov.au/infectious-diseases/victorian-covid-19-surveillance-report</a></p>
    </section>
    `
    console.log(answerData)
    clearInterval(countTick);
    countElement.innerHTML = `Your Answers`;

    /*const humanGrid = document.querySelector('#human-grid')
    let hue = [30, 400, 190, 50]
    let peopleValues = [Math.round(10 / (totals[4]) * answerData[4][0]), Math.round(10 / (totals[4]) * answerData[4][1]), Math.round(10 / (totals[4]) * answerData[4][2]), Math.round(10 / (totals[4]) * answerData[4][3]) + Math.round(10 / (totals[4]) * answerData[4][4])]
    const remainder = (10 - (peopleValues[0] + peopleValues[1] + peopleValues[2] + peopleValues[3]))
    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < peopleValues[i]; j++) {
            humanGrid.innerHTML += `
                <img alt="human" src="/assets/images/human.png" style="filter: invert(33%) sepia(100%) saturate(2000%) hue-rotate(${hue[i]}deg) brightness(90%);">
            `
        }
    }
    for (let j = 0; j < remainder; j++) {
        humanGrid.innerHTML += `
                <img alt="human" src="/assets/images/human.png" style="filter: saturate(2000%) brightness(10%);">
            `
    }*/

    document.querySelector('#reflections').addEventListener('click', () => {
        mainElement.innerHTML = `
        <section class="void void-title">
            <h2>Personal Reflections</h2>
        </section>
        <section class="section section-reflection section-first">
            <h2>Nathan Scott</h2>
            <p>
            This was a lot of work, I spent tens of hours debugging and just (figuratively) banging my head against my desk. It ended up teaching me a whole new coding language, javascript. I’d had some (very limited) experience with it in the past, but until I started this project, I didn't know anything about using it for big projects. It was also my introduction to building my own objects, attributes and methods. Of course, I’d used them before and had a basic understanding of how they worked, just not made my own. 

            There were many issues along the way but the one we struggled with the most was CORS. It stands for Cross-origin resource sharing and it is a security measure that browsers put in place to restrict potentially malicious responses, essentially by requiring a valid SSL certificate from traffic sent externally to its local network. We eventually got around this by using a subdomain of clearycoding.com (vk3dns.clearycoding.com) and got certificates for that subdomain. Because of the potential security risks, the HTTP module I used requires these certificates to be stored under ‘-x 600’ permissions, which basically means only a root user can read, write or execute. It worked well for testing purposes as I could simply input the password whenever needed but wreaked chaos on my attempts at automatic server reboots. This turned into a lasting problem which was only fixed right at the tail end of the project by injecting the root user credentials directly into the server with some ‘echo “{password}” | sudo node /home/pi/middleman.js’ business.

            If I were to do this project again, I’d focus on getting SSL certificates sooner. It was a massive hassle and a lot of stress trying to get it working. It took us a long time to work out the issue was certificates. You don’t get any reason with CORS, all you get is a generic “CORS ERROR” message. In case it’s not clear, I really don’t like CORS at all.

            The group-work was reasonably evenly split between Alex and me. David didn't do quite as much but we both write code in our own specific ways that makes sense to only two things; the compiler and ourselves. It would’ve made the project more painful to have someone else working on our scripts. His job was to check the boxes on the rubric to make sure we got the marks, but he did suggest ideas for fixing bugs and was there for basically all the development process.
            </p>
        </section>
        <section class="section section-reflection section-transparent">
            <h2>David Sprung</h2>
            <p>
            I learnt a lot about html and css since working with two dedicated programmers forces me to learn quickly. I learnt about security and servers and also cookies. I also learnt a lot about how my group members work and how to work effectively with them.
            
            I struggled with coming up with ideas since this project had a lot of freedom and I was the ‘idea person’. I’m usually not good with ideas, preferring to follow a set of instructions so this was challenging for me. I overcame this struggle by giving it a go and doing it despite not being comfortable being the idea generator.
            
            I would design more survey questions since the questions that were used in the survey didn’t give as much information as it could have been if there were more questions. I would also try to contribute more to the coding of the website as it would allow me to fully understand all the workings of the website instead of just the general idea and a few details.
            
            Communication between group members was not terrible as we had a discord chat set up for working on the project and on a few select days we would be in a voice chat working on the project. I struggled with communicating the importance of non coding based work and that we should work on it more because they were trying to fix every part of the website and improve it further than was needed.
            
            Since I am not as advanced in html and css as the other members in my group I somewhat felt left out of the main coding but despite this I still contributed to the code and to balance the work I was the main member working on the writing part of this assignment. I was able to use my weird passion for css gradients to help fix up the background gradient.
            
            We didn’t have any arguments or disagreements. Sometimes we left some of the work to the last day but we worked efficiently and got it done easily.
            
            I think if we spent less time on coding the website and more time focusing on what the assignment wanted us to do we would have had an easier time completing this assignment but I think overall us having done it this way has helped us all learn a lot about html/css. Doing it again I would start with the required assignment stuff and then after that is done work on extending ourselves.
            </p>
        </section>
        <section class="section section-reflection">
            <h2>Alexander Cleary</h2>
            <p>
            This assignment taught me a lot of valuable skills utilising JavaScript, CSS and Linux. I have learned how to use “Chart.js” a framework to create live charts. I have also learned how to create a single-page website utilising JavaScript document replacement to allow me to reduce loading times significantly. I have learned how to communicate with a backend and use asynchronous functions. This website also helped me develop my skills in live content creation using JavaScript. This site has taught me a lot and has given me many opportunities to expand my capabilities in web development.

            Throughout the project, we had many issues connecting the front-end to a database, including connecting to the server, writing asynchronous functionality, and processing promises. We implemented various strategies to combat the issues by researching similar problems online and experimenting with various scenarios on separate branches. Eventually, we discovered a method that allowed us to set up the functions for the server to communicate with the client. This solution involved utilising the primary sequence of the script and modular JavaScript functionality to allow the client to wait for the data to process before proceeding. To account for edge cases, I implemented checks to ensure the communication was functioning before continuing with the script.
            
            In future projects, I would like to improve my time management. We found ourselves spreading the project unevenly over time, with quick progression over some weeks and little to no progress on others. This uneven progress caused confusion and a loss of cohesiveness within the group and slowed the integration of our roles. A solution to this would be to schedule goals and milestones to complete specific tasks, allowing us to navigate our time management more effectively.
            
            We worked all right as a team. Our team split work into our specialties, such as my experience with HTML/CSS, front-end JavaScript, and UI design, which landed me a role in building the front-end site. This arrangement allowed us to create a project that significantly benefited from each of our strengths. One major struggle for our group was working around some of our team member’s skill levels, which proved a challenge for part of our group to fully understand and incorporate into the more technical side of the project. We attempted many strategies to incorporate this as best we could by explaining the programming we were implementing and trying to gain input at many stages to share in the work. In future scenarios, this is an area we need to improve heavily on, as we found it hard to spread tasks over the experience gradient, and we are open to input ideas on how to do this.
            </p>
        </section>
        <section class="void void-buttons">
             <button id="conclusion-button">Back</button>
        </section>
        `
        document.querySelector('.parallax').scrollTop = 0;
        document.querySelector('#conclusion-button').addEventListener('click', () => {
            displayConclusion()
            document.querySelector('.parallax').scrollTop = 0;
        })
    })
}
function displayAnswers(question=null) {
    conclusionClasses(false)
    clearInterval(countTick);
    countElement.innerHTML = `Your Answers`;

    let prevButtonsHTML = ``;
    for (let i = 0; i < questionList.length; i++) {
        prevButtonsHTML += `
            <button id="prevButton${i}" class="previous-question-button">Q${i + 1}</button>
        `
    }

    mainElement.innerHTML = `
    <h2>Edit Answers:</h2>
    <div>
        <div id="prevAnswersContainer">
        </div>
        <div class="previous-questions">
            <div class="previous-questions-grid">
                ${prevButtonsHTML}
            </div>
        </div>
    </div>
    <button id="back">Back</button>
    `

    if (question !== null) {
        console.log(question)
        console.log(myAnswers)
        console.log(myAnswers[question])
        document.querySelector('#prevAnswersContainer').outerHTML = `
            <div class="previous-answers-container" id="prevAnswersContainer">
                <div id="prevAnswerEdit${question}" class="previous-answer-edit"></div>
                <div class="previous-answer-title" id="prevAnswer${question}">
                    <h3>Q${question + 1}: ${questionList[question].question}</h3>
                    <h4>${myAnswers[question] !== null ? ` ${questionList[question].answers[myAnswers[question]]}` : 'Not Answered'}</h4>
                </div>
                <div id="prevAnswerResults${question}" class="previous-answer-results"></div>
            </div>
            `

        document.querySelector(`#prevAnswerEdit${question}`).addEventListener('click', function () {
            displayNextQuestion(question)
        });
        document.querySelector(`#prevAnswerResults${question}`).addEventListener('click', function () {
            displayResults(question)
        });
    }

    for (let i = 0; i < questionList.length; i++) {
        document.querySelector(`#prevButton${i}`).addEventListener('click', function() {
            document.querySelector('#prevAnswersContainer').outerHTML = `
            <div class="previous-answers-container" id="prevAnswersContainer">
                <div id="prevAnswerEdit${i}" class="previous-answer-edit"></div>
                <div class="previous-answer-title" id="prevAnswer${i}">
                    <h3>Q${i + 1}: ${questionList[i].question}</h3>
                    <h4>${myAnswers[i] !== null ? ` ${questionList[i].answers[myAnswers[i]]}` : 'Not Answered'}</h4>
                </div>
                <div id="prevAnswerResults${i}" class="previous-answer-results"></div>
            </div>
            `

            document.querySelector(`#prevAnswerEdit${i}`).addEventListener('click', function () {
                displayNextQuestion(i)
            });
            document.querySelector(`#prevAnswerResults${i}`).addEventListener('click', function () {
                displayResults(i)
            });
        });
    }

    // Create button to leave
    document.querySelector('#back').addEventListener('click', function() {
        if (isComplete()) {
            displayConclusion()
            document.querySelector('.parallax').scrollTop = 0;
        } else {
            if (isComplete(0, "i") === 0)
                displayStart()
            else {
                displayNextQuestion()
            }
        }
    });

}
function displayStart() {
    conclusionClasses(false)
    countElement.innerHTML = `${questionList.length} Questions`;
    if (isComplete()) {
        mainElement.innerHTML = `
        <h1>${documentTitle}</h1>
        <p>You have already completed this survey. To see the conclusion, press the "See Conclusion" button.</p>
        <button id="start">See Conclusion</button>
        `
    } else {
        mainElement.innerHTML = `
        <h1>${documentTitle}</h1>
        <p class="intro">This survey aims to study the impacts of COVID-19 on members of the East-Melbourne community. The results from this study will provide insight on how governments can better react to future pandemics, without negativley impacting the livelihoods of its citizens.</p>
        <p>By clicking "Start Survey!", you agree to share your answers for this survey <strong>anonymously</strong> for use in this study. Particpant data cannot be traced back to any individual user, and will be deleted after the study concludes.</p>
        <div id="start-buttons">
            <button id="start">${isComplete(0, "i") === 0 ? 'Start Survey!' : 'Continue Survey'}</button>
            <button id="skip">See Conclusion</button>
        </div>
        `
        // Create a button to skip to conclusion
        document.querySelector('#skip').addEventListener('click', function() {
            displayConclusion();
        });
    }

    // Create a button to start the survey
    document.querySelector('#start').addEventListener('click', function() {
        displayNextQuestion();
    });
}
function displayLoader() {
    conclusionClasses(false)
    mainElement.innerHTML = `
        <div id="loader">
            <div id="loader-wheel">
                <img alt="Gang Show Logo" src="/favicon.png" id="loader-logo">
            </div>
            <div id="loader-title">Computing Sac 1</div>
            <div id="loader-subtitle">Loading...</div>
            <div id="loader-notice">This site relies on JavaScript, if you have JavaScript disabled, please enable to view the site.</div>
        </div>
    `
}
function isComplete(start=0, mode=`boolean`) {
    for (let i = start; i <= questionList.length; i++) {
        if (i >= questionList.length ) {
            return true;
        } else if (myAnswers[i] === null) {
            if (mode === `boolean`) {
                return false;
            } else if (mode === 'i') {
                return i;
            }
        }
    }
}
function conclusionClasses(mode) {
    if (mode) {
        document.documentElement.classList.add('parallax-html');
        document.body.classList.add('parallax-body');
        mainElement.classList.add('parallax');
        mainElement.classList.remove('main');
        headerElement.style.paddingTop = '0';
    }
    else {
        document.documentElement.classList.remove('parallax-html');
        document.body.classList.remove('parallax-body');
        mainElement.classList.remove('parallax');
        mainElement.classList.add('main');
        headerElement.style.paddingTop = '1rem';
    }
}

// Initiate Common Variables
const mainElement = document.querySelector('main');
const headerElement = document.querySelector('header');
const countElement = document.querySelector('#question-count');
const documentTitle = `Attitudes To COVID-19`
let currentQuestion = 0;
let countTick;
countElement.innerHTML = `${questionList.length} Questions`;

// Display Loading Screen
displayLoader()

// Check For Backend
let errorCheckServer;
try {
    errorCheckServer = await sendCommand(`TUG:masterData`)
    console.log(errorCheckServer[0])
    errorCheckServer = true
} catch {
    mainElement.innerHTML = `
            <h1>The Server Is Offline :(</h1>
            <p>Please Try Again Later.</p>
        `
    errorCheckServer = false
    throw new Error('Could not fetch data from backend, process aborted.');
}

// Assign UUID to users without one
let userUUID;
let userDataUUID;
if (document.cookie) {
    userUUID = getCookie('uuid')
    userDataUUID = userUUID.replace(/-/g, "_")
} else {
    userUUID = UUIDv4();
    document.cookie = `uuid=${userUUID};`
    userDataUUID = userUUID.replace(/-/g, "_")

    let answerDefinitions = ``;
    for (let i = 0; i < questionList.length; i++) {
        answerDefinitions += `q${i} int, `;
    }
    //answerDefinitions = answerDefinitions.slice(0,-2);
    await sendCommand(`BIRTH:${userDataUUID}:${answerDefinitions}`)
}

// Check if backend recognises UUID
let errorCheckUser;
if (errorCheckServer === true) {
    try {
        errorCheckUser = await sendCommand(`TUG:${userDataUUID}`)
        console.log(errorCheckUser[0])
    } catch {
        document.cookie = `uuid=;expires=Thu, 01 Jan 1970 00:00:00 GMT`
        location.reload()
    }
}

// Setup Backend Variables
try {
    answerData = []
    let getAnswerData = await sendCommand(`TUG:masterData`)
    for (let i = 0; i <= questionList.length; i++) {
        answerData.push([])
        for (let key in getAnswerData[i]) {
            if (getAnswerData[i][key] === null) {
                answerData[i].push(0)
            } else {
                answerData[i].push(getAnswerData[i][key])
            }
        }
        answerData[i] = answerData[i].slice(0, -1)
    }
    answerData = answerData.slice(0, -1)
} catch {
    throw new Error('Could not fetch \"masterData\" table.')
}

try {
    myAnswers = []
        let getMyAnswers = await sendCommand(`TUG:${userDataUUID}`)
    for (let key in getMyAnswers[0]) {
        myAnswers.push(getMyAnswers[0][key])
    }
    myAnswers = myAnswers.slice(0, -1)
} catch {
    throw new Error('Could not fetch UUID table.')
}


// Create button to see your current answers
countElement.classList.add("question-count-hover");
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


async function sendCommand(command) {
    const data = { query: command };

    try {
        let response = await fetch("https://vk3dns.clearycoding.com:8080", {
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