registerSketch('sk3', function (p) {

  let bestTime = 15 * 1000; // personal record in ms
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

    // ---- Progress Bar ----
    let progress = p.constrain(remaining / bestTime, 0, 1);
    p.fill(100, 160, 255);
    p.rect(100, 180, progress * 500, 20);

    p.noFill();
    p.stroke(0);
    p.rect(100, 180, 500, 20);

    // ---- Title ----
    p.noStroke();
    p.fill(0);
    p.textSize(20);
    p.text(
      `Beat your personal record: ${formatTime(bestTime)}`,
      p.width / 2,
      40
    );

    // ---- Main Text ----
    p.textSize(36);

    // Idle
    if (!running && !showResult) {
      p.text(formatTime(bestTime), p.width / 2, p.height / 2);
    }
    // Running
    else if (running && remaining > 0) {
      p.text(formatTime(remaining), p.width / 2, p.height / 2);
    }
    // Results
    else if (showResult) {
      if (currentTime < bestTime) {
        p.text("NEW PERSONAL RECORD!", p.width / 2, p.height / 2);
      } else {
        let offBy = (currentTime - bestTime) / 1000;
        p.text(
          `${offBy.toFixed(2)}s off your record`,
          p.width / 2,
          p.height / 2
        );
      }
    }

    p.textSize(14);
    p.text("Click to start / retry", p.width / 2, p.height - 30);
  };

  p.mousePressed = function () {
    // Start run
    if (!running && !showResult) {
      startTime = p.millis();
      currentTime = 0;
      running = true;
    }
    // Finish run
    else if (running) {
      running = false;
      showResult = true;
      if (currentTime < bestTime) {
        bestTime = currentTime;
      }
    }
    // Reset
    else {
      showResult = false;
      currentTime = 0;
    }
  };

  function formatTime(ms) {
    return (ms / 1000).toFixed(2) + "s";
  }
});
