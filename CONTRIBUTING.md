
---

# Contributing to Judge4C

Thank you for your interest in contributing to **Judge4C**! We welcome all kinds of contributions, including bug reports, feature requests, code improvements, and documentation.

## 📌 Branching Strategy

* `main`: Stable release branch. **Do not** directly commit to this branch.
* `develop`: Active development happens here. Please branch off from `develop` when working on new features or bug fixes.

## 🧑‍💻 How to Contribute

### 1. Fork the Repository

Click the **Fork** button on the top right of the [GitHub repository](https://github.com/massbug/judge4c), then clone your fork locally:

```bash
git clone https://github.com/YOUR_USERNAME/judge4c.git
cd judge4c
```

### 2. Create a New Branch

Always branch off from `develop`:

```bash
git checkout develop
git pull
git checkout -b feature/your-feature-name
```

Use appropriate naming conventions:

* `feature/xxx` for new features
* `fix/xxx` for bug fixes
* `docs/xxx` for documentation improvements

### 3. Make Your Changes

Follow the project's coding style and structure. Be concise and clear. Add comments where necessary.

### 4. Commit Your Changes

Use clear and descriptive commit messages:

```bash
git add .
git commit -m "fix: correct issue with X"
```

Follow [Conventional Commits](https://www.conventionalcommits.org/) when possible.

### 5. Push and Create a Pull Request

```bash
git push origin feature/your-feature-name
```

Then, go to the original repository and open a **Pull Request** (PR) to merge your changes into the `develop` branch.

Please ensure your PR includes:

* A clear description of your changes
* Reference to any related issues (`Closes #issue-number`)
* Test results (if applicable)

### 6. Code Review and Merge

Your PR will be reviewed by the maintainers. They may suggest changes or improvements. Once approved, your changes will be merged into `develop`, and later into `main` for the next release.

## ✅ Contribution Checklist

Before submitting a PR, please ensure:

* [ ] Code compiles without errors
* [ ] All tests pass (if applicable)
* [ ] Code adheres to the style of the project
* [ ] You've updated or added documentation as needed

## 💬 Need Help?

Open an [Issue](https://github.com/massbug/judge4c/issues) for general questions or discussions.

---

欢迎使用中文参与贡献讨论，但代码与提交信息请保持英文风格，以便国际开发者理解。
