import { test as base, expect, Page } from '@playwright/test';

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Base configuration
const BASE_URL = process.env.PLAYWRIGHT_TEST_BASE_URL || 'http://localhost:3000';
const SESSION_STORAGE_PATH = path.join(__dirname, 'playwright-auth-sessions');

// Ensure session directory exists
if (!fs.existsSync(SESSION_STORAGE_PATH)) {
  fs.mkdirSync(SESSION_STORAGE_PATH, { recursive: true });
}

// Define our custom fixtures
interface AuthFixtures {
  getUserPage: (email: string, password: string) => Promise<Page>;
}
/**
 * Authenticate using the UI with robust waiting and error handling
 */
async function authenticateWithUI(
  page: Page,
  email: string,
  password: string,
  sessionName: string
): Promise<void> {
  const sessionPath = path.join(SESSION_STORAGE_PATH, `${sessionName}.json`);

  // Try to restore session from storage if available
  if (fs.existsSync(sessionPath)) {
    try {
      const sessionData = JSON.parse(fs.readFileSync(sessionPath, 'utf8'));
      await page.context().addCookies(sessionData.cookies);

      // Navigate to homepage to verify session
      await page.goto(BASE_URL);
      await page.waitForLoadState('networkidle');

      await expectSignedIn(page);
      console.log(`✓ Restored session for ${email}`);
      return;
    } catch (error) {
      console.log(`× Error restoring session: ${error}`);
    }
  }

  // If session restoration fails, authenticate via UI
  try {
    console.log(`→ Authenticating ${email} via UI...`);

    // Navigate to login page
    await page.goto(`${BASE_URL}/auth/signin`);
    await page.waitForLoadState('networkidle');

    // Fill in credentials with retry logic
    await fillFormWithRetry(page, [
      { selector: 'input[name="email"]', value: email },
      { selector: 'input[name="password"]', value: password },
    ]);

    // Scope the submit button to the form because the navbar has its own Sign In button.
    await page.locator('form').getByRole('button', { name: /^sign[ -]?in$/i }).click();
    await expectSignedIn(page);

    // Save session for future tests
    const cookies = await page.context().cookies();
    fs.writeFileSync(sessionPath, JSON.stringify({ cookies }));
    console.log(`✓ Successfully authenticated ${email} and saved session`);
  } catch (error) {
    console.error(`× Authentication failed for ${email}:`, error);

    throw new Error(`Authentication failed: ${error}`);
  }
}

async function expectSignedIn(page: Page): Promise<void> {
  const accountMenu = page.locator('#login-dropdown');
  await expect(accountMenu).toBeVisible({ timeout: 10000 });
  await expect(accountMenu).not.toHaveText(/^\s*sign in\s*$/i, { timeout: 10000 });
  await accountMenu.click();
  await expect(page.getByRole('link', { name: 'Sign Out', exact: true })).toBeVisible();
  await accountMenu.click();
}

export async function openAccountLink(page: Page, name: string): Promise<void> {
  await page.locator('#login-dropdown').click();
  await page.getByRole('link', { name, exact: true }).click();
}

/**
 * Helper to fill form fields with retry logic
 */
async function fillFormWithRetry(
  page: Page,
  fields: Array<{ selector: string; value: string }>
): Promise<void> {
  for (const field of fields) {
    let attempts = 0;
    const maxAttempts = 3;

    while (attempts < maxAttempts) {
      try {
        const element = page.locator(field.selector);
        await element.waitFor({ state: 'visible', timeout: 2000 });
        await element.clear();
        await element.fill(field.value);
        await element.evaluate((el) => el.blur()); // Trigger blur event
        break;
      } catch {
        attempts++;
        if (attempts >= maxAttempts) {
          throw new Error(`Failed to fill field ${field.selector} after ${maxAttempts} attempts`);
        }
        await page.waitForTimeout(500);
      }
    }
  }
}

// Create custom test with authenticated fixtures
export const test = base.extend<AuthFixtures>({
  getUserPage: async ({ browser }, fixtureCallback) => {
    const createUserPage = async (email: string, password: string) => {
      const context = await browser.newContext();
      const page = await context.newPage();

      await authenticateWithUI(page, email, password, `session-${email}`);
      return page;
    };

    await fixtureCallback(createUserPage);
  },
});

export { expect } from '@playwright/test';
