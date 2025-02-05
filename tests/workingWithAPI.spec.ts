import { test, expect, request } from '@playwright/test'
import tags from '../test-data/tags.json';
import exp from 'constants';


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
        await page.waitForTimeout(1000)
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
    
   const articleResponse = await request.post('https://conduit-api.bondaracademy.com/api/articles/', {
      data: {
        "article":{"title":"Hello world 1","description":"Hello world","body":"Hello world","tagList":[]}
      }
    })

    expect(articleResponse.status()).toEqual(201)

    await page.getByText('Global Feed').click()
    await page.getByText('Hello world 1').click()
    await page.getByRole('button', {name: "Delete Article"}).first().click()
    await page.getByText('Global Feed').click()

    await expect(page.locator('app-article-list h1').first()).not.toContainText('Hello world 1');
    
})


test("create article", async ({page, request}) => {
  
    await page.getByText('New Article').click()
    await page.getByRole('textbox', {name: 'Article Title'}).fill('Playwright is awesome')
    await page.getByRole('textbox', {name: "What's this article about?"}).fill('About the Playwright')
    await page.getByRole('textbox', {name: "Write your article (in markdown)"}).fill('We like to use Playwright for automation')
    await page.getByRole('button', {name: 'Publish Article'}).click()

    //here, right after submiting the article, we re doing the intercept
    const articleResponse = await page.waitForResponse('https://conduit-api.bondaracademy.com/api/articles/')

    const articleResponseBody = await articleResponse.json()
    const slugId = articleResponseBody.article.slug
    //then we use this id to delete that article via API 

    await expect(page.locator('.article-page h1')).toContainText('Playwright is awesome');

    await page.getByText('Home').click()
    await page.getByText('Global Feed').click()

    await expect(page.locator('app-article-list h1').first()).toContainText('Playwright is awesome')
 
    const deleteArticleResponse = await request.delete(`https://conduit-api.bondaracademy.com/api/articles/${slugId}`)
    expect(deleteArticleResponse.status()).toEqual(204)
})