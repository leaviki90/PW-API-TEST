import {test, expect, request} from '@playwright/test'

test('Like counter increase', async({page}) => {
    await page.goto('https://conduit.bondaracademy.com/');
    await page.getByText('Global Feed').click()
    const firstLikeBtn = page.locator('app-article-preview').first().locator('button')
    await expect(firstLikeBtn).toContainText('0')
    await firstLikeBtn.click()
    await expect(firstLikeBtn).toContainText(' 1 ')

})