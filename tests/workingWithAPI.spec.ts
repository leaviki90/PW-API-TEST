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
    //intercepting
    await page.route('*/**/api/articles*', async route => {
        const response = await route.fetch()
        const responseBody = await response.json()
        responseBody.articles[0].title = "This is a MOCK test title"  //articles is the name of array from response
        //title is object value
        responseBody.articles[0].description = "This is a MOCK description"
         //description is object value also

       await route.fulfill({
           body: JSON.stringify(responseBody)
       })
   })

    await page.getByText('Global Feed').click()
    await expect(page.locator('.navbar-brand')).toHaveText('conduit');
    await expect(page.locator('app-article-list h1').first()).toContainText('This is a MOCK test title');
    await expect(page.locator('app-article-list p').first()).toContainText('This is a MOCK description');
   
}); 
