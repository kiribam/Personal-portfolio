# Git workflow

This repository follows **GitHub Flow**: `main` is always deployable, and work happens on short-lived **feature branches** merged via **pull requests**.

## Branch naming

Use lowercase with slashes:

| Prefix        | Use for                          | Example                      |
| ------------- | -------------------------------- | ---------------------------- |
| `feature/`    | New pages, UI, or behavior       | `feature/project-case-study` |
| `fix/`        | Bug fixes                        | `fix/nav-focus-styles`       |
| `chore/`      | Tooling, deps, docs-only changes | `chore/bump-astro`           |
| `docs/`       | Documentation-only               | `docs/deploy-gcp-notes`      |

## Typical flow

1. `git checkout main && git pull`
2. `git checkout -b feature/your-change`
3. Commit in small, logical chunks with [Conventional Commits](https://www.conventionalcommits.org/) if you like (`feat:`, `fix:`, `chore:`).
4. Push and open a **pull request** into `main`.
5. Wait for **CI** (build) to pass; request review if working with others.
6. Merge (squash merge keeps history tidy for solo work).

## Branch protection (GitHub)

In **Settings → Branches → Branch protection rules** for `main`, consider:

- Require a pull request before merging.
- Require status checks to pass (e.g. the **CI** workflow).
- Optionally: require linear history or restrict who can push.

This is optional for personal repos but matches common industry practice for anything public-facing.
