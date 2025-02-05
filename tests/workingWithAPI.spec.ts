import { test, expect, request } from '@playwright/test'
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

    await page.getByText('Sign in').click()
    await page.getByRole('textbox', {name: "Email"}).fill('lekizmaj@test.com')
    await page.getByRole('textbox', {name: "Password"}).fill('welcome123')
    await page.getByRole('button').click()

});

// Test case: Verify that the title in the navbar is correct
test('has title', async ({ page }) => {

    //intercepting
    await page.route('*/**/api/articles*', async route => {
        const response = await route.fetch()
        await page.waitForTimeout(500)
        const responseBody = await response.json()
        responseBody.articles[0].title = "This is a MOCK test title"  //articles is the name of array from response
        //title is object value
        responseBody.articles[0].description = "This is a MOCK description"
        //description is object value also

        await route.fulfill({
            body: JSON.stringify(responseBody)
        })
    })

   
    await page.goto('https://conduit.bondaracademy.com'); 
    await page.getByText('Global Feed').click()
    await expect(page.locator('.navbar-brand')).toHaveText('conduit');
    await expect(page.locator('app-article-list h1').first()).toContainText('This is a MOCK test title');
    await expect(page.locator('app-article-list p').first()).toContainText('This is a MOCK description');
    
}); 


test("delete article", async ({page, request}) => {
    const response = await request.post('https://conduit-api.bondaracademy.com/api/users/login', {
        data: {
            "user":{"email":"lekizmaj@test.com","password":"welcome123"}
        }
    })
   

    const responseBody = await response.json()
    const accessToken = responseBody.user.token
  
    
   const articleResponse = await request.post('https://conduit-api.bondaracademy.com/api/articles/', {
      data: {
        "article":{"title":"Hello world 1","description":"Hello world","body":"Hello world","tagList":[]}
      },
      headers: {
        Authorization: `Token ${accessToken}` 
      }
    })

    expect(articleResponse.status()).toEqual(201)

    await page.getByText('Global Feed').click()
    await page.getByText('Hello world 1').click()
    await page.getByRole('button', {name: "Delete Article"}).first().click()
    await page.getByText('Global Feed').click()

    await expect(page.locator('app-article-list h1').first()).not.toContainText('Hello world 1');
    
})
