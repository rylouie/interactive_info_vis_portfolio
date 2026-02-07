let dailyGoal = 2.0; // liters
let wakeHour = 8;
let sleepHour = 22;

function setup() {
  createCanvas(600, 600);
  angleMode(DEGREES);
}

function draw() {
  background(245);

  translate(width / 2, height / 2);

  let hr = hour();
  let min = minute();
  let sec = second();

  // ----- Hydration progress -----
  let dayProgress = constrain(
    map(hr + min / 60, wakeHour, sleepHour, 0, 1),
    0,
    1
  );

  let waterSoFar = dailyGoal * dayProgress;

  // Blue hydration arc
  noFill();
  stroke(70, 130, 255);
  strokeWeight(16);
  arc(0, 0, 420, 420, -90, -90 + dayProgress * 360);

  // ----- Clock face -----
  stroke(0);
  strokeWeight(4);
  noFill();
  circle(0, 0, 400);

  // Hour markers
  strokeWeight(2);
  for (let a = 0; a < 360; a += 30) {
    let x1 = cos(a) * 180;
    let y1 = sin(a) * 180;
    let x2 = cos(a) * 195;
    let y2 = sin(a) * 195;
    line(x1, y1, x2, y2);
  }

  // ----- Hands -----
  // Hour hand
  push();
  rotate(map(hr % 12 + min / 60, 0, 12, 0, 360));
  strokeWeight(6);
  line(0, 0, 0, -100);
  pop();

  // Minute hand
  push();
  rotate(map(min + sec / 60, 0, 60, 0, 360));
  strokeWeight(4);
  line(0, 0, 0, -150);
  pop();

  // Second hand
  push();
  rotate(map(sec, 0, 60, 0, 360));
  stroke(200, 0, 0);
  strokeWeight(2);
  line(0, 0, 0, -170);
  pop();

  // Center dot
  fill(0);
  noStroke();
  circle(0, 0, 8);

  // ----- Text -----
  resetMatrix();
  fill(0);
  textAlign(CENTER);
  textSize(16);
  text(
    `${waterSoFar.toFixed(2)} L / ${dailyGoal.toFixed(1)} L`,
    width / 2,
    height - 30
  );
}
