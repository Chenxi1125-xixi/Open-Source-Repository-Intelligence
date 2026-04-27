# Data Dictionary

## Core tables

### `developers`

- `developer_id`: surrogate primary key
- `login`: GitHub username or organization login
- `full_name`: profile display name
- `company_id`: foreign key to `companies`
- `location`: free-text location
- `followers`: follower count
- `following`: following count
- `public_repos`: public repository count
- `account_created_date`: GitHub account creation date
- `account_updated_date`: latest profile update date

### `repositories`

- `repo_id`: surrogate primary key
- `developer_id`: foreign key to `developers`
- `language_id`: foreign key to `languages`
- `repo_name`: repository name
- `github_url`: repository URL
- `description`: repository description
- `has_readme`: readme flag
- `created_date`: repository creation date
- `updated_date`: repository metadata update date
- `pushed_date`: latest push date

### `repository_metrics`

- `metric_id`: surrogate primary key
- `repo_id`: one-to-one foreign key to `repositories`
- `stars`: star count
- `forks`: fork count
- `watchers`: watcher count
- `open_issues_count`: open issues
- `open_pulls_count`: open pull requests
- `contributors_count`: contributor count
- `release_count`: release count
- `commit_count`: commit count after text cleanup
- `file_count`: file count
- `readme_size_bytes`: README size in bytes
- `community_health_percentage`: community health score
- `workflow_count`: GitHub Actions workflow count

### `languages`

- `language_id`: surrogate primary key
- `language_name`: primary repository language

### `companies`

- `company_id`: surrogate primary key
- `company_name`: employer or affiliation

## Presentation view

### `repository_analysis_view`

This view is the recommended source for Power BI because it:

- removes repeated join logic
- centralizes derived fields
- supports dashboard filtering and export

Derived fields:

- `active_days`: `DATEDIFF(pushed_date, created_date)`
- `impact_level`: rule-based popularity tier from star count
