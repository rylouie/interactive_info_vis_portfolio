// Instance-mode sketch for tab 2
let studying = true;

let studyTime = 0;
let breakTime = 0;

let lastMillis = 0;

function setup() {
  createCanvas(700, 400);
  textAlign(CENTER, CENTER);
  lastMillis = millis();
}

function draw() {
  background(240);

  let now = millis();
  let delta = now - lastMillis;
  lastMillis = now;

  // Accumulate time
  if (studying) {
    studyTime += delta;
  } else {
    breakTime += delta;
  }

  // Left side: Study
  fill(studying ? '#b6e3c6' : 220);
  rect(0, 0, width / 2, height);

  // Right side: Break
  fill(!studying ? '#f7b7b2' : 220);
  rect(width / 2, 0, width / 2, height);

  fill(0);
  textSize(20);
  text("STUDY", width / 4, 40);
  text("BREAK / PHONE", (3 * width) / 4, 40);

  textSize(18);
  text(formatTime(studyTime), width / 4, height / 2);
  text(formatTime(breakTime), (3 * width) / 4, height / 2);

  // Switch indicator
  textSize(14);
  text("Click to flip switch", width / 2, height - 30);
}

function mousePressed() {
  studying = !studying;
}

// Helper: format ms → mm:ss
function formatTime(ms) {
  let totalSeconds = floor(ms / 1000);
  let minutes = floor(totalSeconds / 60);
  let seconds = totalSeconds % 60;
  return nf(minutes, 2) + ":" + nf(seconds, 2);
}

