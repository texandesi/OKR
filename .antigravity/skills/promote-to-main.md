---
name: promote-to-main
description: Workflow to promote changes from dev to main via a self-approved PR.
---

# Promote to Main Workflow

1. **Ensure on Dev**

   ```bash
   git checkout dev
   git pull origin dev
   ```

2. **Create PR**
   - Create a Pull Request targeting `main` with title "Promote dev to main" and body "Automated promotion".

   ```bash
   gh pr create --base main --head dev --title "Promote dev to main" --body "Automated promotion"
   ```

3. **Auto-Merge PR**
   - Approve and merge the PR immediately.

   ```bash
   gh pr merge --auto --merge
   ```

4. **Sync Main**

   ```bash
   git checkout main
   git pull origin main
   ```

5. **Push Main (Verify)**

   ```bash
   git push origin main
   ```

6. **Return to Dev**

   ```bash
   git checkout dev
   ```
