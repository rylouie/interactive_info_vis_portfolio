registerSketch('sk5', function (p) {
  let games;
  let sortedRows = [];

  p.preload = function() {
    games = p.loadTable("SamDarnold2025SeasonData.csv", "csv", "header");
  }

  p.setup = function() {
    p.createCanvas(1080, 1350).parent("sketch-container-hwk5");
    p.textFont("Helvetica");
    prepareData();
  }

  p.draw = function() {
    p.background(255);
    drawTitle();
    drawChart();
    drawLegend();
  }

  function prepareData() {
    let rows = games.getRows();

    sortedRows = rows.map((r, i) => {
      let dateValue = r.get("Date");
      let rateValue = r.get("Rate");
      let resultValue = r.get("Result") || r.get("W/L");
      let opponentValue = r.get("Opp") || r.get("Opponent");

      let rateNum = Number(rateValue);
      if (isNaN(rateNum)) return null;

      let dateObj = dateValue ? new Date(dateValue) : new Date();
      if (!dateObj || isNaN(dateObj)) dateObj = new Date();

      return {
        week: i + 1,
        date: dateObj,
        rate: rateNum,
        result: resultValue ? resultValue : "N/A",
        opponent: opponentValue ? opponentValue : "Unknown"
      };
    }).filter(d => d !== null);

    sortedRows.sort((a, b) => a.date - b.date);
  }

  function drawTitle() {
    p.fill(0);
    p.textAlign(p.CENTER);
    p.textSize(52);
    p.text("From Volatile to Commanding", p.width / 2, 80);

    p.textSize(28);
    p.fill(120);
    p.text("Sam Darnold’s 2025 Season", p.width / 2, 130);
  }

  function drawChart() {
    let marginLeft = 150;
    let marginRight = 150;
    let marginTop = 200;
    let chartHeight = 650;

    if (sortedRows.length === 0) {
      p.fill(200);
      p.textAlign(p.CENTER, p.CENTER);
      p.textSize(24);
      p.text("No valid data to display", p.width / 2, p.height / 2);
      return;
    }

    let rates = sortedRows.map(d => d.rate);
    let minRate = Math.min(...rates, 40);
    let maxRate = Math.max(...rates, 160);

    let minDate = sortedRows[0].date;
    let maxDate = sortedRows[sortedRows.length - 1].date;

    p.stroke(220);
    p.line(marginLeft, marginTop + chartHeight, p.width - marginRight, marginTop + chartHeight);

    p.strokeWeight(3);
    p.stroke(60, 120, 200);
    p.noFill();
    p.beginShape();
    for (let i = 0; i < sortedRows.length; i++) {
      let x = p.map(sortedRows[i].date, minDate, maxDate, marginLeft, p.width - marginRight);
      let y = p.map(sortedRows[i].rate, minRate, maxRate, marginTop + chartHeight, marginTop);
      p.vertex(x, y);
    }
    p.endShape();

    for (let i = 0; i < sortedRows.length; i++) {
      let d = sortedRows[i];
      let x = p.map(d.date, minDate, maxDate, marginLeft, p.width - marginRight);
      let y = p.map(d.rate, minRate, maxRate, marginTop + chartHeight, marginTop);

      p.fill(d.result.toLowerCase().includes("w") ? p.color(30, 100, 220) : p.color(220, 60, 60));
      p.noStroke();
      p.ellipse(x, y, 18, 18);

      if (p.dist(p.mouseX, p.mouseY, x, y) < 12) {
        drawTooltip(x, y, d);
      }
    }

    p.textAlign(p.CENTER);
    p.textSize(14);
    p.fill(0);
    let startLabel = minDate.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    let endLabel = maxDate.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    p.text(startLabel, marginLeft, marginTop + chartHeight + 20);
    p.text(endLabel, p.width - marginRight, marginTop + chartHeight + 20);

    p.textAlign(p.CENTER, p.CENTER);
    p.push();
    p.translate(marginLeft - 70, marginTop + chartHeight / 2);
    p.rotate(-p.PI / 2);
    p.textSize(18);
    p.fill(0);
    p.text("Quarterback Rating", 0, 0);
    p.pop();

    p.stroke(220);
    p.textAlign(p.RIGHT, p.CENTER);
    p.textSize(14);
    for (let yVal = Math.ceil(minRate / 20) * 20; yVal <= maxRate; yVal += 20) {
      let y = p.map(yVal, minRate, maxRate, marginTop + chartHeight, marginTop);
      p.line(marginLeft - 5, y, p.width - marginRight, y);
      p.noStroke();
      p.fill(100);
      p.text(yVal, marginLeft - 10, y);
      p.stroke(220);
    }
  }

  function drawLegend() {
    let legendX = p.width - 250;
    let legendY = 300;

    p.textAlign(p.LEFT);
    p.textSize(22);
    p.fill(0);
    p.text("Game Result", legendX, legendY - 40);

    p.fill(30, 100, 220);
    p.ellipse(legendX, legendY, 18, 18);
    p.fill(0);
    p.text("Win", legendX + 30, legendY + 5);

    p.fill(220, 60, 60);
    p.ellipse(legendX, legendY + 50, 18, 18);
    p.fill(0);
    p.text("Loss", legendX + 30, legendY + 55);
  }

  function drawTooltip(x, y, d) {
    let textContent =
      "Date: " + d.date.toLocaleDateString() +
      "\nOpponent: " + d.opponent +
      "\nRating: " + d.rate +
      "\nResult: " + d.result;

    let boxWidth = 260;
    let boxHeight = 110;

    let boxX = x + 15;
    if (boxX + boxWidth > p.width) boxX = x - boxWidth - 15;
    let boxY = y - 100;
    if (boxY < 0) boxY = y + 20;

    p.fill(255);
    p.stroke(0);
    p.rect(boxX, boxY, boxWidth, boxHeight, 8);

    p.noStroke();
    p.fill(0);
    p.textAlign(p.LEFT, p.TOP);
    p.textSize(18);
    p.text(textContent, boxX + 10, boxY + 10);
  }
});
