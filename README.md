# 🎭 SauceDemo Playwright Automation Framework

![Playwright](https://img.shields.io/badge/Playwright-2EAD33?style=for-the-badge&logo=playwright&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![GitHub Actions](https://img.shields.io/badge/GitHub_Actions-2088FF?style=for-the-badge&logo=github-actions&logoColor=white)
![POM](https://img.shields.io/badge/Pattern-Page_Object_Model-blueviolet?style=for-the-badge)
![Allure](https://img.shields.io/badge/Allure-Report-orange?style=for-the-badge)
![License](https://img.shields.io/badge/License-ISC-blue?style=for-the-badge)
![CI](https://img.shields.io/github/actions/workflow/status/YOUR_USERNAME/YOUR_REPO/playwright.yml?style=for-the-badge&label=CI&logo=github)

---

A comprehensive, production-ready **end-to-end test automation framework** for the [SauceDemo](https://www.saucedemo.com) e-commerce website — built with Playwright and JavaScript, following the **Page Object Model (POM)** design pattern.

---

## 📑 Table of Contents

- [Overview](#-overview)
- [Test Coverage](#-test-coverage)
- [Project Structure](#-project-structure)
- [Tech Stack](#-tech-stack)
- [Getting Started](#-getting-started)
- [Running Tests](#-running-tests)
- [Test Reports](#-test-reports)
- [CI/CD with GitHub Actions](#-cicd-with-github-actions)
- [Configuration](#-configuration)
- [Cross-Browser Testing](#-cross-browser-testing)
- [Key Features](#-key-features)
- [Debugging](#-debugging)
- [Best Practices](#-best-practices-implemented)
- [Contributing](#-contributing)

---

## 🚀 Overview

This framework covers the **complete user journey** on SauceDemo — from authentication to checkout — with a clean architecture designed for maintainability, scalability, and readability. Every layer is decoupled: test logic lives in specs, page interactions live in page objects, and test data is externalized.

---

## 📋 Test Coverage

| Area | Description |
|------|-------------|
| 🔐 **Authentication** | Valid/invalid login, locked user, error messages |
| 🛍️ **Product Management** | Browsing, sorting (name/price), adding to cart |
| 🛒 **Shopping Cart** | Add/remove items, price validation, cart persistence |
| ✅ **Checkout** | Full checkout flow, form validation, order confirmation |
| 🌐 **API Testing** | Backend endpoint validation |

---

## 🏗️ Project Structure

```
saucedemo-playwright/
├── .github/
│   └── workflows/
│       └── playwright.yml       # GitHub Actions CI workflow
├── data/
│   └── users.json               # Test user configurations
├── pages/
│   ├── loginPage.js             # Login page interactions
│   ├── ProductsPage.js          # Products page interactions
│   ├── inventoryPage.js         # Inventory management
│   ├── CartPage.js              # Shopping cart functionality
│   └── CheckoutPage.js          # Checkout process handling
├── tests/
│   ├── login.spec.js            # Authentication tests
│   ├── products.spec.js         # Product browsing tests
│   ├── cart.spec.js             # Cart management tests
│   ├── checkout.spec.js         # Checkout flow tests
│   └── api.spec.js              # API endpoint tests
├── playwright.config.ts         # Playwright configuration
├── package.json                 # Project dependencies
└── README.md
```

---

## 🛠️ Tech Stack

| Tool | Purpose |
|------|---------|
| [Playwright](https://playwright.dev/) | End-to-end testing framework |
| JavaScript | Test implementation language |
| Node.js | Runtime environment |
| [Allure](https://allurereport.org/) | Advanced test reporting |
| GitHub Actions | CI/CD pipeline |

---

## 📦 Dependencies

```json
"@playwright/test"    → Core testing framework
"@types/node"         → TypeScript definitions for Node.js
"allure-playwright"   → Allure reporting integration
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** v14 or higher
- **npm** or **yarn**

### Installation

```bash
# 1. Clone the repository
git clone <>
cd saucedemo-playwright

# 2. Install dependencies
npm install

# 3. Install Playwright browsers
npx playwright install
```

---

## ▶️ Running Tests

```bash
# Run all tests
npx playwright test

# Run a specific test file
npx playwright test tests/login.spec.js
npx playwright test tests/checkout.spec.js

# Run on a specific browser
npx playwright test --project=chromium
npx playwright test --project=firefox
npx playwright test --project=webkit

# Run in headed (visible browser) mode
npx playwright test --headed

# Run tests matching a keyword
npx playwright test --grep "Login"

# Run in debug mode
npx playwright test --debug
```

---

## 📊 Test Reports

### HTML Report *(built-in)*
```bash
npx playwright show-report
```

### Allure Report
```bash
# Generate report
allure generate allure-results --clean -o allure-report

# Open in browser
allure open allure-report
```

### JSON Report
Results are automatically saved to `results.json` for CI/CD integration.

---

## ⚙️ CI/CD with GitHub Actions

This framework includes a **GitHub Actions** workflow that runs the full test suite on every push and pull request.

```yaml
# .github/workflows/playwright.yml
name: Playwright Tests
on:
  push:
    branches: [main, master]
  pull_request:
    branches: [main, master]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18
      - name: Install dependencies
        run: npm ci
      - name: Install Playwright Browsers
        run: npx playwright install --with-deps
      - name: Run Playwright tests
        run: npx playwright test
      - uses: actions/upload-artifact@v3
        if: always()
        with:
          name: playwright-report
          path: playwright-report/
          retention-days: 30
```

> ✅ The green badge at the top reflects the **live CI status** from GitHub Actions.

---

## 🔧 Configuration

`playwright.config.ts` controls the full test setup:

| Option | Value |
|--------|-------|
| Base URL | `https://www.saucedemo.com` |
| Browsers | Chromium, Firefox, WebKit |
| Parallel Execution | ✅ Enabled |
| Retry on CI | ✅ Configured |
| Screenshots | On failure |
| Videos | On failure |
| Traces | On first retry |

---

## 🌐 Cross-Browser Testing

| Browser | Status |
|---------|--------|
| Chromium (Chrome/Edge) | ✅ Supported |
| Firefox | ✅ Supported |
| WebKit (Safari) | ✅ Supported |
| Mobile (emulated) | 🔧 Configurable in `playwright.config.ts` |

---

## 🎯 Key Features

### 📐 Page Object Model (POM)
Clean separation between test logic and UI interactions — page classes expose readable methods, keeping specs concise and maintainable.

### 📂 Data-Driven Testing
Test data is managed externally via `data/users.json`, supporting multiple user types and configurable scenarios without touching test code.

### 📈 Comprehensive Reporting
Multiple report formats (HTML, JSON, JUnit, Allure) with screenshots and video evidence attached automatically on failure.

### 🔁 CI/CD Ready
Fully integrated with GitHub Actions — optimized for fast parallel execution with standardized artifact output for any downstream pipeline.

---

## 🔍 Debugging

```bash
# Step-through debugger
npx playwright test --debug

# Inspect a recorded trace
npx playwright show-trace trace.zip

# Generate test code interactively
npx playwright codegen https://www.saucedemo.com
```

---

## ✅ Best Practices Implemented

- **Modular Architecture** — clear separation of concerns across layers
- **Reusable Page Objects** — DRY interactions shared across test files
- **Externalized Test Data** — no hardcoded values in specs
- **Comprehensive Assertions** — every test validates meaningful outcomes
- **Error Handling** — robust failure management with visual evidence
- **CI Integration** — green pipeline with artifact uploads on every run
- **Documentation** — clear code comments and structured README

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/my-feature`
3. Add tests or improvements
4. Ensure all tests pass: `npx playwright test`
5. Submit a pull request

---

<img width="1650" height="1063" alt="FireShot Capture 001 - Allure Report -  127 0 0 1" src="https://github.com/user-attachments/assets/6c2b8009-2c00-4718-9b83-5de8fbc4ac39" />


## 📄 License

This project is licensed under the **ISC License**.

---

> **Happy Testing! 🎭**
