# Power BI Report Blueprint

This file is the exact storyboard for the report so you can build it fast and still make it feel polished.

## Recommended report name

`GitHub Open-Source Activity Analytics`

## Recommended report pages

### Page 1: Executive Overview

Purpose:
Give a hiring manager a 20-second understanding of what the project measures.

Visual layout:

- Top row:
  - `Total Repositories`
  - `Total Developers`
  - `Total Stars`
  - `Total Commits`
- Middle left:
  - horizontal bar chart: `Top 10 Repositories by Stars`
- Middle right:
  - horizontal bar chart: `Top Developers by Total Stars`
- Bottom left:
  - donut chart: `Repository Impact Tier`
- Bottom right:
  - clustered column chart: `Repository Count by Language`

Suggested titles:

- `How large is the curated GitHub sample?`
- `Which repositories drive visibility?`
- `Which owners contribute the most engagement?`
- `How mature is the repository portfolio?`
- `What languages dominate the sample?`

### Page 2: Repository Deep Dive

Purpose:
Show that the dashboard supports exploration rather than only headline metrics.

Visual layout:

- Left:
  - scatter plot: `Stars vs Forks by Repository`
- Right top:
  - column chart: `Repository Active Days`
- Right bottom:
  - bar chart: `Total Stars by Company`
- Bottom:
  - table: `Repository Detail Explorer`

Recommended fields:

- Scatter x-axis: `forks`
- Scatter y-axis: `stars`
- Bubble size: `commit_count`
- Legend: `language_name`
- Tooltip:
  - `repo_name`
  - `owner_login`
  - `company_name`
  - `active_days`
  - `community_health_percentage`

Table columns:

- `repo_name`
- `owner_login`
- `language_name`
- `impact_level`
- `stars`
- `forks`
- `commit_count`
- `active_days`
- `community_health_percentage`

### Page 3: Data Quality and Model Design

Purpose:
This is the page that makes the project feel senior and thoughtful.

Visual layout:

- Left:
  - static image or imported diagram: EER model
- Right top:
  - text box: `Data Modeling Decisions`
- Right middle:
  - text box: `Data Quality Constraints`
- Right bottom:
  - card or matrix: `Coverage / sample facts`

Suggested talking points:

- only a small fraction of repository owners matched the user dataset cleanly
- `commit_count_display` needed regex-style cleanup before loading
- language representation was highly skewed, so the schema was designed with future extensibility in mind

## DAX measures to create

```DAX
Total Repositories = DISTINCTCOUNT(repository_analysis_view[repo_name])

Total Developers = DISTINCTCOUNT(repository_analysis_view[owner_login])

Total Stars = SUM(repository_analysis_view[stars])

Total Forks = SUM(repository_analysis_view[forks])

Total Commits = SUM(repository_analysis_view[commit_count])

Average Active Days = AVERAGE(repository_analysis_view[active_days])

Average Stars Per Repo = DIVIDE([Total Stars], [Total Repositories])

Average Forks Per Repo = DIVIDE([Total Forks], [Total Repositories])
```

## Slicers to place on every page

- `language_name`
- `company_name`
- `impact_level`
- `owner_login`

Keep them aligned in the same place across pages for a more professional feel.

## Color and layout notes

- Use the theme file at `assets/powerbi-theme.json`.
- Use one warm accent color for emphasis and one dark slate for primary data marks.
- Keep page backgrounds light and calm.
- Avoid default Power BI blue where possible.

## Narration for demoing the report

Use this sequence:

1. Start with the business problem.
2. Explain why you normalized the data.
3. Show the executive page.
4. Drill into repository patterns.
5. End with data quality tradeoffs and future improvements.
