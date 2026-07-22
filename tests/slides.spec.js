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

test.describe('audience/presenter mode toggle (P key)', () => {
  test('P hides all chrome: nav buttons, counter, notes button, and slide timer', async ({ page }) => {
    await page.goto(deckPath);
    await expect(page.locator('#nav')).toBeVisible();
    await expect(page.locator('#slide-time')).toBeVisible();

    await page.keyboard.press('p');

    await expect(page.locator('#nav')).toBeHidden();
    await expect(page.locator('#slide-time')).toBeHidden();
    await expect(page.locator('#nav button', { hasText: 'prev' })).toBeHidden();
    await expect(page.locator('#nav button', { hasText: 'next' })).toBeHidden();
    await expect(page.locator('#notes-btn')).toBeHidden();
    await expect(page.locator('#counter')).toBeHidden();

    await page.keyboard.press('p');
    await expect(page.locator('#nav')).toBeVisible();
    await expect(page.locator('#slide-time')).toBeVisible();
  });

  test('navigation keys still work while chrome is hidden', async ({ page }) => {
    await page.goto(deckPath);
    const slideCount = await page.locator('.slide').count();
    const counter = page.locator('#counter');

    await page.keyboard.press('p');
    await expect(page.locator('#nav')).toBeHidden();

    await page.keyboard.press('ArrowRight');
    await page.keyboard.press('p');

    await expect(counter).toHaveText('2 / ' + slideCount);
  });

  test('N still toggles the notes panel while chrome is hidden', async ({ page }) => {
    await page.goto(deckPath);
    await page.keyboard.press('p');
    await expect(page.locator('body')).not.toHaveClass(/notes-visible/);

    await page.keyboard.press('n');
    await expect(page.locator('body')).toHaveClass(/notes-visible/);

    await page.keyboard.press('n');
    await expect(page.locator('body')).not.toHaveClass(/notes-visible/);
  });
});
