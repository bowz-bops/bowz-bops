import { test, expect, openAccountLink } from './auth-utils';

test.slow();
test('can authenticate a specific user', async ({ getUserPage }) => {

  // Call the getUserPage fixture with users signin info to get authenticated session for user
  const customUserPage = await getUserPage('john@foo.com', 'changeme');

  await customUserPage.goto('http://localhost:3000/');
  await expect(customUserPage.getByRole('link', { name: /Bowz Bops/ })).toBeVisible();

  await openAccountLink(customUserPage, 'Add Stuff');
  await expect(
    customUserPage.getByRole('heading', { name: 'Add Stuff' })
  ).toBeVisible({ timeout: 5000 });

  await openAccountLink(customUserPage, 'List Stuff');
  await expect(
    customUserPage.getByRole('heading', { name: 'Stuff' })
  ).toBeVisible({ timeout: 5000 });

});
