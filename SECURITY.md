# Security Policy

## Reporting a Vulnerability

If you discover a security vulnerability in this project, please report it responsibly:

### GitHub Security Advisory (Recommended)
Create a private security advisory: https://github.com/Maximus-Technologies-Uganda/training-prince/security/advisories/new

### Email Notification
Or email the maintainers with vulnerability details.

**Please do not open public issues for security vulnerabilities.**

## Responsible Disclosure Guidelines

We commit to:
1. **Acknowledge**: Respond to reports within 48 hours
2. **Assess**: Evaluate vulnerability severity and impact
3. **Fix**: Provide patches within 30 days or public disclosure timeline
4. **Coordinate**: Work with reporter on responsible disclosure timeline

## Vulnerability Details to Include

When reporting, please provide:
- **Description**: What is the vulnerability?
- **Affected Version**: Which version(s) are impacted?
- **Reproduction Steps**: How can we reproduce it?
- **Impact**: What are the potential consequences?
- **Suggested Fix**: Do you have a suggested mitigation?

## Supported Versions

| Version | Support Status | Security Updates |
|---------|----------------|------------------|
| Latest  | ✅ Full        | Yes              |
| N-1     | ⚠️  Limited    | Critical only    |
| Older   | ❌ None        | No               |

## Security Considerations

This project enforces:
- **Code Quality**: Mandatory coverage thresholds (API 70%, UI 55%)
- **Static Analysis**: CodeQL scanning on all pushes
- **Dependency Security**: Dependency review on all PRs
- **Accessibility**: Automated accessibility checks with ally-check

## Third-Party Dependencies

We use:
- **Testing**: Vitest v3.2.4, Playwright v1.48.2
- **CI/CD**: GitHub Actions
- **Accessibility**: axe-core for automated scanning
- **Documentation**: Redoc for API documentation

Monitor GitHub's dependency alerts for security updates.

## Questions?

For security policy questions, contact the project maintainers through a private security advisory.

---

**Last Updated**: 2025-11-18  
**Next Review**: 2025-12-18
