# Branches

```
your-branch ──PR──► dev (staging) ──PR──► main (production)
```

- **main** is production. It changes only by merging a PR from `dev`. Never push to it or open a
  PR into it from any other branch.
- **dev** is staging: everything is merged and checked there before it ships. It changes only by
  merging a PR, except for catching up with `main` after a release.
- **Your work** goes on its own branch from `dev` (`feature/...`, `fix/...`), and merges into
  `dev` by PR. Hotfixes take the same path, just quickly.
- **Releasing** is merging the PR from `dev` into `main`. Afterwards, catch `dev` up:
  `git fetch origin && git push origin origin/main:refs/heads/dev`.

GitHub's free plan can't enforce these rules, so two things help:

- `.githooks/pre-push` refuses pushes to `main`, and pushes to `dev` other than catching up with
  `main`. Turn it on once per clone: `git config core.hooksPath .githooks`
- The **Main only from dev** check (`.github/workflows/main-from-dev.yml`) fails on any PR into
  `main` that isn't from `dev`. Don't merge a PR with that check red.
