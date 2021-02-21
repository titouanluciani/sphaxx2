require('dotenv').config()
const puppeteer = require('puppeteer')
const delay = require('./utils/delay')
const axios = require('axios')

export default async function(req,res){
    const browser = await puppeteer.launch({headless:false})
    const { cookies } = req.body
    const page = await browser.newPage()
    await page.goto("https://linkedin.com")
    await page.setCookie(...cookies)
    await page.goto("https://linkedin.com/feed")
    console.log("this is it")
    //?response_type=code&client_id=77imc7irvr2t7k&redirect_uri=https%3A%2F%2Fsphaxx.vercel.app%2F&scope=r_1st_connections%20r_compliance
    await page.goto('https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=77imc7irvr2t7k&redirect_uri=https%3A%2F%2Fsphaxx.vercel.app%2F&scope=r_1st_connections%20r_compliance')

    res.statusCode = 200
}