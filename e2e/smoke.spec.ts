import { expect, test } from '@playwright/test';

test.describe('TalkSpark smoke', () => {
	test('home page shows the main prompt', async ({ page }) => {
		await page.goto('/');

		await expect(page.getByRole('heading', { name: 'Spark a Conversation!' })).toBeVisible();
		await expect(page.getByRole('button', { name: 'Random Sparks' })).toBeVisible();
	});

	test('navigates to saved sparks page', async ({ page }) => {
		await page.goto('/');

		await page.getByRole('link', { name: 'My Sparks' }).click();

		await expect(page).toHaveURL(/\/sparks\/?$/);
		await expect(page.getByRole('heading', { name: 'Sparks' })).toBeVisible();
		await expect(page.getByRole('button', { name: 'More Random Sparks' })).toBeVisible();
	});
});
