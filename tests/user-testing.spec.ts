import { test } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('http://localhost:3000');
  await page.getByRole('button', { name: 'Get Started' }).click();
  await page.locator('#loginDropdown').click();
  await page.getByRole('link', { name: 'Sign in' }).click();
  await page.getByPlaceholder('Enter your email').click();
  await page
    .getByPlaceholder('Enter your email')
    .fill('lionelroxas80@gmail.com');
  await page.getByPlaceholder('Enter your password').click();
  await page.getByPlaceholder('Enter your password').fill('100102');
  await page.getByRole('button', { name: 'Sign in' }).click();
  await page.goto('http://localhost:3000/home');
});
