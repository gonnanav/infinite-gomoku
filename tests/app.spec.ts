import { test, expect } from '@playwright/test';

test('places a black stone on the clicked intersection', async ({ page }) => {
  await page.goto('/');

  const intersection = page.getByTestId('intersection-7-7');
  await expect(intersection).toHaveText('empty');

  await intersection.hover();
  await intersection.click();

  await expect(intersection).toHaveText('black');
});
