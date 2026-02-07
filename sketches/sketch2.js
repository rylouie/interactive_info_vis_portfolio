registerSketch('sk2', function (p) {

  let studyTime = 0;
  let breakTime = 0;
  let lastSwitchTime = null;
  let mode = "study"; // "study" or "break"
  let sessionEnded = false;

  p.setup = function () {
    let c = p.createCanvas(700, 400);
    c.parent('sketch-container-sk2');
    p.textAlign(p.CENTER, p.CENTER);
  };

  p.draw = function () {
    p.background(245);

    if (!sessionEnded && lastSwitchTime !== null) {
      let elapsed = p.millis() - lastSwitchTime;

      if (mode === "study") {
        studyTime += elapsed;
      } else {
        breakTime += elapsed;
      }

      lastSwitchTime = p.millis();
    }

    // ---- STUDY SIDE ----
    p.fill(mode === "study" ? '#81ecec' : '#dfe6e9');
    p.rect(0, 0, p.width / 2, p.height);

    p.fill(0);
    p.textSize(20);
    p.text("STUDYING", p.width / 4, 40);
    p.textSize(32);
    p.text(formatTime(studyTime), p.width / 4, p.height / 2);

    // ---- BREAK SIDE ----
    p.fill(mode === "break" ? '#fab1a0' : '#dfe6e9');
    p.rect(p.width / 2, 0, p.width / 2, p.height);

    p.fill(0);
    p.textSize(20);
    p.text("BREAK / PHONE", p.width * 0.75, 40);
    p.textSize(32);
    p.text(formatTime(breakTime), p.width * 0.75, p.height / 2);

    // ---- Instructions ----
    p.textSize(14);
    p.text(
      sessionEnded
        ? "Session ended — click to reset"
        : "Click to flip the switch | Press E to end session",
      p.width / 2,
      p.height - 30
    );
  };

  // Flip the switch
  p.mousePressed = function () {
    if (sessionEnded) {
      resetSession();
      return;
    }

    mode = mode === "study" ? "break" : "study";
    lastSwitchTime = p.millis();
  };

  // End session
  p.keyPressed = function () {
    if (p.key === 'E' || p.key === 'e') {
      sessionEnded = true;
    }
  };

  function resetSession() {
    studyTime = 0;
    breakTime = 0;
    mode = "study";
    sessionEnded = false;
    lastSwitchTime = null;
  }

  function formatTime(ms) {
    let total = Math.floor(ms / 1000);
    let m = Math.floor(total / 60);
    let s = total % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  }
});
