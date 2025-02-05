import { test as setup } from '@playwright/test'

//where to save path to auth state
const authFile = '.auth/user.json'

setup('authentication', async ({ page }) => {
    await page.goto('https://conduit.bondaracademy.com/');

    // Wait briefly to ensure elements are loaded
    //await page.waitForTimeout(500);
    await page.getByText('Sign in').click()
    await page.getByRole('textbox', { name: "Email" }).fill('lekizmaj@test.com')
    await page.getByRole('textbox', { name: "Password" }).fill('welcome123')
    await page.getByRole('button').click()

    //za svaki slucaj, da se uverimo da se stranica ucitala
    await page.waitForResponse('https://conduit-api.bondaracademy.com/api/tags')

    //saving the log state
    await page.context().storageState({path: authFile})
})