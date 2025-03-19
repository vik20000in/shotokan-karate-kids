

// Load data from JSON
let karateData = {};
let currentBelt = "";
let currentLesson = null;
let quizQuestions = [];
let currentQuizIndex = 0;
let completedLessons = JSON.parse(localStorage.getItem("completedLessons")) || {};
let stars = JSON.parse(localStorage.getItem("stars")) || [];

// Sections
const beltSection = document.getElementById("belt-section");
const choiceSection = document.getElementById("choice-section");
const lessonListSection = document.getElementById("lesson-list");
const lessonSection = document.getElementById("lesson-section");
const quizSection = document.getElementById("quiz-section");
const progressSection = document.getElementById("progress-section");

fetch("data.json")
    .then(response => response.json())
    .then(data => {
        karateData = data;
        updateProgress();
        showOnly(beltSection); // Start with only belt selection visible
    });

// Show only the specified section, hide others
function showOnly(section) {
    [beltSection, choiceSection, lessonListSection, lessonSection, quizSection].forEach(s => {
        if (s === section) {
            s.classList.remove("hidden");
        } else {
            s.classList.add("hidden");
        }
    });
    progressSection.classList.remove("hidden"); // Always show progress
}

// Select a belt and show options
function selectBelt(belt) {
    currentBelt = belt;
    showOnly(choiceSection);
    document.getElementById("belt-title").textContent = `${belt.charAt(0).toUpperCase() + belt.slice(1)} Belt Fun`;
}

// Show the lesson list for the selected belt
function showLessons() {
    showOnly(lessonListSection);
    document.getElementById("lesson-belt-title").textContent = `${currentBelt.charAt(0).toUpperCase() + currentBelt.slice(1)} Belt Lessons`;

    const lessonsDiv = document.getElementById("lessons");
    lessonsDiv.innerHTML = "";
    karateData[currentBelt].lessons.forEach((lesson, index) => {
        const btn = document.createElement("button");
        btn.classList.add("lesson-btn");
        btn.textContent = lesson.title;
        btn.onclick = () => showLesson(index);
        lessonsDiv.appendChild(btn);
    });
}

// Show a specific lesson
function showLesson(index) {
    currentLesson = karateData[currentBelt].lessons[index];
    showOnly(lessonSection);
    document.getElementById("lesson-title").textContent = currentLesson.title;
    document.getElementById("lesson-text").textContent = currentLesson.text;
    document.getElementById("lesson-video").innerHTML = `<iframe width="100%" height="200" src="${currentLesson.video}" title="Karate Lesson" frameborder="0" allowfullscreen></iframe>`;
}

// Start the quiz for the selected belt
function startQuiz() {
    showOnly(quizSection);
    quizQuestions = karateData[currentBelt].quizzes;
    currentQuizIndex = 0;
    loadQuizQuestion();
}

// Load the current quiz question
function loadQuizQuestion() {
    if (currentQuizIndex >= quizQuestions.length) {
        alert("Great job, karate star! You finished the quiz! 🌟");
        backToChoice();
        return;
    }

    const quiz = quizQuestions[currentQuizIndex];
    document.getElementById("quiz-question").textContent = quiz.question;
    const image = document.getElementById("quiz-image");
    if (quiz.image) {
        image.src = quiz.image;
        image.classList.remove("hidden");
    } else {
        image.classList.add("hidden");
    }

    const optionsDiv = document.getElementById("quiz-options");
    optionsDiv.innerHTML = "";
    quiz.options.forEach((option, index) => {
        const btn = document.createElement("button");
        btn.classList.add("quiz-btn");
        btn.textContent = option;
        btn.dataset.index = index;
        btn.onclick = () => selectAnswer(index, btn);
        optionsDiv.appendChild(btn);
    });
}

let selectedAnswer = null;
function selectAnswer(index, button) {
    selectedAnswer = index;
    const buttons = document.getElementsByClassName("quiz-btn");
    for (let btn of buttons) {
        btn.classList.remove("selected");
    }
    button.classList.add("selected");
}

// Check the selected quiz answer
function checkAnswer() {
    if (selectedAnswer === null) {
        alert("Pick an answer, little karate champ! 🌟");
        return;
    }

    const quiz = quizQuestions[currentQuizIndex];
    if (selectedAnswer === quiz.answer) {
        alert(`Hiyah! Awesome job! 🌟 ${quiz.explanation}`);
        stars.push(`Star for Quiz ${currentQuizIndex + 1} (${currentBelt})`);
        localStorage.setItem("stars", JSON.stringify(stars));
        updateProgress();
    } else {
        alert(`Super try! The right answer is "${quiz.options[quiz.answer]}". ${quiz.explanation} You’re still a star! 🌟`);
    }
    selectedAnswer = null;
    document.getElementById("submit-quiz").classList.add("hidden");
    document.getElementById("next-question").classList.remove("hidden");
}

// Move to the next quiz question
function nextQuestion() {
    currentQuizIndex++;
    loadQuizQuestion();
    document.getElementById("submit-quiz").classList.remove("hidden");
    document.getElementById("next-question").classList.add("hidden");
}

// Navigation functions
function backToLessonList() {
    showOnly(lessonListSection);
    if (!completedLessons[currentBelt]) completedLessons[currentBelt] = [];
    if (!completedLessons[currentBelt].includes(currentLesson.title)) {
        completedLessons[currentBelt].push(currentLesson.title);
        localStorage.setItem("completedLessons", JSON.stringify(completedLessons));
        updateProgress();
    }
}

function backToChoice() {
    showOnly(choiceSection);
}

function backToBelts() {
    showOnly(beltSection);
}

// Update the progress display
function updateProgress() {
    const totalLessons = Object.values(completedLessons).flat().length;
    const totalStars = stars.length;
    document.getElementById("progress-text").textContent = 
        `Lessons Done: ${totalLessons} | Stars: ${totalStars}`;
}