let seconds = 0;
let timerInterval;

function updateDisplay() {
  const min = String(Math.floor(seconds / 60)).padStart(2, '0');
  const sec = String(seconds % 60).padStart(2, '0');
  document.getElementById('timer').textContent = `${min}:${sec}`;
}

function startTimer() {
  if (timerInterval) return; // prevent multiple intervals
  timerInterval = setInterval(() => {
    seconds++;
    updateDisplay();
  }, 1000);
}

function pauseTimer() {
  clearInterval(timerInterval);
  timerInterval = null;
}

function resetTimer() {
  pauseTimer();
  seconds = 0;
  updateDisplay();
}
