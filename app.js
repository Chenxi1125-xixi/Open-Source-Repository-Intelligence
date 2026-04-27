const repositoryData = [
  { repo: "refarch-eda", owner: "ibm-cloud-architecture", language: "SQL", company: "IBM Cloud", stars: 111, forks: 66, commits: 683, activeDays: 1977, impact: "High Impact" },
  { repo: "aws-remote-desktop-for-eda", owner: "aws-samples", language: "JavaScript", company: "Amazon Web Services", stars: 16, forks: 141, commits: 29, activeDays: 637, impact: "High Impact" },
  { repo: "kinesis-data-analytics-stream-to-dynamodb", owner: "aws-samples", language: "SQL", company: "Amazon Web Services", stars: 2, forks: 3, commits: 6, activeDays: 162, impact: "Low Impact" },
  { repo: "devday-mwaa-elt-workflows", owner: "aws-samples", language: "Python", company: "Amazon Web Services", stars: 2, forks: 0, commits: 3, activeDays: 4, impact: "Low Impact" },
  { repo: "simpler_eda", owner: "UBC-MDS", language: "Python", company: "University of British Columbia", stars: 0, forks: 5, commits: 114, activeDays: 30, impact: "Early Stage" },
  { repo: "pymleda", owner: "UBC-MDS", language: "Python", company: "University of British Columbia", stars: 0, forks: 1, commits: 141, activeDays: 29, impact: "Early Stage" },
  { repo: "eda_utils_py", owner: "UBC-MDS", language: "Python", company: "University of British Columbia", stars: 0, forks: 4, commits: 225, activeDays: 25, impact: "Early Stage" },
  { repo: "APSJ21G7_ZOMATO_DATA_ANALYSIS", owner: "prabhatdash", language: "Python", company: "Independent Developer", stars: 1, forks: 0, commits: 16, activeDays: 10, impact: "Low Impact" },
  { repo: "APSJ20G2_SALES_DATA_ANALYSIS", owner: "prabhatdash", language: "Python", company: "Independent Developer", stars: 0, forks: 0, commits: 7, activeDays: 110, impact: "Early Stage" },
  { repo: "APSJ21G3_EXAM_DATA_ANALYSIS", owner: "prabhatdash", language: "Python", company: "Independent Developer", stars: 0, forks: 0, commits: 14, activeDays: 7, impact: "Early Stage" },
  { repo: "MS_DA-advanced_data_analytics", owner: "heathermrauch", language: "R", company: "Independent Developer", stars: 0, forks: 0, commits: 6, activeDays: 0, impact: "Early Stage" },
  { repo: "MS_DA-data_mining_2", owner: "heathermrauch", language: "R", company: "Independent Developer", stars: 0, forks: 0, commits: 2, activeDays: 0, impact: "Early Stage" },
  { repo: "MS_DA-data_mining_1", owner: "heathermrauch", language: "R", company: "Independent Developer", stars: 0, forks: 0, commits: 2, activeDays: 0, impact: "Early Stage" },
  { repo: "data_analytics", owner: "krother", language: "Python", company: "Academis", stars: 0, forks: 0, commits: 2, activeDays: 0, impact: "Early Stage" },
  { repo: "Spreadsheet_Tutorial", owner: "krother", language: "R", company: "Academis", stars: 0, forks: 0, commits: 10, activeDays: 2384, impact: "Early Stage" },
  { repo: "refarch-eda-store-simulator", owner: "ibm-cloud-architecture", language: "JavaScript", company: "IBM Cloud", stars: 0, forks: 8, commits: 72, activeDays: 1441, impact: "Early Stage" },
  { repo: "python-covid-data-analysis", owner: "johnehunt", language: "Python", company: "Independent Developer", stars: 1, forks: 0, commits: 2, activeDays: 108, impact: "Low Impact" },
  { repo: "DataAnalysisProject", owner: "johnehunt", language: "Python", company: "Independent Developer", stars: 0, forks: 0, commits: 5, activeDays: 23, impact: "Early Stage" },
  { repo: "asgmt-2-programming-and-data-analysis-2023", owner: "datainpoint", language: "Python", company: "Independent Developer", stars: 2, forks: 0, commits: 4, activeDays: 0, impact: "Low Impact" },
  { repo: "asgmt-1-programming-and-data-analysis-2023", owner: "datainpoint", language: "Python", company: "Independent Developer", stars: 1, forks: 0, commits: 4, activeDays: 1, impact: "Low Impact" },
  { repo: "final-programming-and-data-analysis-2023", owner: "datainpoint", language: "Python", company: "Independent Developer", stars: 1, forks: 0, commits: 3, activeDays: 3, impact: "Low Impact" }
];

