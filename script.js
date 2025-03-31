const grid = document.getElementById("grid");
const result = document.getElementById("result");
const startBtn = document.getElementById("startBtn");
const retryBtn = document.getElementById("retryBtn");
const nextStepBtn = document.getElementById("nextStepBtn");
const progressBar = document.getElementById("progress-bar");
const progressContainer = document.getElementById("progress-container");
const timeText = document.getElementById("time-text");

const phrases = [
  ["사과", "사곽"],
  ["하늘", "하닐"],
  ["바다", "바자"],
  ["학교", "핟교"],
  ["고양이", "고앙이"],
  ["컴퓨터", "검퓨터"],
  ["운동장", "운동쟝"]
];

let step = 0;
let timer;
let timeInterval;
let isPlaying = false;
let timeLeft = 5.0;
const totalTime = 5.0;

startBtn.onclick = () => {
  step = 0;
  startBtn.disabled = true;
  retryBtn.style.display = "none";
  nextStepBtn.style.display = "none";
  result.textContent = "";
  startStep();
};

retryBtn.onclick = () => {
  resetToMain();
};

nextStepBtn.onclick = () => {
  nextStepBtn.style.display = "none";
  result.textContent = "";
  timeText.textContent = "";
  step++;
  startStep();
};

function startStep() {
  if (step >= phrases.length) {
    result.textContent = "모든 문제를 풀었습니다.";
    startBtn.disabled = false;
    return;
  }

  isPlaying = true;
  timeLeft = totalTime;
  const size = 4 + step;
  const totalCells = size * size;
  const [correct, wrong] = phrases[step];
  const wrongIndex = Math.floor(Math.random() * totalCells);

  grid.innerHTML = "";
  grid.style.gridTemplateColumns = `repeat(${size}, 60px)`;
  result.textContent = "";
  progressContainer.style.display = "block";
  progressBar.style.transition = "none";
  progressBar.style.transform = "scaleX(1)";
  progressBar.style.backgroundColor = "#4caf50";
  timeText.textContent = `남은 시간: ${timeLeft.toFixed(1)}초`;

  setTimeout(() => {
    progressBar.style.transition = `transform ${totalTime}s linear, background-color ${totalTime}s linear`;
    progressBar.style.transform = "scaleX(0)";
    progressBar.style.backgroundColor = "#FF0000";
  }, 50);

  clearInterval(timeInterval);
  timeInterval = setInterval(() => {
    timeLeft -= 0.1;
    if (timeLeft <= 0) {
      timeLeft = 0;
      clearInterval(timeInterval);
      timeText.textContent = "남은 시간: 0.0초";
    } else {
      timeText.textContent = `남은 시간: ${timeLeft.toFixed(1)}초`;
    }
  }, 100);

  clearTimeout(timer);
  timer = setTimeout(() => {
    isPlaying = false;
    clearInterval(timeInterval);
    handleFailure("시간 초과!");
  }, totalTime * 1000);

  for (let i = 0; i < totalCells; i++) {
    const cell = document.createElement("div");
    cell.className = "cell";
    cell.textContent = i === wrongIndex ? wrong : correct;
    cell.onclick = () => {
      if (!isPlaying) return;
      if (i === wrongIndex) {
        handleSuccess();
      } else {
        handleFailure("다시 시도해보세요.");
      }
    };
    grid.appendChild(cell);
  }
}

function handleSuccess() {
  isPlaying = false;
  clearTimeout(timer);
  clearInterval(timeInterval);


  const progress = timeLeft / totalTime;
  progressBar.style.transition = "none";
  progressBar.style.transform = `scaleX(${progress})`;

  const r = Math.floor(76 + (231 - 76) * (1 - progress));
  const g = Math.floor(175 - (175 - 76) * (1 - progress));
  const b = Math.floor(80 - (80 - 60) * (1 - progress));
  progressBar.style.backgroundColor = `rgb(${r}, ${g}, ${b})`;

  result.textContent = "정답입니다.";
  showParticles();
  nextStepBtn.style.display = "inline-block";
}

function handleFailure(message) {
  isPlaying = false;
  clearTimeout(timer);
  clearInterval(timeInterval);
  result.textContent = message;
  startBtn.disabled = false;
  retryBtn.style.display = "inline-block";
  progressContainer.style.display = "none";
  timeText.textContent = "";
}

function resetToMain() {
  grid.innerHTML = "";
  result.textContent = "";
  retryBtn.style.display = "none";
  nextStepBtn.style.display = "none";
  startBtn.disabled = false;
  timeText.textContent = "";
  progressContainer.style.display = "none";
}

function showParticles() {
  confetti({
    particleCount: 200,
    startVelocity: 45,
    spread: 90,
    angle: 90,
    origin: { x: 0.5, y: 0.7 }
  });
}
