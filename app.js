let repositoryData = [];
let languageOptions = ["All"];
let impactOptions = ["All"];

const state = {
  language: "All",
  impact: "All"
};

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
  const counts = repositoryData.reduce((acc, row) => {
    acc[row.language] = (acc[row.language] || 0) + 1;
    return acc;
  }, {});
  const data = Object.entries(counts)
    .map(([language, count]) => ({
    language,
    count
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 6);
  renderBarChart("language-chart", data, "count", (item) => item.language);
}

function renderLifespanChart(rows) {
  const data = [...rows]
    .sort((a, b) => b.activeDays - a.activeDays)
    .slice(0, 5);
  renderBarChart("lifespan-chart", data, "activeDays", (item) => item.repo);
}

function renderLifecycleChart(rows) {
  const buckets = [
    { label: "0-30 days", count: 0 },
    { label: "31-180 days", count: 0 },
    { label: "181-365 days", count: 0 },
    { label: "1-3 years", count: 0 },
    { label: "3+ years", count: 0 }
  ];

  rows.forEach((row) => {
    const days = row.activeDays;
    if (days <= 30) buckets[0].count += 1;
    else if (days <= 180) buckets[1].count += 1;
    else if (days <= 365) buckets[2].count += 1;
    else if (days <= 1095) buckets[3].count += 1;
    else buckets[4].count += 1;
  });

  renderBarChart("lifecycle-chart", buckets, "count", (item) => item.label);
}

function renderReadmeSummary(rows) {
  const withReadme = rows.filter((row) => row.hasReadme === 1).length;
  const withoutReadme = rows.length - withReadme;
  const coverage = rows.length ? Math.round((withReadme / rows.length) * 100) : 0;

  const container = document.getElementById("readme-summary");
  container.innerHTML = `
    <div class="metric-card">
      <span>With README</span>
      <strong>${formatNumber(withReadme)}</strong>
    </div>
    <div class="metric-card">
      <span>Without README</span>
      <strong>${formatNumber(withoutReadme)}</strong>
    </div>
    <div class="metric-card">
      <span>Coverage Rate</span>
      <strong>${coverage}%</strong>
    </div>
  `;
}

function renderHealthChart(rows) {
  const bands = [
    { label: "0", count: 0 },
    { label: "1-25", count: 0 },
    { label: "26-50", count: 0 },
    { label: "51-75", count: 0 },
    { label: "76-100", count: 0 }
  ];

  rows.forEach((row) => {
    const score = row.communityHealth;
    if (score === 0) bands[0].count += 1;
    else if (score <= 25) bands[1].count += 1;
    else if (score <= 50) bands[2].count += 1;
    else if (score <= 75) bands[3].count += 1;
    else bands[4].count += 1;
  });

  renderBarChart("health-chart", bands, "count", (item) => item.label);
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

function renderTable(rows) {
  const body = document.getElementById("repo-table-body");
  body.innerHTML = "";

  rows
    .slice()
    .sort((a, b) => b.stars - a.stars || b.commits - a.commits)
    .slice(0, 12)
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
  renderLifecycleChart(rows);
  renderReadmeSummary(rows);
  renderHealthChart(rows);
  renderLifespanChart(rows);
  renderImpactDonut(rows);
  renderTable(rows);
}

function initializeData(rows) {
  repositoryData = rows.map((row) => ({
    repo: row.repo,
    owner: row.owner,
    language: row.language || "Unknown",
    stars: Number(row.stars || 0),
    forks: Number(row.forks || 0),
    watchers: Number(row.watchers || 0),
    commits: Number(row.commits || 0),
    activeDays: Number(row.active_days || 0),
    impact: row.impact || "Early Stage",
    hasReadme: Number(row.has_readme || 0),
    communityHealth: Number(row.community_health || 0),
    githubUrl: row.github_url || ""
  }));

  const languages = [...new Set(repositoryData.map((row) => row.language))].sort((a, b) => a.localeCompare(b));
  const impacts = [...new Set(repositoryData.map((row) => row.impact))];

  languageOptions = ["All", ...languages];
  impactOptions = ["All", ...impacts];
  renderDashboard();
}

fetch("data/repository_dashboard_full.json")
  .then((response) => response.json())
  .then((rows) => initializeData(rows))
  .catch(() => {
    const grid = document.getElementById("kpi-grid");
    grid.innerHTML = '<article class="kpi-card"><span>Data Load Status</span><strong>Failed</strong></article>';
    document.getElementById("repo-table-body").innerHTML =
      '<tr><td colspan="8">The dashboard data file could not be loaded. Use GitHub Pages or run the local preview script.</td></tr>';
  });
