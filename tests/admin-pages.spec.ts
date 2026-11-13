import { test, expect, openAccountLink } from './auth-utils';

test.slow();
test('test access to admin page', async ({ getUserPage }) => {
  // Call the getUserPage fixture with admin signin info to get authenticated session for admin
  const adminPage = await getUserPage('admin@foo.com', 'changeme');

  await adminPage.goto('http://localhost:3000/');
  await expect(adminPage.getByRole('link', { name: /Bowz Bops/ })).toBeVisible();

  await openAccountLink(adminPage, 'Add Stuff');
  await expect(
    adminPage.getByRole('heading', { name: 'Add Stuff' })
  ).toBeVisible({ timeout: 5000 });

  // Test List Stuff adminPage
  await openAccountLink(adminPage, 'List Stuff');
  await expect(
    adminPage.getByRole('heading', { name: 'Stuff' })
  ).toBeVisible({ timeout: 5000 });

  // Test Admin adminPage
  await openAccountLink(adminPage, 'Admin');
  await expect(
    adminPage.getByRole('heading', { name: 'List Stuff Admin' })
  ).toBeVisible({ timeout: 5000 });
  await expect(
    adminPage.getByRole('heading', { name: 'List Users Admin' })
  ).toBeVisible({ timeout: 5000 });

});