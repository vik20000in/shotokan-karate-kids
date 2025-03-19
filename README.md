# Shotokan Karate Kids

A simple, mobile-friendly web application to teach kids Shotokan Karate. No login required—progress is stored locally in the browser.

## Features
- Belt-based lessons (White, Yellow, Orange) with videos and text.
- Quizzes to test knowledge.
- Progress tracking with completed lessons and badges.

## How to Use
1. Open `index.html` in a browser or host it on GitHub Pages.
2. Choose a belt level and start a lesson.
3. Watch the video, read the text, and take the quiz.
4. Track your progress at the bottom.

## Hosting on GitHub
1. Create a GitHub repository.
2. Upload all files (`index.html`, `styles.css`, `script.js`, `data.json`).
3. Enable GitHub Pages in the repository settings (use the `main` branch).
4. Access the app at `https://<username>.github.io/<repository-name>`.

## Requirements
- Modern web browser (Chrome, Firefox, etc.).
- Internet connection for video embeds.

## Notes
- Videos are embedded from YouTube. Replace URLs in `data.json` with your own if needed.
- Progress is stored in browser local storage and resets if the cache is cleared.