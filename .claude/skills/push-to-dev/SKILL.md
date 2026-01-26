---
name: push-to-dev
description: Workflow to commit local changes and push to the remote dev branch.
---

# Push to Dev Workflow

1. **Check Status**

   ```bash
   git status
   ```

2. **Add Changes**

   ```bash
   git add .
   ```

3. **Commit**
   - Prompt the user for a commit message if one hasn't been provided.

   ```bash
   git commit -m "Your commit message here"
   ```

4. **Push to Remote**

   ```bash
   git push origin dev
   ```
