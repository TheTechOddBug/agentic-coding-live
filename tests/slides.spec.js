const { test, expect } = require('@playwright/test');
const path = require('path');

const deckPath = 'file://' + path.resolve(__dirname, '../unbounded_contexts_slides/unbounded_contexts_slides.html');

test.describe('existing deck behavior (baseline, pre-presenter-mode)', () => {
  test('loads on the first slide and shows nav buttons', async ({ page }) => {
    await page.goto(deckPath);
    await expect(page.locator('.slide.active')).toHaveCount(1);
    await expect(page.locator('#nav button', { hasText: 'prev' })).toBeVisible();
    await expect(page.locator('#nav button', { hasText: 'next' })).toBeVisible();
  });

  test('arrow keys navigate slides', async ({ page }) => {
    await page.goto(deckPath);
    const counter = page.locator('#counter');
    await expect(counter).toHaveText('1 / ' + await page.locator('.slide').count());
    await page.keyboard.press('ArrowRight');
    await expect(counter).toHaveText('2 / ' + await page.locator('.slide').count());
    await page.keyboard.press('ArrowLeft');
    await expect(counter).toHaveText('1 / ' + await page.locator('.slide').count());
  });

  test('N key toggles the notes panel', async ({ page }) => {
    await page.goto(deckPath);
    await expect(page.locator('body')).not.toHaveClass(/notes-visible/);
    await page.keyboard.press('n');
    await expect(page.locator('body')).toHaveClass(/notes-visible/);
    await page.keyboard.press('n');
    await expect(page.locator('body')).not.toHaveClass(/notes-visible/);
  });
});
