# Power BI Visual Specification

Project name:
`Open Source Repository Intelligence`

This file gives you the exact Chinese and English titles, field mapping, and layout order for each visual.

## Page 1

Page name CN:
`执行总览`

Page name EN:
`Executive Overview`

Visual 1

- CN title: `样本仓库总数`
- EN title: `Total Repositories`
- Visual type: Card
- Field drag:
  - `repo_name` -> Distinct count
- Position:
  - top row, first card

Visual 2

- CN title: `开发者总数`
- EN title: `Total Developers`
- Visual type: Card
- Field drag:
  - `owner_login` -> Distinct count
- Position:
  - top row, second card

Visual 3

- CN title: `累计 Stars`
- EN title: `Total Stars`
- Visual type: Card
- Field drag:
  - `stars` -> Sum
- Position:
  - top row, third card

Visual 4

- CN title: `累计 Commits`
- EN title: `Total Commits`
- Visual type: Card
- Field drag:
  - `commit_count` -> Sum
- Position:
  - top row, fourth card

Visual 5

- CN title: `Top 10 仓库热度排名`
- EN title: `Top 10 Repositories by Stars`
- Visual type: Horizontal bar chart
- Field drag:
  - Y-axis: `repo_name`
  - X-axis: `stars` -> Sum
  - Tooltip: `owner_login`, `forks`, `active_days`, `language_name`
- Sort:
  - `stars` descending
- Position:
  - middle row, left, large chart

Visual 6

- CN title: `开发者累计 Stars 排名`
- EN title: `Top Developers by Total Stars`
- Visual type: Horizontal bar chart
- Field drag:
  - Y-axis: `owner_login`
  - X-axis: `stars` -> Sum
  - Tooltip: `public_repos`, `followers`, `forks`
- Sort:
  - `stars` descending
- Position:
  - middle row, right

Visual 7

- CN title: `仓库影响力分层`
- EN title: `Repository Impact Tier`
- Visual type: Donut chart
- Field drag:
  - Legend: `impact_level`
  - Values: `repo_name` -> Count
- Position:
  - bottom row, left

Visual 8

- CN title: `语言分布`
- EN title: `Repository Count by Language`
- Visual type: Clustered column chart
- Field drag:
  - X-axis: `language_name`
  - Y-axis: `repo_name` -> Count
- Position:
  - bottom row, right

## Page 2

Page name CN:
`仓库深度分析`

Page name EN:
`Repository Deep Dive`

Visual 1

- CN title: `Stars 与 Forks 关系`
- EN title: `Stars vs Forks by Repository`
- Visual type: Scatter plot
- Field drag:
  - X-axis: `forks`
  - Y-axis: `stars`
  - Details: `repo_name`
  - Legend: `language_name`
  - Size: `commit_count`
  - Tooltips: `owner_login`, `company_name`, `active_days`, `community_health_percentage`
- Position:
  - top left, wide chart

Visual 2

- CN title: `仓库活跃周期分布`
- EN title: `Repository Active Days`
- Visual type: Column chart
- Field drag:
  - X-axis: `repo_name`
  - Y-axis: `active_days` -> Sum or Don't summarize
- Sort:
  - `active_days` descending
- Position:
  - top right

Visual 3

- CN title: `机构/公司贡献的 Stars`
- EN title: `Total Stars by Company`
- Visual type: Horizontal bar chart
- Field drag:
  - Y-axis: `company_name`
  - X-axis: `stars` -> Sum
- Position:
  - middle right

Visual 4

- CN title: `仓库明细浏览器`
- EN title: `Repository Detail Explorer`
- Visual type: Table
- Field drag:
  - `repo_name`
  - `owner_login`
  - `language_name`
  - `impact_level`
  - `stars`
  - `forks`
  - `commit_count`
  - `active_days`
  - `community_health_percentage`
- Position:
  - bottom full width

## Page 3

Page name CN:
`数据质量与建模设计`

Page name EN:
`Data Quality and Model Design`

Visual 1

- CN title: `数据库关系模型`
- EN title: `Relational Schema Overview`
- Visual type: Image
- Field drag:
  - import `assets/schema-diagram.png`
- Position:
  - left side, tall panel

Visual 2

- CN title: `数据匹配挑战`
- EN title: `Cross-Source Matching Challenge`
- Visual type: Text box
- Text content:
  - only a small share of repository owners had matching developer profiles in the second dataset
- Position:
  - right top

Visual 3

- CN title: `字段清洗逻辑`
- EN title: `Metric Cleaning Logic`
- Visual type: Text box
- Text content:
  - free-text commit fields needed regex-like extraction before loading into MySQL
- Position:
  - right middle

Visual 4

- CN title: `未来扩展方向`
- EN title: `Future Modeling Extensions`
- Visual type: Text box
- Text content:
  - convert language breakdown into a many-to-many bridge table
- Position:
  - right lower

Visual 5

- CN title: `样本概览`
- EN title: `Coverage Snapshot`
- Visual type: Cards
- Field drag:
  - repositories
  - developers
  - languages
- Position:
  - lower right or bottom strip

## Slicers on every page

- CN title: `语言筛选`
- EN title: `Language`
- Field: `language_name`

- CN title: `公司筛选`
- EN title: `Company`
- Field: `company_name`

- CN title: `影响力筛选`
- EN title: `Impact Level`
- Field: `impact_level`

- CN title: `开发者筛选`
- EN title: `Owner`
- Field: `owner_login`

## Suggested report order

1. Executive Overview
2. Repository Deep Dive
3. Data Quality and Model Design

## Presentation order in interviews

1. Open with Page 1
2. Drill into Page 2
3. End with Page 3 to show technical maturity
