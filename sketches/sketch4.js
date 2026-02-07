let bestTime = 15 * 1000; // 15 seconds to beat (initial ghost)
let startTime = null;
let currentTime = 0;

let state = "idle"; // "idle" | "running" | "result"
let finalDelta = 0;
let newRecord = false;

function setup() {
  createCanvas(700, 300);
  textAlign(CENTER, CENTER);
}

function draw() {
  background(240);

  if (state === "running") {
    currentTime = millis() - startTime;
  }

  let timeRemaining = bestTime - currentTime;

  // ----- Progress Bar -----
  let progress = constrain(timeRemaining / bestTime, 0, 1);
  fill(100, 160, 255);
  rect(100, 180, progress * 500, 20);

  // Ghost outline
  noFill();
  stroke(0);
  rect(100, 180, 500, 20);

  // ----- Text -----
  fill(0);
  textSize(20);
  text("GHOST TIME TO BEAT", width / 2, 40);

  textSize(36);

  if (state === "idle") {
    text("Click to start", width / 2, height / 2);
  } 
  else if (state === "running") {
    if (timeRemaining > 0) {
      text(formatTime(timeRemaining), width / 2, height / 2);
    } else {
      text(`+${(-timeRemaining / 1000).toFixed(2)}s`, width / 2, height / 2);
    }
  } 
  else if (state === "result") {
    if (newRecord) {
      text("NEW RECORD!", width / 2, height / 2);
      textSize(18);
      text(
        `New ghost: ${(bestTime / 1000).toFixed(2)}s`,
        width / 2,
        height / 2 + 40
      );
    } else {
      textSize(32);
      text(`+${(finalDelta / 1000).toFixed(2)}s`, width / 2, height / 2);
      textSize(18);
      text("Click to try again", width / 2, height / 2 + 40);
    }
  }

  // Footer
  textSize(14);
  text("Beat the ghost to lower the time", width / 2, height - 30);
}

function mousePressed() {
  if (state === "idle") {
    // Start run
    startTime = millis();
    currentTime = 0;
    state = "running";
  } 
  else if (state === "running") {
    // End run
    finalDelta = currentTime - bestTime;
    newRecord = currentTime < bestTime;

    if (newRecord) {
      bestTime = currentTime;
    }

    state = "result";
  } 
  else if (state === "result") {
    // Reset to idle
    state = "idle";
    startTime = null;
    currentTime = 0;
  }
}

// Format ms → ss.ms
function formatTime(ms) {
  return (ms / 1000).toFixed(2) + "s";
}
