/*
  script.js
  - Simple JS for row highlights, "fake" download, and Plotly charts.
*/

document.addEventListener("DOMContentLoaded", () => {
  // Highlight table rows on hover
  const table = document.getElementById("user-margin-table");
  if (table) {
    table.addEventListener("mouseover", (e) => {
      const row = e.target.closest("tr");
      if (row && row.parentNode.tagName === "TBODY") {
        row.style.backgroundColor = "#ffffe0";
      }
    });
    table.addEventListener("mouseout", (e) => {
      const row = e.target.closest("tr");
      if (row && row.parentNode.tagName === "TBODY") {
        row.style.backgroundColor = "";
      }
    });
  }

  // Fake 'download as XLSX' button
  const downloadBtn = document.getElementById("download-tab2");
  if (downloadBtn) {
    downloadBtn.addEventListener("click", () => {
      alert("This is a static demo — no real download occurs.");
    });
  }

  // -------------------------------------------------------------------
  // 1) Plotly Chart: "Acceptance vs Rejection (Cut-off Visualization)"
  // -------------------------------------------------------------------
  const probsData = [
    { loan_id: 1, p_default: 0.04, accepted: true },
    { loan_id: 2, p_default: 0.25, accepted: false },
    { loan_id: 3, p_default: 0.15, accepted: true },
    { loan_id: 4, p_default: 0.18, accepted: true },
    { loan_id: 5, p_default: 0.05, accepted: true },
  ];

  // Split data for accepted vs. rejected
  const acceptedX = probsData.filter(d => d.accepted).map(d => d.p_default);
  const acceptedY = acceptedX.map(() => 1);  // just a dummy same Y
  const rejectedX = probsData.filter(d => !d.accepted).map(d => d.p_default);
  const rejectedY = rejectedX.map(() => 1);

  const acceptanceTraceAccepted = {
    x: acceptedX,
    y: acceptedY,
    mode: "markers",
    name: "Accepted",
    marker: { size: 10, color: "blue" },
    hovertemplate: "p_default: %{x}<br>Status: Accepted<extra></extra>"
  };

  const acceptanceTraceRejected = {
    x: rejectedX,
    y: rejectedY,
    mode: "markers",
    name: "Rejected",
    marker: { size: 10, color: "red" },
    hovertemplate: "p_default: %{x}<br>Status: Rejected<extra></extra>"
  };

  const layoutProbs = {
    title: {
      text: "Acceptance vs Rejection (Cut-off = 0.20)",
      font: { size: 16 },
    },
    xaxis: {
      title: "Predicted Default Probability",
      tickformat: ".0%",
      range: [0, 0.3],
    },
    yaxis: {
      showgrid: false,
      showline: false,
      visible: false  // hides the Y axis because we're just "jittering" a single row
    },
    margin: { t: 50, r: 20, l: 60, b: 40 }
  };

  Plotly.newPlot("plot-probs", [acceptanceTraceAccepted, acceptanceTraceRejected], layoutProbs);

  // -------------------------------------------------------------------
  // 2) Plotly Chart: "Default Probability vs. Break-even Rate"
  // -------------------------------------------------------------------
  // Dummy data: We'll associate each loan with a break-even rate
  const beData = [
    { term: 36, p_default: 0.04, break_even: 3.2 },
    { term: 60, p_default: 0.25, break_even: null }, // for high default we say NA
    { term: 36, p_default: 0.15, break_even: 3.3 },
    { term: 36, p_default: 0.18, break_even: 3.25 },
    { term: 60, p_default: 0.05, break_even: 3.1 },
  ];

  // For plotting, filter out null break-even
  const beValid = beData.filter(d => d.break_even !== null);
  const xBE = beValid.map(d => d.p_default);
  const yBE = beValid.map(d => d.break_even);
  const termLabels = beValid.map(d => d.term); // e.g. 36 or 60

  const beTrace = {
    x: xBE,
    y: yBE,
    mode: "markers",
    text: termLabels.map(t => `Term: ${t} months`),
    marker: {
      size: 10,
      color: termLabels.map(t => t === 36 ? "blue" : "orange"),
    },
    hovertemplate:
      "Default Probability: %{x:.0%}<br>Break-even Rate: %{y:.2f}%<br>%{text}<extra></extra>"
  };

  const layoutBE = {
    title: { text: "Default Probability vs. Break-even Rate", font: { size: 16 } },
    xaxis: {
      title: "Default Probability",
      tickformat: ".0%",
      range: [0, 0.3],
    },
    yaxis: {
      title: "Break-even Rate (%)",
      range: [0, 4],
    },
    margin: { t: 50, r: 20, l: 70, b: 40 }
  };

  Plotly.newPlot("plot-break-even-scatter", [beTrace], layoutBE);
});
