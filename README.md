# Playwright E2E Framework

End-to-end tests for the [Tricentis Demo Web Shop](https://demowebshop.tricentis.com/), written in TypeScript with [Playwright](https://playwright.dev/) and the Page Object Model.

The suite covers the core shopping flow (add to cart, change quantity, checkout) plus a negative checkout case and session persistence, and runs on Chromium, Firefox and WebKit locally and in GitHub Actions.

## Test scenarios

| Spec | What it checks |
| --- | --- |
| `happy-path.spec.ts` | A logged-in user adds Blue Jeans to the cart and completes the full checkout (billing → shipping → shipping method → payment → confirm). |
| `checkout-negative.spec.ts` | Submitting a new billing address with required fields empty blocks checkout and shows "Zip / postal code is required". |
| `cart-modification.spec.ts` | Changing an item's quantity in the cart updates the subtotal. |
| `session-persistence.spec.ts` | Items added to the cart are still there after logging out and back in (cart is stored server-side). |

## Project structure

```
.
├── pages/                    # Page objects: locators + actions for each page
│   ├── HomePage.ts
│   ├── LoginPage.ts
│   ├── CartPage.ts
│   └── CheckoutPage.ts
├── tests/
│   ├── auth.setup.ts         # Logs in once and saves the session
│   └── *.spec.ts             # Test scenarios
├── playwright.config.ts
└── .github/workflows/playwright.yml
```

## How it works

**Login once, reuse the session.** The `setup` project runs `auth.setup.ts`, which logs in and saves cookies to `playwright/.auth/user.json`. The browser projects depend on `setup` and start every test from that saved state, so tests don't repeat the login steps.

**Each test starts with an empty cart.** All tests use the same demo account, which has a single server-side cart. A `beforeEach` hook calls `CartPage.clearCart()` so leftovers from earlier runs or other tests can't change prices or item counts.

**Tests run one at a time.** Because the account and cart are shared, running tests in parallel would let one test empty or modify another's cart mid-run. `playwright.config.ts` sets `fullyParallel: false` and `workers: 1` for this reason. To run in parallel, give each worker its own account.

## Getting started

Requirements: Node.js 18 or later.

```bash
git clone https://github.com/yongkkim/playwright-e2e-framework.git
cd playwright-e2e-framework
npm ci
npx playwright install --with-deps
```

## Running tests

| Command | Description |
| --- | --- |
| `npm test` | Run all tests on Chromium, Firefox and WebKit |
| `npm run test:chromium` | Run on Chromium only (fastest) |
| `npm run test:headed` | Run on Chromium with a visible browser |
| `npm run test:ui` | Open Playwright's interactive UI mode |
| `npm run report` | Open the HTML report from the last run |
| `npm run typecheck` | Type-check the project with `tsc` |

To run one spec: `npx playwright test tests/happy-path.spec.ts --project=chromium`

## Continuous integration

`.github/workflows/playwright.yml` runs the full suite on every push and pull request to `main`. Failed tests are retried up to twice on CI, failures and flaky tests are shown as annotations on the run, and the HTML report is uploaded as the `playwright-report` artifact (kept for 30 days).

## Notes

- Tests run against a public demo site, so they need internet access and can fail if the site is slow or down.
- The test account credentials in `auth.setup.ts` are for the public demo site only.
- The happy-path test places a real (demo) order each time it runs.
