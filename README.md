# SauceDemo E2E Test Automation

[![CI](https://github.com/yourusername/saucedemo-playwright/actions/workflows/ci.yml/badge.svg)](https://github.com/yourusername/saucedemo-playwright/actions)

End-to-end test automation framework for SauceDemo using Playwright.

## Features

- Cross-browser testing (Chrome, Firefox)
- Page Object Model (POM) design pattern
- CI/CD with GitHub Actions
- Comprehensive test coverage of critical user flows

## Prerequisites

- Node.js 14+
- npm or yarn

## Installation

```bash
git clone [https://github.com/ashakiranjyoti/saucedemo-playwright.git](https://github.com/ashakiranjyoti/saucedemo-playwright.git)
cd saucedemo-playwright
npm install

Running Tests
Run all tests:
npx playwright test

Run specific browser:

bash
npx playwright test --project=chromium
# or
npx playwright test --project=firefox

Test Structure
tests/ - Contains all test files
pages/ - Page object models
data/ - Test data files
CI/CD
Tests run automatically on push and pull requests via GitHub Actions.
