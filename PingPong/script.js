let score1 = 0;
let score2 = 0;
let serveTurn = 1;
let serveCount = 1; // Start serve count with 1
let winningPoints = 7;
let isDeuce = false; // Track if the game is in deuce
const winInfo = document.getElementById('win-info');
const deuceMessage = document.getElementById('deuce-message');
let gameActive = true; // Track if the game is active
let currentLanguage = 'en'; // Track current language

// Update winning points label when slider value changes
function updateWinningPointsLabel(value) {
  document.getElementById('winning-points-label').textContent = value;
  winningPoints = parseInt(value);
  resetGame();
}

// Set winning points based on user input
document.getElementById('winning-points').addEventListener('change', function() {
  winningPoints = parseInt(this.value);
  resetGame();
});

// Change the initial server when player title is clicked
function changeInitialServer(player) {
  if (score1 === 0 && score2 === 0) {
    serveTurn = player;
    updateServeIndicator();
  }
}

function addPoint(player) {
  if (!gameActive) return; // Prevent adding points if game is over
  if (player === 1) score1++;
  else score2++;

  updateScores();
  checkServe();
  checkWinner();
}

function updateScores() {
  document.getElementById('score1').textContent = score1;
  document.getElementById('score2').textContent = score2;
}

function checkServe() {
  let totalPoints = score1 + score2;

  // Check if it’s deuce
  if (score1 >= winningPoints - 1 && score2 >= winningPoints - 1 && score1 === score2) {
    isDeuce = true; // Enter deuce state
    deuceMessage.textContent = translations[currentLanguage].deuce;
    deuceMessage.classList.add('active'); // Show deuce message
    serveTurn = totalPoints % 2 === 0 ? 1 : 2; // Switch serve every 1 point in deuce
    serveCount = 0;
  } else if (isDeuce) {
    deuceMessage.textContent = translations[currentLanguage].deuce; // Keep deuce displayed
    deuceMessage.classList.add('active'); // Show deuce message
    serveTurn = totalPoints % 2 === 0 ? 1 : 2; // Switch serve every 1 point in deuce
  } else {
    deuceMessage.textContent = ""; // Clear deuce message
    deuceMessage.classList.remove('active'); // Hide deuce message
    if (serveCount >= 2) { // Switch serve every 2 points before deuce
      serveTurn = serveTurn === 1 ? 2 : 1;
      serveCount = 0;
    }
  }

  serveCount++;
  updateServeIndicator();
}

function updateServeIndicator() {
  document.getElementById('score1').classList.toggle('serving', serveTurn === 1);
  document.getElementById('score2').classList.toggle('serving', serveTurn === 2);
}

function checkWinner() {
  if (score1 >= winningPoints && score1 - score2 >= 2) {
    declareWinner(1);
  } else if (score2 >= winningPoints && score2 - score1 >= 2) {
    declareWinner(2);
  }
}

function declareWinner(winner) {
  // Apply winning styles
  if (winner === 1) {
    document.getElementById('score1').classList.add('winner');
    document.getElementById('score2').classList.remove('winner');
  } else {
    document.getElementById('score2').classList.add('winner');
    document.getElementById('score1').classList.remove('winner');
  }
  deuceMessage.textContent = ""; // Clear deuce message
  deuceMessage.classList.remove('active'); // Hide deuce message
  gameActive = false; // Mark game as inactive
  disableServeIndicator(); // Turn off the serve indicator
}

function disableServeIndicator() {
  document.getElementById('score1').classList.remove('serving');
  document.getElementById('score2').classList.remove('serving');
}

function resetGame() {
  score1 = 0;
  score2 = 0;
  serveCount = 1; // Start serve count with 1
  isDeuce = false; // Reset deuce state
  deuceMessage.textContent = ""; // Clear deuce message
  deuceMessage.classList.remove('active'); // Hide deuce message
  serveTurn = 1; // Reset to Player 1 as initial server
  updateScores();
  updateServeIndicator();

  // Remove winner styles
  document.getElementById('score1').classList.remove('winner');
  document.getElementById('score2').classList.remove('winner');

  // Re-enable game
  gameActive = true; // Reset game active state
  enableGame();
}

function enableGame() {
  document.querySelectorAll('.player-score').forEach(score => {
    score.style.cursor = 'pointer'; // Allow score to be clickable
  });
}

function disableGame() {
  document.querySelectorAll('.player-score').forEach(score => {
    score.style.cursor = 'default'; // Prevent selection of the score
  });
}

const translations = {
  en: {
    title: "Mobi's Ping Pong Scorer",
    player1: "Player 1",
    player2: "Player 2",
    resetGame: "Reset Game",
    winningPoints: "Winning Points",
    deuce: "Deuce"
  },
  zh: {
    title: "Mobi 的乒乓球计分器",
    player1: "球员 1",
    player2: "球员 2",
    resetGame: "重置游戏",
    winningPoints: "获胜分数",
    deuce: "平分"
  }
};

function toggleLanguage() {
  currentLanguage = currentLanguage === 'en' ? 'zh' : 'en';
  document.querySelector('h1').textContent = translations[currentLanguage].title;
  document.querySelector('#player1 .player-title').textContent = translations[currentLanguage].player1;
  document.querySelector('#player2 .player-title').textContent = translations[currentLanguage].player2;
  document.querySelector('.buttons button').textContent = translations[currentLanguage].resetGame;
  document.querySelector('.winning-points label').textContent = translations[currentLanguage].winningPoints;
  document.querySelector('.language-switcher button').textContent = currentLanguage === 'en' ? '中文' : 'English';
  updateDeuceMessage();
}

function updateDeuceMessage() {
  if (isDeuce) {
    deuceMessage.textContent = translations[currentLanguage].deuce;
    deuceMessage.classList.add('active'); // Show deuce message
  } else {
    deuceMessage.classList.remove('active'); // Hide deuce message
  }
}

function toggleDarkMode() {
  document.body.classList.toggle('dark-mode');
  document.body.classList.toggle('light-mode');
  document.getElementById('darkModeToggle').checked = document.body.classList.contains('dark-mode');
}

// Initialize the language to English
window.onload = function() {
  serveTurn = 1; // Default to Player 1
  serveCount = 1; // Start serve count with 1
  updateServeIndicator();
  toggleLanguage(); // Set default language to English
  document.getElementById('darkModeToggle').checked = document.body.classList.contains('dark-mode');
};