const totalUniverse = {
  repositories: 55,
  developers: 20,
  languages: 5,
  stars: 139,
  commits: 1431,
  impact: {
    "High Impact": 2,
    "Medium Impact": 0,
    "Low Impact": 9,
    "Early Stage": 44
  },
  languageCounts: {
    Python: 40,
    JavaScript: 5,
    SQL: 5,
    R: 5
  }
};

const state = {
  language: "All",
  impact: "All"
};

const languageOptions = ["All", "Python", "SQL", "R", "JavaScript"];
const impactOptions = ["All", "High Impact", "Low Impact", "Early Stage"];

const formatNumber = (value) => new Intl.NumberFormat("en-US").format(value);

function filteredRepos() {
  return repositoryData.filter((repo) => {
    const languageOk = state.language === "All" || repo.language === state.language;
    const impactOk = state.impact === "All" || repo.impact === state.impact;
    return languageOk && impactOk;
  });
}

function createFilterButtons(containerId, options, activeValue, onClick) {
  const container = document.getElementById(containerId);
  container.innerHTML = "";

  options.forEach((option) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = option === activeValue ? "filter-chip active" : "filter-chip";
    button.textContent = option;
    button.addEventListener("click", () => onClick(option));
    container.appendChild(button);
  });
}

function renderFilters() {
  createFilterButtons("language-filters", languageOptions, state.language, (option) => {
    state.language = option;
    renderDashboard();
  });

  createFilterButtons("impact-filters", impactOptions, state.impact, (option) => {
    state.impact = option;
    renderDashboard();
  });
}

function renderKpis(rows) {
  const developers = new Set(rows.map((row) => row.owner)).size;
  const stars = rows.reduce((sum, row) => sum + row.stars, 0);
  const commits = rows.reduce((sum, row) => sum + row.commits, 0);

  const items = [
    { label: "Repositories in View", value: rows.length },
    { label: "Developers in View", value: developers },
    { label: "Stars in View", value: stars },
    { label: "Commits in View", value: commits }
  ];

  const grid = document.getElementById("kpi-grid");
  grid.innerHTML = "";

  items.forEach((item) => {
    const card = document.createElement("article");
    card.className = "kpi-card";
    card.innerHTML = `<span>${item.label}</span><strong>${formatNumber(item.value)}</strong>`;
    grid.appendChild(card);
  });
}

function renderBarChart(containerId, data, key, labelFormatter) {
  const container = document.getElementById(containerId);
  container.innerHTML = "";

  const max = Math.max(...data.map((item) => item[key]), 1);

  data.forEach((item) => {
    const row = document.createElement("div");
    row.className = "bar-row";
    const width = `${(item[key] / max) * 100}%`;
    row.innerHTML = `
      <div class="bar-label">${labelFormatter(item)}</div>
      <div class="bar-track">
        <div class="bar-fill" style="width:${width}"></div>
      </div>
      <div class="bar-value">${formatNumber(item[key])}</div>
    `;
    container.appendChild(row);
  });
}

function renderTopRepos(rows) {
  const data = [...rows]
    .sort((a, b) => b.stars - a.stars || b.forks - a.forks)
    .slice(0, 6);

  document.getElementById("repo-subtitle").textContent = `${state.language} • ${state.impact}`;
  renderBarChart("top-repos-chart", data, "stars", (item) => `${item.repo} · ${item.owner}`);
}

function renderDeveloperChart(rows) {
  const totals = new Map();
  rows.forEach((row) => {
    const current = totals.get(row.owner) || 0;
    totals.set(row.owner, current + row.stars);
  });

  const data = [...totals.entries()]
    .map(([owner, stars]) => ({ owner, stars }))
    .sort((a, b) => b.stars - a.stars)
    .slice(0, 6);

  renderBarChart("developer-chart", data, "stars", (item) => item.owner);
}

function renderLanguageChart() {
  const data = Object.entries(totalUniverse.languageCounts).map(([language, count]) => ({
    language,
    count
  }));
  renderBarChart("language-chart", data, "count", (item) => item.language);
}

