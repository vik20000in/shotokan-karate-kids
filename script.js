// Variables
let karateData = null; // Will be loaded from data.json
let currentBelt = "";
let quizQuestions = [];
let currentQuizIndex = 0;
let stars = JSON.parse(localStorage.getItem("stars")) || [];

// Sections
const beltSection = document.getElementById("belt-section");
const choiceSection = document.getElementById("choice-section");
const quizSection = document.getElementById("quiz-section");
const progressSection = document.getElementById("progress-section");

// TTS controls
const ttsOn = document.getElementById("tts-on");
const ttsOff = document.getElementById("tts-off");
let ttsEnabled = false;

// Fetch data from data.json
fetch('data.json')
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to load data.json');
        }
        return response.json();
    })
    .then(data => {
        karateData = data;
        updateProgress();
        showOnly(beltSection);
    })
    .catch(error => {
        console.error('Error loading data:', error);
        alert('Could not load quiz data. Please try again later.');
    });

// Show only the specified section, hide others
function showOnly(section) {
    [beltSection, choiceSection, quizSection].forEach(s => {
        s.classList.toggle("hidden", s !== section);
    });
    progressSection.classList.remove("hidden"); // Always show progress
}

// Select a belt and show options
function selectBelt(belt) {
    currentBelt = belt;
    showOnly(choiceSection);
    document.getElementById("belt-title").textContent = `${belt.charAt(0).toUpperCase() + belt.slice(1)} Belt Fun`;
}

// Start the quiz for the selected belt
function startQuiz() {
    if (!karateData) {
        alert('Data is still loading. Please wait a moment.');
        return;
    }
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

    document.getElementById("feedback").classList.add("hidden");
    document.getElementById("next-question").disabled = false; // Always enabled

    if (ttsEnabled) {
        let optionsText = quiz.options.map((option, index) => `Option ${String.fromCharCode(65 + index)}: ${option}`).join('. ');
        let fullText = `The question is: ${quiz.question}. ${optionsText}`;
        speak(fullText);
    }
}

// Handle answer selection
function selectAnswer(index, button) {
    const quiz = quizQuestions[currentQuizIndex];
    const feedback = document.getElementById("feedback");

    if (index === quiz.answer) {
        feedback.textContent = "Hiyah! That’s right! 🌟";
        feedback.style.color = "#33cc99"; // Green
        stars.push(`Star for Quiz ${currentQuizIndex + 1} (${currentBelt})`);
        localStorage.setItem("stars", JSON.stringify(stars));
        updateProgress();
    } else {
        feedback.textContent = "Oops! Try again, champ! 🌟";
        feedback.style.color = "#ff3366"; // Red
    }
    feedback.classList.remove("hidden");

    if (ttsEnabled) {
        speak(button.textContent); // Read selected answer
        if (index === quiz.answer && quiz.explanation) {
            speak(quiz.explanation); // Read explanation if correct
        }
    }
}

// Move to the next question
function nextQuestion() {
    currentQuizIndex++;
    loadQuizQuestion();
}

// Navigation
function backToChoice() {
    showOnly(choiceSection);
}

// Update progress display
function updateProgress() {
    document.getElementById("progress-text").textContent = `Stars: ${stars.length}`;
}

// Text-to-Speech functionality
function speak(text) {
    if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'en-US';
        speechSynthesis.speak(utterance);
    } else {
        console.warn("Text-to-Speech not supported in this browser.");
    }
}

// TTS toggle listener
ttsOn.addEventListener('change', () => { ttsEnabled = true; });
ttsOff.addEventListener('change', () => { ttsEnabled = false; });