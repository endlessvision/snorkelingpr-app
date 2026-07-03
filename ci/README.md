# CI workflow

`ci.yml.template` is the GitHub Actions workflow (typecheck + lint + build +
secret scan on push/PR). It lives here instead of `.github/workflows/` because
the initial push was made with a token that lacked the `workflow` scope.

## To activate CI

Pick either option:

1. **Via the GitHub web UI** (no extra permissions needed): open the repo →
   **Add file → Create new file** → name it `.github/workflows/ci.yml` → paste
   the contents of `ci.yml.template` → commit.

2. **From your machine** with a token that has the `workflow` scope: move the
   file into place and push:
   ```bash
   mkdir -p .github/workflows
   git mv ci/ci.yml.template .github/workflows/ci.yml
   git commit -m "ci: enable GitHub Actions workflow"
   git push
   ```

Once the file is under `.github/workflows/`, GitHub Actions runs it automatically.
