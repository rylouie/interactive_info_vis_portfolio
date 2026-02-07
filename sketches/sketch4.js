registerSketch('sk3', function (p) {

  let bestTime = 15 * 1000;
  let startTime = null;
  let running = false;
  let currentTime = 0;
  let showResult = false;

  p.setup = function () {
    let c = p.createCanvas(700, 300);
    c.parent('sketch-container-sk3');
    p.textAlign(p.CENTER, p.CENTER);
  };

  p.draw = function () {
    p.background(240);

    if (running) {
      currentTime = p.millis() - startTime;
    }

    let remaining = bestTime - currentTime;

    let progress = p.constrain(remaining / bestTime, 0, 1);
    p.fill(100, 160, 255);
    p.rect(100, 180, progress * 500, 20);

    p.noFill();
    p.stroke(0);
    p.rect(100, 180, 500, 20);

    p.noStroke();
    p.fill(0);
    p.textSize(22);
    p.text("GHOST TIME TO BEAT", p.width / 2, 40);

    p.textSize(36);

    if (!running && !showResult) {
      p.text("Click to start", p.width / 2, p.height / 2);
    } 
    else if (running && remaining > 0) {
      p.text(formatTime(remaining), p.width / 2, p.height / 2);
    } 
    else if (showResult) {
      if (currentTime < bestTime) {
        p.text("NEW RECORD!", p.width / 2, p.height / 2);
      } else {
        let off = (currentTime - bestTime) / 1000;
        p.text(`+${off.toFixed(2)}s`, p.width / 2, p.height / 2);
      }
    }

    p.textSize(14);
    p.text("Click again to retry", p.width / 2, p.height - 30);
  };

  p.mousePressed = function () {
    if (!running && !showResult) {
      startTime = p.millis();
      running = true;
    } 
    else if (running) {
      running = false;
      showResult = true;
      if (currentTime < bestTime) bestTime = currentTime;
    } 
    else {
      showResult = false;
      currentTime = 0;
    }
  };

  function formatTime(ms) {
    return (ms / 1000).toFixed(2) + "s";
  }
});
