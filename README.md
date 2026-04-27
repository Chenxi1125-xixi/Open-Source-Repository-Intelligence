# Open Source Repository Intelligence

Portfolio-ready analytics project built on public open-source repository and developer data. The project combines relational database design, SQL analytics, and a Power BI-ready presentation layer to explore repository popularity, developer productivity, project longevity, and organization-level engagement.

## Why this repo exists

This repo is structured to present the project as a polished portfolio piece instead of a class submission. It includes:

- A public-facing project website in [index.html](/Users/xixi/Documents/New%20project/index.html)
- SQL schema and analytics queries in `sql/`
- Documentation for building and embedding a Power BI dashboard in `docs/powerbi-build-guide.md`
- A detailed Power BI storyboard in `docs/powerbi-report-blueprint.md`
- A field-by-field Power BI visual spec in `docs/powerbi-visual-spec.md`
- A GitHub Pages launch guide in `docs/github-pages-launch.md`
- A data dictionary in `docs/data-dictionary.md`
- An EER diagram in `assets/schema-diagram.png`
- A Power BI theme file in `assets/powerbi-theme.json`
- A local preview script in `preview-site.sh`

## Recommended portfolio framing

Use this project as a data product story:

- Problem: raw GitHub exports are noisy and hard to query across entities.
- Solution: design a normalized MySQL schema with reusable analytics views.
- Output: deliver decision-friendly insights through SQL and Power BI.
- Value: show database design, data cleaning, query writing, and BI storytelling in one project.

## Repo structure

```text
.
├── app.js
├── assets/
├── docs/
├── index.html
├── sql/
└── styles.css
```

## How to use this repo

1. Review the schema in `sql/github_db_table.final.sql`.
2. Review analytical queries in `sql/github_db_querys.final.sql`.
3. Build the Power BI report using the guide in `docs/powerbi-build-guide.md`.
4. Use `docs/powerbi-visual-spec.md` for exact titles, fields, and layout order.
5. Publish the Power BI report and paste the embed URL into `app.js`.
6. Preview the site locally with `bash preview-site.sh`.
7. Host the site with GitHub Pages, Netlify, or Vercel.

## Suggested resume bullets

- Designed and implemented a normalized MySQL analytics database on public open-source repository and developer data, supporting reusable SQL views and multi-table reporting.
- Built SQL workflows using joins, window functions, CTEs, aggregations, and classification logic to analyze repository popularity, developer productivity, and project lifespan.
- Packaged the relational analysis into a portfolio website and Power BI dashboard for technical and non-technical presentation.

## Suggested project name and repo description

- Project name: `Open Source Repository Intelligence`
- Recommended repo name: `open-source-repository-intelligence`
- Recommended GitHub repo description: `Portfolio-ready analytics project combining SQL, relational database design, and Power BI storytelling on open-source repository data.`

## Next upgrades

- Add a `repository_languages` junction table from `languages_breakdown` JSON.
- Create a reproducible ETL pipeline from raw CSV to MySQL.
- Connect a GitHub API refresh workflow for newer metrics.
- Publish the Power BI report and replace the placeholder embed URL.