function renderLifespanChart(rows) {
  const data = [...rows]
    .sort((a, b) => b.activeDays - a.activeDays)
    .slice(0, 5);
  renderBarChart("lifespan-chart", data, "activeDays", (item) => item.repo);
}

function renderImpactDonut(rows) {
  const counts = rows.reduce(
    (acc, row) => {
      acc[row.impact] = (acc[row.impact] || 0) + 1;
      return acc;
    },
    { "High Impact": 0, "Low Impact": 0, "Early Stage": 0 }
  );

  const total = rows.length || 1;
  const slices = [
    { name: "High Impact", value: counts["High Impact"], color: "#12343b" },
    { name: "Low Impact", value: counts["Low Impact"], color: "#c65d26" },
    { name: "Early Stage", value: counts["Early Stage"], color: "#d8b98d" }
  ];

  let current = 0;
  const gradientParts = slices.map((slice) => {
    const start = (current / total) * 360;
    current += slice.value;
    const end = (current / total) * 360;
    return `${slice.color} ${start}deg ${end}deg`;
  });

  const donut = document.getElementById("impact-donut");
  donut.style.background = `conic-gradient(${gradientParts.join(", ")})`;
  donut.innerHTML = `<div class="donut-center"><strong>${rows.length}</strong><span>Repos</span></div>`;

  const legend = document.getElementById("impact-legend");
  legend.innerHTML = "";
  slices.forEach((slice) => {
    const item = document.createElement("div");
    item.className = "legend-item";
    item.innerHTML = `
      <span class="legend-dot" style="background:${slice.color}"></span>
      <span>${slice.name}</span>
      <strong>${slice.value}</strong>
    `;
    legend.appendChild(item);
  });
}

function renderScatter(rows) {
  const svg = document.getElementById("scatter-plot");
  const width = 560;
  const height = 320;
  const padding = 36;
  const maxForks = Math.max(...rows.map((r) => r.forks), 1);
  const maxStars = Math.max(...rows.map((r) => r.stars), 1);
  const maxCommits = Math.max(...rows.map((r) => r.commits), 1);

  const colorMap = {
    Python: "#12343b",
    SQL: "#c65d26",
    R: "#4b6a88",
    JavaScript: "#8a3f17"
  };

  const circles = rows
    .slice(0, 18)
    .map((row) => {
      const x = padding + (row.forks / maxForks) * (width - padding * 2);
      const y = height - padding - (row.stars / maxStars) * (height - padding * 2);
      const radius = 6 + (row.commits / maxCommits) * 10;
      return `
        <circle cx="${x}" cy="${y}" r="${radius}" fill="${colorMap[row.language] || "#59636e"}" opacity="0.78">
          <title>${row.repo} | ${row.language} | Stars ${row.stars} | Forks ${row.forks} | Commits ${row.commits}</title>
        </circle>
      `;
    })
    .join("");

  svg.innerHTML = `
    <line x1="${padding}" y1="${height - padding}" x2="${width - padding}" y2="${height - padding}" stroke="#59636e" stroke-width="1.2"></line>
    <line x1="${padding}" y1="${padding}" x2="${padding}" y2="${height - padding}" stroke="#59636e" stroke-width="1.2"></line>
    <text x="${width - padding}" y="${height - 10}" text-anchor="end" fill="#59636e" font-size="12">Forks</text>
    <text x="18" y="${padding}" fill="#59636e" font-size="12">Stars</text>
    ${circles}
  `;
}

function renderTable(rows) {
  const body = document.getElementById("repo-table-body");
  body.innerHTML = "";

  rows
    .slice()
    .sort((a, b) => b.stars - a.stars || b.commits - a.commits)
    .forEach((row) => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${row.repo}</td>
        <td>${row.owner}</td>
        <td>${row.language}</td>
        <td>${row.impact}</td>
        <td>${row.stars}</td>
        <td>${row.forks}</td>
        <td>${row.commits}</td>
        <td>${row.activeDays}</td>
      `;
      body.appendChild(tr);
    });
}

function renderDashboard() {
  const rows = filteredRepos();
  renderFilters();
  renderKpis(rows);
  renderTopRepos(rows);
  renderDeveloperChart(rows);
  renderLanguageChart();
  renderLifespanChart(rows);
  renderImpactDonut(rows);
  renderScatter(rows);
  renderTable(rows);
}

renderDashboard();
