const powerBiEmbedUrl = "";

const stats = {
  repositories: 55,
  developers: 20,
  stars: 139,
  commits: 1431,
};

const formatNumber = (value) => new Intl.NumberFormat("en-US").format(value);

document.getElementById("repo-count").textContent = formatNumber(stats.repositories);
document.getElementById("developer-count").textContent = formatNumber(stats.developers);
document.getElementById("star-count").textContent = formatNumber(stats.stars);
document.getElementById("commit-count").textContent = formatNumber(stats.commits);

if (powerBiEmbedUrl.trim()) {
  const shell = document.getElementById("powerbi-frame");
  shell.innerHTML = `
    <iframe
      title="Open Source Repository Intelligence Power BI Report"
      src="${powerBiEmbedUrl}"
      allowfullscreen="true">
    </iframe>
  `;
}
