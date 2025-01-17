// Variables for the typing test
let timerInterval;
let startTime;
let totalErrors = 0;
let characterTyped = 0;
let currentParagraph = '';
let paragraphs = [
    "The quick brown fox jumps over the lazy dog.",
    "A journey of a thousand miles begins with a single step.",
    "To be or not to be, that is the question."
];
let currentParagraphIndex = 0;
const typingArea = document.getElementById('typing-area');
const paragraphDisplay = document.getElementById('paragraph-display');
let timerStarted = false;
let correctCharacters = 0;

// Initialize the typing test
function initializeTest() {
    currentParagraph = paragraphs[currentParagraphIndex];
    paragraphDisplay.innerHTML = currentParagraph.split('').map(char => `<span>${char}</span>`).join('');
    typingArea.value = '';
    totalErrors = 0;
    characterTyped = 0;
    correctCharacters = 0;
    document.getElementById('wpm').textContent = '0';
    document.getElementById('accuracy').textContent = '100%';
    document.getElementById('timer').textContent = '0:00';
    timerStarted = false;
    clearInterval(timerInterval);
    typingArea.focus();
}

// Update the timer
function updateTimer() {
    let currentTime = new Date().getTime();
    let timeElapsed = Math.floor((currentTime - startTime) / 1000);
    let minutes = Math.floor(timeElapsed / 60);
    let seconds = timeElapsed % 60;
    document.getElementById('timer').textContent = `${minutes}:${seconds < 10 ? '0' + seconds : seconds}`;
}

// Calculate WPM and Accuracy
function calculateStats() {
    let wordsTyped = correctCharacters / 5;
    let timeElapsed = (new Date().getTime() - startTime) / 60000; // convert to minutes
    let wpm = Math.floor(wordsTyped / timeElapsed);
    let accuracy = Math.floor(((characterTyped - totalErrors) / characterTyped) * 100);

    document.getElementById('wpm').textContent = wpm > 0 ? wpm : 0;
    document.getElementById('accuracy').textContent = `${accuracy > 0 ? accuracy : 0}%`;
}

// Handle typing input
typingArea.addEventListener('input', () => {
    if (!timerStarted) {
        timerStarted = true;
        startTime = new Date().getTime();
        timerInterval = setInterval(updateTimer, 1000);
    }

    let typedText = typingArea.value;
    characterTyped = typedText.length;
    let spanElements = paragraphDisplay.querySelectorAll('span');
    totalErrors = 0;
    correctCharacters = 0;

    for (let i = 0; i < spanElements.length; i++) {
        let char = typedText[i];
        if (char == null) {
            spanElements[i].classList.remove('correct', 'incorrect');
        } else if (char === spanElements[i].textContent) {
            spanElements[i].classList.add('correct');
            spanElements[i].classList.remove('incorrect');
            correctCharacters++;
        } else {
            spanElements[i].classList.add('incorrect');
            spanElements[i].classList.remove('correct');
            totalErrors++;
        }
    }

    if (typedText === currentParagraph) {
        clearInterval(timerInterval);
        displayResults();
    }

    calculateStats();
});

// Display results
function displayResults() {
    document.getElementById('final-wpm').textContent = document.getElementById('wpm').textContent;
    document.getElementById('final-accuracy').textContent = document.getElementById('accuracy').textContent;
    document.getElementById('final-errors').textContent = totalErrors;
    document.getElementById('final-time').textContent = document.getElementById('timer').textContent;
    document.getElementById('results').classList.remove('hidden');
}

// Event listeners for restart and theme toggle
document.getElementById('restart-button').addEventListener('click', initializeTest);
document.getElementById('theme-toggle').addEventListener('change', (e) => {
    document.body.classList.toggle('dark-mode', e.target.checked);
});

// Initialize the first test on page load
window.onload = initializeTest;