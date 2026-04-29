let repositoryData = [];
let languageOptions = ["All"];
let impactOptions = ["All"];
const powerBiReportUrl = "https://app.powerbi.com/links/9YXvYC_yb6?ctid=704d822c-358a-4784-9a16-49e20b75f941&pbi_source=linkShare&bookmarkGuid=000e47cf-321c-4b05-96ca-d1eae8ffcaa5";

const state = {
  language: "All",
  impact: "All"
};

const formatNumber = (value) => new Intl.NumberFormat("en-US").format(value);

function renderPowerBiLink() {
  const slot = document.getElementById("powerbi-link-slot");
  if (!slot) return;

  if (powerBiReportUrl.trim()) {
    slot.innerHTML = `
      <a class="button primary" href="${powerBiReportUrl}" target="_blank" rel="noreferrer">
        Open Published Power BI Report
      </a>
    `;
  }
}

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

  const summary = document.getElementById("filter-summary");
  if (summary) {
    summary.textContent = `${state.language} · ${state.impact}`;
  }

  const resetButton = document.getElementById("reset-filters");
  if (resetButton && !resetButton.dataset.bound) {
    resetButton.dataset.bound = "true";
    resetButton.addEventListener("click", () => {
      state.language = "All";
      state.impact = "All";
      renderDashboard();
    });
  }
}

