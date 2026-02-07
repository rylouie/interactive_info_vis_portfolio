registerSketch('sk2', function (p) {

  let workTime = 25 * 60 * 1000;
  let breakTime = 5 * 60 * 1000;
  let startTime;
  let isWork = true;
  let running = false;

  p.setup = function () {
    let c = p.createCanvas(600, 400);
    c.parent('sketch-container-sk2');
    p.textAlign(p.CENTER, p.CENTER);
  };

  p.draw = function () {
    p.background(245);

    if (running) {
      let elapsed = p.millis() - startTime;
      let duration = isWork ? workTime : breakTime;
      let remaining = duration - elapsed;

      let progress = p.constrain(remaining / duration, 0, 1);
      p.fill(isWork ? '#ff7675' : '#74b9ff');
      p.rect(100, 220, progress * 400, 30);

      p.noFill();
      p.stroke(0);
      p.rect(100, 220, 400, 30);

      p.noStroke();
      p.fill(0);
      p.textSize(32);
      p.text(formatTime(remaining), p.width / 2, 160);

      if (remaining <= 0) {
        running = false;
      }
    }

    p.textSize(20);
    p.text(isWork ? "WORK SESSION" : "BREAK SESSION", p.width / 2, 80);

    p.textSize(14);
    p.text("Click to start / switch", p.width / 2, 350);
  };

  p.mousePressed = function () {
    if (!running) {
      isWork = !isWork;
      startTime = p.millis();
      running = true;
    }
  };

  function formatTime(ms) {
    let total = Math.max(0, Math.floor(ms / 1000));
    let m = Math.floor(total / 60);
    let s = total % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  }
});
