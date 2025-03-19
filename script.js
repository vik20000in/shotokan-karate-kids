// Load data from JSON
let karateData = {};
let currentBelt = "";
let currentLesson = null;
let quizQuestions = [];
let currentQuizIndex = 0;
let completedLessons = JSON.parse(localStorage.getItem("completedLessons")) || {};
let stars = JSON.parse(localStorage.getItem("stars")) || [];

fetch("data.json")
    .then(response => response.json())
    .then(data => {
        karateData = data;
        updateProgress();
    });

function selectBelt(belt) {
    currentBelt = belt;
    document.getElementById("belt-section").classList.add("hidden");
    document.getElementById("choice-section").classList.remove("hidden");
    document.getElementById("belt-title").textContent = `${belt.charAt(0).toUpperCase() + belt.slice(1)} Belt Fun`;
}

function showLessons() {
    document.getElementById("choice-section").classList.add("hidden");
    document.getElementById("lesson-list").classList.remove("hidden");
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

function showLesson(index) {
    currentLesson = karateData[currentBelt].lessons[index];
    document.getElementById("lesson-list").classList.add("hidden");
    document.getElementById("lesson-section").classList.remove("hidden");
    document.getElementById("lesson-title").textContent = currentLesson.title;
    document.getElementById("lesson-text").textContent = currentLesson.text;
    document.getElementById("lesson-video").innerHTML = `<iframe width="100%" height="200" src="${currentLesson.video}" title="Karate Lesson" frameborder="0" allowfullscreen></iframe>`;
}

function startQuiz() {
    document.getElementById("choice-section").classList.add("hidden");
    document.getElementById("quiz-section").classList.remove("hidden");
    quizQuestions = karateData[currentBelt].quizzes;
    currentQuizIndex = 0;
    loadQuizQuestion();
}

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
}

function nextQuestion() {
    if (selectedAnswer === null) {
        alert("Answer this one first, karate hero! 🌟");
        return;
    }
    currentQuizIndex++;
    loadQuizQuestion();
}

function backToLessonList() {
    document.getElementById("lesson-section").classList.add("hidden");
    document.getElementById("lesson-list").classList.remove("hidden");
    if (!completedLessons[currentBelt]) completedLessons[currentBelt] = [];
    if (!completedLessons[currentBelt].includes(currentLesson.title)) {
        completedLessons[currentBelt].push(currentLesson.title);
        localStorage.setItem("completedLessons", JSON.stringify(completedLessons));
        updateProgress();
    }
}

function backToChoice() {
    document.getElementById("lesson-list").classList.add("hidden");
    document.getElementById("quiz-section").classList.add("hidden");
    document.getElementById("choice-section").classList.remove("hidden");
}

function backToBelts() {
    document.getElementById("choice-section").classList.add("hidden");
    document.getElementById("belt-section").classList.remove("hidden");
}

function updateProgress() {
    const totalLessons = Object.values(completedLessons).flat().length;
    const totalStars = stars.length;
    document.getElementById("progress-text").textContent = 
        `Lessons Done: ${totalLessons} | Stars: ${totalStars}`;
}