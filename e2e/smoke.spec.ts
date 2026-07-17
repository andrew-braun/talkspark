import { expect, test } from '@playwright/test';

test.describe('TalkSpark smoke', () => {
	test('home page uses the focused stage at desktop and mobile widths', async ({ page }) => {
		for (const viewport of [
			{ width: 390, height: 844 },
			{ width: 1440, height: 1000 },
		]) {
			await page.setViewportSize(viewport);
			await page.goto('/');
			await expect(page.getByRole('heading', { name: 'Let’s Talk' })).toBeVisible();
			await expect(page.getByRole('button', { name: 'Random Sparks' })).toBeVisible();
			await expect(page.getByText('Press a button to generate')).toHaveCount(0);
		}
	});

	test('navigates to saved sparks page', async ({ page }) => {
		await page.goto('/');

		await page.getByRole('link', { name: 'My Sparks' }).click();

		await expect(page).toHaveURL(/\/sparks\/?$/);
		await expect(page.getByRole('heading', { name: 'Sparks' })).toBeVisible();
		await expect(page.getByRole('button', { name: 'More Random Sparks' })).toBeVisible();
	});
});
