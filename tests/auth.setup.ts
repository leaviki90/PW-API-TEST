import { test as setup } from '@playwright/test'
import user from '../.auth/user.json'
import fs from 'fs'  //build in library for files
//where to save path to auth state
const authFile = '.auth/user.json'

setup('authentication', async ({ page , request}) => {
    // await page.goto('https://conduit.bondaracademy.com/');

    // // Wait briefly to ensure elements are loaded
    // //await page.waitForTimeout(500);
    // await page.getByText('Sign in').click()
    // await page.getByRole('textbox', { name: "Email" }).fill('lekizmaj@test.com')
    // await page.getByRole('textbox', { name: "Password" }).fill('welcome123')
    // await page.getByRole('button').click()

    // //za svaki slucaj, da se uverimo da se stranica ucitala
    // await page.waitForResponse('https://conduit-api.bondaracademy.com/api/tags')

    // //saving the log state
    // await page.context().storageState({path: authFile})





    //authentication via API
    const response = await request.post('https://conduit-api.bondaracademy.com/api/users/login', {
        data: {
            "user":{"email":"lekizmaj@test.com","password":"welcome123"}
        }
    })
   

    const responseBody = await response.json()
    const accessToken = responseBody.user.token

    user.origins[0].localStorage[0].value = accessToken
    fs.writeFileSync(authFile, JSON.stringify(user))

    //making a ver in order to be available everywhere across the tests
    process.env['ACCESS_TOKEN'] = accessToken

    
})