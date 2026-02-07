registerSketch('sk4', function (p) {

  const dailyLiters = 2.5;

  p.setup = function () {
    let c = p.createCanvas(500, 500);
    c.parent('sketch-container-sk4');
    p.angleMode(p.DEGREES);
    p.textAlign(p.CENTER, p.CENTER);
  };

  p.draw = function () {
    p.background(250);
    p.translate(p.width / 2, p.height / 2);

    let h = p.hour() % 12;
    let m = p.minute();
    let s = p.second();

    let totalMinutes = h * 60 + m;
    let water = p.map(totalMinutes, 0, 720, 0, dailyLiters);

    // Water ring
    p.noFill();
    p.stroke(100, 150, 255);
    p.strokeWeight(12);
    p.arc(0, 0, 360, 360, -90, p.map(water, 0, dailyLiters, -90, 270));

    // Clock face
    p.stroke(0);
    p.strokeWeight(4);
    p.ellipse(0, 0, 300);

    // Hands
    drawHand(p.map(h + m / 60, 0, 12, 0, 360), 70, 6);
    drawHand(p.map(m, 0, 60, 0, 360), 110, 4);
    drawHand(p.map(s, 0, 60, 0, 360), 130, 2, 'red');

    p.noStroke();
    p.fill(0);
    p.textSize(16);
    p.text(`${water.toFixed(2)} L`, 0, 180);
  };

  function drawHand(angle, len, w, col = 'black') {
    p.push();
    p.rotate(angle - 90);
    p.stroke(col);
    p.strokeWeight(w);
    p.line(0, 0, len, 0);
    p.pop();
  }
});
