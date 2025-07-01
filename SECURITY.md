# Security Policy for Judge4C

## 🎯 Supported Branches & Versions

- **main** — the production-ready and officially released branch.
- **develop** — used for testing and pre-release. Not for production use.
- We only support and patch security issues on `main` and actively-maintained releases.

---

## 🛡️ Reporting a Vulnerability

We appreciate responsible disclosure! Please follow this process:

1. **Submission**
    - Preferably via GitHub’s official vulnerability reporting: **Security → Report a vulnerability**.
    
2. **Report Details**
    - Affected version or commit (e.g., `main` or specific SHA/hash).
    - Clear description and impact assessment.
    - Steps to reproduce, proof-of-concept (PoC), logs/screenshots/use cases.
    - Environment details (OS, dependencies, config, etc.).

3. **Confidentiality**
    - All vulnerability discussions will remain confidential until a fix is released.
    - We respect credit preferences—anonymous reporting is accepted.

---

## 🧭 Response Timeline

| Phase            | Target Timeline         | Description |
|------------------|-------------------------|-------------|
| Acknowledgment   | Within 5 business days  | Confirm receipt and provide a tracking reference. |
| Triage & Patching | Within 14 calendar days | Investigate, assess risk, and provide a fix or mitigation. |
| Public Disclosure | After fix release       | Publish advisory in release notes and/or security bulletin. |

---

## ⚠️ Severity Guidance

We appreciate reports of all severity levels. Example categories:

- **Critical**: Remote code execution, authentication bypass, data exfiltration.
- **High**: Privilege escalation, serious data/information leakage.
- **Medium**: XSS, CSRF, business logic issues.
- **Low**: Minor config weaknesses, non-sensitive information exposure.

---

## 🔐 Security Best Practices

We maintain the following controls and hygiene measures:

- Docker-based sandboxing for isolated C-program execution; resource-limited.
- Recommend TLS (HTTPS) for all network access and secure authentication tokens.
- Strict access controls: only administrators and teachers can perform sensitive operations.
- Dependabot and/or CodeQL for dependency & code scanning.
- GitHub branch protections on both `main` and `develop`, including required reviews, status checks, and no force-push.
- Secret scanning enabled to prevent API key leakage.

---

## 👨‍💻 Secure Development Tips

- Avoid committing secrets: use environment variables and secret management tools.
- Regular dependency updates—automated monthly scans are recommended.
- Enforce 2FA for all contributors to reduce unauthorized access risks.

---

## 📚 References & Resources

- GitHub best practices for security policies
- OWASP Vulnerability Disclosure guidelines
- Coordinated Vulnerability Disclosure in open-source

---

## 🤝 Getting Help & Acknowledgments

- File a confidential GitHub security issue 
- You can also join our community Slack/Discord channel (see README).
- For in-depth cross-project discussions, refer to GitHub Security Lab documentation.

---

## 📜 License

This policy is shared under the **MIT License**—feel free to copy or adapt.

---



Thank you for helping us keep Judge4C secure!  
— The Judge4C Development Team
