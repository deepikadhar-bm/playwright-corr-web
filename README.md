# Lp-Corr 
**Corr Web Application | Playwright Framework**

This repository uses a restricted workflow to ensure code stability. The `main` branch is protected; only the Repository Owner can approve and merge changes.

---

## 🛠 Git Workflow & Branching Strategy

To maintain code quality and tracking, all team members must follow this branching convention. Direct pushes to `main` are restricted.

### 1. Branch Naming Convention
When creating a branch, use the following formats:

| Type | Format | Example |
| :--- | :--- | :--- |
| **New Features** | `feature/feature-name-EmployeeID` | `feature/loan-portal-12345` |
| **Bug Fixes** | `fix/fix-name-EmployeeID` | `fix/login-error-12345` |

---

### 2. Step-by-Step Instructions

#### Step A: Create and Switch to a New Branch
Before starting any work, ensure you are on the latest version of `main`:
```bash
# 1. Switch to main and get latest changes
git checkout main
git pull origin main

# 2. Create and switch to your new branch
git checkout -b feature/your-feature-name-EmployeeID

# 3. Verify new branch creation
git branch

# Executed output
* feature/your-feature-name-EmployeeID
  main
# The asterisk * indicates your current active branch.  

#4. Commit Message StandardsTo keep our project history readable, please follow the Conventional Commits format.
-->Format: type(scope): brief descriptionType
Type|Description
feat|A new feature (corresponds to a feature/ branch)
fix |A bug fix |(corresponds to a fix/ branch)
docs|Changes to documentation only
test|Adding missing tests or correcting existingtests
refactor|A code change that neither fixes a bug nor adds  a feature

#Example
Examples:

feat(loan-creation): add validation for German LO profiles

fix(test-data): resolve missing Encompass_Details error

docs(readme): update branching instructions for team

=====================================================
Full Workflow Summary

Follow this flow for every new task:

Sync: git checkout main && git pull origin main

Branch: git checkout -b feature/login-ui-98765

Work: (Modify code or Playwright tests)

Stage: git add .

Commit: git commit -m "feat(login): implement secure auth redirect"

Push: git push origin feature/login-ui-98765

PR: Open a Pull Request on GitHub. Tag the Repository Owner for approval.

