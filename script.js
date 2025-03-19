// Load data from JSON
let karateData = {};
let currentBelt = "";
let currentLesson = null;
let completedLessons = JSON.parse(localStorage.getItem("completedLessons")) || {};
let badges = JSON.parse(localStorage.getItem("badges")) || [];

fetch("data.json")
    .then(response => response.json())
    .then(data => {
        karateData = data;
        updateProgress();
    });

function loadContent() {
    currentBelt = document.getElementById("belt-select").value;
    document.getElementById("belt-selection").classList.add("hidden");
    document.getElementById("lesson-section").classList.remove("hidden");
    
    // Load the first lesson for the selected belt
    currentLesson = karateData[currentBelt].lessons[0];
    document.getElementById("lesson-title").textContent = currentLesson.title;
    document.getElementById("lesson-text").textContent = currentLesson.text;
    document.getElementById("lesson-video").innerHTML = `<iframe width="100%" height="200" src="${currentLesson.video}" frameborder="0" allowfullscreen></iframe>`;
}

function showQuiz() {
    document.getElementById("lesson-section").classList.add("hidden");
    document.getElementById("quiz-section").classList.remove("hidden");

    const quiz = currentLesson.quiz;
    document.getElementById("quiz-question").textContent = quiz.question;
    const optionsDiv = document.getElementById("quiz-options");
    optionsDiv.innerHTML = "";
    quiz.options.forEach((option, index) => {
        const optionElement = document.createElement("div");
        optionElement.classList.add("option");
        optionElement.textContent = `${String.fromCharCode(65 + index)}. ${option}`;
        optionElement.onclick = () => selectOption(index);
        optionsDiv.appendChild(optionElement);
    });
}

let selectedOption = null;
function selectOption(index) {
    selectedOption = index;
    const options = document.getElementsByClassName("option");
    for (let i = 0; i < options.length; i++) {
        options[i].style.backgroundColor = i === index ? "#3498db" : "#ecf0f1";
    }
}

function submitQuiz() {
    if (selectedOption === null) {
        alert("Please select an option!");
        return;
    }

    const quiz = currentLesson.quiz;
    if (selectedOption === quiz.answer) {
        alert(`Correct! ${quiz.explanation}`);
        if (!completedLessons[currentBelt]) completedLessons[currentBelt] = [];
        if (!completedLessons[currentBelt].includes(currentLesson.title)) {
            completedLessons[currentBelt].push(currentLesson.title);
            badges.push(`Master of ${currentLesson.title}`);
            localStorage.setItem("completedLessons", JSON.stringify(completedLessons));
            localStorage.setItem("badges", JSON.stringify(badges));
            updateProgress();
        }
    } else {
        alert(`Oops! The correct answer is ${quiz.options[quiz.answer]}. ${quiz.explanation}`);
    }
    backToLesson();
}

function backToLesson() {
    document.getElementById("quiz-section").classList.add("hidden");
    document.getElementById("lesson-section").classList.remove("hidden");
}

function backToBelt() {
    document.getElementById("lesson-section").classList.add("hidden");
    document.getElementById("belt-selection").classList.remove("hidden");
}

function updateProgress() {
    const totalLessons = Object.values(completedLessons).flat().length;
    const totalBadges = badges.length;
    document.getElementById("progress-text").textContent = 
        `Lessons Completed: ${totalLessons} | Badges Earned: ${totalBadges}`;
}