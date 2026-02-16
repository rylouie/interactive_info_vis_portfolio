// HWK5: Quarterback Rating Visualization
registerSketch('sk5', function (p) {
  let games = null;
  let sortedRows = [];
  let csvLoaded = false;
  let csvFailed = false;

  // ------------------------
  // LOAD CSV
  // ------------------------
  p.preload = function() {
    games = p.loadTable(
      "SamDarnold2025SeasonData.csv", 
      "csv", 
      "header",
      () => { csvLoaded = true; console.log("✅ CSV loaded successfully."); },
      () => { csvFailed = true; console.error("❌ CSV failed to load."); }
    );
  };

  // ------------------------
  // SETUP
  // ------------------------
  p.setup = function() {
    const container = document.getElementById("sketch-container-sk5");
    p.createCanvas(1080, 1350).parent(container);
    p.textFont("Helvetica");
    if (csvLoaded) prepareData();
  };

  // ------------------------
  // DRAW
  // ------------------------
  p.draw = function() {
    p.background(255);

    if (csvFailed) {
      p.fill(200, 0, 0);
      p.textSize(32);
      p.textAlign(p.CENTER, p.CENTER);
      p.text("Error: CSV file failed to load.", p.width / 2, p.height / 2);
      return;
    }

    if (!csvLoaded) {
      p.fill(50);
      p.textSize(28);
      p.textAlign(p.CENTER, p.CENTER);
      p.text("Loading data...", p.width / 2, p.height / 2);
      return;
    }

    if (sortedRows.length === 0) prepareData();

    drawTitle();
    drawChart();
    drawLegend();
  };

  // ------------------------
  // DATA PREPARATION
  // ------------------------
  function prepareData() {
    if (!games) return;

    let rows = games.getRows();

    sortedRows = rows.map((r, i) => {
      const dateValue = r.get("Date");
      const rateValue = r.get("Rate");
      const resultValue = r.get("Result") || r.get("W/L");
      const opponentValue = r.get("Opp") || r.get("Opponent");

      const rateNum = Number(rateValue);
      if (isNaN(rateNum)) return null;

      let dateObj = dateValue ? new Date(dateValue) : new Date();
      if (!dateObj || isNaN(dateObj)) dateObj = new Date();

      return {
        week: i + 1,
        date: dateObj,
        rate: rateNum,
        result: resultValue || "N/A",
        opponent: opponentValue || "Unknown"
      };
    }).filter(d => d !== null);

    sortedRows.sort((a, b) => a.date - b.date);
    console.log(`✅ Prepared data rows: ${sortedRows.length}`);
  }

  // ------------------------
  // TITLE
  // ------------------------
  function drawTitle() {
    p.fill(0);
    p.textAlign(p.CENTER);
    p.textSize(52);
    p.text("From Volatile to Commanding", p.width / 2, 80);

    p.textSize(28);
    p.fill(120);
    p.text("Sam Darnold’s 2025 Season", p.width / 2, 130);
  }

  // ------------------------
  // CHART
  // ------------------------
  function drawChart() {
    const marginLeft = 150;
    const marginRight = 150;
    const marginTop = 200;
    const chartHeight = 650;

    if (!sortedRows.length) return;

    const rates = sortedRows.map(d => d.rate);
    const minRate = Math.min(...rates, 40);
    const maxRate = Math.max(...rates, 160);

    const minDate = sortedRows[0].date;
    const maxDate = sortedRows[sortedRows.length - 1].date;

    // X-axis
    p.stroke(220);
    p.line(marginLeft, marginTop + chartHeight, p.width - marginRight, marginTop + chartHeight);

    // Line
    p.strokeWeight(3);
    p.stroke(60, 120, 200);
    p.noFill();
    p.beginShape();
    sortedRows.forEach(d => {
      const x = p.map(d.date.getTime(), minDate.getTime(), maxDate.getTime(), marginLeft, p.width - marginRight);
      const y = p.map(d.rate, minRate, maxRate, marginTop + chartHeight, marginTop);
      p.vertex(x, y);
    });
    p.endShape();

    // Points
    sortedRows.forEach(d => {
      const x = p.map(d.date.getTime(), minDate.getTime(), maxDate.getTime(), marginLeft, p.width - marginRight);
      const y = p.map(d.rate, minRate, maxRate, marginTop + chartHeight, marginTop);

      p.fill(d.result.toLowerCase().includes("w") ? p.color(30, 100, 220) : p.color(220, 60, 60));
      p.noStroke();
      p.ellipse(x, y, 18, 18);
    });

    // Tooltip on top
    sortedRows.forEach(d => {
      const x = p.map(d.date.getTime(), minDate.getTime(), maxDate.getTime(), marginLeft, p.width - marginRight);
      const y = p.map(d.rate, minRate, maxRate, marginTop + chartHeight, marginTop);

      if (p.dist(p.mouseX, p.mouseY, x, y) < 12) {
        drawTooltip(x, y, d);
      }
    });

    // X-axis labels
    p.textAlign(p.CENTER);
    p.textSize(14);
    p.fill(0);
    const startLabel = minDate.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    const endLabel = maxDate.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    p.text(startLabel, marginLeft, marginTop + chartHeight + 20);
    p.text(endLabel, p.width - marginRight, marginTop + chartHeight + 20);

    // Y-axis label
    p.push();
    p.translate(marginLeft - 70, marginTop + chartHeight / 2);
    p.rotate(-p.PI / 2);
    p.textSize(18);
    p.fill(0);
    p.text("Quarterback Rating", 0, 0);
    p.pop();

    // Horizontal grid lines
    p.stroke(220);
    p.textAlign(p.RIGHT, p.CENTER);
    p.textSize(14);
    for (let yVal = Math.ceil(minRate / 20) * 20; yVal <= maxRate; yVal += 20) {
      const y = p.map(yVal, minRate, maxRate, marginTop + chartHeight, marginTop);
      p.line(marginLeft - 5, y, p.width - marginRight, y);
      p.noStroke();
      p.fill(100);
      p.text(yVal, marginLeft - 10, y);
      p.stroke(220);
    }
  }

  // ------------------------
  // LEGEND
  // ------------------------
  function drawLegend() {
    const legendX = p.width - 250;
    const legendY = 300;

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

  // ------------------------
  // TOOLTIP
  // ------------------------
  function drawTooltip(x, y, d) {
    const textContent =
      "Date: " + d.date.toLocaleDateString() +
      "\nOpponent: " + d.opponent +
      "\nRating: " + d.rate +
      "\nResult: " + d.result;

    const boxWidth = 260;
    const boxHeight = 110;

    let boxX = x + 15;
    if (boxX + boxWidth > p.width) boxX = x - boxWidth - 15;
    let boxY = y - 100;
    if (boxY < 0) boxY = y + 20;

    p.push();
    p.fill(255, 245); // semi-transparent white
    p.stroke(0);
    p.strokeWeight(1.5);
    p.rect(boxX, boxY, boxWidth, boxHeight, 8);

    p.noStroke();
    p.fill(0);
    p.textAlign(p.LEFT, p.TOP);
    p.textSize(18);
    p.text(textContent, boxX + 10, boxY + 10);
    p.pop();
  }
});