function renderKpis(rows) {
  const developers = new Set(rows.map((row) => row.owner)).size;
  const stars = rows.reduce((sum, row) => sum + row.stars, 0);
  const forks = rows.reduce((sum, row) => sum + row.forks, 0);
  const commits = rows.reduce((sum, row) => sum + row.commits, 0);
  const readmeCoverage = rows.length
    ? Math.round((rows.filter((row) => row.hasReadme === 1).length / rows.length) * 100)
    : 0;
  const averageStars = rows.length ? (stars / rows.length).toFixed(2) : "0.00";
  const averageCommits = rows.length ? (commits / rows.length).toFixed(1) : "0.0";
  const medianActiveDays = rows.length
    ? rows
        .map((row) => row.activeDays)
        .sort((a, b) => a - b)[Math.floor(rows.length / 2)]
    : 0;
  const starred = rows.filter((row) => row.stars > 0);
  const avgForkToStar = starred.length
    ? (starred.reduce((sum, row) => sum + row.forks / row.stars, 0) / starred.length).toFixed(2)
    : "0.00";
  const impactShare = rows.length
    ? Math.round((rows.filter((row) => row.impact === "High Impact" || row.impact === "Medium Impact").length / rows.length) * 100)
    : 0;
  const topTenShare = stars
    ? Math.round((rows.slice().sort((a, b) => b.stars - a.stars).slice(0, 10).reduce((sum, row) => sum + row.stars, 0) / stars) * 100)
    : 0;

  const items = [
    { label: "Repositories in View", value: rows.length },
    { label: "Owners in View", value: developers },
    { label: "Average Stars per Repo", value: averageStars },
    { label: "Average Commits per Repo", value: averageCommits },
    { label: "README Adoption Rate", value: `${readmeCoverage}%` },
    { label: "Average Fork-to-Star Ratio", value: avgForkToStar },
    { label: "High + Medium Impact Share", value: `${impactShare}%` },
    { label: "Top 10 Star Concentration", value: `${topTenShare}%` },
    { label: "Median Active Days", value: medianActiveDays }
  ];

  const grid = document.getElementById("kpi-grid");
  grid.innerHTML = "";

  items.forEach((item) => {
    const card = document.createElement("article");
    card.className = "kpi-card";
    const value = typeof item.value === "number" ? formatNumber(item.value) : item.value;
    card.innerHTML = `<span>${item.label}</span><strong>${value}</strong>`;
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

function renderOwnerVolumeChart(rows) {
  const totals = new Map();
  rows.forEach((row) => {
    const current = totals.get(row.owner) || 0;
    totals.set(row.owner, current + 1);
  });

  const data = [...totals.entries()]
    .map(([owner, count]) => ({ owner, count }))
    .sort((a, b) => b.count - a.count || a.owner.localeCompare(b.owner))
    .slice(0, 6);

  renderBarChart("owner-volume-chart", data, "count", (item) => item.owner);
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

function renderStarsBucketChart(rows) {
  const buckets = [
    { label: "0", count: 0 },
    { label: "1-4", count: 0 },
    { label: "5-19", count: 0 },
    { label: "20-99", count: 0 },
    { label: "100+", count: 0 }
  ];

  rows.forEach((row) => {
    const stars = row.stars;
    if (stars === 0) buckets[0].count += 1;
    else if (stars <= 4) buckets[1].count += 1;
    else if (stars <= 19) buckets[2].count += 1;
    else if (stars <= 99) buckets[3].count += 1;
    else buckets[4].count += 1;
  });

  renderBarChart("stars-bucket-chart", buckets, "count", (item) => item.label);
}

function renderVisibilityScatter(rows) {
  const svg = document.getElementById("visibility-scatter");
  if (!svg) return;

  const width = 560;
  const height = 320;
  const padding = 42;
  const plotted = rows
    .slice()
    .sort((a, b) => b.stars - a.stars || b.forks - a.forks)
    .slice(0, 60);
  const maxStars = Math.max(...plotted.map((r) => Math.log10(r.stars + 1)), 1);
  const maxForks = Math.max(...plotted.map((r) => Math.log10(r.forks + 1)), 1);
  const colorMap = {
    "High Impact": "#12343b",
    "Medium Impact": "#4b6a88",
    "Low Impact": "#c65d26",
    "Early Stage": "#d8b98d"
  };

  const circles = plotted.map((row) => {
    const x = padding + (Math.log10(row.forks + 1) / maxForks) * (width - padding * 2);
    const y = height - padding - (Math.log10(row.stars + 1) / maxStars) * (height - padding * 2);
    const radius = 4 + Math.min(10, Math.sqrt(row.commits) / 3);
    return `
      <circle cx="${x.toFixed(2)}" cy="${y.toFixed(2)}" r="${radius.toFixed(2)}" fill="${colorMap[row.impact] || "#59636e"}" opacity="0.72">
        <title>${row.repo} | Stars ${row.stars} | Forks ${row.forks} | Commits ${row.commits}</title>
      </circle>
    `;
  }).join("");

  svg.innerHTML = `
    <line x1="${padding}" y1="${height - padding}" x2="${width - padding}" y2="${height - padding}" stroke="#59636e" stroke-width="1.2"></line>
    <line x1="${padding}" y1="${padding}" x2="${padding}" y2="${height - padding}" stroke="#59636e" stroke-width="1.2"></line>
    <text x="${width - padding}" y="${height - 10}" text-anchor="end" fill="#59636e" font-size="12">Forks (log scale)</text>
    <text x="16" y="${padding}" fill="#59636e" font-size="12">Stars (log scale)</text>
    ${circles}
  `;
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

function renderLifecycleLine(rows) {
  const svg = document.getElementById("lifecycle-line");
  if (!svg) return;

  const width = 560;
  const height = 320;
  const padding = 42;
  const segments = [
    { label: "0-30", test: (d) => d <= 30 },
    { label: "31-180", test: (d) => d > 30 && d <= 180 },
    { label: "181-365", test: (d) => d > 180 && d <= 365 },
    { label: "1-3y", test: (d) => d > 365 && d <= 1095 },
    { label: "3y+", test: (d) => d > 1095 }
  ];

  const total = rows.length || 1;
  let cumulative = 0;
  const points = segments.map((segment) => {
    const count = rows.filter((row) => segment.test(row.activeDays)).length;
    cumulative += count;
    return { label: segment.label, share: cumulative / total };
  });

  const path = points.map((point, index) => {
    const x = padding + (index / (points.length - 1)) * (width - padding * 2);
    const y = height - padding - point.share * (height - padding * 2);
    return `${index === 0 ? "M" : "L"} ${x.toFixed(2)} ${y.toFixed(2)}`;
  }).join(" ");

  const dots = points.map((point, index) => {
    const x = padding + (index / (points.length - 1)) * (width - padding * 2);
    const y = height - padding - point.share * (height - padding * 2);
    return `
      <circle cx="${x.toFixed(2)}" cy="${y.toFixed(2)}" r="5" fill="#c65d26"></circle>
      <text x="${x.toFixed(2)}" y="${height - padding + 18}" text-anchor="middle" fill="#59636e" font-size="11">${point.label}</text>
      <text x="${x.toFixed(2)}" y="${(y - 10).toFixed(2)}" text-anchor="middle" fill="#12343b" font-size="11">${Math.round(point.share * 100)}%</text>
    `;
  }).join("");

  svg.innerHTML = `
    <line x1="${padding}" y1="${height - padding}" x2="${width - padding}" y2="${height - padding}" stroke="#59636e" stroke-width="1.2"></line>
    <line x1="${padding}" y1="${padding}" x2="${padding}" y2="${height - padding}" stroke="#59636e" stroke-width="1.2"></line>
    <path d="${path}" fill="none" stroke="#12343b" stroke-width="3"></path>
    ${dots}
    <text x="18" y="${padding}" fill="#59636e" font-size="12">Cumulative share</text>
  `;
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

function renderHealthGrid(rows) {
  const grid = document.getElementById("health-grid");
  if (!grid) return;

  const colors = {
    zero: "#efe2c6",
    low: "#e8c89a",
    medium: "#d9894a",
    strong: "#4b6a88",
    excellent: "#12343b"
  };

  const sampled = rows
    .slice()
    .sort((a, b) => b.stars - a.stars || b.communityHealth - a.communityHealth)
    .slice(0, 120)
    .map((row) => {
      const score = row.communityHealth;
      if (score === 0) return colors.zero;
      if (score <= 25) return colors.low;
      if (score <= 50) return colors.medium;
      if (score <= 75) return colors.strong;
      return colors.excellent;
    });

  grid.innerHTML = `
    <div class="health-tiles">
      ${sampled.map((color) => `<span class="health-tile" style="background:${color}"></span>`).join("")}
    </div>
    <div class="health-key">
      <div class="legend-item"><span class="legend-dot" style="background:${colors.zero}"></span><span>0</span></div>
      <div class="legend-item"><span class="legend-dot" style="background:${colors.low}"></span><span>1-25</span></div>
      <div class="legend-item"><span class="legend-dot" style="background:${colors.medium}"></span><span>26-50</span></div>
      <div class="legend-item"><span class="legend-dot" style="background:${colors.strong}"></span><span>51-75</span></div>
      <div class="legend-item"><span class="legend-dot" style="background:${colors.excellent}"></span><span>76-100</span></div>
    </div>
  `;
}

function renderImpactDonut(rows) {
  const counts = rows.reduce(
    (acc, row) => {
      acc[row.impact] = (acc[row.impact] || 0) + 1;
      return acc;
    },
    { "High Impact": 0, "Medium Impact": 0, "Low Impact": 0, "Early Stage": 0 }
  );

  const total = rows.length || 1;
  const slices = [
    { name: "High Impact", value: counts["High Impact"], color: "#12343b" },
    { name: "Medium Impact", value: counts["Medium Impact"], color: "#4b6a88" },
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
        <td><a href="${row.githubUrl}" target="_blank" rel="noreferrer">${row.repo}</a></td>
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

function renderInsightSummary(rows) {
  const box = document.getElementById("insight-summary");
  if (!box) return;

  const stars = rows.reduce((sum, row) => sum + row.stars, 0);
  const topFiveStars = rows
    .slice()
    .sort((a, b) => b.stars - a.stars)
    .slice(0, 5)
    .reduce((sum, row) => sum + row.stars, 0);
  const topShare = stars ? Math.round((topFiveStars / stars) * 100) : 0;
  const pythonShare = rows.length
    ? Math.round((rows.filter((row) => row.language === "Python").length / rows.length) * 100)
    : 0;
  const longLived = rows.filter((row) => row.activeDays > 365).length;

  const readmeRepos = rows.filter((row) => row.hasReadme === 1);
  const noReadmeRepos = rows.filter((row) => row.hasReadme === 0);
  const readmeStars = readmeRepos.length
    ? (readmeRepos.reduce((sum, row) => sum + row.stars, 0) / readmeRepos.length).toFixed(2)
    : "0.00";
  const noReadmeStars = noReadmeRepos.length
    ? (noReadmeRepos.reduce((sum, row) => sum + row.stars, 0) / noReadmeRepos.length).toFixed(2)
    : "0.00";

  box.innerHTML = `
    <article class="insight-note">
      <span>Concentration</span>
      <strong>${topShare}% of visible stars come from the top 5 repositories in the current view.</strong>
    </article>
    <article class="insight-note">
      <span>Documentation effect</span>
      <strong>Repositories with a README average ${readmeStars} stars in the current view, versus ${noReadmeStars} without one.</strong>
    </article>
    <article class="insight-note">
      <span>Lifecycle</span>
      <strong>${formatNumber(longLived)} repositories in the current view stayed active for more than one year, while ${pythonShare}% of the current view is Python.</strong>
    </article>
  `;
}

function renderDashboard() {
  const rows = filteredRepos();
  renderFilters();
  renderKpis(rows);
  renderTopRepos(rows);
  renderDeveloperChart(rows);
  renderOwnerVolumeChart(rows);
  renderLanguageChart();
  renderVisibilityScatter(rows);
  renderLifecycleLine(rows);
  renderReadmeSummary(rows);
  renderHealthGrid(rows);
  renderLifespanChart(rows);
  renderImpactDonut(rows);
  renderInsightSummary(rows);
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
  renderPowerBiLink();
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
    renderPowerBiLink();
  });
