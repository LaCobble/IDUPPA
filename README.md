<p align="center"><img src="WEB/public/logo.png" alt="IDUPPA logo" width="120"></p>

# IDUPPA

A privacy-by-design toolkit: pseudonymise personal data in MySQL, control who can access it, and handle GDPR data-subject requests (access, rectification, erasure).

[![CI](https://github.com/LaCobble/IDUPPA/actions/workflows/ci.yml/badge.svg)](https://github.com/LaCobble/IDUPPA/actions/workflows/ci.yml)
![Version](https://img.shields.io/badge/version-1.0.0-blue)
![Python](https://img.shields.io/badge/python-3.11%2B-3776AB?logo=python&logoColor=white)
![Node.js](https://img.shields.io/badge/node-18%2B-339933?logo=nodedotjs&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-8-4479A1?logo=mysql&logoColor=white)
[![License: MIT](https://img.shields.io/badge/license-MIT-green)](LICENSE)

## What it does

IDUPPA separates identifying data from the rest of a client database and exposes it only through controlled channels. It is made of three parts:

| Part | Stack | Role |
| --- | --- | --- |
| [`SCRIPT/`](SCRIPT) | Python, SQLAlchemy, MySQL | SQL scripts that create the client database and the solution databases (users, pseudonymisation, anonymisation, logs, GDPR metadata, access control), and `IDUPPA.py`, which replaces each user's identity with a name drawn from a first-name dictionary and a list of fictitious surnames, and creates time-limited dynamic access-control entries. |
| [`WEB/`](WEB) | Node.js, Express, EJS, MySQL | Admin panel: login, create users, browse the users table, user profile and access logs. |
| [`ConsentManager/`](ConsentManager) | Node.js, Express, MySQL, Eureka | Microservice used to integrate the PRIAM privacy-rights platform with the TeaStore demo shop: data-access, rectification and erasure (right to be forgotten) endpoints, plus Selenium UI tests. See its [README](ConsentManager/README.md). |

[`Questionnaire.md`](Questionnaire.md) is the (French) user evaluation questionnaire written for PRIAM, with one anonymised answer.

## Screenshots

<table>
  <tr>
    <td width="50%"><img src="docs/images/login.webp" alt="Admin panel login"><br><sub>Admin panel login</sub></td>
    <td width="50%"><img src="docs/images/admin-panel.webp" alt="Admin dashboard"><br><sub>Admin dashboard</sub></td>
  </tr>
  <tr>
    <td width="50%"><img src="docs/images/create-user.webp" alt="Create a user"><br><sub>Create a user</sub></td>
    <td width="50%"><img src="docs/images/profile.webp" alt="User profile"><br><sub>User profile</sub></td>
  </tr>
  <tr>
    <td width="50%"><img src="docs/images/users-table.webp" alt="Users table, DevOps role (pseudonymised access level)"><br><sub>Users table, DevOps role (pseudonymised access level)</sub></td>
    <td width="50%"><img src="docs/images/users-table-anon.webp" alt="Same table for a Developer role: only anonymised data is returned"><br><sub>Same table for a Developer role: only anonymised data is returned</sub></td>
  </tr>
  <tr>
    <td width="50%"><img src="docs/images/consent-button.webp" alt=""Privacy Rights" button added to TeaStore (ConsentManager)"><br><sub>"Privacy Rights" button added to TeaStore (ConsentManager)</sub></td>
  </tr>
</table>

<sub>Captured with headless Chrome (October 2026) from a local run of `WEB/` on a throwaway MySQL database built with the repository's SQL scripts and their fictitious test users; the consent button is `ConsentManager/html/button.html`. The interface is in French.</sub>

## Prerequisites

- MySQL 8 (or MariaDB)
- Python 3.11 or later and pip
- Node.js 18 or later (the CI uses Node 20) and npm

## Getting started

```bash
git clone https://github.com/LaCobble/IDUPPA.git
cd IDUPPA
```

1. **Databases**: run `SCRIPT/StartClient/createDB.sql` (client database), then `SCRIPT/StartSolution/createDBs.sql` (solution databases) and `SCRIPT/StartSolution/createDATA.sql` (test data). `SCRIPT/StartSolution/db_config.cnf.ini` is a sample MySQL client configuration: replace its placeholder password with your own.
2. **Pseudonymisation script**
   ```bash
   cd SCRIPT
   pip install -r requirements.txt
   cp .env.example .env          # set the three DATABASE_URL_* variables
   python StartSolution/IDUPPA.py
   ```
3. **Admin panel**
   ```bash
   cd WEB
   npm ci
   cp .env.example .env          # set DB_* and COOKIE_SECRET
   npm start                     # http://localhost:3000
   ```
4. **ConsentManager**: see [ConsentManager/README.md](ConsentManager/README.md); its environment variables are listed in `ConsentManager/.env.example`. It needs the TeaStore / PRIAM stack (MySQL, Eureka) to run.

Every `.env.example` contains placeholders only; never commit a real `.env`.

## Tests

The CI installs the dependencies, checks the JavaScript syntax of `WEB/` and `ConsentManager/`, byte-compiles all Python files and scans for secrets. The Selenium tests in `ConsentManager/tests/` require the running TeaStore stack and are not run in CI.

## Project structure

```
IDUPPA/
├── SCRIPT/
│   ├── DATA/                 # first-name dictionary and fictitious surnames used for pseudonymisation
│   ├── StartClient/          # client database schema
│   ├── StartSolution/        # solution schemas, test data, IDUPPA.py
│   └── requirements.txt
├── WEB/                      # Express + EJS admin panel (server.js, pages, styles)
├── ConsentManager/           # PRIAM / TeaStore consent microservice and Selenium tests
└── Questionnaire.md          # PRIAM user evaluation questionnaire (French)
```

## What it demonstrates

- Database design that isolates personal data (pseudonymisation, anonymisation, access logs, access policies).
- Data processing with SQLAlchemy across several MySQL databases.
- GDPR data-subject rights exposed as REST endpoints in a microservice architecture (service discovery with Eureka; a sample Keycloak client configuration is in `ConsentManager/exampleKeyCLOAK.txt`).
- UI testing with Selenium.

## Known limitations

This is a school prototype, not production software: the admin panel compares passwords in plain text, the pseudonymisation draws random names without guaranteeing uniqueness, and `ConsentManager` has no committed `package.json`.

Verified in October 2026 against a fresh MySQL 9 database:

- `createDBs.sql` inserts a row referencing user 1 before `createDATA.sql` creates the users, so the first run stops at that insert; running `createDBs.sql` again with `mysql --force` after `createDATA.sql` completes the setup.
- `StartSolution/IDUPPA.py` does not run as committed: `Date` is missing from the SQLAlchemy import, and the model maps a `sex` column while the schema defines `sexe`. It also needs SQLAlchemy 2.0.18 on Python 3.11 or 3.12 (that version does not import on Python 3.14).

## Context

School project on data protection and the GDPR, November 2024 to February 2025. Kept as a portfolio piece; no longer actively developed.

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) and the [Code of Conduct](CODE_OF_CONDUCT.md). Security issues: [SECURITY.md](SECURITY.md).

## License

[MIT](LICENSE) © LaCobble.
