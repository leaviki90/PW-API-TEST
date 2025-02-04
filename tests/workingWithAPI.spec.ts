import { test, expect } from '@playwright/test';
import tags from '../test-data/tags.json';

// Before each test, set up the environment
// This includes mocking API responses and navigating to the test page

test.beforeEach(async ({ page }) => {
    // Mock the API response for the tags endpoint
    await page.route('*/**/api/tags', async route => {
        await route.fulfill({
            body: JSON.stringify(tags) // Respond with predefined tags from JSON file
        });
    });

    // Navigate to the test site
    await page.goto('https://conduit.bondaracademy.com/');
    
    // Wait briefly to ensure elements are loaded
    await page.waitForTimeout(500);
});

// Test case: Verify that the title in the navbar is correct
test('has title', async ({ page }) => {
    await expect(page.locator('.navbar-brand')).toHaveText('conduit');
});
