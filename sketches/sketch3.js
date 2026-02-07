registerSketch('sk4', function (p) {

  const dailyLiters = 2.5; // recommended daily intake

  p.setup = function () {
    let c = p.createCanvas(500, 500);
    c.parent('sketch-container-sk4');
    p.angleMode(p.DEGREES);
    p.textAlign(p.CENTER, p.CENTER);
  };

  p.draw = function () {
    p.background(250);
    p.translate(p.width / 2, p.height / 2);

    let h = p.hour();
    let m = p.minute();
    let s = p.second();

    // ---- Water calculation (24-hour day) ----
    let minutesToday = h * 60 + m;
    let water = p.map(minutesToday, 0, 1440, 0, dailyLiters);

    // ---- Water Ring ----
    p.noFill();
    p.stroke(80, 150, 255);
    p.strokeWeight(14);
    p.arc(
      0,
      0,
      360,
      360,
      -90,
      p.map(water, 0, dailyLiters, -90, 270)
    );

    // ---- Clock Face ----
    p.stroke(0);
    p.strokeWeight(4);
    p.noFill();
    p.ellipse(0, 0, 300);

    // ---- Hands ----
    drawHand(p.map((h % 12) + m / 60, 0, 12, 0, 360), 80, 6); // hour
    drawHand(p.map(m, 0, 60, 0, 360), 120, 4);               // minute
    drawHand(p.map(s, 0, 60, 0, 360), 140, 2, p.color(200, 0, 0)); // second

    // ---- Text ----
    p.noStroke();
    p.fill(0);
    p.textSize(16);
    p.text(
      `You should have had`,
      0,
      160
    );

    p.textSize(22);
    p.fill(80, 150, 255);
    p.text(
      `${water.toFixed(2)} L`,
      0,
      185
    );

    p.fill(0);
    p.textSize(14);
    p.text(
      `of ${dailyLiters} L today`,
      0,
      210
    );
  };

  function drawHand(angle, len, w, col = 0) {
    p.push();
    p.rotate(angle - 90);
    p.stroke(col);
    p.strokeWeight(w);
    p.line(0, 0, len, 0);
    p.pop();
  }
});
