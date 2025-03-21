// Load data from JSON (assumed structure)
let karateData = {};
let currentBelt = "";
let quizQuestions = [];
let currentQuizIndex = 0;
let stars = JSON.parse(localStorage.getItem("stars")) || [];
let currentLessonIndex = 0;
let lessons = [];

// Sections
const beltSection = document.getElementById("belt-section");
const choiceSection = document.getElementById("choice-section");
const quizSection = document.getElementById("quiz-section");
const progressSection = document.getElementById("progress-section");
const syllabusSection = document.getElementById("syllabus-section");
const lessonsSection = document.getElementById("lessons-section");

// TTS controls
const ttsOn = document.getElementById("tts-on");
const ttsOff = document.getElementById("tts-off");
let ttsEnabled = false;

// Fetch data from data.json and populate belt dropdown
fetch('data.json')
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to load data.json');
        }
        return response.json();
    })
    .then(data => {
        karateData = data;
        populateBeltDropdown();
        updateProgress();
        showOnly(beltSection);
    })
    .catch(error => {
        console.error('Error loading data:', error);
        alert('Could not load quiz data. Please try again later.');
    });

// Populate the belt dropdown with options from data.json
function populateBeltDropdown() {
    const dropdown = document.getElementById("belt-dropdown");
    Object.keys(karateData).forEach(belt => {
        const option = document.createElement("option");
        option.value = belt;
        option.textContent = `${belt.charAt(0).toUpperCase() + belt.slice(1)} Belt`;
        dropdown.appendChild(option);
    });
}

// Show only the specified section, hide others
function showOnly(section) {
    document.getElementById('belt-section').classList.add('hidden');
    document.getElementById('choice-section').classList.add('hidden');
    document.getElementById('quiz-section').classList.add('hidden');
    document.getElementById('syllabus-section').classList.add('hidden');
    document.getElementById('lessons-section').classList.add('hidden');
    section.classList.remove('hidden');
    progressSection.classList.remove("hidden"); // Always show progress
}

// Select a belt and show options
function selectBelt(belt) {
    if (!belt) return; // Prevent action if no belt is selected
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
    speechSynthesis.cancel(); // Stop any ongoing speech
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
        btn.dataset.index = index;
        btn.onclick = () => selectAnswer(index, btn);

        // Check if option is an object (with text and image) or just text
        if (typeof option === "object" && option.text && option.image) {
            const img = document.createElement("img");
            img.src = option.image;
            img.alt = option.text;
            btn.appendChild(img);
            btn.appendChild(document.createTextNode(option.text));
        } else {
            btn.textContent = option; // Fallback for text-only options
        }

        optionsDiv.appendChild(btn);
    });

    document.getElementById("feedback").classList.add("hidden");
    document.getElementById("next-question").disabled = false; // Always enabled

    if (ttsEnabled) {
        let optionsText = quiz.options.map((option, index) => {
            const text = typeof option === "object" ? option.text : option;
            return `Option ${String.fromCharCode(65 + index)}: ${text}`;
        }).join('. ');
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
        const optionText = typeof quiz.options[index] === "object" ? quiz.options[index].text : quiz.options[index];
        speak(optionText); // Speak selected answer
        speak(feedback.textContent); // Speak feedback message
        if (index === quiz.answer && quiz.explanation) {
            speak(quiz.explanation); // Speak explanation if correct
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
    speechSynthesis.cancel(); // Stop any ongoing speech
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

function showSyllabus() {
    const belt = currentBelt;
    if (!belt) {
        alert('Please select a belt first.');
        return;
    }
    fetch('syllabus.json')
        .then(response => response.json())
        .then(data => {
            const syllabus = data[belt].syllabus;
            const syllabusList = document.getElementById('syllabus-list');
            syllabusList.innerHTML = '';
            syllabus.forEach(item => {
                const li = document.createElement('li');
                li.textContent = item;
                syllabusList.appendChild(li);
            });
            showOnly(syllabusSection);
        })
        .catch(error => console.error('Error loading syllabus:', error));
}

// Show lessons list and handle lesson selection
function showLessons() {
    const belt = currentBelt;
    if (!belt) {
        alert('Please select a belt first.');
        return;
    }
    fetch('lessons.json')
        .then(response => response.json())
        .then(data => {
            lessons = data[belt].lessons;
            const lessonsList = document.getElementById('lessons-list');
            lessonsList.innerHTML = '';
            lessons.forEach((lesson, index) => {
                const lessonItem = document.createElement('button');
                lessonItem.classList.add('fun-btn');
                lessonItem.textContent = lesson.title;
                lessonItem.onclick = () => selectLesson(index);
                lessonsList.appendChild(lessonItem);
            });
            showOnly(lessonsSection);
            document.getElementById('lesson-content').classList.add('hidden');
            lessonsList.classList.remove('hidden');
        })
        .catch(error => console.error('Error loading lessons:', error));
}

// Select a lesson to view
function selectLesson(index) {
    currentLessonIndex = index;
    displayLesson();
}

// Display the current lesson
function displayLesson() {
    const lesson = lessons[currentLessonIndex];
    const lessonTitle = document.getElementById('lesson-title');
    const lessonMedia = document.getElementById('lesson-media');
    lessonTitle.textContent = lesson.title;
    lessonMedia.innerHTML = '';

    if (lesson.type === 'video') {
        const iframe = document.createElement('iframe');
        iframe.src = lesson.url;
        lessonMedia.appendChild(iframe);
    } else if (lesson.type === 'image') {
        const img = document.createElement('img');
        img.src = lesson.url;
        img.alt = lesson.title;
        lessonMedia.appendChild(img);
    }

    document.getElementById('lessons-list').classList.add('hidden');
    document.getElementById('lesson-content').classList.remove('hidden');
}

// Navigate to the previous lesson
function prevLesson() {
    if (currentLessonIndex > 0) {
        currentLessonIndex--;
        displayLesson();
    }
}

// Navigate to the next lesson
function nextLesson() {
    if (currentLessonIndex < lessons.length - 1) {
        currentLessonIndex++;
        displayLesson();
    }
}

// Show the list of lessons
function backToLessons() {
    document.getElementById('lesson-content').classList.add('hidden');
    document.getElementById('lessons-list').classList.remove('hidden');
}