# Changelog

All notable changes to this project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- Portfolio README, MIT license, contributing guide, code of conduct and security policy.
- GitHub CI (Linux checks), release workflow, issue and PR templates, Dependabot.

## [1.0.0] - 2025-02-14

### Added

- SQL scripts creating the client database and the solution databases (users, pseudonymisation, anonymisation, logs, GDPR metadata, access control).
- Python pseudonymisation script (SQLAlchemy) replacing identities with names drawn from French name dictionaries, and creating dynamic access-control entries.
- Express + EJS admin panel: login, user creation, users table, user profile and access logs.
- ConsentManager: Node.js microservice exposing data-access, rectification and erasure (right to be forgotten) endpoints for the PRIAM / TeaStore integration, with Selenium UI tests.
- User evaluation questionnaire for PRIAM.

[Unreleased]: https://github.com/LaCobble/IDUPPA/compare/v1.0.0...HEAD
[1.0.0]: https://github.com/LaCobble/IDUPPA/releases/tag/v1.0.0
